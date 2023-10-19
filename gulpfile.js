﻿var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json'); // TypeScript config
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

function defaultTask(cb) {
    return gulp.src(['./*.ts'])
        .pipe(tsProject())
        .pipe(concat('nsx-spo.js'))
        .pipe(gulp.dest('./dist/'))
        .pipe(concat('nsx-spo.min.js'))
        .pipe(uglify({ mangle: true, compress: true }))
        .pipe(gulp.dest('./dist/'));
    cb();
}

exports.default = defaultTask
