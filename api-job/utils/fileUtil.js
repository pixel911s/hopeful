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
    const webp = require("webp-converter");
    webp.grant_permission();

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
    let imgWebp =
      fullPath + "/" + _img.name.split(".").slice(0, -1).join(".") + ".webp";

    //upload image

    if (_img.mimetype == "image/gif") {
      await fs_writeFile(imgPath, _img.data);

      await webp.gwebp(imgPath, imgWebp, "-q 90", (logging = "-v"));

      if (fs.existsSync(imgPath)) {
        fs.unlink(imgPath, function (err) {});
      }
    } else {
      const sharp = require("sharp");

      if (fs.existsSync(imgWebp)) {
        fs.unlink(imgWebp, function (err) {});
      }

      await sharp(_img.data)
        .resize(1110, undefined, {
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toFile(imgWebp);
    }

    const d = new Date();

    return (
      _outputPath +
      _subPath +
      "/" +
      (_img.name.split(".").slice(0, -1).join(".") + ".webp") +
      "?v=" +
      d.getTime()
    );
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
      let result = await rimraf.sync(_fullPath);
    }
  } catch (e) {
    throw e;
  }
};
