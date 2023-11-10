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
import { Capacitor } from "@capacitor/core";
import { GlobalEvents } from 'vue-global-events';
import mitt from 'mitt';

import connectBroker from "@/protocol/mqtt";
import { connectSocketServer } from "@/protocol/ws";

import * as mqtt from "mqtt/dist/mqtt.min";

import { checkPermission } from "@/permission";
import { checkServiceDNS } from "@/mdns-discover";

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
const emitter = mitt();

meta.name = "naive-ui-style";
document.head.appendChild(meta);

const mountContext = async () => {
  checkPermission();

  const app = createApp(App).use(router).use(pinia);

  // register globally
app.component('GlobalEvents', GlobalEvents);
app.config.globalProperties.emitter = emitter;

  connectBroker(app);
  checkServiceDNS(async (ipDiscover: string | undefined) => {
    if(typeof ipDiscover === 'string') {
      connectSocketServer(ipDiscover);
    }
  });

  gsap.registerPlugin(Draggable);

  router.isReady().then(() => {
    app.mount("#app");
  });
};

if (Capacitor.getPlatform() === "web") {
  document.addEventListener("DOMContentLoaded", mountContext);
} else {
  document.addEventListener("deviceready", mountContext);
}
