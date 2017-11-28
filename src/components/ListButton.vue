<template>
    <q-btn outline color="primary" 
        @click="$emit('click')"  
        class=" list-button"
        big
        rounded
    >
        <slot />
    </q-btn>       
</template>
<script>
import { QBtn } from "quasar";
export default {
  components: {
    QBtn
  }
};
</script>
<style>
.list-button{
    margin: 4px auto;
    width:90%;
    margin-left:5%;
}
</style>
