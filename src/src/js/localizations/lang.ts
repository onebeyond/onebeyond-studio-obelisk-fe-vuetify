import sharedLocalisations from "@js/localizations/resources/shared";
import dateTimeFormats from "@js/localizations/resources/dateTimeFormats";
import LocalAppStorage from "@js/stores/localAppStorage";
import { createI18n } from "vue-i18n";

// Create VueI18n instance with options
const i18n = createI18n({
    locale: LocalAppStorage.getValueForKey("currentLocale") ?? "en", // set locale
    messages: sharedLocalisations, // set locale messages
    dateTimeFormats, // set datetime formats
    fallbackWarn: false,
    missingWarn: false,
    allowComposition: true,
    legacy: false
});

export { i18n };
