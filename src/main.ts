import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
// import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
// import '@ionic/vue/css/normalize.css';
// import '@ionic/vue/css/structure.css';
// import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
// import '@ionic/vue/css/padding.css';
// import '@ionic/vue/css/float-elements.css';
// import '@ionic/vue/css/text-alignment.css';
// import '@ionic/vue/css/text-transformation.css';
// import '@ionic/vue/css/flex-utils.css';
// import '@ionic/vue/css/display.css';

/* Theme variables */
// import './theme/variables.css';
import { createPinia } from 'pinia'

import { checkPermission } from '@/permission';

import gsap from 'gsap';
import Draggable from 'gsap/Draggable';

import './assets/tailwind/style.css'
import './assets/vue/transition.css'
import './assets/vue/icons.css'
import '@flaticon/flaticon-uicons/css/regular/all.css'

const meta = document.createElement('meta')
const pinia = createPinia()

meta.name = 'naive-ui-style'
document.head.appendChild(meta)

document.addEventListener('deviceready', checkPermission);

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(pinia)

gsap.registerPlugin(Draggable);
  
router.isReady().then(() => {
  app.mount('#app');
});