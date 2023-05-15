export class ChangePasswordRequest {
    constructor(readonly oldPassword: string, readonly newPassword: string) {}
}
