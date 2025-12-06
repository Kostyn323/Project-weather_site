// Модальное окно выбора города
class CityModal {
    constructor() {
        this.modal = document.getElementById('cityModal');
        this.searchInput = document.getElementById('citySearch');
        this.quickCitiesContainer = document.getElementById('quickCities');
        this.searchResultsContainer = document.getElementById('searchResults');
        this.currentCity = document.getElementById('cityName').textContent;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadQuickCities();
    }
    
    // Быстрый выбор городов (популярные города России)
    loadQuickCities() {
        const quickCities = [
            { name: 'Москва', country: 'Россия' },
            { name: 'Санкт-Петербург', country: 'Россия' },
            { name: 'Новосибирск', country: 'Россия' },
            { name: 'Екатеринбург', country: 'Россия' },
            { name: 'Казань', country: 'Россия' },
            { name: 'Нижний Новгород', country: 'Россия' },
            { name: 'Красноярск', country: 'Россия' },
            { name: 'Владивосток', country: 'Россия' }
        ];
        
        this.quickCitiesContainer.innerHTML = '';
        
        quickCities.forEach(city => {
            const button = document.createElement('button');
            button.className = `city-quick-btn ${city.name === this.currentCity ? 'current' : ''}`;
            button.textContent = city.name;
            button.dataset.city = city.name;
            
            button.addEventListener('click', () => {
                this.selectCity(city.name);
            });
            
            this.quickCitiesContainer.appendChild(button);
        });
    }
    
    // Открыть модальное окно
    open() {
        document.body.style.overflow = 'hidden'; // Блокируем прокрутку
        this.modal.classList.add('active');
        this.searchInput.value = '';
        this.clearSearchResults();
        this.searchInput.focus();
    }
    
    // Закрыть модальное окно
    close() {
        document.body.style.overflow = ''; // Разблокируем прокрутку
        this.modal.classList.remove('active');
        this.clearSearchResults();
    }
    
    // Выбрать город
    selectCity(cityName) {
        // Обновляем город в хедере
        document.getElementById('cityName').textContent = cityName;
        this.currentCity = cityName;
        
        // Обновляем выделение в быстром выборе
        document.querySelectorAll('.city-quick-btn').forEach(btn => {
            btn.classList.toggle('current', btn.dataset.city === cityName);
        });
        
        // Закрываем модальное окно
        this.close();
        
        // Здесь позже будет запрос к API для обновления погоды
        console.log('Выбран город:', cityName);
        
        // Если есть модуль погоды, обновляем данные
        if (window.weatherDisplay) {
            window.weatherDisplay.changeCity(cityName);
        }
        
        // Если есть модуль недельного прогноза, обновляем данные
        if (window.weeklyWeather) {
            window.weeklyWeather.loadWeeklyData();
        }
    }
    
    // Поиск городов (заглушка)
    searchCities(query) {
        if (!query.trim()) {
            this.clearSearchResults();
            return;
        }
        
        // Здесь позже будет запрос к API поиска городов
        // Пока используем заглушку
        
        const mockResults = [
            { name: `${query} (центральный)`, country: 'Россия' },
            { name: `${query} (северный)`, country: 'Россия' },
            { name: `${query} (южный)`, country: 'Россия' },
            { name: `Новый ${query}`, country: 'Россия' }
        ];
        
        this.displaySearchResults(mockResults);
    }
    
    // Отобразить результаты поиска
    displaySearchResults(results) {
        this.searchResultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            this.searchResultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <p>Город не найден. Попробуйте другой запрос.</p>
                </div>
            `;
            return;
        }
        
        results.forEach(city => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <div>
                    <div class="city-name-result">${city.name}</div>
                    <div class="city-country">${city.country}</div>
                </div>
                <i class="fas fa-chevron-right" style="opacity: 0.6;"></i>
            `;
            
            resultItem.addEventListener('click', () => {
                this.selectCity(city.name);
            });
            
            this.searchResultsContainer.appendChild(resultItem);
        });
    }
    
    // Очистить результаты поиска
    clearSearchResults() {
        this.searchResultsContainer.innerHTML = '';
    }
    
    // Настройка обработчиков событий
    setupEventListeners() {
        // Закрытие по кнопке
        document.getElementById('modalClose').addEventListener('click', () => {
            this.close();
        });
        
        // Закрытие по клику на overlay
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
        
        // Поиск при вводе
        this.searchInput.addEventListener('input', (e) => {
            this.searchCities(e.target.value);
        });
        
        // Поиск по нажатию Enter
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchCities(e.target.value);
            }
        });
        
        // Кнопка поиска
        document.querySelector('.search-button').addEventListener('click', () => {
            this.searchCities(this.searchInput.value);
        });
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    window.cityModal = new CityModal();
    
    // Обновляем обработчик клика на город в хедере
    const cityElement = document.getElementById('cityName');
    if (cityElement) {
        cityElement.addEventListener('click', () => {
            window.cityModal.open();
        });
    }
    
    // Удаляем старый обработчик из city.js если он есть
    const oldCityScript = document.querySelector('script[src="scripts/city.js"]');
    if (oldCityScript) {
        oldCityScript.remove();
    }
});

// Модальное окно настроек
class SettingsModal {
    constructor() {
        this.modal = document.getElementById('settingsModal');
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.setupEventListeners();
    }
    
    // Загрузить сохранённые настройки
    loadSettings() {
        // Загружаем из localStorage или используем значения по умолчанию
        const settings = JSON.parse(localStorage.getItem('weatherSettings')) || {
            theme: 'day',
            tempUnit: 'celsius',
            windUnit: 'mps',
            pressureUnit: 'hpa',
            autoUpdate: true,
            notifications: false,
            geolocation: false
        };
        
        // Устанавливаем значения в форму
        document.getElementById('theme-' + settings.theme).checked = true;
        document.getElementById('tempUnit').value = settings.tempUnit;
        document.getElementById('windUnit').value = settings.windUnit;
        document.getElementById('pressureUnit').value = settings.pressureUnit;
        document.getElementById('autoUpdate').checked = settings.autoUpdate;
        document.getElementById('notifications').checked = settings.notifications;
        document.getElementById('geolocation').checked = settings.geolocation;
        
        // Применяем тему
        this.applyTheme(settings.theme);
    }
    
    // Сохранить настройки
    saveSettings() {
        const settings = {
            theme: document.querySelector('input[name="theme"]:checked').value,
            tempUnit: document.getElementById('tempUnit').value,
            windUnit: document.getElementById('windUnit').value,
            pressureUnit: document.getElementById('pressureUnit').value,
            autoUpdate: document.getElementById('autoUpdate').checked,
            notifications: document.getElementById('notifications').checked,
            geolocation: document.getElementById('geolocation').checked
        };
        
        // Сохраняем в localStorage
        localStorage.setItem('weatherSettings', JSON.stringify(settings));
        
        // Применяем изменения
        this.applyTheme(settings.theme);
        
        // Показываем уведомление
        this.showNotification('Настройки сохранены!');
        
        // Закрываем модальное окно
        this.close();
    }
    
    // Сбросить настройки
    resetSettings() {
        // Показываем окно подтверждения
        document.getElementById('resetConfirm').classList.add('show');
    }
    
    // Подтвердить сброс настроек
    confirmReset() {
        // Очищаем localStorage
        localStorage.removeItem('weatherSettings');
        
        // Сбрасываем форму к значениям по умолчанию
        document.getElementById('theme-day').checked = true;
        document.getElementById('tempUnit').value = 'celsius';
        document.getElementById('windUnit').value = 'mps';
        document.getElementById('pressureUnit').value = 'hpa';
        document.getElementById('autoUpdate').checked = true;
        document.getElementById('notifications').checked = false;
        document.getElementById('geolocation').checked = false;
        
        // Применяем тему по умолчанию
        this.applyTheme('day');
        
        // Скрываем окно подтверждения
        document.getElementById('resetConfirm').classList.remove('show');
        
        // Показываем уведомление
        this.showNotification('Настройки сброшены!');
    }
    
    // Отменить сброс настроек
    cancelReset() {
        document.getElementById('resetConfirm').classList.remove('show');
    }
    
    // Применить тему
    applyTheme(theme) {
        document.body.className = theme + '-theme';
        
        // Обновляем CSS переменные для темы
        const root = document.documentElement;
        
        if (theme === 'night') {
            root.style.setProperty('--bg-color', '#0a1a2d');
            root.style.setProperty('--block-color', '#1a3a5f');
            root.style.setProperty('--text-color', '#cce0ff');
        } else {
            root.style.setProperty('--bg-color', '#3c9dd0');
            root.style.setProperty('--block-color', '#006aa3');
            root.style.setProperty('--text-color', '#d2e9ff');
        }
    }
    
    // Показать уведомление
    showNotification(message) {
        // Создаём элемент уведомления
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4a90e2, #63b3ed);
            color: white;
            padding: 15px 25px;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            animation: slideIn 0.3s;
            font-weight: 500;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Удаляем через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
        
        // Добавляем стили для анимации
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Открыть модальное окно
    open() {
        document.body.style.overflow = 'hidden';
        this.modal.classList.add('active');
        this.loadSettings(); // Загружаем актуальные настройки
    }
    
    // Закрыть модальное окно
    close() {
        document.body.style.overflow = '';
        this.modal.classList.remove('active');
        // Скрываем окно подтверждения сброса, если оно открыто
        document.getElementById('resetConfirm').classList.remove('show');
    }
    
    // Настройка обработчиков событий
    setupEventListeners() {
        // Закрытие по кнопке
        document.getElementById('settingsModalClose').addEventListener('click', () => {
            this.close();
        });
        
        // Закрытие по клику на overlay
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
        
        // Сохранение настроек
        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });
        
        // Сброс настроек
        document.getElementById('resetSettings').addEventListener('click', () => {
            this.resetSettings();
        });
        
        // Подтверждение сброса
        document.getElementById('confirmReset').addEventListener('click', () => {
            this.confirmReset();
        });
        
        // Отмена сброса
        document.getElementById('cancelReset').addEventListener('click', () => {
            this.cancelReset();
        });
        
        // Сохранение по Ctrl+S
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's' && this.modal.classList.contains('active')) {
                e.preventDefault();
                this.saveSettings();
            }
        });
        
        // Предпросмотр темы при выборе
        document.querySelectorAll('input[name="theme"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                // Только предпросмотр, не сохраняем
                this.applyTheme(e.target.value);
            });
        });
    }
}

// Обновим инициализацию в modals.js
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем модальное окно города
    window.cityModal = new CityModal();
    
    // Инициализируем модальное окно настроек
    window.settingsModal = new SettingsModal();
    
    // Обновляем обработчик клика на город в хедере
    const cityElement = document.getElementById('cityName');
    if (cityElement) {
        cityElement.addEventListener('click', () => {
            window.cityModal.open();
        });
    }
    
    // Обновляем обработчик кнопки настроек
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            window.settingsModal.open();
        });
    }
    
    // Удаляем старый обработчик из main.js если он есть
    const oldSettingsHandler = document.querySelector('#settingsBtn[onclick]');
    if (oldSettingsHandler) {
        oldSettingsHandler.removeAttribute('onclick');
    }
});


// Модальное окно ИИ рекомендаций
class AIModal {
    constructor() {
        this.modal = document.getElementById('aiModal');
        this.aiLoading = document.getElementById('aiLoading');
        this.aiContent = document.getElementById('aiContent');
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    // Открыть модальное окно с загрузкой
    open() {
        document.body.style.overflow = 'hidden';
        this.modal.classList.add('active');
        
        // Показываем загрузку, скрываем контент
        this.aiLoading.style.display = 'block';
        this.aiContent.style.display = 'none';
        
        // Симулируем загрузку данных (2 секунды)
        setTimeout(() => {
            this.generateRecommendations();
            this.aiLoading.style.display = 'none';
            this.aiContent.style.display = 'block';
        }, 2000);
    }
    
    // Закрыть модальное окно
    close() {
        document.body.style.overflow = '';
        this.modal.classList.remove('active');
    }
    
    // Сгенерировать рекомендации (заглушка с разными вариантами)
    generateRecommendations() {
        const weatherData = this.getCurrentWeatherData();
        const recommendation = this.generateAIRecommendation(weatherData);
        
        // Обновляем основной текст рекомендации
        document.getElementById('aiMainRecommendation').textContent = recommendation.main;
        
        // Обновляем контекст погоды
        document.getElementById('aiContextTemp').textContent = 
            `${weatherData.temp}° (ощущается как ${weatherData.feelsLike}°)`;
        document.getElementById('aiContextWind').textContent = 
            `Ветер: ${weatherData.wind} м/с`;
        document.getElementById('aiContextPrecip').textContent = 
            `Вероятность осадков: ${weatherData.precipitation}%`;
        
        // Обновляем погодные факторы
        this.updateWeatherFactors(weatherData);
        
        // Обновляем рекомендации по категориям
        this.updateClothingRecommendations(recommendation.clothing);
        this.updateAccessoriesRecommendations(recommendation.accessories);
        this.updateAdditionalTips(recommendation.additionalTips);
    }
    
    // Получить текущие погодные данные (заглушка)
    getCurrentWeatherData() {
        // В реальном приложении здесь будет запрос к API
        return {
            temp: 18,
            feelsLike: 17,
            wind: 3.5,
            precipitation: 10,
            humidity: 65,
            uvIndex: 3,
            condition: 'Ясно',
            icon: '☀️'
        };
    }
    
    // Сгенерировать ИИ рекомендацию
    generateAIRecommendation(weatherData) {
        const recommendations = [
            {
                main: "Наденьте лёгкую куртку, сегодня прохладный ветер.",
                clothing: ["Футболка с длинным рукавом", "Лёгкая ветровка", "Джинсы", "Кроссовки"],
                accessories: ["Солнечные очки", "Кепка"],
                additionalTips: ["Возьмите бутылку воды", "Используйте увлажняющий крем"]
            },
            {
                main: "Идеальный день для футболки и джинсов.",
                clothing: ["Футболка", "Джинсы", "Кроссовки", "Лёгкая кофта на вечер"],
                accessories: ["Солнечные очки", "Рюкзак"],
                additionalTips: ["Отличный день для прогулок", "Запланируйте активный отдых"]
            },
            {
                main: "Возьмите зонт, возможен дождь во второй половине дня.",
                clothing: ["Водоотталкивающая куртка", "Джинсы", "Непромокаемая обувь"],
                accessories: ["Зонт", "Дождевик"],
                additionalTips: ["Проверьте прогноз на вечер", "Планируйте мероприятия в помещении"]
            },
            {
                main: "Солнечно! Наденьте солнечные очки и головной убор.",
                clothing: ["Шорты", "Футболка", "Шлёпанцы"],
                accessories: ["Солнечные очки", "Панама", "Солнцезащитный крем"],
                additionalTips: ["Избегайте длительного пребывания на солнце", "Пейте больше воды"]
            },
            {
                main: "Прохладный вечер, возьмите тёплую кофту.",
                clothing: ["Тёплая кофта", "Брюки", "Закрытая обувь"],
                accessories: ["Шарф", "Перчатки"],
                additionalTips: ["Планируйте вечерние мероприятия в помещении", "Горячий чай будет кстати"]
            }
        ];
        
        // Выбираем случайную рекомендацию
        const randomIndex = Math.floor(Math.random() * recommendations.length);
        return recommendations[randomIndex];
    }
    
    // Обновить погодные факторы
    updateWeatherFactors(weatherData) {
        const factorsGrid = document.getElementById('aiFactors');
        factorsGrid.innerHTML = '';
        
        const factors = [
            { icon: '🌡️', label: 'Температура', value: `${weatherData.temp}°` },
            { icon: '💨', label: 'Ветер', value: `${weatherData.wind} м/с` },
            { icon: '💧', label: 'Влажность', value: `${weatherData.humidity}%` },
            { icon: '☀️', label: 'UV индекс', value: weatherData.uvIndex },
            { icon: '🌧️', label: 'Осадки', value: `${weatherData.precipitation}%` },
            { icon: '🌤️', label: 'Состояние', value: weatherData.condition }
        ];
        
        factors.forEach(factor => {
            const factorElement = document.createElement('div');
            factorElement.className = 'factor-item';
            factorElement.innerHTML = `
                <div class="factor-icon">${factor.icon}</div>
                <div class="factor-value">${factor.value}</div>
                <div class="factor-label">${factor.label}</div>
            `;
            factorsGrid.appendChild(factorElement);
        });
    }
    
    // Обновить рекомендации по одежде
    updateClothingRecommendations(clothingItems) {
        const clothingList = document.getElementById('aiClothing');
        clothingList.innerHTML = '';
        
        clothingItems.forEach(item => {
            const li = document.createElement('li');
            li.className = 'recommendation-item';
            li.textContent = item;
            clothingList.appendChild(li);
        });
    }
    
    // Обновить рекомендации по аксессуарам
    updateAccessoriesRecommendations(accessories) {
        const accessoriesList = document.getElementById('aiAccessories');
        accessoriesList.innerHTML = '';
        
        accessories.forEach(item => {
            const li = document.createElement('li');
            li.className = 'recommendation-item';
            li.textContent = item;
            accessoriesList.appendChild(li);
        });
    }
    
    // Обновить дополнительные советы
    updateAdditionalTips(tips) {
        const tipsList = document.getElementById('aiAdditionalTips');
        tipsList.innerHTML = '';
        
        tips.forEach(tip => {
            const li = document.createElement('li');
            li.className = 'recommendation-item';
            li.textContent = tip;
            tipsList.appendChild(li);
        });
    }
    
    // Поделиться рекомендацией
    shareRecommendation() {
        const mainText = document.getElementById('aiMainRecommendation').textContent;
        const shareText = `🤖 ИИ рекомендует: ${mainText} #КостикПогода #ИИРекомендации`;
        
        if (navigator.share) {
            navigator.share({
                title: 'ИИ Рекомендация по погоде',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Копируем в буфер обмена
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Рекомендация скопирована в буфер обмена!');
            });
        }
    }
    
    // Показать уведомление
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4a90e2, #63b3ed);
            color: white;
            padding: 15px 25px;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            animation: slideIn 0.3s;
            font-weight: 500;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Настройка обработчиков событий
    setupEventListeners() {
        // Закрытие по клику на overlay
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
        
        // Кнопка новых рекомендаций
        document.getElementById('aiRefresh').addEventListener('click', () => {
            this.open(); // Переоткрываем с новой загрузкой
        });
        
        // Кнопка поделиться
        document.getElementById('aiShare').addEventListener('click', () => {
            this.shareRecommendation();
        });
    }
}

// Обновим инициализацию в modals.js
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем все модальные окна
    window.cityModal = new CityModal();
    window.settingsModal = new SettingsModal();
    window.aiModal = new AIModal();
    
    // Обновляем обработчик клика на город
    const cityElement = document.getElementById('cityName');
    if (cityElement) {
        cityElement.addEventListener('click', () => {
            window.cityModal.open();
        });
    }
    
    // Обновляем обработчик кнопки настроек
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            window.settingsModal.open();
        });
    }
    
    // Обновляем обработчик кнопки ИИ рекомендаций
    const aiBtn = document.getElementById('aiRecommendationBtn');
    if (aiBtn) {
        aiBtn.addEventListener('click', () => {
            window.aiModal.open();
        });
    }
    
    // Удаляем старые обработчики
    const oldMainScript = document.querySelector('script[src="scripts/main.js"]');
    if (oldMainScript) {
        // Заменяем старый main.js
        const aiBtnOld = document.getElementById('aiRecommendationBtn');
        if (aiBtnOld) {
            aiBtnOld.replaceWith(aiBtnOld.cloneNode(true));
        }
    }
});