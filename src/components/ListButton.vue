<template>
    <q-btn outline color="primary" 
        @click="$emit('click')"  
        class="full-width"
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
 	