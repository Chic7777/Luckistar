const { STORAGE_KEYS, getStorage, setStorage, normalizeUserProfile, todayString, formatDateLabel } = require("../../utils/storage");
const { getDailyLuck } = require("../../utils/dailyLuck");
const { getLuckiStarById } = require("../../data/luckistars");
const { grantDailyReward } = require("../../utils/rewards");
const { prependPlazaPost } = require("../../utils/plaza");
const { getNatalTraits } = require("../../utils/archiveProfiles");

Page({
  data: {
    user: null,
    natalStar: null,
    dailyLuck: {
      tasks: [],
      charm: {}
    },
    todayLabel: "",
    natalTraits: [],
    charmDrawn: false,
    charmAnimating: false,
    showCheckinModal: false,
    checkinMode: "task",
    eventContent: "",
    publishToPlaza: true,
    completedToday: false,
    rewardText: "",
    selectedTaskId: "",
    selectedTaskTitle: "",
    completedTaskId: ""
  },

  onShow() {
    this.loadHome();
  },

  loadHome() {
    const user = normalizeUserProfile(getStorage(STORAGE_KEYS.userProfile, null));
    if (!user) {
      tt.redirectTo({ url: "/pages/birth/index" });
      return;
    }

    const today = todayString();
    const natalStar = getLuckiStarById(user.natalLuckiStarId);
    const dailyLuck = getDailyLuck(user, today);
    const natalTraits = getNatalTraits(user, natalStar);
    const charmDrawState = getStorage(STORAGE_KEYS.charmDrawState, {});
    const taskChoiceState = getStorage(STORAGE_KEYS.taskChoiceState, {});
    const todayTaskState = taskChoiceState[today] || {};
    const selectedTask = dailyLuck.tasks.find((task) => task.id === todayTaskState.selectedTaskId)
      || dailyLuck.tasks.find((task) => task.id === todayTaskState.completedTaskId)
      || null;

    this.setData({
      user,
      natalStar,
      dailyLuck,
      natalTraits,
      charmDrawn: Boolean(charmDrawState[today]),
      charmAnimating: false,
      todayLabel: formatDateLabel(today),
      completedToday: Boolean(todayTaskState.completedTaskId) || user.completedDates.indexOf(today) >= 0,
      rewardText: "",
      selectedTaskId: selectedTask ? selectedTask.id : "",
      selectedTaskTitle: selectedTask ? selectedTask.title : "",
      completedTaskId: todayTaskState.completedTaskId || ""
    });
  },

  updateTaskState(partial) {
    const today = todayString();
    const taskChoiceState = getStorage(STORAGE_KEYS.taskChoiceState, {});
    taskChoiceState[today] = {
      ...(taskChoiceState[today] || {}),
      ...partial
    };
    setStorage(STORAGE_KEYS.taskChoiceState, taskChoiceState);
  },

  onSelectTask(event) {
    if (this.data.completedToday) return;
    const taskId = event.currentTarget.dataset.id;
    const selectedTask = this.data.dailyLuck.tasks.find((task) => task.id === taskId);
    if (!selectedTask) return;
    this.updateTaskState({ selectedTaskId: taskId });
    this.setData({
      selectedTaskId: taskId,
      selectedTaskTitle: selectedTask.title
    });
  },

  onOpenCheckin() {
    const mode = (arguments[0] && arguments[0].currentTarget && arguments[0].currentTarget.dataset && arguments[0].currentTarget.dataset.mode) || "task";

    if (mode === "task") {
      if (!this.data.selectedTaskId && !this.data.completedToday) {
        tt.showToast({ title: "先选一个今日好运任务吧", icon: "none" });
        return;
      }
    }

    if (mode === "charm" && !this.data.charmDrawn) {
      tt.showToast({ title: "先抽取今日星光签吧", icon: "none" });
      return;
    }

    this.setData({
      checkinMode: mode,
      showCheckinModal: true,
      eventContent: "",
      publishToPlaza: true,
      rewardText: ""
    });
  },

  onCloseCheckin() {
    this.setData({ showCheckinModal: false });
  },

  noop() {},

  onDrawCharm() {
    const today = todayString();
    const charmDrawState = getStorage(STORAGE_KEYS.charmDrawState, {});
    if (this.data.charmDrawn) return;

    this.setData({ charmAnimating: true });
    setTimeout(() => {
      const user = normalizeUserProfile(getStorage(STORAGE_KEYS.userProfile, null));
      const reward = grantDailyReward(user, "charmDrawn", today);
      charmDrawState[today] = true;
      setStorage(STORAGE_KEYS.charmDrawState, charmDrawState);
      this.setData({
        user: getStorage(STORAGE_KEYS.userProfile, user),
        charmDrawn: true,
        charmAnimating: false
      });
      tt.showToast({
        title: reward > 0 ? `抽到了${this.data.dailyLuck.charm.name}，碎片 +${reward}` : `抽到了${this.data.dailyLuck.charm.name}`,
        icon: "none"
      });
    }, 620);
  },

  onEventInput(event) {
    this.setData({ eventContent: event.detail.value });
  },

  onPublishChange(event) {
    this.setData({ publishToPlaza: event.detail.value.indexOf("publish") >= 0 });
  },

  onSubmitCheckin() {
    const today = todayString();
    const user = normalizeUserProfile(getStorage(STORAGE_KEYS.userProfile, null));
    const dailyLuck = this.data.dailyLuck;
    const mode = this.data.checkinMode || "task";
    let reward = 0;

    if (mode === "task") {
      const selectedTask = dailyLuck.tasks.find((task) => task.id === this.data.selectedTaskId) || dailyLuck.tasks[0];
      const content = this.data.eventContent.trim() || `我完成了今天的好运任务：${selectedTask.title}`;

      reward += grantDailyReward(user, "taskCompleted", today);

      if (user.completedDates.indexOf(today) < 0) {
        user.completedDates.push(today);
      }

      if (this.data.publishToPlaza) {
        reward += grantDailyReward(user, "plazaPublished", today);
        prependPlazaPost({
          id: `post-${Date.now()}`,
          userId: user.id,
          nickname: user.nickname,
          natalLuckiStarId: user.natalLuckiStarId,
          dayPillar: user.dayPillar,
          title: `打卡：${selectedTask.title}`,
          content,
          images: [],
          visualClass: "visual-card",
          charm: { id: "task", name: "今日好运任务", message: selectedTask.desc || "完成一件小任务" },
          topicLabel: "今日好运任务",
          secondaryTag: dailyLuck.keyword,
          stars: 3,
          createdAt: new Date().toISOString()
        });
      }

      setStorage(STORAGE_KEYS.userProfile, user);
      this.updateTaskState({
        selectedTaskId: selectedTask.id,
        completedTaskId: selectedTask.id
      });
      this.setData({
        user,
        completedToday: true,
        selectedTaskId: selectedTask.id,
        selectedTaskTitle: selectedTask.title,
        completedTaskId: selectedTask.id,
        showCheckinModal: false,
        rewardText: reward > 0 ? `获得 ${reward} 枚星星碎片` : "今日奖励已领取"
      });
      tt.showToast({ title: this.data.rewardText, icon: "none" });
      return;
    }

    if (mode === "event") {
      const content = this.data.eventContent.trim();
      if (!content) {
        tt.showToast({ title: "写点什么再记录吧", icon: "none" });
        return;
      }

      reward += grantDailyReward(user, "eventRecorded", today);

      if (this.data.publishToPlaza) {
        reward += grantDailyReward(user, "plazaPublished", today);
        prependPlazaPost({
          id: `post-${Date.now()}`,
          userId: user.id,
          nickname: user.nickname,
          natalLuckiStarId: user.natalLuckiStarId,
          dayPillar: user.dayPillar,
          title: `幸运事件：${dailyLuck.keyword}`,
          content,
          images: [],
          visualClass: "visual-star",
          charm: { id: "event", name: "幸运事件", message: dailyLuck.status || "把今天的小幸运记下来" },
          topicLabel: "幸运事件",
          secondaryTag: dailyLuck.keyword,
          stars: 3,
          createdAt: new Date().toISOString()
        });
      }

      setStorage(STORAGE_KEYS.userProfile, user);
      this.setData({
        user,
        showCheckinModal: false,
        rewardText: reward > 0 ? `获得 ${reward} 枚星星碎片` : "今日奖励已领取"
      });
      tt.showToast({ title: this.data.rewardText, icon: "none" });
      return;
    }

    const content = this.data.eventContent.trim() || `我抽到了：${dailyLuck.charm.name}。${dailyLuck.charm.message || ""}`.trim();
    if (this.data.publishToPlaza) {
      reward += grantDailyReward(user, "plazaPublished", today);
      prependPlazaPost({
        id: `post-${Date.now()}`,
        userId: user.id,
        nickname: user.nickname,
        natalLuckiStarId: user.natalLuckiStarId,
        dayPillar: user.dayPillar,
        title: `星光签打卡：${dailyLuck.charm.name}`,
        content,
        images: [],
        visualClass: "visual-cosmos",
        charm: dailyLuck.charm,
        topicLabel: "今日星光签",
        secondaryTag: dailyLuck.charm.name,
        stars: 3,
        createdAt: new Date().toISOString()
      });
    }

    setStorage(STORAGE_KEYS.userProfile, user);
    this.setData({
      user,
      showCheckinModal: false,
      rewardText: reward > 0 ? `获得 ${reward} 枚星星碎片` : "已打卡"
    });
    tt.showToast({ title: this.data.rewardText, icon: "none" });
  },

  onShareLuck(event) {
    const type = event.currentTarget.dataset.type || "daily";
    const user = normalizeUserProfile(getStorage(STORAGE_KEYS.userProfile, null));
    const rewardKey = type === "charm" ? "charmShared" : "shared";
    const reward = grantDailyReward(user, rewardKey, todayString());
    const today = todayString();
    user.sharedDates = user.sharedDates || [];
    if (user.sharedDates.indexOf(today) < 0) {
      user.sharedDates.push(today);
      setStorage(STORAGE_KEYS.userProfile, user);
    }
    tt.showToast({ title: reward > 0 ? `分享奖励 +${reward}` : "今日分享奖励已领取", icon: "none" });
    tt.navigateTo({ url: `/pages/share/index?type=${type}` });
  },

  onOpenProfile() {
    tt.navigateTo({ url: "/pages/profile/index" });
  },

  onOpenArchive(event) {
    tt.navigateTo({ url: `/pages/archive/index?type=${event.currentTarget.dataset.type}` });
  },

  onReset() {
    tt.showModal({
      title: "重新召唤？",
      content: "会清空本地 LuckiStar 进度，适合录制 Demo 前重新开始。",
      success: (res) => {
        if (!res.confirm) return;
        Object.keys(STORAGE_KEYS).forEach((key) => tt.removeStorageSync(STORAGE_KEYS[key]));
        tt.redirectTo({ url: "/pages/birth/index" });
      }
    });
  }
});
