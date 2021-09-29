const fs = require("fs");
const util = require("util");
const fs_writeFile = util.promisify(fs.writeFile);
const commonUtils = require("./commonUtils");
var rimraf = require("rimraf");

module.exports.uploadImg = async function (
  _inputPath,
  _outputPath,
  _subPath,
  _img,
  _fileName = null
) {
  try {
    console.log(_img);

    let subPathArr = _subPath.split("/");
    let fullPath = _inputPath.substr(0, _inputPath.length - 1);

    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath);
    }

    subPathArr.forEach((p) => {
      fullPath += "/" + p;
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath);
      }
    });

    //generate file name
    // if (_fileName == null && _img.mimetype != 'image/gif') {
    //     _fileName = commonUtils.randomNumber() + ".jpg";
    // }else{
    //     _fileName = commonUtils.randomNumber() + ".gif";
    // }

    let imgPath = fullPath + "/" + _img.name;

    //upload image

    if (_img.mimetype == "image/gif") {
      await fs_writeFile(imgPath, _img.data);
    } else {
      const sharp = require("sharp");

      await sharp(_img.data)
        .resize(1110, undefined, {
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .toFile(imgPath);
    }

    const d = new Date();

    return _outputPath + _subPath + "/" + _img.name + "?v=" + d.getTime();
  } catch (e) {
    throw e;
  }
};

module.exports.deleteImg = function (_fullPath) {
  try {
    if (fs.existsSync(_fullPath)) {
      fs.unlink(imgPath, function (err) {});
    }
  } catch (e) {
    throw e;
  }
};

module.exports.deleteFloder = async function (_fullPath) {
  try {
    if (fs.existsSync(_fullPath)) {
      console.log(_fullPath);
      let result = await rimraf.sync(_fullPath);
      console.log(result);
    }
  } catch (e) {
    throw e;
  }
};
