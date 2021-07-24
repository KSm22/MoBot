require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const {getPopularFilms, getFilmById, getFilmByTitle, getTopFilms, getFilmsByGenres} = require('./server/server');
const keyboard = require('./keyboard/keyboard');
const kb = require('./keyboard/keyboard-btns');

const TOKEN = process.env.TOKEN;
const bot = new TelegramBot(TOKEN, {
    polling: true
});

bot.on('message', msg => {
    const chatId = msg.chat.id;
    switch (msg.text) {
        case kb.films.popular:
            getPopularFilms(bot, chatId);
            bot.sendMessage(chatId, "Выберите страицу", {
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [{ text: 'Предыдущая', callback_data: 'prevP' }, { text: 'Следующая', callback_data: 'nextP' }]
                    ]
                })
            });
            break;
        case kb.films.top:
            getTopFilms(bot, chatId);
            bot.sendMessage(chatId, "Выберите страицу", {
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [{ text: 'Предыдущая', callback_data: 'prevT' }, { text: 'Следующая', callback_data: 'nextT' }]
                    ]
                })
            });
            break;
        case kb.films.genres:
            bot.sendMessage(chatId, "Выберите жанр", {
                reply_markup: {
                    keyboard: keyboard.genre
                }
            });
            break;

        // Обработка жанров
        case kb.genre.action:
            getFilmsByGenres(bot, chatId, 28);
            break;
        case kb.genre.horror:
            getFilmsByGenres(bot, chatId, 27);
            break;
        case kb.genre.drama:
            getFilmsByGenres(bot, chatId, 18);
            break;
        case kb.genre.comedy:
            getFilmsByGenres(bot, chatId, 35);
            break;

        case kb.back:
            bot.sendMessage(chatId, "Вы вернулись на главный экран", {
                reply_markup: {
                    keyboard: keyboard.films
                }
            });
            break;
    }
})

bot.onText(/\/start/, msg => {
    const chatId = msg.chat.id;
    const text = `Здравствуйте, ${msg.from.first_name}\nВыберите команду для начала работы`

    bot.sendMessage(chatId, text, {
        reply_markup: {
            keyboard: keyboard.films
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

// Обработка инлайн клавиатуры
let page = 1;
if ( page < 1) {
    page = 1
}

bot.on('callback_query', query => {
    const {chat} = query.message;

    switch (query.data) {
        // Top
        case "nextT":
           page += 1;
           getTopFilms(bot, chat.id, page);
           break;
        case "prevT":
            page -= 1;
            getTopFilms(bot, chat.id, page);
            break;
        // Popular
        case "nextP":
            page += 1;
            getPopularFilms(bot, chat.id, page);
            break;
        case "prevP":
            page -= 1;
            getPopularFilms(bot, chat.id, page);
            break;
    }

    bot.answerCallbackQuery({
        callback_query_id: query.id
    })
});
