<template>
  <div id="user-about">
    <img :src="userAbout.imageUrl" :alt="userAbout.imageAlt" />
    <div id="about">
      <h2>{{ userAbout.username }}</h2>
      <p>{{ userAbout.text }}</p>
    </div>
    <div>
      <button>Edit</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserAbout",
  data() {
    return {
      userAbout: {
        username: "Jonhathan desmoulin",
        text:
          "Phasellus laoreet sed lacus ut tempus. Phasellus vel magna vitae ipsum lacinia ornare et et odio. Mauris laoreet sem et erat lacinia, eget hendrerit dui finibus. Ut porta justo velit, vitae blandit eros mollis eu.",
        imageUrl: "https://picsum.photos/300/200?random",
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