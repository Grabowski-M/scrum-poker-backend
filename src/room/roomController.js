module.exports = ({ roomRepository }) => ({
  createNewRoom: async (req, res, next) => {
    try {
      const { roomId, username, password } = req.body;
      const newRoom = { roomId, username, password };

      const retrievedRoom = await roomRepository.getRoom(newRoom.roomId);

      if (retrievedRoom) {
        res.status(403);
        res.send('Room already exists');
        return;
      }

      const data = await roomRepository.createNewRoom(newRoom);
      res.json(data);
    } catch (e) {
      next(e);
    }
  },
});
