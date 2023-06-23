import LocalSessionStorage from "@js/stores/localSessionStorage";
import { createRouter, createWebHistory } from "vue-router";

const adminRouter = createRouter({
    history: createWebHistory("admin"),
    routes: [
        //-- Dashboard Page -------------------------------------------------
        {
            path: "/",
            name: "Dashboard",
            component: () => import("@components/dashboard/dashboard.vue"),
            meta: { title: "Dashboard" }
        },
        //--Users Pages-------------------------------------------------------------------
        {
            path: "/users",
            name: "Users",
            component: () => import("@components/admin/users.vue"),
            meta: { title: "Users" }
        },
        //--Tests Pages-------------------------------------------------------------------
        {
            path: "/tests",
            name: "Tests",
            component: () => import("@components/tests/tests.vue"),
            meta: { title: "Tests" }
        },
        //-- password option ---------------------------------------------------
        {
            path: "/changePassword",
            name: "changePassword",
            component: () => import("@components/admin/changePassword.vue"),
            meta: { title: "Change Password" }
        },
        //-- two factor authentication ---------------------------------------------------
        {
            path: "/twoFactorAuthentication",
            name: "twoFactorAuthentication",
            component: () => import("@components/tfa/twoFactorAuthentication.vue"),
            meta: { title: "Authenticator Settings" }
        },
        //-- 404 Error page ---------------------------------------------------
        {
            path: "/:catchAll(.*)",
            name: "PageNotFound",
            component: () => import("@components/pagenotfound/pagenotfound.vue"),
            meta: { title: "Page not found" }
        },
        //-- 404 Error page ---------------------------------------------------
        {
            path: "/notfound",
            name: "PageNotFoundPage",
            component: () => import("@components/pagenotfound/pagenotfound.vue"),
            meta: { title: "Page not found" }
        }
    ],
    linkActiveClass: "active"
});

const applicationName = document.getElementsByTagName("title")[0].innerHTML;
adminRouter.beforeEach((to, _from, next) => {
    document.title = to.meta.title + " - " + applicationName;
    document.body.className = `page-${to.name?.toString()}`;
    window.scrollTo(0, 0);

    if (LocalSessionStorage.isUserAuthenticated()) {
        next();
    } else {
        window.location.href = `${(window as any).location.origin}/auth/`;
    }
});

export { adminRouter };
