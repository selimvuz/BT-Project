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


def generate_output(user_query, label=""):
    prompt = f"{label} {user_query}" if label else user_query
    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(**inputs, max_length=124, num_return_sequences=1)
    response_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    # Dinamik olarak first_len ayarlama
    if label:
        first_len = len(label) + len(user_query) + 1  # 1 boşluk karakteri için
    else:
        first_len = len(user_query)
    
    return response_text[first_len:]

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    user_query = data.get('query', '')
    label = data.get('label', '')
    response = generate_output(user_query, label)
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True)
