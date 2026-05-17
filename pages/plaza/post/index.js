const { STORAGE_KEYS, getStorage, normalizeUserProfile, todayString } = require("../../../utils/storage");
const { getDailyLuck } = require("../../../utils/dailyLuck");
const { grantDailyReward } = require("../../../utils/rewards");
const { prependPlazaPost } = require("../../../utils/plaza");

Page({
  data: {
    content: "",
    title: "",
    user: null,
    dailyLuck: null
  },

  onLoad() {
    const user = normalizeUserProfile(getStorage(STORAGE_KEYS.userProfile, null));
    if (!user) {
      tt.redirectTo({ url: "/pages/birth/index" });
      return;
    }
    this.setData({ user, dailyLuck: getDailyLuck(user, todayString()) });
  },

  onInput(event) {
    this.setData({ content: event.detail.value });
  },

  onTitleInput(event) {
    this.setData({ title: event.detail.value });
  },

  onSubmit() {
    const content = this.data.content.trim();
    if (!content) {
      tt.showToast({ title: "写下一件小幸运吧", icon: "none" });
      return;
    }

    const user = normalizeUserProfile(getStorage(STORAGE_KEYS.userProfile, null));
    const reward = grantDailyReward(user, "plazaPublished", todayString());
    prependPlazaPost({
      id: `post-${Date.now()}`,
      userId: user.id,
      nickname: user.nickname,
      natalLuckiStarId: user.natalLuckiStarId,
      dayPillar: user.dayPillar,
      title: this.data.title.trim() || "今天的小幸运",
      content,
      images: [],
      visualClass: "visual-rainbow",
      charm: this.data.dailyLuck.charm,
      stars: 3,
      createdAt: new Date().toISOString()
    });
    tt.showToast({ title: reward > 0 ? "发布成功 +2" : "发布成功", icon: "none" });
    setTimeout(() => tt.switchTab({ url: "/pages/plaza/index" }), 500);
  }
});
