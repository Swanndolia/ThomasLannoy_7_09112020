<template>
  <div id="app">
    <header>
      <nav>
        <img
          id="nav-logo"
          src="./assets/img/icon-left-font-monochrome-black.svg"
          alt="logo-groupomania"
        />
        <NavLink url="/feed" text="Accueil" />
        <NavLink url="/contact" text="Notifications" />
      </nav>
    </header>
    <body></body>
    <footer>
      <Footer url="/" text="Confidentialité" />
      <Footer url="/" text="Conditions générales" />
      <Footer url="/" text="Accueil" />
    </footer>
  </div>
</template>

<script>
import NavLink from "./components/NavLink.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    NavLink,
    Footer
  }
};
</script>
