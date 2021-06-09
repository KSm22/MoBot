require('dotenv').config();
const fetch = require('node-fetch');
const TelegramBot = require('node-telegram-bot-api');
const {getPopularFilms, getFilmById, getFilmByTitle, getTopFilms} = require('./server');
const keyboard = require('./keyboard')
const kb = require('./keyboard-btns');

const TOKEN = process.env.TOKEN;
const bot = new TelegramBot(TOKEN, {
    polling: true
});

bot.on('message', msg => {
    const chatId = msg.chat.id;
    switch (msg.text) {
        case kb.films.popular:
            getPopularFilms(bot, chatId);
            break;
        case kb.films.top:
            getTopFilms(bot, chatId);

            break
    }
})

bot.onText(/\/start/, msg => {
    const chatId = msg.chat.id;
    const text = `Здравствуйте, ${msg.from.first_name}\nВыберите команду для начала работы`

    bot.sendMessage(chatId, text, {
        reply_markup: {
            keyboard: keyboard.keyboard
        }
    })
});


bot.onText(/\/details(.+)/, async (msg, [source, match]) => {
    const chatId = msg.chat.id;
    const filmId = source.substr(8, source.length);

    getFilmById(bot, chatId, filmId);
});

bot.onText(/\/find(.+)/, async (msg, [source, match]) => {
    const chatId = msg.chat.id;
    const filmTitle = source.substr(6, source.length);
    console.log(match);

    getFilmByTitle(bot, chatId, filmTitle);
});

