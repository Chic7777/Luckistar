const { STORAGE_KEYS, getStorage, normalizeUserProfile } = require("../../utils/storage");
const { getLuckiStarById, elementConfig } = require("../../data/luckistars");

Page({
  data: {
    star: null,
    isNatal: false,
    isFresh: false,
    elementIntro: "",
    elementKeywordsText: "",
    keywordsText: "",
    profileItems: [],
    adviceItems: []
  },

  onLoad(options) {
    const user = normalizeUserProfile(getStorage(STORAGE_KEYS.userProfile, null));
    const star = getLuckiStarById(options.id);
    const elementInfo = elementConfig[star.element] || {};
    const adviceItems = this.buildAdviceItems(star);
    this.setData({
      star,
      isNatal: user && user.natalLuckiStarId === star.id,
      isFresh: options.fresh === "1",
      elementIntro: elementInfo.description || "",
      elementKeywordsText: Array.isArray(elementInfo.keywords) ? elementInfo.keywords.join(" / ") : "",
      keywordsText: Array.isArray(star.keywords) ? star.keywords.join(" / ") : "",
      profileItems: [
        { label: "日柱", value: star.dayPillar },
        { label: "天干", value: star.heavenlyStem },
        { label: "地支", value: star.earthlyBranch },
        { label: "五行", value: star.elementLabel },
        { label: "氛围", value: star.branchMood },
        { label: "关键词", value: Array.isArray(star.keywords) ? star.keywords.join(" / ") : "" }
      ],
      adviceItems
    });
  },

  buildAdviceItems(star) {
    const base = {
      wood: [
        { title: "今天适合", text: "把一个想法拆成第一步，先动起来就会长出后续。"},
        { title: "关系提示", text: "用温柔但明确的方式表达你的边界，别替别人做决定。"},
        { title: "能量补给", text: "去看一点绿色、走十分钟路，让身体先松开。"}
      ],
      fire: [
        { title: "今天适合", text: "先做一件能立刻见效的小事，把节奏点亮。"},
        { title: "关系提示", text: "把热情留给值得的人，同时给自己留出喘息。"},
        { title: "能量补给", text: "喝温热的水、做一次伸展，让火光更稳定。"}
      ],
      earth: [
        { title: "今天适合", text: "把重要的事情按顺序排好，稳定推进就会很顺。"},
        { title: "关系提示", text: "你很可靠，但不需要把所有人的情绪都接住。"},
        { title: "能量补给", text: "整理桌面或房间的一角，你会立刻更安心。"}
      ],
      metal: [
        { title: "今天适合", text: "做一次干净的取舍：删掉一个不必要的任务或关系负担。"},
        { title: "关系提示", text: "少解释、多行动；用结果说话会更省力。"},
        { title: "能量补给", text: "把通知静音一小时，给大脑一段清爽的空白。"}
      ],
      water: [
        { title: "今天适合", text: "跟随直觉把心里那件事写下来，答案会浮出来。"},
        { title: "关系提示", text: "共情很好，但先确认这是不是你该承担的部分。"},
        { title: "能量补给", text: "早点睡或洗个热澡，让情绪像水一样流走。"}
      ]
    };

    const items = base[star.element] || base.water;
    const mood = star.branchMood ? `（${star.branchMood}）` : "";
    return items.map((item) => ({
      title: item.title,
      text: mood ? `${item.text}${mood}` : item.text
    }));
  },

  onShareCard() {
    tt.navigateTo({ url: `/pages/share/index?type=unlock&starId=${this.data.star.id}` });
  }
});
