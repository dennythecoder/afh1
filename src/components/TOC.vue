<template>
	<div class="toc">
		<toolbar>
			<ul class="list">
				<li v-for="(chapter, chapterIndex) in chapters"
					@click="gotoChapter(chapter)"
					class="ripple"
          :key="chapterIndex"
				>
					
					{{chapter.label}}
					
				</li>
			</ul>
		</toolbar>

	</div>
</template>
<style>
	.toc{
		background-color:white;
		min-height:100vh;
	}
</style>
<script>
export default {
  computed: {
    chapters: function() {
      return this.$store.getters.chapters;
    }
  },
  methods: {
    gotoChapter: function(chapter) {
      const cfi = chapter.cfi.replace(/\//g, "-"); // making url friendly
      window.location.hash = "#/reader/" + cfi;
    }
  }
};
</script>

