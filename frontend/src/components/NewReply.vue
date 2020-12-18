<template>
  <div id="new-reply">
    <textarea
      @keyup.enter="createReply"
      v-model="reply.content"
      placeholder="Ecrivez le contenu de votre réponse ici"
    />
    <div id="button-container">
      <label
        >+<input
          :id="'file-reply ' + reply.id"
          type="file"
          @change="onImageChange"
      /></label>
      <button id="Replyer" @click="createReply">Répondre</button>
    </div>
    <div id="preview">
      <img v-if="reply.imageUrl" :src="reply.imageUrl" />
    </div>
  </div>
</template>

<script>
import * as storage from "../modules/storage.js";
import axios from "axios"; 
export default {
  inheritAttrs: false,
  name: "NewReply",
  data() {
    return {
      userImageUrl: storage.getStorage("imageUrl"),
      reply: {
        content: "",
        image: null,
        imageUrl: "",
      },
    };
  },
  props: {
    commentId: {
      type: String,
      required: true,
    },
  },
  methods: {
    createReply() {
      const ReplyData = new FormData();
      if (this.reply.content || this.reply.image) {
        ReplyData.append("userId", storage.getStorage("userId"));
        if (this.reply.imageUrl != "") {
          ReplyData.append("image", this.reply.image);
          ReplyData.append("imageUrl", this.reply.image.name);
        }
        ReplyData.append("content", this.reply.content);
        //we put image and content of reply in a FormData and check if it's not empty
        if (this.running == true) {
          return;
        }
        this.running = true;
        axios
          .post(
            "http://localhost:3000/api/replies/" + this.commentId,
            ReplyData,
            {
              // Verif token user in SessionStorage before Replying
              headers: {
                Authorization: "Bearer " + storage.getStorage("token"),
              },
            }
          )
          .then((response) => {
            if (response) {
              this.$emit("new-reply-created", true);
            }
          })
          .catch((error) => console.log(error));
        this.running = false;
      }
    },
    onImageChange(e) {
      if (e.target.files[0].type.includes("image")) {
        this.reply.image = e.target.files[0];
        this.reply.imageUrl = URL.createObjectURL(this.reply.image);
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
#new-reply {
  display: flex;
  flex-direction: column;
  background: darken(#2c2f33, 5);
  &:hover {
    cursor: pointer;
  }
  margin: auto;
  width: 100%;
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
#Replyer {
  width: fit-content;
  margin: 10px 10px;
}
.profile-picture {
  align-self: center;
  margin: 0px;
}
</style>
