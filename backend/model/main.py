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
                max_new_tokens=1024,
                return_full_text=True,
                repetition_penalty=1.1)

# Sistemin promptunu ve kullanıcı diyaloglarını saklayacak bir değişken
dialog_history = ""


def generate_prompt(instruction, system_prompt="Sen yardımcı bir asistansın ve sana verilen talimatlar doğrultusunda en iyi cevabı üretmeye çalışacaksın."):
    TEMPLATE = (
        "[INST] <<SYS>>\n"
        "{system_prompt}\n"
        "<</SYS>>\n\n"
        "{instruction} [/INST]"
    )
    return TEMPLATE.format_map({'instruction': instruction, 'system_prompt': system_prompt})


def generate_output(user_query, sys_prompt=""):
    global dialog_history
    prompt = generate_prompt(user_query, sys_prompt)
    outputs = pipe(prompt, **dict(do_sample=True,
                   temperature=0.3, top_k=50, top_p=0.9))
    response_text = outputs[0]["generated_text"].split("[/INST]")[-1]

    # Diyalog geçmişini güncelle
    dialog_history += f"\Kullanıcı: {user_query}\Yapay Zeka: {response_text}"
    return response_text


@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    user_query = data.get('query', '')
    response = generate_output(user_query, dialog_history)
    return jsonify({"response": response})


if __name__ == '__main__':
    app.run(debug=True)
