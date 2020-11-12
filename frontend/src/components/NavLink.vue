<template>
  <router-link :to="url">{{ text }}</router-link>
</template>

<script>
export default {
  name: "NavLink",
  props: ["url", "text"],
};
</script>