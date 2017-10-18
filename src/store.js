import Vue from "vue";
import router from "./router";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    bookmarks: [],
    lastLocation: {},
    book: {},
    chapters: [],
    isBookInitialized: false,
    pages: [],
    router
  },
  getters: {
    isReader(state) {
      let currentRoute = state.router.currentRoute;
      return currentRoute.path.indexOf("/reader") !== -1;
    },
    isSearcher(state) {
      return state.router.currentRoute.path.indexOf("/searcher") !== -1;
    },
    isBookmarked(state) {
      let bookmarks = state.bookmarks,
        lastLocation = state.lastLocation;
      for (var i = 0; i < bookmarks.length; i++) {
        if (bookmarks[i].location === lastLocation.location) {
          return true;
        }
      }
      return false;
    },
    chapters(state) {
      return state.chapters;
    },
    pages(state) {
      return state.pages;
    },
    lastLocation(state) {
      return state.lastLocation;
    },
    isBookInitialized(state) {
      return state.isBookInitialized;
    }
  },
  mutations: {
    addChapter(state, chapter) {
      state.chapters.push(chapter);
    },
    generatePagination(state) {
      state.pages.splice(1, state.pages.length - 1);
      const localStoragePages = localStorage.getItem("pages");
      if (localStoragePages) {
        let worker = new Worker("./statics/ww-json-parser.js");
        worker.onmessage = function(response) {
          state.pages.push(response.data);
        };
        worker.postMessage(localStoragePages);
      } else {
        state.book.generatePagination().then(function(pages) {
          Vue.set(state, "pages", pages);
          localStorage.setItem("pages", JSON.stringify(pages));
        });
      }
    },
    searchPages(state, searchTerm) {
      let result = [];
      for (var i = 0; i < this.pages.length; i++) {
        var page = this.pages[i];
        if (
          page &&
          page.content &&
          page.content.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
        ) {
          result.push(page);
        }
      }
      return result;
    },

    setBook(state, book) {
      state.book = book;
      state.isBookInitialized = true;
    },

    createBookmark(state) {
      this.mutations.saveLastLocation();
      const bookmark = this.lastLocation;
      this.bookmarks.push(bookmark);
      localStorage.setItem("bookmarks", JSON.stringify(this.bookmarks));
    },
    destroyBookmark(state) {
      for (var i = 0; i < this.bookmarks.length; i++) {
        const bookmark = this.bookmarks[i];
        if (bookmark.location === this.lastLocation.location) {
          this.bookmarks.splice(i, 1);
          localStorage.setItem("bookmarks", JSON.stringify(this.bookmarks));
        }
      }
    },
    gotoCfi(state, cfi) {
      // expecting string like this -- epubcfi(/6/2[titlepage]!/4/1:0)
      if (!state.book.gotoCfi) return;
      state.book.gotoCfi(cfi).then(() => {
        // state.$forceUpdate();
        this.commit("saveLastLocation");
      });
    },
    nextPage(state) {
      state.book.nextPage();
      this.commit("saveLastLocation");
    },
    prevPage(state) {
      state.book.prevPage();
      this.commit("saveLastLocation");
    },

    saveLastLocation(state) {
      function getChapterName(href) {
        for (var i = 0; i < state.chapters.length; i++) {
          if (state.chapters[i].href === href) {
            return state.chapters[i].label;
          }
        }
      }

      const cfi = state.book.getCurrentLocationCfi();
      let result = /epubcfi\((.*)\)/.exec(cfi);
      let location = result[1].replace(/\//g, "-");
      let href = state.book.currentChapter.href;
      let chapterName = getChapterName(href);
      let lastLocation = {
        location: location,
        href: href,
        chapterName: chapterName
      };

      const json = JSON.stringify(lastLocation);
      localStorage.setItem("lastLocation", json);
      state.lastLocation = lastLocation;
    }
  }
});

function init(store) {
  const jsonBookmarks = localStorage.getItem("bookmarks");
  if (jsonBookmarks) {
    Vue.set(store.state, "bookmarks", JSON.parse(jsonBookmarks));
  }
  const jsonLastLocation = localStorage.getItem("lastLocation");
  if (jsonLastLocation) {
    Vue.set(store.state, "lastLocation", JSON.parse(jsonLastLocation));
  }
  return store;
}
window.store = store;
export default init(store);
