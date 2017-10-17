<template>
	<div class="bookmarks">
		<toolbar>
			<ul class="list">
				<li 
					v-for="(bookmark, index) in bookmarks" 
					@click="gotoLocation(bookmark)" class="ripple" 
					:key="index">
					{{bookmark.chapterName}}
				</li>
			</ul>
		</toolbar>

	</div>
</template>

<style>
.bookmarks {
	background-color: white;
	height: 84vh;
}
</style>


<script>
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
      return this.$store.bookmarks;
    }
  },
  methods: {
    gotoLocation(bookmark) {
      const bookmarkLocation = bookmark.location;
      if (location) {
        window.location.hash = "#/reader/" + bookmarkLocation;
      }
    }
  }
};
</script>