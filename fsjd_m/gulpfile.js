// nodejs环境  == 模块化规范为 commonjs
const { series, src, dest, watch } = require('gulp');
// gulp编译sass
const sass = require('gulp-sass');
// 合并css
const cssConcat = require('gulp-concat')
// 压缩css
const cleanCss = require('gulp-clean-css')
// 样式属性名加上前缀
const autoprefixer = require('gulp-autoprefixer')
// souceMap
const sourcemaps = require('gulp-sourcemaps')

// ts
const ts = require('gulp-typescript')
const tsProject = ts.createProject("tsconfig.json");
// es6转低版本
const babel = require('gulp-babel')
// 压缩js
const uglify = require('gulp-uglify')

// 图片压缩
const imagemin = require('gulp-imagemin');

// html压缩
const htmlmin = require('gulp-htmlmin')

// 网络
// 静态服务器
const connect = require('gulp-connect')
// 自动帮你打开浏览
const open = require('open')
// 反向代理 解决跨域
const { createProxyMiddleware: proxy } = require('http-proxy-middleware')

// 复制目录 src/assets 目录 复制到 dist/assets
function copyTask() {
  return src([
    'src/assets/**/*',
    '!src/assets/images/**/*',
  ])
    .pipe(dest('dist/assets'))
    .pipe(connect.reload())
}

// css处理
function styleTask() {
  return src([
    'src/styles/**/*.scss',
    'src/styles/**/*.css'
  ])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      add: true,
      remove: true
    }))
    .pipe(cssConcat('main.css'))
    .pipe(cleanCss())
    .pipe(sourcemaps.write())
    .pipe(dest('dist/styles'))
    .pipe(connect.reload())
}

// ts
function tsTask() {
  return src('src/scripts/ts/**/*.ts')
    .pipe(tsProject())
    .js.pipe(dest("dist/ts"))
    // .pipe(babel({ presets: ['@babel/env'] }))
    // .pipe(uglify())
    .pipe(dest("dist/scripts/ts"))
    .pipe(connect.reload())
}
// js
function jsTask() {
  return src('src/scripts/js/**/*.js')
    // .pipe(babel({ presets: ['@babel/env'] }))
    // .pipe(uglify())
    .pipe(dest("dist/scripts/js"))
    .pipe(connect.reload())
}

function componentsTask() {
  return src('src/components/**/*.ts')
    .pipe(tsProject())
    .js.pipe(dest("dist/components"))
    // .pipe(babel({ presets: ['@babel/env'] }))
    // .pipe(uglify())
    .pipe(dest("dist/components"))
    .pipe(connect.reload())
}

function commonTask() {
  return src('src/common/**/*.ts')
    .pipe(tsProject())
    .js.pipe(dest("dist/common"))
    // .pipe(babel({ presets: ['@babel/env'] }))
    // .pipe(uglify())
    .pipe(dest("dist/common"))
    .pipe(connect.reload())
}


function storeTask() {
  return src('src/store/**/*.ts')
    .pipe(tsProject())
    .js.pipe(dest("dist/store"))
    // .pipe(babel({ presets: ['@babel/env'] }))
    // .pipe(uglify())
    .pipe(dest("dist/store"))
    .pipe(connect.reload())
}

function routerTask() {
  return src('src/router/**/*.ts')
    .pipe(tsProject())
    .js.pipe(dest("dist/router"))
    // .pipe(babel({ presets: ['@babel/env'] }))
    // .pipe(uglify())
    .pipe(dest("dist/router"))
    .pipe(connect.reload())
}

function handlerTask() {
  return src('src/handlerType/**/*.ts')
    .pipe(tsProject())
    .js.pipe(dest("dist/handlerType"))
    // .pipe(babel({ presets: ['@babel/env'] }))
    // .pipe(uglify())
    .pipe(dest("dist/handlerType"))
    .pipe(connect.reload())
}

function interTask() {
  return src('src/interfaceList/**/*.ts')
    .pipe(tsProject())
    .js.pipe(dest("dist/interfaceList"))
    // .pipe(babel({ presets: ['@babel/env'] }))
    // .pipe(uglify())
    .pipe(dest("dist/interfaceList"))
    .pipe(connect.reload())
}


function networkTask() {
  return src('src/network/**/*.ts')
    .pipe(tsProject())
    .js.pipe(dest("dist/network"))
    // .pipe(babel({ presets: ['@babel/env'] }))
    // .pipe(uglify())
    .pipe(dest("dist/network"))
    .pipe(connect.reload())
}

// 图片压缩
function imageMinTask() {
  return src('src/assets/images/**/*.{jpg,png,jpeg,gif}')
    .pipe(imagemin())
    .pipe(dest('./dist/images'))
}

// html处理
function htmlTask() {
  return src('src/views/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('dist'))
    // 有修改则通过静态服务器更新了
    .pipe(connect.reload())
}


// 返回一个promise或自带的流，则不需要调用cb回调函数，否则要调用一下
function defaultTask(cb) {
  console.log('hello gulp')
  cb()
}


// 服务
function serverTask() {
  connect.server({
    port: 8080,
    root: '',
    // 实时更新 热更新
    livereload: true,
    // 反向代理 服务器与服务器之间没有跨域问题
    middleware: function () {
      return [
        proxy('/api', {
          target: 'http://www.jq.com',
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
        })
      ]
    }
  })
  // 打开浏览器，并访问到此网址
  open('http://localhost:8080')
  // 监听对应文件的变化
  // 调用监听
  watch('src/styles/**/*', styleTask)
  watch('src/scripts/ts/**/*.ts', tsTask)
  watch('src/scripts/js/**/*.js', jsTask)
  watch('src/views/**/*.html', htmlTask)
  watch('src/components/**/*.ts', componentsTask)
  watch('src/common/**/*.ts', commonTask)
  watch('src/store/**/*.ts', storeTask)
  watch('src/router/**/*.ts', routerTask)
  watch('src/handlerType/**/*.ts', handlerTask)
  watch('src/InterfaceList/**/*.ts', interTask)
  watch('src/network/**/*.ts', networkTask)
}

// 开发
module.exports.default = series(serverTask)

// 生成
// 导出 npx gulp
module.exports.build = series(
  copyTask,
  styleTask,
  jsTask,
  tsTask,
  componentsTask,
  commonTask,
  imageMinTask,
  htmlTask,
  defaultTask,
  storeTask,
  routerTask,
  handlerTask,
  interTask,
  networkTask
)




