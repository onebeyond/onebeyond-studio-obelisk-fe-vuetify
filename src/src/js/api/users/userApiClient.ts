import { User } from "@js/dataModels/users/user";
import EntityApiClient from "@js/api/entityApiClient";
import type PagedList from "@js/dataModels/pagedList";

//Note, in addition to basic add/get/edit/delete operations we want to be able to reset user password.
//In order to do this we extend the base EntityApiClient class, adding new functionality.
export default class UserApiClient extends EntityApiClient<User, string> {
    constructor() {
        super(User, "Users", "v1");
    }

    public async resetPassword(loginId: string): Promise<void> {
        await this.put(`${loginId}/ResetPassword`);
    }

    public async unlock(userId: string): Promise<void> {
        await this.put(`${userId}/Unlock`);
    }

    public async search(query: string): Promise<PagedList<User>> {
        const response = await this.get(`?search=${query}`);
        return await response.json();
    }
}
