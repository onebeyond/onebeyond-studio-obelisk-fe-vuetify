import { createRouter, createWebHistory } from "vue-router";

const authRouter = createRouter({
    history: createWebHistory("auth"),
    routes: [
        //-- Sign in Page -------------------------------------------------
        {
            path: "/",
            name: "SignIn",
            component: () => import("@components/auth/signIn.vue"),
            meta: { title: "Sign in" }
        },
        //-- Forgot password -------------------------------------------------
        {
            path: "/forgotPassword",
            name: "forgotPassword",
            component: () => import("@components/auth/forgotPassword.vue"),
            meta: { title: "Forgot Password" }
        },
        //-- Forgot password confirm -------------------------------------------------
        {
            path: "/forgotPasswordConfirm",
            name: "forgotPasswordConfirm",
            component: () => import("@components/auth/forgotPasswordConfirmed.vue"),
            meta: { title: "Forgot Password Confirmation" }
        },
        //-- Access Denied Page -------------------------------------------------
        {
            path: "/AccessDenied",
            name: "AccessDenied",
            component: () => import("@components/auth/accessDenied.vue"),
            meta: { title: "Access Denied" }
        },
        //-- reset password -------------------------------------------------
        {
            path: "/resetPassword",
            name: "resetPassword",
            component: () => import("@components/auth/resetPassword.vue"),
            meta: { title: "Change Password" }
        },
        //-- login with 2 fa ---------------------------------------------------
        {
            path: "/loginWithTfa",
            name: "loginWithTfa",
            component: () => import("@components/auth/loginWithTfa.vue"),
            meta: { title: "Login with Two Factor Authentication" }
        },
        //-- login with recovery code ---------------------------------------------------
        {
            path: "/loginWithRecoveryCode",
            name: "loginWithRecoveryCode",
            component: () => import("@components/auth/loginWithRecoveryCode.vue"),
            meta: { title: "Login with Recovery Code" }
        },
        //-- 404 Error page ---------------------------------------------------
        {
            path: "/:catchAll(.*)",
            name: "PageNotFound",
            component: () => import("@components/pagenotfound/pagenotfound.vue"),
            meta: { title: "Page not found" }
        }
    ],
    linkActiveClass: "active"
});

const applicationName = document.getElementsByTagName("title")[0].innerHTML;
authRouter.beforeEach((to, _from, next) => {
    document.title = to.meta.title + " - " + applicationName;
    document.body.className = `page-${to.name?.toString()}`;
    window.scrollTo(0, 0);

    next();
});

export { authRouter };
