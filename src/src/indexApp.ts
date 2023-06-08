import { createApp } from "vue";
import indexApp from "./indexApp.vue";
import "../css/site.scss";
import AppConfiguration from "./js/vueConfig/appConfiguration";
import { indexRouter } from "@js/routes/indexRoutes";

const app = createApp(indexApp);

const appConfig = new AppConfiguration(false, app, "#indexApp");
app.use(indexRouter);

await appConfig.setup();
