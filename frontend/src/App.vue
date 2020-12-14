<template>
  <header>
    <router-link id="logo-link" to="/">
      <img
        v-if="largeScreen"
        :key="largeScreen"
        id="logo"
        src="./assets/img/icon-left-font-monochrome-white.svg"
        alt="logo-groupomania"
      />
      <img
        v-else
        :key="largeScreen"
        id="logo-mobile"
        src="./assets/img/icon-monochrome-white.svg"
        alt="logo-groupomania"
      />
    </router-link>
    <nav id="nav">
      <NavLink url="/" text="Accueil" />
      <NavLink
        :key="$route.fullPath"
        @click="generateUrl"
        :url="myProfileUrl"
        text="Profil"
      />
      <div
        @mouseenter="waitSearch = true"
        @mouseleave="waitSearch = false"
        id="search"
      >
        <input
          id="searchInput"
          type="text"
          autocomplete="off"
          placeholder="Commencez à écrire le nom de quelqu'un..."
          @input="handleSearch($event.target.value)"
          @click="getAllUsers"
          @focusout="removeResults"
        />
        <div id="search-result">
          <SearchTab
            @click="search(user)"
            v-for="user in matchingUsers.user"
            :key="user.userId"
            :user="user"
          />
        </div>
      </div>
      <button id="notif-btn" type="button" @click="showNotifs">
        Notifications
      </button>
      <NavLink url="/sign" text="déconnexion" @click="disconnect" />
    </nav>
  </header>
  <router-view />
  <footer>
    <NavLink url="/" text="Confidentialité" />
    <NavLink url="/" text="Conditions générales" />
  </footer>
</template>

<script>
import * as storage from "./modules/storage.js";
import NavLink from "./components/NavLink.vue";
import SearchTab from "./components/SearchTab.vue";
import axios from "axios";
export default {
  name: "App",
  components: {
    NavLink,
    SearchTab,
  },
  data() {
    return {
      largeScreen: Boolean,
      waitSearch: false,
      allUsers: {},
      matchingUsers: {
        user: [],
      },
      myProfileUrl: "/",
    };
  },
  mounted() {
    this.checkwidth();
    window.addEventListener("resize", this.checkwidth);
  },
  methods: {
    // Maybe better in css should check
    checkwidth() {
      if (window.innerWidth < 1265) {
        document.getElementById("searchInput").style.width = "130px";
        if (window.innerWidth <= 1080) {
          this.largeScreen = false;
        } else {
          this.largeScreen = true;
        }
      } else {
        document.getElementById("searchInput").style.width = "260px";
      }
    },
    disconnect() {
      localStorage.clear();
      sessionStorage.clear();
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
#search-result {
  position: absolute;
}
a {
  &:not(#logo-link) {
    &:not(.user-link) {
      color: black;
      background: white;
      text-decoration: none;
      padding: 5px 10px;
      border-radius: 20px;
      transition: ease-in 0.25s;
      &:hover {
        background: #2c2f33;
        color: white;
      }
    }
  }
}
#logo-link {
  width: fit-content;
}
#notif-btn {
  color: black;
  background: white;
  border: 0px;
  padding: 5px 10px;
  border-radius: 20px;
  outline: transparent;
  cursor: pointer;
  transition: ease-in 0.25s;
  &:focus:hover {
    background: #2c2f33;
    color: white;
  }
}
#logo {
  width: 220px;
}
#logo-mobile {
  margin: -6px;
  width: 48px;
}
header {
  gap: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0px 15%;
}
footer {
  margin: 20px 15%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
h1 {
  margin-left: 15%;
}
nav {
  gap: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap-reverse;
}
.profile-picture {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
html {
  background: #23272a;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
}
#search {
  background: #2c2f33;
}
p,
h1,
figcaption,
input,
textarea,
button, span {
  color: #dcdcdc;
}
#searchInput {
  color: white;
  border: 2px solid white;
  background: transparent;
  padding: 5px 10px;
  border-radius: 20px;
  outline: transparent;
  position: relative;
  color: white;
  width: 260px;
}
</style>