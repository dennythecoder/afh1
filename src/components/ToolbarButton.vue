<template>
    <q-btn flat @click="$emit('click')">
        <q-icon :name="name" :color="color"></q-icon>
    </q-btn>
</template>
<script>
    import { QBtn, QIcon } from "quasar";
    export default {
      components: {
        QBtn,
        QIcon
      },
      props: {
        name: {
          type: String,
          required: true
        },
        color: {
          type: String,
          required: false,
          default: "primary"
        }
      }
    };
</script>