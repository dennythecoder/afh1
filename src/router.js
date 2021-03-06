import Vue from "vue";
import VueRouter from "vue-router";
import Bookmarks from "./components/Bookmarks.vue";
import Home from "./components/Home.vue";
import Searcher from "./components/Searcher.vue";
import TOC from "./components/TOC.vue";
import Highlights from "./components/Highlights.vue";

Vue.use(VueRouter);

export default new VueRouter({
  mode: "hash",
  scrollBehavior: () => ({
    y: 0
  }),

  routes: [
    {
      path: "/Bookmarks",
      component: Bookmarks
    },
    {
      path: "/Highlights",
      component: Highlights
    },
    {
      path: "/Reader/:cfi"
    },
    {
      path: "/Reader"
    },
    {
      path: "/Searcher",
      component: Searcher
    },
    {
      path: "/TOC",
      component: TOC
    },
    {
      path: "*",
      component: Home
    }
  ]
});
