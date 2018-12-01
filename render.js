const fs = require('fs');
const R = require('ramda');
const whiskers = require('whiskers');

const contents = Object.assign(JSON.parse(fs.readFileSync('repose.json')), {maxCards: 3});
const template = fs.readFileSync('templates/index.template.html');

const result = whiskers.render(template, contents);

fs.writeFileSync('index.html', result);

console.log('RENDER DONE!!');