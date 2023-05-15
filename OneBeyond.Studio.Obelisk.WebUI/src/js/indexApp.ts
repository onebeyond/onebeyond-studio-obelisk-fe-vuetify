const Vue = require("vue");
import { i18n } from "@js/localizations/lang";
import { indexRouter } from "@js/routes/indexRoutes";
import AppConfiguration from "./vueConfig/appConfiguration";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

// import additional languages if needed
import { en, es } from "vuetify/src/locale";

Vue.use(Vuetify);

// NOTE: cannot use async / await on the top level with the current ES module version
new AppConfiguration(
    false, // Enable to see what variables are being set
    () => {
        const publicAppInstance = new Vue({
            el: "#indexApp",
            router: indexRouter,
            i18n,
            vuetify: new Vuetify({
                lang: {
                    locales: { en, es },
                    current: "en"
                },
                theme: {
                    themes: {
                        light: {
                            primary: "#338855"
                        }
                    }
                }
            }),
            components: {
                Event
            },
            methods: {
                isSelected(link) {
                    return link === publicAppInstance.$route.name;
                }
            }
        });
    }
).setup();
