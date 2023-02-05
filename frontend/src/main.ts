/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

import "./styles/main.css";
import "./styles/alice-font.scss";
import "./styles/alicelanding.scss";
// import "./styles/variables.scss";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";

const app = createApp(App);

registerPlugins(app);

app.mount("#app");
