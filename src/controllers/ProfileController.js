const multer = require("multer");
const ProfileModels = require("../models/ProfileModels");
const errorHandler = require("../middleware/errorHandler");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "image") {
      cb(null, "public/images/profile");
    }
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
});

const cpUpload = upload.fields([{ name: "image" }]);

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await ProfileModels.getProfileById(res, id);
    await res.status(200).json(user);
  } catch (error) {
    errorHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

const updateUser = async (req, res) => {
  try {
    await cpUpload(req, res, async (error) => {
      const input = JSON.parse(req.body.input);
      if (error) {
        return res
          .status(400)
          .json({ error: `Error uploading file: ${error.message}` });
      }
      await ProfileModels.updateProfile(req, res, input);
      res.sendStatus(200);
    });
  } catch (error) {
    errorHandler(res, 500, `Internal Server Error: ${error.message}`);
  }
};

module.exports = { getUserById, updateUser };
