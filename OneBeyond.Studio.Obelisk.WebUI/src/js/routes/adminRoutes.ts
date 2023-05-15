const Vue = require("vue");
import Router from "vue-router";
import LocalSessionStorage from "@js/stores/localSessionStorage";
import TFAApiClient from "@js/api/tfa/tfaApiClient";

Vue.use(Router);

const adminRouter = new Router({
    mode: "history",
    base: "admin",
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
            path: "*",
            name: "PageNotFound",
            component: () => import("@components/pagenotfound/pagenotfound.vue"),
            meta: { title: "Page not found" }
        }
    ],
    linkActiveClass: "active"
});

const applicationName = document.getElementsByTagName("title")[0].innerHTML;

adminRouter.beforeEach((to, _from, next) => {
    document.title = to.meta.title + " - " + applicationName;
    document.body.className = `page-${to.name}`;
    window.scrollTo(0, 0);

    if (LocalSessionStorage.isUserAuthenticated()) {
        next();
    } else {
        window.location.href = `${(window as any).location.origin}/auth/`;
    }
});

export { adminRouter };
