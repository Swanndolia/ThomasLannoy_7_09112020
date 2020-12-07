<template>
  <main>
    <h1>{{ msg }}</h1>
    <NewPost @new-post-created="getAllPosts" />
    <Post
      @comment-created="getAllPosts"
      v-for="post in feedPostsLimit"
      :key="post.id + ' ' + post.comments"
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
      feedPostsIndex: 20,
      msg: "Bienvenue sur le fil d'actualité général de Groupomania",
    };
  },
  computed: {
    feedPostsLimit() {
      return this.feedPosts.slice(0, this.feedPostsIndex);
    },
  },
  watch: {
    "$route.params.id": function () {
      this.getAllPosts();
    },
  },
  methods: {
    getAllPosts() {
      axios
        .get("http://localhost:3000/api/posts", {
          headers: {
            Authorization: "Bearer " + storage.getStorage("token"),
          },
        })
        .then((response) => {
          for (let i = 0; i < response.data.length; i++) {
            response.data[i].createdAt = response.data[i].createdAt.replace(
              "T",
              " à "
            );
            response.data[i].createdAt = response.data[i].createdAt.replace(
              ".000Z",
              ""
            );
            for (let k = 0; k < response.data[i].comments.length; k++) {
              response.data[i].comments[k].createdAt = response.data[
                i
              ].comments[k].createdAt.replace("T", " à ");
              response.data[i].comments[k].createdAt = response.data[
                i
              ].comments[k].createdAt.replace(".000Z", "");
            }
          }
          this.feedPosts = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    checkPosition() {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        this.feedPostsIndex += 20;
      }
    },
  },
  mounted() {
    this.getAllPosts();
    window.addEventListener("scroll", this.checkPosition);
  },
};
</script>

<style scoped>
</style>
 