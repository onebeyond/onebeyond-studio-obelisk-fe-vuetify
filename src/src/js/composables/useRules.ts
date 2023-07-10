import type { Ref } from "vue";
import { useI18n } from "vue-i18n";
import { isToday, isFuture } from "date-fns";
import type AuthApiClient from "@js/api/auth/authApiClient";

function isEmpty(value: unknown): boolean {
    if (value === null || value === undefined || value === "") {
        return true;
    }

    if (Array.isArray(value) && value.length === 0) {
        return true;
    }

    return false;
}

export default function useRules(params?: { fieldToMatch?: Ref<string> }) {
    const { t } = useI18n();

    const required = (value: unknown) => !!value || t("validation.required");

    const emailRegex =
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;

    const email = (value: unknown) => {
        if (isEmpty(value)) {
            return true;
        }
        return emailRegex.test(String(value)) || t("validation.email");
    };

    const maxCharacters = (threshold: number) => {
        return (value: unknown) => {
            if (isEmpty(value)) {
                return true;
            }
            return String(value).length <= threshold || t("validation.maxCharacters", { max: threshold });
        };
    };

    const maxValue = (threshold: number) => {
        return (value: unknown) => {
            if (isEmpty(value)) {
                return true;
            }
            return Number(value) <= threshold || t("validation.maxNumber", { max: threshold });
        };
    };

    const minCharacters = (threshold: number) => {
        return (value: unknown) => {
            if (isEmpty(value)) {
                return true;
            }
            return String(value).length >= threshold || t("validation.minCharacters", { min: threshold });
        };
    };

    const minValue = (threshold: number) => {
        return (value: unknown) => {
            if (isEmpty(value)) {
                return true;
            }
            return Number(value) >= threshold || t("validation.minNumber", { min: threshold });
        };
    };

    const length = (length: number) => {
        return (value: unknown) => {
            if (isEmpty(value)) {
                return true;
            }
            return String(value).length === length || t("validation.lengthCharacters", { length: length });
        };
    };

    const phoneRegex = /^\(?0( *\d\)?){9,10}$/;
    const phone = (value: unknown) => {
        if (isEmpty(value)) {
            return true;
        }
        return phoneRegex.test(String(value)) || t("validation.phone");
    };

    // parse date string in format dd/mm/yyyy (hh:mm)
    function parseDate(dateString: string): Date {
        const dateParts = dateString.split(" ")[0].split("/");
        return new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
    }

    const afterToday = (value: unknown) => {
        if (isEmpty(value)) {
            return true;
        }
        return isToday(parseDate(String(value))) || isFuture(parseDate(String(value))) || t("validation.afterToday");
    };

    const alphaDashRegex = /^[A-Za-z0-9_-]+$/;
    const alphaDash = (value: unknown) => {
        if (isEmpty(value)) {
            return true;
        }
        return alphaDashRegex.test(String(value)) || t("validation.alphaDash");
    };

    const numeric = (value: unknown) => {
        if (isEmpty(value)) {
            return true;
        }
        return /^\d+$/.test(String(value)) || t("validation.numeric");
    };

    const hasDigit = (value: unknown) => {
        if (isEmpty(value)) {
            return true;
        }
        return /\d/.test(String(value)) || t("validation.requiresDigit");
    };

    const hasNonAlphanumeric = (value: unknown) => {
        if (isEmpty(value)) {
            return true;
        }
        return !/^[a-z0-9]+$/i.test(String(value)) || t("validation.requiresNonAlphanumeric");
    };

    const hasCapital = (value: unknown) => {
        if (isEmpty(value)) {
            return true;
        }
        return /[A-Z]/.test(String(value)) || t("validation.requiresCapital");
    };

    const hasNonCapital = (value: unknown) => {
        if (isEmpty(value)) {
            return true;
        }
        return /[a-z]/.test(String(value)) || t("validation.requiresNonCapital");
    };

    const hasUniqueCharacters = (count: number) => {
        return (value: unknown) => {
            if (isEmpty(value)) {
                return true;
            }
            return new Set(String(value)).size >= count || t("validation.requiresUniqueCharacters", { count: count });
        };
    };

    const passwordMatch = (value: unknown) => {
        if (isEmpty(value)) {
            return true;
        }
        return value === params?.fieldToMatch?.value || t("validation.requiresPasswordMatch");
    };

    async function getPasswordValidationRules(authApiClient: AuthApiClient) {
        const passwordRequirements = await authApiClient.getPasswordRequirements();

        return [
            required,
            passwordRequirements.requireDigit ? hasDigit : null,
            passwordRequirements.requiredLength ? minCharacters(passwordRequirements.requiredLength) : null,
            passwordRequirements.requireNonAlphanumeric ? hasNonAlphanumeric : null,
            passwordRequirements.requireUppercase ? hasCapital : null,
            passwordRequirements.requireLowercase ? hasNonCapital : null,
            passwordRequirements.requiredUniqueChars
                ? hasUniqueCharacters(passwordRequirements.requiredUniqueChars)
                : null,
        ];
    }

    return {
        required,
        email,
        maxCharacters,
        maxValue,
        minCharacters,
        minValue,
        length,
        phone,
        afterToday,
        alphaDash,
        numeric,
        hasDigit,
        hasNonAlphanumeric,
        hasCapital,
        hasNonCapital,
        hasUniqueCharacters,
        passwordMatch,
        getPasswordValidationRules,
    };
}
