var gulp = require('gulp');
var minify = require('gulp-minify');


/**
 * Minify task
 * Run using `gulp minify`
 * Minifies lightbox.js and outputs o lightbox.min.js
 */
gulp.task('minify', function () {
    return gulp.src('js/lightbox.js')
        .pipe(minify({
            ext: {
                min: '.min.js'
            },
            noSource: true,
        }))
        .pipe(gulp.dest('js'));
});


/**
 * Default task
 * Run using `gulp`
 * Runs minify
 */
gulp.task('default', ['minify']);
