// ./components/Footer.vue
<script>
export default {
  name: "Footer",
  props: ["url", "text"]
};
</script>

<template>
  <a :href="url">{{ text }}</a>
</template>