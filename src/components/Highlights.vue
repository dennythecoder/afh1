<template>
	<div class="bookmarks">
		<Toolbar>
      <template	v-for="(highlight, index) in highlights" >

      <list-button 
					@click="gotoLocation(highlight.location)" :key="index" 
      >

        {{highlight.location.chapterName}}
        {{highlight.textContent | shortened}}
        
      </list-button>	
      <highlights-context-menu :highlight="highlight" :key="index"></highlights-context-menu>
      </template>
      
		</Toolbar>

	</div>
</template>




<script>
import { QBtn } from "quasar";
import Toolbar from "./Toolbar.vue";
import HighlightsContextMenu from "./HighlightsContextMenu.vue";
import ListButton from "./ListButton.vue";
export default {
  data() {
    return {
      id: "epubViewer",
      resizeCount: 0,
      book: {}
    };
  },
  filters: {
    shortened(text) {
      return text.length > 30 ? text.substr(0, 30) + "..." : text;
    }
  },
  computed: {
    highlights() {
      return this.$store.getters.highlights;
    }
  },
  methods: {
    gotoLocation(bookmark) {
      const bookmarkLocation = bookmark.location;
      if (location) {
        window.location.hash = "#/reader/" + bookmarkLocation;
      }
    },
    removeHighlight(highlight) {
      this.$store.commit("removeHighlight");
    }
  },
  watch: {
    "highlights.length": function(val) {
      if (!val) {
        window.location.hash = "#/home";
      }
    }
  },
  components: {
    Toolbar,
    QBtn,
    HighlightsContextMenu,
    ListButton
  },
  beforeCreate() {
    window.addEventListener("selectstart", onSelectListener);
  },
  beforeDestroy() {
    window.removeEventListener("selectstart", onSelectListener);
  }
};

function onSelectListener(e) {
  e.preventDefault();
  return false;
}
</script>
<style>
.bookmarks {
	background-color: white;
	height: 100vh;
}
</style>