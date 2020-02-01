del = require 'del'
gulp = require 'gulp'
browserSync = require 'browser-sync'
reload = browserSync.reload

# compilers
terser = require 'gulp-terser'
coffee = require 'gulp-coffee'
pug = require 'gulp-pug'
sass = require 'gulp-sass'

gulp.task 'coffee', ->
  gulp.src './coffee/*.coffee'
    .pipe coffee()
    .pipe terser()
    .pipe gulp.dest './js/'

gulp.task 'sass', ->
  gulp.src './sass/*.scss'
    .pipe sass(outputStyle: 'expanded')
    .pipe gulp.dest './css/'

gulp.task 'pug', ->
  gulp.src './pug/*.pug'
    .pipe pug (pretty: true)
    .pipe gulp.dest './'

gulp.task 'serve', ->
  browserSync({
    notify: false,
    server: {
      baseDir: ['./']
    }
  })
  gulp.watch './coffee/*.coffee', gulp.task 'coffee', reload
  gulp.watch './sass/*.scss', gulp.task 'sass', reload
  gulp.watch './pug/*.pug', gulp.task 'pug', reload

gulp.task 'clean', (done) ->
  del(['./js/main.js', './*.html', './css/main.css'], done)

gulp.task 'default', gulp.series ['clean', gulp.parallel('coffee', 'sass', 'pug')]
