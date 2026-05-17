const STORAGE_KEYS = {
  userProfile: "daily-star-user-profile-v4",
  dailyLuck: "daily-star-daily-luck-v4",
  plazaPosts: "daily-star-plaza-posts-v4",
  galleryState: "daily-star-gallery-state-v4",
  rewardState: "daily-star-reward-state-v4",
  charmDrawState: "daily-star-charm-draw-state-v4",
  taskChoiceState: "daily-star-task-choice-state-v4",
  pendingBirthInput: "daily-star-pending-birth-input-v4"
};

const memoryStore = {};

function hasTTStorage() {
  return typeof tt !== "undefined" && tt && typeof tt.getStorageSync === "function";
}

function hasLocalStorage() {
  return typeof localStorage !== "undefined";
}

function getStorage(key, fallback) {
  try {
    if (hasTTStorage()) {
      const value = tt.getStorageSync(key);
      return value === "" || value === undefined || value === null ? fallback : value;
    }
    if (hasLocalStorage()) {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    }
    return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : fallback;
  } catch (error) {
    return fallback;
  }
}

function setStorage(key, value) {
  if (hasTTStorage()) {
    tt.setStorageSync(key, value);
    return;
  }
  if (hasLocalStorage()) {
    localStorage.setItem(key, JSON.stringify(value));
    return;
  }
  memoryStore[key] = value;
}

function removeStorage(key) {
  if (hasTTStorage()) {
    tt.removeStorageSync(key);
    return;
  }
  if (hasLocalStorage()) {
    localStorage.removeItem(key);
    return;
  }
  delete memoryStore[key];
}

function normalizeUserProfile(profile) {
  if (!profile || typeof profile !== "object") return null;

  const natalLuckiStarId = profile.natalLuckiStarId || "";
  const unlockedLuckiStarIds = Array.isArray(profile.unlockedLuckiStarIds)
    ? profile.unlockedLuckiStarIds.filter(Boolean)
    : [];

  if (natalLuckiStarId && unlockedLuckiStarIds.indexOf(natalLuckiStarId) < 0) {
    unlockedLuckiStarIds.unshift(natalLuckiStarId);
  }

  return {
    ...profile,
    nickname: profile.nickname || "星运旅人",
    natalLuckiStarId,
    birthProvince: profile.birthProvince || "",
    birthCity: profile.birthCity || "",
    trueSolarTime: profile.trueSolarTime || "",
    yearPillar: profile.yearPillar || "",
    monthPillar: profile.monthPillar || "",
    dayPillar: profile.dayPillar || "",
    hourPillar: profile.hourPillar || "",
    longitude: Number.isFinite(Number(profile.longitude)) ? Number(profile.longitude) : 0,
    latitude: Number.isFinite(Number(profile.latitude)) ? Number(profile.latitude) : 0,
    starFragments: Number.isFinite(Number(profile.starFragments)) ? Number(profile.starFragments) : 100,
    unlockedLuckiStarIds: Array.from(new Set(unlockedLuckiStarIds)),
    completedDates: Array.isArray(profile.completedDates) ? profile.completedDates : [],
    sharedDates: Array.isArray(profile.sharedDates) ? profile.sharedDates : []
  };
}

function todayString(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  const parts = formatter.formatToParts(date);
  const map = {};
  parts.forEach((part) => {
    map[part.type] = part.value;
  });
  return `${map.year}-${map.month}-${map.day}`;
}

function formatDateLabel(dateString) {
  const parts = String(dateString).split("-");
  return `${parts[0]}年${parts[1]}月${parts[2]}日`;
}

module.exports = {
  STORAGE_KEYS,
  getStorage,
  setStorage,
  removeStorage,
  normalizeUserProfile,
  todayString,
  formatDateLabel
};
