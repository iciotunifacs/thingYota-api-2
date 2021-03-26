import { Request as RestifyRequest } from 'restify';

export default interface Request extends RestifyRequest {
	token?: string;
	locals?: any;
}
