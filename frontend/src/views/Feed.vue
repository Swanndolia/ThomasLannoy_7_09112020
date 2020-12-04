<template>
  <main>
    <h1>{{ msg }}</h1>
    <NewPost @new-post-created="getAllPosts"/>
    <Post
      v-for="post in feedPosts.slice().reverse()"
      :key=" this.feedPosts + ' ' + post.id"
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
      msg: "Bienvenue sur le fil d'actualité général de Groupomania",
    };
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
  },
  mounted() {
    this.getAllPosts();
  },
};
</script>

<style scoped>
</style>
 