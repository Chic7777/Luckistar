# 每日星运 LuckiStar 抖音小程序

根据 v4 开发说明重构为抖音小程序结构，主 Tab 为：首页、星光广场、星灵图鉴。

## 核心闭环

输入昵称、出生日期、出生时间、出生地省/市 -> 真太阳时校正 -> 计算八字四柱与日柱 -> 召唤本命 LuckiStar -> 首页查看今日好运 -> 今日打卡与记录 -> 星光广场发布 -> 为他人点亮星星 -> 图鉴内解锁隐藏 LuckiStar。

## 主要目录

- `app.json`：小程序页面、窗口和 TabBar 配置
- `app.js` / `app.ttss`：全局入口与样式
- `pages/home`：本命性格特质、今日好运、今日好运符抽取、星运档案入口
- `pages/plaza`：小红书式双列星光广场与发布页
- `pages/gallery`：60 位日柱星灵图鉴与图鉴内解锁
- `pages/birth` / `pages/summon`：出生信息与召唤流程
- `pages/archive`：星盘小屋、八字星册、紫微星图
- `utils/bazi.js`：`calculateBaZiProfile()`，包含真太阳时、四柱和日柱计算
- `utils/archiveProfiles.js`：星盘 / 八字 / 紫微可替换档案数据
- `data/cities.js`：省市与经纬度数据
- `data/luckistars.js`：60 位 LuckiStar 占位数据
- `assets/tab-*.png`：三 Tab 发光图标

## 本地检查

```bash
node tests/bazi.test.js
```

项目可导入抖音小程序开发者工具预览。当前社区和图片能力为 mock + 本地缓存版本。
