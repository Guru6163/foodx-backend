const express = require("express");
const orderController = require("../controllers/orderController");
const router = express.Router();

router.route("/search").get(orderController.searchOrdersByEmailorPhone)
router.route("/top5Orders").get(orderController.getTopCustomersByFinalAmount)
router.route("/")
  .post(orderController.createOrder)
  .get(orderController.getAllOrders);

router.route("/:id")
  .get(orderController.getOrderById)
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);

module.exports = router;
