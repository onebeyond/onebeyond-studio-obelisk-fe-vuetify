const Vue = require("vue");
import store from "@js/stores/appStore";
import { i18n } from "@js/localizations/lang";
import { authRouter } from "@js/routes/authRoutes";
import AppConfiguration from "./vueConfig/appConfiguration";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

// NOTE: cannot use async / await on the top level with the current ES module version
new AppConfiguration(
    false, // Enable to see what variables are being set
    () => {
        const authAppInstance = new Vue({
            el: "#authApp",
            router: authRouter,
            store,
            i18n,
            vuetify: new Vuetify({
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
                    return link === authAppInstance.$route.name;
                }
            }
        });
    }
).setup();
