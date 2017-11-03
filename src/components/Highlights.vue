<template>
	<div class="bookmarks">
		<Toolbar>
      <q-btn outline color="primary" class="full-width"
      		v-for="(highlight, index) in highlights" 
					@click="gotoLocation(highlight.location)" 
					:key="index"
      >{{highlight.location.chapterName}}</q-btn>	

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
    }
  },
  components: {
    Toolbar,
    QBtn
  }
};
</script>