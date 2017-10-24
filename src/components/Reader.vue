<template>
	<div class="reader" >
		<Toolbar :is-chapter="true" @next-page="nextPage" @prev-page="prevPage">
      <div v-touch-swipe="swipeHandler">
			  <div  class="content" :style="styleObj" :id="id"></div>
      </div>
		</Toolbar>
	</div>
</template>


<style>
.reader {

	height: 80vh;
	width: 95%;
	padding-right: 10px;
	padding-left: 10px;
	margin: 0 0;
	position: absolute;
	top: 0vh;
	z-index: -1;
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

export default {
  data() {
    return {
      id: "epubViewer",
      currentCfi: ""
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
          result => "<mark class='highlight'>" + result + "</mark>"
        );
      }
    },
    clearHighlights() {
      let doc = document.querySelector("iframe").contentDocument;
      let highlights = doc.querySelectorAll("mark");
      for (let i = 0; i < highlights.length; i++) {
        highlights[i].outerHTML = highlights[i].innerHTML;
      }
    },

    init() {
      let vm = this;

      var el = document.getElementById(vm.id);
      var computedStyle = window.getComputedStyle(el);
      vm.book = ePub("../statics/docs/AFH-1/", {
        width: computedStyle.width,
        height: computedStyle.height
      });

      vm.book.renderTo("epubViewer");
      vm.book.on("renderer:locationChanged", function(location) {
        vm.currentCfi = location.replace(/\//g, "-");
      });
      vm.book.forceSingle();
      this.$store.commit("setBook", vm.book);
      if (vm.$route.params.cfi) {
        vm.gotoCfi("epubcfi(" + vm.$route.params.cfi.replace(/-/g, "/") + ")");
      }

      vm.book.getToc().then(function(chapters) {
        chapters.forEach(function(chapter) {
          vm.$store.commit("addChapter", chapter);
        });
      });
      this.$store.commit("generatePagination");
    }
  },
  computed: {
    styleObj() {
      var width = window.innerWidth - 40 + "px";
      return {
        height: "85vh",
        width: width,
        margin: "auto"
      };
    },

    isVisible() {
      return this.$store.getters.isReader;
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
      }
    },
    "$store.getters.searchTerm": function(val) {
      this.clearHighlights();
      this.highlightText(val);
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