const express = require("express");
const deliveryPartnerController = require("../controllers/deliveryPartnerController");
const router = express.Router();

router.route("/")
  .post(deliveryPartnerController.createDeliveryPartner)
  .get(deliveryPartnerController.getAllDeliveryPartners);

router.route("/:id")
  .get(deliveryPartnerController.getDeliveryPartnerById)
  .patch(deliveryPartnerController.updateDeliveryPartner)
  .delete(deliveryPartnerController.deleteDeliveryPartner);

module.exports = router;
