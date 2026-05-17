const { STORAGE_KEYS, getStorage, setStorage } = require("./storage");
const { luckiStars } = require("../data/luckistars");
const { charmPool, stableHash } = require("./dailyLuck");

function pickOne(pool, seed) {
  return pool[seed % pool.length];
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

function buildSeedPosts(count, seedBase) {
  const nicknames = [
    "小满",
    "云间",
    "阿灯",
    "晴野",
    "南栀",
    "雾岛",
    "星屿",
    "松风",
    "阿久",
    "白桃",
    "月见",
    "鹤川",
    "桃枝",
    "小澈",
    "青柠",
    "椰子",
    "雨眠",
    "澄澈"
  ];

  const titlePool = [
    "晒太阳后，心真的轻了一点",
    "把拖了很久的邮件发出去了",
    "认真吃饭也是一种好运",
    "抽到星签后，我先把桌面整理了",
    "今天的幸运穿搭让我整个人都变轻了",
    "星盘小感悟：今天适合慢慢来",
    "写下 3 个待办，只做第 1 个就好",
    "把手机放远一点，情绪居然稳定了",
    "在路口等红灯的时候突然想到答案",
    "对一个不必要的请求说了不",
    "给朋友发了句真诚问候，收到了回应",
    "把一件事拆成 3 步，终于不怕了",
    "今天的幸运食物救了我一下",
    "紫微里看到的提醒：先安顿情绪",
    "八字小发现：原来我更适合长期积累",
    "整理包里一个角落，心也跟着清爽",
    "听完一首歌，突然不那么着急了",
    "发呆 5 分钟，压力就松开了一点"
  ];

  const contentPool = [
    "今天没想做很大件事，就把最小那一步做完了，心就稳了。",
    "有点累，但我还是给自己留了喘息，感觉好运会慢慢来。",
    "我以为要很用力，结果只是把节奏放慢一点就好了。",
    "原来被自己照顾到的瞬间，就是一种小幸运。",
    "把该删的删掉，把该留的留着，世界忽然清楚了。",
    "今天不追求满分，只求把事情做小、做完。",
    "我没再反复确认别人的想法，先把注意力收回来了。",
    "我以为我不行，其实我只是需要先休息一下。",
    "好运不是突然发生，是我终于开始愿意靠近自己。",
    "把一个卡住的地方松开之后，整个人都轻了。"
  ];

  const visualPool = [
    "visual-sun",
    "visual-moon",
    "visual-flower",
    "visual-card",
    "visual-wardrobe",
    "visual-cosmos",
    "visual-star"
  ];

  const baseSeed = stableHash(String(seedBase || "plaza-seed-v2"));
  const rand = seededRandom(baseSeed);
  const now = Date.now();

  const posts = [];
  for (let i = 0; i < count; i += 1) {
    const star = luckiStars[Math.floor(rand() * luckiStars.length)];
    const charm = pickOne(charmPool, baseSeed + i * 17);
    const title = pickOne(titlePool, baseSeed + i * 7);
    const content = pickOne(contentPool, baseSeed + i * 11);
    const createdAt = new Date(now - (i * 9 + Math.floor(rand() * 11)) * 60 * 60 * 1000 - Math.floor(rand() * 50) * 60 * 1000).toISOString();
    const stars = 3 + Math.floor(rand() * 58);

    posts.push({
      id: `mock-plaza-${i + 1}`,
      userId: "mock",
      nickname: pickOne(nicknames, baseSeed + i * 3),
      natalLuckiStarId: star.id,
      dayPillar: star.dayPillar,
      title,
      content,
      images: [],
      visualClass: pickOne(visualPool, baseSeed + i * 5),
      charm: { id: charm.id, name: charm.name, message: charm.message },
      stars,
      createdAt
    });
  }

  return posts;
}

const mockPosts = buildSeedPosts(36, "plaza-seed-v2");

function normalizePost(post) {
  const charm = post && post.charm && post.charm.name
    ? post.charm
    : { id: "legacy-charm", name: "今日好运", message: (post && post.content) || "" };

  return {
    ...post,
    id: post.id || `legacy-${Date.now()}`,
    nickname: post.nickname || "星运旅人",
    natalLuckiStarId: post.natalLuckiStarId || "",
    dayPillar: post.dayPillar || "",
    title: post.title || "今天的小幸运",
    content: post.content || "",
    images: Array.isArray(post.images) ? post.images : [],
    visualClass: post.visualClass || "visual-star",
    charm,
    stars: Number.isFinite(Number(post.stars)) ? Number(post.stars) : 0,
    createdAt: post.createdAt || new Date().toISOString()
  };
}

function getPlazaPosts() {
  const rawLocalPosts = getStorage(STORAGE_KEYS.plazaPosts, []);
  const localPosts = rawLocalPosts.map(normalizePost);
  if (localPosts.length >= 24) return localPosts;

  const existingIds = new Set(localPosts.map((post) => post.id));
  const merged = [
    ...localPosts,
    ...mockPosts.filter((post) => !existingIds.has(post.id)).map(normalizePost)
  ].slice(0, 60);
  setStorage(STORAGE_KEYS.plazaPosts, merged);
  return merged.map(normalizePost);
}

function prependPlazaPost(post) {
  const localPosts = getStorage(STORAGE_KEYS.plazaPosts, []);
  setStorage(STORAGE_KEYS.plazaPosts, [normalizePost(post), ...localPosts.map(normalizePost)].slice(0, 60));
}

function updatePostStars(postId, delta) {
  const localPosts = getStorage(STORAGE_KEYS.plazaPosts, []);
  const nextPosts = localPosts.map((post) => {
    const normalized = normalizePost(post);
    return normalized.id === postId ? { ...normalized, stars: normalized.stars + delta } : normalized;
  });
  setStorage(STORAGE_KEYS.plazaPosts, nextPosts);
}

module.exports = {
  mockPosts,
  getPlazaPosts,
  prependPlazaPost,
  updatePostStars
};
