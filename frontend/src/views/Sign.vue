<template>
  <h1>{{ msg }}</h1>
  <form>
    <span id="showMailField">
      <label for="mail">Adresse mail</label>
      <input v-model="creditentials.mail" />
    </span>
    <label id="userOrMail" for="user">Nom d'utilisateur ou Email</label>
    <input v-model="creditentials.user" />
    <label for="Mot de passe">Mot de passe</label>
    <input type="password" v-model="creditentials.pass" />
    <p id="registerOrLog" @click="swapLoginRegister">
      Vous n'avez pas de compte ? Créer en un !
    </p>
  </form>
  <router-view />
</template>

<script>
export default {
  name: "Sign",
  components: {},
  data() {
    return {
      creditentials: {
        user: null,
        pass: null,
        mail: null,
      },
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
p{
  
}
</style>
