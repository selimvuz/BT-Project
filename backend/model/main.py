from flask import Flask, request, jsonify
from transformers import AutoModelForCausalLM, LlamaTokenizer, pipeline

app = Flask(__name__)

model_id = "Trendyol/Trendyol-LLM-7b-chat-v0.1"
tokenizer = LlamaTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id, device_map="auto", load_in_8bit=True)

pipe = pipeline("text-generation",
                model=model,
                tokenizer=tokenizer,
                device_map="auto",
                max_new_tokens=128,
                return_full_text=True,
                repetition_penalty=1.1)

DEFAULT_SYSTEM_PROMPT = ""


def generate_prompt(instruction, system_prompt=DEFAULT_SYSTEM_PROMPT):
    TEMPLATE = (
        "[INST] <<SYS>>\n"
        "{system_prompt}\n"
        "<</SYS>>\n\n"
        "{instruction} [/INST]"
    )
    return TEMPLATE.format_map({'instruction': instruction, 'system_prompt': system_prompt})


def generate_output(user_query, sys_prompt=DEFAULT_SYSTEM_PROMPT):
    prompt = generate_prompt(user_query, sys_prompt)
    outputs = pipe(prompt, **dict(do_sample=True,
                   temperature=0.3, top_k=50, top_p=0.9))
    return outputs[0]["generated_text"].split("[/INST]")[-1]


@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    user_query = data.get('query', '')
    response = generate_output(user_query)
    return jsonify({"response": response})


if __name__ == '__main__':
    app.run(debug=True)
