<template>
	<div class="searcher">
		<Toolbar>
      <q-input style="width:90%; margin:auto;" v-model="searchTerm" @keyup.enter.native="searchPages" :before="beforeIcon" :after="afterIcon" />
      <div class="btn-container">

        <list-button v-for="(result, index) in searchResults"
            @click="gotoResult(result)"
            :key="index">
            {{parseChapter(result)}} - 
            {{result.shortResult}}
        </list-button>

      </div>
		</Toolbar>
	</div>
</template>
<style>
	.searcher{
		background-color:white;
		min-height:200vh;
	}
  .search-bar{ 
      width:100%;
      text-align:center;
  }
  .search-bar input{
      width:85%;
      margin: 0 0 ;
      padding:4px 4px;
      border-radius: 4px 4px;
  }
  .search-bar i{
      margin:0 0;
      color:#17d;
      border: 1px solid #17d;
      border-radius:4px 4px;
      padding: 4px 4px;
  }

</style>
<script>
import Toolbar from "./Toolbar.vue";
import { QBtn, QInput } from "quasar";
import ListButton from "./ListButton.vue";
export default {
  data() {
    return {
      searchTerm: this.$store.getters.searchTerm
    };
  },
  computed: {
    searchResults() {
      return this.$store.getters.searchResults;
    },
    afterIcon() {
      let icons = [];
      let vm = this;
      if (this.searchResults.length) {
        icons.push({
          icon: "fa-remove",
          handler() {
            vm.searchTerm = "";
            vm.searchPages();
          }
        });
      }
      return icons;
    },
    beforeIcon() {
      return [
        {
          icon: "fa-search",
          handler: this.searchPages
        }
      ];
    }
  },
  methods: {
    searchPages() {
      this.$store.commit("searchPages", this.searchTerm);
    },
    gotoResult(result) {
      let cfi = /epubcfi\((.*?)\)/.exec(result.cfi)[1];
      cfi = cfi.replace(/\//g, "-");
      window.location.hash = "#/reader/" + cfi;
    },
    parseChapter(result) {
      try {
        let cfi = result.cfi;
        let right = cfi.split("[a")[1];
        let chapter = right.split("html")[0];
        return "Chapter " + chapter;
      } catch (e) {
        return "";
      }
    }
  },
  components: {
    Toolbar,
    QBtn,
    ListButton,
    QInput
  }
};
</script>

