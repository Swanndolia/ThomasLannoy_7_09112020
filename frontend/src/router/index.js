import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Feed",
    component: () => import("../views/Feed.vue"),
  },
  {
    path: "/selected-post-id",
    name: "ShowPost",
    component: () => import("../views/ShowPost.vue"),
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
  },
  {
    path: "/profile/edit",
    name: "EditProfile",
    component: () => import("../views/EditProfile.vue"),
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
