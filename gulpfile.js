const gulp = require("gulp");
const ts = require("gulp-typescript");
const minify = require('gulp-minify');
const tsProject = ts.createProject("tsconfig.json");
const exec = require('child_process').exec;

const paths = {
    src: 'src/**',
    srcManifest: 'manifest.json',
    srcAssets: 'assets/**/*',

    dist: 'dist/**',
    distManifest: 'dist/',
    distAssets: 'dist/assets'
};

gulp.task("default", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js
        .pipe(minify({
            ext: {
                min: '.min.js'
            }
        }))
        .pipe(gulp.dest("dist"));
});

gulp.task('manifest', function () {
    return gulp.src(paths.srcManifest)
        .pipe(gulp.dest(paths.distManifest));
});

gulp.task('assets', function () {
    return gulp.src(paths.srcAssets)
        .pipe(gulp.dest(paths.distAssets));
});

gulp.task('copy', ['manifest', 'assets']);