<template>
  <h1>{{ msg }}</h1>
    <router-view />
</template>

<script>
export default {
  name: "ShowPost",
  components: {},
  data() {
    return {
      msg: "This is the page when a post got clicked",
    };
  },
};
</script>

<style scoped>
</style>
