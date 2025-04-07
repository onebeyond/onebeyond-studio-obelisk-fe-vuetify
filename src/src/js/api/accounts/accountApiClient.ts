import ObResourceApiClient from "@js/api/obResourceApiClient";
import { UserContext } from "@js/dataModels/users/userContext";
import { plainToInstance } from "class-transformer";

//We derive from WebApiClient, not from DcslApiClient, because the Account controller does not have api folder
export default class AccountApiClient extends ObResourceApiClient {
    constructor() {
        super("auth", "v1");
    }

    public async ping(): Promise<void> {
        await this.get("ping");
    }

    public async signOut(): Promise<void> {
        try {
            await this.post("signout");
        }
        catch (error){
            console.error(error);
        }
        this.clearJwtCookies();
    }

    public async whoAmI(): Promise<UserContext> {
        const data = await this.get("WhoAmI");
        return plainToInstance(UserContext, await data.json());
    }
}
