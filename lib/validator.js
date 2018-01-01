const fs = require('fs');

const validateInput = function (a) {
  const config = {};

  // defaults should be taken from common or something
  if (!a.contentPath) {
    throw new Error('No contentPath to build exercise from were passed');
  }

  if (!a.templatePath) {
    config.templatePath = '../kie-template.pug';
    console.warn(`No templatePath provided. Using default ${a.templatePath}`); // DRY
  }

  if (!a.destinationPath) {
    config.destinationPath = './';
    console.warn(`No destinationPath provided. Using default ${a.destinationPath}`); // DRY
  }

  if (!a.assetsPath) {
    config.assetsPath = './app/assets/dist/';
    console.warn(`No assetsPath provided. Using ${a.assetsPath}`); // DRY
  }
  
  return Object.assign(
    {},
    a,
    config
  );
};

const validatePaths = paths => {
  paths.forEach(path => {
    validatePath(path);
  });
}

const validatePath = path => {
  if (!fs.existsSync(path)) {
      throw new Error(`${path} does not exists`);
  }
};

module.exports = {
  input: validateInput,
  path: validatePath,
  paths: validatePaths
};