<template>
  <div class="post" :id="post.id">
    <figure class="post-user-info">
      <div id="info-container">
        <img
          class="profile-picture"
          :src="post.user.imageUrl"
          :alt="'Photo de profil de ' + post.user.username"
        />
        <figcaption>
          {{ post.user.username }}<br />
          <span class="date">{{ post.createdAt }}</span>
        </figcaption>
      </div>
      <div class="reacts">
        <button
          class="dropdown-button"
          :id="'edit-btn ' + this.post.id"
          @click="showPostMenu"
        >
          <p>.</p>
          <p>.</p>
          <p>.</p>
        </button>
        <div :id="'edit-menu ' + this.post.id" class="dropdown-content">
          <button @click="modifyPost">Modifier</button>
          <button @click="deletePost">Supprimer</button>
          <button id="cancel-btn" @click="hidePostMenu">Annuler</button>
        </div>
        <span :key="postDetails.likes" class="likes"
          >{{ postDetails.likes }}
        </span>
        <span :key="postDetails.dislikes" class="dislikes">{{
          postDetails.dislikes
        }}</span>
      </div>
    </figure>
    <div class="post-content">
      <p :id="this.post.id + ' content'">
        {{ post.content }}
      </p>
      <label
        ><input
          @change="onImageChange"
          class="file-input"
          :id="this.post.id + 'file-input'"
          type="file"
          disabled />
        <div :id="this.post.id + ' info'" class="info">
          <p>
            Cliquez pour modifier<br />
            la photo de votre post
          </p>
        </div>
        <img
          v-if="post.imageUrl != null"
          :id="this.post.id + ' editablePicture'"
          :src="postDetails.imageUrl"
          :alt="'Image du post'"
      /></label>
      <button
        @click="sendModifiedPost"
        class="saveEdit"
        :id="this.post.id + ' confirmEdit'"
      >
        Enregistrer les modifications
      </button>
    </div>
    <div id="react">
      <p
        @click="addReact('chooseReact' + post.id)"
        class="chooseReact"
        :id="'chooseReact' + post.id"
      >
        Réagir
      </p>
      <p @click="showPost">Commenter</p>
    </div>
    <section :id="'commSection ' + post.id">
      <div class="newcomment" :id="'comments ' + post.id">
        <NewComment
          @new-comment-created="refreshComments(post.id)"
          class="new-comment"
          :postId="post.id.toString()"
        />
      </div>
      <Comment
        @new-reply-created="refreshReplies(comment.id)"
        v-for="comment in commentsList.slice().reverse()"
        :key="comment.id"
        :comment="comment"
        :post="post"
      />
    </section>
  </div>
</template>

<script>
import axios from "axios";
import * as storage from "../modules/storage";
import Comment from "../components/Comment.vue";
import NewComment from "../components/NewComment.vue";

export default {
  name: "Post",
  components: {
    Comment,
    NewComment,
  },
  data() {
    return {
      postDetails: this.post,
      commentsList: [],
    };
  },
  methods: {
    refreshComments(id) {
      this.$emit("comment-created", id);
    },
    refreshReplies(id) {
      this.$emit("reply-created", id);
    },
    showPostMenu() {
      document.getElementById("edit-menu " + this.post.id).style.display =
        "flex";
    },
    hidePostMenu() {
      document.getElementById("edit-menu " + this.post.id).style.display =
        "none";
    },
    showPost() {
      if (this.postDetails.commentsVisibile == true) {
        this.commentsList = [];
        document.getElementById("comments " + this.post.id).style.display =
          "none";
        this.postDetails.commentsVisibile = false;
      } else {
        this.commentsList = this.post.comments;
        document.getElementById("comments " + this.post.id).style.display =
          "flex";
        this.postDetails.commentsVisibile = true;
      }
    },
    deletePost() {
      axios
        .delete("http://localhost:3000/api/posts/" + this.post.id, {
          // Verif token user in SessionStorage before posting
          headers: {
            Authorization: "Bearer " + storage.getStorage("token"),
          },
        })
        .then((response) => {
          if (response) {
            document.getElementById(this.post.id).style.display = "none";
          }
        })
        .catch((error) => console.log(error));
    },
    onImageChange(e) {
      if (e.target.files[0].type.includes("image")) {
        this.postDetails.image = e.target.files[0];
        this.postDetails.imageUrl = URL.createObjectURL(this.postDetails.image);
      }
    },
    modifyPost() {
      this.hidePostMenu();
      document
        .getElementById(this.post.id + " content")
        .setAttribute("contenteditable", "true");
      document.getElementById(this.post.id + " content").focus();
      document.getElementById(this.post.id + " confirmEdit").style.display =
        "inline-block";
      if (document.getElementById(this.post.id + " editablePicture")) {
        document
          .getElementById(this.post.id + " editablePicture")
          .classList.add("editimg");
        document.getElementById(this.post.id + " info").style.display =
          "inline-block";
      } else {
        document.getElementById(this.post.id + "file-input").style.display =
          "inline-block";
      }
      document
        .getElementById(this.post.id + "file-input")
        .removeAttribute("disabled");
    },
    sendModifiedPost() {
      document.getElementById(this.post.id + "file-input").style.display =
        "none";
      document.getElementById(this.post.id + " info").style.display = "none";
      document
        .getElementById(this.post.id + "file-input")
        .setAttribute("disabled", "true");
      if (document.getElementById(this.post.id + " editablePicture")) {
        document
          .getElementById(this.post.id + " editablePicture")
          .classList.remove("editimg");
      }
      document
        .getElementById(this.post.id + " content")
        .setAttribute("contenteditable", "false");
      document.getElementById(this.post.id + " confirmEdit").style.display =
        "none";
      const updateData = new FormData();
      updateData.append("image", this.postDetails.image);
      if (this.postDetails.image) {
        updateData.append("imageUrl", this.postDetails.image.name);
      }
      updateData.append(
        "content",
        document.getElementById(this.post.id + " content").textContent
      );
      axios
        .put("http://localhost:3000/api/posts/" + this.post.id, updateData, {
          // Verif token user in SessionStorage before posting
          headers: {
            Authorization: "Bearer " + storage.getStorage("token"),
          },
        })
        .then((response) => {
          if (response) {
            //not much to do
          }
        })
        .catch((error) => console.log(error));
    },
    addReact(id) {
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
          "http://localhost:3000/api/posts/" + this.post.id + "/react",
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
                this.postDetails.likes--;
              }
              document
                .getElementById(id)
                .classList.remove("reactLike", "chooseReact");
              document.getElementById(id).classList.add("reactDislike");
              this.postDetails.dislikes++;
            }
            if (response.data.react == 1) {
              if (
                document.getElementById(id).classList.contains("reactDislike")
              ) {
                this.postDetails.dislikes--;
              }
              document
                .getElementById(id)
                .classList.remove("reactDislike", "chooseReact");
              document.getElementById(id).classList.add("reactLike");
              this.postDetails.likes++;
            }
            if (response.data.message.includes("supprimée")) {
              if (
                document.getElementById(id).classList.contains("reactDislike")
              ) {
                this.postDetails.dislikes--;
              } else {
                this.postDetails.likes--;
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
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    const posts = document.getElementsByClassName("post");
    posts.forEach(() => {
      if (
        storage.getStorage("userId") != this.post.userId &&
        storage.getStorage("isOp") == "false"
      ) {
        document.getElementById("edit-btn " + this.post.id).style.visibility =
          "hidden";
      }
    });
    const elements = document.getElementsByClassName("chooseReact");
    elements.forEach((el) =>
      el.addEventListener("mousemove", (e) => {
        event.target.style.backgroundPositionX = -e.offsetX + "px";
        event.target.classList.add("chooseReact");
      })
    );
    const reacts = this.post.reacts;
    for (let i = 0; i < reacts.length; i++) {
      if (
        reacts[i].react == -1 &&
        reacts[i].userId.toString().includes(storage.getStorage("userId"))
      ) {
        document
          .getElementById("chooseReact" + this.post.id)
          .classList.add("reactDislike");
      }
      if (
        reacts[i].react == 1 &&
        reacts[i].userId.toString().includes(storage.getStorage("userId"))
      ) {
        document
          .getElementById("chooseReact" + this.post.id)
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
  justify-content: space-around;
  width: 90%;
  margin: auto;
  display: none;
  padding: 5px 0px 15px;
  border-bottom: 1px solid black;
}
input {
  width: 80%;
  border-radius: 50px;
  padding: 10px;
  outline: none;
}
.post {
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 30px auto;
  background: #2c2f33;
  border-radius: 50px;
  border-bottom: dashed black 1px;
  border-top: dashed black 1px;
}
.post-user-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 10px 20px;
}
.post-content {
  margin: -10px 5%;
  & img {
    transition: all 300ms ease-in-out;
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
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 0px 5%;
  border-top: solid 1px;
  & p {
    width: 40%;
    text-align: center;
    padding: 15px 0px;
    border: dashed #aaaaaa;
    border-radius: 20px;
    cursor: pointer;
    border-width: 1px;
  }
}
.date {
  color: #b9b9b9;
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
  margin: -40px -72px;
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