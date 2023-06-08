import { isValid, format } from "date-fns";
import { MonthYearDate } from "./constants";

const filters = {
    showYesNo(value) {
        return value ? "Yes" : "No";
    },

    shortDate(value: string): string {
        const date = new Date(value);
        return isValid(date) ? date.toLocaleDateString() : "Invalid Date";
    },

    longDateTime(value: string): string {
        return `${this.shortDate(value)} ${this.timeOnlyAmPm(value)}`;
    },

    monthYearDate(value: string | number | Date) {
        if (!value) {
            return "";
        } else {
            const date = new Date(value);
            return format(date, MonthYearDate);
        }
    },

    timeOnlyAmPm(value: string): string {
        const date = new Date(value);
        return isValid(date) ? format(date, "hh:mm a") : "Invalid Date";
    },

    sizeInKb(value) {
        if (!value) return value;
        return (+value / 1024).toFixed(2);
    },

    currency(value, symbol, decimals, options): string {
        const digitsRE = /(\d{3})(?=\d)/g;
        options = options || {};
        value = parseFloat(value);
        if (!isFinite(value) || (!value && value !== 0)) return "";
        symbol = symbol != null ? symbol : "$";
        decimals = decimals != null ? decimals : 2;
        const thousandsSeparator = options.thousandsSeparator != null ? options.thousandsSeparator : ",";
        const symbolOnLeft = options.symbolOnLeft != null ? options.symbolOnLeft : true;
        const spaceBetweenAmountAndSymbol =
            options.spaceBetweenAmountAndSymbol != null ? options.spaceBetweenAmountAndSymbol : false;
        let stringified = Math.abs(value).toFixed(decimals);
        stringified = options.decimalSeparator ? stringified.replace(".", options.decimalSeparator) : stringified;
        const _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
        const i = _int.length % 3;
        const head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? thousandsSeparator : "") : "";
        const _float = decimals ? stringified.slice(-1 - decimals) : "";
        symbol = spaceBetweenAmountAndSymbol ? (symbolOnLeft ? symbol + " " : " " + symbol) : symbol;
        symbol = symbolOnLeft
            ? symbol + head + _int.slice(i).replace(digitsRE, "$1" + thousandsSeparator) + _float
            : head + _int.slice(i).replace(digitsRE, "$1" + thousandsSeparator) + _float + symbol;
        const sign = value < 0 ? "-" : "";
        return sign + symbol;
    },

    formatBytes(bytes: number, decimals = 2): string {
        if (bytes === 0) return "0 Bytes";

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }
};

export default filters;
