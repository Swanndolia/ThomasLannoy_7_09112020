<template>
  <figure v-if="user" :id="user.userId" >
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
<style lang="scss" scoped>
figure {
  display: flex;
  align-items: center;
  gap: 0px 20px;
  margin: 5px -5px;
  padding: 4px;
  width: 210px;
  background: lighten(#2C2F33, 5);
  transition: width 0.4s ease-in-out;
  border-radius: 50px;
  cursor: pointer;
  &:hover {
    width: 260px;
  }
}
a {
  font-size: 16px;
  text-decoration: none;
}
</style>
