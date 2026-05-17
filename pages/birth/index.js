const { getProvinceNames, getCityNamesByProvince, getCityLocation } = require("../../data/cities");
const { STORAGE_KEYS, setStorage } = require("../../utils/storage");

Page({
  data: {
    nickname: "",
    birthDate: "",
    birthTime: "",
    provinceOptions: [],
    cityOptions: [],
    provinceIndex: 4,
    cityIndex: 0
  },

  onLoad() {
    const provinceOptions = getProvinceNames();
    const selectedProvince = provinceOptions[this.data.provinceIndex] || provinceOptions[0];
    this.setData({
      provinceOptions,
      cityOptions: getCityNamesByProvince(selectedProvince)
    });
  },

  onNicknameInput(event) {
    this.setData({ nickname: event.detail.value });
  },

  onDateChange(event) {
    this.setData({ birthDate: event.detail.value });
  },

  onTimeChange(event) {
    this.setData({ birthTime: event.detail.value });
  },

  onProvinceChange(event) {
    const provinceIndex = Number(event.detail.value);
    const provinceName = this.data.provinceOptions[provinceIndex];
    this.setData({
      provinceIndex,
      cityIndex: 0,
      cityOptions: getCityNamesByProvince(provinceName)
    });
  },

  onCityChange(event) {
    this.setData({ cityIndex: Number(event.detail.value) });
  },

  onSubmit() {
    const nickname = this.data.nickname.trim();
    const birthProvince = this.data.provinceOptions[this.data.provinceIndex];
    const birthCity = this.data.cityOptions[this.data.cityIndex];

    if (!nickname || !this.data.birthDate || !this.data.birthTime || !birthProvince || !birthCity) {
      tt.showToast({ title: "请补完整星运坐标", icon: "none" });
      return;
    }

    const location = getCityLocation(birthProvince, birthCity);
    setStorage(STORAGE_KEYS.pendingBirthInput, {
      nickname,
      birthDate: this.data.birthDate,
      birthTime: this.data.birthTime,
      birthProvince,
      birthCity,
      longitude: location.longitude,
      latitude: location.latitude
    });

    tt.navigateTo({ url: "/pages/summon/index" });
  }
});
