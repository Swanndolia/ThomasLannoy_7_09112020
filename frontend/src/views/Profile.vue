<template>
  <main>
    <h1>{{ msg }}</h1>
    <UserAbout @profile-update="getProfilePosts" :key="this.$route.params.id" />
    <NewPost
      @new-post-created="getProfilePosts"
      v-if="this.$route.params.id == this.userId"
    />
    <Post
      @reply-created="getProfilePosts"
      @comment-created="getProfilePosts"
      @post-modified="getProfilePosts"
      v-for="post in profilePostsLimit"
      :key="this.$route.params.id + ' ' + post.id + ' ' + post.comments + ' ' + index"
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
      index: 0,
      msg: "Vous parcourez actuellement le profil de:",
      profilPosts: [],
      profilPostsIndex: 20,
      userId: storage.getStorage("userId"),
    };
  },
  computed: {
    profilePostsLimit() {
      return this.profilPosts.slice(0, this.profilPostsIndex);
    },
  },
  watch: {
    "$route.params.id": function () {
      this.getProfilePosts();
    },
  },
  methods: {
    getProfilePosts() {
      this.index++;
      axios
        .get("http://localhost:3000/api/posts/" + this.$route.params.id, {
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
          this.profilPosts = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    checkPosition() {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        // you're at the bottom of the page
        this.profilPostsIndex += 20;
      }
    },
  },
  mounted() {
    this.getProfilePosts();
    window.addEventListener("scroll", this.checkPosition);
  },
};
</script>

<style scoped>
</style>
