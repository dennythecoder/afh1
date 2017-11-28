import Vue from "vue";
export default {
  addChapter(state, chapter) {
    state.chapters.push(chapter);
  },
  generatePagination(state) {
    state.pages.splice(1, state.pages.length - 1);
    const localStoragePages = localStorage.getItem("pages");
    if (localStoragePages) {
      /* let worker = new Worker("./statics/ww-json-parser.js");
      worker.onmessage = function(response) {
        state.pages.push(response.data);
      };
      worker.postMessage(localStoragePages);
      */
      let pages = JSON.parse(localStoragePages);
      Vue.set(state, "pages", pages);
    } else {
      state.book.generatePagination().then(function(pages) {
        Vue.set(state, "pages", pages);
        localStorage.setItem("pages", JSON.stringify(pages));
      });
    }
  },
  searchPages(state, searchTerm) {
    state.searchTerm = searchTerm;
  },

  setBook(state, book) {
    state.book = book;
    state.isBookInitialized = true;
  },
  createHighlight(state, highlight) {
    this.commit("saveLastLocation");
    highlight.location = state.lastLocation;
    state.highlights.push(highlight);
    localStorage.setItem("highlights", JSON.stringify(state.highlights));
  },
  destroyHighlight(state, highlight) {
    for (let i = 0; i < state.highlights.length; i++) {
      if (state.highlights[i] === highlight) {
        highlight.start = highlight.endLocation.start;
        highlight.end = highlight.endLocation.end;
        state.destroyedHighlights.push(highlight);
        state.highlights.splice(i, 1);
        localStorage.setItem("highlights", JSON.stringify(state.highlights));
      }
    }
  },
  createBookmark(state) {
    this.commit("saveLastLocation");
    const bookmark = state.lastLocation;
    state.bookmarks.push(bookmark);
    localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
  },
  destroyBookmark(state, argBookmark) {
    if (argBookmark) {
      return this.commit("destroyBookmarkByArg", argBookmark);
    }
    for (var i = 0; i < state.bookmarks.length; i++) {
      const bookmark = state.bookmarks[i];
      if (bookmark.location === state.lastLocation.location) {
        state.bookmarks.splice(i, 1);
        localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
      }
    }
  },
  destroyBookmarkByArg(state, argBookmark) {
    for (var i = 0; i < state.bookmarks.length; i++) {
      const bookmark = state.bookmarks[i];
      if (bookmark === argBookmark) {
        state.bookmarks.splice(i, 1);
        localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
      }
    }
  },
  nextPage(state) {
    state.book.nextPage();
    this.commit("saveLastLocation");
  },
  prevPage(state) {
    state.book.prevPage();
    this.commit("saveLastLocation");
  },
  toggleIsTextSelectable(state) {
    state.isTextSelectable = !state.isTextSelectable;
  },
  setIsTextSelectable(state, val) {
    state.isTextSelectable = val;
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
};
