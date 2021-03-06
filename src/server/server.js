require('dotenv').config();
const fetch = require('node-fetch');

const {Film} = require('../models/models');
const BASE_URL = "https://api.themoviedb.org/3";
const PAGE = "1";
const OPTIONS = {
    "method": "GET"
};

// Получить популярные фильмы
async function getPopularFilms(bot, chatId, PAGE) {
    const response = await fetch(
        `${BASE_URL}/movie/popular?api_key=${process.env.API_KEY}&language=ru-RU%3DRU&page=${PAGE}&region=ru`, OPTIONS)
        .then(async res => res.json())
        .then(async data => data.results)
        .catch(e => {
            console.log(e);
        });

    html = response.map((f, i) => {
        return `<b>${i + 1})</b> ${f.title} - /details${f.id}`
    }).join('\n');

    sendHTML(bot, chatId, html);
}

async function getTopFilms(bot, chatId, PAGE) {
    const response = await fetch(
        `${BASE_URL}/movie/top_rated?api_key=${process.env.API_KEY}&language=ru-RU%3DRU&page=${PAGE}&region=ru`, OPTIONS)
        .then(async res => res.json())
        .then(async data => data.results)
        .catch(e => {
            console.log(e);
        });

    html = response.map((f, i) => {
        return `<b>${i + 1})</b> ${f.title} - /details${f.id}`
    }).join('\n');

    sendHTML(bot, chatId, html);
}

// Получить фильм по ID
async function getFilmById(bot, chatId, id) {
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${process.env.API_KEY}&language=ru-RU`, OPTIONS)
        .then(async res => res.json())
        .catch(e => {
            console.log(e);
        });

    sendFilm(bot, chatId, response)
}

// Получить фильмы по названию
async function getFilmByTitle(bot, chatId, title) {
    const encodeTitle = encodeURIComponent(title)
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${process.env.API_KEY}&language=ru-RU&query=${encodeTitle}&page=1&include_adult=false`, OPTIONS)
        .then(async res => res.json())
        .then(async data => data.results)
        .catch(e => {
            console.log(e);
        });

    html = response.map((f, i) => {
        return `<b>${i + 1})</b> ${f.title} - /details${f.id}`
    }).join('\n');

    sendHTML(bot, chatId, html);
}

// Поиск по жанрам
async function getFilmsByGenres(bot, chatId, genre) {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${process.env.API_KEY}&language=ru-RU&with_genres=${genre}`, OPTIONS)
        .then(async res => res.json())
        .then(async data => data.results)
        .catch(e => {
            console.log(e);
        });

    html = response.map((f, i) => {
        return `<b>${i + 1})</b> ${f.title} - /details${f.id}`
    }).join('\n');

    sendHTML(bot, chatId, html);

    console.log(response);
}

function sendHTML(bot, chatId, html) {
    const options = {
        parse_mode: 'HTML'
    };

    bot.sendMessage(chatId, html, options);
}

function sendFilm(bot, chatId, response) {
    imageURL = response.poster_path;
    genres = response.genres.map((el) => el.name).join(', ');
    countries = response.production_countries.map((el) => el.name).join(', ');
    caption = `Название: ${response.title}\nСтрана(ы): ${countries}\nЖанр: ${genres}\nПродолжительность: ${response.runtime} минут\nДата релиза: ${response.release_date}\nОписание: ${response.overview}\nРейтинг: ${response.vote_average}`;

    bot.sendPhoto(chatId, `https://image.tmdb.org/t/p/w500/${imageURL}`, {
        caption: caption,
        /*reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Сохранить фильм', callback_data: 'saveFilm' }]
            ]
        })*/
    });
}


async function saveFilm(bot) {
    bot.on('callback_query', query => {
        const {chat} = query.message;


        switch (query.data) {
            // Top
            case "saveFilm":
                const film = Film.findOne({where: {filmId}});
                break;
        }

        bot.answerCallbackQuery({
            callback_query_id: query.id
        })
    });
}





module.exports = {getPopularFilms, getFilmById, getFilmByTitle, getTopFilms, getFilmsByGenres, saveFilm};