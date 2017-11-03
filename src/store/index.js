import Vue from "vue";
import Vuex from "vuex";
import state from "./state";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

Vue.use(Vuex);

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});

function init(store) {
  const jsonBookmarks = localStorage.getItem("bookmarks");
  if (jsonBookmarks) {
    Vue.set(store.state, "bookmarks", JSON.parse(jsonBookmarks));
  }
  const jsonLastLocation = localStorage.getItem("lastLocation");
  if (jsonLastLocation) {
    Vue.set(store.state, "lastLocation", JSON.parse(jsonLastLocation));
  }
  const jsonHighlights = localStorage.getItem("highlights");
  if (jsonHighlights) {
    Vue.set(store.state, "highlights", JSON.parse(jsonHighlights));
  }
  return store;
}
window.store = store;
export default init(store);
