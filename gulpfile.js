/*
    gulp
        removes /build
        compiles templates to /build/_temp
        combines files to their various sizes-clicktag folders

    gulp package
        validates banners against AdWords specs
        zips build/size-clicktag and puts them in /build/package

    gulp version
            increases version number in config.json by 1
        --reset
            resets version number in config.json to 1
*/

require('events').EventEmitter.prototype._maxListeners = 100;
var gulp        = require('gulp'),
    uglify      = require('gulp-uglify'),
    sass        = require('gulp-sass'),
    replace     = require('gulp-replace'),
    stripDebug  = require('gulp-strip-debug'),
    include     = require('gulp-include'),
    flatten     = require('gulp-flatten'),
    rename      = require('gulp-rename'),
    minifyCss   = require('gulp-cssnano'),
    util        = require('gulp-util'),
    minifyHtml  = require('gulp-htmlmin'),
    imageMin    = require('gulp-imagemin'),
    zip         = require('gulp-zip'),
    ignore      = require('gulp-ignore'),
    jeditor     = require("gulp-json-editor"),
    adwords     = require('gulp-adwords'),
    imageSize  = require('image-size'),
    fs          = require("fs"),
    through     = require('through2'),
    del         = require('del'),
    path        = require('path'),
    uuid        = require('node-uuid'),
    mergeStream = require('merge-stream'),
    argv        = require('yargs').argv;

var id = 'redlion-'+uuid.v4().replace(/-/g, '').substr(0,8);

var directories = {
    "rich": {
        "assets": "app/rich/assets",
        "templates": "app/rich/templates",
        "overview": "app/rich/overview",
        "temp": "build/temp/rich"
    },
    "static": {
        "assets": "app/static",
        "temp": "build/temp/static"
    },
    "package": "build/package"
}

/* Start default workflow */
gulp.task('default', ['static'], function() {
    gulp.watch('app/**/*', ['static']);
});

gulp.task('clean', function() {
    return del(['build']);
});

gulp.task('compile', ['clean'], function() {
    var tasks = [];
    delete require.cache[require.resolve('./app/config.json')]
    var config = require('./app/config.json');

    for (var i in config.sizes) {
        for (var k in config.text) {
            for (var j in config.clicktags) {
                var clicktag = config.clicktags[j];
                var size = config.sizes[i];
                var language = k;
                var folderName = size+'-'+clicktag;
                var width = size.split('x')[0];
                var height = size.split('x')[1];

                var basePath = directories.rich.templates+'/css';
                var src = generateSrcFolders(basePath, ['**'], [clicktag,language,size], ['css']);
                tasks.push(gulp.src(src, {base: basePath})
                    .pipe(replace('{width}', width))
                    .pipe(replace('{height}', height))
                    .pipe(replace('{namespace}', id))
                    .pipe(replace('{clicktag}', clicktag))
                    .pipe(replace('{language}', language))
                    .pipe(sass())
                    .pipe(gulp.dest(directories.rich.temp+'/css'))
                    .pipe(minifyCss())
                    .pipe(rename({'suffix':'.min'}))
                    .pipe(gulp.dest(directories.rich.temp+'/css')));


                basePath = directories.rich.templates+'/html';
                src = generateSrcFolders(basePath, ['**'], [clicktag,language,size], ['html']);
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
                html.pipe(gulp.dest(directories.rich.temp+'/html'))
                    .pipe(minifyHtml())
                    .pipe(rename({'suffix':'.min'}))
                    .pipe(gulp.dest(directories.rich.temp+'/html'));

                tasks.push(html);


                basePath = directories.rich.templates+'/js';
                src = generateSrcFolders(basePath, ['**'], [clicktag,language,size], ['js']);
                src.push(basePath+'/includes/**/*.js')
                tasks.push(gulp.src(src, {base: basePath})
                    .pipe(replace('{width}', width))
                    .pipe(replace('{height}', height))
                    .pipe(replace('{size}', size))
                    .pipe(replace('{language}', language))
                    .pipe(replace('{clicktag}', clicktag))
                    .pipe(gulp.dest(directories.rich.temp+'/js'))
                    .pipe(stripDebug())
                    .pipe(uglify({mangle:false}))
                    .pipe(rename({suffix:'.min'}))
                    .pipe(gulp.dest(directories.rich.temp+'/js')));
            }
        }
    }

    return mergeStream(tasks);
});

gulp.task('generateHtml', ['compile'], function() {
    var overviewData = [];
    var overview = gulp.src(directories.rich.overview+'/index.html');
    var tasks = [];
    var config = require('./app/config.json');

    for (var i in config.sizes) {
        for (var k in config.text) {
            for (var j in config.clicktags) {
                var clicktag = config.clicktags[j];
                var size = config.sizes[i];
                var language = k;
                var folderName = size+'-'+clicktag;
                var width = size.split('x')[0];
                var height = size.split('x')[1];
                var basePath = directories.rich.assets;

                var src = generateSrcFolders(basePath, [], [language,size,clicktag], ['jpg','png','jpeg','gif','svg']);
                // console.log(src)
                // process.exit()

                tasks.push(gulp.src(src, {base: basePath})
                    .pipe(flatten())
                    .pipe(imageMin({
                        progressive: true
                    }))
                    .pipe(gulp.dest('build/'+folderName+'/'+language)));

                //normal
                var index = gulp.src(directories.rich.templates+'/index.html')
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

                index.pipe(replace(/(\/\/=include |\/\*=include |<!--=include )/g, '$1../../../'+directories.rich.temp+'/'))
                    .pipe(include())
                    .pipe(rename({'suffix':'.fat'}))
                    .pipe(gulp.dest('build/'+folderName+'/'+language));

                tasks.push(index);


                //minified
                var indexMin = gulp.src(directories.rich.templates+'/index.html')
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

                indexMin.pipe(replace(/(\/\/=include |\/\*=include |<!--=include )/g, '$1../../../'+directories.rich.temp+'/'))
                    .pipe(include())
                    .pipe(minifyHtml())
                    .pipe(gulp.dest('build/'+folderName+'/'+language));

                tasks.push(indexMin);
            }

            var bannerData = {
                width: width,
                height: height,
                src: '../'+folderName+'/'+language,
                language: language,
                folderName: folderName,
                size: size,
                clicktag: clicktag
            }

            if (!shouldExcludeBanner(config, [size, language, width, height, clicktag])) overviewData.push(bannerData)
            else console.log(`Excluding ${size} ${language} ${clicktag} from overview`)
        }
    }

    overview.pipe(replace('{data}', 'var data = '+JSON.stringify(overviewData)))
        .pipe(replace('{name}', config.name))
        .pipe(replace('{version}', config.version))
        .pipe(replace('{brand}', config.brand))
        .pipe(gulp.dest('build/overview'));

    tasks.push(overview);

    return mergeStream(tasks);
})

gulp.task('static', ['generateHtml'], function() {
    var tasks = []
    var config = require('./app/config.json');

    for (var language in config.text) {
        tasks.push(
            gulp.src('app/static/'+language+'/**/*')
                .pipe(imageMin({
                    progressive: true
                }))
                .pipe(gulp.dest(directories.static.temp+'/'+language))
        )
    }


     return mergeStream(tasks);
})
/* End default workflow */

/* Begin package workflow */
gulp.task('package', ['packageContinueTask']);
gulp.task('publish', ['packageContinueTask']);

gulp.task('cleanPackage', function() {
    return del(['build/package']);
});

gulp.task('validate', ['cleanPackage'], function() {
    var tasks = [];
    var config = require('./app/config.json');

    var customTests = [
        {
            test: function(html, files) {
                var regex = html.match(/\/\/=include |\/\*=include |<!--=include/g)
                return !(regex && Array.isArray(regex) && regex.length)
            },
            message: 'Include syntax found. Template has not compiled properly.'
        }
    ]

    for (var i in config.sizes) {
        for (var k in config.text) {
            for (var j in config.clicktags) {
                var clicktag = config.clicktags[j];
                var size = config.sizes[i];
                var language = k;

                if (shouldExcludeBanner(config, [size, language, clicktag])) {
                    console.log(`\tExcluding ${size} ${language} ${clicktag}`)
                    continue
                }

                //validate rich banner
                var task
                switch(clicktag) {
                    case "adwords":
                        task = gulp.src('build/'+size+'-'+clicktag+'/'+language+'/**/*')
                            .pipe(ignore.exclude(/index\.fat\.html/))
                            .pipe(adwords({size: config.filesize.rich, name:size+' '+language+' '+clicktag, customTests: customTests}))
                            .pipe(ignore.exclude(/\./))
                            .pipe(gulp.dest('.'))
                        break
                    case "doubleclick":
                    case "adgear":
                    default:
                        console.log(`Warning: ${size} ${language} ${clicktag} was not validated. ${clicktag} validation has not yet been implmented.`)
                        break
                }

               if (task) tasks.push(task)

                //validate static banner
                gulp.src('build/temp/static/'+language+'/'+size+'.{jpg,jpeg,png,gif}')
                    .pipe(through.obj(function(file, enc, cb) {
                        var name = file.path.match(/[^/]*$/g)[0]
                        var requiredDimensions = name.match(/[0-9]*x[0-9]*/g)[0]
                        var dimensions = imageSize(file.path)
                        dimensions = dimensions.width+'x'+dimensions.height

                        var size = file.stat.size
                        var requiredSize = config.filesize.static

                        //make sure the image dimensions match it's size
                        if (requiredDimensions !== dimensions) util.log(util.colors.red.bold('WARNING: ')+util.colors.cyan(name)+' dimensions do not match '+requiredDimensions+': '+util.colors.red(dimensions) )

                        //make sure the image size does not exceed the size specified in the config
                        if (size > requiredSize*1000) util.log(util.colors.red.bold('WARNING: ')+util.colors.cyan(name)+' exceeds filesize limit of '+requiredSize+' KB: '+util.colors.red(size/1000+' KB') )

                        cb(null, file)
                    }))
                    .pipe(ignore.exclude(/\./))
                    .pipe(gulp.dest('.'))
            }
        }
    }

    var noop = gulp.src('.').pipe(ignore.exclude(/\./)).pipe(gulp.dest('.'))
    if (!tasks.length) tasks.push(noop)
    return mergeStream(tasks)
})

gulp.task('packageTask', ['validate'], function() {
    var tasks = [];
    var config = require('./app/config.json');
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

                if (shouldExcludeBanner(config, [size, language, clicktag])) {
                    continue
                }
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

gulp.task('packageStaticTask', ['packageTask'], function() {
    var tasks = [];
    var config = require('./app/config.json');
    var year = new Date().getFullYear()
    var month = getMonth(new Date().getMonth())
    var brand = config.brand
    var version = config.version
    var name = config.name

    for (var h in config.sizes) {
        for (var j in config.clicktags) {
            for (var i in config.text) {
                var size = config.sizes[h]
                var clicktag = config.clicktags[j]
                var language = i
                var imageName = `${year}_${brand}Brand_RL_Other_${name}_Retail${month}_HTML5_CA_${language.toUpperCase()}_${size}`

                if (shouldExcludeBanner(config, [size, language, clicktag])) {
                    continue
                }
                tasks.push(gulp.src(directories.static.temp+'/'+language+'/'+size+'.*')
                    .pipe(rename({basename: imageName}))
                    .pipe(gulp.dest(directories.package+'/'+clicktag)));
            }
        }
    }

    return mergeStream(tasks);
})

gulp.task('packageContinueTask', ['packageStaticTask'], function() {
    var tasks = [];
    var config = require('./app/config.json');
    var year = new Date().getFullYear()
    var month = getMonth(new Date().getMonth())
    var brand = config.brand
    var version = config.version
    var name = config.name

    for (var j in config.clicktags) {
        var clicktag = config.clicktags[j]
        var name = `${year}_${brand}Brand_RL_Other_${name}_Retail${month}_HTML5_CA_${clicktag}_V${version}`

        tasks.push(gulp.src(directories.package+'/'+clicktag+'/**/*')
            .pipe(zip(name+'.zip'))
            .pipe(gulp.dest(directories.package)));
    }

    return mergeStream(tasks);
})
/* End package workflow */

/* Start version workflow */
gulp.task('version', function() {
    if (argv.reset) {
        gulp.src('./app/config.json')
            .pipe(jeditor({"version": "1"}))
            .pipe(gulp.dest('./app'))
    } else {
        gulp.src('./app/config.json')
            .pipe(jeditor(function(json) {
                json.version = String(Number(json.version) + 1)
                return json
            }))
            .pipe(gulp.dest('./app'))
    }
})
/* End version workflow */

/* Helper functions */
function generateSrcFolders(path,subfolders,params,extensions) {
    function allCombinationsOf (src, minLen, maxLen){
        minLen = minLen-1 || 0;
        maxLen = maxLen || src.length+1;
        var Asource = src.slice(); // copy the original so we don't apply results to the original.

        var Aout = [];

        var minMax = function(arr){
            var len = arr.length;
            if(len > minLen && len <= maxLen){
                Aout.push(arr);
            }
        }

        var picker = function (arr, holder, collect) {
            if (holder.length) {
               collect.push(holder);
            }
            var len = arr.length;
            for (var i=0; i<len; i++) {
                var arrcopy = arr.slice();
                var elem = arrcopy.splice(i, 1);
                var result = holder.concat(elem);
                minMax(result);
                if (len) {
                    picker(arrcopy, result, collect);
                } else {
                    collect.push(result);
                }
            }
        }

        picker(Asource, [], []);

        return Aout;
    }


    var src = [];
    if (typeof params === 'string') params = [params];
    if (typeof extensions !== undefined) {
        var extension = '{'
        for (var i in extensions) {
            extension = i == extensions.length-1 ? extension + extensions[i] : extension + extensions[i] + ','
        }
        extension += '}'
    }

    var permutations = allCombinationsOf(params, 1, 3)

    for (var i in permutations) {
        var path1 = ''
        for (var j in permutations[i]) {
            path1 = j == permutations[i].length-1 ? path1 + permutations[i][j] : path1 + permutations[i][j] + '/'
        }

        if (extensions !== undefined && extension.length) {
            src.push(path+'/'+path1+'/*.'+extension);
        } else {
            src.push(path+'/'+path1+'/*.*');
        }
        src.push(path+'/'+path1+'.*');

        for (var h in subfolders) {
            if (extensions !== undefined && extension.length) {
                src.push(path+'/'+subfolders[h]+'/'+path1+'/*.'+extension);
            } else {
                src.push(path+'/'+subfolders[h]+'/'+path1+'/*.*');
            }

            src.push(path+'/'+subfolders[h]+'/'+path1+'.*')
        }
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

function shouldExcludeBanner(config, params) {
    for (var i in config.exclude) {
        var matched = 0
        var exclusion = typeof config.exclude[i] === 'string' ? [config.exclude[i]] : config.exclude[i]

        for (var j in exclusion) {
            var val = exclusion[j]

            for (var h in params) {
                if (val == params[h]) {

                    if (++matched == exclusion.length) return true
                    break;
                }
            }
        }
    }
    return false
}