import restify from 'restify'
import plugins from 'restify-plugins'
import corsMiddleware from 'restify-cors-middleware'

const cors = corsMiddleware({
  origins: ["*"],
  allowHeaders: ["Authorization"],
  exposeHeaders: ["Authorization"],
})

const server = restify.createServer({
  name: 'thingYota-server'
})

server.use(plugins.jsonBodyParser({ mapParams: true }));
server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.jsonp());
server.use(plugins.queryParser({ mapParams: true }));
server.use(plugins.fullResponse());

server.pre(cors.preflight);
server.use(cors.actual);

export default server
