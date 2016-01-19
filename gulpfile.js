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

var id = 'redlion-'+uuid.v4().replace(/-/g, '').substr(0,8);

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
                    .pipe(replace('{width}', width))
                    .pipe(replace('{height}', height))
                    .pipe(replace('{language}', language));

                for (var z in config.text[k]) {
                    if (z == 'namespace' || z == 'size' || z == 'clickTag' || z == 'url' || z == 'width' || z == 'height' || z == 'language') {
                        throw new Error('when binding text, '+z+' is a reserved bind keyword.');
                    }
                    index.pipe(replace('{'+z+'}', config.text[k][z]));
                }

                index.pipe(replace(/(\/\/=include |\/\*=include |<!--=include )/g, '$1../../build/temp/'))
                    .pipe(include())
                    .pipe(rename({'suffix':'.fat'}))
                    .pipe(gulp.dest('build/'+folderName+'/'+language));


                //minified
                var index = gulp.src('app/templates/index.html')
                    .pipe(replace('{namespace}', id))
                    .pipe(replace('{size}',size))
                    .pipe(replace(/(\/\/=.*|<!--=.*|\/\*=.*)(\.js|\.html|\.css)/g, '$1.min$2'))
                    .pipe(replace('{clickTag}', clickTag))
                    .pipe(replace('{size}', size))
                    .pipe(replace('{width}', width))
                    .pipe(replace('{height}', height))
                    .pipe(replace('{language}', language));

                for (var z in config.text[k]) {
                    index.pipe(replace('{'+z+'}', config.text[k][z]));
                }

                index.pipe(replace(/(\/\/=include |\/\*=include |<!--=include )/g, '$1../../build/temp/'))
                    .pipe(include())
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
                var clickTag = config.clickTags[j];
                var size = config.sizes[i];
                var language = k;
                var folderName = size+'-'+clickTag;
                var width = size.split('x')[0];
                var height = size.split('x')[1];

                gulp.src('app/templates/global.scss')
                    .pipe(rename({'suffix':'-'+size}))
                    .pipe(replace('{width}', width))
                    .pipe(replace('{height}', height))
                    .pipe(replace('{namespace}', id))
                    .pipe(replace('{language}', language))
                    .pipe(sass())
                    .pipe(gulp.dest('build/temp/css'))
                    .pipe(minifyCss())
                    .pipe(rename({'suffix':'.min'}))
                    .pipe(gulp.dest('build/temp/css'));

                gulp.src('app/templates/css/'+size+'.scss')
                    .pipe(replace('{namespace}', id))
                    .pipe(replace('{width}', width))
                    .pipe(replace('{height}', height))
                    .pipe(replace('{language}', language))
                    .pipe(sass())
                    .pipe(gulp.dest('build/temp/css'))
                    .pipe(minifyCss())
                    .pipe(rename({'suffix':'.min'}))
                    .pipe(gulp.dest('build/temp/css'));

                gulp.src('app/templates/html/'+size+'.html')
                    .pipe(replace('{width}', width))
                    .pipe(replace('{height}', height))
                    .pipe(replace('{language}', language))
                    .pipe(gulp.dest('build/temp/html'))
                    .pipe(minifyHtml())
                    .pipe(rename({'suffix':'.min'}))
                    .pipe(gulp.dest('build/temp/html'));

                gulp.src('app/templates/js/animations/'+size+'.js')
                    .pipe(replace('{width}', width))
                    .pipe(replace('{height}', height))
                    .pipe(replace('{language}', language))
                    .pipe(replace('{clickTag}', clickTag))
                    .pipe(stripDebug())
                    .pipe(gulp.dest('build/temp/js'))
                    .pipe(uglify({mangle:false}))
                    .pipe(rename({suffix:'.min'}))
                    .pipe(gulp.dest('build/temp/js'));
            }
        }
    }

    gulp.src('app/templates/js/clickTags/*.js')
        .pipe(replace('{width}', width))
        .pipe(replace('{height}', height))
        .pipe(replace('{language}', language))
        .pipe(replace('{clickTag}', clickTag))
        .pipe(stripDebug())
        .pipe(gulp.dest('build/temp/js'))
        .pipe(uglify({mangle:false}))
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('build/temp/js'));

    return gulp.src('app/templates/js/includes/*.js')
        .pipe(replace('{width}', width))
        .pipe(replace('{height}', height))
        .pipe(replace('{language}', language))
        .pipe(replace('{clickTag}', clickTag))
        .pipe(stripDebug())
        .pipe(gulp.dest('build/temp/js'))
        .pipe(uglify({mangle:false}))
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('build/temp/js'));
});


gulp.task('default', ['generateHtml'], function() {
    gulp.watch('app/templates/**/*.*', ['generateHtml']);
    gulp.watch('app/assets/**/*.*', ['generateHtml']);
});

gulp.task('clean', function() {
    return del(['build']);
});







