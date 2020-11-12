<template>
  <div class="post">
    <figure id="post-user-info">
      <img class="profile-picture"
        :src="post.user.imageUrl"
        :alt="'Photo de profil de ' + post.user.username"
      />
      <figcaption>
        {{ post.user.username }}<br />
        {{ post.createdAt }}
      </figcaption>
    </figure>
    <div id="post-content">
      <p>{{ post.content }}</p>
      <div v-if="post.imageUrl">
        <img :src="post.imageUrl" :alt="'Image du post'" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Post",
  data() {
    return {};
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.post {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 30px auto;
  background: #f2f2f2;
  border-radius: 50px;
}
#post-user-info {
  display: flex;
  flex-direction: row;
  justify-content: left;
  margin: 10px 30px;
}
#post-content {
  margin: 0px 50px;
}
figcaption{
  margin: 5px;
}
</style>