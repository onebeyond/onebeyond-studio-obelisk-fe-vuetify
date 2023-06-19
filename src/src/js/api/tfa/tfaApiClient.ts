import ObResourceApiClient from "@js/api/obResourceApiClient";
import EnableAuthenticatorSettings from "@js/dataModels/tfa/enableAuthenticatorSettings";
import type EnableTfaRequest from "@js/dataModels/tfa/enableTfaRequest";
import LoginTfaSettings from "@js/dataModels/tfa/loginTfaSettings";
import { plainToInstance } from "class-transformer";

export default class tfaApiClient extends ObResourceApiClient {
    constructor() {
        super("tfa", "v1");
    }

    public async getTfaAuthenticationKey(): Promise<EnableAuthenticatorSettings> {
        const data = await this.post("generateTfaKey");
        return plainToInstance(EnableAuthenticatorSettings, await data.json());
    }

    public async getTfaSettings(): Promise<LoginTfaSettings> {
        const data = await this.get("tfaSettings");
        return plainToInstance(LoginTfaSettings, await data.json());
    }

    public async enableTfa(input: EnableTfaRequest): Promise<any> {
        const response = await this.post("enabletfa", input);
        if (response.status === 204) {
            window.location.href = "/admin";
        }
        return response.json();
    }

    public async forgetBrowser(): Promise<any> {
        const response = await this.post("forgetBrowser");
        return response;
    }

    public async generateRecoveryCodes(): Promise<any> {
        const response = await this.post("generateRecoveryCodes");
        return response.json();
    }

    public async reset(): Promise<any> {
        const response = await this.post("resetTfa");
        return response;
    }

    public async disableTfa(): Promise<void> {
        await this.post("disableTfa");
    }
}
