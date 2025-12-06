// Функция для создания графика
function renderHourlyChart() {
    const chartContainer = document.getElementById('hourlyChart');
    if (!chartContainer) return;
    
    // Заглушка данных
    const hourlyData = [
        { time: "00:00", temp: 15, icon: "🌙" },
        { time: "03:00", temp: 14, icon: "🌙" },
        { time: "06:00", temp: 15, icon: "⛅" },
        { time: "09:00", temp: 17, icon: "☀️" },
        { time: "12:00", temp: 20, icon: "☀️" },
        { time: "15:00", temp: 22, icon: "☀️" },
        { time: "18:00", temp: 19, icon: "🌤️" },
        { time: "21:00", temp: 17, icon: "🌙" }
    ];
    
    // Очищаем контейнер
    chartContainer.innerHTML = '';
    
    // Находим мин и макс для масштабирования
    const temps = hourlyData.map(h => h.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const tempRange = maxTemp - minTemp || 1;
    
    // Создаем колонки
    hourlyData.forEach(hour => {
        const heightPercent = 30 + ((hour.temp - minTemp) / tempRange) * 60;
        
        const hourElement = document.createElement('div');
        hourElement.className = 'chart-hour';
        hourElement.innerHTML = `
            <div class="chart-temp">${hour.temp}°</div>
            <div class="chart-bar" style="height: ${heightPercent}%"></div>
            <div class="chart-time">${hour.time}</div>
            <div class="chart-icon">${hour.icon}</div>
        `;
        
        chartContainer.appendChild(hourElement);
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    renderHourlyChart();
});