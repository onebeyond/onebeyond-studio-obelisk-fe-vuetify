import LocalAppStorage from "./localAppStorage";

export default class LocalSessionStorage extends LocalAppStorage {
    public static readonly LAST_SERVER_REQUEST_KEY: string = "lastServerRequestDate";
    public static readonly USER_IS_AUTHENTICATED: string = "authenticatedUser";
    public static readonly USER_ID: string = "UserId";

    public static updateLastServerRequestDate(): void {
        this.setValueForKey(this.LAST_SERVER_REQUEST_KEY, new Date().getTime().toString());
    }

    public static getLastServerRequestDate(): number {
        return parseInt(this.getValueForKey(this.LAST_SERVER_REQUEST_KEY) ?? "0");
    }

    public static isUserAuthenticated(): boolean {
        return this.getValueForKey(this.USER_IS_AUTHENTICATED) === "true";
    }

    public static setUserAuthenticated(authenticated: boolean): void {
        this.setValueForKey(this.USER_IS_AUTHENTICATED, authenticated ? "true" : "false");
    }

    public static setUserId(id: string): void {
        this.setValueForKey(this.USER_ID, id);
    }

    public static getUserId(): void {
        this.getValueForKey(this.USER_ID);
    }
}
