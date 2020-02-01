gulp = require 'gulp'
gutil = require 'gulp-util'

# misc
clean = require 'gulp-clean'

# compilers
terser = require 'gulp-terser'
coffee = require 'gulp-coffee'


gulp.task 'script', ->
  gulp.src 'coffee/*.coffee'
    .pipe coffee()
    .pipe terser()
    .pipe gulp.dest 'js/'

gulp.task 'compile-js', () ->
  compileFileName = 'main.js'
  gulp.src 'js/main.js'
    .pipe terser()
    .pipe gulp.dest 'js/'

gulp.task 'watch', ->
  gulp.watch 'coffee/*.coffee', gulp.task 'script'

gulp.task 'clean', ->
  gulp.src 'js/main.js', {read:false}
    .pipe clean()

gulp.task 'default', gulp.series ['script']
