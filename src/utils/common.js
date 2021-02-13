/**
 * @description Rdeturn values is not exist in object
 * @param {any} object
 * @param {Array<String>} requires
 * @returns
 */

const validaionBodyEmpty = (object, requires) =>
  requires.filter((key) => !trimObjctt(object).hasOwnProperty(key));

/**
 * @description Trim undefuned and null propety in object
 * @param {*} obj
 * @returns
 */
const trimObjctt = (obj) => {
  Object.keys(obj).forEach(
    (key) =>
      (obj[key] === null ||
        obj[key] === undefined ||
        obj[key] === {} ||
        obj[key] === "") &&
      delete obj[key]
  );
  return obj;
};

module.exports = {
  validaionBodyEmpty,
  trimObjctt,
};
