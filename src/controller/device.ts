import { Request, Response, Next } from 'restify';
import Device from '../core/model/device';
import { validaionBodyEmpty, trimObjctt } from '../utils/common';
import errors from 'restify-errors';

/**
 * @description Get all Devices in database
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 */
export const find = async (req: Request, res: Response, next: Next) => {
	const { limit, populate } = req.query;
	const offset = parseInt(req.query.offset) * limit || 0;
	try {
		let data;
		if (populate) {
			data = await Device.find()
				.limit(parseInt(limit) || 0)
				.skip(offset ?? 0)
				.populate('Sensors')
				.populate('Actors')
				.exec();
		} else {
			data = await Device.find()
				.limit(parseInt(limit) ?? 0)
				.skip(offset ?? 0)
				.exec();
		}

		const total = await Device.estimatedDocumentCount();

		if (offset >= total && total != 0)
			return res.send(new errors.LengthRequiredError('out of rnge'));

		return res.send(200, {
			data: data,
			metadata: { limit, offset, total },
		});
	} catch (error) {
		return res.send(new errors.InternalServerError(`${error}`));
	}
};

/**
 * @description Get one Device using your PK value id
 * @param {{params: {id: string}}} req
 * @param {Response} res
 * @requires params.id
 * @param {*} next
 */
export const findOne = async (req: Request, res: Response, next: Next) => {
	const { populate } = req.query;
	const { id } = req.params;

	if (!id) return res.send(new errors.InvalidArgumentError('id not found'));

	try {
		let data;
		if (populate) {
			data = await Device.findById(id)
				.populate('Sensors')
				.populate('Actrors')
				.exec();
		} else {
			data = await Device.findById(id);
		}

		if (!data) {
			return res.send(new errors.NotFoundError(`Device._id ${id} not found`));
		}

		return res.send(200, {
			data: data,
		});
	} catch (error) {
		return res.send(new errors.InternalServerError(`${error}`));
	}
};

/**
 * @description Create device
 * @param {{body: {name: String, type: String, mac_addres}}} req
 * @param {Response} res
 * @param {next} next
 * @requires body.name
 * @requires body.type
 * @requires body.mac_addres
 */
export const create = async (req: Request, res: Response, next: Next) => {
	if (!req.body) {
		return res.send(new errors.InvalidArgumentError('body is empty'));
	}

	const bodyNotFound = validaionBodyEmpty(req.body, [
		'name',
		'type',
		'macAddress',
	]);

	if (bodyNotFound.length > 0) {
		return res.send(
			new errors.NotFoundError(`not found params : ${bodyNotFound.join(',')}`)
		);
	}

	const { name, type, macAddress } = req.body;

	try {
		const data = await Device.create({
			name,
			type,
			macAddress,
		});

		await data.save();

		return res.send(200, {
			data: data,
		});
	} catch (error) {
		if (error.code == 11000) {
			return res.send(
				new errors.ConflictError(
					`duplicated : ${JSON.stringify(error.keyValue)}`
				)
			);
		}
		console.log(error);
		return res.send(
			new errors.InternalServerError('An database error has occoured')
		);
	}
};

/**
 * @description Put data update in refs by pk id
 * @param {{params: {id: String}, body:{name?: String, type?: String, status: Boolean}}} req
 * @param {Response} res
 * @param {*} send
 */
export const put = async (req: Request, res: Response, next: Next) => {
	if (!req.body) {
		return res.send(new errors.InvalidArgumentError('body is empty'));
	}
	const { id } = req.params;

	if (!id) {
		return res.send(new errors.InvalidArgumentError('id not found'));
	}

	const { name, type, mac_addres, status } = req.body;

	const sendParans = trimObjctt({
		name,
		type,
		mac_addres,
		status,
	});

	try {
		const data = await Device.findByIdAndUpdate(id, sendParans, {
			new: true,
			upsert: true,
			setDefaultsOnInsert: true,
		});
		if (!data) {
			return res.send(new errors.NotFoundError(`Device ${id} not found`));
		}
	} catch (error) {
		return res.send(new errors.InternalServerError(`${error}`));
	}
};
