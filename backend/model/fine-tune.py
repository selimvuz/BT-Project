import pandas as pd
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments
from peft import LoraConfig, get_peft_model, TaskType
from trl import SFTTrainer

# Veri kümesini yükle
df = pd.read_csv('karakterler.csv', quotechar='"')
df['text'] = df.apply(
    lambda row: f"{row['etiket']}:{row['soru']}\n{row['cevap']}", axis=1)
dataset = Dataset.from_pandas(df[['text']])

# Tokenizer ve model yükle
model_name = "Trendyol/Trendyol-LLM-7b-chat-v1.0"
tokenizer = AutoTokenizer.from_pretrained(model_name)

# 8-bit quantized modeli yükle
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    load_in_8bit=True,
    device_map="auto"
)

# LoRA yapılandırması ve model adaptasyonu
lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=8,
    lora_alpha=32,
    lora_dropout=0.1,
    bias="none",
    target_modules=["q_proj", "v_proj"]
)
model = get_peft_model(model, lora_config)

# Veri kümesini tokenize et
def tokenize_function(examples):
    return tokenizer(examples["text"], padding="max_length", truncation=True)

tokenized_dataset = dataset.map(tokenize_function, batched=True)

# Eğitim argümanları
training_args = TrainingArguments(
    output_dir="./results",
    overwrite_output_dir=True,
    per_device_train_batch_size=1,
    gradient_accumulation_steps=32,
    num_train_epochs=3,
    save_steps=10_000,
    save_total_limit=2,
    logging_steps=10,
    logging_dir='./logs',
    learning_rate=2e-5,
    bf16=True,
    optim="adamw_torch",
    report_to="none",
)

# Trainer oluşturma
trainer = SFTTrainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset,
    dataset_text_field="text",
    max_seq_length=512,
)

# Eğitimi başlat
trainer.train()

# Modeli ve tokenizer'ı kaydet
model.save_pretrained("./Epoch_model")
tokenizer.save_pretrained("./Epoch_tokenizer")