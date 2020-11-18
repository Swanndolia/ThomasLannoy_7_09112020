module.exports = function () {
    this.secureCrypt = function (str) { //avoid sensitive information writted in plain text (adding obfuscation can be a good idea)
      const input = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      const output = "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm";
      const index = (x) => input.indexOf(x);
      const translate = (x) => (index(x) > -1 ? output[index(x)] : x);
      return str.split("").map(translate).join("");
    };
  };
  