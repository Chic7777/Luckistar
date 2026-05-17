const { luckiStars } = require("../data/luckistars");
const { STORAGE_KEYS, getStorage, setStorage } = require("./storage");

const DAILY_LUCK_VERSION = 2;

const taskPool = [
  { id: "sun", title: "晒太阳 5 分钟", desc: "给身体一点光，心也会松一点。" },
  { id: "desk", title: "整理桌面 3 分钟", desc: "让好运有地方落脚。" },
  { id: "drink", title: "给自己买一杯喜欢的饮品", desc: "把今天照顾得柔软一点。" },
  { id: "meal", title: "认真吃一顿饭", desc: "不要边刷手机边吃。" },
  { id: "thanks", title: "睡前写下一件感谢自己的事", desc: "让今天温柔收尾。" },
  { id: "gentle", title: "今天少责备自己一次", desc: "先把锋利收回来。" },
  { id: "finish", title: "完成一件拖延小事", desc: "一点点推进，也算前进。" },
  { id: "hello", title: "给朋友发一句真诚问候", desc: "好运有时从连接里来。" },
  { id: "water", title: "喝完一杯温水", desc: "把身体的节奏慢慢调回来。" },
  { id: "walk", title: "散步 12 分钟", desc: "走一走，脑子会更清楚。" },
  { id: "stretch", title: "拉伸 3 分钟", desc: "把紧绷从肩颈放掉一点。" },
  { id: "music", title: "听 1 首歌不刷手机", desc: "让心回到当下。" },
  { id: "note", title: "写下 3 个待办只做第 1 个", desc: "先把入口找出来。" },
  { id: "clean", title: "清理一个聊天群的免打扰", desc: "把注意力还给自己。" },
  { id: "reply", title: "回复一条你拖着没回的消息", desc: "把卡住的地方松开。" },
  { id: "photo", title: "拍一张你觉得好看的光", desc: "记录今天的星光证据。" },
  { id: "breathe", title: "做 10 次慢呼吸", desc: "用呼吸把情绪放回身体里。" },
  { id: "tidybag", title: "整理包里一个角落", desc: "小秩序会带来安全感。" },
  { id: "list", title: "列一个“今天不用做”的清单", desc: "学会删减，就是自救。" },
  { id: "plan", title: "把一件事拆成 3 步", desc: "不必一次到位，先走第一步。" },
  { id: "focus", title: "专注 25 分钟完成一小块", desc: "把开始交给计时器。" },
  { id: "gratitude", title: "对自己说一句真诚的夸奖", desc: "你已经很努力了。" },
  { id: "snack", title: "吃一份让你安心的小零食", desc: "先把心安顿好再继续。" },
  { id: "shower", title: "洗个热澡或泡脚 10 分钟", desc: "让疲惫有地方融化。" },
  { id: "no", title: "对一个不必要的请求说不", desc: "边界会让你更有力。" },
  { id: "save", title: "存下 10 元到“星光基金”", desc: "为未来的你留一点底气。" },
  { id: "read", title: "读 2 页书/文章", desc: "给脑子一点干净输入。" },
  { id: "early", title: "今天提前 20 分钟睡", desc: "真正的好运来自恢复。" },
  { id: "cleanone", title: "丢掉 1 个不再用的东西", desc: "空出来的地方会有新东西进来。" },
  { id: "compliment", title: "夸一个人一个具体细节", desc: "温柔会被回收成好运。" },
  { id: "pause", title: "给自己 5 分钟发呆", desc: "不做事也可以很有用。" }
];

const charmPool = [
  { id: "clarity", name: "清醒星签", message: "今天适合把混乱整理成秩序。", advice: "先理清一件小事，整天都会顺一点。" },
  { id: "anti-overthinking", name: "防内耗符", message: "把注意力收回自己，今天少一点反复确认。", advice: "先照顾自己，再想别人怎么想你。" },
  { id: "helper", name: "贵人符", message: "可以主动表达一个小需求，也许会有人愿意帮你一把。", advice: "今天适合求助，不必凡事自己扛。" },
  { id: "inspiration", name: "灵感符", message: "把突然冒出来的小想法记下来，它可能比你想象中重要。", advice: "灵感先记下来，别急着立刻做到满分。" },
  { id: "sleep", name: "好眠符", message: "今晚适合早点放下手机，让身体先替你恢复能量。", advice: "早点收尾，会比继续硬撑更有用。" },
  { id: "love", name: "被爱符", message: "你不需要表现得很厉害，也值得被温柔对待。", advice: "今天别急着证明，先允许自己被喜欢。" },
  { id: "boundary", name: "边界星签", message: "今天适合把“应该”换成“我愿意”。", advice: "少一点解释，多一点选择。" },
  { id: "restart", name: "重启符", message: "如果卡住了，就从最小的动作开始。", advice: "先动一下，后面会自己滚起来。" },
  { id: "soft", name: "柔软符", message: "今天适合温柔一点，但不要退让到委屈。", advice: "温柔和边界可以同时存在。" },
  { id: "focus", name: "专注星签", message: "今天适合把注意力放在一件事上。", advice: "别同时开十个窗口，关掉两个就赢了。" },
  { id: "luck", name: "小幸运符", message: "今天的好运藏在细节里。", advice: "留意一句话、一个路口、一个突然的灵感。" },
  { id: "courage", name: "勇气符", message: "今天适合做一次小小的主动。", advice: "不需要完美，只要先迈出一步。" },
  { id: "clean", name: "断舍离星签", message: "今天适合清理一个“消耗你的东西”。", advice: "删掉一个不必要的任务或情绪负担。" },
  { id: "gentle-talk", name: "好好说话符", message: "今天适合把想法说清楚，而不是憋着。", advice: "一句话讲重点，关系会更轻松。" },
  { id: "repair", name: "修复符", message: "今天适合把一个小裂缝补起来。", advice: "道歉、解释、修正都可以很温柔。" },
  { id: "safety", name: "安全感星签", message: "今天适合把自己放在第一顺位。", advice: "先吃饭、先休息、先把心安顿好。" },
  { id: "money", name: "财运符", message: "今天适合做一次小小的财务整理。", advice: "记一笔账、清一笔订阅，都是好运入口。" },
  { id: "opportunity", name: "机会符", message: "今天可能会出现一个值得试试的新口子。", advice: "别急着否定，先允许自己探索。" },
  { id: "thanks", name: "感恩符", message: "今天适合把好事说出来。", advice: "感谢自己，也感谢一个具体的人。" },
  { id: "pause", name: "暂停星签", message: "今天适合不急着做决定。", advice: "先睡一觉，答案会更清楚。" }
];

const luckyPools = {
  keywords: [
    "慢慢发光",
    "好运发芽",
    "减少内耗",
    "适合整理",
    "轻轻向前",
    "灵感回流",
    "情绪稳定",
    "被爱包围",
    "清爽开局",
    "把心收回来",
    "边界更清晰",
    "先做再优化",
    "告别纠结",
    "好运在路上",
    "安静有力量",
    "适合沟通",
    "适合行动",
    "适合复盘",
    "适合断舍离",
    "贵人出现",
    "轻装上阵",
    "把事做小",
    "先照顾身体",
    "好运靠近你",
    "慢一点更稳",
    "把标准放下",
    "更敢表达",
    "更会拒绝",
    "心变轻了",
    "把节奏找回"
  ],
  luckyColor: [
    "雾蓝",
    "月白",
    "浅绿",
    "星光黄",
    "淡粉",
    "银蓝",
    "奶油白",
    "灰紫",
    "海盐蓝",
    "薄荷绿",
    "杏仁白",
    "雾玫瑰",
    "香槟金",
    "浅卡其",
    "云朵灰",
    "深海蓝",
    "可可棕",
    "极光紫",
    "暖砂橙",
    "青柠绿"
  ],
  luckyTime: [
    "07:30-08:30",
    "08:00-09:00",
    "09:30-10:15",
    "10:30-11:30",
    "11:50-12:20",
    "12:40-13:20",
    "13:00-14:00",
    "14:20-15:10",
    "15:30-16:10",
    "16:00-17:00",
    "17:20-18:00",
    "18:40-19:20",
    "19:30-20:10",
    "20:00-21:00",
    "21:10-21:50",
    "22:10-22:40"
  ],
  luckyDirection: ["向东", "向东南", "向南", "向西南", "向西", "向西北", "向北", "向东北", "靠近有光的地方", "靠近水边/喷泉附近"],
  luckyPlace: [
    "窗边",
    "书桌旁",
    "便利店",
    "公园小路",
    "安静的角落",
    "电梯口的转角",
    "咖啡店靠窗位",
    "家里的玄关",
    "阳台",
    "楼下小广场",
    "书店",
    "地铁站出口",
    "小巷子",
    "公司茶水间",
    "楼梯间",
    "靠近树的地方",
    "路口红绿灯旁",
    "熟悉的餐馆",
    "新的街区",
    "光线好的走廊"
  ],
  luckyFood: [
    "热汤",
    "米饭",
    "甜橙",
    "温牛奶",
    "喜欢的饮品",
    "清爽沙拉",
    "烤红薯",
    "热豆浆",
    "面条",
    "酸奶",
    "小蛋糕",
    "坚果",
    "香蕉",
    "抹茶",
    "黑巧",
    "番茄",
    "鸡蛋",
    "海苔饭团",
    "热粥",
    "柠檬水"
  ],
  luckyFlower: [
    "洋甘菊",
    "小雏菊",
    "满天星",
    "白玫瑰",
    "向日葵",
    "铃兰",
    "郁金香",
    "茉莉",
    "栀子",
    "绣球",
    "薰衣草",
    "风信子",
    "鸢尾",
    "百合",
    "康乃馨",
    "桂花",
    "海棠",
    "桃花",
    "山茶",
    "勿忘我"
  ],
  luckyAccessory: [
    "银色小物",
    "柔软围巾",
    "浅色发夹",
    "干净帆布包",
    "一支顺手的笔",
    "细戒指",
    "珍珠耳钉",
    "浅色袜子",
    "香氛喷雾",
    "发绳",
    "小钥匙扣",
    "手链",
    "简洁项链",
    "有质感的手机壳",
    "墨镜",
    "护手霜",
    "耳机",
    "小镜子",
    "书签",
    "便携充电宝"
  ],
  luckyObject: [
    "便签纸",
    "水杯",
    "耳机",
    "钥匙",
    "一盏小灯",
    "雨伞",
    "充电线",
    "口香糖",
    "小本子",
    "头绳",
    "手帕纸",
    "薄荷糖",
    "小梳子",
    "暖宝宝",
    "折叠袋",
    "卡套",
    "笔",
    "鼠标垫",
    "香薰片",
    "贴纸"
  ],
  reminder: [
    "今天更适合慢慢来，不必急着证明自己。",
    "可以先照顾好自己，再去面对世界。",
    "好运不是突然降临，而是你开始愿意靠近自己。",
    "把注意力收回自己，能量就会慢慢回来。",
    "这是一个温柔提醒，不必过度解读。",
    "你不需要一次做到满分，先做到就已经很棒。",
    "今天适合把“应该”放低一点，把“愿意”放前面。",
    "别把别人的情绪当成你的作业。",
    "当你犹豫时，就先做最小那一步。",
    "把手机放远一点，你会更轻松。"
  ],
  status: [
    "好运正在发芽",
    "小宇宙正在充电",
    "今日适合温柔前进",
    "心正在变轻",
    "灵感正在冒泡",
    "能量正在回流",
    "你正在变得更稳",
    "别急，顺着走",
    "小幸运在靠近",
    "今天适合开个好头"
  ]
};

function getDailyLuck(userProfile, date) {
  const cache = getStorage(STORAGE_KEYS.dailyLuck, {});
  const cacheKey = `${userProfile.id}-${date}-v${DAILY_LUCK_VERSION}`;
  if (cache[cacheKey]) return cache[cacheKey];

  const seed = stableHash(`${userProfile.id}-${userProfile.dayPillar}-${userProfile.natalLuckiStarId}-${date}`);
  const dailyLuck = {
    date,
    task: pickOne(taskPool, seed + 1).title,
    tasks: pickMany(taskPool, seed + 1, 4),
    charm: pickOne(charmPool, seed + 2),
    keyword: pickOne(luckyPools.keywords, seed + 14),
    luckyColor: pickOne(luckyPools.luckyColor, seed + 3),
    luckyTime: pickOne(luckyPools.luckyTime, seed + 4),
    luckyDirection: pickOne(luckyPools.luckyDirection, seed + 5),
    luckyPlace: pickOne(luckyPools.luckyPlace, seed + 6),
    luckyFood: pickOne(luckyPools.luckyFood, seed + 7),
    luckyFlower: pickOne(luckyPools.luckyFlower, seed + 8),
    luckyAccessory: pickOne(luckyPools.luckyAccessory, seed + 9),
    luckyObject: pickOne(luckyPools.luckyObject, seed + 10),
    reminder: pickOne(luckyPools.reminder, seed + 11),
    status: pickOne(luckyPools.status, seed + 12),
    encounterLuckiStarId: pickEncounterLuckiStar(userProfile, seed + 13)
  };

  cache[cacheKey] = dailyLuck;
  setStorage(STORAGE_KEYS.dailyLuck, cache);
  return dailyLuck;
}

function pickEncounterLuckiStar(userProfile, seed) {
  const candidates = luckiStars.filter((star) => star.id !== userProfile.natalLuckiStarId);
  return candidates[seed % candidates.length].id;
}

function stableHash(value) {
  let h = 0;
  const str = String(value);
  for (let i = 0; i < str.length; i += 1) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

function pickOne(pool, seed) {
  return pool[seed % pool.length];
}

function pickMany(pool, seed, count) {
  const copied = pool.slice();
  const rand = seededRandom(seed);
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    const temp = copied[i];
    copied[i] = copied[j];
    copied[j] = temp;
  }
  return copied.slice(0, Math.min(count, copied.length));
}

function seededRandom(seed) {
  let t = seed >>> 0;
  return function next() {
    t += 0x6D2B79F5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

module.exports = {
  getDailyLuck,
  stableHash,
  charmPool
};
