const { STORAGE_KEYS, getStorage, setStorage, todayString } = require("./storage");

const REWARD_POINTS = {
  taskCompleted: 3,
  eventRecorded: 2,
  plazaPublished: 2,
  shared: 2,
  charmDrawn: 1,
  charmShared: 2,
  boosted: 1,
  plazaVisited: 2
};

function grantDailyReward(userProfile, rewardKey, date = todayString()) {
  const rewardState = getStorage(STORAGE_KEYS.rewardState, {});
  const dayState = rewardState[date] || {};

  if (!userProfile || dayState[rewardKey]) {
    return 0;
  }

  const amount = REWARD_POINTS[rewardKey] || 0;
  dayState[rewardKey] = true;
  rewardState[date] = dayState;
  userProfile.starFragments = (userProfile.starFragments || 0) + amount;
  userProfile.updatedAt = new Date().toISOString();
  setStorage(STORAGE_KEYS.rewardState, rewardState);
  setStorage(STORAGE_KEYS.userProfile, userProfile);
  return amount;
}

function hasDailyReward(rewardKey, date = todayString()) {
  const rewardState = getStorage(STORAGE_KEYS.rewardState, {});
  return Boolean(rewardState[date] && rewardState[date][rewardKey]);
}

module.exports = {
  REWARD_POINTS,
  grantDailyReward,
  hasDailyReward
};
