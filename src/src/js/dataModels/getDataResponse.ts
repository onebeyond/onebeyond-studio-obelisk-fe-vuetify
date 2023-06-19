export default class GetDataResponse<T> {
    public success = false;
    public data: T | null = null;
    public count?: number;
}
