export default {
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
  },
  bookmarks(state) {
    return state.bookmarks;
  },
  searchResults(state) {
    let result = [];
    let searchTerm = state.searchTerm;
    if (searchTerm === "") return result;
    for (var i = 0; i < state.pages.length; i++) {
      var page = state.pages[i];
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
  searchTerm(state) {
    return state.searchTerm;
  }
};
