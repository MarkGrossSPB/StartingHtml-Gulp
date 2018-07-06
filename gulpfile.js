'use strict'

var gulp = require('gulp'),
	sass = require('gulp-sass'), //компиляция sass
	livereload = require('gulp-livereload'), //перезагрузка
	concat = require('gulp-concat'), //конкатинация файлов
	uglify = require('gulp-uglifyjs'), //минимизация js
	autoprefixer = require('gulp-autoprefixer'), //автопрефиксы 
	rename = require('gulp-rename'), //переименование файла
	sourcemaps = require('gulp-sourcemaps'), //карты стилей
	del = require('del'), //удаление
	imagemin = require('gulp-imagemin'), //сжатие изображений
	pngquant = require('imagemin-pngquant'), //сжатие png
	cache = require('gulp-cache'); //кэширование изображений

//html
gulp.task('html', function() {
	return gulp.src('source/**/*.html')
	.pipe(livereload({ start: true }));
});

//sass
gulp.task('sass', function() {
	return gulp.src('source/scss/main.scss')
	.pipe(sourcemaps.init())
	.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	.pipe(autoprefixer({ browsers: ['last 4 versions'], cascade: false}))
	.pipe(sourcemaps.write())
	.pipe(rename("main.min.css"))	
	.pipe(gulp.dest('source/css'))
	.pipe(livereload({ start: true }));
});

//scripts
gulp.task('js', function() {
	return gulp.src([
		'source/libs/jquery/dist/jquery.min.js',
		'source/js/common.js'])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('source/js'));
});

//watch
gulp.task('watch', gulp.series('html', 'sass', 'js', function() {
	livereload.listen();
	gulp.watch('source/**/*.html', gulp.series('html'));
	gulp.watch('source/scss/**/*.scss', gulp.series('sass'));
	gulp.watch('source/js/common.js', gulp.series('js'));
}));

//default
gulp.task('default', gulp.series('watch'));

//clear cache
gulp.task('clear', function() {
	return cach.clearAll();
});

//minify img
gulp.task('img', function() {
	return gulp.src('source/image/**/*')
	.pipe(cache(imagemin({ 
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('web/img'));
});

//clean foulder web
gulp.task('clean', function(done) {
  del(['.web/'], done);
});

//build
gulp.task('build', gulp.parallel('clean', 'js', 'img', function() {
	var buildHtml = gulp.src('source/*.html')
	.pipe(gulp.dest('web'));
	var buildSass = gulp.src('source/css/main.min.css')
	.pipe(gulp.dest('web/css'));
	var buildJs = gulp.src('source/js/scripts.min.js')
	.pipe(gulp.dest('web/js'));
	var buildFonts = gulp.src('source/fonts/**/*')
	.pipe(gulp.dest('web/fonts'));
	var buildOther = gulp.src([
		'source/ht.access'])
	.pipe(gulp.dest('web'));
}));
