<template>
  <header>
    <router-link id="logo-link" to="/">
      <img
        id="logo"
        src="./assets/img/icon-left-font-monochrome-black.svg"
        alt="logo-groupomania"
      />
    </router-link>
    <nav id="nav">
      <div
        @mouseenter="waitSearch = true"
        @mouseleave="waitSearch = false"
        id="search"
      >
        <input
          id="searchInput"
          type="text"
          placeholder="Commencez à écrire le nom de quelqu'un..."
          @input="handleSearch($event.target.value)"
          @click="getAllUsers"
          @focusout="removeResults"
        />
        <SearchTab
          @click="search(user)"
          v-for="user in matchingUsers.user"
          :key="user.userId"
          :user="user"
        />
      </div>
      <NavLink url="/" text="Accueil" />
      <NavLink @click="generateUrl" :url="myProfileUrl" text="Profil" />
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
import * as storage from "./modules/storage.js";
import NavLink from "./components/NavLink.vue";
import SearchTab from "./components/SearchTab.vue";
import Footer from "./components/Footer.vue";
import axios from "axios";
export default {
  name: "App",
  components: {
    NavLink,
    Footer,
    SearchTab,
  },
  data() {
    return {
      waitSearch: false,
      allUsers: {},
      matchingUsers: {
        user: [],
      },
      myProfileUrl: "/",
    };
  },
  methods: {
    disconnect() {
      localStorage.clear();
      sessionStorage.clear();
      console.log("cleared");
    },
    generateUrl() {
      this.myProfileUrl = storage.getStorage("userId");
    },
    showNotifs() {
      //show notif code
    },
    removeCrypt(str) {
      var input = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      var output = "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm";
      var index = (x) => input.indexOf(x);
      var translate = (x) => (index(x) > -1 ? output[index(x)] : x);
      return str.split("").map(translate).join("");
    },
    getAllUsers() {
      axios
        .get("http://localhost:3000/api/users/", {
          headers: {
            Authorization: "Bearer " + storage.getStorage("token"),
          },
        })
        .then((response) => {
          for (let i = 0; i < response.data.length; i++) {
            this.allUsers[i] = {
              username: this.removeCrypt(response.data[i].username),
              userId: response.data[i].id.toString(),
              imageUrl: response.data[i].imageUrl,
            };
          }
        })
        .catch((error) => {
          console.log(error);
        });
      this.handleSearch(document.getElementById("searchInput").value);
    },
    handleSearch(value) {
      this.matchingUsers = { user: [] };
      if (value) {
        this.searchFilter(value.toLowerCase());
      }
    },
    searchFilter(value) {
      for (let i = 0; i < Object.keys(this.allUsers).length; i++) {
        const detailedName = this.allUsers[i].username.toLowerCase().split(" ");
        for (let l = 0; l < detailedName.length; l++) {
          if (detailedName[l].startsWith(value)) {
            this.matchingUsers.user.push(this.allUsers[i]);
          }
        }
      }
    },
    removeResults() {
      if (this.waitSearch == false) {
        this.matchingUsers = { user: [] };
      }
    },
    search(user) {
      this.matchingUsers = { user: [] };
      this.$router.push(user.userId);
    },
  },
};
</script>

<style lang="scss">
a {
  &:not(#logo-link) {
    &:not(.user-link) {
      text-decoration: none;
      background-color: #eeeeee;
      color: #333333;
      padding: 2px 6px 2px 6px;
      border-top: 1px solid #cccccc;
      border-right: 1px solid #333333;
      border-bottom: 1px solid #333333;
      border-left: 1px solid #cccccc;
    }
  }
}
#logo {
  width: 70%;
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
nav {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 10px;
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
#searchInput {
  position: relative;
  width: 260px;
}
</style>