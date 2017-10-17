<template>
	<div class="toolbar-container">
		<div class="toolbar">

			<div class="icon" @click="gotoHome">
				<i class="fa fa-home"></i>
			</div>
			<div class="icon" @click="gotoTOC">
				<i class="fa fa-list"></i>
			</div>
			<div class="icon" @click="gotoSearcher" v-if="!isSearcher">
				<i class="fa fa-search"></i>
			</div>
			<div class="icon" v-if="isReader && !isBookmarked" @click="createBookmark">
				<i class="fa fa-bookmark-o"></i>
			</div>
			<div class="icon" v-if="isReader && isBookmarked" @click="destroyBookmark">
				<i class="fa fa-bookmark"></i>
			</div>
			<div class="icon" v-if="isReader" @click="prevPage">
				<i class="fa fa-arrow-left"></i>
			</div>
			<div class="icon" v-if="isReader" @click="nextPage">
				<i class="fa fa-arrow-right"></i>
			</div>
			<span style="color:black">{{$router.path}}</span>
		</div>

		<div class="toolbar-content">
			<slot scope="default"></slot>
		</div>
	</div>
</template>

<script>
export default {
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