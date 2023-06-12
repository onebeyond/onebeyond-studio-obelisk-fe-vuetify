import "reflect-metadata"; // Needed to make "class-transformer" work properly
import "@js/util/stringExtensions";

//Global components
//NOTE: Only add here if truly required globally, doing so inflates the bundle size
import SessionTimeoutComponent from "@components/util/sessionTimeout.vue";
import UserContextSetter from "@components/obComponents/userContextSetter.vue";
import GlobalErrorHandler from "@components/util/globalErrorHandler.vue";
import ModalPopup from "@components/util/modalPopup.vue";

//Language selector for VueI18n
import LanguageSelector from "@components/obComponents/languageSelector.vue";
import WebApiClient from "@js/api/webApiClient";
import Configuration from "@js/configuration/configuration";
import LocalSessionStorage from "@js/stores/localSessionStorage";
import type { App } from "vue";
import type AppSettings from "@js/dataModels/settings/appSettings";
import { createPinia } from "pinia";
import { i18n } from "@js/localizations/lang";
import { SetGlobalProperties } from "@js/util/globalProperties";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import colors from "vuetify/lib/util/colors";

// import additional languages if needed
import { en, es } from "vuetify/lib/locale";

export default class AppConfiguration {
    private enableDebugLogging = false;
    private readonly app: App;
    private readonly rootContainerId: string;

    constructor(enableDebugLogging: boolean, app: App, rootContainerId: string) {
        // eslint-disable-line @typescript-eslint/ban-types
        this.enableDebugLogging = enableDebugLogging;
        this.app = app;
        this.rootContainerId = rootContainerId;
    }

    public async setup(): Promise<void> {
        this.log("App", `window.env = ${(window as any).env}`);

        await this.loadSettings();
    }

    private mount(): void {
        this.app.mount(this.rootContainerId);
    }

    private async loadSettings(): Promise<void> {
        await Configuration.load((window as any).env);
        this.inspect(Configuration.appSettings);

        this.setupVueVariables();
        this.registerPlugins();
        this.registerGlobalVueComponents();
        SetGlobalProperties(this.app);

        this.mount();
    }

    private setupVueVariables(): void {
        //custom globals on the vue instance
        this.app.config.globalProperties.$sessionTimeoutInMinutes =
            Configuration.appSettings.sessionTimeoutInMinutes || 60;
        this.app.config.globalProperties.$rootPath = (window as any).location.origin;

        this.setWebApiBaseUrl(Configuration.appSettings);

        this.app.provide("$buildNumber", process.env.BUILD_NUMBER);
        this.app.provide("$buildDate", process.env.BUILD_DATE);
        this.app.config.globalProperties.$buildNumber = process.env.BUILD_NUMBER;
        this.app.config.globalProperties.$buildDate = process.env.BUILD_DATE;
        this.log(
            "App",
            `this.app.config.globalProperties.$buildNumber = ${this.app.config.globalProperties.$buildNumber}`,
        );
        this.log("App", `this.app.config.globalProperties.$buildDate = ${this.app.config.globalProperties.$buildDate}`);

        //Disable devtools in production
        // const env = process.env.NODE_ENV || "development";
        // this.app.config.devtools = env == "development";
    }

    private setWebApiBaseUrl(appSettings: AppSettings): void {
        let customApiUrl: string | null = null;
        if (appSettings.allowApiUrlOverrideFromDevTools) {
            // Allow API Url to be overridden from console
            (window as any).setApiUrl = (url: string) => {
                LocalSessionStorage.setCustomApiUrl(url);
                location.reload();
            };
            (window as any).resetApiUrl = () => {
                LocalSessionStorage.setCustomApiUrl("");
                location.reload();
            };

            customApiUrl = LocalSessionStorage.getCustomApiUrl();
        }

        WebApiClient.WebApiRoot = customApiUrl || appSettings.apiUrl || "";
        this.log("App", `WebApiRoot = ${WebApiClient.WebApiRoot}`);
    }

    private registerPlugins(): void {
        // const vuetify = createVuetify({
        //     components,
        //     directives,
        //     lang: {
        //         locales: { en, es },
        //         current: "en"
        //     },
        //     theme: {
        //         themes: {
        //             light: {
        //                 primary: colors.green.darken3,
        //                 secondary: "#cccccc"
        //             }
        //         }
        //     }
        // });

        const myCustomLightTheme = {
            dark: false,
            colors: {
                background: "#AAAAAA",
                "on-background": "#000",
                surface: "#FFFFFF",
                primary: colors.green.darken3,
                "primary-darken-1": "#3700B3",
                secondary: "#cccccc",
                "secondary-darken-1": "#018786",
                error: "#B00020",
                info: "#2196F3",
                success: "#4CAF50",
                warning: "#FB8C00",
            },
        };

        const vuetify = createVuetify({
            components,
            directives,
            theme: {
                defaultTheme: "myCustomLightTheme",
                themes: {
                    myCustomLightTheme,
                },
            },
        });

        this.app.use(vuetify);
        const pinia = createPinia();
        this.app.use(pinia);

        this.app.use(i18n);
    }

    // NOTE: You should keep this to the minimum!
    private registerGlobalVueComponents(): void {
        this.app.component("session-timeout", SessionTimeoutComponent);
        this.app.component("user-context", UserContextSetter);
        this.app.component("v-modalPopup", ModalPopup);
        this.app.component("language-selector", LanguageSelector);
        this.app.component("global-error-handler", GlobalErrorHandler);
    }

    private inspect(object: any): void {
        if (this.enableDebugLogging) {
            console.log(object);
        }
    }

    private log(context: string, message: string): void {
        if (this.enableDebugLogging) {
            console.log(`[AppConfiguration][DEBUG][${context}] ${message}`);
        }
    }
}
