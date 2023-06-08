export default class LoginTfaSettings {
    public readonly hasAuthenticator: boolean;
    public readonly recoveryCodesLeft: int;
    public readonly is2faEnabled: boolean;
    public readonly is2faMandatory: boolean;
    public readonly isMachineRemembered: boolean;
    public readonly statusMessage: string;
}
