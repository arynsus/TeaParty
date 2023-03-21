import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 引入Arco Design
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';

// 引入自定义样式
import './assets/main.css'

const app = createApp(App)

app.use(router)
app.use(ArcoVue);
app.use(ArcoVueIcon);

app.mount('#app')