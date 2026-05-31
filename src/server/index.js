const { app, startServer, loadedRoutes } = require("../../server");

if (require.main === module) {
  startServer();
}

module.exports = {
  app,
  startServer,
  loadedRoutes,
};
