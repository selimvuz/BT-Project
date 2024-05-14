from transformers import AutoTokenizer, AutoModelForCausalLM

# Tokenizer ve fine-tune edilmiş modeli yükle
model_name = "./Epoch_v0.2"
tokenizer_name = "./Epoch_v0.2" 
tokenizer = AutoTokenizer.from_pretrained(tokenizer_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Fonksiyon tanımlama
def soruya_yanit_ver(etiket, soru):
    girdi = f"{etiket}:{soru}"
    inputs = tokenizer(girdi, return_tensors="pt")
    outputs = model.generate(**inputs, max_length=100, num_return_sequences=1)
    yanit = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return yanit

# Örnek sorular
etiket = "Sokrates"
soru = "Bilgi nedir?"
print(f"Soru: {etiket}: {soru}")
print("Yanıt:", soruya_yanit_ver(etiket, soru))

etiket = "Şaka Ustası Leo"
soru = "Python hakkında ne düşünüyorsun?"
print(f"\nSoru: {etiket}: {soru}")
print("Yanıt:", soruya_yanit_ver(etiket, soru))

etiket = "Gelecekten Bir Yolcu"
soru = "Yapay zeka nereye gidiyor?"
print(f"\nSoru: {etiket}: {soru}")
print("Yanıt:", soruya_yanit_ver(etiket, soru))