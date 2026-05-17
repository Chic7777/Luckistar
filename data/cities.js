const provinces = [
  { name: "北京市", cities: [{ name: "北京", longitude: 116.4074, latitude: 39.9042 }] },
  { name: "上海市", cities: [{ name: "上海", longitude: 121.4737, latitude: 31.2304 }] },
  { name: "天津市", cities: [{ name: "天津", longitude: 117.2, latitude: 39.1333 }] },
  { name: "重庆市", cities: [{ name: "重庆", longitude: 106.5516, latitude: 29.563 }] },
  {
    name: "广东省",
    cities: [
      { name: "广州", longitude: 113.2644, latitude: 23.1291 },
      { name: "深圳", longitude: 114.0579, latitude: 22.5431 },
      { name: "佛山", longitude: 113.1214, latitude: 23.0215 },
      { name: "东莞", longitude: 113.7518, latitude: 23.0207 },
      { name: "珠海", longitude: 113.5767, latitude: 22.2707 }
    ]
  },
  {
    name: "浙江省",
    cities: [
      { name: "杭州", longitude: 120.1551, latitude: 30.2741 },
      { name: "宁波", longitude: 121.5503, latitude: 29.8746 },
      { name: "温州", longitude: 120.6994, latitude: 27.9949 },
      { name: "嘉兴", longitude: 120.7555, latitude: 30.7461 }
    ]
  },
  {
    name: "江苏省",
    cities: [
      { name: "南京", longitude: 118.7969, latitude: 32.0603 },
      { name: "苏州", longitude: 120.5853, latitude: 31.2989 },
      { name: "无锡", longitude: 120.3119, latitude: 31.4912 },
      { name: "常州", longitude: 119.9741, latitude: 31.8112 }
    ]
  },
  {
    name: "四川省",
    cities: [
      { name: "成都", longitude: 104.0665, latitude: 30.5723 },
      { name: "绵阳", longitude: 104.6796, latitude: 31.4675 },
      { name: "宜宾", longitude: 104.6417, latitude: 28.7513 }
    ]
  },
  {
    name: "湖北省",
    cities: [
      { name: "武汉", longitude: 114.3054, latitude: 30.5931 },
      { name: "宜昌", longitude: 111.2865, latitude: 30.6919 },
      { name: "襄阳", longitude: 112.1224, latitude: 32.009 }
    ]
  },
  {
    name: "湖南省",
    cities: [
      { name: "长沙", longitude: 112.9388, latitude: 28.2282 },
      { name: "株洲", longitude: 113.1517, latitude: 27.8358 },
      { name: "岳阳", longitude: 113.1287, latitude: 29.3571 }
    ]
  },
  {
    name: "福建省",
    cities: [
      { name: "福州", longitude: 119.2965, latitude: 26.0745 },
      { name: "厦门", longitude: 118.0894, latitude: 24.4798 },
      { name: "泉州", longitude: 118.6757, latitude: 24.8741 }
    ]
  },
  {
    name: "山东省",
    cities: [
      { name: "济南", longitude: 117.1201, latitude: 36.6512 },
      { name: "青岛", longitude: 120.3826, latitude: 36.0671 },
      { name: "烟台", longitude: 121.4479, latitude: 37.4638 }
    ]
  },
  {
    name: "河南省",
    cities: [
      { name: "郑州", longitude: 113.6254, latitude: 34.7466 },
      { name: "洛阳", longitude: 112.454, latitude: 34.6197 },
      { name: "开封", longitude: 114.3076, latitude: 34.7972 }
    ]
  },
  {
    name: "陕西省",
    cities: [
      { name: "西安", longitude: 108.9398, latitude: 34.3416 },
      { name: "咸阳", longitude: 108.7088, latitude: 34.3296 },
      { name: "宝鸡", longitude: 107.2377, latitude: 34.3619 }
    ]
  },
  {
    name: "辽宁省",
    cities: [
      { name: "沈阳", longitude: 123.4315, latitude: 41.8057 },
      { name: "大连", longitude: 121.6147, latitude: 38.914 }
    ]
  },
  {
    name: "河北省",
    cities: [
      { name: "石家庄", longitude: 114.5149, latitude: 38.0428 },
      { name: "唐山", longitude: 118.1802, latitude: 39.6309 },
      { name: "秦皇岛", longitude: 119.6005, latitude: 39.9354 }
    ]
  },
  {
    name: "安徽省",
    cities: [
      { name: "合肥", longitude: 117.2272, latitude: 31.8206 },
      { name: "芜湖", longitude: 118.4331, latitude: 31.3525 }
    ]
  },
  {
    name: "云南省",
    cities: [
      { name: "昆明", longitude: 102.8329, latitude: 24.8801 },
      { name: "大理", longitude: 100.2676, latitude: 25.6065 }
    ]
  },
  {
    name: "广西壮族自治区",
    cities: [
      { name: "南宁", longitude: 108.3669, latitude: 22.817 },
      { name: "桂林", longitude: 110.29, latitude: 25.2736 }
    ]
  },
  {
    name: "香港特别行政区",
    cities: [{ name: "香港", longitude: 114.1694, latitude: 22.3193 }]
  },
  {
    name: "澳门特别行政区",
    cities: [{ name: "澳门", longitude: 113.5439, latitude: 22.1987 }]
  },
  {
    name: "台湾省",
    cities: [
      { name: "台北", longitude: 121.5654, latitude: 25.033 },
      { name: "高雄", longitude: 120.3014, latitude: 22.6273 }
    ]
  }
];

function getProvinceNames() {
  return provinces.map((province) => province.name);
}

function getCitiesByProvince(provinceName) {
  const province = provinces.find((item) => item.name === provinceName) || provinces[0];
  return province.cities;
}

function getCityNamesByProvince(provinceName) {
  return getCitiesByProvince(provinceName).map((city) => city.name);
}

function getCityLocation(provinceName, cityName) {
  const city = getCitiesByProvince(provinceName).find((item) => item.name === cityName);
  return city || getCitiesByProvince(provinceName)[0] || provinces[0].cities[0];
}

module.exports = {
  provinces,
  getProvinceNames,
  getCitiesByProvince,
  getCityNamesByProvince,
  getCityLocation
};
