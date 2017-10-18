<template>
	<div class="home">
		<h3></h3>
		<h1>Air Force Handbook 1 </h1>
    <div class="btn-container" >
      <q-btn outline color="primary" @click="gotoReading" class="full-width">Chapters</q-btn>
      <q-btn outline color="primary" @click="gotoSearcher" class="full-width">Search</q-btn>
      <q-btn outline color="primary" v-if="hasLastViewed" @click="gotoLastViewed" class="full-width">Continue Reading</q-btn>	
      <q-btn outline color="primary" v-if="hasBookmarks" @click="gotoBookmarks" class="full-width">Bookmarks</q-btn>	
    </div>	
	</div>
</template>

<script>
import { QBtn } from "quasar";

export default {
  components: {
    QBtn
  },
  methods: {
    gotoReading: function() {
      window.location.hash = "#/toc";
    },
    gotoBookmarks: function() {
      window.location.hash = "#/bookmarks";
    },
    gotoSearcher: function() {
      window.location.hash = "#/searcher";
    },
    gotoLastViewed: function() {
      const lastLocation = localStorage.getItem("lastLocation");
      if (lastLocation) {
        window.location.hash =
          "#/reader/" + this.$store.getters.lastLocation.location;
      }
    }
  },
  computed: {
    hasLastViewed: function() {
      let lastLocation = localStorage.getItem("lastLocation");
      return lastLocation && true;
    },
    hasBookmarks: function() {
      var bookmarks = localStorage.getItem("bookmarks");
      if (!bookmarks) return false;
      var bookmarksArr = JSON.parse(bookmarks);
      return bookmarksArr.length > 0;
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
		height:100%;
		width:100%;
	}
	.btn-container{
    width:95%;
    margin:auto;
  }
  .btn-container button{
    margin-bottom:4px;
  }
	
	
</style>