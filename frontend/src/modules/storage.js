//check to know if we use local or session storage
export function setStorage(key, value) {
  if (localStorage.getItem("staySigned")) {
    localStorage.setItem(key, value);
  } else {
    sessionStorage.setItem(key, value);
  }
}
export function getStorage(key) {
  if (localStorage.getItem("staySigned")) {
    return localStorage.getItem(key);
  } else {
    return sessionStorage.getItem(key);
  }
}
export function getAllStorage() {
  if (localStorage.getItem("staySigned")) {
    return localStorage;
  } else {
    return sessionStorage;
  }
}
