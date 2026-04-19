const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: false },
    times: [{ type: String }],
    dosage: { type: String, default: "" },
  },
  { _id: false }
);

const dayStatusEnum = ["unset", "taken", "missed"];

const weeklyChecklistSchema = new mongoose.Schema(
  {
    mon: { type: String, enum: dayStatusEnum, default: "unset" },
    tue: { type: String, enum: dayStatusEnum, default: "unset" },
    wed: { type: String, enum: dayStatusEnum, default: "unset" },
    thu: { type: String, enum: dayStatusEnum, default: "unset" },
    fri: { type: String, enum: dayStatusEnum, default: "unset" },
    sat: { type: String, enum: dayStatusEnum, default: "unset" },
    sun: { type: String, enum: dayStatusEnum, default: "unset" },
  },
  { _id: false }
);

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    expiryDate: { type: Date, required: true },
    imageUrl: { type: String },
    rawText: { type: String },
    dosageInstructions: { type: String },
    schedule: scheduleSchema,
    tabletsInPacket: { type: Number, min: 0 },
    syrupAmountMl: { type: Number, min: 0 },
    entryMethod: {
      type: String,
      enum: ["scan", "manual"],
      default: "scan",
    },
    weeklyChecklist: { type: weeklyChecklistSchema, default: undefined },
    dosagePerDay: { type: Number, min: 1, max: 3 },
    dosageTimes: [{ type: String }],
    /** When true, node-cron fires daily dose reminders at each dosage time */
    dailyDosageReminderEnabled: { type: Boolean, default: false },
    /** When true, node-schedule fires a one-time notification on the expiry date */
    expiryReminderEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medicine", medicineSchema);
