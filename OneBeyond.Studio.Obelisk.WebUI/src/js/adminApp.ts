const Vue = require("vue");
import store from "@js/stores/appStore";
import LocalSessionStorage from "@js/stores/localSessionStorage";
import { adminRouter } from "@js/routes/adminRoutes";
import { i18n } from "@js/localizations/lang";
import AppConfiguration from "./vueConfig/appConfiguration";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import colors from "vuetify/lib/util/colors";

import App from "@views/adminApp.vue";

// import additional languages if needed
import { en, es } from "vuetify/src/locale";

Vue.use(Vuetify);

// NOTE: cannot use async / await on the top level with the current ES module version
new AppConfiguration(
    false, // Enable to see what variables are being set
    () => {
        // Call a first time when the App is created
        // NOTE: This is needed here as the homepage loading does
        // not involve VueResource (so the interceptor is not called)
        LocalSessionStorage.updateLastServerRequestDate();

        new Vue({
            el: "#adminApp",
            router: adminRouter,
            store,
            vuetify: new Vuetify({
                lang: {
                    locales: { en, es },
                    current: "en"
                },
                theme: {
                    themes: {
                        light: {
                            primary: colors.green.darken3,
                            secondary: "#cccccc"
                        }
                    }
                }
            }),
            i18n,
            components: {
                Event
            },
            render: (h) => h(App)
        });
    }
).setup();
