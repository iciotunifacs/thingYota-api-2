import { HttpServer } from './httpServer';
import * as restify from 'restify';
import { RequestHandler, Server, Request, Response, Next } from 'restify';
import corsMiddleware from 'restify-cors-middleware';
import socketio, { Socket } from 'socket.io';
import logger from 'morgan';
import { Router } from 'restify-router';

export { Server, Request, Response, Next };
interface ApiServerArgs {
	name?: string;
}
export class ApiServer implements HttpServer {
	private restify: any;
	public server: any;
	readonly name: string;
	public io: any;

	constructor(params: ApiServerArgs) {
		this.name = params.name || `server-${Date.now()}`;
		this.restify = restify.createServer();
		this.server = this.restify;
		this.io = socketio.listen(this.server);
	}

	public get(url: string, requestHandler: RequestHandler): void {
		this.addRoute('get', url, requestHandler);
	}

	public post(url: string, requestHandler: RequestHandler): void {
		this.addRoute('post', url, requestHandler);
	}

	public del(url: string, requestHandler: RequestHandler): void {
		this.addRoute('del', url, requestHandler);
	}

	public put(url: string, requestHandler: RequestHandler): void {
		this.addRoute('put', url, requestHandler);
	}

	public use(params: any): void {
		this.restify.use(params);
	}

	public on(evt: string, callback: any) {
		this.restify.on(evt, callback);
	}

	public address() {
		return this.restify.address();
	}

	public applyRoutes(router: Router) {
		router.applyRoutes(this.server);
	}

	private addRoute(
		method: 'get' | 'post' | 'put' | 'del',
		url: string,
		requestHandler: RequestHandler
	): void {
		this.restify[method](
			url,
			async (req: Request, res: Response, next: Next) => {
				try {
					await requestHandler(req, res, next);
				} catch (e) {
					console.log(e);
					res.send(500, e);
				}
			}
		);
		console.log(`Added route ${method.toUpperCase()} ${url}`);
	}

	public start(port: number): void {
		const cors = corsMiddleware({
			origins: ['*'],
			allowHeaders: ['Authorization'],
			exposeHeaders: ['Authorization'],
		});

		this.restify.use(restify.plugins.bodyParser());
		this.restify.use(restify.plugins.jsonp());
		this.restify.use(restify.plugins.queryParser({ mapParams: true }));
		this.restify.use(restify.plugins.fullResponse());

		this.restify.pre(cors.preflight);
		this.restify.use(cors.actual);
		this.restify.use(logger('dev'));
		this.restify.listen(port, () =>
			console.log(`Server is up & running on port ${port}`)
		);
	}
}

export default new ApiServer({ name: 'thingyota-api' });
