import User from '../core/model/user';
import Device from '../core/model/device';
import jwt from 'jsonwebtoken';
import config from '../config/env';
import errors from 'restify-errors';
import { Next, Response } from 'restify';
import Request from '../core/shared/headers/Request';

/**
 * @description Função que valida o token de huest
 * @param {Rwquest} req
 * @param {Response} res
 * @param {Send'} send
 */
export const authGuest = async (req: Request, res: Response, next: Next) => {
	const autorization = req.header('Authorization');

	const token = autorization?.split(' ')[1];

	if (!token || token == null)
		return res.send(new errors.InvalidHeaderError('Token not found'));

	if (!config?.secret?.guest) {
		return res.send(new errors.InternalError('secret guest not found'));
	}

	try {
		await jwt.verify(token, config.secret.guest);
		req.token = token;
		next();
	} catch (error) {
		return res.send(new errors.InvalidCredentialsError('token is not valid'));
	}
};

interface getDataFronEntityArgs {
	entity: string;
	id: string;
}
export const getDatafromEntity = async (params: getDataFronEntityArgs) => {
	let data: any;
	switch (params.entity) {
		case 'User':
			data = await User.findById(params.id);
			break;
		case 'Device':
			data = await Device.findById(params.id);
			break;
		case 'Guest':
			data = { entity: params.entity };
			break;
		default:
			data = null;
			break;
	}
	return data;
};
/**
 * @description Função que valida o token de um usuário
 * @param {Rwquest} req
 * @param {Response} res
 * @param {Send'} send
 */
export const authUser = async (req: Request, res: Response, next: Next) => {
	const autorization = req.header('Authorization');

	const token = autorization?.split(' ')[1];

	if (!token) {
		return res.send(new errors.InvalidHeaderError('Token not found'));
	}

	if (!config?.secret?.user) {
		return res.send(new errors.InternalError('secret user not found'));
	}

	try {
		await jwt.verify(token, config.secret.user);
		const decoded = jwt.decode(token, { complete: true, json: true });
		const { entity, id } = decoded?.payload;
		if (!entity) {
			return res.send(
				new errors.InvalidArgumentError('Entity info not found ')
			);
		}
		const data = await getDatafromEntity({ entity, id });
		if (!data) {
			return res.send(new errors.NotFoundError('entity not found'));
		}
		if (!data?.status && entity == 'User') {
			return res.send(new errors.InvalidCredentialsError('User is not active'));
		}
		req.token = token;
		req.locals = {
			authObject: { ...data, entity },
		};
		next();
	} catch (error) {
		return res.send(new errors.InternalError(error));
	}
};
