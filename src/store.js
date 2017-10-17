import Vue from "vue";
import router from "./router";
import Vuex from "vuex";


const store =  new Vuex.Store({
  state:{
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
      return state.$route.path.indexOf("/reader") !== -1;
    },
    isSearcher(state) {
      return state.$route.path.indexOf("/searcher") !== -1;
    },
    isBookmarked(state) {
      let bookmarks = this.bookmarks,
        lastLocation = this.lastLocation;
      for (var i = 0; i < bookmarks.length; i++) {
        if (bookmarks[i].location === lastLocation.location) {
          return true;
        }
      }
      return false;
    }
  },
  mutation: {
    generatePagination(state) {
      let store = this;
      store.pages.splice(1, this.pages.length - 1);
      const localStoragePages = localStorage.getItem("pages");
      if (localStoragePages) {
        let worker = new Worker("./src/ww-json-parser.js");
        worker.onmessage = function(response) {
          store.pages.push(response.data);
        };
        worker.postMessage(localStoragePages);
      } else {
        store.book.generatePagination().then(function(pages) {
          Vue.set(store, "pages", pages);
          localStorage.setItem("pages", JSON.stringify(pages));
        });
      }
    },
    searchPages(searchTerm) {
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
    }
  },

  setBook(state, book) {
    state.book = book;
    state.isBookInitialized = true;
  },

  createBookmark() {
    this.saveLastLocation();
    var bookmark = this.lastLocation;
    this.bookmarks.push(bookmark);
    localStorage.setItem("bookmarks", JSON.stringify(this.bookmarks));
  },
  destroyBookmark() {
    for (var i = 0; i < this.bookmarks.length; i++) {
      const bookmark = this.bookmarks[i];
      if (bookmark.location === this.lastLocation.location) {
        this.bookmarks.splice(i, 1);
        localStorage.setItem("bookmarks", JSON.stringify(this.bookmarks));
      }
    }
  },
  gotoCfi(cfi) {
    // expecting string like this -- epubcfi(/6/2[titlepage]!/4/1:0)
    let store = this;
    store.book.gotoCfi(cfi).then(function() {
      store.$forceUpdate();
      store.saveLastLocation();
    });
  },
  nextPage() {
    this.book.nextPage();
    this.saveLastLocation();
  },
  prevPage() {
    this.book.prevPage();
    this.saveLastLocation();
  },

  saveLastLocation() {
    let store = this;
    function getChapterName(href) {
      for (var i = 0; i < store.chapters.length; i++) {
        if (store.chapters[i].href === href) {
          return store.chapters[i].label;
        }
      }
    }

    const cfi = this.book.getCurrentLocationCfi();
    let result = /epubcfi\((.*)\)/.exec(cfi);
    let location = result[1].replace(/\//g, "-");
    let href = this.book.currentChapter.href;
    let chapterName = getChapterName(href);
    let lastLocation = {
      location: location,
      href: href,
      chapterName: chapterName
    };

    const json = JSON.stringify(lastLocation);

    localStorage.setItem("lastLocation", json);
    Vue.set(this, "lastLocation", lastLocation);
  }
});

function init(store) {
  const jsonBookmarks = localStorage.getItem("bookmarks");
  if (jsonBookmarks) {
    Vue.set(store, "bookmarks", JSON.parse(jsonBookmarks));
  }
  const jsonLastLocation = localStorage.getItem("lastLocation");
  if (jsonLastLocation) {
    Vue.set(store, "lastLocation", JSON.parse(jsonLastLocation));
  }
  return store;
}

export default init(store)