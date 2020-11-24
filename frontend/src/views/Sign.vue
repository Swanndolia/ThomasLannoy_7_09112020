<template>
  <h1>{{ msg }}</h1>
  <form>
    <span id="showMailField">
      <label for="mail">Adresse mail</label>
      <input v-model="creditentials.mail" />
    </span>
    <label id="userOrMail">Nom d'utilisateur ou Email</label>
    <input v-model="creditentials.username" />
    <label>Mot de passe</label>
    <input type="password" v-model="creditentials.pass" />
    <div class="form-container">
      <div class="form-container">
        <button type="button" @click="sign">Se connecter</button>
        <div class="form-container">
          <label>Maintenir la connection {{ wantToStaySigned }}</label>
          <input type="checkbox" v-model="wantToStaySigned" />
        </div>
      </div>
      <p id="registerOrLog" @click="swapLoginRegister">
        Vous n'avez pas de compte ? Créer en un !
      </p>
    </div>
  </form>
  <router-view />
</template>

<script>
import * as storage from "../modules/storage.js";
import axios from "axios";
export default {
  name: "Sign",
  components: {},
  data() {
    return {
      creditentials: {
        username: "",
        pass: "",
        mail: "",
      },
      wantToStaySigned: true,
      msg: "This is the page to login",
    };
  },
  methods: {
    swapLoginRegister() {
      if (
        document.getElementById("registerOrLog").innerHTML ==
        `J'ai déjà un compte`
      ) {
        document.getElementById(
          "registerOrLog"
        ).innerHTML = `Vous n'avez pas de compte ? Créer en un !`;
        document.getElementById("showMailField").style.display = "none";
        document.getElementById(
          "userOrMail"
        ).innerHTML = `Nom d'utilisateur ou Email`;
        this.msg = "This is the page to login";
      } else {
        document.getElementById(
          "registerOrLog"
        ).innerHTML = `J'ai déjà un compte`;
        document.getElementById("showMailField").style.display = "inline-block";
        document.getElementById("userOrMail").innerHTML = `Nom d'utilisateur`;
        this.msg = "This is the page to register";
      }
    },
    sign() {
      const userData = {
        username: this.creditentials.username,
        pass: this.creditentials.pass,
      };
      //to register
      if (
        document.getElementById("showMailField").style.display == "inline-block"
      ) {
        userData.mail = this.creditentials.mail;
        axios
          .post("http://localhost:3000/api/users/signup", userData, {})
          .then((response) => {
            if (response) {
              this.storeInfo(response.data.token, response.data.userId);
              if (document.getElementById("nav")) {
                document.getElementById("nav").style.visibility = "visible";
              }
            }
          })
          .catch((error) => console.log(error));
      } //to login
      else {
        axios
          .post("http://localhost:3000/api/users/login", userData, {})
          .then((response) => {
            if (response) {
              this.storeInfo(response.data.token, response.data.userId);
              if (document.getElementById("nav")) {
                document.getElementById("nav").style.visibility = "visible";
              }
            }
          })
          .catch((error) => console.log(error));
      }
    },
    storeInfo(token, userId) {
      let serverUserData = {};
      axios
        .get("http://localhost:3000/api/users/" + userId, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          if (response) {
            console.log(token);
            serverUserData = response.data;
            if (this.wantToStaySigned) {
              localStorage.setItem("staySigned", this.wantToStaySigned);
            }
            storage.setStorage("token", token);
            storage.setStorage("userId", userId);
            storage.setStorage("username", serverUserData.username);
            storage.setStorage("imageUrl", serverUserData.imageUrl);
            storage.setStorage("about", serverUserData.about);
            this.$router.push({ name: "Feed" });
          }
        })
        .catch((error) => console.log(error));
    },
  },
  beforeMount() {
    if (document.getElementById("nav")) {
      document.getElementById("nav").style.visibility = "hidden";
    }
  },
};
</script>

<style scoped>
#showMailField {
  display: none;
}
form {
  display: flex;
  flex-direction: column;
  width: 40%;
  margin: auto;
}
.form-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  margin-right: -20px;
}
input {
  display: block;
  width: 100%;
  padding: 10px;
  border-radius: 20px;
  outline: none;
}
#registerOrLog {
  text-align: right;
}
button {
  border-radius: 20px;
  margin-right: 5px;
}
p {
  cursor: pointer;
}
</style>
