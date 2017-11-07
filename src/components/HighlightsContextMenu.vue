<template>
  <q-context-menu ref="context">
      <q-list>
          <q-item>
              <q-item-main @click="destroyHighlight">
                  Delete
              </q-item-main>
          </q-item>
      </q-list>
  </q-context-menu>
</template>
<script>
import { QContextMenu, QList, QItem, QItemMain } from "quasar-framework";
export default {
  props: {
    highlight: {
      type: Object,
      required: true
    }
  },
  components: {
    QContextMenu,
    QList,
    QItem,
    QItemMain
  },
  methods: {
    destroyHighlight() {
      this.$refs.context.close();
      this.$store.commit("destroyHighlight", this.highlight);
    }
  }
};
</script>