import ObResourceApiClient from "@js/api/obResourceApiClient";
import type { SignInRequest } from "@js/dataModels/auth/signInRequest";
import type { SignInResult } from "@js/dataModels/auth/signInResult";
import type { SignInWithRecoveryCodeResult } from "@js/dataModels/auth/signInResultWithRecoveryCode";
import type { SignInTfa } from "@js/dataModels/auth/signInTfa";
import { UserContext } from "@js/dataModels/users/userContext";
import { plainToInstance } from "class-transformer";
import type { SignInWithRecoveryCode } from "@js/dataModels/auth/signInWithRecoveryCode";
import type { ChangePasswordRequest } from "@js/dataModels/auth/changePasswordRequest";
import type { PasswordRequirements } from "@js/dataModels/auth/passwordRequirements";
import type { ResetPasswordStatus } from "@js/dataModels/auth/resetPasswordStatus";
import { JwtResult } from "@js/dataModels/auth/jwtResult";
import { SignInStatus } from "@js/dataModels/auth/signInStatus";

//We derive from WebApiClient, not from ObApiClient, because the Account controller does not have api folder
export default class AuthApiClient extends ObResourceApiClient {
    constructor() {
        super("auth", "v1");
    }

    public async ping(): Promise<void> {
        await this.get("ping");
    }    

    public async jwtSignIn(userCredentials: SignInRequest): Promise<SignInResult> {
        try {
            const response = await this.post("api/account/jwt/signIn/v1/", userCredentials);

            const jwtResponse = (await response.json()) as JwtResult;

            this.setJwtCookie(jwtResponse);

            return {
                status: SignInStatus.Success,
                statusMessage: "Logged in."
            };
        }
        catch (error: any)
        {
            console.error(error);
            return {
                status: SignInStatus.Failure,
                statusMessage: error.body.message
            };
        }
    }

    public async basicSignInTfa(userCredentials: SignInTfa): Promise<SignInResult> {
        const response = await this.post("basic/SignInWithTwoFA", userCredentials);
        return (await response.json()) as SignInResult;
    }

    public async basicSignInWithRecoveryCode(
        userCredentials: SignInWithRecoveryCode,
    ): Promise<SignInWithRecoveryCodeResult> {
        const response = await this.post("basic/signinWithRecoveryCode", userCredentials);
        return (await response.json()) as SignInWithRecoveryCodeResult;
    }

    public async whoAmI(): Promise<UserContext> {
        const data = await this.get("WhoAmI");
        return plainToInstance(UserContext, await data.json());
    }

    public async forgotPassword(email: string): Promise<Response> {
        return this.post("ForgotPassword", { email: email });
    }

    public async resetPassword(userId: string, password: string, token: string): Promise<ResetPasswordStatus> {
        const response = await this.post("ResetPassword", {
            userId: userId,
            password: password,
            token: token,
        });
        return (await response.json()) as ResetPasswordStatus;
    }

    public async changePassword(details: ChangePasswordRequest): Promise<Response> {
        return this.post("ChangePassword", details);
    }

    public async signOut(): Promise<void> {
        await this.post("signout");
        this.clearJwtCookies();
    }

    public async getPasswordRequirements(): Promise<PasswordRequirements> {
        const response = await this.get("PasswordRequirements");
        return (await response.json()) as PasswordRequirements;
    }
}
