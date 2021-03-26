/**
 * @description Trim undefuned and null propety in object
 * @param {any} obj
 * @returns {any}
 */
export const trimObjctt = (obj: any) => {
	const val: { [key: string]: any } = {};
	for (const key in obj) {
		const temp = obj[key];
		if (temp !== null || temp !== undefined || temp !== {} || temp !== "") {
			val[key] = temp;
		}
	}
	return val;
};
/**
 * @description Rdeturn values is not exist in object
 * @param {any} object
 * @param {Array<String>} requires
 * @returns {any}
 */

export const validaionBodyEmpty = (object: any, requires: string[]): any =>
	requires.filter((key: string) => !trimObjctt(object)[key]);
