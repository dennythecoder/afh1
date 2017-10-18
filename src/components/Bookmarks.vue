<template>
	<div class="bookmarks">
		<Toolbar>
      <q-btn outline color="primary" class="full-width"
      		v-for="(bookmark, index) in bookmarks" 
					@click="gotoLocation(bookmark)" 
					:key="index"
      >{{bookmark.chapterName}}</q-btn>	

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
  components: {
    Toolbar,
    QBtn
  }
};
</script>