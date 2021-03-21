import { model, Schema, Document } from "mongoose";
import { UserObject, hash, generateSalt } from "../core/user";
import ITimeStamps from "../core/shared/timestamp/Interface";

export interface UserDocument extends UserObject, ITimeStamps, Document {}
const userSchema = new Schema(
  {
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
      type: Object,
      required: true,
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
        type: Schema.Types.ObjectId,
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
userSchema.pre<UserDocument>("save", async function (next) {
  // alteração dos valores
  const salt = generateSalt(10);
  if (salt.tag == "left") {
    throw salt.value;
  } else {
    const newpassword = hash(this?.password?.hash_password, salt.value);
    if (newpassword.tag == "left") {
      throw newpassword.value;
    } else {
      this.password = newpassword.value;
    }
    next();
  }
});

export default model<UserDocument>("User", userSchema);
