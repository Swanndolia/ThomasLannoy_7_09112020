<template>
  <img class="profile-picture" :src="userImageUrl" :alt="'Photo de profil'" />
  <div id="new-comment">
    <textarea
      @keyup.enter="createComment"
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
import axios from "axios"; 

export default {
  inheritAttrs: false,
  name: "NewComment",
  data() {
    return {
      userImageUrl: storage.getStorage("imageUrl"),
      comment: {
        content: "",
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
      if (this.comment.content || this.comment.image) {
        CommentData.append("userId", storage.getStorage("userId"));
        if (this.comment.imageUrl != "") {
          CommentData.append("image", this.comment.image);
          CommentData.append("imageUrl", this.comment.image.name);
        }
        CommentData.append("content", this.comment.content);
        if (this.running == true) {
          return;
        }
        this.running = true;
        axios
          .post(
            "http://localhost:3000/api/comments/" + this.postId,
            CommentData,
            {
              headers: {
                Authorization: "Bearer " + storage.getStorage("token"),
              },
            }
          )
          .then((response) => {
            if (response) {
              this.$emit("new-comment-created", true);
            }
          })
          .catch((error) => console.log(error));
        this.running = false;
      }
    },
    onImageChange(e) {
      if (e.target.files[0].type.includes("image")) {
        this.comment.image = e.target.files[0];
        this.comment.imageUrl = URL.createObjectURL(this.comment.image);
      }
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
  background: darken(#2c2f33, 5);
  &:hover {
    cursor: pointer;
  }
  border: solid 1px;
  border-radius: 40px;
  width: 90%;
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
  align-self: center;
  margin: 0px;
}
</style>
