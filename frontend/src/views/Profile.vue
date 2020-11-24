<template>
  <main>
    <h1>{{ msg }}</h1>
    <UserAbout :userId="userId" />
    <NewPost />
    <Post
      v-for="post in profilPosts.slice().reverse()"
      :key="post.id"
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
      userId: this.$route.params.id,
      msg: "This is the page with all the posts",
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
