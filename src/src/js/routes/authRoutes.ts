import { createRouter, createWebHistory } from "vue-router";

const authRouter = createRouter({
    history: createWebHistory("auth"),
    routes: [
        //-- Sign in Page -------------------------------------------------
        {
            path: "/",
            name: "SignIn",
            component: () => import("@components/auth/signIn.vue"),
            meta: { title: "Sign in" },
        },
        //-- Forgot password -------------------------------------------------
        {
            path: "/forgotPassword",
            name: "forgotPassword",
            component: () => import("@components/auth/forgotPassword.vue"),
            meta: { title: "Change Password" },
        },
        //-- Access Denied Page -------------------------------------------------
        {
            path: "/AccessDenied",
            name: "AccessDenied",
            component: () => import("@components/auth/accessDenied.vue"),
            meta: { title: "Access Denied" },
        },
        //-- set password -------------------------------------------------
        {
            path: "/setPassword",
            name: "setPassword",
            component: () => import("@components/auth/setPassword.vue"),
            meta: { title: "Set Password" },
            props: () => ({
                isFirstTimeSetup: true,
            }),
        },
        //-- reset password -------------------------------------------------
        {
            path: "/resetPassword",
            name: "resetPassword",
            component: () => import("@components/auth/setPassword.vue"),
            meta: { title: "Reset Password" },
            props: () => ({
                isFirstTimeSetup: false,
            }),
        },
        //-- login with 2 fa ---------------------------------------------------
        {
            path: "/signInWithTfa",
            name: "signInWithTfa",
            component: () => import("@components/auth/signInWithTfa.vue"),
            meta: { title: "Sign In with Two Factor Authentication" },
        },
        //-- login with recovery code ---------------------------------------------------
        {
            path: "/signInWithRecoveryCode",
            name: "signInWithRecoveryCode",
            component: () => import("@components/auth/signInWithRecoveryCode.vue"),
            meta: { title: "Sign In with Recovery Code" },
        },
        //-- 404 Error page ---------------------------------------------------
        {
            path: "/:catchAll(.*)",
            name: "PageNotFound",
            component: () => import("@components/pageNotFound/pageNotFound.vue"),
            meta: { title: "Page not found" },
        },
    ],
    linkActiveClass: "active",
});

const applicationName = document.getElementsByTagName("title")[0].innerHTML;
authRouter.beforeEach((to, _from, next) => {
    document.title = to.meta.title + " - " + applicationName;
    document.body.className = `page-${to.name?.toString()}`;
    window.scrollTo(0, 0);

    next();
});

export { authRouter };
