const mongoose = require("mongoose");
const md5 = require("md5");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    default: "client",
  },
  status: {
    type: Boolean,
    default: true,
  },
  Buckets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bucket",
    },
  ],
},
{
  timestamps: {
    createdAt: "created_at",
    updatedAt: "last_change",
  },
}
);

// Encriptador de senha
userSchema.pre("save", async function (next) {
  // alteração dos valores
  const hash = md5(this.password.toString());
  this.password = hash;
  next();
});

module.exports = mongoose.model("User", userSchema);
