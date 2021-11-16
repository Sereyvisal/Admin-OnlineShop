<template>
  <div>
    <vue-editor v-model="content" />
    {{content}}
    <div v-html="content"></div>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";

export default {
  components: { VueEditor },

  data: () => ({
    content: "<h1>Some initial content</h1>"
  })
};
</script>