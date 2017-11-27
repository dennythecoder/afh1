<template>
	<div class="reader" :class="appearHandler">
		<Toolbar>
			<div class="content" :style="styleObj" :id="id"></div>
    <!--  <div v-long-press="onLongPress" v-show="!isTextSelectable" class="swipe-overlay" v-touch-swipe="swipeHandler"></div>-->
		</Toolbar>
	</div>
</template>


<style>
.swipe-overlay{
  height:80vh;
  width:95%;
  margin:auto;
  top:8vh;
  position:absolute;
  z-index:3;
}
.reader {

	height: 80vh;
	width: 95%;
	padding-right: 10px;
	padding-left: 10px;
	margin: auto;
	position: absolute;
	top: 0vh;
	z-index: -1;
}

.reader-in{
  animation-name: slowly-appear;
  animation-duration:1.5s;
}
@keyframes slowly-appear {
  0%{
    opacity:0
  }
  100%{
    opacity:1
  }
}
.content {

	min-height: 80vh !important;

	width: 95%;
}
</style>



<script>
let ePub = window.ePub;
import Toolbar from "./Toolbar.vue";
import { TouchSwipe } from "quasar";
import { CreateHighlightManager } from "../highlight";
import Hammer from "hammerjs";

let duration = 1000;

let LongPress = {
  bind(el, binding) {
    el._onmousedown = function(e) {
      el._mouseup = false;
      el._timout = setTimeout(() => {
        if (el._timeout) {
          clearInterval(el._timeout);
          delete el._timeout;
        }
        if (!el._mouseup) {
          binding.value.call(el, e);
        }
      }, duration);
    };
    el._onmouseup = function(e) {
      el._mouseup = true;
    };
    el.addEventListener("mousedown", el._onmousedown);
    el.addEventListener("mouseup", el._onmouseup);
    el.addEventListener("touchstart", el._onmousedown);
    el.addEventListener("touchend", el._onmouseup);
  },
  unbind(el, binding) {
    el.removeEventListener("mousedown", el._onmousedown);
    el.removeEventListener("mouseup", el._onmouseup);
    el.removeEventListener("touchstart", el._onmousedown);
    el.removeEventListener("touchend", el._onmouseup);
  }
};

export default {
  data() {
    return {
      id: "epubViewer",
      currentCfi: "",
      appearHandler: ""
    };
  },
  directives: {
    TouchSwipe,
    LongPress
  },
  methods: {
    prevPage() {
      this.$store.commit("prevPage");
    },
    nextPage() {
      this.$store.commit("nextPage");
    },
    swipeHandler(swipe) {
      if (swipe.direction === "left") {
        this.nextPage();
      }
      if (swipe.direction === "right") {
        this.prevPage();
      }
    },

    gotoCfi(cfi) {
      // expecting string like this -- epubcfi(/6/2[titlepage]!/4/1:0)
      let promise = this.$store.dispatch("gotoCfi", cfi);
      return promise;
    },

    highlightText(text) {
      if (!text) return;
      let doc = document.querySelector("iframe").contentDocument;
      let paragraphs = doc.querySelectorAll("p");
      const searchRegExp = new RegExp(text.toLocaleLowerCase(), "ig");
      for (let i = 0; i < paragraphs.length; i++) {
        let paragraph = paragraphs[i];
        paragraph.innerHTML = paragraph.innerHTML.replace(
          searchRegExp,
          result => "<mark class='highlight search'>" + result + "</mark>"
        );
      }
    },
    clearHighlights() {
      let doc = document.querySelector("iframe").contentDocument;
      let highlights = doc.querySelectorAll("mark.highlight.search");
      for (let i = 0; i < highlights.length; i++) {
        highlights[i].outerHTML = highlights[i].innerHTML;
      }
    },
    removeContextMenu(win) {
      win.oncontextmenu = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
    },
    onLongPress(e) {
      this.$store.commit("toggleIsTextSelectable");
    },
    appendHandlers() {
      let iframe = document.querySelector("iframe"),
        body = iframe.contentDocument.body;
      if (body._onswipeleft && body._onswiperight) return;
      body._onswipeleft = true;
      body._onswiperight = true;
      delete Hammer.defaults.cssProps.userSelect;
      let hammer = new Hammer(body);
      hammer.on("swipe", e => {
        switch (e.direction) {
          case 2: // left
            this.nextPage();
            break;
          case 4: // right
            this.prevPage();
            break;
          default:
            break;
        }
      });
      window.hammer = hammer;
    },
    onBookReady() {
      let vm = this;

      vm.book.on("renderer:locationChanged", this.locationChangeHandler);
      vm.book.forceSingle();
      this.$store.commit("setBook", vm.book);
      if (vm.$route.params.cfi) {
        vm.gotoCfi("epubcfi(" + vm.$route.params.cfi.replace(/-/g, "/") + ")");
      }
      let win = document.querySelector("iframe").contentWindow;
      this.removeContextMenu(win);
      this.removeContextMenu(window);

      vm.book.getToc().then(function(chapters) {
        chapters.forEach(function(chapter) {
          vm.$store.commit("addChapter", chapter);
        });
      });
      this.$store.commit("generatePagination");
    },

    init() {
      let vm = this;

      var el = document.getElementById(vm.id);
      var computedStyle = window.getComputedStyle(el);
      let handbookFolder = "./statics/docs/AFH-1/";
      if (DEV) {
        handbookFolder = "." + handbookFolder;
      }
      vm.book = ePub(handbookFolder, {
        width: computedStyle.width,
        height: computedStyle.height,
        style: {
          padding: "10px"
        }
      });

      vm.book.renderTo("epubViewer").then(() => this.onBookReady());
    },
    locationChangeHandler(location) {
      this.appendHandlers();
      let win = document.querySelector("iframe").contentWindow;
      this.removeContextMenu(win);
      this.removeContextMenu(window);
      this.currentCfi = location.replace(/\//g, "-");
      this.markHighlights();
    },
    markHighlights() {
      const hm = CreateHighlightManager(this.$store);
      hm.markHighlights();
    }
  },
  computed: {
    styleObj() {
      var width = window.innerWidth;
      width *= 0.5;
      return {
        height: "85vh",
        width: width,
        margin: "auto"
      };
    },

    isVisible() {
      return this.$store.getters.isReader;
    },
    isTextSelectable() {
      return this.$store.getters.isTextSelectable;
    }
  },
  watch: {
    isVisible(newValue) {
      if (newValue) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "visible";
      }
    },
    "$route.params.cfi": function(val) {
      if (val && this.$store.getters.isBookInitialized) {
        this.gotoCfi("epubcfi(" + val.replace(/-/g, "/") + ")").then(() => {
          this.clearHighlights();
          if (this.$store.getters.searchTerm) {
            this.highlightText(this.$store.getters.searchTerm);
          }
        });
        this.markHighlights();
      }
      this.appendHandlers();
    },
    "$store.getters.searchTerm": function(val) {
      this.clearHighlights();
      this.highlightText(val);
    },
    "$store.getters.isReader": function(val) {
      const hm = CreateHighlightManager();
      hm.markHighlights();
      if (val) {
        this.appearHandler = "reader-in";
        setTimeout(() => {
          this.appearHandler = "";
        }, 2000);
      }
    }
  },
  components: {
    Toolbar
  },
  mounted() {
    this.$nextTick(() => this.init());
  }
};
</script>