// Load in Gulp and the additional plugins
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var stylus = require('gulp-stylus');
//var imagemin = require('gulp-imagemin');
var clean = require('gulp-clean');
//var livereload = require('gulp-livereload');

gulp.task('css', function() {
	// Specify the source of the CSS files.
	return gulp.src('stylus/jo.styl')
	.pipe(stylus())
	// Autoprefix the CSS covering the last 10 versions of all browsers.
	.pipe(autoprefixer())
	// Rename the files to add the ".min" suffix.
//	.pipe(rename({suffix: '.min'}))
	// Minify the renamed CSS files.
//	.pipe(minifycss())
	// Set the output of the minified files.
	.pipe(rename('test.css'))
//	.pipe(gulp.dest('css/flattery/'))
	.pipe(gulp.dest('/Users/dbalmer/Projects/avixena/demo/app/css/'))
});

//gulp.task('js', function() {
	// Specify the source directory for the JS files.
	// Notice that we specified a regular expression in the directory.
	// This specific one will scan all sub-directories and get all files
	// with the ".js" extension.
	//return gulp.src('src/js/**/*.js')
	// Rename the files to add the ".min" suffix.
	//.pipe(rename({suffix: '.min'}))
	// Uglify the JS files.
	//.pipe(uglify())
	// Specify the final directory for the minified JS files.
	//.pipe(gulp.dest('dist/js'));
//});

//gulp.task('images', function() {
	// Specify the source of the images.
	//return gulp.src('src/img/**/*')
	//.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
	//.pipe(gulp.dest('dist/img'));
//});

//gulp.task('clean', function() {
	// Specify the directories to clean.
	//return gulp.src(['dist/css', 'dist/js', 'dist/img'], {read: false})
	// Clean them.
	//.pipe(clean());
//});

// The second parameter is an array of tasks to complete before
// executing the content of the function. In this case we are
// running the clean function before doing anything else.
gulp.task('default', [], function() {
	// Run all the other commands.
//	gulp.start('css', 'js', 'images');
	gulp.start('css');
});

gulp.task('watch', function() {
	// Watch the stylesheet and run the "css" task if there
	// is a change.
	gulp.watch('stylus/*.styl', ['css']);

	// Watch .js files.
	//gulp.watch('src/js/**/*.js', ['js']);

	// Watch image files.
	//gulp.watch('src/img/**/*', ['images']);

	// Reload the page with livereload.
	//var server = livereload();
	//gulp.watch('dist/**').on('change', function(file) {
	//server.changed(file.path);
	//});
});
