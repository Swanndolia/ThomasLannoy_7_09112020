import { createRouter, createWebHashHistory } from "vue-router";
import * as storage from "../modules/storage";
const routes = [
  {
    path: "/",
    name: "Feed",
    component: () => import("../views/Feed.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/:id",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/sign",
    name: "Sign",
    component: () => import("../views/Sign.vue"),
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!storage.getStorage("token")) {
      next({ name: "Sign" });
    } else {
      next();
    }
  } else {
    next(); // does not require auth, make sure to always call next()!
  }
});
export default router;
