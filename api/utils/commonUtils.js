var fs = require("fs");

module.exports.padLeft = function (value, width, padCharacter) {
  padCharacter = padCharacter || "0";
  value = value + "";
  return value.length >= width
    ? value
    : new Array(width - value.length + 1).join(padCharacter) + value;
};

module.exports.checkFolder = function (_url) {
  //check folder product
  if (!fs.existsSync(_url)) {
    fs.mkdirSync(_url);
  }
};

module.exports.numberWithCommas = function (x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

module.exports.randomNumber = function () {
  return Math.floor(100000000 + Math.random() * 900000000);
};

module.exports.asyncForEach = async function (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};
