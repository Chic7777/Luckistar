const assert = require("assert");
const { calculateBaZiProfile, getDayPillar } = require("../utils/bazi");

assert.strictEqual(getDayPillar(2019, 1, 27), "甲子");

const beijingProfile = calculateBaZiProfile({
  birthDate: "2019-01-27",
  birthTime: "12:00",
  birthProvince: "北京市",
  birthCity: "北京"
});
assert.strictEqual(beijingProfile.dayPillar, "甲子");
assert.strictEqual(beijingProfile.trueSolarTime, "2019-01-27 11:46");

const boundaryProfile = calculateBaZiProfile({
  birthDate: "2019-01-27",
  birthTime: "23:30",
  birthProvince: "上海市",
  birthCity: "上海"
});
assert.strictEqual(boundaryProfile.dayPillar, "乙丑");
assert.strictEqual(boundaryProfile.isNearDayBoundary, true);

console.log("BaZi tests passed");
