const { STORAGE_KEYS, getStorage, normalizeUserProfile } = require("../../utils/storage");
const { getLuckiStarById } = require("../../data/luckistars");

Page({
  data: {
    user: null,
    star: null,
    keywordText: ""
  },

  onLoad() {
    const user = normalizeUserProfile(getStorage(STORAGE_KEYS.userProfile, null));
    if (!user) {
      tt.redirectTo({ url: "/pages/birth/index" });
      return;
    }
    const star = getLuckiStarById(user.natalLuckiStarId);
    const descriptionWithoutSuffix = star.description.replace(/ LuckiStar/g, "");
    
    // 生成更丰富的档案数据
    const moreInfo = {
      luckyColors: this.getLuckyColors(star.element),
      luckyNumbers: this.getLuckyNumbers(star.element),
      growthTips: this.getGrowthTips(star.element),
      compatibility: this.getCompatibility(star.element),
      motto: star.quote
    };

    this.setData({ 
      user, 
      star, 
      descriptionWithoutSuffix,
      keywordText: star.keywords.join(" · "),
      ...moreInfo
    });
  },

  getLuckyColors(element) {
    const map = { wood: "翠绿色、淡青色", fire: "火红色、亮橙色", earth: "土黄色、咖啡色", metal: "银白色、浅金色", water: "深蓝色、墨黑色" };
    return map[element] || "星光色";
  },

  getLuckyNumbers(element) {
    const map = { wood: "3, 8", fire: "2, 7", earth: "5, 0", metal: "4, 9", water: "1, 6" };
    return map[element] || "9, 9";
  },

  getGrowthTips(element) {
    const map = {
      wood: "多接触自然，保持内心的生长动力，学习适度的放松。建议尝试插花或远足。",
      fire: "学会管理热情，避免能量过度透支。建议通过冥想或书法来沉淀心境。",
      earth: "尝试打破常规，给生活增加一点小小的变动。建议尝试旅行或新的手作爱好。",
      metal: "在秩序中加入一点感性，允许自己偶尔的不完美。建议多听听轻音乐或阅读诗歌。",
      water: "保持流动的同时建立清晰的边界。建议通过规律的运动或整理房间来定心。"
    };
    return map[element] || "保持觉察，顺应星光流动的节奏。";
  },

  getCompatibility(element) {
    const map = { wood: "火、水", fire: "木、土", earth: "火、金", metal: "土、水", water: "金、木" };
    return map[element] || "全五行兼容";
  },

  onShareNatal() {
    tt.navigateTo({ url: "/pages/share/index?type=natal" });
  }
});
