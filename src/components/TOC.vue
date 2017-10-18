<template>
	<div class="toc">
		<Toolbar>
			<div class="btn-container">
				<q-btn outline color="primary" class="full-width"
					v-for="(chapter, chapterIndex) in chapters"
					@click="gotoChapter(chapter)"
				
					:key="chapterIndex"
				>
					{{chapter.label}}
				</q-btn>
			</div>
		</Toolbar>
	</div>
</template>
<style>
	.toc{
		background-color:white;
		min-height:100vh;
	}
</style>
<script>
import Toolbar from "./Toolbar.vue";
import { QBtn } from "quasar";
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
  },
  components: {
    Toolbar,
    QBtn
  }
};
</script>

