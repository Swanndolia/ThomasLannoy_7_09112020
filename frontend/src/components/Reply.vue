<template>
  <div class="reply" :id="reply.id">
    <figure class="reply-user-info">
      <div id="info-container">
        <img
          class="profile-picture"
          :src="reply.user.imageUrl"
          :alt="'Photo de profil de ' + reply.user.username"
        />
        <figcaption>
          {{ reply.user.username }}<br />
          <span class="date">{{ reply.createdAt }}</span>
        </figcaption>
      </div>
      <div class="reacts">
        <button
          class="dropdown-button"
          :id="'edit-btn-reply ' + this.reply.id"
          @click="showReplyMenu"
        >
          <p>.</p>
          <p>.</p>
          <p>.</p>
        </button>
        <div :id="'edit-menu-reply ' + this.reply.id" class="dropdown-content">
          <button @click="modifyReply">Modifier</button>
          <button @click="deleteReply">Supprimer</button>
          <button id="cancel-btn" @click="hideReplyMenu">Annuler</button>
        </div>
        <span :key="replyDetails.likes" class="likes"
          >{{ replyDetails.likes }}
        </span>
        <span :key="replyDetails.dislikes" class="dislikes">{{
          replyDetails.dislikes
        }}</span>
      </div>
    </figure>
    <div class="reply-content">
      <p :id="this.reply.id + ' reply content'">
        {{ reply.content }}
      </p>
      <label
        ><input
          @change="onImageChange"
          class="file-input"
          :id="this.reply.id + ' reply file-input'"
          type="file"
          disabled />
        <div :id="this.reply.id + ' replyInfo'" class="info">
          <p>
            Cliquez pour modifier<br />
            la photo de votre réponse
          </p>
        </div>
        <img
          v-if="reply.imageUrl != null"
          :id="this.reply.id + ' replyEditablePicture'"
          :src="reply.imageUrl"
          :alt="'Image de la réponse'"
      /></label>
      <button
        @click="sendModifiedReply"
        class="saveEdit"
        :id="this.reply.id + ' reply confirmEdit'"
      >
        Enregistrer les modifications
      </button>
    </div>
    <div id="react">
      <p
        @click="addReplyReact('chooseReactReply' + reply.id)"
        class="chooseReactReply"
        :id="'chooseReactReply' + reply.id"
      >
        Réagir
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as storage from "../modules/storage";
export default {
  name: "Reply",
  data() {
    return {
      replyDetails: this.reply,
    };
  },
  props: {
    reply: {
      type: Object,
      required: true,
    },
    post: {
      type: Object,
      required: true,
    },
  },
  methods: {
    showReplyMenu() {
      document.getElementById(
        "edit-menu-reply " + this.reply.id
      ).style.display = "flex";
    },
    hideReplyMenu() {
      document.getElementById(
        "edit-menu-reply " + this.reply.id
      ).style.display = "none";
    },
    deleteReply() {
      axios
        .delete("http://localhost:3000/api/replies/" + this.reply.id, {
          headers: {
            Authorization: "Bearer " + storage.getStorage("token"),
          },
        })
        .then((response) => {
          if (response) {
            document.getElementById(this.reply.id).style.display = "none";
          }
        })
        .catch((error) => console.log(error));
    },
    //transform reply to something editable
    modifyReply() {
      this.hideReplyMenu();
      document
        .getElementById(this.reply.id + " reply content")
        .setAttribute("contenteditable", "true");
      document.getElementById(this.reply.id + " reply content").focus();
      document.getElementById(
        this.reply.id + " reply confirmEdit"
      ).style.display = "inline-block";
      if (document.getElementById(this.reply.id + " replyEditablePicture")) {
        document
          .getElementById(this.reply.id + " replyEditablePicture")
          .classList.add("editimg");
        document.getElementById(this.reply.id + " replyInfo").style.display =
          "inline-block";
      } else {
        document.getElementById(
          this.reply.id + " reply file-input"
        ).style.display = "inline-block";
      }
      document
        .getElementById(this.reply.id + " reply file-input")
        .removeAttribute("disabled");
    },
    //send edited infos to backend
    sendModifiedReply() {
      document.getElementById(
        this.reply.id + " reply file-input"
      ).style.display = "none";
      document.getElementById(this.reply.id + " replyInfo").style.display =
        "none";
      document
        .getElementById(this.reply.id + " reply file-input")
        .setAttribute("disabled", "true");
      if (document.getElementById(this.reply.id + " replyEditablePicture")) {
        document
          .getElementById(this.reply.id + " replyEditablePicture")
          .classList.remove("editimg");
      }
      document
        .getElementById(this.reply.id + " reply content")
        .setAttribute("contenteditable", "false");
      document.getElementById(
        this.reply.id + " reply confirmEdit"
      ).style.display = "none";
      const updateReplyData = new FormData();
      updateReplyData.append(
        "content",
        document.getElementById(this.reply.id + " reply content").textContent
      );
      if (this.replyDetails.image) {
        updateReplyData.append("imageUrl", this.replyDetails.image.name);
      }
      axios
        .put(
          "http://localhost:3000/api/replies/" + this.reply.id,
          updateReplyData,
          {
            headers: {
              Authorization: "Bearer " + storage.getStorage("token"),
            },
          }
        )
        .then((response) => {
          if (response) {
            //not much to do
          }
        })
        .catch((error) => console.log(error));
    },
    addReplyReact(id) {
      const reactData = {
        react: "",
        userId: storage.getStorage("userId"),
      };
      if (
        Math.round(
          (parseInt(document.getElementById(id).style.backgroundPositionX) *
            -1) /
            document.getElementById(id).offsetWidth
        ) == 1
      ) {
        reactData.react = -1;
      } else {
        reactData.react = 1;
      }
      if (this.running == true) {
        return;
      }
      this.running = true;
      axios
        .post(
          "http://localhost:3000/api/replies/" + this.reply.id + "/react",
          reactData,
          {
            headers: {
              Authorization: "Bearer " + storage.getStorage("token"),
            },
          }
        )// check response message to add correct class to element (to display color green / red / remove classlist)
        .then((response) => {
          if (response) {
            if (response.data.react == -1) {
              if (document.getElementById(id).classList.contains("reactLike")) {
                this.replyDetails.likes--;
              }
              document
                .getElementById(id)
                .classList.remove("reactLike", "chooseReactReply");
              document.getElementById(id).classList.add("reactDislike");
              this.replyDetails.dislikes++;
            }
            if (response.data.react == 1) {
              if (
                document.getElementById(id).classList.contains("reactDislike")
              ) {
                this.replyDetails.dislikes--;
              }
              document
                .getElementById(id)
                .classList.remove("reactDislike", "chooseReactReply");
              document.getElementById(id).classList.add("reactLike");
              this.replyDetails.likes++;
            }
            if (response.data.message.includes("supprimée")) {
              if (
                document.getElementById(id).classList.contains("reactDislike")
              ) {
                this.replyDetails.dislikes--;
              } else {
                this.replyDetails.likes--;
              }
              document
                .getElementById(id)
                .classList.remove("reactLike", "reactDislike");
            }
            this.running = false;
          }
        })
        .catch((error) => console.log(error));
    },
    onImageChange(e) {
      if (e.target.files[0].type.includes("image")) {
        this.replyDetails.image = e.target.files[0];
        this.replyDetails.imageUrl = URL.createObjectURL(
          this.replyDetails.image
        );
      }
    },
  },
  mounted() {
    //remove ... to edit reply if not author or op
    const replies = document.getElementsByClassName("post");
    replies.forEach(() => {
      if (
        storage.getStorage("userId") != this.reply.userId &&
        storage.getStorage("isOp") == "false"
      ) {
        document.getElementById(
          "edit-btn-reply " + this.reply.id
        ).style.visibility = "hidden";
      }
    });
    //add to each elements a mouse location tracker inside react field to manage dynamic background 
    const elements = document.getElementsByClassName("chooseReactReply");
    elements.forEach((el) =>
      el.addEventListener("mousemove", (e) => {
        event.target.style.backgroundPositionX = -e.offsetX + "px";
        event.target.classList.add("chooseReactReply");
      })
    );
    const reacts = this.reply.reactsReplies;
    for (let i = 0; i < reacts.length; i++) {
      if (
        reacts[i].react == -1 &&
        reacts[i].userId.toString().includes(storage.getStorage("userId"))
      ) {
        document
          .getElementById("chooseReactReply" + this.reply.id)
          .classList.add("reactDislike");
      }
      if (
        reacts[i].react == 1 &&
        reacts[i].userId.toString().includes(storage.getStorage("userId"))
      ) {
        document
          .getElementById("chooseReactReply" + this.reply.id)
          .classList.add("reactLike");
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.dropdown-button {
  outline: none;
  border: none;
  background: transparent;
  margin: 60px 0px;
  position: absolute;
  border-radius: 50px;
  padding: 0px 15px 8px;
  & p {
    font-size: 30px;
    line-height: 0%;
    margin: 0px 0px 8px;
  }
}
.dropdown {
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-self: flex-end;
  margin: 0px 20px;
}
#cancel-btn {
  border: transparent;
}
.dropdown-content {
  position: absolute;
  display: none;
  flex-direction: column;
  width: 100px;
  margin: 60px 0px;
  border: 1px solid;
  border-radius: 20px;
  background: #2c2f33;
  overflow: hidden;
  & button {
    padding: 5px;
    outline: none;
    background: transparent;
    border: none;
    border-bottom: dashed 1px;
  }
}
.chooseReactReply:hover {
  background: linear-gradient(to left, #5c1f24 50%, #2f6d2f 50%);
  background-size: 200%;
}
.reactLike {
  background: #2f6d2f;
}
.reactDislike {
  background: #5c1f24;
}
#info-container {
  display: flex;
}
.reacts {
  display: flex;
  flex-direction: column;
}
.likes,
.dislikes {
  position: absolute;
  margin-left: 5px;
  padding: 5px 10px;
  border-radius: 50%;
}
.likes {
  background: #2f6d2f;
}
.dislikes {
  background: #5c1f24;
  margin-top: 30px;
}
.newreply {
  display: flex;
  background: #2c2f33;
  justify-content: space-around;
  display: none;
  padding: 5px 0px 20px;
}
input {
  width: 80%;
  border-radius: 50px;
  padding: 10px;
  outline: none;
}
.reply {
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 30px auto;
  background: lighten(#2c2f33, 10);
  border-radius: 50px;
}
.reply-user-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 10px 20px;
}
.reply-content {
  margin: -10px 50px;
  & img {
    width: 100%;
    margin: 10px 0px;
  }
  position: relative;
  &.replyInfo {
    text-align: center;
  }
}
figcaption {
  min-width: fit-content;
  margin: 5px;
}
#react {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 10px 10%;
  border-top: solid 1px;
  & p {
    width: 90%;
    text-align: center;
    padding: 15px 5px;
    border: dashed #bbbbbb;
    cursor: pointer;
    border-radius: 50px;
    border-width: 0px 1px 0px 1px;
  }
}
.date {
  color: #dcdcdc;
  font-size: 12px;
}
.saveEdit {
  width: 100%;
  display: none;
  color: black;
  position: relative;
}
.info {
  color: white;
  font-size: 15px;
  position: absolute;
  margin: -30px -90px;
  display: none;
  top: 50%;
  left: 50%;
  z-index: 1;
  text-align: center;
}
.editimg {
  transition: all 300ms ease-in-out;
  filter: blur(3px) brightness(0.5);
}
.file-input {
  display: none;
}
</style>