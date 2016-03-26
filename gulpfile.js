var gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	filter = require('gulp-filter'),
	notify = require('gulp-notify'),
	eslint = require('gulp-eslint'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	prefixer = require('gulp-autoprefixer'),
	nodemon = require('gulp-nodemon'),
	browserSync = require('browser-sync'),
	es = require('event-stream'),
	rename = require('gulp-rename'),
	source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
	browserify = require('browserify'),
	watchify = require('watchify');

var reload = browserSync.reload;

var paths = {
	'src':['./models/**/*.js','./routes/**/*.js', 'index.js', 'package.json'],
	style: {
		all: '**/*.scss',
		input: 'main.scss',
		output: 'main.css',
		baseDir: './public/styles/'
	}
};

gulp.task('sass', function () {
    var files = ['./public/styles/main.scss'];

    files.forEach(function(file) {
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
    })

});

gulp.task('js', function() {

    var directories = ['main'];
    function getFileName(directory) {
        return './public/js/src-' + directory + '/index.js'
    };

    var errorHandler = function() {
        var args = Array.prototype.slice.call(arguments);
        notify.onError({
            title: 'JS Error',
            message: '<%= error.message %>'
        }).apply(this, args);
        this.emit('end');
    };

    var tasks = directories.map(function(directory) {

        var entry = getFileName(directory);

        var bundler = watchify(browserify({
            entries: [entry],
            cache: {},
            packageCache: {},
            fullPaths: true,
            debug: true
        }));

        var rebundle = function() {
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

gulp.task('lint', function(){
    return gulp.src(paths.src)
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('server', function(cb) {
    var called = false;
    nodemon({
        script: './bin/www',
        watch: ['./*']
    }).on('start', function() {
        if (!called) {
            called = true;
            cb();
        }
    });
});

gulp.task('browser-sync', ['server'], function() {
    browserSync({
        proxy: 'localhost:3000',
        port: 4000,
        open: false,
        notify: false
    });
});

gulp.task('default', ['lint', 'js', 'sass', 'browser-sync'], function() {
    gulp.watch('./public/styles/**/*.sass', ['sass']);
    gulp.watch('./public/styles/**/*.scss', ['sass']);
    gulp.watch('./templates/**/*.jade').on('change', browserSync.reload);
});
