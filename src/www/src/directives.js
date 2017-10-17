import Vue from "vue";
import Hammer from "hammerjs";

Vue.directive(
  "inserted",

  {
    inserted: function(el, binding, vnode, oldVnode) {
      if (binding) {
        binding.value();
      }
    }
  }
);

Vue.directive("swipeLeft", {
  inserted: function(el, binding, vnode, oldVnode) {
    var hammertime = new Hammer(el);

    hammertime.on("swipeleft", function(ev) {
      if (binding) {
        binding.value();
      }
    });
  }
});

Vue.directive("swipeRight", {
  inserted: function(el, binding, vnode, oldVnode) {
    var hammertime = new Hammer(el);

    hammertime.on("swiperight", function(ev) {
      if (binding) {
        binding.value();
      }
    });
  }
});
