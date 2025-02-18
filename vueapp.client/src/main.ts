//import './assets/main.css'
//import './assets/sass/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia';
import router from "./router"; // 추가된 부분
import App from './App.vue'
import { initializeServices } from '@/service/AgvServiceManager';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);

initializeServices();

app.mount('#app');
