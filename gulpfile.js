/**
 * Created by admin on 2017/5/16.
 */
var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    smushit = require('gulp-smushit'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload');
    htmlmin = require('gulp-htmlmin'),
    fileinclude = require('gulp-file-include'),//可以使用@@include 来加载html代码块
    less = require('gulp-less-sourcemap'),
    path = require('path');


//html压缩
gulp.task('testHtmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('src/views/**/*.html')
        .pipe(fileinclude())
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist'));
});

// css
gulp.task('styles', function() {
    gulp.src('src/less/**/*.less')
        //map 方便查看源文件，不能和minifycss同时使用
        .pipe(less({
            sourceMap: {
                sourceMapRootpath: '../less' // Optional absolute or relative path to your LESS files
            }
        }))
        .pipe(minifycss()) //压缩  兼容IE7及以下需设置compatibility属性 .pipe(cssmin({compatibility: 'ie7'}))
        .pipe(gulp.dest('dist/styles'));
});

// 脚本
gulp.task('scripts', function() {
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint.reporter('default'))
        // .pipe(concat('main.js'))//压缩成一个main.js
        .pipe(gulp.dest('dist/scripts'))
        // .pipe(rename({ suffix: '.min' }))
        // .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

// 图片
gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        // .pipe(cache(
        //     smushit({
        //         verbose: true
        //     })
        // ))
        .pipe(gulp.dest('dist/images'))
        // .pipe(notify({ message: 'Images task complete' }));
});

// 清理
gulp.task('clean', function() {
    return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {read: false})
        .pipe(clean());
});

// 预设任务
gulp.task('default', ['clean'], function() {
    gulp.start('testHtmlmin','styles', 'scripts', 'images');
});

// 监听
gulp.task('watch', function() {
    // 监听所有.html
    gulp.watch('src/views/**/*.html', ['testHtmlmin']);

    // 监听所有.less
    gulp.watch('src/less/**/*.less', ['styles']);

    // 监听所有.js
    gulp.watch('src/scripts/**/*.js', ['scripts']);

    // 监听所有图片
    gulp.watch('src/images/**/*', ['images']);

    // 建立即时刷新，服务器端口号
    livereload.listen("8080");
    gulp.watch('dist/**/*.*',function(file){
        livereload.changed(file.path);
    });


});
// smushit 压缩jpg 和png 无损压缩 幅度50%（使用这个，虽然 很慢，但配合缓存可以）
gulp.task('min-images', function () {
    return gulp.src('src/images/**/*')
        .pipe(smushit({
            verbose: true
        }))
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({ message: 'Images task complete' }));
});
