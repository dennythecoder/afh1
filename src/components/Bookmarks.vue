<template>
	<div class="bookmarks">
		<Toolbar>
      <template v-for="(bookmark, index) in bookmarks">
        <q-btn outline color="primary" class="full-width"
            @click="gotoLocation(bookmark)" 
            :key="index"
        >{{bookmark.chapterName}}</q-btn>	
        <bookmarks-context-menu :key="index" :bookmark="bookmark"></bookmarks-context-menu>
      </template> 
		</Toolbar>

	</div>
</template>

<style>
.bookmarks {
	background-color: white;
	height: 84vh;
}
</style>


<script>
import Toolbar from "./Toolbar.vue";
import BookmarksContextMenu from "./BookmarksContextMenu";
import { QBtn } from "quasar";
export default {
  data() {
    return {
      id: "epubViewer",
      resizeCount: 0,
      book: {}
    };
  },
  computed: {
    bookmarks() {
      return this.$store.getters.bookmarks;
    }
  },
  methods: {
    gotoLocation(bookmark) {
      const bookmarkLocation = bookmark.location;
      if (location) {
        window.location.hash = "#/reader/" + bookmarkLocation;
      }
    }
  },
  watch: {
    "bookmarks.length": function(val) {
      if (!val) {
        window.location.hash = "#/home";
      }
    }
  },
  components: {
    Toolbar,
    BookmarksContextMenu,
    QBtn
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