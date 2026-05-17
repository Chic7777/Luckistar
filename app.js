const { STORAGE_KEYS, getStorage, setStorage } = require("./utils/storage");

App({
  globalData: {
    userProfile: null
  },

  onLaunch() {
    this.globalData.userProfile = getStorage(STORAGE_KEYS.userProfile, null);
  },

  setUserProfile(profile) {
    this.globalData.userProfile = profile;
    setStorage(STORAGE_KEYS.userProfile, profile);
  }
});
