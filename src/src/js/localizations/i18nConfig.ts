import LocalAppStorage from "../stores/localAppStorage";

const i18nConfig = {
    use(currentLocale: string) {
        if (currentLocale !== LocalAppStorage.getValueForKey("currentLocale")) {
            LocalAppStorage.setValueForKey("currentLocale", currentLocale);
        }
    }
};

export { i18nConfig };
