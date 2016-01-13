var gulp        = require('gulp');
var uglify      = require('gulp-uglify');
var sass        = require('gulp-sass');
var replace     = require('gulp-replace');
var stripDebug  = require('gulp-strip-debug');
var include     = require('gulp-include');
var rename      = require('gulp-rename');
var minifyCss   = require('gulp-cssnano');
var minifyHtml  = require('gulp-htmlmin');
var imageMin    = require('gulp-imagemin');
var config      = require('./config.json');
var fs          = require("fs");
var del         = require('del');
var uuid        = require('node-uuid');

var id = 'a'+uuid.v4().replace(/-/g, '');

gulp.task('generateHtml', ['pre'], function() {
    var iframe = '<iframe width="@width@" height="@height@" src="@src@" frameBorder="0" seamless="seamless" scrolling="no"></iframe>@content@';
    var overview = gulp.src('overview/index.html');

    for (var i in config.sizes) {
        for (var k in config.text) {
            for (var j in config.clickTags) {
                var clickTag = config.clickTags[j];
                var size = config.sizes[i];
                var language = k;
                var folderName = size+'-'+clickTag;
                var width = size.split('x')[0];
                var height = size.split('x')[1];

                gulp.src('assets/global/**/*')
                    .pipe(imageMin({
                        progressive: true,
                    }))
                    .pipe(gulp.dest('build/'+folderName+'/'+language));

                gulp.src('assets/'+language+'/**/*')
                    .pipe(imageMin({
                        progressive: true,
                    }))
                    .pipe(gulp.dest('build/'+folderName+'/'+language));

                //normal
                var index = gulp.src('template/index.html')
                    .pipe(replace('@css-namespace@', id))
                    .pipe(replace('@html-size@',size))
                    .pipe(replace('@js-clickTag@', clickTag))
                    .pipe(replace('@js-size@', size))
                    .pipe(replace('@html-lang@', language));

                for (var z in config.text[k]) {
                    index.pipe(replace('@html-'+z+'@', config.text[k][z]));
                }

                index.pipe(include())
                    .pipe(rename({'suffix':'.fat'}))
                    .pipe(gulp.dest('build/'+folderName+'/'+language));


                //minified
                var index = gulp.src('template/index.html')
                    .pipe(replace('@css-namespace@', id))
                    .pipe(replace('@html-size@',size))
                    .pipe(replace('@.js', '@.min.js'))
                    .pipe(replace('@js-clickTag@', clickTag))
                    .pipe(replace('.css*/', '.min.css*/'))
                    .pipe(replace('@js-size@', size))
                    .pipe(replace('@html-lang@', language));

                for (var z in config.text[k]) {
                    index.pipe(replace('@html-'+z+'@', config.text[k][z]));
                }

                index.pipe(include())
                    .pipe(minifyHtml())
                    .pipe(gulp.dest('build/'+folderName+'/'+language));
            }

            var x = iframe.replace('@width@',width).replace('@height@',height).replace('@src@','../'+folderName+'/'+language);
            overview.pipe(replace('@content@', x));
        }
    }

    overview.pipe(replace('@content@', ''))
        .pipe(gulp.dest('build/overview'));
})

gulp.task('pre', ['clean'], function() {
    gulp.src('template/global.scss')
        .pipe(replace('@css-namespace@', id))
        .pipe(sass())
        .pipe(gulp.dest('build/temp/css'))
        .pipe(minifyCss())
        .pipe(rename({'suffix':'.min'}))
        .pipe(gulp.dest('build/temp/css'));

    gulp.src('template/css/*.scss')
        .pipe(replace('@css-namespace@', id))
        .pipe(sass())
        .pipe(gulp.dest('build/temp/css'))
        .pipe(minifyCss())
        .pipe(rename({'suffix':'.min'}))
        .pipe(gulp.dest('build/temp/css'));

    return gulp.src('template/js/**/*.js')
        .pipe(stripDebug())
        .pipe(gulp.dest('build/temp/js'))
        .pipe(uglify({mangle:false}))
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('build/temp/js'));
});


gulp.task('default', ['generateHtml'], function() {
    gulp.watch('template/**/*.*', ['generateHtml']);
});

gulp.task('clean', function() {
    return del(['build']);
});







