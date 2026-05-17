const heavenlyStems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const earthlyBranches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const dayPillars = [
  "甲子", "乙丑", "丙寅", "丁卯", "戊辰", "己巳", "庚午", "辛未", "壬申", "癸酉",
  "甲戌", "乙亥", "丙子", "丁丑", "戊寅", "己卯", "庚辰", "辛巳", "壬午", "癸未",
  "甲申", "乙酉", "丙戌", "丁亥", "戊子", "己丑", "庚寅", "辛卯", "壬辰", "癸巳",
  "甲午", "乙未", "丙申", "丁酉", "戊戌", "己亥", "庚子", "辛丑", "壬寅", "癸卯",
  "甲辰", "乙巳", "丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥", "壬子", "癸丑",
  "甲寅", "乙卯", "丙辰", "丁巳", "戊午", "己未", "庚申", "辛酉", "壬戌", "癸亥"
];

const stemElementMap = {
  甲: "wood",
  乙: "wood",
  丙: "fire",
  丁: "fire",
  戊: "earth",
  己: "earth",
  庚: "metal",
  辛: "metal",
  壬: "water",
  癸: "water"
};

const elementConfig = {
  wood: {
    label: "木",
    colorTheme: "spring-green",
    keywords: ["生长", "温柔", "创造"],
    description: "像第一片新叶一样，在新的开始里陪你慢慢生长。",
    quote: "别怕开始，发芽本来就是慢慢来的。"
  },
  fire: {
    label: "火",
    colorTheme: "sunset-orange",
    keywords: ["热情", "明亮", "行动"],
    description: "把微小的热望收在掌心，提醒你仍然可以向前一点。",
    quote: "把今天先点亮一小块，就已经很好。"
  },
  earth: {
    label: "土",
    colorTheme: "wheat-gold",
    keywords: ["稳定", "包容", "踏实"],
    description: "像柔软的地面一样，接住你的疲惫和重新出发。",
    quote: "站稳一点，风来的时候你也不会散开。"
  },
  metal: {
    label: "金",
    colorTheme: "silver-blue",
    keywords: ["清醒", "秩序", "边界"],
    description: "替你擦亮混乱里的线索，把心事整理成更清晰的形状。",
    quote: "清醒不是冷掉，是把光收回来。"
  },
  water: {
    label: "水",
    colorTheme: "moon-blue",
    keywords: ["流动", "直觉", "疗愈"],
    description: "像月光下的水面，陪你把紧绷慢慢流走。",
    quote: "愿你今晚睡得安稳，醒来时心也变轻。"
  }
};

const branchMoodMap = {
  子: "夜光",
  丑: "雪田",
  寅: "晨林",
  卯: "花风",
  辰: "云岭",
  巳: "暖焰",
  午: "晴日",
  未: "麦穗",
  申: "银铃",
  酉: "清辉",
  戌: "灯塔",
  亥: "月雾"
};

const stemConfig = {
  甲: {
    image: "/assets/luckistars/jia.png",
    keywords: ["开创", "生长", "希望", "向上"],
    description: "甲木 LuckiStar 象征生长、开创与希望。她像春天里向上生长的小树，坚定温柔，拥有勇敢开始、持续成长的力量。",
    quote: "别怕开始，发芽本来就是慢慢来的。"
  },
  乙: {
    image: "/assets/luckistars/yi.png",
    keywords: ["柔韧", "滋养", "温柔", "审美"],
    description: "乙木 LuckiStar 象征柔韧、滋养与陪伴。她像春日花藤般轻柔灵动，善于适应变化，也能用细腻与温柔滋养身边的人。",
    quote: "像第一片新叶一样，在新的开始里陪你慢慢生长。"
  },
  丙: {
    image: "/assets/luckistars/bing.png",
    keywords: ["热情", "光明", "行动力", "活力"],
    description: "丙火 LuckiStar 象征太阳般的热情与光明。她开朗有活力，拥有照亮前路、带来温暖与行动力的能量。",
    quote: "把今天先点亮一小块，就已经很好。"
  },
  丁: {
    image: "/assets/luckistars/ding.png",
    keywords: ["灵感", "温暖", "陪伴", "治愈"],
    description: "丁火 LuckiStar 象征灯火般的温暖与灵感。她细腻柔和，擅长在安静中点亮心灵，用陪伴与微光带来治愈。",
    quote: "把微小的热望收在掌心，提醒你仍然可以向前一点。"
  },
  戊: {
    image: "/assets/luckistars/wu.png",
    keywords: ["稳定", "承载", "守护", "安心"],
    description: "戊土 LuckiStar 象征厚土与山岳的力量。她沉稳可靠，像大地一样能承载万物，给予支持、安全感与坚定的守护。",
    quote: "站稳一点，风来的时候你也不会散开。"
  },
  己: {
    image: "/assets/luckistars/ji.png",
    keywords: ["包容", "滋养", "温和", "安抚"],
    description: "己土 LuckiStar 象征田园与沃土的包容。她温和细致，擅长滋养与安抚，用柔软的力量守护每一颗需要被照顾的心。",
    quote: "站稳一点，风来的时候你也不会散开。"
  },
  庚: {
    image: "/assets/luckistars/geng.png",
    keywords: ["果断", "执行", "秩序", "勇气"],
    description: "庚金 LuckiStar 象征锋芒、秩序与行动力。她坚决果断，能够斩断混乱、守护规则，用清晰与勇气开辟道路。",
    quote: "清醒不是冷掉，是把光收回来。"
  },
  辛: {
    image: "/assets/luckistars/xin.png",
    keywords: ["精致", "细节", "珍贵", "审美"],
    description: "辛金 LuckiStar 象征珠玉般的精致与高雅。她细腻敏锐，追求品质与美感，善于发现细节之美，并把平凡打磨成珍贵。",
    quote: "替你擦亮混乱里的线索，把心事整理成更清晰的形状。"
  },
  壬: {
    image: "/assets/luckistars/ren.png",
    keywords: ["流动", "智慧", "探索", "自由"],
    description: "壬水 LuckiStar 象征江海般的流动与智慧。她胸怀广阔，喜欢探索未知，能够在变化中找到方向，以自由与智慧前行。",
    quote: "像月光下的水面，陪你把紧绷慢慢流走。"
  },
  癸: {
    image: "/assets/luckistars/gui.png",
    keywords: ["感知", "梦境", "灵性", "治愈"],
    description: "癸水 LuckiStar 象征雨露般的细腻与灵性。她温柔敏感，善于感知情绪与梦境，用安静的力量疗愈内心，润物无声。",
    quote: "愿你今晚睡得安稳，醒来时心也变轻。"
  }
};

const luckiStars = dayPillars.map((pillar, index) => {
  const heavenlyStem = pillar[0];
  const earthlyBranch = pillar[1];
  const element = stemElementMap[heavenlyStem];
  const config = elementConfig[element];
  const sConfig = stemConfig[heavenlyStem];
  const branchMood = branchMoodMap[earthlyBranch];

  return {
    id: `luckistar-${index + 1}`,
    dayPillar: pillar,
    name: pillar,
    element,
    elementLabel: config.label,
    heavenlyStem,
    earthlyBranch,
    branchMood,
    colorTheme: config.colorTheme,
    keywords: sConfig.keywords,
    description: sConfig.description.replace(/ LuckiStar/g, ""),
    quote: sConfig.quote,
    imageUrl: sConfig.image,
    silhouetteUrl: "/assets/luckistar-silhouette.svg"
  };
});

function getLuckiStarById(id) {
  return luckiStars.find((star) => star.id === id) || luckiStars[0];
}

function getLuckiStarByDayPillar(dayPillar) {
  return luckiStars.find((star) => star.dayPillar === dayPillar) || luckiStars[0];
}

module.exports = {
  heavenlyStems,
  earthlyBranches,
  dayPillars,
  stemElementMap,
  elementConfig,
  luckiStars,
  getLuckiStarById,
  getLuckiStarByDayPillar
};
