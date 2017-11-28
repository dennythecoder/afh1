<template>
	<div class="toolbar-container">
		<q-toolbar class="toolbar">
			<div style="width:95%;margin:auto;text-align:center;">
        <ToolbarButton name="fa-bars" @click="toggleLeft" class="float-left" />
        <ToolbarButton name="fa-arrow-left" @click="prevPage" v-if="isReader" />
        <ToolbarButton name="fa-arrow-right" @click="nextPage" v-if="isReader" />
        <ToolbarButton name="fa-pencil" @click="highlight" v-if="isReader && isTextSelectable" />
			</div>	
		</q-toolbar>
    <q-layout ref="layout" view="hHr LpR Fff">
      <div class="toolbar-content">
        <slot scope="default"></slot>
      </div>

    <div slot="left">
      <q-side-link item to="/home">
        <ToolbarButton name="fa-home" />
        Home
      </q-side-link>
      <q-side-link item to="/toc">
        <ToolbarButton name="fa-list" />
        Table of Contents
      </q-side-link>
      <q-side-link item to="/searcher">
        <ToolbarButton name="fa-search" />
        Search
      </q-side-link>

      <q-item highlight @click="clearSearch" v-if="searchTerm && !isSearcher">
        <ToolbarButton name="fa-search cross-out"  />
        Clear Search
      </q-item> 
      <q-item highlight @click="createBookmark" v-if="isReader && !isBookmarked" >
        <ToolbarButton name="fa-bookmark-o"/>
        Create Bookmark
      </q-item>
      <q-item highlight @click="destroyBookmark" v-if="isReader && isBookmarked" >
        <ToolbarButton name="fa-bookmark" />
        Remove Bookmark
      </q-item>
        
    
    </div>
    </q-layout>

	</div>
</template>

<script>
import { QToolbar, QLayout, QItem, QSideLink, Toast } from "quasar";
import ToolbarButton from "./ToolbarButton";
import { CreateHighlightManager } from "../highlight";
import { mapMutations, mapGetters } from "vuex";
export default {
  components: {
    QToolbar,
    ToolbarButton,
    QLayout,
    QItem,
    QSideLink
  },
  computed: {
    ...mapGetters([
      "isBookmarked",
      "isReader",
      "isSearcher",
      "isTextSelectable",
      "searchTerm"
    ])
  },

  methods: {
    ...mapMutations([
      "prevPage",
      "nextPage",
      "createHighlight",
      "destroyHighlight",
      "toggleIsTextSelectable"
    ]),
    createBookmark() {
      this.$store.commit("createBookmark");
      this.toggleLeft();
      Toast.create({ html: "Bookmark Created!" });
    },
    destroyBookmark() {
      this.$store.commit("destroyBookmark");
      this.toggleLeft();
      Toast.create({ html: "Bookmark Removed!" });
    },
    clearSearch() {
      this.$store.commit("searchPages", "");
      this.toggleLeft();
    },
    gotoTOC() {
      window.location.hash = "#/toc";
      this.toggleLeft();
    },
    gotoHome() {
      this.toggleLeft();
      setTimeout(() => {
        window.location.hash = "#/home";
      }, 50);
    },
    gotoSearcher() {
      window.location.hash = "#/searcher";
      this.toggleLeft();
    },
    toggleLeft() {
      this.$refs.layout.toggleLeft();
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

.q-item-highlight:hover{
  cursor:pointer;
}

</style>