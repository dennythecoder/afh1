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
      <toolbar-side-menu slot="left" @action-complete="toggleLeft" />

    </q-layout>

	</div>
</template>

<script>
import { QToolbar, QLayout, QItem, QSideLink } from "quasar";
import ToolbarButton from "./ToolbarButton";
import ToolbarSideMenu from "./ToolbarSideMenu.vue";
import { CreateHighlightManager } from "../highlight";
import { mapMutations, mapGetters } from "vuex";
export default {
  components: {
    QToolbar,
    ToolbarButton,
    QLayout,
    QItem,
    QSideLink,
    ToolbarSideMenu
  },
  computed: {
    ...mapGetters([
      "isBookmarked",
      "isReader",
      "isSearcher",
      "isTextSelectable",
      "searchTerm",
      "bookmarks",
      "highlights"
    ])
  },

  methods: {
    ...mapMutations(["prevPage", "nextPage", "createHighlight"]),
    toggleLeft() {
      this.$refs.layout.toggleLeft();
    },
    highlight() {
      const hm = CreateHighlightManager();
      const selection = hm.highlight("yellow");
      this.createHighlight({ ...selection });
      hm.releaseSelection();
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