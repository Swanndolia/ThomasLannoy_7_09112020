<template>
  <div id="user-about">
    <div id="label-container">
      <label
        ><input
          @change="onImageChange"
          id="file-input"
          type="file"
          class="input"
          disabled />
        <div id="info">
          <p>
            Cliquez pour modifier<br />
            votre photo de profil
          </p>
        </div>
        <img
          id="editablePicture"
          :src="userAbout.imageUrl"
          :alt="userAbout.imageAlt"
      /></label>
    </div>
    <div id="about">
      <button id="edit-btn" @click="editMyProfile">Modifier</button>
      <button id="save-btn" @click="saveMyProfile">Enregistrer</button>
      <h2>
        <input
          v-model="userAbout.username"
          class="input"
          type="text"
          :placeholder="userAbout.username"
          disabled
        />
      </h2>
      <p>
        <textarea
          class="input"
          v-model="userAbout.about"
          :placeholder="userAbout.about"
          disabled
        />
      </p>
      <button id="delete-btn" @click="deleteUser">Supprimer</button>
    </div>
  </div>
</template>

<script>
import * as storage from "../modules/storage";
import axios from "axios";
export default {
  name: "UserAbout",
  data() {
    return {
      elements: document.getElementsByClassName("input"),
      userId: this.$route.params.id,
      userAbout: {
        username: "",
        about: "",
        imageUrl: "",
        imageName: "",
        image: null,
      },
    };
  },
  methods: {
    deleteUser() {
      let confirm = window.confirm(
        "Etes vous certain de vouloir supprimer votre compte ? La suppression et permanente et entrainera la suppression de tous vos posts, commentaires et réactions"
      );
      if (confirm) {
        axios
          .delete(
            "http://localhost:3000/api/users/" + storage.getStorage("userId"),
            {
              headers: {
                Authorization: "Bearer " + storage.getStorage("token"),
              },
            }
          )
          .then((response) => {
            if (response) {
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }
          })
          .catch((error) => console.log(error));
      }
    },
    //remove disable attribute from each inputs to make them editable without loading
    editMyProfile() {
      this.elements.forEach((el) => el.removeAttribute("disabled"));
      document.getElementById("edit-btn").style.display = "none";
      document.getElementById("save-btn").style.display = "inline-block";
      document.getElementById("editablePicture").classList.add("editimg");
      document.getElementById("info").style.display = "inline-block";
      document.getElementById("delete-btn").style.display = "inline-block";
    },
    // add again disbale attribute to each input and send updated info to backend
    saveMyProfile() {
      this.elements.forEach((el) => el.setAttribute("disabled", true));
      document.getElementById("edit-btn").style.display = "inline-block";
      document.getElementById("save-btn").style.display = "none";
      document.getElementById("editablePicture").classList.remove("editimg");
      document.getElementById("info").style.display = "none";
      document.getElementById("delete-btn").style.display = "none";
      const updatedUserData = new FormData();
      if (this.userAbout.image) {
        updatedUserData.append("image", this.userAbout.image);
        updatedUserData.append("imageUrl", this.userAbout.image.name);
      }
      updatedUserData.append("username", this.userAbout.username);
      updatedUserData.append("about", this.userAbout.about);
      axios
        .put(
          "http://localhost:3000/api/users/" + this.userAbout.id,
          updatedUserData,
          {
            // Verif token user in SessionStorage before posting
            headers: {
              Authorization: "Bearer " + storage.getStorage("token"),
            },
          }
        )
        .then((response) => {
          if (response) {
            storage.setStorage("username", this.userAbout.username);
            storage.setStorage("imageUrl", this.userAbout.imageUrl);
            this.$emit("profile-update", true);
          }
        })
        .catch((error) => console.log(error));
    },
    onImageChange(e) {
      if (e.target.files[0].type.includes("image")) {
        //event to check for image upload to display preview
        this.userAbout.image = e.target.files[0];
        this.userAbout.imageUrl = URL.createObjectURL(this.userAbout.image);
      }
    },
  },
  mounted() {
    axios
      .get("http://localhost:3000/api/users/" + this.userId, {
        headers: {
          Authorization: "Bearer " + storage.getStorage("token"),
        },
      })
      .then((response) => {
        this.userAbout = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    if (storage.getStorage("userId") != this.userId) {
      document.getElementById("edit-btn").style.visibility = "hidden";
    }
  },
};
</script>

<style lang="scss" scoped>
img {
  transition: all 300ms ease-in-out;
  height: 100%;
  width: 100%;
}
#info {
  color: white;
  font-size: 15px;
  min-width: 200px;
  width: 300px;
  margin-top: 65px;
  display: none;
  position: absolute;
  text-align: center;
  z-index: 1;
}
.editimg {
  transition: all 300ms ease-in-out;
  filter: blur(3px) brightness(0.5);
}
#file-input {
  display: none;
}
input[type="text"],
textarea {
  font-size: inherit;
  font-style: inherit;
  overflow: hidden;
  outline: none;
  background: transparent;
  min-height: 100%;
  width: 95%;
  margin: -10px 5%;
  border: none;
  resize: none;
  color: #dcdcdc;
  &:not(:disabled) {
    color: white;
    &:not(:hover) {
      &:not(:focus) {
        transition: all 300ms ease-in-out;
        filter: blur(2px) brightness(0.5);
      }
    }
  }
}
textarea {
  padding: 0px 0px 74px;
}
button {
  color: black;
  min-width: 80px;
  width: 10%;
  align-self: flex-end;
  border: 2px solid #23272a;
  transition-duration: 0.4s;
  &:hover {
    background: #23272a;
    color: white;
    cursor: pointer;
  }
}
#delete-btn {
  display: none;
  align-self: flex-end;
}
#save-btn {
  width: 15%;
  display: none;
}
#user-about {
  width: 80%;
  display: flex;
  justify-content: space-between;
  margin: 10px auto;
  flex-wrap: wrap-reverse;
}
#label-container {
  margin: auto;
  width: 300px;
  height: 200px;
}
#about {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 200px;
  align-self: flex-start;
  margin: 0px 0px;
  background: #2c2f33;
}
</style>