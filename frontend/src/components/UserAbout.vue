<template>
  <div id="user-about">
    <img :src="userAbout.imageUrl" :alt="userAbout.imageAlt" />
    <div id="about">
      <h2>{{ userAbout.username }}</h2>
      <p>{{ userAbout.about }}</p>
    </div>
    <div>
      <button>Edit</button>
    </div>
  </div>
</template>

<script>
import * as storage from "../modules/storage";
export default {
  name: "UserAbout",
  data() {
    return {
      userAbout: {
        username: storage.getStorage("username"),
        about: storage.getStorage("about"),
        imageUrl: storage.getStorage("imageUrl"),
        imageAlt: "Photo de profil",
      },
    };
  },
};
</script>

<style lang="scss" scoped>
#user-about {
  width: 70%;
  height: 200px;
  display: flex;
  justify-content: space-between;
  margin: 20px auto;
}
img {
  border-radius: 50%;
  width: 200px;
  height: 200px;
}
#about {
  align-self: flex-start;
  margin: 0px 20px;
}
</style>