import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

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
import { createPinia } from "pinia";

import connectBroker from "@/protocol/mqtt";

import * as mqtt from "mqtt/dist/mqtt.min";

import { checkPermission } from "@/permission";

import gsap from "gsap";
import Draggable from "gsap/Draggable";
// import { SplashScreen } from '@capacitor/splash-screen';

import "notyf/notyf.min.css";
import "./assets/tailwind/style.css";
import "./assets/vue/transition.css";
import "./assets/vue/icons.css";
import "@flaticon/flaticon-uicons/css/regular/all.css";

declare module "vue" {
  interface ComponentCustomProperties {
    $clientMQTT: mqtt.MqttClient;
  }
}

const meta = document.createElement("meta");
const pinia = createPinia();

meta.name = "naive-ui-style";
document.head.appendChild(meta);

document.addEventListener("deviceready", async () => {

  checkPermission();
  
  const app = createApp(App).use(router).use(pinia);

  connectBroker(app);

  gsap.registerPlugin(Draggable);

  router.isReady().then(() => {
    app.mount("#app");
  });
});
