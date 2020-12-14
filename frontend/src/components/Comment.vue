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
        <div :id="'edit-menu-comment ' + this.post.id" class="dropdown-content">
          <button @click="modifyComment">Modifier</button>
          <button @click="deleteComment">Supprimer</button>
          <button id="cancel-btn" @click="hideCommentMenu">Annuler</button>
        </div>
        <span v-if="comment.likes" class="likes">{{ comment.likes }} </span>
        <span v-if="comment.dislikes" class="dislikes">{{
          comment.dislikes
        }}</span>
      </div>
    </figure>
    <div class="comment-content">
      <p :id="this.comment.id + ' content'" v-if="comment.content != 'null'">
        {{ comment.content }}
      </p>
      <img
        v-if="comment.imageUrl != null"
        :src="comment.imageUrl"
        :alt="'Image du commentaire'"
      />
      <button
        @click="sendModifiedComment"
        class="saveEdit"
        :id="this.comment.id + ' confirmEdit'"
      >
        Enregistrer les modifications
      </button>
    </div>
    <div id="react">
      <p
        @click="addCommentReact('chooseReact' + comment.id)"
        class="chooseReact"
        :id="'chooseReact' + comment.id"
      >
        Réagir
      </p>
      <p @click="reply">Répondre</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as storage from "../modules/storage";
export default {
  name: "Comment",
  data() {
    return {};
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
    showCommentMenu() {
      document.getElementById(
        "edit-menu-comment " + this.post.id
      ).style.display = "flex";
    },
    hideCommentMenu() {
      document.getElementById(
        "edit-menu-comment " + this.post.id
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
        .getElementById(this.comment.id + " content")
        .setAttribute("contenteditable", "true");
      document.getElementById(this.comment.id + " content").focus();
      document.getElementById(this.comment.id + " confirmEdit").style.display =
        "inline-block";
    },
    sendModifiedComment() {
      document
        .getElementById(this.comment.id + " content")
        .setAttribute("contenteditable", "false");
      document.getElementById(this.comment.id + " confirmEdit").style.display =
        "none";
      const updateCommentData = new FormData();
      updateCommentData.append(
        "content",
        document.getElementById(this.comment.id + " content").textContent
      );
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
        like: "",
        userId: storage.getStorage("userId"),
      };
      if (
        Math.round(
          (parseInt(document.getElementById(id).style.backgroundPositionX) *
            -1) /
            document.getElementById(id).offsetWidth
        ) == 1
      ) {
        reactData.like = -1;
      } else {
        reactData.like = 1;
      }
      if (this.running == true) {
        return;
      }
      this.running = true;
      axios
        .post(
          "http://localhost:3000/api/comments/" +
            this.post.id +
            "/" +
            this.comment.id +
            "/react",
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
            if (response.data.message.includes("Dislike ajouté")) {
              document
                .getElementById(id)
                .classList.remove("reactLike", "chooseReact");
              document.getElementById(id).classList.add("reactDislike");
            }
            if (response.data.message.includes("Like ajouté")) {
              document
                .getElementById(id)
                .classList.remove("reactDislike", "chooseReact");
              document.getElementById(id).classList.add("reactLike");
            }
            if (response.data.message.includes("retiré")) {
              document
                .getElementById(id)
                .classList.remove("reactLike", "reactDislike");
            }
            this.running = false;
          }
        })
        .catch((error) => console.log(error));
    },
  },
  mounted() {
    const comments = document.getElementsByClassName("post");
    comments.forEach(() => {
      if (storage.getStorage("userId") != this.comment.userId) {
        document.getElementById(
          "edit-btn-comment " + this.comment.id
        ).style.visibility = "hidden";
      }
    });
    const elements = document.getElementsByClassName("chooseReact");
    elements.forEach((el) =>
      el.addEventListener("mousemove", (e) => {
        event.target.style.backgroundPositionX = -e.offsetX + "px";
        event.target.classList.add("chooseReact");
      })
    );
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
.chooseReact:hover {
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
.newcomment {
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
</style>