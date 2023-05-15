import { veeValidateLocale } from "@js/localizations/thirdParty/veeValidate";
import LocalAppStorage from "../stores/localAppStorage";

const i18nConfig = {
    use(currentLocale: string) {
        if (currentLocale !== LocalAppStorage.getValueForKey("currentLocale")) {
            LocalAppStorage.setValueForKey("currentLocale", currentLocale);
            // Set the locale for Vee-Validate
            veeValidateLocale.use(currentLocale);
        }
    }
};

export { i18nConfig };
