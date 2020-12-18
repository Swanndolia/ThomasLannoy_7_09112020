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
//redirect to sign if user is not
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!storage.getStorage("token")) {
      next({ name: "Sign" });
    } else {
      next();
    }
  } else {
    next();
  }
});
export default router;
