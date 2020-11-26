<template>
  <main>
    <h1>{{ msg }}</h1>
    <NewPost />
    <Post
      v-for="post in feedPosts.slice().reverse()"
      :key="post._id"
      :post="post"
    />
  </main>
  <router-view />
</template>

<script>
import axios from "axios";
import * as storage from "../modules/storage.js";
import NewPost from "../components/NewPost.vue";
import Post from "../components/Post.vue";

export default {
  name: "Feed",
  components: {
    NewPost,
    Post,
  },
  data() {
    return {
      feedPosts: [],
      msg: "This is the page with all the posts",
    };
  },
  mounted() {
    axios
      .get("http://localhost:3000/api/posts", {
        headers: {
          Authorization: "Bearer " + storage.getStorage("token"),
        },
      })
      .then((response) => {
        this.feedPosts = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style scoped>
</style>
 