import { Test } from "@js/dataModels/tests/test";
import EntityApiClient from "@js/api/entityApiClient";

//Note, in addition to basic add/get/edit/delete operations we want to be able to reset user password.
//In order to do this we extend the base EntityApiClient class, adding new functionality.
export default class TestApiClient extends EntityApiClient<Test, string> {
    constructor() {
        super(Test, "Tests", "v1");
    }

    public async search(query: string): Promise<any> {
        const response = await this.get(`?search=${query}`);
        return await response.json();
    }
}
