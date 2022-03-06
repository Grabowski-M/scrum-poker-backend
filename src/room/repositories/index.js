const handleRoomConnection = require('./handleRoomConnection');
const handleTimerChange = require('./handleTimerChange');
const handleCardChange = require('./handleCardChange');
const handlePromoteToLeader = require('./handlePromoteToLeader');
const handleStartVoting = require('./handleStartVoting');
const handleStopVoting = require('./handleStopVoting');
const handleDisconnect = require('./handleDisconnect');

module.exports = {
  handleRoomConnection,
  handleTimerChange,
  handleCardChange,
  handlePromoteToLeader,
  handleStartVoting,
  handleStopVoting,
  handleDisconnect,
};
