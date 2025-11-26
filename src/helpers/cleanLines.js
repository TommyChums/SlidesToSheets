const forEach = require('lodash/forEach');

const cleanText = (text) => {
  const oldText = text.replace(/(\r\n|\n|\r|\u000b)/gm, ' ');

  const everyOldWord = oldText.split(' ');

  const everyNewWord = [];

  forEach(everyOldWord, (word) => {
    if (word && word.trim()) {
      everyNewWord.push(word.trim());
    }
  });

  return everyNewWord.join(' ').trim();
}

module.exports = cleanText;