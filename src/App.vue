<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view />
    <Reader/> 
    <ScrollManager/>
  </div>
</template>

<script>
import Reader from "./components/Reader.vue";
import ScrollManager from "./components/ScrollManager.vue";
export default {
  components: {
    Reader,
    ScrollManager
  }
};
</script>

<style></style>
