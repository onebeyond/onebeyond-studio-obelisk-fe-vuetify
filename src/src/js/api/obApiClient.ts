import WebApiClient from "@js/api/webApiClient";
import RedirectToNotFoundResponseInterceptor from "@js/api/interceptors/response/redirectToNotFoundResponseInterceptor";
import RedirectToLoginResponseInterceptor from "@js/api/interceptors/response/redirectToLoginResponseInterceptor";
import RefreshClientSessionRequestInterceptor from "@js/api/interceptors/request/refreshClientSessionRequestInterceptor";

export default abstract class ObApiClient extends WebApiClient {
    constructor(apiUrl: string) {
        super(apiUrl);

        this.addRequestInterceptor();
        this.addResponseInterceptor();
    }

    private addRequestInterceptor(): void {
        this.requestInterceptors.push(new RefreshClientSessionRequestInterceptor());
    }

    private addResponseInterceptor(): void {
        this.responseInterceptors.push(new RedirectToLoginResponseInterceptor(this.logout.bind(this)));

        this.responseInterceptors.push(new RedirectToNotFoundResponseInterceptor());
    }

    private async logout(): Promise<void> {
        // clear all interceptors as unnecessary while logging out
        this.requestInterceptors.splice(0, this.requestInterceptors.length);
        this.responseInterceptors.splice(0, this.responseInterceptors.length);
        try {
            await this.fetch("signout", WebApiClient.buildRequest("POST"), `${ObApiClient.WebApiRoot}api/auth/v1/`);
        }
        catch (error) {
            console.error(error);
        }
        
        this.clearJwtCookies();
    }
}
