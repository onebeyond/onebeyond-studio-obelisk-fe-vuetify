import ObeliskResourceApiClient from "@js/api/obeliskResourceApiClient";
import { UserContext } from "@js/dataModels/users/userContext";
import { plainToInstance } from "class-transformer";

//We derive from WebApiClient, not from DcslApiClient, because the Account controller does not have api folder
export default class AccountApiClient extends ObeliskResourceApiClient {
    constructor() {
        super("auth", "v1");
    }

    public async ping(): Promise<void> {
        await this.get("ping");
    }

    public async signOut(): Promise<void> {
        await this.post("signout");
    }

    public async whoAmI(): Promise<UserContext> {
        const data = await this.get("WhoAmI");
        return plainToInstance(UserContext, await data.json());
    }
}
