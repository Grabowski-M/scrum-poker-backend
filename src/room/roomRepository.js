module.exports = (dbApi) => ({
  createNewRoom: async (newRoom) => {
    try {
      const res = await dbApi.put({ path: `/rooms/${newRoom.roomId}.json`, data: newRoom });
      return res.data;
    } catch (e) {
      console.log(`Could not create a room ${newRoom.roomId} for ${newRoom.username}, reason: ${e.message}`);
      throw e;
    }
  },
  getRoom: async (roomId) => {
    try {
      const res = await dbApi.get({ path: `/rooms/${roomId}.json?print=pretty` });
      return res.data;
    } catch (e) {
      console.log(`Could not retrieve a room ${roomId}, reason: ${e.message}`);
      throw e;
    }
  },
});
