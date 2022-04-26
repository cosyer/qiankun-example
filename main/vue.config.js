module.exports = {
  transpileDependencies: ['common'], // babel显式转译依赖
  chainWebpack: config => {
    config.plugin('html')
      .tap((args) => {
        args[0].title = 'qiankun-example'
        return args
      })
  }
}
