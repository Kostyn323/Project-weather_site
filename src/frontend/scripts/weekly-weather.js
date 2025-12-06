// Модуль для прогноза на неделю с графиком
class WeeklyWeather {
    constructor() {
        this.daysData = null;
        this.selectedDayIndex = 0; // По умолчанию выбран сегодня
        this.init();
    }
    
    init() {
        this.loadWeeklyData();
        this.setupEventListeners();
    }
    
    // Загрузка данных (заглушка)
    loadWeeklyData() {
        // Здесь позже будет запрос к API
        const daysOfWeek = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
        const dayNamesFull = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
        const today = new Date();
        
        this.daysData = daysOfWeek.map((dayName, index) => {
            const date = new Date();
            date.setDate(today.getDate() + index);
            
            const dateStr = date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit'
            });
            
            // Температурные данные для графика
            const tempMax = 15 + Math.floor(Math.random() * 10);
            const tempMin = tempMax - 5 - Math.floor(Math.random() * 3);
            
            // Почасовые температуры для графика
            const hourlyTemps = [];
            for (let i = 0; i < 8; i++) {
                hourlyTemps.push(tempMin + (tempMax - tempMin) * (i / 7) + (Math.random() * 2 - 1));
            }
            
            const conditions = ['☀️', '⛅', '☁️', '🌧️', '⛈️', '🌦️'];
            const conditionTexts = ['Ясно', 'Переменная облачность', 'Облачно', 'Дождь', 'Гроза', 'Небольшой дождь'];
            const conditionIndex = Math.floor(Math.random() * conditions.length);
            
            return {
                dayName: dayName,
                dayNameFull: dayNamesFull[index],
                date: dateStr,
                isToday: index === 0,
                tempMax: tempMax,
                tempMin: tempMin,
                hourlyTemps: hourlyTemps,
                icon: conditions[conditionIndex],
                condition: conditionTexts[conditionIndex],
                wind: (2 + Math.random() * 5).toFixed(1),
                humidity: Math.floor(50 + Math.random() * 40),
                precipitation: Math.floor(Math.random() * 80),
                pressure: Math.floor(1000 + Math.random() * 30),
                sunrise: '06:30',
                sunset: '20:45'
            };
        });
        
        this.renderWeeklyForecast();
        this.renderTemperatureChart();
        this.renderSelectedDayDetails();
    }
    
    // Отрисовка дней недели
    renderWeeklyForecast() {
        const container = document.getElementById('weeklyDays');
        if (!container || !this.daysData) return;
        
        container.innerHTML = '';
        
        this.daysData.forEach((day, index) => {
            const dayElement = document.createElement('div');
            dayElement.className = `weekly-day ${day.isToday ? 'today' : ''}`;
            dayElement.dataset.index = index;
            
            dayElement.innerHTML = `
                <div class="day-header">
                    <div class="day-name">${day.dayName}</div>
                    <div class="day-date">${day.date}</div>
                </div>
                <div class="day-icon">${day.icon}</div>
                <div class="day-temp-range">
                    <div class="temp-max">${day.tempMax}°</div>
                    <div class="temp-min">${day.tempMin}°</div>
                </div>
            `;
            
            // Выделяем выбранный день
            if (index === this.selectedDayIndex) {
                dayElement.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                dayElement.style.border = '2px solid rgba(255, 255, 255, 0.5)';
            }
            
            dayElement.addEventListener('click', () => {
                this.selectDay(index);
            });
            
            container.appendChild(dayElement);
        });
    }
    
    // Отрисовка графика температуры
    renderTemperatureChart() {
        const chartContainer = document.getElementById('temperatureChart');
        if (!chartContainer || !this.daysData) return;
        
        chartContainer.innerHTML = '';
        
        // Находим общие мин и макс для масштабирования
        const allTemps = this.daysData.flatMap(day => [day.tempMax, day.tempMin]);
        const minTemp = Math.min(...allTemps);
        const maxTemp = Math.max(...allTemps);
        const tempRange = maxTemp - minTemp || 1;
        
        // Создаем столбцы для каждого дня
        this.daysData.forEach((day, index) => {
            const column = document.createElement('div');
            column.className = 'temp-column';
            column.dataset.index = index;
            
            // Высота для максимальной температуры
            const maxHeightPercent = 20 + ((day.tempMax - minTemp) / tempRange) * 60;
            // Высота для минимальной температуры
            const minHeightPercent = 20 + ((day.tempMin - minTemp) / tempRange) * 60;
            
            column.innerHTML = `
                <div class="temp-bar temp-bar-max" style="height: ${maxHeightPercent}%"></div>
                <div class="temp-bar temp-bar-min" style="height: ${minHeightPercent}%"></div>
                <div class="temp-value">${day.tempMax}°</div>
            `;
            
            // Подсказка при наведении
            column.title = `${day.dayNameFull}: макс ${day.tempMax}°, мин ${day.tempMin}°`;
            
            // Выделяем выбранный день
            if (index === this.selectedDayIndex) {
                column.style.transform = 'scale(1.1)';
            }
            
            column.addEventListener('click', () => {
                this.selectDay(index);
            });
            
            chartContainer.appendChild(column);
        });
    }
    
    // Отрисовка деталей выбранного дня
    renderSelectedDayDetails() {
        const detailsContainer = document.getElementById('selectedDayDetails');
        if (!detailsContainer || !this.daysData || this.daysData.length === 0) return;
        
        const day = this.daysData[this.selectedDayIndex];
        
        detailsContainer.innerHTML = `
            <div class="day-details">
                <div class="day-detail">
                    <div class="detail-icon">💨</div>
                    <div class="detail-label">Ветер</div>
                    <div class="detail-value">${day.wind} м/с</div>
                </div>
                <div class="day-detail">
                    <div class="detail-icon">💧</div>
                    <div class="detail-label">Влажность</div>
                    <div class="detail-value">${day.humidity}%</div>
                </div>
                <div class="day-detail">
                    <div class="detail-icon">🌧️</div>
                    <div class="detail-label">Осадки</div>
                    <div class="detail-value">${day.precipitation}%</div>
                </div>
                <div class="day-detail">
                    <div class="detail-icon">📊</div>
                    <div class="detail-label">Давление</div>
                    <div class="detail-value">${day.pressure} гПа</div>
                </div>
                <div class="day-detail">
                    <div class="detail-icon">🌅</div>
                    <div class="detail-label">Восход</div>
                    <div class="detail-value">${day.sunrise}</div>
                </div>
                <div class="day-detail">
                    <div class="detail-icon">🌇</div>
                    <div class="detail-label">Закат</div>
                    <div class="detail-value">${day.sunset}</div>
                </div>
            </div>
        `;
    }
    
    // Выбор дня
    selectDay(index) {
        this.selectedDayIndex = index;
        this.renderWeeklyForecast();
        this.renderTemperatureChart();
        this.renderSelectedDayDetails();
    }
    
    setupEventListeners() {
        // Обработчик кнопки "Подробный прогноз"
        const viewDetailsBtn = document.getElementById('viewDetailsBtn');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedDay = this.daysData[this.selectedDayIndex];
                alert(`Подробный прогноз на ${selectedDay.dayNameFull} (${selectedDay.date}):\n\n` +
                      `Погода: ${selectedDay.condition} ${selectedDay.icon}\n` +
                      `Температура: ${selectedDay.tempMin}° - ${selectedDay.tempMax}°\n` +
                      `Ветер: ${selectedDay.wind} м/с\n` +
                      `Влажность: ${selectedDay.humidity}%\n` +
                      `Вероятность осадков: ${selectedDay.precipitation}%`);
            });
        }
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    window.weeklyWeather = new WeeklyWeather();
});