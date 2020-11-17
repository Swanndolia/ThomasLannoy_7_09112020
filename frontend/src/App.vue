<template>
  <header>
    <router-link to="/">
      <img
        id="nav-logo"
        src="./assets/img/icon-left-font-monochrome-black.svg"
        alt="logo-groupomania"
      />
    </router-link>
    <nav v-if="!userIsSigned">
      <NavLink url="/" text="Accueil" />
      <NavLink url="/profile" text="Profile" />
      <button type="button" @click="showNotifs">Notifications</button>
      <NavLink url="/sign" text="déconnexion" @click="disconnect" />
    </nav>
  </header>
  <router-view />
  <footer>
    <Footer url="/" text="Confidentialité" />
    <Footer url="/" text="Conditions générales" />
    <Footer url="/" text="Accueil" />
  </footer>
</template>

<script>
import NavLink from "./components/NavLink.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    NavLink,
    Footer,
  },
  data() {
    return {
      userIsSigned: localStorage.getItem("token"),
    };
  },
  methods: {
    disconnect() {
      localStorage.clear();
    },
    showNotifs() {},
  },
};
</script>

<style lang="scss">
a {
  margin: 10px;
}
header,
footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
h1 {
  text-align: center;
}
.profile-picture {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
html {
  font-family: "Roboto", sans-serif;
  font-size: 14px;
}
</style>