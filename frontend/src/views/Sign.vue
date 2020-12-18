<template>
  <h1>{{ msg }}</h1>
  <form @keyup.enter="sign">
    <span id="showMailField">
      <label for="mail">Adresse mail</label>
      <input v-model="creditentials.mail" />
    </span>
    <label id="userOrMail">Nom d'utilisateur ou Email</label>
    <input v-model="creditentials.username" />
    <label>Mot de passe</label>
    <input type="password" v-model="creditentials.pass" />
    <div class="form-container">
      <div id="labelStay">
        <button id="sign-btn" type="button" @click="sign">Se connecter</button>
        <label
          >Maintenir la connection<input
            type="checkbox"
            v-model="wantToStaySigned"
        /></label>
      </div>
      <p id="registerOrLog" @click="swapLoginRegister">
        Vous n'avez pas de compte ?<br />
        Créer en un !
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
      msg:
        "Bienvenue sur Groupomania, pour continuer connectez ou inscrivez vous !",
    };
  },
  methods: {
    //transmute login form to register
    swapLoginRegister() {
      if (
        document.getElementById("registerOrLog").innerHTML ==
        `J'ai déjà un compte`
      ) {
        document.getElementById("sign-btn").textContent = "Se connecter";
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
        document.getElementById("sign-btn").textContent = "S'inscrire";
        document.getElementById("showMailField").style.display = "inline-block";
        document.getElementById("userOrMail").innerHTML = `Nom d'utilisateur`;
        this.msg = "This is the page to register";
      }
    },
    //on press on sign handle both login and register
    sign() {
      const userData = {
        username: this.creditentials.username,
        pass: this.creditentials.pass,
      };
      //to register
      if (this.running == true) {
        return;
      }
      this.running = true;
      if (
        document.getElementById("showMailField").style.display == "inline-block"
      ) {
        userData.mail = this.creditentials.mail;
        if (
          !userData.pass.match(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
          )
        ) {
          alert(
            "Votre mot de passe doit contenir au moins 8 caractères, un chiffre, une minuscule et une majuscule"
          );
          this.running = false;
          return;
        }
        if (!userData.mail.match("@")) {
          alert("Votre Email est incorect");
          this.running = false;
          return;
        }
        axios
          .post("http://localhost:3000/api/users/signup", userData)
          .then((response) => {
            if (response) {
              this.storeInfo(response.data.token, response.data.userId);
              if (document.getElementById("nav")) {
                document.getElementById("nav").style.visibility = "visible";
              }
            }
          })
          .catch((error) => console.log(error));
        this.running = false;
      } //to login
      else {
        axios
          .post("http://localhost:3000/api/users/login", userData)
          .then((response) => {
            if (response) {
              this.storeInfo(response.data.token, response.data.userId);
              if (document.getElementById("nav")) {
                document.getElementById("nav").style.visibility = "visible";
              }
            }
          })
          .catch((error) => console.log(error));
        this.running = false;
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
            serverUserData = response.data;
            if (this.wantToStaySigned) {
              localStorage.setItem("staySigned", this.wantToStaySigned);
            }
            storage.setStorage("token", token);
            storage.setStorage("userId", userId.toString());
            storage.setStorage("isOp", serverUserData.isOp);
            storage.setStorage("imageUrl", serverUserData.imageUrl);
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
  min-width: 290px;
  width: 25%;
  margin: 5% 10%;
}
#labelStay {
  align-items: baseline;
  display: flex;
}
label {
  color: #dcdcdc;
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
  color: black;
}
#registerOrLog {
  text-align: right;
}
button {
  color: black;
  border-radius: 20px;
  margin-right: 5px;
}
p {
  cursor: pointer;
}
</style>
