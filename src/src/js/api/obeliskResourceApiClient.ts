import ObeliskApiClient from "@js/api/obeliskApiClient";

export default abstract class ObeliskResourceApiClient extends ObeliskApiClient {
    constructor(resource: string, version: string | null) {
        const sanitizedVersion = version ? `${version}/` : "";
        const apiUrl = `${ObeliskResourceApiClient.WebApiRoot}api/${resource}/${sanitizedVersion}`;

        super(apiUrl);
    }
}
