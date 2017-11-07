<template>
  <q-context-menu ref="context">
      <q-list>
          <q-item>
              <q-item-main @click="destroyBookmark">
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
    bookmark: {
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
    destroyBookmark() {
      this.$refs.context.close();
      this.$store.commit("destroyBookmark", this.bookmark);
    }
  }
};
</script>