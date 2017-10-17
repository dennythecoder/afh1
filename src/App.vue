<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <h4>Test</h4>
    <Home></Home>
    <router-view />
  </div>
</template>

<script>
import Home from "./components/Home.vue";
export default {
  components: {
    Home
  }
};
</script>

<style></style>
