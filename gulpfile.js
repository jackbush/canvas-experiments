var gulp = require('gulp');
var plumber = require('gulp-plumber');
var filter = require('gulp-filter');
var notify = require('gulp-notify');
var eslint = require('gulp-eslint');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var prefixer = require('gulp-autoprefixer');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var es = require('event-stream');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');

var reload = browserSync.reload;

var paths = {
	'src': ['./models/**/*.js', './routes/**/*.js', 'index.js', 'package.json'],
	style: {
		all: '**/*.scss',
		input: 'main.scss',
		output: 'main.css',
		baseDir: './public/styles/'
	}
};

gulp.task('sass', function () {
	var files = ['./public/styles/main.scss'];

	files.forEach(function (file) {
		return gulp.src(file)
			.pipe(plumber({
				errorHandler: notify.onError('SASS Error: <%= error.message %>')
			}))
			.pipe(sourcemaps.init())
			.pipe(sass({
				paths: ['sass']
			}))
			.pipe(prefixer('last 2 versions'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('./public/styles'))
			.pipe(filter('**/*.css'))
			.pipe(reload({
				stream: true
			}));
	});
});

gulp.task('js', function () {
	var directories = ['main'];
	function getFileName (directory) {
		return './public/js/src-' + directory + '/index.js';
	}

	var errorHandler = function () {
		var args = Array.prototype.slice.call(arguments);
		notify.onError({
			title: 'JS Error',
			message: '<%= error.message %>'
		}).apply(this, args);
		this.emit('end');
	};

	var tasks = directories.map(function (directory) {
		var entry = getFileName(directory);

		var bundler = watchify(browserify({
			entries: [entry],
			cache: {},
			packageCache: {},
			fullPaths: true,
			debug: true
		}));

		var rebundle = function () {
			return bundler.bundle()
				.on('error', errorHandler)
				.pipe(source(entry))
				.pipe(buffer())
				.pipe(sourcemaps.init({
					loadMaps: true
				}))
				.pipe(rename({
					basename: '' + directory,
					extname: '.output.js',
					dirname: ''
				}))
				.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest('./public/js/'))
				.pipe(reload({
					stream: true
				}));
		};

		// console.log(entry);
		bundler.on('update', rebundle);

		return rebundle();
	});

	return es.merge.apply(null, tasks);
});

gulp.task('lint', function () {
	return gulp.src(paths.src)
		.pipe(eslint())
		.pipe(eslint.format());
});

gulp.task('server', function (cb) {
	var called = false;
	nodemon({
		script: './bin/www',
		watch: ['./*']
	}).on('start', function () {
		if (!called) {
			called = true;
			cb();
		}
	});
});

gulp.task('browser-sync', ['server'], function () {
	browserSync({
		proxy: 'localhost:3000',
		port: 4000,
		open: false,
		notify: false
	});
});

gulp.task('default', ['js', 'sass', 'browser-sync'], function () {
	gulp.watch('./public/styles/**/*.sass', ['sass']);
	gulp.watch('./public/styles/**/*.scss', ['sass']);
	gulp.watch('./templates/**/*.jade').on('change', browserSync.reload);
});
