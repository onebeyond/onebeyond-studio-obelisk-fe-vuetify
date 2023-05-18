import type { App, ComponentCustomProperties } from "vue";
import eventBus from "@js/eventBus";
import Configuration from "@js/configuration/configuration";

let global: ComponentCustomProperties;

const SetGlobalProperties = (app: App) => {
    const rootPath: string = Configuration.appSettings.apiUrl;
    const basePath: string = (window as any).BaseUrl;

    //custom globals on the vue instance
    app.config.globalProperties.$basePath = basePath;
    app.config.globalProperties.$rootPath = rootPath;
    app.config.globalProperties.$rootApiPath = rootPath + "api/";
    app.config.globalProperties.$bus = eventBus;

    global = { ...app.config.globalProperties };
};

export { global, SetGlobalProperties };
