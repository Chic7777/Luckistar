const { STORAGE_KEYS, getStorage, normalizeUserProfile, todayString, formatDateLabel } = require("../../utils/storage");
const { getDailyLuck } = require("../../utils/dailyLuck");
const { getLuckiStarById } = require("../../data/luckistars");
const { buildAstroProfile, buildBaZiArchive, buildZiweiProfile } = require("../../utils/archiveProfiles");

Page({
  data: {
    type: "daily",
    title: "今日星运卡",
    user: null,
    star: null,
    dailyLuck: {
      tasks: [],
      charm: {}
    },
    dateLabel: "",
    profile: null,
    selectedTaskTitle: ""
  },

  onLoad(options) {
    const user = normalizeUserProfile(getStorage(STORAGE_KEYS.userProfile, null));
    if (!user) {
      tt.redirectTo({ url: "/pages/birth/index" });
      return;
    }
    const type = options.type || "daily";
    const starId = options.starId || (type === "unlock" ? user.lastUnlockedLuckiStarId : user.natalLuckiStarId);
    const star = getLuckiStarById(starId || user.natalLuckiStarId);
    const date = todayString();
    const dailyLuck = getDailyLuck(user, date);
    const taskChoiceState = getStorage(STORAGE_KEYS.taskChoiceState, {});
    const todayTaskState = taskChoiceState[date] || {};
    const selectedTask = dailyLuck.tasks.find((task) => task.id === todayTaskState.completedTaskId)
      || dailyLuck.tasks.find((task) => task.id === todayTaskState.selectedTaskId)
      || dailyLuck.tasks[0];

    this.setData({
      type,
      title: this.getShareTitle(type),
      user,
      star,
      dailyLuck,
      dateLabel: formatDateLabel(date),
      profile: this.buildArchiveProfile(type, user),
      selectedTaskTitle: selectedTask ? selectedTask.title : ""
    });
  },

  getShareTitle(type) {
    if (type === "natal") return "本命 LuckiStar 卡";
    if (type === "unlock") return "解锁星灵卡";
    if (type === "charm") return "今日好运提示卡";
    if (type === "astro") return "星盘小屋卡";
    if (type === "bazi") return "八字星册卡";
    if (type === "ziwei") return "紫微星图卡";
    return "今日星运卡";
  },

  buildArchiveProfile(type, user) {
    if (type === "astro") return buildAstroProfile(user);
    if (type === "bazi") return buildBaZiArchive(user);
    if (type === "ziwei") return buildZiweiProfile(user);
    return null;
  },

  onBackHome() {
    tt.switchTab({ url: "/pages/home/index" });
  }
});
