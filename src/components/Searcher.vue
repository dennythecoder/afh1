<template>
	<div class="searcher">
		<toolbar>
            <div class="search-bar">
                <input type="text" v-model="searchTerm" @keyup.enter="searchPages" />
                <i @click="searchPages" class="fa fa-search"></i>
            </div>
			<ul class="list">
				<li v-for="(result, index) in results"
					@click="gotoResult(result)"
					class="ripple"
                    :key="index"
				>
					
					{{result.page}}
					
				</li>
			</ul>
		</toolbar>
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
mb.store = mb.store || {};

module.exports = {
  data: function() {
    return {
      searchTerm: "",
      results: []
    };
  },
  methods: {
    searchPages: function() {
      let results = mb.store.searchPages(this.searchTerm);
      Vue.set(this, "results", results);
    },
    gotoResult: function(result) {
      let cfi = /epubcfi\((.*?)\)/.exec(result.cfi)[1];
      cfi = cfi.replace(/\//g, "-");
      window.location.hash = "#/reader/" + cfi;
    }
  }
};
</script>

