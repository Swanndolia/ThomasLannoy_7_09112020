<template>
  <main>
    <h1>{{ msg }}</h1>
    <UserAbout />
    <NewPost />
    <Post
      v-for="post in profilPosts.slice().reverse()"
      :key="post._id"
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
      profilPosts: [],
      msg: "This is the profile page of " + storage.getStorage("username"),
    };
  },
  mounted() {
    axios
      .get("http://localhost:3000/api/posts/" + this.$route.params.id, {
        params: { userId: this.userId },
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
};
</script>

<style scoped>
</style>
