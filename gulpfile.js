var gulp = require('gulp'), //main plugin
    sass = require('gulp-sass'), // sass
    autoprefixer = require('gulp-autoprefixer'), //auto prefixer
    watch = require('gulp-watch'), //watcher
    jade = require('gulp-jade'), //jade
    imagemin = require('gulp-imagemin'), // сжатие картинок
    pngquant = require('imagemin-pngquant'), // сжатие картинок
    sourcemaps = require('gulp-sourcemaps'), //source map
    notify = require('gulp-notify'), //notify
    gutil = require('gulp-util'), //util
    spritesmith = require('gulp.spritesmith'), //sprite
    cmq = require('gulp-combine-media-queries'), //cobine media query
    browserSync = require('browser-sync').create();


//     watch = require('gulp-watch'),
//     refresh = require('gulp-livereload'),
//     connect = require('gulp-connect'),
//     webserver = require('gulp-webserver'),
//     lr = require('tiny-lr'),
//     jade = require('gulp-jade'),
//     sass = require('gulp-sass'),
//     autoprefixer = require('gulp-autoprefixer'),
//     imagemin = require('gulp-imagemin'),
//     pngquant = require('imagemin-pngquant'),
//     notify = require('gulp-notify'),
//     gutil = require('gulp-util'),
//     fs = require('fs'),
//     sourcemaps = require('gulp-sourcemaps'),
//     spritesmith = require('gulp.spritesmith');

// var server = lr();

// PATH
var path = {
  // Пути, куда складывать готовые после сборки файлы
  build: {
      html: 'build/',
      css: 'build/css/',
      js: 'build/js/',
      img: 'build/img/',
      pic: 'build/pic/',
      fonts: 'build/fonts/'
  },
  // Пути откуда брать исходники
  src: {
      jade: 'src/jade/*.jade',
      scss: 'src/scss/*.scss',
      js: 'src/js/*.js',
      img: 'src/img/**/*.*',//Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
      spr: 'src/img/icons/*.png',     //Выбираем все картинки в папке с спрайтами
      pic: 'src/pic/**/*.*',
      fonts: 'src/fonts/*.*',
  },
  // Указываем, за изменением каких файлов мы хотим наблюдать
  watch: {
    jade: 'src/jade/*.jade',
    scss: 'src/scss/**/*.scss*',
    img: 'src/img/**/*.*',
    pic: 'src/pic/**/*.*',
    js: 'src/js/*.js',
    fonts: 'src/fonts/*.*',
  }
};


/** MAIN **/
// SASS
gulp.task('scss', function () {
  gulp.src(path.src.scss)
    .pipe(sourcemaps.init())
    .pipe(sass({
        includePaths: [path.src.scss],
        // style: 'compressed',
        // precision: 10,
        errLogToConsole: true
    }).on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ["last 50 version", "> 1%", "ie 8", "ie 7"],
        cascade: true
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.stream());
});

gulp.task('cmq', function () {
  gulp.src('build/css/all.css')
    .pipe(cmq({
      log: true
    }))
    .pipe(gulp.dest('dist'));
});

//Jade Task
gulp.task('jade', function() {
  gulp.src(path.src.jade)
    .pipe(jade({
      // locals:'index.html',
      pretty: true
    }))
    .on('error', function(err){
      gutil.log(gutil.colors.red(err))
    })
    .pipe(gulp.dest(path.build.html))
    // .pipe(refresh(server))
    .pipe(notify({ message: 'Your Jade file has been molded into HTML.' }));
});

//JS uglify
gulp.task('js', function() {
  gulp.src(path.src.js)
    // .pipe(concat('main.js'))
    .pipe(gulp.dest(path.build.js))
    .pipe(notify({ message: 'Your JS file has been uglify.' }));
});
//IMG Min Task
gulp.task('imgmin', function () {
  return gulp.src(path.src.img)
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant({
          quality: '60-80',
          speed: 4
        })]
    }))
    .pipe(gulp.dest(path.build.img))
    .pipe(notify({ message: 'Your IMG file has been minify.' }));
});
gulp.task('picmin', function () {
  return gulp.src(path.src.pic)
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant({
          quality: '60-80',
          speed: 4
        })]
    }))
    .pipe(gulp.dest(path.build.pic))
    .pipe(notify({ message: 'Your IMG file has been minify.' }));
});

// FONTS
gulp.task('fonts', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('sprite', function() {
    var spriteData =
        gulp.src('img/icons/*.png') // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: 'sprite-icons.png',
                cssName: '_sprite-icons.scss',
                imgPath: '../img/sprite-icons.png',
                algorithm: 'top-down',
                cssOpts: {
                      functions: false
                    },
            }));
 /*   var spriteData =
        gulp.src('img/icons-menu/*.png') // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: 'sprite-menu.png',
                cssName: '_sprite-menu.scss',
                imgPath: '../img/sprite-menu.png',
                algorithm: 'top-down'
            }));*/
    // var spriteData =
    //     gulp.src('img/icons-nav/*.png') // путь, откуда берем картинки для спрайта
    //         .pipe(spritesmith({
    //             imgName: 'sprite-nav.png',
    //             cssName: '_sprite-nav.scss',
    //             imgPath: '../img/sprite-nav.png',
    //             algorithm: 'top-down'
    //         }));
    // var spriteData =
    //     gulp.src('img/icons-preview/*.png') // путь, откуда берем картинки для спрайта
    //         .pipe(spritesmith({
    //             imgName: 'sprite-preview.png',
    //             cssName: '_sprite-preview.scss',
    //             imgPath: '../img/sprite-preview.png',
    //             algorithm: 'top-down'
    //         }));
    spriteData.img.pipe(gulp.dest('./img/')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('./scss/')); // путь, куда сохраняем стили
});
// All Task


gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
    gulp.watch("src/scss/*.scss", ['scss']);
    gulp.watch("build/*.html").on('change', browserSync.reload);
});

/** WATCH **/
gulp.task('watch', ['browser-sync'], function() {
  gulp.watch(path.src.jade, ['jade']);
  gulp.watch(path.src.scss, ['scss']);
  gulp.watch(path.src.js, ['js']);
  gulp.watch(path.src.img, ['imgmin']);
  gulp.watch(path.src.pic, ['picmin']);
  gulp.watch(path.src.fonts, ['fonts']);
});