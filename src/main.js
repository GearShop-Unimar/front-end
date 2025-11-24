import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { mask } from "vue-the-mask";

import App from "./App.vue";
import router from "./router";
import Icon from "./components/Icon.vue";

const app = createApp(App);

const toastOptions = {
  position: "top-right",
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
};

app.use(createPinia());
app.use(router);
app.use(Toast, toastOptions);

app.directive("mask", mask);

// Registro global do componente de ícones
app.component('Icon', Icon);

app.mount("#app");
