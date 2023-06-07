import { useI18n } from "vue-i18n";
import { isToday, isFuture } from "date-fns";

export default function useRules() {
    const { t } = useI18n();
    
    const required = (value) => !!value || t("message.fieldRequired");
    
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    const email = (value) => emailRegex.test(value) || t("message.email");

    const max = (model: any, threshold: number) => {
        if (typeof model == 'string' || Array.isArray(model)) {
            return (value) => value.length <= threshold || t("message.maxCharacters", { max: threshold });
        } else if (typeof model == 'number') {
            return (value) => value <= threshold || t("message.maxNumber", { max: threshold });
        }
        return () => 'Invalid type passed in field';
    };

    const min = (model: any, threshold: number) => {
        if (typeof model == 'string' || Array.isArray(model)) {
            return (value) => value.length >= threshold || t("message.minCharacters", { min: threshold });
        } else if (typeof model == 'number') {
            return (value) => value >= threshold || t("message.minNumber", { min: threshold });
        }
        return () => 'Invalid type passed in field';
    };

    const length = (model: any, length: number) => {
        if (typeof model == 'string' || Array.isArray(model)) {
            return (value) => value.length == length || t("message.lengthCharacters", { length: length });
        } else if (typeof model == 'number') {
            return (value) => value == length || t("message.lengthNumber", { length: length });
        }
        return () => 'Invalid type passed in field';
    };

    const phoneRegex = /^\(?0( *\d\)?){9,10}$/;
    const phone = (value) => phoneRegex.test(value) || t("message.phone");

    const afterToday = (value) => isToday(value) || isFuture(value) || t("message.afterToday");

    const alphaDashRegex = /^[A-Za-z0-9_-]+$/;
    const alphaDash = (value) => alphaDashRegex.test(value) || t("message.alphaDash");

    const numeric = (value) => /^[0-9]+$/.test(value) || t("message.numeric");

    return {
        required,
        email,
        max,
        min,
        phone,
        afterToday,
        alphaDash,
        length,
        numeric
    };
}
