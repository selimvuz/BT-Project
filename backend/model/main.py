from flask import Flask, request, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
import torch

app = Flask(__name__)

model_id = "./Epoch_v0.2"
device = "cuda" if torch.cuda.is_available() else "cpu"

model = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    load_in_8bit=True
)
tokenizer = AutoTokenizer.from_pretrained(model_id)

pipe = pipeline("text-generation",
                model=model,
                tokenizer=tokenizer,
                max_new_tokens=1024,
                return_full_text=True,
                repetition_penalty=1.1)

def generate_prompt(instruction, system_prompt=""):
    TEMPLATE = (
        "[INST] <<SYS>>\n"
        "{system_prompt}\n"
        "<</SYS>>\n\n"
        "{instruction} [/INST]"
    )
    return TEMPLATE.format_map({'instruction': instruction, 'system_prompt': system_prompt})

def generate_output(user_query, label=""):
    prompt = f"{label} {user_query}" if label else user_query
    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(**inputs, max_length=64, num_return_sequences=1)
    response_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response_text

def clean_response(response_text, user_query, label):
    # User query'yi ve etiketi yanıtın başından çıkar
    full_query = f"{label} {user_query}".strip()
    if response_text.startswith(full_query):
        return response_text[len(full_query):].strip()
    return response_text

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    user_query = data.get('query', '')
    label = data.get('label', '')
    response = generate_output(user_query, label)
    cleaned_response = clean_response(response, user_query, label)
    return jsonify({"response": cleaned_response})

if __name__ == '__main__':
    app.run(debug=True)
