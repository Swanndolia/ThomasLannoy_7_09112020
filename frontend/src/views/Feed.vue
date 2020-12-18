<template>
  <main>
    <h1>{{ msg }}</h1>
    <NewPost @new-post-created="getAllPosts" />
    <Post
      @reply-created="getAllPosts"
      @comment-created="getAllPosts"
      @post-modified="getAllPosts"
      v-for="post in feedPostsLimit"
      :key="post.id + ' ' + post.comments + ' ' + index"
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
      index: 0,
      feedPosts: [],
      feedPostsIndex: 20,
      msg: "Bienvenue sur le fil d'actualité général de Groupomania",
    };
  },
  computed: {
    //incremented by 20 when user reach bottom of the page
    feedPostsLimit() {
      return this.feedPosts.slice(0, this.feedPostsIndex);
    },
  },
  watch: {
    //watch route params change to reload componements if user go from a profile to another one 
    "$route.params.id": function () {
      this.getAllPosts();
    },
  },
  methods: {
    //get all post ands increment index to ensure postList reload on new post/comment/reply 
    getAllPosts() {
      this.index++;
      axios
        .get("http://localhost:3000/api/posts", {
          headers: {
            Authorization: "Bearer " + storage.getStorage("token"),
          },
        })
        .then((response) => {
          //change date to human readable
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
              for (
                let j = 0;
                j < response.data[i].comments[k].replies.length;
                j++
              ) {
                response.data[i].comments[k].replies[
                  j
                ].createdAt = response.data[i].comments[k].replies[
                  j
                ].createdAt.replace("T", " à ");
                response.data[i].comments[k].replies[
                  j
                ].createdAt = response.data[i].comments[k].replies[
                  j
                ].createdAt.replace(".000Z", "");
              }
            }
          }
          this.feedPosts = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //method to chekc if user is at the bottom of the page
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
 