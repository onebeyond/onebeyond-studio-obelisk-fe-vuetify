import type { SignInStatus } from "@js/dataModels/auth/signInStatus";

export class SignInWithRecoveryCodeResult {
    loginId: string | undefined;
    status: SignInStatus | undefined;
    statusMessage: string | undefined;
}
