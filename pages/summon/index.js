const { STORAGE_KEYS, getStorage, setStorage, removeStorage } = require("../../utils/storage");
const { calculateBaZiProfile } = require("../../utils/bazi");
const { getLuckiStarByDayPillar } = require("../../data/luckistars");

const phases = [
  "正在读取你的出生星运坐标……",
  "正在校正真太阳时……",
  "正在翻开八字星册里的日柱……",
  "你的本命 LuckiStar 醒来了。"
];

Page({
  data: {
    phaseIndex: 0,
    phaseText: phases[0],
    dots: [0, 1, 2, 3],
    star: null,
    baziProfile: null
  },

  onLoad() {
    const input = getStorage(STORAGE_KEYS.pendingBirthInput, null);
    if (!input) {
      tt.redirectTo({ url: "/pages/birth/index" });
      return;
    }

    const baziProfile = calculateBaZiProfile(input);
    const natalStar = getLuckiStarByDayPillar(baziProfile.dayPillar);
    this.setData({ baziProfile, star: natalStar });
    this.startSummon(input, baziProfile, natalStar);
  },

  onUnload() {
    if (this.timer) clearInterval(this.timer);
  },

  startSummon(input, baziProfile, natalStar) {
    this.timer = setInterval(() => {
      const nextIndex = this.data.phaseIndex + 1;

      if (nextIndex < phases.length) {
        this.setData({
          phaseIndex: nextIndex,
          phaseText: phases[nextIndex]
        });
        return;
      }

      clearInterval(this.timer);
      const now = new Date().toISOString();
      const userProfile = {
        id: `user-${Date.now()}`,
        nickname: input.nickname,
        birthDate: input.birthDate,
        birthTime: input.birthTime,
        birthProvince: input.birthProvince,
        birthCity: input.birthCity,
        longitude: baziProfile.longitude,
        latitude: baziProfile.latitude,
        trueSolarTime: baziProfile.trueSolarTime,
        isNearDayBoundary: baziProfile.isNearDayBoundary,
        yearPillar: baziProfile.yearPillar,
        monthPillar: baziProfile.monthPillar,
        dayPillar: baziProfile.dayPillar,
        hourPillar: baziProfile.hourPillar,
        natalLuckiStarId: natalStar.id,
        starFragments: 8,
        unlockedLuckiStarIds: [natalStar.id],
        completedDates: [],
        sharedDates: [],
        createdAt: now,
        updatedAt: now
      };
      setStorage(STORAGE_KEYS.userProfile, userProfile);
      removeStorage(STORAGE_KEYS.pendingBirthInput);
      tt.switchTab({ url: "/pages/home/index" });
    }, 900);
  }
});
