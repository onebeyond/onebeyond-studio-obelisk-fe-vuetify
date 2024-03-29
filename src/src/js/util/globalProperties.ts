import type { App, ComponentCustomProperties } from "vue";
import eventBus from "@js/eventBus";
import filters from "@js/util/filters";
import Configuration from "@js/configuration/configuration";

let global: ComponentCustomProperties;

const SetGlobalProperties = (app: App) => {
    const rootPath: string = Configuration.appSettings.apiUrl;
    const basePath: string = window.BaseUrl;

    //custom globals on the vue instance
    app.config.globalProperties.$basePath = basePath;
    app.config.globalProperties.$rootPath = rootPath;
    app.config.globalProperties.$rootApiPath = rootPath + "api/";
    app.config.globalProperties.$bus = eventBus;
    app.config.globalProperties.$filters = filters;

    global = { ...app.config.globalProperties };
};

export { global, SetGlobalProperties };
