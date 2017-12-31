'use strict';

const paths = require('../paths');
const patterns = require('../patterns');
const kielify = require('../../kiel');
const pug = require('gulp-pug');
const argv = require('yargs').argv;
const fs = require('fs');
const path = require('path');
const replace = require('gulp-string-replace');
const rename = require('gulp-rename');
const find = require('find');

if (!argv.contentPath) {
  throw new Error('No contentPath to build exercise from were passed');
}

if (!argv.templatePath) {
  argv.templatePath = './src/standalone-exercise.pug';
  console.warn(`No templatePath provided. Using default ${argv.templatePath}`)
}

if (!argv.destinationPath) {
  argv.destinationPath = './';
  console.warn(`No destinationPath provided. Using default ${argv.destinationPath}`)
}

if (!argv.assetsPath) {
  argv.assetsPath = './app/assets/dist/';
  console.warn(`No assetsPath provided. Using ${argv.assetsPath}`)
}

const {
  contentPath,
  templatePath,
  assetsPath
} = argv;


const validatePaths = (paths) => {
  paths.forEach(path => {
    if (!fs.existsSync(path)) {
      throw new Error(`${path} does not exists`);
    }
  });
}

module.exports = function (gulp) {
  const jsonPath = path.join(contentPath, '__merged.json');
  const textPath = path.join(contentPath, '__exercise.html');
  const detailsPath = path.join(contentPath, '__config.json');

  validatePaths([
    jsonPath,
    textPath,
    detailsPath
  ]);

  const exerciseObj = fs.readFileSync(jsonPath, "utf8");
  const exerciseDetails = JSON.parse(fs.readFileSync(detailsPath, "utf8"));
  const exerciseText = fs.readFileSync(textPath, "utf8");

  const destinationPath = path.join(argv.destinationPath, exerciseDetails.id);
  const assetsDirectoryName = 'assets';

  const prodAssetsPath = path.join(destinationPath, assetsDirectoryName);


  // reconsider more elastic approach (other dirs than img)

  const exerciseImgPath = path.join(contentPath, 'img');
  let exerciseImageList = [];
  if (fs.existsSync(exerciseImgPath)) {
    gulp.src(path.join(exerciseImgPath, '/**/*'))
      .pipe(gulp.dest(path.join(destinationPath, 'img')));

    exerciseImageList = find.fileSync(exerciseImgPath).map(file => file.substring(contentPath.length));
  }

  gulp.src(templatePath)
      .pipe(pug({
        pretty: false,
        locals: {
          exerciseJSON: exerciseObj,
          exerciseText: kielify(exerciseText),
          exerciseImages: exerciseImageList,
          assetsPath: `./${assetsDirectoryName}`,
          ytVideoId: exerciseDetails.ytVideoId,
          chapterId: exerciseDetails.id,
          previousURL: exerciseDetails.previousURL,
          nextURL: exerciseDetails.nextURL,
          title: exerciseDetails.title,
          root:  exerciseDetails.root,
        }
      }))
      .pipe(rename('index.html'))
      .pipe(gulp.dest(destinationPath));

  gulp.src([
    `${assetsPath}**/*`,
    `!${assetsPath}fonts/**/*`
  ])
    .pipe(replace('/assets/images/', '../images/'))
    .pipe(gulp.dest(prodAssetsPath));

    gulp.src(`${assetsPath}fonts/**/*`)
      .pipe(gulp.dest(path.join(prodAssetsPath, 'fonts')));
};
