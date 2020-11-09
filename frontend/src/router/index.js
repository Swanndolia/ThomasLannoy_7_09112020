import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/feed",
    name: "Feed",
    component: () => import("../views/Feed.vue"),
  },
  {
    path: "/post",
    name: "Post",
    component: () => import("../views/Post.vue"),
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
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

export default router;
