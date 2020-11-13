<template>
  <main>
    <h1>This is the page with all the posts</h1>
    <NewPost />
    <Post
      v-for="post in feedPosts"
      :key="post.id"
      :post="post"
    />
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
            "Phasellus laoreet sed lacus ut tempus. Phasellus vel magna vitae ipsum lacinia ornare et et odio. Mauris laoreet sem et erat lacinia, eget hendrerit dui finibus. Ut porta justo velit, vitae blandit eros mollis eu.",
          createdAt: "26 Décembre 2019",
          user: {
            username: "Thomas Lannoy",
            imageUrl: "https://picsum.photos/300/200?random",
          },
        },
        {
          id: "Twitter",
          content:
            "Phasellus laoreet sed lacus ut tempus. Phasellus vel magna vitae ipsum lacinia ornare et et odio. Mauris laoreet sem et erat lacinia, eget hendrerit dui finibus. Ut porta justo velit, vitae blandit eros mollis eu.",
          createdAt: "18 Octobre 2020",
          imageUrl: "https://picsum.photos/300/200?random",
          user: {
            username: "Fabrice Lannoy",
            imageUrl: "https://picsum.photos/300/200?random",
          },
        },
        {
          id: "Netlify",
          content:
            "Phasellus laoreet sed lacus ut tempus. Phasellus vel magna vitae ipsum lacinia ornare et et odio. Mauris laoreet sem et erat lacinia, eget hendrerit dui finibus. Ut porta justo velit, vitae blandit eros mollis eu.",
          createdAt: "5 Novembre 2020",
          user: {
            username: "Maryse Daniel",
            imageUrl: "https://picsum.photos/300/200?random",
          },
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
 