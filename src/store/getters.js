export default {
  bookmarks: state => state.bookmarks,
  chapters: state => state.chapters,
  highlights: state => state.highlights,
  destroyedHighlights: state => state.destroyedHighlights,
  isBookInitialized: state => state.isBookInitialized,
  lastLocation: state => state.lastLocation,
  pages: state => state.pages,
  searchTerm: state => state.searchTerm,
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
  searchResults(state) {
    let result = [];
    let searchTerm = state.searchTerm;
    if (searchTerm === "") return result;
    for (var i = 0; i < state.pages.length; i++) {
      let page = state.pages[i];
      if (
        page &&
        page.content &&
        page.content.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
      ) {
        const index = page.content
          .toLowerCase()
          .indexOf(searchTerm.toLowerCase());
        const buffer = 50;
        const start = index - buffer > 0 ? index - buffer : 0;
        const end =
          index + buffer < page.content.length - 1
            ? index + buffer
            : page.content.length - 1;
        result.push({
          shortResult: "..." + page.content.substring(start, end) + "...",
          ...page
        });
      }
    }
    return result;
  }
};
