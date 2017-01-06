var gulp     = require('gulp'),

	//js
	concat   = require('gulp-concat'),
	babel    = require('gulp-babel'),
	uglify   = require('gulp-uglify'),
	es6transpiler = require('gulp-es6-transpiler'),
	tap      = require('gulp-tap'),

	//html
	nunjucks = require('gulp-nunjucks-render'),
	html     = require('gulp-htmlmin'),

	//css
	cleancss = require('gulp-clean-css'),

	//misc
	livereload = require('gulp-livereload'),
	debug    = require('gulp-debug'),
	del      = require('del'),
	colors = require('colors');

var dev    = './src/',
	dist   = './dist/';

var nunjuckData = {
	'a': [1,2,3],
	'develop': [
		{'n':'/root', 'c':[
			{'n':'/src', 'd':'website in readable format, make code edits here', 'c':[
				{'n':'/fonts', 'd':'', 'c':[]},
				{'n':'/img', 'd':'', 'c':[]},
				{'n':'/css', 'd':'', 'c':[
					{'n':'/vendor', 'd':'libraries from other people like Bootstrap', 'c':[]},
					{'n':'sitewide.css', 'd':'css used on all html pages'},
				]},
				{'n':'/js', 'd':'', 'c':[
					{'n':'/vendor', 'd':'libraries from other people like jQuery and Angular', 'c':[]},
					{'n':'angularapp.js', 'd':'the angular app that makes the schedule appear on home'},
					{'n':'', 'd':''},
				]},
				{'n':'/template', 'd':'', 'c':[
					{'n':'welcomeinfo.html', 'd':'blurb at the top of the home page that quickly tells you need to know schedule info'},
					{'n':'table.html', 'd':'schedule table on the home page'},
				]},
			]},
			{'n':'/dist', 'd':'website cloned from /src, compiled, and minified, open web browser here', 'c':[]},
			{'n':'/node_modules', 'd':'', 'c':[]},
			{'n':'/template', 'd':'nunjuck templates used during compile', 'c':[
				{'n':'standard.html', 'd':'template that describes basic layout of all pages'},
				{'n':'header.html'},
				{'n':'footer.html'},
			]},
			{'n':'gulpfile.js', 'd':'builds the site'},
			{'n':'apiserver.js', 'd':'runs the back-end server'},
			{'n':'routes.js', 'd':'helps run back-end'},
			{'n':'.gitignore', 'd':'configure file tells Github to not save certain files'},
			{'n':'.htaccess', 'd':'configure file for front-end server'},
			{'n':'package.json', 'd':'configure file tells npm what libraries we depend on'},
		]},
	]
};
















/****************************   Gulp Tasks ******************************/

gulp.task('refresh', ['clean', 'default', 'watch'], function(){
	console.log('Website refreshed.');
});

gulp.task('default', ['concat', 'html', 'css', 'copy'], function(){
	/*** Default Gulp Task, builds the entire website. Does not start watch.  ***/

	console.log('Website built.');
});

gulp.task('watch', function() {
	/*** Watch for changes in files and refresh the browser.
	     Does not watch vendor, images, or anything not frequently updated. ***/

	livereload.listen();
	gulp.watch(dev+'*.html', ['html']);
	gulp.watch('template/*.html', ['html']);
	gulp.watch(dev+'template/*.html', ['copy']);
	gulp.watch(dev+'css/*.css', ['css']);
	gulp.watch(dev+'js/*.js', ['concat', 'copy']);
	gulp.watch(dev+'js/vendor/*.js', ['copy']);
	livereload();
});

gulp.task('clean', function(){
	/***Completely delete the production copy and its contents. ***/

	del([dist+'/**', '!'+dist+'/**']).then(paths => {
		console.log('Deleted files and folders:\n', paths.join('\n'));
	});
});

gulp.task('nuj', function(){
	/*** Builds HTML pages from Nujucks templates. ***/

	nunjucks.nunjucks.configure([dev]);
	var bar = 'asdfasd';

	return gulp.src(dev+'*.html')
	.pipe(tap(getFilenames))
	.pipe(nunjucks({data: nunjuckData}))
	.pipe(gulp.dest(dist));


	function getFilenames(file, t){
		bar = trimToFilename(file.path, '\\');
	}
});

gulp.task('concat', function(){
	/*** Concats Angular JS files together to reduce server calls. ***/

	return gulp.src([
		dev+'js/_service-*.js',
		dev+'js/_directive-*.js',
		dev+'js/_controller-*.js',
	]).pipe(concat('scheduleapp.js'))
	//.pipe(babel())
	.pipe(gulp.dest(dist+'js'))
	.pipe(livereload());
});

gulp.task('html', ['nuj'], function(){
	/*** Minify HTML ***/

	return gulp.src(dist+'*.html')
	.pipe(html({
		collapseWhitespace: true,
		decodeEntities: true,
		minifyJS: true,
		removeComments: true
	}))
	.pipe(gulp.dest(dist))
	.pipe(livereload());
});

gulp.task('css', function(){
	/*** Minify CSS ***/

	return gulp.src(dev+'css/*.css')
	.pipe(cleancss())
	.pipe(gulp.dest(dist+'css'))
	.pipe(livereload());
});

gulp.task('copy', function(){
	//copy images, ignore production images such as PSD, HTML.
	(['bmp','gif','jpg','jpeg','png','tiff']
	.map(s => 'img/*.'+s))

	//Copy vendors, fonts, and everything else that needs to be in the dist folder.
	.concat([
		'css/vendor',
		'js/vendor',
		'js/stats.js',
		'js/news.js',
		'js/panel-admin.js',
		'js/http-sender.js',
		'font',
		'template',
		'robots.txt',
	]).map(f =>{
		if(isAFile(f)){
			gulp.src(dev+f)
			.pipe(gulp.dest( dist+trimToPathname(f) ));
		}else{
			gulp.src(dev+f+'/*')
			.pipe(gulp.dest(dist+f))
			.pipe(livereload());
		}
	});
});


minify('fuzzyset');
minify('xregexp');

function minify(name, file){
	file = file || name;

	gulp.task(name, function(){
		return gulp.src('js/vendor/'+file+'.js')
		.pipe(concat(file+'.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('js/vendor'));
	});
}

















/****************************   Helper Functions ******************************/

function endsWith(str, strWith){
	var a = str.split('');
	var b = strWith.split('');
	console.log(a);
	console.log(b);
	var start = str.length - strWith.length;


	//Checks the last letters of the string against strWith.
	return b.every( (letter, i) => {
		console.log(a[i+start],letter);
		if(a[i+start] === letter || letter === '*') //compare letters, allow wildcards.
			return true;
		return false;
	});
}

function isAFile(str){
	var a = str.split('/');
	var file = a[a.length-1].split('');

	return file.some(l => {
		if(l === '.')
			return true;
	});
}

function trimToPathname(str, slash){
	slash = slash || '/';
	str = str.split(slash);
	str.pop();
	return str.join(slash);
}

function trimToFilename(str, slash){
	return str.slice(trimToPathname(str, slash).length+1);
}