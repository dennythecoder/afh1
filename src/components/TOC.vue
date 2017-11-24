<template>
	<div class="toc">
		<Toolbar>
			<div class="btn-container">
				<list-button 					
				  v-for="(chapter, chapterIndex) in chapters"
					@click="gotoChapter(chapter)"
					:key="chapterIndex">
					{{chapter.label}}
				</list-button>
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
import ListButton from "./ListButton.vue";
export default {
  computed: {
    chapters() {
      return this.$store.getters.chapters;
    }
  },
  methods: {
    gotoChapter(chapter) {
      const cfi = chapter.cfi.replace(/\//g, "-"); // making url friendly
      window.location.hash = "#/reader/" + cfi;
    }
  },
  components: {
    Toolbar,
    QBtn,
    ListButton
  }
};
</script>

