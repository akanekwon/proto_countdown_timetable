gulp = require 'gulp'
gutil = require 'gulp-util'

# misc
clean = require 'gulp-clean'

# compilers
terser = require 'gulp-terser'
coffee = require 'gulp-coffee'
pug = require 'gulp-pug'


gulp.task 'script', ->
  gulp.src './coffee/*.coffee'
    .pipe coffee()
    .pipe terser()
    .pipe gulp.dest './js/'


gulp.task 'html', ->
  gulp.src './pug/*.pug'
    .pipe pug {pretty: true}
    .pipe gulp.dest './'

gulp.task 'watch', ->
  gulp.watch './coffee/*.coffee', gulp.task['script']
  gulp.watch './pug/*.pug', gulp.task['html']

gulp.task 'clean', ->
  gulp.src './js/main.js', {read:false}
    .pipe clean()
  gulp.src './*.html', {read:false}
    .pipe clean()

gulp.task 'default', gulp.series [gulp.parallel('script', 'html')]
