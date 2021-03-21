import { compare, generateSalt, hash } from "../HashPassword";

describe("HashPassword", () => {
  describe("genereteSalt", () => {
    test("should a valid salt", () => {
      const result = generateSalt(10);
      expect(result.tag).toBe("right");
      expect(result.value).toBeDefined();
    });

    test("should have pass limit of range", () => {
      const result = generateSalt(300);
      expect(result.tag).toBe("left");
      expect(result.value).toStrictEqual(
        new Error("300 is greater than 15,Must be less that 15")
      );
    });
  });
  describe("hash", () => {
    const resultSalt = generateSalt(10);
    const salt = resultSalt.tag == "right" ? resultSalt.value : "teste";
    test("should generate hash", () => {
      const passwirdObject = hash("myPass", salt);
      expect(passwirdObject.tag).toBe("right");
      if (passwirdObject.tag == "right") {
        expect(passwirdObject.value).toHaveProperty("salt");
        expect(passwirdObject.value).toHaveProperty("hash_password");
        expect(passwirdObject.value?.salt).toStrictEqual(salt);
      }
    });

    test("should recive empty string has a salt", () => {
      const passwirdObject = hash("myPass", "");
      expect(passwirdObject.tag).toBe("left");
    });

    test("should recive empty string has a password", () => {
      const passwirdObject = hash("", salt);
      expect(passwirdObject.tag).toBe("left");
    });
  });

  describe("compare", () => {
    const salt = generateSalt(10);
    const p1 = "teste1";
    const p2 = "idh12xVVV";
    if (salt.tag == "right") {
      const password1 = hash(p1, salt.value);
      const password2 = hash(p2, salt.value);
      if (password1.tag == "right" && password2.tag == "right") {
        test("should be a correct password", () => {
          const result = compare(p1, password1.value);
          expect(result.tag).toStrictEqual("right");
          expect(result.value).toBeTruthy();
        });

        test("should be a correct password using alphanumerics", () => {
          const result = compare(p2, password2.value);
          expect(result.tag).toStrictEqual("right");
          expect(result.value).toBeTruthy();
        });

        test("should be a different password", () => {
          const result = compare(p1, password2.value);
          expect(result.tag).toStrictEqual("right");
          expect(result.value).toBeFalsy();
        });
        test("should be a different password for any string", () => {
          const result = compare("teste", password2.value);
          expect(result.tag).toStrictEqual("right");
          expect(result.value).toBeFalsy();
        });
      }
    }
  });
});
