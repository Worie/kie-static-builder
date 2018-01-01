const fs = require('fs');
const path = require('path');
const validator = require('./validator');
const fileObject = {
  'snippets': '__merged.json',
  'config': '__config.json',
  'text': '__exercise.html',
};

const readFile = (path, encoding) => {
  return fs.readFileSync(path, encoding);
};

const get = argv => {
  const result = {};
  const input = validator.input(argv);
  const files = Object.keys(fileObject);
  const {
    contentPath,
  } = input;

  // this returns (atm) a path that is used or throws error
  validator.paths(
    files.map(key => path.join(contentPath, fileObject[key]))
  );
  
  // attach file contents into each original property key
  files.forEach(file => {
    result[file] = readFile(path.join(contentPath, fileObject[file]), 'utf8');
  });

  // weird workaround, didn't dig into why i had to parse this specific file.
  // perhaps i should try to parse/stringify each one and check if thats valid, idk
  result.config = JSON.parse(result.config);
    
  return result;
}

module.exports = {
  get: get
}
