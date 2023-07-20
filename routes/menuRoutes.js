const express = require("express");
const menuController = require("../controllers/menuController")
const router = express.Router();

router.route("/getAll").
  post(menuController.getAllMenuItems)

router.route("/")
  .post(menuController.createMenuItem);

router.route("/:id")
  .get(menuController.getMenuItemById)
  .patch(menuController.updateMenuItem)
  .delete(menuController.deleteMenuItem);

module.exports = router;
