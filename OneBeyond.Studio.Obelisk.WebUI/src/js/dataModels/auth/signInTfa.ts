export class SignInTfa {
    constructor(readonly code: string, readonly rememberClient: boolean, readonly rememberMe: boolean) {}
}
