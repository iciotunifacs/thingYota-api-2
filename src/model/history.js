const mongoose = require("mongoose");

const HistoryScheme = new mongoose.Schema(
  {
    From_type: {
      type: String
    },
    From: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'From_type'
    },
    To: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'To_type'
    },
    To_type: {
      type: String
    },

    data: {
      type: Object,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "last_change",
    },
  }
);

module.exports = mongoose.model("History", HistoryScheme);
