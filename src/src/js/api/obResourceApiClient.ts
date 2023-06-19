import ObApiClient from "@js/api/obApiClient";

export default abstract class ObResourceApiClient extends ObApiClient {
    constructor(resource: string, version: string | null) {
        const sanitizedVersion = version ? `${version}/` : "";
        const apiUrl = `${ObResourceApiClient.WebApiRoot}api/${resource}/${sanitizedVersion}`;

        super(apiUrl);
    }
}
