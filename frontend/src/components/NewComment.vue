<template>
  <img class="profile-picture" :src="userImageUrl" :alt="'Photo de profil'" />
  <div id="new-comment">
    <textarea
      v-model="comment.content"
      placeholder="Ecrivez le contenu de votre commentaire ici"
    />
    <div id="button-container">
      <label
        >+<input
          :id="'file-comment ' + comment.id"
          type="file"
          @change="onImageChange"
      /></label>
      <button id="Commenter" @click="createComment">Commenter</button>
    </div>
    <div id="preview">
      <img v-if="comment.imageUrl" :src="comment.imageUrl" />
    </div>
  </div>
</template>

<script>
import * as storage from "../modules/storage.js";
import axios from "axios"; //axio is used to make request on API

export default {
  inheritAttrs: false,
  name: "NewComment",
  data() {
    return {
      userImageUrl: storage.getStorage("imageUrl"),
      comment: {
        content: null,
        image: null,
        imageUrl: "",
      },
    };
  },
  props: {
    postId: {
      type: String,
      required: true,
    },
  },
  methods: {
    createComment() {
      const CommentData = new FormData();
      const userLikedAndDisliked = [];
      const likesAndDislikes = 0;
      if (this.comment.content || this.comment.image) {
        CommentData.append("username", storage.getStorage("username"));
        CommentData.append("userId", storage.getStorage("userId"));
        CommentData.append("userImageUrl", storage.getStorage("imageUrl"));
        CommentData.append("usersDisliked", userLikedAndDisliked);
        CommentData.append("usersLiked", userLikedAndDisliked);
        CommentData.append("likes", likesAndDislikes);
        CommentData.append("dislikes", likesAndDislikes);
        if (this.comment.imageUrl != "") {
          CommentData.append("image", this.comment.image);
          CommentData.append("imageUrl", this.comment.image.name);
        }
        CommentData.append("content", this.comment.content);
        //we put image and content of comment in a FormData and check if it's not empty
        if (this.running == true) {
          return;
        }
        this.running = true;
        axios
          .post(
            "http://localhost:3000/api/commentpost/" + this.postId ,
            CommentData,
            {
              // Verif token user in SessionStorage before Commenting
              headers: {
                Authorization: "Bearer " + storage.getStorage("token"),
              },
            }
          )
          .then((response) => {
            if (response) {
              window.location.reload();
            }
          })
          .catch((error) => console.log(error));
        this.running = false;
      }
    },
    onImageChange(e) {
      //event to check for image upload to display preview
      this.comment.image = e.target.files[0];
      this.comment.imageUrl = URL.createObjectURL(this.comment.image);
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
#new-comment {
  display: flex;
  flex-direction: column;
  &:hover {
    cursor: pointer;
  }
  border: solid 1px;
  border-radius: 40px;
  width: 80%;
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
  padding: 7px 12px 8px;
  font-weight: 900;
  margin: 10px 10px;
  background: black;
  color: white;
  border-radius: 50%;
}
textarea {
  overflow: hidden;
  outline: none;
  padding: 0px 0px 0px 0px;
  width: 92%;
  margin: 10px 20px 0px;
  border: hidden;
  background: transparent;
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
#Commenter {
  width: fit-content;
  margin: 10px 10px;
}
.profile-picture {
  margin: 10px 0px 0px 10px;
}
</style>
