<template>
  <main>
    <h1>{{ msg }}</h1>
    <UserAbout url="/feed" text="Accueil" />
    <NewPost />
    <router-view />
  </main>
</template>

<script>
import UserAbout from "../components/UserAbout.vue";
import NewPost from "../components/NewPost.vue";

export default {
  name: "Profile",
  components: {
    UserAbout,
    NewPost,
  },
  data() {
    return {
      msg: "This is the page of an user profile",
    };
  },
};
</script>

<style scoped>
</style>
