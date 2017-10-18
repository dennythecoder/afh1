<template>
	<div class="toolbar-container">
		<div class="toolbar">
			<q-btn @click="gotoHome">
				<q-icon name="fa-home" color="primary"></q-icon>
			</q-btn>
			
			<q-btn @click="gotoTOC">
				<q-icon name="fa-list" color="primary"></q-icon>
			</q-btn>
			<q-btn @click="gotoSearcher" v-if="!isSearcher">
				<q-icon name="fa-search" color="primary"></q-icon>
			</q-btn>
			<q-btn v-if="isReader && !isBookmarked" @click="createBookmark">
				<q-icon name="fa-bookmark-o" color="primary"></q-icon>
			</q-btn>
			<q-btn  v-if="isReader && isBookmarked" @click="destroyBookmark">
				<q-icon name="fa-bookmark" color="primary"></q-icon>
			</q-btn>
			<q-btn  v-if="isReader" @click="prevPage">
				<q-icon name="fa-arrow-left" color="primary"></q-icon>
			</q-btn>
			<q-btn v-if="isReader" @click="nextPage">
				<q-icon name="fa-arrow-right" color="primary"></q-icon>
			</q-btn>
			<span style="color:black" color="primary">{{$router.path}}</span>
		</div>

		<div class="toolbar-content">
			<slot scope="default"></slot>
		</div>
	</div>
</template>

<script>
import { QBtn, QIcon } from "quasar";
export default {
  components: {
    QBtn,
    QIcon
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
    gotoTOC() {
      window.location.hash = "#/toc";
    },
    gotoHome() {
      window.location.hash = "#/home";
    },
    gotoSearcher() {
      window.location.hash = "#/searcher";
    },
    prevPage() {
      this.$store.commit("prevPage");
    },
    nextPage() {
      this.$store.commit("nextPage");
    },
    createBookmark() {
      this.$store.commit("createBookmark");
    },
    destroyBookmark() {
      this.$store.commit("destroyBookmark");
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

.icon {
	list-style: none;

	background-color: white;
	padding: 4px 4px;
	font-family: Georgia;
	margin-bottom: 5px;

	color: #17d;
	font-weight: bold;
	border: solid 1px #39f;
	border-radius: 4px 4px;
	margin-top: 5px;
	padding-top: 2vh;
	height: 6vh;
	width: 6vh;
	vertical-align: bottom;
	display: inline-block;
}

.icon:hover {
	cursor: pointer;

	color: #03a;
	border: solid 1px #17d;
}



.icon:active {
	background-color: #eee;
}

.icon i {
	font-size: 5vh;
}
</style>