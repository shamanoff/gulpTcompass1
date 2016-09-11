/**
 * Gulp - playground
 */

'use strict';

/**
 * Require modules
 */

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    // sass = require('gulp-sass'),
    // autoprefixer = require('gulp-autoprefixer'),
    compass = require('gulp-compass'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    runSequence = require('run-sequence'),
    del = require('del'),
    server = require('browser-sync').create();

/**
 * Config
 * settings for all tasks (sources / dist / options)
 */
var config = {
    // server
    server: {
        options: {
            server: {
                baseDir: './'
            },
            port: 3000,
            open: 'local',
            // browser: 'google chrome',
            files: ['./**/*.{html,css,js}'],
            watchOptions: {
                ignored: 'node_modules'
            },
            injectChanges: true,
            logPrefix: 'Server',
            logFileChanges: false,
            logConnections: false,
            ghostMode: false,
            notify: false,
            ui: false
        }
    },

    // global pipes
    plumber: {
        options: {
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }
    },

    // scss
    scss: {
        src: './scss/**/*.scss',
        dist: './css',
        options: {
            outputStyle: 'expanded'
        }
    },
    autoprefixer: {
        options: {
            browsers: ['last 2 versions'],
            cascade: false
        }
    },

    // bundle -  useref
    useref: {
        src: [
            '!' + './node_modules/*.html',
            '!' + './node_modules/**/*.html',
            '!' + './vendors/**/*.html',
            '!' + './vendors/**/*.html',
            './**/*.html'],
        dist: './build',
    },

    // copy images
    assets: {
        src: [
            'images/**/*',
            'fonts/**/*',
        ],
        dist: './build'
    },

    // watch
    watch: {
        src: {
            html: [
                '*.html',
                './html/**/*.html'
            ],
            scss: './scss/**/*.scss',
            js: './js/**/*.js'
        }
    },

    // clean
    clean: {
        src: {
            default: './css/**/*',
            build: './build/**/*'
        }
    }
}

/**
 * Task - Server --> browser-sync
 */
gulp.task('server', function () {
    server.init(config.server.options);
});


/**
 * Task - SCSS Styles --> compile to CSS COMPASS
 */
gulp.task('scss', function () {
    return gulp.src(config.scss.src)
        .pipe(plumber(config.plumber.options))
        .pipe(compass({
            config_file: './config.rb',
            css: 'css',
            sass: 'scss'
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest(config.scss.dist))
        .pipe(server.stream());
});


/**
 * Task - Copy assets
 */
gulp.task('assets:copy', function () {
    return gulp.src(config.assets.src, {
        base: '.'
    })
        .pipe(gulp.dest(config.assets.dist))
});

/**
 * Task - SCSS Styles --> compile to CSS
 */
// gulp.task('scss', function () {
//     return gulp.src(config.scss.src)
//         .pipe(plumber(config.plumber.options))
//         .pipe(sass(config.scss.options))
//         .pipe(autoprefixer(config.autoprefixer.options))
//         .pipe(plumber.stop())
//         .pipe(gulp.dest(config.scss.dist))
//         .pipe(server.stream());
// });

/**
 * Task - JS scripts -->  bundle JS scripts from HTML scripts
 */
gulp.task('js:bundle', function () {
    return gulp.src(config.useref.src)
        .pipe(plumber(config.plumber.options))
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(plumber.stop())
        .pipe(gulp.dest(config.useref.dist))
});


/**
 * Task - Watch --> folders and files changes
 */
gulp.task('watch', function () {

    // watch - HTML
    gulp.watch(config.watch.src.html).on('change', server.reload);

    // watch - styles SCSS
    gulp.watch(config.watch.src.scss, ['scss']);

    // watch - scripts JS
    gulp.watch(config.watch.src.js).on('change', server.reload);

});

/**
 * Task - Clean --> del files and folder before pipelines start
 */

// helper function for del
function clean(target) {
    del(target).then(function (paths) {
        console.log('Files and folders that would be deleted:\n\n', paths.join('\n'));
    });
}

// clean - default --> modernizr.js / css/**
gulp.task('clean:default', function () {
    clean(config.clean.src.default);
});

// clean - build --> build/**
gulp.task('clean:build', function () {
    clean(config.clean.src.build);
});


/**
 * Task - Pipeline --> default
 */
gulp.task('default', ['clean:default'], function (cb) {
    runSequence(
        'scss',
        'server',
        'watch',
        cb);
});


/**
 * Task - Pipeline --> build
 */
gulp.task('build', ['clean:build'], function (cb) {
    runSequence(
        'scss',
        'assets:copy',
        'js:bundle',
        'server',
        cb);
});