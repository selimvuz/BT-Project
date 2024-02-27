export const fetchWeather = async (lat, lon) => {
    try {
        const response = await fetch('http://localhost:3001/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: "Bugün hava nasıl?", lat, lon }),
        });
        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Hava durumunu alırken hata:', error);
        return { success: false, error: "Üzgünüm ama hava durumu bilgilerini alırken bir sorun oluştu." };
    }
};
