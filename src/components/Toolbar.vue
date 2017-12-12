<template>
	<div class="toolbar-container">
    <transition name="slide">
		<q-toolbar class="toolbar" v-show="!isHidden">
			<div style="width:95%;margin:auto;text-align:center;">
        <ToolbarButton name="fa-bars" @click="toggleLeft" class="float-left" />
        <ToolbarButton name="fa-bookmark-o" @click="createBookmark" v-if="isReader && !isBookmarked" class="float-right" />
        <ToolbarButton name="fa-bookmark" @click="destroyBookmark" v-if="isReader && isBookmarked" class="float-right" />

			</div>	
		</q-toolbar>
    </transition>
    <q-layout ref="layout" view="hHr LpR Fff">
      <div :class="{'toolbar-content':!isReader}">
        <slot scope="default"></slot>
      </div>
      <toolbar-side-menu slot="left" @action-complete="toggleLeft" />

    </q-layout>

	</div>
</template>

<script>
import { QToolbar, QLayout, QItem, QSideLink, Toast } from "quasar";
import ToolbarButton from "./ToolbarButton";
import ToolbarSideMenu from "./ToolbarSideMenu.vue";
import { mapMutations, mapGetters } from "vuex";
export default {
  props: {
    isHidden: {
      type: Boolean,
      required: false,
      default: false
    }
  },
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
    toggleLeft() {
      this.$refs.layout.toggleLeft();
    },
    createBookmark() {
      this.$store.commit("createBookmark");
      Toast.create({ html: "Bookmark Created!" });
    },
    destroyBookmark() {
      this.$store.commit("destroyBookmark");
      Toast.create({ html: "Bookmark Removed!" });
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


  .slide-enter-active, .slide-leave-active {
    transition: top .5s;
  }
  .slide-enter, .slide-leave-to{
    top:-100px;
  }

</style>