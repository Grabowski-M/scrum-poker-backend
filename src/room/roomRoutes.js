module.exports = (dbApi) => {
  const router = require('express').Router();
  const roomRepository = require('./roomRepository')(dbApi);
  const roomController = require('./roomController')({ roomRepository });

  router.post('/room/new', roomController.createNewRoom);

  return router;
};
