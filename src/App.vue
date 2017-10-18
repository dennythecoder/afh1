<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view />
    <Reader/> 
  </div>
</template>

<script>
import Reader from "./components/Reader.vue";
export default {
  components: {
    Reader
  }
};
</script>

<style></style>
