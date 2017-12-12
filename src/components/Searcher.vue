<template>
	<div class="searcher">
		<Toolbar>
      <q-search v-model="searchTerm" @input="searchPages" />
      <div class="btn-container">
        <list-button v-for="(result, index) in searchResults"
            @click="gotoResult(result)"
            :key="index">
            {{result.shortResult}}
        </list-button>

      </div>
		</Toolbar>
	</div>
</template>
<style>
	.searcher{
		background-color:white;
		min-height:100vh;
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
import { QBtn, QSearch } from "quasar";
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
    }
  },
  watch: {
    searchTerm(newVal) {
      if (newVal === "") {
        this.searchPages();
      }
    }
  },
  components: {
    Toolbar,
    QBtn,
    ListButton,
    QSearch
  }
};
</script>

