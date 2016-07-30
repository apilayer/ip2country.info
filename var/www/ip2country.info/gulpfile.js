
/*
* Load plugins
*/

const
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    notify = require('gulp-notify'),
    inline = require('gulp-inline'),
    htmlmin = require('gulp-htmlmin'),
    cleanCSS = require('gulp-clean-css'),
    htmlhint = require('gulp-htmlhint'),
    uglify = require('gulp-uglify'),
    multipipe = require('multipipe'),
    zopfli = require('gulp-zopfli'),
    config = require('./config.json'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create();


/*
* SCSS tasks
*/

gulp.task( 'scss:build', () => {
    return multipipe(
        gulp.src( config.scss.source ),

        sourcemaps.init(),
        sass(),
        sourcemaps.write( '.', {includeContent: false, sourceRoot: config.scss.root} ),

        gulp.dest( config.css.path ),
        browserSync.stream()
    ).on( 'error', notify.onError() );
} );


/*
* HTML tasks
*/

gulp.task( 'html:hint', () => {
    return multipipe(
        gulp.src( config.html.source ),

        htmlhint(),
        htmlhint.failReporter(),

        gulp.dest( config.html.path )
    ).on( 'error', notify.onError() );
} );

gulp.task( 'html:inline', ['html:hint'], () => {
    return multipipe(
        gulp.src( config.html.source ),

        inline( { base: '.', js: uglify, css: cleanCSS  } ),

        gulp.dest( config.dest.path )
    ).on( 'error', notify.onError() );
} );

gulp.task( 'html:minify', ['html:inline'], () => {
    return multipipe(
        gulp.src( config.dest.path + config.html.source ),

        htmlmin(
            {
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                removeOptionalTags: true,
                removeAttributeQuotes: true,
                collapseBooleanAttributes: true
            }
        ),

        gulp.dest( config.dest.path )
    ).on( 'error', notify.onError() );
} );

gulp.task( 'html:compress', ['scss:build', 'html:minify'], () => {
    return multipipe(
        gulp.src( config.dest.path + config.html.source ),

        zopfli(),

        gulp.dest( config.dest.path )
    ).on( 'error', notify.onError() );
} );


/*
* Copy task
*/

gulp.task( 'copy:files', () => {
    return multipipe(
        gulp.src( config.copy.files ),

        gulp.dest( config.dest.path )
    ).on( 'error', notify.onError() );
});


/*
* browserSync task
*/

gulp.task('serve', ['scss:build'], () => {
    browserSync.init(
        {
            server: true,
            port: 3001,
            browser: 'google chrome'
        }
    );

    gulp.watch( config.scss.source, ['scss:build'] );
    gulp.watch( config.html.source, ['html:hint'], browserSync.reload );
});


/*
* Build task
*/

gulp.task( 'build', ['scss:build', 'html:compress', 'copy:files'] );


/*
* Default task
*/

gulp.task( 'default', ['serve'] );
