<template>
  <router-link :to="url">{{ text }}</router-link>
</template>

<script>
export default {
  name: "Footer",
  props: ["url", "text"],
};
</script>