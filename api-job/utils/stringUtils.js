module.exports.convert = function (data, start, length) {
  let result = data;
  start = start - 1;
  let end = start + length;

  return data.substring(start, end);
};

module.exports.genText = function (data, length) {
  if (data && data != null) {
    data = data + "";
  } else {
    data = "";
  }

  let result = data;

  if (result != "") {
    if (data.length > length) {
      result = data.substring(0, length);
    } else if (data.length < length) {
      for (let i = 0; i < length - data.length; i++) {
        result += " ";
      }
    }
  } else {
    result = "";
    for (let i = 0; i < length; i++) {
      result += " ";
    }
  }

  return result;
};

module.exports.genTextNumber = function (data, length, fixDigit) {
  let result = "";

  if (data != null) {
    if (fixDigit != 0) {
      data = parseFloat(data).toFixed(fixDigit);
    }

    result = data.split(".");
    let pad = "";

    let totalLength = 0;

    if (result.length > 1) {
      totalLength = (result[0] + result[1]).length;
    } else {
      totalLength = result.length;
    }

    for (let i = 0; i < length - totalLength; i++) {
      pad += "0";
    }

    if (result.length > 1) {
      result = pad + result[0] + result[1];
    } else {
      result = pad + result;
    }
  } else {
    result = this.genText(data, length);
  }

  return result;
};

module.exports.genDomain = function (text) {
  return "https://" + text + ".prosalepage.com";
};
