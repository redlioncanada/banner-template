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
var config      = require('./app/config.json');
var fs          = require("fs");
var del         = require('del');
var uuid        = require('node-uuid');

var id = 'a'+uuid.v4().replace(/-/g, '');

gulp.task('generateHtml', ['pre'], function() {
    var iframe = '<iframe width="{width}" height="{height}" src="{src}" frameBorder="0" seamless="seamless" scrolling="no"></iframe>{content}';
    var overview = gulp.src('app/overview/index.html');

    for (var i in config.sizes) {
        for (var k in config.text) {
            for (var j in config.clickTags) {
                var clickTag = config.clickTags[j];
                var size = config.sizes[i];
                var language = k;
                var folderName = size+'-'+clickTag;
                var width = size.split('x')[0];
                var height = size.split('x')[1];

                gulp.src('app/assets/global/**/*')
                    .pipe(imageMin({
                        progressive: true
                    }))
                    .pipe(gulp.dest('build/'+folderName+'/'+language));

                gulp.src('app/assets/'+language+'/**/*')
                    .pipe(imageMin({
                        progressive: true
                    }))
                    .pipe(gulp.dest('build/'+folderName+'/'+language));


                //normal
                var index = gulp.src('app/templates/index.html')
                    .pipe(replace('{namespace}', id))
                    .pipe(replace('{size}',size))
                    .pipe(replace('{clickTag}', clickTag))
                    .pipe(replace('{size}', size))
                    .pipe(replace('{language}', language));

                for (var z in config.text[k]) {
                    index.pipe(replace('{'+z+'}', config.text[k][z]));
                }

                index.pipe(include())
                    .pipe(rename({'suffix':'.fat'}))
                    .pipe(gulp.dest('build/'+folderName+'/'+language));


                //minified
                var index = gulp.src('app/templates/index.html')
                    .pipe(replace('{namespace}', id))
                    .pipe(replace('{size}',size))
                    .pipe(replace('{.js', '{.min.js'))
                    .pipe(replace('{clickTag}', clickTag))
                    .pipe(replace('.css*/', '.min.css*/'))
                    .pipe(replace('{size}', size))
                    .pipe(replace('{language}', language));

                for (var z in config.text[k]) {
                    index.pipe(replace('{'+z+'}', config.text[k][z]));
                }

                index.pipe(include())
                    .pipe(minifyHtml())
                    .pipe(gulp.dest('build/'+folderName+'/'+language));
            }

            var x = iframe.replace('{width}',width).replace('{height}',height).replace('{src}','../'+folderName+'/'+language);
            overview.pipe(replace('{content}', x));
        }
    }

    overview.pipe(replace('{content}', ''))
        .pipe(gulp.dest('build/overview'));
})

gulp.task('pre', ['clean'], function() {
    for (var i in config.sizes) {
        for (var k in config.text) {
            for (var j in config.clickTags) {
                var size = config.sizes[i];
                var width = size.split('x')[0];
                var height = size.split('x')[1];

                gulp.src('app/templates/global.scss')
                    .pipe(rename({'suffix':'-'+size}))
                    .pipe(replace('{width}', width))
                    .pipe(replace('{height}', height))
                    .pipe(replace('{namespace}', id))
                    .pipe(sass())
                    .pipe(gulp.dest('build/temp/css'))
                    .pipe(minifyCss())
                    .pipe(rename({'suffix':'.min'}))
                    .pipe(gulp.dest('build/temp/css'));
            }
        }
    }

    gulp.src('app/templates/css/*.scss')
        .pipe(replace('{namespace}', id))
        .pipe(sass())
        .pipe(gulp.dest('build/temp/css'))
        .pipe(minifyCss())
        .pipe(rename({'suffix':'.min'}))
        .pipe(gulp.dest('build/temp/css'));

    gulp.src('app/templates/html/*.html')
        .pipe(gulp.dest('build/temp/html'))
        .pipe(minifyHtml())
        .pipe(rename({'suffix':'.min'}))
        .pipe(gulp.dest('build/temp/html'));

    return gulp.src('app/templates/js/**/*.js')
        .pipe(stripDebug())
        .pipe(gulp.dest('build/temp/js'))
        .pipe(uglify({mangle:false}))
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('build/temp/js'));
});


gulp.task('default', ['generateHtml'], function() {
    gulp.watch('app/templates/**/*.*', ['generateHtml']);
});

gulp.task('clean', function() {
    return del(['build']);
});







