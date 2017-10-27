<template>
	<div class="toolbar-container">
		<q-toolbar class="toolbar">
			<div style="width:95%;margin:auto;text-align:center;">
				<q-btn flat @click="gotoHome">
					<q-icon name="fa-home" color="primary"></q-icon>
				</q-btn>
				<q-btn flat @click="gotoTOC">
					<q-icon name="fa-list" color="primary"></q-icon>
				</q-btn>
				<q-btn flat @click="gotoSearcher" v-if="!$store.getters.searchTerm && !isSearcher">
					<q-icon name="fa-search" color="primary"></q-icon>
				</q-btn>
				<q-btn flat v-if="$store.getters.searchTerm && !isSearcher" @click="clearSearch">
					<q-icon name="fa-search cross-out" color="primary"></q-icon>
				</q-btn>
				<q-btn flat v-if="isReader && !isBookmarked" @click="createBookmark">
					<q-icon name="fa-bookmark-o" color="primary"></q-icon>
				</q-btn>
				<q-btn flat  v-if="isReader && isBookmarked" @click="destroyBookmark">
					<q-icon name="fa-bookmark" color="primary"></q-icon>
				</q-btn>
				<q-btn flat v-if="isReader" @click="prevPage">
					<q-icon name="fa-arrow-left" color="primary"></q-icon>
				</q-btn>
				<q-btn flat v-if="isReader" @click="nextPage">
					<q-icon name="fa-arrow-right" color="primary"></q-icon>
				</q-btn>
				<q-btn flat v-if="isReader" @click="highlight">
					<q-icon name="fa-pencil" color="primary"></q-icon>
				</q-btn>
			</div>	
		</q-toolbar>
		<div class="toolbar-content">
			<slot scope="default"></slot>
		</div>
	</div>
</template>

<script>
import { QBtn, QIcon, QToolbar } from "quasar";
import highlight from "../highlight";
import { mapMutations } from "vuex";
export default {
  components: {
    QBtn,
    QIcon,
    QToolbar
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
      const win = document.querySelector("iframe").contentWindow;
      const selection = highlight("yellow", win);
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