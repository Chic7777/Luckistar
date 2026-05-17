const { stableHash } = require("./dailyLuck");
const { stemElementMap, elementConfig } = require("../data/luckistars");

const zodiacSigns = [
  { name: "摩羯座", start: 1222, element: "土", keywords: ["稳住节奏", "长期主义", "认真可靠"] },
  { name: "水瓶座", start: 120, element: "风", keywords: ["独立想法", "未来感", "保持距离"] },
  { name: "双鱼座", start: 219, element: "水", keywords: ["共情力", "梦境感", "柔软直觉"] },
  { name: "白羊座", start: 321, element: "火", keywords: ["先行动", "勇气", "开场能量"] },
  { name: "金牛座", start: 420, element: "土", keywords: ["稳定感", "审美", "慢慢积累"] },
  { name: "双子座", start: 521, element: "风", keywords: ["表达", "好奇", "信息流动"] },
  { name: "巨蟹座", start: 622, element: "水", keywords: ["照顾", "安全感", "情绪记忆"] },
  { name: "狮子座", start: 723, element: "火", keywords: ["发光", "创造力", "被看见"] },
  { name: "处女座", start: 823, element: "土", keywords: ["整理", "细节", "把事做好"] },
  { name: "天秤座", start: 923, element: "风", keywords: ["平衡", "关系美感", "温柔表达"] },
  { name: "天蝎座", start: 1024, element: "水", keywords: ["深度", "洞察", "自我修复"] },
  { name: "射手座", start: 1122, element: "火", keywords: ["远方", "探索", "开阔"] }
];

const palacePool = ["命宫在子", "命宫在丑", "命宫在寅", "命宫在卯", "命宫在辰", "命宫在巳", "命宫在午", "命宫在未", "命宫在申", "命宫在酉", "命宫在戌", "命宫在亥"];
const bodyPalacePool = ["身宫在迁移", "身宫在福德", "身宫在事业", "身宫在财帛", "身宫在夫妻", "身宫在命宫"];
const mainStarPool = ["紫微", "天府", "太阳", "太阴", "天相", "贪狼", "天机", "天梁", "武曲", "廉贞"];
const ziweiKeywordPool = ["慢热但可靠", "直觉敏锐", "外柔内韧", "需要边界", "适合长期积累", "越整理越发光", "先安顿情绪再行动"];

function getNatalTraits(user, star) {
  const config = elementConfig[star.element];
  const traitMap = {
    wood: {
      energyType: "生长型能量",
      expression: "用温柔和创造力表达自己",
      strength: "擅长从新的开始里找到希望",
      friction: "容易因为想照顾所有人而内耗",
      guardian: "小芽、藤蔓、晨光"
    },
    fire: {
      energyType: "点亮型能量",
      expression: "用热情和行动打开局面",
      strength: "能把低落的空间重新变明亮",
      friction: "容易急着证明自己足够好",
      guardian: "火苗、太阳、萤火"
    },
    earth: {
      energyType: "承托型能量",
      expression: "用稳定和踏实给人安全感",
      strength: "能把混乱慢慢整理成秩序",
      friction: "容易把责任都扛在自己身上",
      guardian: "山丘、麦穗、暖土"
    },
    metal: {
      energyType: "清醒型能量",
      expression: "用判断力和边界感表达自己",
      strength: "擅长看清重点，做出干净选择",
      friction: "容易对自己太严格",
      guardian: "银铃、星刃、月白光"
    },
    water: {
      energyType: "疗愈型能量",
      expression: "用直觉和共情靠近世界",
      strength: "能在变化里保持柔软和流动",
      friction: "容易被情绪浪潮带着走",
      guardian: "月光、水滴、海浪"
    }
  };
  const trait = traitMap[star.element];
  return [
    { label: "性格关键词", value: star.keywords.join(" / ") },
    { label: "五行属性", value: config.label },
    { label: "能量类型", value: trait.energyType },
    { label: "表达方式", value: trait.expression },
    { label: "内在优势", value: trait.strength },
    { label: "容易内耗点", value: trait.friction },
    { label: "星灵氛围", value: star.branchMood },
    { label: "守护元素", value: trait.guardian }
  ];
}

function buildAstroProfile(user) {
  const seed = stableHash(`${user.birthDate}-${user.birthTime}-${user.birthCity}`);
  const sun = getSunSign(user.birthDate);
  const moon = zodiacSigns[stableHash(`${user.birthDate}-moon`) % zodiacSigns.length];
  const rising = zodiacSigns[stableHash(`${user.birthTime}-rising`) % zodiacSigns.length];
  
  // 补充全量行星数据
  const mercury = zodiacSigns[(seed + 2) % zodiacSigns.length];
  const venus = zodiacSigns[(seed + 5) % zodiacSigns.length];
  const mars = zodiacSigns[(seed + 8) % zodiacSigns.length];
  const jupiter = zodiacSigns[(seed + 11) % zodiacSigns.length];
  const saturn = zodiacSigns[(seed + 14) % zodiacSigns.length];
  const uranus = zodiacSigns[(seed + 17) % zodiacSigns.length];
  const neptune = zodiacSigns[(seed + 20) % zodiacSigns.length];
  const pluto = zodiacSigns[(seed + 23) % zodiacSigns.length];

  const elements = countElements([sun, moon, rising, mercury, venus, mars, jupiter, saturn]);
  const dominantElement = Object.keys(elements).sort((a, b) => elements[b] - elements[a])[0];

  const astroAnalyses = {
    火: "你拥有极强的生命能量，像火焰一样能照亮周围的人。你的性格中带有天然的勇气，适合作为开创者去挑战未知。",
    土: "你的性格底色是稳重与包容。你像大地一样踏实，能给身边的人带来极强的安全感，是团队中不可或缺的定海神针。",
    风: "你思维敏捷，热爱自由与交流。你像微风一样灵动，总能从独特的角度看世界，是一个天生的创意家和传播者。",
    水: "你内心细腻且富有直觉。你像流水一样温柔，拥有强大的共情力，能感知到他人忽略的微小情绪，是一个天生的疗愈者。"
  };

  return {
    title: "星盘小屋",
    intro: "这是你的人格宇宙地图，揭示了群星在你出生那一刻的坐标。",
    sunSign: sun.name,
    moonSign: moon.name,
    risingSign: rising.name,
    elementTendency: `${dominantElement}元素偏强`,
    analysis: astroAnalyses[dominantElement] || "你拥有平衡且多元的能量特质。",
    planets: [
      { label: "太阳", value: sun.name, desc: `核心自我与生命力。你的 ${sun.name} 特质表现为：${sun.keywords.join("、")}。` },
      { label: "月亮", value: moon.name, desc: `内在情感与安全感。在 ${moon.name} 的影响下，你倾向于：${moon.keywords.join("、")}。` },
      { label: "上升", value: rising.name, desc: `外在人格与初见印象。上升 ${rising.name} 让你给人的感觉是：${rising.keywords.join("、")}。` },
      { label: "水星", value: mercury.name, desc: `思维模式与沟通表达。水星在 ${mercury.name} 意味着：${mercury.keywords.join("、")}。` },
      { label: "金星", value: venus.name, desc: `审美取向与情感表达。金星在 ${venus.name} 展现了：${venus.keywords.join("、")}。` },
      { label: "火星", value: mars.name, desc: `行动力与欲望能量。火星在 ${mars.name} 驱动你：${mars.keywords.join("、")}。` },
      { label: "木星", value: jupiter.name, desc: `机遇、扩张与幸运源泉。木星在 ${jupiter.name} 带来：${jupiter.keywords.join("、")}。` },
      { label: "土星", value: saturn.name, desc: `责任、压力与长期课题。土星在 ${saturn.name} 要求你：${saturn.keywords.join("、")}。` },
      { label: "天王星", value: uranus.name, desc: "变革、独特性与灵感。它揭示了你生命中追求不凡与创新的领域。" },
      { label: "海王星", value: neptune.name, desc: "梦境、直觉与精神追求。它影响着你潜意识里的艺术感与同情心。" },
      { label: "冥王星", value: pluto.name, desc: "转化、深度与重生力量。它代表了你生命中必须经历深刻转变的地方。" }
    ]
  };
}

function buildBaZiArchive(user) {
  const pillars = [user.yearPillar, user.monthPillar, user.dayPillar, user.hourPillar].filter(Boolean);
  const distribution = countFiveElements(pillars);
  const dayMaster = user.dayPillar ? user.dayPillar[0] : "";
  const dayElement = stemElementMap[dayMaster];
  const dayElementLabel = dayElement ? elementConfig[dayElement].label : "未知";

  const baziAnalyses = {
    wood: "你是天生的生长者，内心充满生机与创造力。你性格仁慈，像树木一样正直向上，即便遇到挫折也能迅速萌发新的生机。",
    fire: "你是天生的发光体，热情且充满行动力。你性格明朗，待人真诚，能迅速点燃周围的氛围，但也要注意偶尔停下来休息。",
    earth: "你是天生的承载者，性格宽厚且沉稳。你非常守信用，能包容各种复杂的人事物，是朋友们最信任的倾诉对象。",
    metal: "你是天生的决断者，性格刚毅且清醒。你对秩序和效率有极高的要求，能一眼看清事物的本质，具备极强的逻辑美感。",
    water: "你是天生的智者，性格流动且富有变化。你拥有极高的智慧和适应力，能像水一样化解冲突，在无声中渗透并影响他人。"
  };

  return {
    title: "八字星册",
    intro: "基于东方古老的干支历法，揭示你的五行能量构成与本命特质。",
    yearPillar: user.yearPillar,
    monthPillar: user.monthPillar,
    dayPillar: user.dayPillar,
    hourPillar: user.hourPillar,
    dayMaster,
    dayElementLabel,
    analysis: baziAnalyses[dayElement] || "你拥有独特且平衡的五行能量。",
    distribution,
    distributionList: Object.keys(distribution).map((key) => ({
      label: key,
      value: distribution[key],
      barWidth: `${distribution[key] * 12 + 8}%`
    })),
    sourceText: `你的核心能量源于 ${user.dayPillar}，五行属${dayElementLabel}，这决定了你与生俱来的星灵气质。`
  };
}

function buildZiweiProfile(user) {
  const seed = stableHash(`${user.birthDate}-${user.birthTime}-${user.birthCity}-${user.dayPillar}`);
  const ziweiPalaceNames = ["命宫", "父母", "福德", "田宅", "兄弟", "官禄", "夫妻", "交友", "子女", "财帛", "疾厄", "迁移"];
  
  // 模拟紫微十二宫及其星耀
  const palaces = ziweiPalaceNames.map((name, i) => {
    const palaceSeed = (seed + i) % 12;
    const starCount = (seed % 2) + 1;
    const stars = [];
    for (let j = 0; j < starCount; j++) {
      stars.push(mainStarPool[(palaceSeed + j * 5) % mainStarPool.length]);
    }
    return {
      name: name + "宫",
      stars: stars.join(" · "),
      isLifePalace: name === "命宫"
    };
  });

  const mainStars = [
    mainStarPool[seed % mainStarPool.length],
    mainStarPool[(seed + 4) % mainStarPool.length]
  ];
  const keywords = [
    ziweiKeywordPool[seed % ziweiKeywordPool.length],
    ziweiKeywordPool[(seed + 2) % ziweiKeywordPool.length],
    ziweiKeywordPool[(seed + 5) % ziweiKeywordPool.length]
  ];

  const ziweiAnalyses = [
    "你的人格中隐藏着一股高贵的领袖气质，即便在安静时也能展现出不凡的影响力。",
    "你天生具备敏锐的洞察力，擅长在复杂的人际关系中找到平衡点，是天生的协调者。",
    "你追求极致的完美与秩序，在工作中表现得非常出色，但也需要学会放下偶尔的紧绷感。",
    "你内心深处藏着一个浪漫的梦想家，即便现实忙碌，你依然能保留一处属于自己的星光角落。"
  ];

  return {
    title: "紫微星图",
    intro: "结合紫微斗数的命宫与身宫布局，探索你生命轨迹中的核心动能。",
    lifePalace: "命宫在" + palacePool[seed % palacePool.length].replace("命宫在", ""),
    bodyPalace: bodyPalacePool[(seed + 3) % bodyPalacePool.length],
    mainStars,
    mainStarText: mainStars.join(" · "),
    analysis: ziweiAnalyses[seed % ziweiAnalyses.length],
    keywords: unique(keywords),
    palaces,
    reminder: "星图揭示的是潜能，而你是这些能量的主人。先把今天的情绪安顿好，再做决定。"
  };
}

function getSunSign(dateString) {
  const parts = String(dateString || "2000-01-01").split("-").map(Number);
  const md = parts[1] * 100 + parts[2];
  let selected = zodiacSigns[0];
  for (let i = 0; i < zodiacSigns.length; i += 1) {
    if (md >= zodiacSigns[i].start) selected = zodiacSigns[i];
  }
  return selected;
}

function countElements(signs) {
  return signs.reduce((acc, sign) => {
    acc[sign.element] = (acc[sign.element] || 0) + 1;
    return acc;
  }, { 火: 0, 土: 0, 风: 0, 水: 0 });
}

function countFiveElements(pillars) {
  const result = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  const stemLabelMap = Object.keys(stemElementMap).reduce((acc, stem) => {
    acc[stem] = elementConfig[stemElementMap[stem]].label;
    return acc;
  }, {});
  const branchElementMap = {
    子: "水",
    丑: "土",
    寅: "木",
    卯: "木",
    辰: "土",
    巳: "火",
    午: "火",
    未: "土",
    申: "金",
    酉: "金",
    戌: "土",
    亥: "水"
  };

  pillars.forEach((pillar) => {
    const stemLabel = stemLabelMap[pillar[0]];
    const branchLabel = branchElementMap[pillar[1]];
    if (stemLabel) result[stemLabel] += 1;
    if (branchLabel) result[branchLabel] += 1;
  });

  return result;
}

function unique(values) {
  return Array.from(new Set(values));
}

module.exports = {
  getNatalTraits,
  buildAstroProfile,
  buildBaZiArchive,
  buildZiweiProfile
};
