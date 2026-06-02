import { createRouter, createWebHistory } from "vue-router";

import Login from "../views/Login.vue";
import Signup from "../views/SignUp.vue";
import Dashboard from "../views/Dashboard.vue";


const routes = [
  {
    path: "/",
    redirect: "/login",
  },

  {
    path: "/login",
    component: Login,
  },

  {
    path: "/signup",
    component: Signup,
  },

  {
    path: "/dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});


// ROUTE GUARD
router.beforeEach((to) => {

  const token = window.localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    return "/login";
  }

});

export default router;

