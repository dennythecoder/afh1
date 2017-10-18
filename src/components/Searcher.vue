<template>
	<div class="searcher">
		<Toolbar>
      <div class="search-bar">
          <input type="text" v-model="searchTerm" @keyup.enter="searchPages" />
          <i @click="searchPages" class="fa fa-search"></i>
      </div>
      <div class="btn-container">
        <q-btn v-for="(result, index) in searchResults"
            @click="gotoResult(result)"
            :key="index" outline color="primary" class="full-width">
            {{result.page}}
        </q-btn>
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
import { QBtn } from "quasar";
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
  components: {
    Toolbar,
    QBtn
  }
};
</script>

