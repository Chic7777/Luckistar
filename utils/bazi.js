const { dayPillars, heavenlyStems, earthlyBranches } = require("../data/luckistars");
const { getCityLocation } = require("../data/cities");

const monthBranches = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"];
const firstMonthStemIndexByYearStem = {
  甲: 2,
  己: 2,
  乙: 4,
  庚: 4,
  丙: 6,
  辛: 6,
  丁: 8,
  壬: 8,
  戊: 0,
  癸: 0
};
const firstHourStemIndexByDayStem = {
  甲: 0,
  己: 0,
  乙: 2,
  庚: 2,
  丙: 4,
  辛: 4,
  丁: 6,
  壬: 6,
  戊: 8,
  癸: 8
};

function calculateBaZiProfile(input) {
  const city = getCityLocation(input.birthProvince, input.birthCity);
  const localParts = parseDateTime(input.birthDate, input.birthTime);
  const trueSolar = getTrueSolarDateTime(localParts, city.longitude);
  const baziDayDate = getBaZiDayDate(trueSolar);
  const solarYear = getSolarYear(trueSolar);
  const yearPillar = getYearPillar(solarYear);
  const monthPillar = getMonthPillar(solarYear, trueSolar.month, trueSolar.day);
  const dayPillar = getDayPillar(baziDayDate.year, baziDayDate.month, baziDayDate.day);
  const hourPillar = getHourPillar(dayPillar[0], trueSolar.minutesOfDay);

  return {
    solarDate: input.birthDate,
    birthTime: input.birthTime,
    birthProvince: input.birthProvince,
    birthCity: input.birthCity,
    longitude: city.longitude,
    latitude: city.latitude,
    trueSolarTime: formatDateTime(trueSolar),
    isNearDayBoundary: isNearDayBoundary(localParts.minutesOfDay, trueSolar.minutesOfDay),
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar
  };
}

function parseDateTime(dateString, timeString) {
  const dateParts = String(dateString).split("-").map(Number);
  const timeParts = String(timeString).split(":").map(Number);
  const hour = timeParts[0] || 0;
  const minute = timeParts[1] || 0;
  return {
    year: dateParts[0],
    month: dateParts[1],
    day: dateParts[2],
    hour,
    minute,
    minutesOfDay: hour * 60 + minute
  };
}

function getTrueSolarDateTime(localParts, longitude) {
  const offsetMinutes = Math.round((longitude - 120) * 4);
  let trueMinutes = localParts.minutesOfDay + offsetMinutes;
  const dayOffset = Math.floor(trueMinutes / 1440);
  trueMinutes = mod(trueMinutes, 1440);
  const shiftedDate = addDays(localParts.year, localParts.month, localParts.day, dayOffset);

  return {
    ...shiftedDate,
    hour: Math.floor(trueMinutes / 60),
    minute: trueMinutes % 60,
    minutesOfDay: trueMinutes,
    longitudeOffsetMinutes: offsetMinutes
  };
}

function getBaZiDayDate(trueSolar) {
  if (trueSolar.minutesOfDay >= 23 * 60) {
    return addDays(trueSolar.year, trueSolar.month, trueSolar.day, 1);
  }
  return {
    year: trueSolar.year,
    month: trueSolar.month,
    day: trueSolar.day
  };
}

function getSolarYear(trueSolar) {
  if (trueSolar.month < 2) return trueSolar.year - 1;
  if (trueSolar.month === 2 && trueSolar.day < 4) return trueSolar.year - 1;
  return trueSolar.year;
}

function getYearPillar(solarYear) {
  const index = mod(solarYear - 1984, 60);
  return dayPillars[index];
}

function getMonthPillar(solarYear, month, day) {
  const yearStem = getYearPillar(solarYear)[0];
  const monthIndex = getSolarMonthIndex(month, day);
  const firstStemIndex = firstMonthStemIndexByYearStem[yearStem];
  const stem = heavenlyStems[mod(firstStemIndex + monthIndex, 10)];
  return `${stem}${monthBranches[monthIndex]}`;
}

function getSolarMonthIndex(month, day) {
  const md = month * 100 + day;
  if (md >= 204 && md < 306) return 0;
  if (md >= 306 && md < 405) return 1;
  if (md >= 405 && md < 506) return 2;
  if (md >= 506 && md < 606) return 3;
  if (md >= 606 && md < 707) return 4;
  if (md >= 707 && md < 808) return 5;
  if (md >= 808 && md < 908) return 6;
  if (md >= 908 && md < 1008) return 7;
  if (md >= 1008 && md < 1107) return 8;
  if (md >= 1107 && md < 1207) return 9;
  if (md >= 1207 || md < 106) return 10;
  return 11;
}

function getDayPillar(year, month, day) {
  const jdn = gregorianToJdn(year, month, day);
  const cycleNumber = 1 + mod(jdn - 11, 60);
  return dayPillars[cycleNumber - 1];
}

function getHourPillar(dayStem, minutesOfDay) {
  const branchIndex = getHourBranchIndex(minutesOfDay);
  const stemIndex = mod(firstHourStemIndexByDayStem[dayStem] + branchIndex, 10);
  return `${heavenlyStems[stemIndex]}${earthlyBranches[branchIndex]}`;
}

function getHourBranchIndex(minutesOfDay) {
  if (minutesOfDay >= 23 * 60 || minutesOfDay < 60) return 0;
  return Math.floor((minutesOfDay + 60) / 120);
}

function gregorianToJdn(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function addDays(year, month, day, offset) {
  const date = new Date(Date.UTC(year, month - 1, day + offset));
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate()
  };
}

function formatDateTime(parts) {
  return `${parts.year}-${pad2(parts.month)}-${pad2(parts.day)} ${pad2(parts.hour)}:${pad2(parts.minute)}`;
}

function isNearDayBoundary(localMinutes, trueSolarMinutes) {
  return [localMinutes, trueSolarMinutes].some((minutes) => minutes < 60 || minutes >= 23 * 60);
}

function mod(value, base) {
  return ((value % base) + base) % base;
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

module.exports = {
  calculateBaZiProfile,
  getDayPillar,
  gregorianToJdn,
  getTrueSolarDateTime
};
