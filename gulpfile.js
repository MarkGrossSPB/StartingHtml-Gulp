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
	return gulp.src('sourse/**/*.html')
	.pipe(livereload({ start: true }));
});

//sass
gulp.task('sass', function() {
	return gulp.src('sourse/scss/main.scss')
	.pipe(sourcemaps.init())
	.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	.pipe(autoprefixer({ browsers: ['last 4 versions'], cascade: false}))
	.pipe(sourcemaps.write())
	.pipe(rename("main.min.css"))	
	.pipe(gulp.dest('sourse/css'))
	.pipe(livereload({ start: true }));
});

//scripts
gulp.task('js', function() {
	return gulp.src([
		'sourse/libs/jquery/dist/jquery.min.js',
		'sourse/js/common.js'])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('sourse/js'));
});

//watch
gulp.task('watch', gulp.series('html', 'sass', 'js', function() {
	livereload.listen();
	gulp.watch('sourse/**/*.html', gulp.series('html'));
	gulp.watch('sourse/scss/**/*.scss', gulp.series('sass'));
	gulp.watch('sourse/js/common.js', gulp.series('js'));
}));

//default
gulp.task('default', gulp.series('watch'));

//clear cache
gulp.task('clear', function() {
	return cach.clearAll();
});

//minify img
gulp.task('img', function() {
	return gulp.src('sourse/image/**/*')
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
	var buildHtml = gulp.src('sourse/*.html')
	.pipe(gulp.dest('web'));
	var buildSass = gulp.src('sourse/css/main.min.css')
	.pipe(gulp.dest('web/css'));
	var buildJs = gulp.src('sourse/js/scripts.min.js')
	.pipe(gulp.dest('web/js'));
	var buildFonts = gulp.src('sourse/fonts/**/*')
	.pipe(gulp.dest('web/fonts'));
	var buildOther = gulp.src([
		'sourse/ht.access'])
	.pipe(gulp.dest('web'));
}));

