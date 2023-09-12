import { format, set, endOfDay } from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";

export abstract class DateTime {
    public static readonly isoStringRegex =
        /(?<year>-?(?:[1-9][0-9]*)?[0-9]{4})-(?<month>1[0-2]|0[1-9])-(?<day>3[01]|0[1-9]|[12][0-9])T(?<hour>2[0-3]|[01][0-9]):(?<minute>[0-5][0-9]):(?<second>[0-5][0-9])(?<ms>\.[0-9]+)?(?<timezone>Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?/g;

    public static toZonedISOString(date: Date, timespan: string, timeZoneId: string): string {
        let dateTime = DateTime.setTime(date, timespan);
        const dateTimeAsString = format(dateTime, "yyyy-MM-dd HH:mm");
        dateTime = toDate(dateTimeAsString, { timeZone: timeZoneId });
        return dateTime.toISOString();
    }

    public static getISOStringDateAndTimeParts(isoString: string): [string, string] {
        const [date, time] = isoString.split("T");
        return [date, time.substring(0, 5)];
    }

    public static isISOString(value: string): boolean {
        return value.match(DateTime.isoStringRegex) ? value.match(DateTime.isoStringRegex)!.length > 0 : false;
    }

    public static splitDateAndTime(date: Date | string, timeZoneId: string): [Date, string] {
        const dateAsString = formatInTimeZone(date, timeZoneId, "yyyy-MM-dd HH:mm");
        return DateTime.parseDateAndTime(dateAsString);
    }

    public static toZonedDate(date: Date, timeZoneId: string, timespan: string = ''): Date {
        const dateTime = DateTime.setTime(date, timespan);
        const dateTimeAsString = format(dateTime, "yyyy-MM-dd HH:mm");
        return toDate(dateTimeAsString, { timeZone: timeZoneId });
    }

    public static toZoneDate(date: Date, timeZoneId: string): Date {
        return toDate(new Date(date), { timeZone: timeZoneId });
    }

    public static getEndOfDay(date: Date): Date {
        return endOfDay(date);
    }

    public static formatDate(date: Date | string): string {
        return formatInTimeZone(date, DateTime.getCurrentTimeZoneId(), "dd/MM/yyyy");
    }

    public static formatDateTime(date: Date | string): string {
        return formatInTimeZone(date, DateTime.getCurrentTimeZoneId(), "dd/MM/yyyy HH:mm");
    }

    public static getCurrentTimeZoneId(): string {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    public static getConvertedDate(value: Date, isUTC: boolean): string {
        const dateTimeAsString = format(value, "yyyy-MM-dd HH:mm:ss.SSS");
    
        if (!isUTC) {
            const dateTime = toDate(dateTimeAsString, { timeZone: "UTC" });
            console.log(dateTime);
            return dateTime.toISOString();
        }
        const dateTime = toDate(dateTimeAsString, { timeZone: DateTime.getCurrentTimeZoneId() });
        return dateTime.toISOString();
    }

    public static getDateOnly(value: Date): string {
        return format(value, "dd/MM/yyyy");
    }

    private static parseDateAndTime(date: string): [Date, string] {
        const [dateString, timeString] = date.split(" ");
        return [new Date(`${dateString} 00:00:00`), timeString];
    }

    private static setTime(date: Date, timespan: string): Date {
        if (timespan != "") {
            const [hh, mm] = timespan.split(":").map((s) => parseInt(s, 10));
            return set(date, { hours: hh, minutes: mm, seconds: 0 });
        }
        return date;
    }
}
