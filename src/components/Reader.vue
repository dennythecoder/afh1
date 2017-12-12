<template>
	<div class="reader" :class="appearHandler">
		<Toolbar :is-hidden.sync="isToolbarHidden">
			<div class="content" :id="id"></div>
		</Toolbar>
    <reader-floating-highlight-button v-show="isTextSelectable" />
	</div>
</template>


<style>

.content{
  height:95vh;
  width:100vw;
  margin:auto;
  padding:10px 10px;
  
}
.reader, .content{
  position: absolute;
  top:0;
  width:100vw;
}
.reader{
  z-index:-3;
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
import ReaderFloatingHighlightButton from "./ReaderFloatingHighlightButton.vue";
import { TouchSwipe } from "quasar";
import { CreateHighlightManager } from "../highlight";
import Hammer from "hammerjs";

export default {
  data() {
    return {
      id: "epubViewer",
      currentCfi: "",
      appearHandler: "",
      isToolbarHidden: true
    };
  },
  directives: {
    TouchSwipe
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
      if (body._hashandlers) return;
      body._hashandlers = true;

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
      hammer.on("tap", this.onTap);
      iframe.contentDocument.addEventListener("selectionchange", e => {
        if (iframe.contentWindow.getSelection().toString().length) {
          setTimeout(() => {
            if (iframe.contentWindow.getSelection().toString().length) {
              this.setIsTextSelectable(true);
            }
          }, 250);
        } else {
          this.setIsTextSelectable(false);
        }
      });
    },
    onTap(e) {
      let tagName = e.target.tagName.toLocaleLowerCase();
      if (this.isToolbarHidden && tagName !== "a") {
        this.isToolbarHidden = false;
      } else {
        this.isToolbarHidden = true;
      }
    },
    setIsTextSelectable(value) {
      this.$store.commit("setIsTextSelectable", value);
    },
    insertCss() {
      let path = "../../../ebook.css";
      window.EPUBJS.core.addCss(path, null, this.book.renderer.doc.head);
    },
    onChapterDisplayed() {
      this.insertCss();
      this.appendHandlers();
    },
    onBookReady() {
      let vm = this;
      vm.book.on("renderer:chapterDisplayed", this.onChapterDisplayed);
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
      let handbookFolder = "./statics/docs/afh1/";
      if (DEV) {
        handbookFolder = "." + handbookFolder;
      }

      vm.book = ePub(handbookFolder, {
        width: computedStyle.width,
        height: computedStyle.height,
        styles: {
          paddingRight: "15px"
        }
      });

      vm.book.renderTo("epubViewer").then(() => this.onBookReady());
    },
    locationChangeHandler(location) {
      this.appendHandlers();
      let win = document.querySelector("iframe").contentWindow;
      win.getSelection().removeAllRanges();
      this.removeContextMenu(win);
      this.removeContextMenu(window);
      this.currentCfi = location.replace(/\//g, "-");
      setTimeout(() => this.markHighlights(), 50);
      this.isToolbarHidden = true;
    },
    markHighlights() {
      const hm = CreateHighlightManager(this.$store);
      hm.markHighlights();
    }
  },
  computed: {
    isTextSelectable() {
      return this.$store.getters.isTextSelectable;
    }
  },
  watch: {
    "$route.params.cfi": function(val) {
      if (val && this.$store.getters.isBookInitialized) {
        this.gotoCfi("epubcfi(" + val.replace(/-/g, "/") + ")").then(() => {
          this.clearHighlights();
          if (this.$store.getters.searchTerm) {
            this.highlightText(this.$store.getters.searchTerm);
          }
          this.appendHandlers();
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
    },
    "$store.getters.highlights.length": function(val) {
      this.markHighlights();
    }
  },
  components: {
    Toolbar,
    ReaderFloatingHighlightButton
  },
  mounted() {
    this.$nextTick(() => this.init());
  }
};
</script>