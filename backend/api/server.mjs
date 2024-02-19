import express from 'express';
import cors from 'cors';
import getWeather from './getWeather.mjs';

const app = express();

const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
const today = new Date();
const dayName = days[today.getDay()];
const date = today.getDate();
const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const month = monthNames[today.getMonth()]; // Ay ismini al
const year = today.getFullYear();

app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL'i ile değiştirin.
    credentials: true,
}));
app.use(express.json());

app.post('/chat', async (req, res) => {
    const { message, lat, lon } = req.body;

    if (message.includes("hava") && lat && lon) {
        try {
            const weatherConditionsTR = {
                "Sunny": "güneşli",
                "Clear": "açık",
                "Partly cloudy": "parçalı bulutlu",
                "Cloudy": "bulutlu",
                "Overcast": "kapalı",
                "Mist": "sisli",
                "Patchy rain possible": "yer yer yağmurlu",
                "Moderate rain": "orta şiddetli yağmurlu",
                "Heavy rain": "şiddetli yağmurlu",
                // Diğer hava durumu durumlarını buraya ekleyin
            };

            function translateWeatherCondition(condition) {
                return weatherConditionsTR[condition] || "Bilinmiyor"; // Eşleşme bulunamazsa "Bilinmiyor" döner
            }

            const weatherData = await getWeather(lat, lon);
            let weatherAdvice = ""; // Kullanıcılara verilecek öneri metnini saklayacak değişken
            const tempC = weatherData.current.temp_c; // Mevcut hava sıcaklığı (Celsius olarak)
            const apiWeatherCondition = weatherData.current.condition.text
            const weatherConditionTR = translateWeatherCondition(apiWeatherCondition);

            if (tempC <= 0) {
                weatherAdvice = "Hava oldukça soğuk. Sıkı giyinin ve mümkünse dışarıya çıkmayın.";
            } else if (tempC > 0 && tempC <= 10) {
                weatherAdvice = "Hava serin. Kalın giysiler giymeyi unutmayın.";
            } else if (tempC > 10 && tempC <= 20) {
                weatherAdvice = "Hava ılıman. Hafif bir ceket ya da kazak yeterli olacaktır.";
            } else if (tempC > 20 && tempC <= 30) {
                weatherAdvice = "Hava sıcak. Hafif kıyafetler giyin ve güneş kremi kullanmayı unutmayın.";
            } else if (tempC > 30) {
                weatherAdvice = "Hava çok sıcak. Bol sıvı tüketin, güneşin altında fazla kalmaktan kaçının.";
            }
            const responseMessage = `Bugün ${date} ${month} ${year} ${dayName}. Mevcut konumunuzun ${weatherData.location.name} olduğunu gözlemliyorum. Hava durumu ${weatherConditionTR} ve sıcaklık ${weatherData.current.temp_c}°C. ${weatherAdvice}\n\nYardımcı olabileceğim farklı bir konu var mı?`;
            res.json({ reply: responseMessage });
        } catch (error) {
            res.json({ reply: "Üzgünüm ama hava durumu bilgilerini alırken bir sorun oluştu." });
        }
    } else {
        res.json({ reply: "Buna nasıl yanıt vereceğimden emin değilim." });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
