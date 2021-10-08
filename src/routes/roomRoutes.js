module.exports = (db) => {
  const router = require('express').Router();
  const roomRepository = require('../repositories/roomRepository')(db);
  const roomController = require('../controllers/roomController')({ roomRepository });

  router.post('/room/new', roomController.createNewRoom);

  return router;
};
