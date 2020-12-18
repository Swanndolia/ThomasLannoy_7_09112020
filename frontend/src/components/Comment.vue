<template>
  <div class="comment" :id="comment.id">
    <figure class="comment-user-info">
      <div id="info-container">
        <img
          class="profile-picture"
          :src="comment.user.imageUrl"
          :alt="'Photo de profil de ' + comment.user.username"
        />
        <figcaption>
          {{ comment.user.username }}<br />
          <span class="date">{{ comment.createdAt }}</span>
        </figcaption>
      </div>
      <div class="reacts">
        <button
          class="dropdown-button"
          :id="'edit-btn-comment ' + this.comment.id"
          @click="showCommentMenu"
        >
          <p>.</p>
          <p>.</p>
          <p>.</p>
        </button>
        <div
          :id="'edit-menu-comment ' + this.comment.id"
          class="dropdown-content"
        >
          <button @click="modifyComment">Modifier</button>
          <button @click="deleteComment">Supprimer</button>
          <button id="cancel-btn" @click="hideCommentMenu">Annuler</button>
        </div>
        <span :key="commentDetails.likes" class="likes"
          >{{ commentDetails.likes }}
        </span>
        <span :key="commentDetails.dislikes" class="dislikes">{{
          commentDetails.dislikes
        }}</span>
      </div>
    </figure>
    <div class="comment-content">
      <p :id="this.comment.id + ' comment content'">
        {{ comment.content }}
      </p>
      <label
        ><input
          @change="onImageChange"
          class="file-input"
          :id="this.comment.id + ' comment file-input'"
          type="file"
          disabled />
        <div :id="this.comment.id + ' commentInfo'" class="info">
          <p>
            Cliquez pour modifier<br />
            la photo de votre comment
          </p>
        </div>
        <img
          v-if="comment.imageUrl != null"
          :id="this.comment.id + ' commentEditablePicture'"
          :src="comment.imageUrl"
          :alt="'Image du commentaire'"
      /></label>
      <button
        @click="sendModifiedComment"
        class="saveEdit"
        :id="this.comment.id + ' comment confirmEdit'"
      >
        Enregistrer les modifications
      </button>
    </div>
    <div id="react">
      <p
        @click="addCommentReact('chooseReactComment' + comment.id)"
        class="chooseReactComment"
        :id="'chooseReactComment' + comment.id"
      >
        Réagir
      </p>
      <p @click="reply">Répondre</p>
    </div>
    <section :id="'replySection ' + comment.id">
      <div class="newreply" :id="'replies ' + comment.id">
        <NewReply
          @new-reply-created="refreshReplies(comment.id)"
          class="new-reply"
          :commentId="comment.id.toString()"
        />
      </div>
      <Reply
        v-for="reply in repliesList.slice().reverse()"
        :key="reply.id"
        :reply="reply"
        :post="post"
      />
    </section>
  </div>
</template>

<script>
import axios from "axios";
import * as storage from "../modules/storage";
import Reply from "../components/Reply.vue";
import NewReply from "../components/NewReply.vue";

export default {
  name: "Comment",
  components: {
    Reply,
    NewReply,
  },
  data() {
    return {
      commentDetails: this.comment,
      repliesList: [],
    };
  },
  props: {
    comment: {
      type: Object,
      required: true,
    },
    post: {
      type: Object,
      required: true,
    },
  },
  methods: {
    reply() {
      if (this.commentDetails.replyVisibile == true) {
        this.repliesList = [];
        document.getElementById("replies " + this.comment.id).style.display =
          "none";
        this.commentDetails.replyVisibile = false;
      } else {
        this.repliesList = this.comment.replies;
        document.getElementById("replies " + this.comment.id).style.display =
          "flex";
        this.commentDetails.replyVisibile = true;
      }
    },
    refreshReplies(id) {
      this.$emit("new-reply-created", id);
    },
    showCommentMenu() {
      document.getElementById(
        "edit-menu-comment " + this.comment.id
      ).style.display = "flex";
    },
    hideCommentMenu() {
      document.getElementById(
        "edit-menu-comment " + this.comment.id
      ).style.display = "none";
    },
    deleteComment() {
      axios
        .delete("http://localhost:3000/api/comments/" + this.comment.id, {
          // Verif token user in SessionStorage before posting
          headers: {
            Authorization: "Bearer " + storage.getStorage("token"),
          },
        })
        .then((response) => {
          if (response) {
            document.getElementById(this.comment.id).style.display = "none";
          }
        })
        .catch((error) => console.log(error));
    },
    modifyComment() {
      this.hideCommentMenu();
      document
        .getElementById(this.comment.id + " comment content")
        .setAttribute("contenteditable", "true");
      document.getElementById(this.comment.id + " comment content").focus();
      document.getElementById(
        this.comment.id + " comment confirmEdit"
      ).style.display = "inline-block";
      if (
        document.getElementById(this.comment.id + " commentEditablePicture")
      ) {
        document
          .getElementById(this.comment.id + " commentEditablePicture")
          .classList.add("editimg");
        document.getElementById(
          this.comment.id + " commentInfo"
        ).style.display = "inline-block";
      } else {
        document.getElementById(
          this.comment.id + " comment file-input"
        ).style.display = "inline-block";
      }
      document
        .getElementById(this.comment.id + " comment file-input")
        .removeAttribute("disabled");
    },
    sendModifiedComment() {
      document.getElementById(
        this.comment.id + " comment file-input"
      ).style.display = "none";
      document.getElementById(this.comment.id + " commentInfo").style.display =
        "none";
      document
        .getElementById(this.comment.id + " comment file-input")
        .setAttribute("disabled", "true");
      if (
        document.getElementById(this.comment.id + " commentEditablePicture")
      ) {
        document
          .getElementById(this.comment.id + " commentEditablePicture")
          .classList.remove("editimg");
      }
      document
        .getElementById(this.comment.id + " comment content")
        .setAttribute("contenteditable", "false");
      document.getElementById(
        this.comment.id + " comment confirmEdit"
      ).style.display = "none";
      const updateCommentData = new FormData();
      updateCommentData.append(
        "content",
        document.getElementById(this.comment.id + " comment content")
          .textContent
      );
      if (this.commentDetails.image) {
        updateCommentData.append("imageUrl", this.commentDetails.image.name);
      }
      axios
        .put(
          "http://localhost:3000/api/comments/" + this.comment.id,
          updateCommentData,
          {
            // Verif token user in SessionStorage before posting
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
    addCommentReact(id) {
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
          "http://localhost:3000/api/comments/" + this.comment.id + "/react",
          reactData,
          {
            // Verif token user in SessionStorage before posting
            headers: {
              Authorization: "Bearer " + storage.getStorage("token"),
            },
          }
        )
        .then((response) => {
          if (response) {
            if (response.data.react == -1) {
              if (document.getElementById(id).classList.contains("reactLike")) {
                this.commentDetails.likes--;
              }
              document
                .getElementById(id)
                .classList.remove("reactLike", "chooseReactComment");
              document.getElementById(id).classList.add("reactDislike");
              this.commentDetails.dislikes++;
            }
            if (response.data.react == 1) {
              if (
                document.getElementById(id).classList.contains("reactDislike")
              ) {
                this.commentDetails.dislikes--;
              }
              document
                .getElementById(id)
                .classList.remove("reactDislike", "chooseReactComment");
              document.getElementById(id).classList.add("reactLike");
              this.commentDetails.likes++;
            }
            if (response.data.message.includes("supprimée")) {
              if (
                document.getElementById(id).classList.contains("reactDislike")
              ) {
                this.commentDetails.dislikes--;
              } else {
                this.commentDetails.likes--;
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
      if (e.target.files[0]) {
        //event to check for image upload to display preview
        this.commentDetails.image = e.target.files[0];
        this.commentDetails.imageUrl = URL.createObjectURL(
          this.commentDetails.image
        );
      }
    },
  },
  mounted() {
    const comments = document.getElementsByClassName("post");
    comments.forEach(() => {
      if (
        storage.getStorage("userId") != this.comment.userId &&
        storage.getStorage("isOp") == "false"
      ) {
        document.getElementById(
          "edit-btn-comment " + this.comment.id
        ).style.visibility = "hidden";
      }
    });
    const elements = document.getElementsByClassName("chooseReactComment");
    elements.forEach((el) =>
      el.addEventListener("mousemove", (e) => {
        event.target.style.backgroundPositionX = -e.offsetX + "px";
        event.target.classList.add("chooseReactComment");
      })
    );
    const reacts = this.comment.reactsComments;
    for (let i = 0; i < reacts.length; i++) {
      if (
        reacts[i].react == -1 &&
        reacts[i].userId.toString().includes(storage.getStorage("userId"))
      ) {
        document
          .getElementById("chooseReactComment" + this.comment.id)
          .classList.add("reactDislike");
      }
      if (
        reacts[i].react == 1 &&
        reacts[i].userId.toString().includes(storage.getStorage("userId"))
      ) {
        document
          .getElementById("chooseReactComment" + this.comment.id)
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
.chooseReactComment:hover {
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
  display: none;
}
input {
  width: 80%;
  border-radius: 50px;
  padding: 10px;
  outline: none;
}
.comment {
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 30px auto;
  background: lighten(#2c2f33, 5);
  border-radius: 50px;
}
.comment-user-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 10px 20px;
}
.comment-content {
  margin: -10px 50px;
  & img {
    width: 100%;
    margin: 10px 0px;
  }
  position: relative;
  &.info {
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
    width: 40%;
    text-align: center;
    padding: 15px 5px;
    border: solid #bbbbbb;
    cursor: pointer;
    border-width: 0px 1px 1px 1px;
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