
let path = {
    build: {
        css: "css/",
        fonts: "fonts/",
    },
    src: {
        css: "scss/style.scss",
        fonts: "fonts/*.ttf",
    },
    watch: {
        css:"scss/**/*.scss",
    }
}

let {src, dest} = require('gulp'),
    gulp = require('gulp'),
    scss = require('gulp-sass')(require('node-sass')),
    autoprefixer = require("gulp-autoprefixer"),
    group_media  = require("gulp-group-css-media-queries"),
    uglify = require("gulp-uglify-es").default,
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2'),
    fonter = require('gulp-fonter');
    

function css(params) {
    return src(path.src.css)
        .pipe(scss({ outputStyle: 'expanded' }).on('error', scss.logError))
        .pipe(
            group_media()
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(dest(path.build.css))  
}

function fonts(params) {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts));
}

gulp.task('otf2ttf', function() {
    return src(['fonts/*.otf'])
    .pipe(fonter({
        formats: ['ttf']
    }))
    .pipe(dest('fonts/'));
})

function watchFiles(params) {
    gulp.watch([path.watch.css], css);
}


let build = gulp.series(css);
let watch = gulp.parallel(build, watchFiles);

exports.fonts = fonts;
exports.css = css;
exports.build = build;
exports.watch = watch;
exports.default = watch;