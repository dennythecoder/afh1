<template>
  <div slot="left">
    <q-side-link item to="/home">
      <ToolbarButton name="fa-home" />
      Home
    </q-side-link>
    <q-side-link v-if="bookmarks.length" item to="/bookmarks">
      <ToolbarButton name="fa-book" />
      Bookmarks
    </q-side-link>
    <q-side-link v-if="highlights.length" item to="/highlights">
      <ToolbarButton name="fa-signal" />
      Highlights
    </q-side-link>

    <q-side-link item to="/searcher">
      <ToolbarButton name="fa-search" />
      Search
    </q-side-link>

    <q-item highlight @click="clearSearch" v-if="searchTerm && !isSearcher">
      <ToolbarButton name="fa-search cross-out"  />
      Clear Search
    </q-item> 
    <q-item separator>
      <strong><em>Chapters</em></strong>
    </q-item>
    <q-side-link  
      v-for="chapter in chapters" 
      :key="chapter.label" 
      item :to="calcChapterPath(chapter)"
      class="on-right"
    >
      {{chapter.label}}
    </q-side-link>
  </div>
</template>
<script>
import { QToolbar, QLayout, QItem, QSideLink } from "quasar";
import ToolbarButton from "./ToolbarButton";
import { mapGetters } from "vuex";
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
      "searchTerm",
      "bookmarks",
      "highlights",
      "chapters"
    ])
  },

  methods: {
    clearSearch() {
      this.$store.commit("searchPages", "");
      this.$emit("action-complete");
    },
    calcChapterPath(chapter) {
      const cfi = chapter.cfi.replace(/\//g, "-"); // making url friendly
      return "/reader/" + cfi;
    }
  }
};
</script>