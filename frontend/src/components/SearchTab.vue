<template>
  <figure v-if="user" :id="user.id">
    <img
      class="profile-picture"
      :src="user.imageUrl"
      :alt="'Photo de profil de ' + user.username"
    />
    <figcaption>
      {{ user.username }}
    </figcaption>
  </figure>
</template>

<script>
export default {
  name: "SearchTab",
  data() {
    return {};
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>
