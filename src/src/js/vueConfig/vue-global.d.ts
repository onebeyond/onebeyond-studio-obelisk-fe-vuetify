declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $rootPath: string;
        $rootApiPath: string;
        $bus: any;
    }
}
export {}; // Important!
