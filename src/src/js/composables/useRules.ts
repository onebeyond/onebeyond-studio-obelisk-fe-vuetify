import type { Ref } from "vue";
import { useI18n } from "vue-i18n";
import { isToday, isFuture } from "date-fns";
import type AuthApiClient from "@js/api/auth/authApiClient";

export default function useRules(params?: { fieldToMatch?: Ref<string> }) {
    const { t } = useI18n();
    
    const required = (value) => !!value || t("validation.required");
    
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;

    const email = (value) => emailRegex.test(value) || t("validation.email");

    const max = (model: any, threshold: number) => {
        if (typeof model == 'string' || Array.isArray(model)) {
            return (value) => value.length <= threshold || t("validation.maxCharacters", { max: threshold });
        } else if (typeof model == 'number') {
            return (value) => value <= threshold || t("validation.maxNumber", { max: threshold });
        }
        return () => 'Invalid type passed in field';
    };

    const min = (model: any, threshold: number) => {
        console.log("min input", typeof model);
        if (typeof model == 'string' || Array.isArray(model)) {
            return (value) => value.length >= threshold || t("validation.minCharacters", { min: threshold });
        } else if (typeof model == 'number') {
            return (value) => value >= threshold || t("validation.minNumber", { min: threshold });
        }
        return () => 'Invalid type passed in field';
    };

    const length = (model: any, length: number) => {
        if (typeof model == 'string' || Array.isArray(model)) {
            return (value) => value.length == length || t("validation.lengthCharacters", { length: length });
        } else if (typeof model == 'number') {
            return (value) => value == length || t("validation.lengthNumber", { length: length });
        }
        return () => 'Invalid type passed in field';
    };

    const phoneRegex = /^\(?0( *\d\)?){9,10}$/;
    const phone = (value) => phoneRegex.test(value) || t("validation.phone");

    // parse date string in format dd/mm/yyyy (hh:mm)
    function parseDate(dateString: string) : Date {
        const dateParts = dateString.split(" ")[0].split("/");
        return new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
    }

    const afterToday = (value) => isToday(parseDate(value)) || isFuture(parseDate(value)) || t("validation.afterToday");

    const alphaDashRegex = /^[A-Za-z0-9_-]+$/;
    const alphaDash = (value) => alphaDashRegex.test(value) || t("validation.alphaDash");

    const numeric = (value) => /^[0-9]+$/.test(value) || t("validation.numeric");

    const hasDigit = (value) => /\d/.test(value) || t("validation.requiresDigit");

    const hasNonAlphanumeric = (value) => !/^[a-z0-9]+$/i.test(value) || t("validation.requiresNonAlphanumeric");

    const hasCapital = (value) => /[A-Z]/.test(value) || t("validation.requiresCapital");

    const hasNonCapital = (value) => /[a-z]/.test(value) || t("validation.requiresNonCapital");

    const hasUniqueCharacters = (count: number) => {
        return (value) => new Set(value).size >= count || t("validation.requiresUniqueCharacters", {count: count});
    }

    async function getPasswordValidationRules(authApiClient: AuthApiClient) {
        const passwordRequirements = await authApiClient.getPasswordRequirements();
    
        return [
            required,
            passwordRequirements.requireDigit ? hasDigit : null,
            passwordRequirements.requiredLength ? min(String(), passwordRequirements.requiredLength) : null,
            passwordRequirements.requireNonAlphanumeric ? hasNonAlphanumeric :null,
            passwordRequirements.requireUppercase ? hasCapital : null,
            passwordRequirements.requireLowercase ? hasNonCapital : null,
            passwordRequirements.requiredUniqueChars ? hasUniqueCharacters(passwordRequirements.requiredUniqueChars) : null
        ]
    };
    
    const passwordMatch = (value) => value === params?.fieldToMatch?.value || t('validation.requiresPasswordMatch');

    return {
        required,
        email,
        max,
        min,
        phone,
        afterToday,
        alphaDash,
        length,
        numeric,
        hasDigit,
        hasNonAlphanumeric,
        hasCapital,
        hasNonCapital,
        hasUniqueCharacters,
        getPasswordValidationRules,
        passwordMatch
    };
}
