export default {
  gotoCfi({ commit, state }, cfi) {
    // expecting string like this -- epubcfi(/6/2[titlepage]!/4/1:0)
    if (!state.book.gotoCfi) return;
    let promise = state.book.gotoCfi(cfi).then(() => {
      commit("saveLastLocation");
    });
    return promise;
  }
};
