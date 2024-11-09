import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css';
import router from './Router'


createApp(App).use(router).mount('#app')
