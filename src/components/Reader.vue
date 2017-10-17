<template>
	<div class="reader" v-touch-swipe="swipeHandler">
		<Toolbar :is-chapter="true" @next-page="nextPage" @prev-page="prevPage">
			<div v-inserted="init" class="content" :style="styleObj" :id="id">
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

export default {
  data() {
    return {
      id: "epubViewer",
      bookmarks: [],
      currentCfi: ""
    };
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
      this.$store.commit("gotoCfi", cfi);
      this.placeSwipeListener();
    },

    init() {
      let vm = this;

      var el = document.getElementById(vm.id);
      var computedStyle = window.getComputedStyle(el);
      vm.book = ePub("docs/AFH-1/", {
        width: computedStyle.width,
        height: computedStyle.height
      });

      vm.book.renderTo("epubViewer");
      vm.book.on("renderer:locationChanged", function(location) {
        vm.currentCfi = location.replace(/\//g, "-");
      });
      vm.book.forceSingle();

      if (vm.$route.params.cfi) {
        vm.gotoCfi("epubcfi(" + vm.$route.params.cfi.replace(/-/g, "/") + ")");
      }
      this.$store.commit("setBook", vm.book);

      vm.book.getToc().then(function(chapters) {
        chapters.forEach(function(chapter) {
          vm.$store.commit("addChapter", chapter);
        });
      });
      vm.placeSwipeListener();
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
        this.gotoCfi("epubcfi(" + val.replace(/-/g, "/") + ")");
      }
    }
  },
  components: {
    Toolbar
  }
};
</script>