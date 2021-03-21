import Either, { Left, Right } from "../shared/either/";
import { randomBytes, createHmac } from "crypto";

export interface PasswordObject {
  salt: string;
  hash_password: string;
}
export function generateSalt(rounds = 12): Either<Error, string> {
  if (rounds >= 15) {
    return Left(new Error(`${rounds} is greater than 15,Must be less that 15`));
  }
  return Right(
    randomBytes(Math.ceil(rounds / 2))
      .toString("hex")
      .slice(0, rounds)
  );
}

export function hasher(password: string, salt: string): PasswordObject {
  let hash = createHmac("sha512", salt);
  hash.update(password);
  let value = hash.digest("hex");
  return {
    salt: salt,
    hash_password: value,
  };
}

export function hash(
  password: string,
  salt: string
): Either<Error, PasswordObject> {
  if (password == null || salt == null) {
    return Left(new Error("Must Provide Password and salt values"));
  }

  return Right(hasher(password, salt));
}

export function compare(
  password: string,
  hash: PasswordObject
): Either<Error, boolean> {
  if (password == null || hash == null) {
    return Left(new Error("password and hash is required to compare"));
  }
  const passwordData = hasher(password, hash.salt);
  if (passwordData.hash_password === hash.hash_password) {
    return Right(true);
  }
  return Right(false);
}