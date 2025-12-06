from fastapi import FastAPI, Cookie, Response, HTTPException, Request, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import localization.txt

from routes import users


app = FastAPI()

app.include_router(users.router)

templates = Jinja2Templates(directory='templates')
app.mount('/static', StaticFiles(directory='static'), name='static')

# Выбор города ---
# Просмотр погоды (сделать вывод данных в WorldWeatherMap)
# Предложение выбора одежды (подключить нейронку)
# Выбор языка
# Выбор темы ---
# Выбор часового формата
# Выбор единиц измерения (цельсий, кельвин, фаренгейт)
# Выбор скорости ветра (метры в секунду, мили в час)



#app.add_middleware(
#    CORSMiddleware,
#    allow_origins=["*"],
#    allow_credentials=True,
#    allow_methods=["*"],
#    allow_headers=["*"],
#)

# список городов
#========================================================================================
CITIES = ["Владивосток", "Санкт-Петербург", "Москва", "Благовещенск","Хабаровск", "Артем"]


def find_cities_advanced(query: str) -> List[str]:
    # приведение символов введенных пользователем к маленькому регистру
    query = query.lower().strip()
    # проверка на длину введенных пользователем символов
    if not query or len(query) < 2:
        return []

    suggestions = []

    # перебор
    for city in CITIES:
        # приведение к маленькому регистру символов
        city_lower = city.lower()

        # приоритет 1: города, которые начинаются с введенных пользователем символов
        if city_lower.startswith(query):
            suggestions.append((city, 1))
        # приоритет 2: города, которые содержат введенные пользователем символы
        elif query in city_lower:
            suggestions.append((city, 2))
        # приоритет 3: города с похожим началом
        elif any(city_lower.startswith(prefix) for prefix in [query[:3], query[:4]] if len(query) > 2):
            suggestions.append((city, 3))

    # сортировка кортежей найденных городов по приоритету и длине названия городов
    suggestions.sort(key=lambda x: (x[1], len(x[0])))

    # возвращаем только названия городов
    return [city for city, priority in suggestions[:10]]

# HTTP запрос на функцию с обработкой введенного текста и поиску городов, где q = введенные пользователем символы
@app.get("/api/cities", response_model=List[str])
def get_city_suggestions(q: str = ""):
    # проверка на то, чтобы длина символов была больше 2, для хоть какой то точности поиска городов и разгрузки программы
    if len(q) < 2:
        return []
    # функция поиска городов
    suggestions = find_cities_advanced(q)
    return suggestions
#===========================================================================================



# смена темы
#===========================================================================================
class ThemeRequest(BaseModel):
    theme: str


# на будущее для сохранения тем по юзеру, пока без БД
# user_themes = {}


@app.get("/", response_class=HTMLResponse)
def read_root(request: Request, theme: Optional[str] = Cookie(default=None)):
    # если усть кука, то возвращаем ее, иначе стандартную тему light
    current_theme = theme or "light"

    return templates.TemplateResponse(
        "index.html",
        {"request": request, "theme": current_theme}
    )


# сохраняем куку и возвращаем ответ с темой, но не саму тему фронтенду
@app.post("/api/theme")
def set_theme(theme_data: ThemeRequest, response: Response):
    # куки на неделю
    response.set_cookie(
        key="theme",
        value=theme_data.theme,
        max_age=7 * 24 * 60 * 60,
        httponly=True,
        samesite="lax"
    )

    # На будущее, для сохранения тем по юзеру, пока без БД
    # user_themes["current_user"] = theme_data.theme

    # ответ
    return {"status": "success", "theme": theme_data.theme}

# а здесь уже возвращаем тему фронтенду
@app.get("/api/theme")
def get_theme(theme: Optional[str] = Cookie(default=None)):
    return {"theme": theme or "light"}
#============================================================================================
