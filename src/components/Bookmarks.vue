<template>
	<div class="bookmarks">
		<Toolbar>
      <template v-for="(bookmark, index) in bookmarks">
        <list-button
            @click="gotoLocation(bookmark)" 
            :key="index"
        >{{bookmark.chapterName}}</list-button>	
        <bookmarks-context-menu :key="index" :bookmark="bookmark"></bookmarks-context-menu>
      </template> 
		</Toolbar>

	</div>
</template>

<style>
.bookmarks {
	background-color: white;
	height: 100vh;
}
</style>


<script>
import Toolbar from "./Toolbar.vue";
import BookmarksContextMenu from "./BookmarksContextMenu";
import { QBtn } from "quasar";
import ListButton from "./ListButton";
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
        let push = () => this.$router.push({ path: "/home" });
        setTimeout(push, 5);
      }
    }
  },
  components: {
    Toolbar,
    BookmarksContextMenu,
    QBtn,
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