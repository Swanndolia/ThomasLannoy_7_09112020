<template>
  <div id="new-post">
    <img
      class="profile-picture"
      :src="'https://picsum.photos/300/200?random'"
      :alt="'Photo de profil'"
    />
    <div>
      <textarea
        v-model="post.content"
        placeholder="Ecrivez le contenu de votre post ici"
      />
      <div id="button-container">
        <label for="file">+</label>
        <input id="file" type="file" @change="onImageChange" />
        <button id="gag">9gag</button>
        <div>
          <button id="poster" @click="createPost">Poster</button>
        </div>
      </div>
    </div>
    <div id="preview">
      <img v-if="post.imageUrl" :src="post.imageUrl" />
    </div>
  </div>
</template>

<script>
import axios from "axios"; //axio is used to make request on API

export default {
  name: "NewPost",
  data() {
    return {
      post: {
        content: null,
        image: null,
        imageUrl: "",
      },
    };
  },
  methods: {
    createPost() {
      const postData = new FormData();
      if (this.post.content || this.post.image) {
        postData.append("user", this.post.user);
        postData.append("image", this.post.image);
        postData.append("content", this.post.content);
        //we put image and content of post in a FormData and check if it's not empty
        axios.interceptors.request.use(
          (config) => {
            // perform a task before the request is sent
            console.log("Request was sent");

            return config;
          },
          (error) => {
            // handle the error
            return Promise.reject(error);
          }
        );

        axios
          .post("http://localhost:3000/api/posts", postData, {
            /* Verif token user in SessionStorage before posting
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token"),
            },
            */
          })
          .then((response) => {
            if (response) {
              window.location.reload();
            }
          })
          .catch((error) => console.log(error));
      }
    },
    onImageChange(e) {
      //event to check for image upload to display preview
      this.post.image = e.target.files[0];
      this.post.imageUrl = URL.createObjectURL(this.post.image);
    },
  },
};
</script>

<style lang="scss" scoped>
#button-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
#new-post {
  display: flex;
  flex-direction: column;
  &:hover {
    cursor: pointer;
  }
  border: solid 1px;
  border-radius: 40px;
  width: 80%;
  margin: auto;
}
#preview {
  display: flex;
  justify-content: center;
  align-items: center;
}
#preview img {
  max-width: 100%;
  max-height: 500px;
  margin: 10px;
}
input {
  display: none;
}
label {
  position: absolute;
  padding: 6px 9px;
  font-weight: 900;
  margin: 0px 10px;
  background: black;
  color: white;
  border-radius: 50%;
}
textarea {
  overflow: hidden;
  outline: none;
  padding: 0px 0px 80px;
  min-height: 100%;
  width: 80%;
  margin: 0px 10%;
  border: none;
  resize: none;
  &:hover {
    cursor: pointer;
  }
}
button {
  outline: none;
  width: 50px;
  height: 30px;
  color: white;
  background: black;
  border-radius: 50% 30%;
  border: 0px;
  &:hover {
    cursor: pointer;
  }
}
#gag {
  margin: 0px 50px;
}
#poster {
  margin: 5px 10px;
}
.profile-picture {
  margin: 5px 5px 0px auto;
}
</style>
