<template>
  <main>
    <h1>This is the page with all the posts</h1>
    <NewPost />
    <Post v-for="post in feedPosts" :key="post.id" :post="post" />
    <router-view />
  </main>
</template>

<script>
//import axios from "axios";

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
      feedPosts: [
        {
          id: "GitHub",
          content:
            "qjsdgfrtkgjhgsqkdjhrgfkujqs qsudyfgiuqsydf sdf qs df sq dfqsdiufyhaziufgzq sdf azee raf zedf",
          createdAt: "26 Décembre 2019",
          user: { username: "Thomas Lannoy", imageUrl:"https://picsum.photos/300/200?random" },
        },
        {
          id: "Twitter",
          content:
            "djhfgyhzeifd gedzf gzeorf taef zna jk hstfd bezrt ezrtazedfazed ferzr(zuyiuhi iutguytfiuy",
          createdAt: "18 Octobre 2020",
          user: { username: "Fabrice Lannoy", imageUrl:"https://picsum.photos/300/200?random" },
        },
        {
          id: "Netlify",
          content:
            "iuytiu fy fè_tf_è-t fè-rdy tuiytèyt retfkjhgjhgfd hgfd hggvf kjhgiyutdg ytds yfd jkhgfug s yf",
          createdAt: "5 Novembre 2020",
          user: { username: "Maryse Daniel", imageUrl:"https://picsum.photos/300/200?random" },
        },
      ],
    };
  },
  /*mounted() {
    axios
      .get("http://localhost:3000/api/posts", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        this.feedPosts = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },*/
};
</script>

<style scoped>
</style>
 