/*
    gulp
        removes /build
        compiles templates to /build/_temp
        combines files to their various sizes-clicktag folders

    gulp package
        zips build/size-clicktag and puts them in /build/package

    gulp version
        --bump
            increases version number in config.json by 1
        --reset
            resets version number in config.json to 1

    --save path
        param that copies the build output to a different directory, requires the name property in config.json

    gulp validate
        validates the folders in /build against adwords specs
*/

require('events').EventEmitter.prototype._maxListeners = 100;
var gulp        = require('gulp');
var uglify      = require('gulp-uglify');
var sass        = require('gulp-sass');
var replace     = require('gulp-replace');
var stripDebug  = require('gulp-strip-debug');
var include     = require('gulp-include');
var flatten     = require('gulp-flatten');
var rename      = require('gulp-rename');
var minifyCss   = require('gulp-cssnano');
var minifyHtml  = require('gulp-htmlmin');
var imageMin    = require('gulp-imagemin');
var tar         = require('gulp-tar');
var gzip        = require('gulp-gzip');
var ignore      = require('gulp-ignore');
var config      = require('./app/config.json');
var fs          = require("fs");
var del         = require('del');
var path        = require('path');
var uuid        = require('node-uuid');
var mergeStream = require('merge-stream')
var mergeStream = require('merge-stream');
var jeditor     = require("gulp-json-editor");
var argv        = require('yargs').argv;
var adwords     = require('gulp-adwords');

var id = 'redlion-'+uuid.v4().replace(/-/g, '').substr(0,8);

gulp.task('generateHtml', ['pre'], function() {
    var overviewData = [];
    var overview = gulp.src('app/overview/index.html');
    var tasks = [];

    for (var i in config.sizes) {
        for (var k in config.text) {
            for (var j in config.clicktags) {
                var clicktag = config.clicktags[j];
                var size = config.sizes[i];
                var language = k;
                var folderName = size+'-'+clicktag;
                var width = size.split('x')[0];
                var height = size.split('x')[1];
                var basePath = 'app/assets';

                var src = generateSrcFolders(basePath,[language,size,clicktag]);
                tasks.push(gulp.src(src, {base: basePath})
                    .pipe(flatten())
                    .pipe(imageMin({
                        progressive: true
                    }))
                    .pipe(gulp.dest('build/'+folderName+'/'+language)));

                //normal
                var index = gulp.src('app/templates/index.html')
                    .pipe(replace('{namespace}', id))
                    .pipe(replace('{size}',size))
                    .pipe(replace('{clicktag}', clicktag))
                    .pipe(replace('{size}', size))
                    .pipe(replace('{width}', width))
                    .pipe(replace('{height}', height))
                    .pipe(replace('{language}', language));

                for (var z in config.text[k]) {
                    if (z == 'namespace' || z == 'size' || z == 'clicktag' || z == 'url' || z == 'width' || z == 'height' || z == 'language') {
                        throw new Error('when binding text, '+z+' is a reserved bind keyword.');
                    }
                    index.pipe(replace('{'+z+'}', config.text[k][z]));
                }

                index.pipe(replace(/(\/\/=include |\/\*=include |<!--=include )/g, '$1../../build/temp/'))
                    .pipe(include())
                    .pipe(rename({'suffix':'.fat'}))
                    .pipe(gulp.dest('build/'+folderName+'/'+language));

                tasks.push(index);


                //minified
                var indexMin = gulp.src('app/templates/index.html')
                    .pipe(replace('{namespace}', id))
                    .pipe(replace('{size}',size))
                    .pipe(replace(/(\/\/=.*|<!--=.*|\/\*=.*)(\.js|\.html|\.css)/g, '$1.min$2'))
                    .pipe(replace('{clicktag}', clicktag))
                    .pipe(replace('{size}', size))
                    .pipe(replace('{width}', width))
                    .pipe(replace('{height}', height))
                    .pipe(replace('{language}', language));

                for (var z in config.text[k]) {
                    indexMin.pipe(replace('{'+z+'}', config.text[k][z]));
                }

                indexMin.pipe(replace(/(\/\/=include |\/\*=include |<!--=include )/g, '$1../../build/temp/'))
                    .pipe(include())
                    .pipe(minifyHtml())
                    .pipe(gulp.dest('build/'+folderName+'/'+language));

                tasks.push(indexMin);
            }

            overviewData.push({
                width: width,
                height: height,
                src: '../'+folderName+'/'+language,
                language: language,
                folderName: folderName,
                size: size,
                clicktag: clicktag
            })
        }
    }

    overview.pipe(replace('{data}', 'var data = '+JSON.stringify(overviewData)))
        .pipe(replace('{name}', config.name))
        .pipe(replace('{version}', config.version))
        .pipe(gulp.dest('build/overview'));

    tasks.push(overview);

    return mergeStream(tasks);
})

gulp.task('pre', ['clean'], function() {
    var tasks = [];

    for (var i in config.sizes) {
        for (var k in config.text) {
            for (var j in config.clicktags) {
                var clicktag = config.clicktags[j];
                var size = config.sizes[i];
                var language = k;
                var folderName = size+'-'+clicktag;
                var width = size.split('x')[0];
                var height = size.split('x')[1];

                var basePath = 'app/templates/css/';
                var src = generateSrcFolders(basePath, [clicktag,language,size]);
                tasks.push(gulp.src(src, {base: basePath})
                    .pipe(replace('{width}', width))
                    .pipe(replace('{height}', height))
                    .pipe(replace('{namespace}', id))
                    .pipe(replace('{clicktag}', clicktag))
                    .pipe(replace('{language}', language))
                    .pipe(sass())
                    .pipe(gulp.dest('build/temp/css'))
                    .pipe(minifyCss())
                    .pipe(rename({'suffix':'.min'}))
                    .pipe(gulp.dest('build/temp/css')));

                basePath = 'app/templates/html/';
                src = generateSrcFolders(basePath, [clicktag,language,size]);
                var html = gulp.src(src, {base: basePath})
                    .pipe(replace('{width}', width))
                    .pipe(replace('{height}', height))
                    .pipe(replace('{language}', language))
                    .pipe(replace('{clicktag}', clicktag))

                for (var z in config.text[k]) {
                    if (z == 'namespace' || z == 'size' || z == 'clicktag' || z == 'url' || z == 'width' || z == 'height' || z == 'language') {
                        throw new Error('when binding text, '+z+' is a reserved bind keyword.');
                    }
                    html.pipe(replace('{'+z+'}', config.text[k][z]));
                }
                html.pipe(gulp.dest('build/temp/html'))
                    .pipe(minifyHtml())
                    .pipe(rename({'suffix':'.min'}))
                    .pipe(gulp.dest('build/temp/html'));

                tasks.push(html);

                basePath = 'app/templates/js/';
                src = generateSrcFolders(basePath, [clicktag,language,size]);
                src.push(basePath+'includes/**/*.js')
                tasks.push(gulp.src(src, {base: basePath})
                    .pipe(replace('{width}', width))
                    .pipe(replace('{height}', height))
                    .pipe(replace('{size}', size))
                    .pipe(replace('{language}', language))
                    .pipe(replace('{clicktag}', clicktag))
                    .pipe(gulp.dest('build/temp/js'))
                    .pipe(stripDebug())
                    .pipe(uglify({mangle:false}))
                    .pipe(rename({suffix:'.min'}))
                    .pipe(gulp.dest('build/temp/js')));
            }
        }
    }

    return mergeStream(tasks);
});


gulp.task('default', ['save'], function() {
    gulp.watch('app/templates/**/*.*', ['save']);
    gulp.watch('app/assets/**/*.*', ['save']);
});

gulp.task('package', ['packageContinueTask']);
gulp.task('publish', ['packageContinueTask']);

gulp.task('packageTask', ['validate'], function() {
    var zip = require('gulp-zip');
    var tasks = [];

    var year = new Date().getFullYear()
    var month = getMonth(new Date().getMonth())
    var brand = config.brand
    var version = config.version
    var name = config.name

    for (var i in config.sizes) {
        for (var k in config.text) {
            for (var j in config.clicktags) {
                var clicktag = config.clicktags[j];
                var size = config.sizes[i];
                var language = k;
                var path = 'build/'+size+'-'+clicktag+'/'+language+'/*';

                var packageName = `${year}_${brand}Brand_RL_Other_${name}_Retail${month}_HTML5_CA_${language.toUpperCase()}_${size}`

                tasks.push(gulp.src(path)
                    .pipe(ignore(['index.fat.html']))
                    .pipe(zip(packageName+'.zip'))
                    .pipe(gulp.dest('build/package/'+clicktag)));
            }
        }
    }

    return mergeStream(tasks);
});

gulp.task('packageContinueTask', ['packageTask'], function() {
    var zip = require('gulp-zip');
    var tasks = [];

    var year = new Date().getFullYear()
    var month = getMonth(new Date().getMonth())
    var brand = config.brand
    var version = config.version
    var name = config.name

    for (var j in config.clicktags) {
        var clicktag = config.clicktags[j]
        var name = `${year}_${brand}Brand_RL_Other_${name}_Retail${month}_HTML5_CA_${clicktag}_V${version}`

        tasks.push(gulp.src('build/package/'+clicktag+'/**/*.zip')
            .pipe(zip(name+'.zip'))
            .pipe(gulp.dest('build/package')));
    }

    return mergeStream(tasks);
})

gulp.task('save', ['cleanSave'], function() {
    if (argv.save && config.name) {
        return gulp.src('build/**/*')
            .pipe(gulp.dest(argv.save+'/'+config.name));
    }
});

gulp.task('cleanSave', ['generateHtml'], function() {
    if (argv.save && config.name) {
        return del([argv.save+'/'+config.name], {force: true});
    }
});

gulp.task('cleanPackage', function() {
    return del(['build/package']);
});

gulp.task('clean', function() {
    return del(['build']);
});

gulp.task('validate', ['cleanPackage'], function() {
    var tasks = [];
    for (var i in config.sizes) {
        for (var k in config.text) {
            for (var j in config.clicktags) {
                var clicktag = config.clicktags[j];
                var size = config.sizes[i];
                var language = k;

               tasks.push(
                    gulp.src('build/'+size+'-'+clicktag+'/'+language+'/**/*')
                        .pipe(ignore.exclude(/index\.fat\.html/))
                        .pipe(adwords({name:size+' '+language+' '+clicktag}))
                        .pipe(ignore.exclude(/\./))
                        .pipe(gulp.dest('.'))
                )
            }
        }
    }
    return mergeStream(tasks)
})

gulp.task('version', function() {
    if (argv.reset) {
        gulp.src('./app/config.json')
            .pipe(jeditor({"version": "1"}))
            .pipe(gulp.dest('./app'))
    } else if (argv.bump) {
        gulp.src('./app/config.json')
            .pipe(jeditor(function(json) {
                json.version = String(Number(json.version) + 1)
                return json
            }))
            .pipe(gulp.dest('./app'))
    } else {
        console.log('No params set!')
    }
})

function generateSrcFolders(path,params) {
    var src = [];
    if (typeof params === 'string') params = [params];

    for (var i in params) {
        src.push(path+'/**/'+params[i]+'/*');
        src.push(path+'/**/'+params[i]+'.*');
        src.push(path+'/'+params[i]+'.*');
        src.push(path+'/'+params[i]+'/**/*');
        src.push(path+'/'+params[i]+'/*');
    }

    src.push(path+'/global.*');
    src.push(path+'/global/**/*');

    return src;
}

function getMonth(month) {
    switch(month) {
        case 0:
            return "January"
        case 1:
            return "February"
        case 2:
            return "March"
        case 3:
            return "April"
        case 4:
            return "May"
        case 5:
            return "June"
        case 6:
            return "July"
        case 7:
            return "August"
        case 8:
            return "September"
        case 9:
            return "October"
        case 10:
            return "November"
        case 11:
            return "December"
        default:
            return false
    }
}