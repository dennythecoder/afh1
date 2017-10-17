window.mb = window.mb || {};

mb.store = new Vue({
  data: {
    bookmarks: [],
    lastLocation: {},
    book: {},
    chapters: [],
    isBookInitialized: false,
    pages: []
  },
  router: mb.router,
  computed: {
    isReader: function() {
      return this.$route.path.indexOf("/reader") !== -1;
    },
    isSearcher: function() {
      return this.$route.path.indexOf("/searcher") !== -1;
    },
    isBookmarked: function() {
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
  methods: {
    generatePagination: function() {
      let store = this;
      store.pages.splice(1, this.pages.length - 1);
      const localStoragePages = localStorage.getItem("pages");
      if (localStoragePages) {
        let worker = new Worker("./src/ww-json-parser.js");
        worker.onmessage = function(response) {
          store.pages.push(response.data);
        };
        worker.postMessage(localStoragePages);
      }
 else {
        store.book.generatePagination().then(function(pages) {
          Vue.set(store, "pages", pages);
          localStorage.setItem("pages", JSON.stringify(pages));
        });
      }
    },
    searchPages: function(searchTerm) {
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

    setBook: function(book) {
      Vue.set(this, "book", book);
      this.isBookInitialized = true;
    },

    createBookmark: function() {
      this.saveLastLocation();
      var bookmark = this.lastLocation;
      this.bookmarks.push(bookmark);
      localStorage.setItem("bookmarks", JSON.stringify(this.bookmarks));
    },
    destroyBookmark: function() {
      for (var i = 0; i < this.bookmarks.length; i++) {
        var bookmark = this.bookmarks[i];
        if (this.bookmarks[i].location == this.lastLocation.location) {
          this.bookmarks.splice(i, 1);
          localStorage.setItem("bookmarks", JSON.stringify(this.bookmarks));
        }
      }
    },
    gotoCfi: function(cfi) {
      // expecting string like this -- epubcfi(/6/2[titlepage]!/4/1:0)
      let store = this;
      store.book.gotoCfi(cfi).then(function() {
        store.$forceUpdate();
        store.saveLastLocation();
      });
    },
    nextPage: function() {
      this.book.nextPage();
      this.saveLastLocation();
    },
    prevPage: function() {
      this.book.prevPage();
      this.saveLastLocation();
    },

    saveLastLocation: function() {
      function getChapterName(href) {
        for (var i = 0; i < mb.store.chapters.length; i++) {
          if (mb.store.chapters[i].href === href) {
            return mb.store.chapters[i].label;
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
  },
  created: function() {
    const jsonBookmarks = localStorage.getItem("bookmarks");
    if (jsonBookmarks) {
      Vue.set(this, "bookmarks", JSON.parse(jsonBookmarks));
    }
    const jsonLastLocation = localStorage.getItem("lastLocation");
    if (jsonLastLocation) {
      Vue.set(this, "lastLocation", JSON.parse(jsonLastLocation));
    }
  }
});
