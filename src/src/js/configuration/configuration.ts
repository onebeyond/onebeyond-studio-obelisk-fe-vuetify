import AppSettings from "@js/dataModels/settings/appSettings";
import Settings from "@js/dataModels/settings/settings";
import { plainToClassFromExist } from "class-transformer";

export default abstract class Configuration {
    private static readonly _defaultSettingsFile = "settings.json";
    private static readonly _publicConfigurationFolder = "configuration";
    private static _appSettings: Readonly<AppSettings> | null = null;

    public static async load(environment: string, onSettingsLoaded: Function | null = null): Promise<void> {
        // eslint-disable-line @typescript-eslint/ban-types
        this._appSettings = new AppSettings();

        const envSettingsFile = `settings.${(environment || "dev").toLowerCase()}.json`;

        await this.readFromFile(this._defaultSettingsFile);
        await this.readFromFile(envSettingsFile);
        if (onSettingsLoaded) {
            onSettingsLoaded.call(this);
        }
    }

    public static get appSettings(): Readonly<AppSettings> {
        if (!this._appSettings) {
            throw Error("Please call the 'load' function before accessing this object");
        }
        return this._appSettings;
    }

    private static async readFromFile(jsonFile: string): Promise<void> {
        if (!jsonFile) {
            throw Error("Please specify a valid JSON file to load");
        }

        try {
            // Load from the default settings first
            const response = await fetch(new Request(`/${this._publicConfigurationFolder}/${jsonFile}`));
            const settings: Settings = await response.json();
            this.setEnvironmentVariables(jsonFile, settings);
        } catch (e: unknown) {
            this.logError(jsonFile, `Failed to load ${jsonFile}: ${(e as Error).message}`);
        }
    }

    private static setEnvironmentVariables(jsonFile: string, settings: Settings): void {
        try {
            plainToClassFromExist(this._appSettings, settings.appSettings);
        } catch (e: unknown) {
            this.logError(
                jsonFile,
                `An error occurred while setting configuration variables for ${settings} ${(e as Error).message}`,
            );
        }
    }

    private static logError(context: string, message: string): void {
        console.error(`[Configuration][ERROR][${context}] ${message}`);
    }
}
