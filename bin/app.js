#!/usr/bin/env node

'use strict';

const kielify = require('../kie-lang/kiel.js');
const gulp = require('gulp');
const pug = require('gulp-pug');
const argv = require('yargs').argv;
const fs = require('fs');
const path = require('path');
const replace = require('gulp-string-replace');
const rename = require('gulp-rename');
const find = require('find');
const reader = require('../lib/reader');
const validator = require('../lib/validator');

const input = validator.input(argv);

const {
  contentPath,
  templatePath,
  assetsPath
} = input;

// I wonder if it should be argv or input here - where validation should go
const exerciseData = reader.get(input);

const destinationPath = path.join(argv.destinationPath, exerciseData.config.id);
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
        exerciseJSON: exerciseData.snippets,
        exerciseText: kielify(exerciseData.text),
        exerciseImages: exerciseImageList,
        assetsPath: `./${assetsDirectoryName}`,
        ytVideoId: exerciseData.config.ytVideoId,
        chapterId: exerciseData.config.id,
        previousURL: exerciseData.config.previousURL,
        nextURL: exerciseData.config.nextURL,
        title: exerciseData.config.title,
        root:  exerciseData.config.root,
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
