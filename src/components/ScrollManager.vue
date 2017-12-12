<script>
  let map = Object.create(null);
  map[""] = "hidden";
  map["home"] = "hidden";
  map["reader"] = "hidden";
  map["highlights"] = "visible";
  map["toc"] = "visible";
  map["bookmarks"] = "visible";
  map["searcher"] = "visible";

  export default {
    render(h) {
      return h("div");
    },
    methods: {
      reactToRoute(route) {
        let path = route.path.split("/")[1];
        document.body.style.overflowX = "hidden";
        document.body.style.overflowY = map[path];
      }
    },
    watch: {
      $route(val) {
        this.reactToRoute(val);
      }
    },
    mounted() {
      this.reactToRoute(this.$route);
    }
  };
</script>