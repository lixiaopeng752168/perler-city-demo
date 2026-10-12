// 用户提供的分级；已应用原文中的明确更正，佛山后的“第一财经”为来源标记。
const TIER_VERSION='user-city-tiers-v2-higher';
const USER_TIERS={
 '一线':'上海 北京 深圳 广州',
 '新一线':'成都 杭州 重庆 武汉 苏州 西安 南京 长沙 郑州 天津 合肥 青岛 东莞 宁波 佛山',
 '二线':'济南 无锡 沈阳 昆明 福州 厦门 温州 石家庄 大连 哈尔滨 金华 泉州 南宁 长春 常州 南昌 南通 贵阳 嘉兴 徐州 惠州 太原 烟台 临沂 保定 台州 绍兴 珠海 洛阳 潍坊',
 '三线':'乌鲁木齐 兰州 中山 盐城 海口 扬州 济宁 湖州 赣州 邯郸 南阳 唐山 芜湖 阜阳 廊坊 汕头 泰州 呼和浩特 镇江 江门 菏泽 连云港 沧州 淄博 新乡 周口 襄阳 淮安 商丘 桂林 咸阳 上饶 银川 宿迁 漳州 遵义 滁州 绵阳 宜昌 威海 湛江 九江 邢台 揭阳 三亚 衡阳 信阳 泰安 荆州 肇庆 蚌埠 安阳 安庆 德州 株洲 莆田 聊城 驻马店 岳阳 亳州 柳州 宜春 宿州 黄冈 六安 常德 宁德 茂名 马鞍山 衢州',
 '四线':'枣庄 吉安 宣城 鞍山 晋中 舟山 十堰 长治 临汾 乐山 河源 三明 淮北 铜仁 喀什 遂宁 宜宾 日照 淮南 濮阳 许昌 平顶山 曲靖 衡水 潮州 梅州 恩施 毕节 眉山 咸宁 拉萨 开封 包头 东营 孝感 吉林 白城 庆阳 榆林 松原 大庆 永州 邵阳 郴州 抚州 宝鸡 渭南 黄石 丽水 秦皇岛 清远 运城 南阳 张家界 大同 张家口 达州 泸州 黄山 红河 北海 韶关 六盘水 承德 铜陵 荆门 黔南 百色 天水 吕梁 营口 锦州 辽阳 铁岭 朝阳 葫芦岛 本溪 丹东 通化 白山 四平 辽源',
 '五线':'忻州 盘锦 伊犁 丹东 延边 酒泉 阿克苏 梧州 牡丹江 池州 葫芦岛 佳木斯 通化 朝阳 六盘水 延安 内江 自贡 漯河 西双版纳 云浮 黔西南 张家界 昭通 丽江 贵港 嘉峪关 萍乡 文山 通辽 辽阳 抚顺 鹰潭 鹤壁 白银 呼伦贝尔 鄂尔多斯 定西 庆阳 阜新 广安 广元 三门峡 楚雄 贺州 百色 保山 德宏 松原 克拉玛依 阳泉 商洛 朔州 安康 资阳 四平 金昌 平凉 商洛 防城港 甘南 白山 乌兰察布 临夏 吴忠 辽源 来宾 武威 海西 乌海 锡林郭勒 哈密 崇左 儋州 临沧 文山 白城 双鸭山 鸡西 七台河 石嘴山 巴彦淖尔 铜川 阿坝 兴安 中卫 乌海 伊春 博尔塔拉 阿勒泰 黑河 大兴安岭 鹤岗 固原 图木舒克 吐鲁番 山南 克孜勒苏 阿里 那曲 海南 黄南 果洛 玉树 三沙'
};
const CITY_ALIASES={'喀什':'喀什地区','恩施':'恩施土家族苗族自治州','红河':'红河哈尼族彝族自治州','黔南':'黔南布依族苗族自治州','伊犁':'伊犁哈萨克自治州','延边':'延边朝鲜族自治州','阿克苏':'阿克苏地区','西双版纳':'西双版纳傣族自治州','黔西南':'黔西南布依族苗族自治州','文山':'文山壮族苗族自治州','楚雄':'楚雄彝族自治州','德宏':'德宏傣族景颇族自治州','甘南':'甘南藏族自治州','临夏':'临夏回族自治州','海西':'海西蒙古族藏族自治州','锡林郭勒':'锡林郭勒盟','阿坝':'阿坝藏族羌族自治州','兴安':'兴安盟','博尔塔拉':'博尔塔拉蒙古自治州','阿勒泰':'阿勒泰地区','大兴安岭':'大兴安岭地区','克孜勒苏':'克孜勒苏柯尔克孜自治州','阿里':'阿里地区','海南':'海南藏族自治州','黄南':'黄南藏族自治州','果洛':'果洛藏族自治州','玉树':'玉树藏族自治州'};
// 用户已确认：跨级重复保留较高等级；候选等级仍保留供核对。
const CONFLICT_POLICY='higher';
function tierAudit(){const memberships=new Map(),summary=[];for(const[level,text]of Object.entries(USER_TIERS)){const raw=text.split(' '),names=[...new Set(raw.map(n=>CITY_ALIASES[n]||n))];summary.push({level,raw:raw.length,unique:names.length,duplicates:raw.length-names.length});names.forEach((name,rank)=>{const item={level,rank:rank+1};memberships.set(name,[...(memberships.get(name)||[]),item])});}return {summary,memberships,conflicts:[...memberships].filter(([,a])=>a.length>1).map(([name,candidates])=>({name,candidates}))}}
function applyUserTiers(cities){const audit=tierAudit();return cities.map(c=>{const candidates=audit.memberships.get(c.name)||[],conflict=candidates.length>1&&CONFLICT_POLICY==='pending',pick=CONFLICT_POLICY==='lower'?candidates.at(-1):candidates[0];return {...c,level:conflict?'未分级':pick?.level||'未分级',tierRank:conflict?null:pick?.rank||null,tierSource:candidates.length?'用户提供':'未列入名单',levelConflict:conflict,candidateLevels:candidates.map(x=>x.level),custom:false}}).sort((a,b)=>LEVELS.indexOf(a.level)-LEVELS.indexOf(b.level)||(a.tierRank??10000)-(b.tierRank??10000)||a.province.localeCompare(b.province,'zh-CN')||a.name.localeCompare(b.name,'zh-CN'))}
