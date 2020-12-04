<template>
  <main>
    <h1>{{ msg }}</h1>
    <UserAbout :key="this.$route.params.id" />
    <NewPost @new-post-created="getProfilePosts" v-if="this.$route.params.id == this.userId" />
    <Post
      v-for="post in profilPosts.slice().reverse()"
      :key="this.$route.params.id + ' ' + post.id"
      :post="post"
    />
    <router-view />
  </main>
</template>

<script>
import axios from "axios";
import * as storage from "../modules/storage.js";
import UserAbout from "../components/UserAbout.vue";
import NewPost from "../components/NewPost.vue";
import Post from "../components/Post.vue";

export default {
  name: "Profile",
  components: {
    UserAbout,
    NewPost,
    Post,
  },
  data() {
    return {
      msg: "Vous parcourez actuellement le profil de:",
      profilPosts: [],
      userId: storage.getStorage("userId"),
    };
  },
  watch: {
    "$route.params.id": function () {
      this.getProfilePosts();
    },
  },
  methods: {
    getProfilePosts() {
      axios
        .get("http://localhost:3000/api/posts/" + this.$route.params.id, {
          headers: {
            Authorization: "Bearer " + storage.getStorage("token"),
          },
        })
        .then((response) => {
          this.profilPosts = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.getProfilePosts();
  },
};
</script>

<style scoped>
</style>
