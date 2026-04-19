const express = require("express");
const upload = require("../middleware/upload");
const c = require("../controllers/medicineController");
const ic = require("../controllers/interactionCheckController");

const router = express.Router();

router.post("/upload-medicine", upload.single("image"), c.uploadMedicine);
router.post("/extract-medicine", upload.single("image"), c.extractMedicine);
router.post("/medicines/manual", c.createManualMedicine);
router.post("/medicine/check-interaction", ic.checkInteraction);
router.get("/medicines", c.listMedicines);
router.get("/medicine/:id", c.getMedicineById);
router.put("/medicine/:id", c.updateMedicine);
router.delete("/medicine/:id", c.deleteMedicine);

module.exports = router;
