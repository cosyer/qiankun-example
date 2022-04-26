import Vue from 'vue'
import App from './App.vue'
import { registerMicroApps, start, setDefaultMountApp, addGlobalUncaughtErrorHandler } from 'qiankun'
import microApps from './micro-app'
import 'nprogress/nprogress.css'

Vue.config.productionTip = false

const instance = new Vue({
  render: h => h(App)
}).$mount('#app')

// 定义loader方法，loading改变时，将变量赋值给App.vue的data中的isLoading
function loader (loading) {
  if (instance && instance.$children) {
    // instance.$children[0] 是App.vue，此时直接改动App.vue的isLoading
    instance.$children[0].isLoading = loading
  }
}

// 给子应用配置加上loader方法
const apps = microApps.map(item => {
  return {
    ...item,
    loader
  }
})

// 注册子应用 生命周期钩子
registerMicroApps(apps, {
  beforeLoad: app => {
    // 加载微应用前，加载进度条
    // NProgress.start()
    console.log('before load app.name====>>>>>', app.name)
    return Promise.resolve()
  },
  beforeMount: [
    app => {
      console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name)
    }
  ],
  afterMount: [
    app => {
      // 微应用挂载完，进度条加载完成
      // NProgress.done()
      console.log('[LifeCycle] after mount %c%s', 'color: green;', app.name)
      return Promise.resolve()
    }
  ],
  afterUnmount: [
    app => {
      console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name)
    }
  ]
})

// 添加全局的未捕获异常处理器
addGlobalUncaughtErrorHandler((event) => {
  const { message: msg } = event
  // 加载失败时提示
  if (msg && msg.includes('died in status LOADING_SOURCE_CODE')) {
    alert('微应用加载失败，请检查应用是否可运行')
  }
})

// 设置默认渲染的应用
setDefaultMountApp('/sub-vue')

// 启动qiankun
start()
