import { createApp } from "vue";
import adminApp from "./adminApp.vue";
import "../css/site.scss";
import AppConfiguration from "./js/vueConfig/appConfiguration";
import { adminRouter } from "@js/routes/adminRoutes";
const app = createApp(adminApp);

const appConfig = new AppConfiguration(false, app, "#adminApp", adminRouter);

await appConfig.setup();
