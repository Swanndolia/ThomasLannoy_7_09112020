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
    editMyProfile() {
      this.elements.forEach((el) => el.removeAttribute("disabled"));
      document.getElementById("edit-btn").style.display = "none";
      document.getElementById("save-btn").style.display = "inline-block";
      document.getElementById("editablePicture").classList.add("editimg");
      document.getElementById("info").style.display = "inline-block";
    },
    saveMyProfile() {
      this.elements.forEach((el) => el.setAttribute("disabled", true));
      document.getElementById("edit-btn").style.display = "inline-block";
      document.getElementById("save-btn").style.display = "none";
      document.getElementById("editablePicture").classList.remove("editimg");
      document.getElementById("info").style.display = "none";
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
            //show fixed div to say updated
          }
        })
        .catch((error) => console.log(error));
    },
    onImageChange(e) {
      //event to check for image upload to display preview
      this.userAbout.image = e.target.files[0];
      this.userAbout.imageUrl = URL.createObjectURL(this.userAbout.image);
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
  min-width: 300px;
  min-height: 200px;
  max-width: 300px;
  max-height: 200px;
}
#info {
  color: white;
  font-size: 15px;
  width: 300px;
  height: 200px;
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
  color: #b2b2b2;
  &:not(:disabled) {
    color: white;
    &:not(:hover) {
      &:not(:focus) {
        transition: all 300ms ease-in-out;
        filter: blur(3px) brightness(0.5);
      }
    }
  }
}
textarea {
  padding: 0px 0px 74px;
}
button {
  width: 10%;
  align-self: flex-end;
  border: 2px solid #2C2F33;
  transition-duration: 0.4s;
  &:hover {
    background: #23272A;
    color: white;
    cursor: pointer;
  }
}
#save-btn {
  width: 15%;
  display: none;
}
#user-about {
  width: 70%;
  height: 200px;
  display: flex;
  justify-content: space-between;
  margin: 10px auto;
}
#about {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-self: flex-start;
  margin: 0px 0px;
  background: #2C2F33;
}
</style>