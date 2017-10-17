<template>
	<div class="toc">
		<toolbar>
			<ul class="list">
				<li v-for="chapter, chapterIndex in chapters"
					@click="gotoChapter(chapter)"
					class="ripple"
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
mb.store = mb.store || {};

module.exports = {
  computed: {
    chapters: function() {
      if (!mb.store.chapters) {
        Vue.set(mb.store, "chapters", []);
        return [];
      }
      return mb.store.chapters;
    }
  },
  methods: {
    gotoChapter: function(chapter) {
      let vm = this;
      const cfi = chapter.cfi.replace(/\//g, "-"); // making url friendly
      // vm.$router.push({path:'reader/'+cfi});
      window.location.hash = "#/reader/" + cfi;
    }
  }
};
</script>

