<template>
  <v-card elevation="1">
    <v-breadcrumbs :items="navigations" divider="/" class="font-weight-medium text-uppercase py-4" />
  </v-card>
</template>

<script>
export default {
  name: "pageNavigation",
  computed: {
    navigations() {
      return this.$route.matched.map(e => { return { text: e.meta.title } } )
    },
  }
};
</script>