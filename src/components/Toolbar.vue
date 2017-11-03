<template>
	<div class="toolbar-container">
		<q-toolbar class="toolbar">
			<div style="width:95%;margin:auto;text-align:center;">
        <ToolbarButton name="fa-home" @click="gotoHome" />
        <ToolbarButton name="fa-list" @click="gotoTOC" />
        <ToolbarButton name="fa-search" @click="gotoSearcher" v-if="!$store.getters.searchTerm && !isSearcher"/>
        <ToolbarButton name="fa-search cross-out" @click="clearSearch" v-if="$store.getters.searchTerm && !isSearcher" />
        <ToolbarButton name="fa-bookmark-o" @click="createBookmark" v-if="isReader && !isBookmarked" />
        <ToolbarButton name="fa-bookmark" @click="destroyBookmark" v-if="isReader && isBookmarked" />
        <ToolbarButton name="fa-arrow-left" @click="prevPage" v-if="isReader" />
        <ToolbarButton name="fa-arrow-right" @click="nextPage" v-if="isReader" />
        <ToolbarButton name="fa-pencil" @click="highlight" v-if="isReader" />
			</div>	
		</q-toolbar>
		<div class="toolbar-content">
			<slot scope="default"></slot>
		</div>
	</div>
</template>

<script>
import { QBtn, QIcon, QToolbar } from "quasar";
import ToolbarButton from "./ToolbarButton";
import { CreateHighlightManager } from "../highlight";
import { mapMutations } from "vuex";
export default {
  components: {
    QBtn,
    QIcon,
    QToolbar,
    ToolbarButton
  },
  computed: {
    isBookmarked() {
      return this.$store.getters.isBookmarked;
    },
    isReader() {
      return this.$store.getters.isReader;
    },
    isSearcher() {
      return this.$store.getters.isSearcher;
    }
  },

  methods: {
    ...mapMutations([
      "prevPage",
      "nextPage",
      "createBookmark",
      "destroyBookmark",
      "createHighlight",
      "destroyHighlight"
    ]),
    clearSearch() {
      this.$store.commit("searchPages", "");
    },
    gotoTOC() {
      window.location.hash = "#/toc";
    },
    gotoHome() {
      window.location.hash = "#/home";
    },
    gotoSearcher() {
      window.location.hash = "#/searcher";
    },

    highlight() {
      const hm = CreateHighlightManager();
      const selection = hm.highlight("yellow");
      this.createHighlight({ ...selection });
    }
  }
};
</script>

<style>
.toolbar {

	z-index: 10;
	position: fixed;
	width: 100%;
	height: 11vh;
	top: 0;
	left: 0;
	text-align: center;
	color: white;
	background-color: #fff;
	border-bottom: 1px solid #ccc;
}

.toolbar-content {
	margin-top: 13vh;
}

.cross-out:after{
    position:absolute;
    content:"/";
    font-weight:bolder;
    font-size:1.7em;
    left:45%;
    color:#33f;
}

</style>