<template>
	<div class="home">
		<h3 @click="debugClicks++"></h3>
		<h1>Air Force Handbook 1 </h1>
    <div class="btn-container" >
      <list-button @click="gotoReading">Chapters</list-button>
      <list-button @click="gotoSearcher">Search</list-button>
      <list-button v-if="hasLastViewed" @click="gotoLastViewed">Continue Reading</list-button>
      <list-button v-if="hasBookmarks" @click="gotoBookmarks">Bookmarks</list-button>
      <list-button v-if="hasHighlights" @click="gotoHighlights">Highlights</list-button>
    </div>	
	</div>
</template>

<script>
import { QBtn } from "quasar";
import ListButton from "./ListButton.vue";

export default {
  data() {
    return {
      debugClicks: 0
    };
  },
  components: {
    QBtn,
    ListButton
  },
  methods: {
    gotoReading() {
      window.location.hash = "#/toc";
    },
    gotoBookmarks() {
      window.location.hash = "#/bookmarks";
    },
    gotoSearcher() {
      window.location.hash = "#/searcher";
    },
    gotoHighlights() {
      window.location.hash = "#/highlights";
    },
    gotoLastViewed() {
      const lastLocation = localStorage.getItem("lastLocation");
      if (lastLocation) {
        window.location.hash =
          "#/reader/" + this.$store.getters.lastLocation.location;
      }
    },
    gotoDebug() {
      window.location.hash = "#/debug";
    }
  },
  computed: {
    hasLastViewed() {
      let lastLocation = localStorage.getItem("lastLocation");
      return lastLocation && true;
    },
    hasBookmarks() {
      return this.$store.getters.bookmarks.length > 0;
    },
    hasHighlights() {
      return this.$store.getters.highlights.length > 0;
    }
  }
};
</script>

<style>
	.home h3{
		background-image:url("../assets/af_logo.svg");
		background-size:25vw 25vw;
		background-repeat:no-repeat;
		height:25vw;
		background-position:center;
	}

	.home{
		background-color:white;
		text-align:center;
		position:absolute;
		top:0;
		height:140%;
    width:100%;
    z-index:3;
	}	
</style>