import { createApp } from "vue";
import authApp from "./authApp.vue";
import "../css/site.scss";
import AppConfiguration from "./js/vueConfig/appConfiguration";
import { authRouter } from "@js/routes/authRoutes";

const app = createApp(authApp);

const appConfig = new AppConfiguration(false, app, "#authApp");
app.use(authRouter);

await appConfig.setup();
