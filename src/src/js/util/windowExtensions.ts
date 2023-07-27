export {};

declare global {
    interface Window {
        env: string;
        BaseUrl: string;
        setApiUrl: (url: string) => void;
        resetApiUrl: () => void;
    }
}
