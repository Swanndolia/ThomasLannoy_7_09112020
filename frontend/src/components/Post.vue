<template>
  <div class="post" :id="post.id">
    <figure class="post-user-info">
      <div id="info-container">
        <img
          class="profile-picture"
          :src="post.userImageUrl"
          :alt="'Photo de profil de ' + post.username"
        />
        <figcaption>
          {{ post.username }}<br />
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
          <button @click="editPost">Modifier</button>
          <button @click="deletePost">Supprimer</button>
          <button id="cancel-btn" @click="hidePostMenu">Annuler</button>
        </div>
        <span :key="post.likes" class="likes">{{ post.likes }} </span>
        <span :key="post.dislikes" class="dislikes">{{ post.dislikes }}</span>
      </div>
    </figure>
    <div class="post-content">
      <p v-if="post.content != 'null'">{{ post.content }}</p>
      <div v-if="post.imageUrl != null">
        <img :src="post.imageUrl" :alt="'Image du post'" />
      </div>
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
    <div class="newcomment" :id="'comments ' + post.id">
      <NewComment class="new-comment" :postId="post.id.toString()" />
    </div>
    <section>
      <Comment
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
      commentsList: [],
    };
  },
  methods: {
    showPostMenu() {
      document.getElementById("edit-menu " + this.post.id).style.display =
        "flex";
    },
    log() {
      console.log(this.post);
    },
    hidePostMenu() {
      document.getElementById("edit-menu " + this.post.id).style.display =
        "none";
    },
    showPost() {
      this.commentsList = this.post.comments;
      document.getElementById("comments " + this.post.id).style.display =
        "flex";
    },
    addReact(id) {
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
        .put(
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
            console.log(response.data);
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
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    const posts = document.getElementsByClassName("post");
    posts.forEach(() => {
      if (storage.getStorage("userId") != this.post.userId) {
        document.getElementById("edit-btn " + this.post.id).style.visibility =
          "hidden";
      }
    });
    const elements = document.getElementsByClassName("chooseReact");
    elements.forEach(() => {
      if (
        this.post.usersDisliked &&
        this.post.usersDisliked.includes(storage.getStorage("userId"))
      ) {
        document
          .getElementById("chooseReact" + this.post.id)
          .classList.add("reactDislike");
      }
      if (
        this.post.usersLiked &&
        this.post.usersLiked.includes(storage.getStorage("userId"))
      ) {
        document
          .getElementById("chooseReact" + this.post.id)
          .classList.add("reactLike");
      }
    });
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
  background: #f2f2f2;
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
  background: linear-gradient(to left, #f2ccf2 50%, #ccf2cc 50%);
  background-size: 200%;
}
.reactLike {
  background: #ccf2cc;
}
.reactDislike {
  background: #f2ccf2;
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
  background: #ccf2cc;
}
.dislikes {
  background: #f2ccf2;
  margin-top: 30px;
}
.newcomment {
  display: flex;
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
.post {
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 30px auto;
  background: #f2f2f2;
  border-radius: 50px;
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
  color: #b2b2b2;
  font-size: 12px;
}
</style>