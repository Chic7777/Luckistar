const { STORAGE_KEYS, getStorage, normalizeUserProfile } = require("../../utils/storage");
const { buildAstroProfile, buildBaZiArchive, buildZiweiProfile } = require("../../utils/archiveProfiles");

Page({
  data: {
    type: "astro",
    title: "",
    profile: null,
    user: null,
    isAstro: true,
    isBazi: false,
    isZiwei: false
  },

  onLoad(options) {
    const user = normalizeUserProfile(getStorage(STORAGE_KEYS.userProfile, null));
    if (!user) {
      tt.redirectTo({ url: "/pages/birth/index" });
      return;
    }

    const type = options.type || "astro";
    const profile = this.buildProfile(type, user);
    this.setData({
      type,
      title: profile.title,
      profile,
      user,
      isAstro: type === "astro",
      isBazi: type === "bazi",
      isZiwei: type === "ziwei"
    });
  },

  buildProfile(type, user) {
    if (type === "bazi") return buildBaZiArchive(user);
    if (type === "ziwei") return buildZiweiProfile(user);
    return buildAstroProfile(user);
  },

  onShareArchive() {
    tt.navigateTo({ url: `/pages/share/index?type=${this.data.type}` });
  }
});
