const { STORAGE_KEYS, getStorage, normalizeUserProfile, todayString } = require("../../utils/storage");
const { getDailyLuck } = require("../../utils/dailyLuck");
const { getLuckiStarById } = require("../../data/luckistars");
const { grantDailyReward } = require("../../utils/rewards");
const { getPlazaPosts, updatePostStars } = require("../../utils/plaza");

Page({
  data: {
    user: null,
    posts: [],
    visitMessage: "",
    encounterStar: null,
    dailyLuck: null
  },

  onShow() {
    this.loadPlaza();
  },

  loadPlaza() {
    const user = normalizeUserProfile(getStorage(STORAGE_KEYS.userProfile, null));
    if (!user) {
      tt.redirectTo({ url: "/pages/birth/index" });
      return;
    }

    const dailyLuck = getDailyLuck(user, todayString());
    const encounterStar = getLuckiStarById(dailyLuck.encounterLuckiStarId);
    const reward = grantDailyReward(user, "plazaVisited", todayString());
    const visitMessage = reward > 0
      ? `${encounterStar.name} 刚刚拜访了你的星运空间，留下了 ${dailyLuck.charm.name} 和 2 枚星星碎片。`
      : `${encounterStar.name} 今天正在星光广场等你。`;

    this.setData({
      user: getStorage(STORAGE_KEYS.userProfile, user),
      posts: this.decoratePosts(getPlazaPosts()),
      dailyLuck,
      encounterStar,
      visitMessage
    });
  },

  decoratePosts(posts) {
    return posts.map((post, index) => ({
      ...post,
      title: post.title || "今天的小幸运",
      visualClass: post.visualClass || "visual-star",
      imageHeightClass: index % 3 === 0 ? "image-tall" : index % 3 === 1 ? "image-mid" : "image-short",
      star: getLuckiStarById(post.natalLuckiStarId),
      createdText: this.formatPostTime(post.createdAt),
      visualLabel: post.topicLabel || this.getVisualLabel(post),
      secondaryTag: post.secondaryTag || this.getSecondaryTag(post),
      coverNote: this.getCoverNote(post),
      postTags: this.getPostTags(post)
    }));
  },

  getVisualLabel(post) {
    if (post.title.indexOf("星盘") >= 0) return "星盘感悟";
    if (post.title.indexOf("八字") >= 0) return "八字小发现";
    if (post.title.indexOf("紫微") >= 0) return "紫微提醒";
    if (post.title.indexOf("穿搭") >= 0) return "幸运穿搭";
    if (post.title.indexOf("食物") >= 0) return "幸运食物";
    if (post.title.indexOf("朋友") >= 0 || post.content.indexOf("朋友") >= 0) return "朋友互动";
    if (post.title.indexOf("抽到") >= 0 || post.title.indexOf("星签") >= 0) return "好运提示";
    return "今日好运任务";
  },

  getSecondaryTag(post) {
    if (post.title.indexOf("穿搭") >= 0) return "OOTD";
    if (post.title.indexOf("食物") >= 0) return "今日食物";
    if (post.title.indexOf("星盘") >= 0) return "小感悟";
    if (post.title.indexOf("八字") >= 0) return "LuckiStar 来源";
    if (post.title.indexOf("紫微") >= 0) return "今日提醒";
    return post.charm.name;
  },

  getCoverNote(post) {
    if (post.title.indexOf("穿搭") >= 0) return "把今天穿成轻轻发光的样子";
    if (post.title.indexOf("食物") >= 0) return "这一口刚好把心安顿下来";
    if (post.title.indexOf("星盘") >= 0) return "先慢下来，再把今天过稳";
    if (post.title.indexOf("八字") >= 0) return "原来本命 LuckiStar 真的和日柱对应";
    if (post.title.indexOf("紫微") >= 0) return "先照顾情绪，事情会跟着顺下来";
    if (post.title.indexOf("朋友") >= 0 || post.content.indexOf("朋友") >= 0) return "被回应的瞬间，也是一种好运";
    return post.charm.message;
  },

  getPostTags(post) {
    return [
      post.dayPillar,
      post.charm.name,
      post.secondaryTag || this.getSecondaryTag(post)
    ];
  },

  formatPostTime(value) {
    const date = new Date(value);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}.${day}`;
  },

  onPublish() {
    tt.navigateTo({ url: "/pages/plaza/post/index" });
  },

  onBoost(event) {
    const postId = event.currentTarget.dataset.id;
    const user = normalizeUserProfile(getStorage(STORAGE_KEYS.userProfile, null));
    const reward = grantDailyReward(user, "boosted", todayString());
    updatePostStars(postId, 1);
    const posts = this.data.posts.map((post) => (
      post.id === postId ? { ...post, stars: post.stars + 1 } : post
    ));
    this.setData({ posts, user: getStorage(STORAGE_KEYS.userProfile, user) });
    tt.showToast({ title: reward > 0 ? "你为 TA 点亮了一颗星 +1" : "你为 TA 点亮了一颗星", icon: "none" });
  }
});
