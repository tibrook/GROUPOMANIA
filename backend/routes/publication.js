const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer");
const publiCtrl = require("../controllers/publication");

router.get("/", auth, publiCtrl.getAllpublis);
router.post("/", auth, multer, publiCtrl.createpubli);
router.get("/:id", auth, publiCtrl.getOnepubli);
router.put("/:id", auth, multer, publiCtrl.modifypubli);
router.delete("/:id", auth, publiCtrl.deletepubli);
router.post("/:id/like", auth, publiCtrl.addLike);
router.get("/user/:id", auth, publiCtrl.getPubliByUserId);

module.exports = router;
