const kb = require('./keyboard-btns');

module.exports = {
    films: [
        [kb.films.popular, kb.films.top],
        [kb.films.genres]
    ],
    genre: [
        [kb.genre.action, kb.genre.horror],
        [kb.genre.drama, kb.genre.comedy],
        [kb.back]
    ]
};