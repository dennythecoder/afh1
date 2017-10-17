import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

function load(component) {
  // '@' is aliased to src/components
  return () => require(`@/${component}.vue`);
}

export default new VueRouter({
  mode: "hash",
  scrollBehavior: () => ({
    y: 0
  }),

  routes: [
    {
      path: "/",
      component: load("Home")
    },

    // Always leave this last one
    {
      path: "*",
      component: load("Home")
    } // Not found
  ]
});
