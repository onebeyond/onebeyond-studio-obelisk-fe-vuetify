import { createRouter, createWebHistory } from "vue-router";

const indexRouter = createRouter({
    history: createWebHistory(),
    routes: [
        //-- Home Page --------------------------------------------------------
        {
            path: "/",
            name: "Home",
            component: () => import("@components/home/home.vue"),
            meta: { title: "Home" },
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
indexRouter.beforeEach((to, _from, next) => {
    document.title = to.meta.title + " - " + applicationName;
    document.body.className = `page-${to.name?.toString()}`;
    window.scrollTo(0, 0);

    next();
});

export { indexRouter };
