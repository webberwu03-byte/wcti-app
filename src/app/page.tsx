'use client';

import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import styles from './page.module.css';

// 16种人格，每题直接对应一个人格代码
// 16 questions × 4 options = 64 total mappings
// Each personality code appears exactly 16 times (once per question)

const questions = [
  { q: "世界杯揭幕战，你会怎么获取资讯？", o: ["TPAD","tPAd","tpAD","tpd"] },
  { q: "主队被绝杀那一刻，你在干嘛？", o: ["tpAD","tpmd","tPmd","TPAD"] },
  { q: "你买足球彩票的原因是？", o: ["tpMd","tpAD","TPAm","tpd"] },
  { q: "你混足球群主要是为了？", o: ["TpmD","tpAD","tpd","TPAD"] },
  { q: "你手机里有哪些足球相关APP？", o: ["TPAD","tpMd","tPAd","tpd"] },
  { q: "你支持某支球队的原因是什么？", o: ["TPAD","tPAd","tpAD","tpd"] },
  { q: "世界杯期间你最常出现的状态是？", o: ["tpAD","tPmd","tpd","tpd"] },
  { q: "你主队输球后，你会？", o: ["TPAD","tPAd","tpd","tpAD"] },
  { q: "你对点球大战的态度是？", o: ["tpAD","tpd","tpMD","tPAd"] },
  { q: "当爆出大冷门时，你的第一反应是？", o: ["TPAm","tPAd","tpMD","tpd"] },
  { q: "你买过几件球衣？", o: ["tpAD","tPAd","tpd","tpd"] },
  { q: "你觉得世界杯最烦人的话题是？", o: ["tpd","TPAD","tPAd","tpMD"] },
  { q: "看球时你一般？", o: ["tpAD","tPAd","tpd","TPAD"] },
  { q: "你的足球知识主要来自？", o: ["TPAm","tpMD","tPAd","tpd"] },
  { q: "如果用一句话形容你的看球状态？", o: ["tpMD","tPmd","TPAD","tpd"] },
  { q: "世界杯期间你的朋友圈一般发什么？", o: ["TPAD","tPAd","tpMd","tpd"] }
];

const questionTexts = [
  "世界杯揭幕战，你会怎么获取资讯？",
  "主队被绝杀那一刻，你在干嘛？",
  "你买足球彩票的原因是？",
  "你混足球群主要是为了？",
  "你手机里有哪些足球相关APP？",
  "你支持某支球队的原因是什么？",
  "世界杯期间你最常出现的状态是？",
  "你主队输球后，你会？",
  "你对点球大战的态度是？",
  "当爆出大冷门时，你的第一反应是？",
  "你买过几件球衣？",
  "你觉得世界杯最烦人的话题是？",
  "看球时你一般？",
  "你的足球知识主要来自？",
  "如果用一句话形容你的看球状态？",
  "世界杯期间你的朋友圈一般发什么？"
];

const optionTexts = [
  [
    "先看首发阵型图，边看边分析战术思路",
    "等赛后集锦，直接看进球和搞笑片段",
    "熬夜等全程直播，一场不落",
    "第二天刷新闻看战报，了解个大概"
  ],
  [
    "捂嘴深呼吸，怕吼出来吓到邻居",
    "发一条「虽败犹荣」的朋友圈假装淡定",
    "对着电视狂喊黑哨，然后摔遥控器",
    "默默关掉电视，心算出线条件"
  ],
  [
    "足球反买别墅靠海——搏一搏单车变摩托",
    "支持主队，顺手买注更有参与感",
    "研究赔率和阵容，认真分析后才下手",
    "朋友都买我不买，显得不合群"
  ],
  [
    "看热闹不嫌事大，专吃别人的破防反应",
    "和朋友一起看球边吐槽边嗨",
    "潜水围观，偶尔冒泡发一张表情包",
    "赛前讨论战术，赛后复盘分析"
  ],
  [
    "懂球帝/虎扑，战术板和数据分析是常驻",
    "买球APP天天签到，赛季进球率比主队还关注",
    "微博超话每天签到，积分快满了",
    "基本没有APP，电视打开看就行了"
  ],
  [
    "华丽进攻赏心悦目，防反太丑陋",
    "队里有帅哥，颜狗的自我修养",
    "小时候看了第一场比赛就爱上了，没有理由",
    "室友支持哪队我就支持哪队，随大流"
  ],
  [
    "凌晨3点闹钟调好，咖啡红牛备足，通宵看球",
    "第二天顶着黑眼圈上班，晚上继续熬",
    "养生作息规律，最多看到晚上12点",
    "世界杯跟平时一样，没什么特别的"
  ],
  [
    "发帖分析战术问题，数据角度复盘",
    "发朋友圈吐槽，今天不想说话了",
    "默默关掉电视，默念明年再来",
    "嘴上说没事，心里已经买好明年季票了"
  ],
  [
    "捂着眼睛从指缝里偷看，心跳到嗓子眼",
    "直接不敢看，躲到厨房假装干活",
    "念咒语：我买的队必进——结果年年天台排队",
    "拿手机记录点球瞬间，赛后做成表情包"
  ],
  [
    "我早说了！这队就是潜力股，黑马才是足球魅力",
    "发帖：见证历史！截图发群发朋友圈",
    "天台上人一多我反而觉得安心，终于不孤单了",
    "默默关掉手机，世界如此玄幻我需要静静"
  ],
  [
    "衣柜快爆炸了，按主客场和赛季分类存档",
    "假的也穿，穿的就是情怀而不是球队",
    "球衣是什么，能吃吗",
    "队名都不知道，但看到打折还是买了件"
  ],
  [
    "赌球输了跳楼，天台风景好——烂梗刷屏",
    "一场论：这场输了就说明XX不行了",
    "伪球迷蹭热度指指点点，懂球帝附体",
    "无脑迷信豪门，随便奶，玄学治国"
  ],
  [
    "准备啤酒零食，约朋友一起嗨",
    "边看边和群友吐槽，嘴比解说还忙",
    "一个人默默看，怕被别人的反应影响",
    "打开战术板对照，先预测阵型再验证"
  ],
  [
    "FM足球经理，数据背调比球探还专业",
    "Football Daily等社媒搬运，玄学印象流",
    "抖音集锦，十五分钟了解全场亮点",
    "世界杯就够了，平时根本不关注联赛"
  ],
  [
    "这场巴西稳了——说完巴西回家了",
    "最后十分钟天台上挤满了人，就差我一个",
    "从首发阵型到换人意图，比教练还懂球",
    "我就看看不说话，你们继续"
  ],
  [
    "比赛预告+结果分析，发完感觉自己像个博主",
    "表情包+吐槽，金句频出，评论区比球赛精彩",
    "买球截图，赢了晒单输了删帖",
    "从不发，默默看默默嗨，低调看球人"
  ]
];

const personalityTypes: Record<string, {
  name: string;
  tagline: string;
  traits: string[];
  moment: string;
  stars: number;
  bestTeam: string;
  worstMatch: string;
  slogan: string;
}> = {
  "TPAD": {
    name: "战术教父型",
    tagline: "懂球帝本帝，足球圈的人形战术手册",
    traits: [
      "进球看得分，战术看得懂，比教练还懂换人意图",
      "看球必备战术板，越位线偏移几厘米都能看出来",
      "聊天必谈阵型变化，4-3-3和4-2-3-1的区别比谁都清楚",
      "对高位逼抢、防反、传控如数家珍，信手拈来",
      "经常说：「这个换人有问题，应该上XX」"
    ],
    moment: "球员还在跑位，你已经在分析这次进攻的战术意图了。",
    stars: 3,
    bestTeam: "传控型球队",
    worstMatch: "玄学毒奶型",
    slogan: "足球是智慧的运动。"
  },
  "TPAm": {
    name: "战术玄学型",
    tagline: "懂球帝里最玄学的，玄学大师里最懂球的",
    traits: [
      "表面分析战术，内心相信玄学",
      "聊天时用数据说话，但关键时刻会念咒",
      "赛前会查赔率，也会查星座",
      "相信冥冥之中，但又拿出Excel佐证",
      "经常说：「从数据来看应该赢，但今年太邪门了」"
    ],
    moment: "比赛最后一分钟，你一边看数据一边念叨「别进球别进球」。",
    stars: 4,
    bestTeam: "青春风暴型球队",
    worstMatch: "纯数据型",
    slogan: "信数据，也信命。"
  },
  "TPD": {
    name: "战术球痴型",
    tagline: "为足球付出一切，足球知识储备比联赛还全",
    traits: [
      "凌晨比赛绝不缺席，第二天照常上班",
      "足球知识储备惊人，能说出各队历史最佳阵容",
      "看球时比教练还激动，赛后复盘比解说还专业",
      "会为喜欢的球队彻夜难眠，也会为主队绝杀落泪",
      "经常说：「这场球值了，熬夜也认了」"
    ],
    moment: "绝杀时刻，你已经冲下楼冲向客厅开始庆祝了。",
    stars: 5,
    bestTeam: "青春风暴型球队",
    worstMatch: "纯路人型",
    slogan: "足球是我的命。"
  },
  "TpAD": {
    name: "花边球痴型",
    tagline: "看热闹+为主队疯狂，气氛组里的战斗机",
    traits: [
      "进球必须吼出来，不吼出来不过瘾",
      "朋友说你在现场解说他都不信，太投入了",
      "世界杯期间嗓子必哑，气势必须拉满",
      "谁的瓜都吃，谁炸裂看谁，热闹第一",
      "经常说：「打起来打起来」"
    ],
    moment: "比赛胶着时，你的助威声可以带动整层楼的邻居。",
    stars: 4,
    bestTeam: "青春风暴型球队",
    worstMatch: "纯路人型",
    slogan: "进球不喊等于没进。"
  },
  "TpmD": {
    name: "花边毒奶型",
    tagline: "看热闹+毒奶双修，专挑最稳的队奶",
    traits: [
      "看热闹不嫌事大，毒奶从来不失手",
      "专挑最稳的队奶，然后看他们崩盘",
      "每次都能精准避开正确选项",
      "你的预测就是反指路明灯",
      "经常说：「我说的你别信，我奶谁谁输」"
    ],
    moment: "你说这场巴西稳了，然后巴西回家了。",
    stars: 5,
    bestTeam: "黑马",
    worstMatch: "豪门信徒型",
    slogan: "我的毒奶，百发百中。"
  },
  "tPAD": {
    name: "气氛组组长型",
    tagline: "我就是欢乐制造机，看球就是为了热闹",
    traits: [
      "进球必须吼，不吼出来不过瘾",
      "朋友说你像现场解说，主队进了比你还激动",
      "世界杯期间嗓子必哑，气势拉满",
      "谁的瓜都吃，热闹第一",
      "经常说：「打起来打起来」"
    ],
    moment: "比赛胶着时，你的助威声带动整层楼。",
    stars: 4,
    bestTeam: "青春风暴型球队",
    worstMatch: "纯路人型",
    slogan: "进球不喊等于没进。"
  },
  "tPAd": {
    name: "社交凑热闹型",
    tagline: "足球社交达人，看球是借口社交才是本质",
    traits: [
      "边看边吐槽，嘴比裁判还忙",
      "进球第一时间截图发朋友圈，配文都想好了",
      "表情包储备量惊人，每个进球都有专属表情包",
      "世界杯期间朋友突然多了，都是来要球票的",
      "经常说：「球进了！快看我发的图！」"
    ],
    moment: "进球的那一刻，你已经在编辑朋友圈了。",
    stars: 3,
    bestTeam: "青春风暴型球队",
    worstMatch: "佛系独处型",
    slogan: "一个人看球叫看，一群人看球叫狂欢。"
  },
  "tPmD": {
    name: "玄学乐子人",
    tagline: "看热闹+毒奶双修，专挑最稳的队奶",
    traits: [
      "看热闹不嫌事大，毒奶从来不失手",
      "专挑最稳的队奶，然后看他们崩盘",
      "每次都能精准避开正确选项",
      "你的预测就是反指路明灯",
      "名言：「我说的你别信，我奶谁谁输」"
    ],
    moment: "你说这场巴西稳了，然后巴西回家了。",
    stars: 4,
    bestTeam: "黑马",
    worstMatch: "豪门信徒型",
    slogan: "我的毒奶，百发百中。"
  },
  "tPmA": {
    name: "玄学花边型",
    tagline: "信则有不信则无，表情包产量惊人",
    traits: [
      "相信冥冥之中的力量，赛前必念咒",
      "看球靠玄学，但更相信表情包",
      "毒奶功力深厚，一口奶下去天台人都满了",
      "看球同时也看热闹，表情包发得比谁都勤",
      "经常说：「这场巴西稳了」「法国今年必夺冠」"
    ],
    moment: "点球大战时你一边念咒一边截图发群。",
    stars: 4,
    bestTeam: "黑马",
    worstMatch: "数据狂魔型",
    slogan: "爆冷，我只信玄学。"
  },
  "tpAD": {
    name: "激情球痴型",
    tagline: "足球是信仰，其他都可以让步",
    traits: [
      "凌晨3点的闹钟比任何事都重要",
      "咖啡红牛东鹏特饮是标配，越困越精神",
      "即使第二天要上班也必须看完整场",
      "世界杯期间朋友约不出去，因为你一定要看球",
      "名言：「这场不看我睡不着」"
    ],
    moment: "凌晨进球时会不自觉吼一声，然后被邻居敲门。",
    stars: 4,
    bestTeam: "青春风暴型球队",
    worstMatch: "佛系养生型",
    slogan: "我的作息由世界杯决定。"
  },
  "tpd": {
    name: "纯路人型",
    tagline: "世界杯凑热闹型，存在感约等于零",
    traits: [
      "平时不看球，世界杯来凑个热闹",
      "朋友圈蹭热度发一条，之后继续潜水",
      "跟风买注彩票，赢了会所嫩模，输了下地干活",
      "身边没人知道你是球迷，你也不在乎",
      "经常说：「世界杯？不就跟平时一样看球吗」"
    ],
    moment: "群里因为足球吵翻了天，你全程围观一言不发。",
    stars: 1,
    bestTeam: "黑马",
    worstMatch: "热血激情型",
    slogan: "低调看球，闷声发财。"
  },
  "tpMD": {
    name: "玄学毒奶型",
    tagline: "信则有不信则无，玄学才是第一生产力",
    traits: [
      "相信冥冥之中的力量，赛前必念咒（心理安慰）",
      "看球靠玄学，分析靠第六感，赢了是预测准确输了是对手更强",
      "毒奶功力深厚，一口奶下去天台人都满了",
      "名言：「这场巴西稳了」「法国今年必夺冠」——然后回家了",
      "你的预测就是反指路明灯"
    ],
    moment: "点球大战时嘴里念叨的咒语比VAR系统还复杂。",
    stars: 5,
    bestTeam: "黑马",
    worstMatch: "数据狂魔型",
    slogan: "爆冷，我只信玄学。"
  },
  "tpMd": {
    name: "玄学赌徒型",
    tagline: "彩票玄学，信则有不信则无",
    traits: [
      "买球靠玄学，研究赔率不如直接信运气",
      "足彩分析App装了十几个，但从来不用",
      "每次开奖前都要念一遍幸运数字",
      "赢了会所嫩模，输了天台排队来年再来",
      "经常说：「这届杯赛邪门得很」"
    ],
    moment: "天台上吹风的时候，想想下次该信什么玄学。",
    stars: 4,
    bestTeam: "黑马",
    worstMatch: "数据狂魔型",
    slogan: "足球反买，别墅靠海。"
  },
  "tPmd": {
    name: "热血球痴型",
    tagline: "足球是信仰，为了主队可以付出一切",
    traits: [
      "主队输了会发疯，主队赢了会发更大的疯",
      "天台VIP年卡会员，经常和对面球迷对线到半夜",
      "毒奶功力深厚，说谁赢谁就输",
      "看球极度投入，进球跳沙发是常态",
      "经常说：「这场巴西稳了——说完巴西回家了」"
    ],
    moment: "绝杀那一刻，你已经冲下楼准备去天台了。",
    stars: 5,
    bestTeam: "青春风暴型球队",
    worstMatch: "佛系养生型",
    slogan: "世界杯不疯狂，等于没看。"
  }
};

type PageState = 'start' | 'question' | 'loading' | 'result';

const loadingTips = [
  "分析你的观赛习惯...",
  "评估你的熬夜能力...",
  "检测玄学指数...",
  "计算毒奶强度...",
  "扫描豪门信仰...",
  "匹配球迷基因...",
  "挖掘隐藏属性..."
];

export default function Home() {
  const [pageState, setPageState] = useState<PageState>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [resultCode, setResultCode] = useState('');
  const [result, setResult] = useState(personalityTypes['tPAd']);
  const [loadingTip, setLoadingTip] = useState(loadingTips[0]);
  const [stars, setStars] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    createStars();
  }, []);

  function createStars() {
    const container = document.getElementById('stars');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 50; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 3 + 's';
      container.appendChild(star);
    }
  }

  function startQuiz() {
    setPageState('question');
    setCurrentQuestion(0);
    setAnswers([]);
  }

  function handleAnswer(code: string) {
    const newAnswers = [...answers, code];
    setAnswers(newAnswers);

    if (currentQuestion < 15) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setPageState('loading');
      let tipIndex = 0;
      setLoadingTip(loadingTips[0]);
      const tipInterval = setInterval(() => {
        tipIndex = (tipIndex + 1) % loadingTips.length;
        setLoadingTip(loadingTips[tipIndex]);
      }, 800);

      setTimeout(() => {
        clearInterval(tipInterval);
        calculateResult(newAnswers);
        setPageState('result');
      }, 2500);
    }
  }

  function calculateResult(allAnswers: string[]) {
    // Count how many times each personality code was selected
    const counts: Record<string, number> = {};
    allAnswers.forEach(code => {
      counts[code] = (counts[code] || 0) + 1;
    });

    // Find the personality with the most selections
    let maxCount = -1;
    let resultCode = 'tPAd';
    Object.entries(counts).forEach(([code, count]) => {
      if (count > maxCount) {
        maxCount = count;
        resultCode = code;
      }
    });

    setResultCode(resultCode);
    const personality = personalityTypes[resultCode] || personalityTypes['tPAd'];
    setResult(personality);

    const starsArray = Array(5).fill(0).map((_, i) => (
      <span key={i} className={i < personality.stars ? 'star-icon' : 'star-icon empty'}>⭐</span>
    ));
    setStars(starsArray);
  }

  async function shareScreenshot() {
    const resultEl = document.querySelector('.result-page') as HTMLElement;
    if (!resultEl) {
      alert('截图功能暂时不可用，请稍后重试');
      return;
    }

    try {
      const canvas = await html2canvas(resultEl, {
        backgroundColor: '#0a0a1a',
        scale: 2,
        useCORS: true,
        logging: false
      });

      const ctx = canvas.getContext('2d');
      if (ctx) {
        const qrCanvas = document.createElement('canvas');
        const qrSize = 90;
        qrCanvas.width = qrSize;
        qrCanvas.height = qrSize;
        await QRCode.toCanvas(qrCanvas, 'https://wcti-app.vercel.app', {
          width: qrSize,
          margin: 1,
          color: { dark: '#ffffff', light: '#0a0a1a' }
        });
        ctx.drawImage(qrCanvas, canvas.width - 110, canvas.height - 110, 90, 90);
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `WCTI_${resultCode}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (err) {
      console.error('截图失败:', err);
      alert('截图失败，请稍后重试');
    }
  }

  function copyToClipboard() {
    const text = `
⚽ WCTI 世界杯球迷人格测试

【${resultCode}】${result.name}
${result.tagline}

📊 球迷特征：
${result.traits.map(t => '• ' + t).join('\n')}

🎬 名场面：${result.moment}

"${result.slogan}"

⚠️ 危险指数：${'⭐'.repeat(result.stars)}

🏆 最适合：${result.bestTeam}

测试你的球迷人格：https://wcti-app.vercel.app
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      alert('文案已复制到剪贴板！');
    }).catch(() => {
      alert('复制失败，请手动复制');
    });
  }

  function renderStartPage() {
    return (
      <div className="start-page">
        <div className={styles.logoContainer}>
          <div className="logo-badge">World Cup 2026</div>
          <h1 className="main-title">WCTI</h1>
          <p className="subtitle">世界杯球迷人格测试</p>
        </div>
        <p className="tagline">
          你是哪种球迷？<br />
          <span>玄学毒奶？豪门信徒？熬夜战神？</span>
        </p>
        <div className="sample-codes">
          <span className="sample-code">TPAD</span>
          <span className="sample-code">tpMD</span>
          <span className="sample-code">tpAD</span>
          <span className="sample-code">tPAd</span>
        </div>
        <button className="start-btn" onClick={startQuiz}>
          开始测试
        </button>
      </div>
    );
  }

  function renderQuestionPage() {
    const qIndex = currentQuestion;
    return (
      <div className="question-page">
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentQuestion + 1) / 16) * 100}%` }}
            />
          </div>
          <div className="progress-text">{currentQuestion + 1}/16</div>
        </div>
        <div className={styles.questionCard}>
          <div className="question-number">第{currentQuestion + 1}题</div>
          <div className="question-text">{questionTexts[qIndex]}</div>
          <div className="options">
            {optionTexts[qIndex].map((text, i) => {
              const letters = ['A', 'B', 'C', 'D'];
              return (
                <button
                  key={i}
                  className="option-btn"
                  onClick={() => handleAnswer(questions[qIndex].o[i])}
                >
                  <span className="option-letter">{letters[i]}</span>
                  <span>{text}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  function renderLoadingPage() {
    return (
      <div className="loading-page">
        <div className="loading-icon">⚽</div>
        <div className="loading-text">正在分析你的球迷基因...</div>
        <div className="loading-bar">
          <div className="loading-fill" />
        </div>
        <div className="loading-tips">{loadingTip}</div>
      </div>
    );
  }

  function renderResultPage() {
    return (
      <div className="result-page">
        <div className="result-header">
          <div className="result-label">你的球迷人格代码</div>
          <div className="result-code">{resultCode}</div>
          <div className="result-name">{result.name}</div>
          <div className="result-tagline">{result.tagline}</div>
          <button className="retake-btn" onClick={() => { setPageState('start'); setCurrentQuestion(0); setAnswers([]); }}>
            <span>🔄</span> 不满意？重新测试
          </button>
        </div>

        <div className="result-section">
          <div className="section-title">📊 球迷特征</div>
          <ul className="traits-list">
            {result.traits.map((t, i) => (
              <li key={i} className="trait-item">
                <span className="trait-icon">▶</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="result-section">
          <div className="section-title">🎬 球迷名场面</div>
          <div className="moment-box">
            <span className="emoji">⚽</span>
            {result.moment}
          </div>
        </div>

        <div className="result-section">
          <div className="section-title">⚠️ 世界杯危险指数</div>
          <div className="stars">{stars}</div>
        </div>

        <div className="result-section">
          <div className="section-title">🏆 球队匹配</div>
          <div className="team-grid">
            <div className="team-box">
              <div className="team-label">最适合</div>
              <div className="team-value">{result.bestTeam}</div>
            </div>
            <div className="team-box">
              <div className="team-label">最不适合</div>
              <div className="team-value">{result.worstMatch}</div>
            </div>
          </div>
        </div>

        <div className="slogan-box">
          <div className="slogan-text">"{result.slogan}"</div>
        </div>

        <div className="share-section">
          <button className="share-btn primary" onClick={shareScreenshot}>
            <span>📸</span> 截图分享
          </button>
          <button className="share-btn secondary" onClick={copyToClipboard}>
            <span>📋</span> 复制文案
          </button>
        </div>

        <div className="cta-section">
          <a href="/" className="cta-btn">
            <span>⚽</span> 我也来测试
          </a>
        </div>
      </div>
    );
  }

  return (
    <main className="main">
      <div className="bg-stars" id="stars" />
      {pageState === 'start' && renderStartPage()}
      {pageState === 'question' && renderQuestionPage()}
      {pageState === 'loading' && renderLoadingPage()}
      {pageState === 'result' && renderResultPage()}
    </main>
  );
}