const { STORAGE_KEYS, getStorage, setStorage, normalizeUserProfile } = require("../../utils/storage");
const { luckiStars, getLuckiStarById } = require("../../data/luckistars");
const { stableHash } = require("../../utils/dailyLuck");

Page({
  data: {
    user: null,
    cards: [],
    unlockedCount: 0,
    progressText: "0 / 60"
  },

  onShow() {
    this.loadGallery();
  },

  loadGallery() {
    const user = normalizeUserProfile(getStorage(STORAGE_KEYS.userProfile, null));
    if (!user) {
      tt.redirectTo({ url: "/pages/birth/index" });
      return;
    }
    const cards = luckiStars.map((star) => {
      const unlocked = user.unlockedLuckiStarIds.indexOf(star.id) >= 0;
      return {
        ...star,
        unlocked,
        isNatal: user.natalLuckiStarId === star.id,
        keywordText: star.keywords.join(" · ")
      };
    });
    this.setData({
      user,
      cards,
      unlockedCount: user.unlockedLuckiStarIds.length,
      progressText: `${user.unlockedLuckiStarIds.length} / ${luckiStars.length}`
    });
  },

  onCardTap(event) {
    const starId = event.currentTarget.dataset.id;
    const star = getLuckiStarById(starId);
    const user = normalizeUserProfile(getStorage(STORAGE_KEYS.userProfile, null));
    const unlocked = user.unlockedLuckiStarIds.indexOf(starId) >= 0;

    if (unlocked) {
      tt.navigateTo({ url: `/pages/star-detail/index?id=${starId}` });
      return;
    }

    this.confirmUnlock(star);
  },

  onBlindBox() {
    const user = normalizeUserProfile(getStorage(STORAGE_KEYS.userProfile, null));
    const locked = luckiStars.filter((star) => user.unlockedLuckiStarIds.indexOf(star.id) < 0);
    if (locked.length === 0) {
      tt.showToast({ title: "全部 LuckiStar 已收集", icon: "none" });
      return;
    }
    const seed = stableHash(`${Date.now()}-${user.id}-${user.unlockedLuckiStarIds.length}`);
    this.confirmUnlock(locked[seed % locked.length]);
  },

  confirmUnlock(star) {
    const user = normalizeUserProfile(getStorage(STORAGE_KEYS.userProfile, null));
    if (user.starFragments < 10) {
      tt.showToast({ title: `还需要 ${10 - user.starFragments} 枚星星碎片`, icon: "none" });
      return;
    }
    tt.showModal({
      title: "点亮隐藏星灵",
      content: `消耗 10 枚星星碎片，点亮 ${star.dayPillar} LuckiStar？`,
      confirmText: "点亮",
      success: (res) => {
        if (res.confirm) this.unlockStar(star.id);
      }
    });
  },

  unlockStar(starId) {
    const user = normalizeUserProfile(getStorage(STORAGE_KEYS.userProfile, null));
    if (user.unlockedLuckiStarIds.indexOf(starId) < 0) {
      user.unlockedLuckiStarIds.push(starId);
      user.starFragments -= 10;
      user.lastUnlockedLuckiStarId = starId;
      user.updatedAt = new Date().toISOString();
      setStorage(STORAGE_KEYS.userProfile, user);
    }
    const star = getLuckiStarById(starId);
    tt.showToast({ title: `${star.dayPillar} 被点亮了`, icon: "none" });
    this.loadGallery();
    setTimeout(() => tt.navigateTo({ url: `/pages/star-detail/index?id=${starId}&fresh=1` }), 400);
  }
});
