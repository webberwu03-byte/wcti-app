'use client';

import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import styles from './page.module.css';

// F = Fan 观赛方式, C = Crazy 混乱程度, E = Evaluate 分析方式, I = Identity 球迷身份

const questions = [
  {
    question: "世界杯决赛夜，你通常会？",
    options: [
      { text: "提前调整作息，认真备战", type: ["F", "E"] },
      { text: "啤酒烧烤零食全部拉满", type: ["C", "I"] },
      { text: "对象睡了我才偷偷开球", type: ["F", "C"] },
      { text: "临开赛才想起来今天有决赛", type: ["E", "I"] }
    ]
  },
  {
    question: "和朋友一起看球，你一般？",
    options: [
      { text: "提前拉群约人，制定观赛计划", type: ["F", "E"] },
      { text: "边看边吐槽，嘴比裁判还忙", type: ["C", "I"] },
      { text: "一个人默默看，怕被别人的反应影响", type: ["F", "I"] },
      { text: "群里谁发红包我就去谁那看", type: ["E", "C"] }
    ]
  },
  {
    question: "你主队比赛输了，你的第一反应是？",
    options: [
      { text: "打开战术板分析哪里出了问题", type: ["F", "E"] },
      { text: "发一条朋友圈表达痛苦", type: ["C", "I"] },
      { text: "默默关掉电视，心里已经在明年再来", type: ["I", "E"] },
      { text: "毒奶一口：这场对面赢得蹊跷", type: ["C", "F"] }
    ]
  },
  {
    question: "你买过几件球衣？",
    options: [
      { text: "衣柜快爆炸了，按赛季分类", type: ["F", "C"] },
      { text: "队名都不知道但球衣必须有", type: ["I", "E"] },
      { text: "假货也穿，穿的就是情怀", type: ["C", "I"] },
      { text: "球衣是什么，能吃吗", type: ["E", "F"] }
    ]
  },
  {
    question: "点球大战时你在干嘛？",
    options: [
      { text: "捂着眼睛从指缝里偷看", type: ["F", "I"] },
      { text: "已经在天台排队了", type: ["C", "F"] },
      { text: "疯狂念咒：我赌的队必进", type: ["C", "I"] },
      { text: "面无表情内心崩溃", type: ["E", "I"] }
    ]
  },
  {
    question: "当爆出大冷门时，你的第一反应？",
    options: [
      { text: "我早说了！巴西能输凭什么不能赢", type: ["C", "F"] },
      { text: "发帖分析冷门原因，数据支撑", type: ["E", "F"] },
      { text: "立刻截图发群：见证历史！", type: ["I", "C"] },
      { text: "默默关掉手机，世界如此玄幻", type: ["I", "E"] }
    ]
  },
  {
    question: "你混迹足球群是为了？",
    options: [
      { text: "分析战术，和真球迷探讨", type: ["F", "E"] },
      { text: "看热闹不嫌事大，专吃球迷反应", type: ["C", "I"] },
      { text: "赌球情报交换", type: ["C", "I"] },
      { text: "维持社交关系，顺便看球", type: ["E", "I"] }
    ]
  },
  {
    question: "熬夜看球第二天，你一般？",
    options: [
      { text: "红牛咖啡续命，照常上班", type: ["F", "C"] },
      { text: "直接请假，说昨晚被进球绝杀了", type: ["C", "I"] },
      { text: "困到升天但下次还敢", type: ["F", "I"] },
      { text: "世界杯才熬，平时养生", type: ["E", "I"] }
    ]
  },
  {
    question: "你手机里有什么足球APP？",
    options: [
      { text: "懂球帝/虎扑，战术分析板块常客", type: ["F", "E"] },
      { text: "买球APP每天都签到", type: ["C", "I"] },
      { text: "微博超话签到，球迷圈子社交", type: ["I", "E"] },
      { text: "没有APP，电视看看就行了", type: ["E", "I"] }
    ]
  },
  {
    question: "世界杯期间你会买彩票吗？",
    options: [
      { text: "每场都买，不赌不刺激", type: ["C", "I"] },
      { text: "买个十块八块，支持一下主队", type: ["E", "I"] },
      { text: "彩票是啥，我只看球", type: ["F", "E"] },
      { text: "研究赔率，精打细算", type: ["F", "C"] }
    ]
  },
  {
    question: "你觉得世界杯最烦人的话题是？",
    options: [
      { text: "赌球输了跳楼之类的烂梗", type: ["I", "E"] },
      { text: "一场论：这场输了就说明XX不行了", type: ["F", "E"] },
      { text: "伪球迷蹭热度指指点点", type: ["C", "F"] },
      { text: "无脑迷信豪门，随便奶", type: ["C", "I"] }
    ]
  },
  {
    question: "世界杯期间你朋友圈一般发什么？",
    options: [
      { text: "比赛预告+结果分析，发完感觉自己像个博主", type: ["F", "E"] },
      { text: "表情包+吐槽，金句频出", type: ["C", "I"] },
      { text: "从不发，默默看默默嗨", type: ["I", "E"] },
      { text: "买球截图，赢了晒单输了删帖", type: ["C", "I"] }
    ]
  }
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
  "FCCE": {
    name: "狂热上头型球迷",
    tagline: "世界杯期间最危险的存在，情绪随比赛过山车",
    traits: [
      "看球极度投入，进球跳沙发是常态",
      "主队输了会发疯，主队赢了会发更大的疯",
      "毒奶功力深厚，说谁赢谁就输",
      "天台VIP年卡会员",
      "经常和对面球迷对线到半夜"
    ],
    moment: "绝杀那一刻，你已经冲下楼准备去天台了。",
    stars: 5,
    bestTeam: "青春风暴型球队",
    worstMatch: "佛系养生型球迷",
    slogan: "世界杯不疯狂，等于没看。"
  },
  "fCEE": {
    name: "佛系冷静型球迷",
    tagline: "输赢看淡，养生看球，这才是真正的快乐足球",
    traits: [
      "主队输了最多叹口气，明天太阳照常升起",
      "从不毒奶，从不上头，从不跳楼",
      "枸杞红茶保温杯，看球养生两不误",
      "朋友圈从不发足球相关内容",
      "经常说：「踢得不错，明年再来」"
    ],
    moment: "天台挤满人时，他在一旁悠闲地泡茶。",
    stars: 1,
    bestTeam: "防反队",
    worstMatch: "狂热上头型球迷",
    slogan: "看球嘛，开心最重要。"
  },
  "FcEi": {
    name: "豪门战术型球迷",
    tagline: "皇马巴萨拜仁巴黎，豪门底蕴永不言弃",
    traits: [
      "只支持传统豪门，祖上富裕才是真爱",
      "豪门输了会失落一周，觉得只是状态问题",
      "看不起黑马，觉得黑马都是爆冷没有实力",
      "足球频道精准，豪门比赛绝不缺席",
      "经常说：「底蕴这东西，黑马学不来」"
    ],
    moment: "每年赛季开始前都会说「今年又是我们夺冠热门」。",
    stars: 3,
    bestTeam: "豪门",
    worstMatch: "冷门猎手型球迷",
    slogan: "豪门可以输，但底蕴不能丢。"
  },
  "FCEI": {
    name: "战术分析型球迷",
    tagline: "进球看得分，战术看得懂，这才是真懂球",
    traits: [
      "看球必备战术板，分析换人意图是基本操作",
      "对高位逼抢、防反、传控如数家珍",
      "教练席上的隐形人，比教练还懂战术",
      "聊天必谈阵型变化和战术调整",
      "经常说：「这个换人有问题，应该上XX」"
    ],
    moment: "球员还在跑位，你已经在分析这次进攻的战术意图了。",
    stars: 3,
    bestTeam: "传控型球队",
    worstMatch: "玄学毒奶型球迷",
    slogan: "足球是智慧的运动。"
  },
  "FcEI": {
    name: "社交活跃型球迷",
    tagline: "看球是借口，社交才是本质，群聊气氛担当",
    traits: [
      "看球必发群，边看边吐槽，嘴比解说还忙",
      "进球第一时间截图发朋友圈",
      "世界杯期间朋友突然多了，都是来要球票的",
      "表情包储备量惊人，每个进球都有专属表情包",
      "经常说：「球进了！快看我发的图！」"
    ],
    moment: "进球的那一刻，你已经在编辑朋友圈了，配文都想好了。",
    stars: 2,
    bestTeam: "青春风暴型球队",
    worstMatch: "佛系独处型球迷",
    slogan: "一个人看球叫看，一群人看球叫狂欢。"
  },
  "FCEi": {
    name: "熬夜战神型球迷",
    tagline: "睡眠是什么？世界杯期间我与太阳肩并肩",
    traits: [
      "凌晨3点的闹钟比任何事都重要",
      "咖啡红牛东鹏特饮是标配，越困越精神",
      "早上看球，下午上班，晚上继续看球",
      "即使第二天要上班也必须看完整场",
      "名言：「这场不看我睡不着」"
    ],
    moment: "凌晨进球时会不自觉吼一声，然后被邻居敲门。",
    stars: 4,
    bestTeam: "青春风暴型球队",
    worstMatch: "佛系养生型球迷",
    slogan: "我的作息由世界杯决定。"
  },
  "fCEI": {
    name: "冷门猎手型球迷",
    tagline: "众人皆醉我独醒，大冷门收割机就是我",
    traits: [
      "专挖冷门球队，越没人在意的比赛越有激情",
      "小组赛就开始分析淘汰赛对阵",
      "喜欢说「我早说了这队有戏」",
      "对豪门无感，喜欢以小博大的刺激感",
      "每次爆冷都让你兴奋得睡不着"
    ],
    moment: "当大家都在看决赛时，你在分析某支黑马的比赛录像。",
    stars: 3,
    bestTeam: "黑马/防反队",
    worstMatch: "豪门战术型球迷",
    slogan: "冷门才是足球的魅力。"
  },
  "fCei": {
    name: "乐子人型球迷",
    tagline: "看热闹不嫌事大，我就喜欢看你们破防",
    traits: [
      "看球不为主队，只为吃瓜看热闹",
      "谁的瓜都吃，谁炸裂看谁",
      "每次有人破防你都在截图发群",
      "最喜欢看别人反应而不是球赛本身",
      "名言：「打起来打起来」"
    ],
    moment: "别人看的是进球，你拍的是观众的表情包。",
    stars: 2,
    bestTeam: "黑马",
    worstMatch: "豪门战术型球迷",
    slogan: "足球嘛，最重要的是开心。"
  },
  "FCEn": {
    name: "数据狂魔型球迷",
    tagline: "进球数、传球成功率、xG值……数据不会骗人",
    traits: [
      "看球必备Excel，赛后必须复盘数据",
      "对战术板情有独钟，能分析到越位线偏移了几厘米",
      "聊天必谈预期进球、传球准确率等术语",
      "相信数据大于感觉，分析报告比教练还专业",
      "经常说：「从数据角度来看……」"
    ],
    moment: "赛后第一件事是打开数据统计，而不是回放进球。",
    stars: 3,
    bestTeam: "传控型球队",
    worstMatch: "玄学毒奶型球迷",
    slogan: "数据不会骗人。"
  },
  "fCEi": {
    name: "赌徒型球迷",
    tagline: "天台风景独好，我只是来体验人生的",
    traits: [
      "买球是信仰，每场比赛都必须支持下注",
      "研究赔率的时间比看球时间还多",
      "赢了会所嫩模，输了下地干活",
      "经常梭哈，然后后悔，再然后继续",
      "手机里有好几个买球APP"
    ],
    moment: "绝杀那一刻，天台和会所同时向你招手。",
    stars: 5,
    bestTeam: "防反队",
    worstMatch: "佛系养生型球迷",
    slogan: "赢了别墅靠大海，输了天台排队来。"
  },
  "fceI": {
    name: "豪门崩盘型球迷",
    tagline: "足坛纪检委，专业盯豪门，谁崩盘谁就是我主队",
    traits: [
      "专门等着看豪门崩盘，崩盘比进球还爽",
      "豪门球迷越多我就越要唱反调",
      "看到豪门翻车立刻截图发帖：报应来了",
      "黄健翔附体，解说比嘉宾还激动",
      "名言：「今年冠军肯定是黑马」"
    ],
    moment: "豪门被绝杀那一刻，你发了十条朋友圈。",
    stars: 4,
    bestTeam: "黑马",
    worstMatch: "豪门战术型球迷",
    slogan: "豪门翻车现场直播，请双击666。"
  },
  "FeCI": {
    name: "气氛组组长型球迷",
    tagline: "全场最亮的星，我的呐喊比进球还精彩",
    traits: [
      "不管主队踢得怎么样，气势必须拉满",
      "进球必须吼，不吼出来不过瘾",
      "酒吧看球首选，一群人一起嗨",
      "朋友说你在现场解说他都不信，太投入了",
      "世界杯期间嗓子必哑"
    ],
    moment: "比赛胶着时，你的助威声可以带动整层楼的观众。",
    stars: 3,
    bestTeam: "青春风暴型球队",
    worstMatch: "佛系独处型球迷",
    slogan: "进球不喊等于没进。"
  },
  "fcei": {
    name: "潜水型球迷",
    tagline: "默默看球，默默嗨，存在感为零",
    traits: [
      "从来不发言，群里永远是潜水状态",
      "看球全程不发一言，进球也只是内心欢呼",
      "朋友圈从来不发足球内容",
      "身边没人知道你是球迷",
      "经常说：「世界杯？不就跟平时一样看球吗」"
    ],
    moment: "群里因为足球吵翻了天，你全程围观一言不发。",
    stars: 1,
    bestTeam: "防反队",
    worstMatch: "社交活跃型球迷",
    slogan: "低调看球，闷声发财。"
  },
  "FceI": {
    name: "玄学毒奶型球迷",
    tagline: "信则有，不信则无，玄学才是第一生产力",
    traits: [
      "相信冥冥之中的力量，赛前必烧香（指心理安慰）",
      "看球靠玄学，分析靠第六感，赢了是我预测准确输了是对手太强",
      "毒奶功力深厚，一口奶下去天台人都满了",
      "名言警句：「这场巴西稳了」「法国今年必夺冠」——然后输了",
      "看球时嘴里念念有词，不知道在诅咒还是在祈祷"
    ],
    moment: "点球大战时嘴里念叨的咒语比VAR系统还复杂。",
    stars: 5,
    bestTeam: "青春风暴型球队",
    worstMatch: "数据狂魔型球迷",
    slogan: "爆冷，我只信玄学。"
  },
  "FCeI": {
    name: "豪门信徒型球迷",
    tagline: "只认强队，祖上富裕的球队才是真爱",
    traits: [
      "只认强队，祖上富裕的球队才是真爱",
      "豪门比赛输了会失落一周，赢了会觉得理所当然",
      "看不起黑马，觉得黑马都是爆冷没有实力",
      "看到喜欢的豪门被绝杀会沉默半天说不出话",
      "经常说：「我队只是状态不好，下场稳了」"
    ],
    moment: "每年赛季开始前都会说「今年又是我们夺冠热门」。",
    stars: 4,
    bestTeam: "豪门",
    worstMatch: "冷门猎手型球迷",
    slogan: "豪门底蕴，永不言弃。"
  },
  "fEcI": {
    name: "毒奶乐子人",
    tagline: "看热闹+毒奶，看球就是为了热闹",
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
    worstMatch: "豪门信徒型球迷",
    slogan: "我的毒奶，百发百中。"
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
  const [scores, setScores] = useState({ F: 0, C: 0, E: 0, I: 0 });
  const [resultCode, setResultCode] = useState('');
  const [result, setResult] = useState(personalityTypes['fCEE']);
  const [loadingTip, setLoadingTip] = useState(loadingTips[0]);
  const [stars, setStars] = useState<React.ReactNode[]>([]);

  // Create stars on mount
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
    setScores({ F: 0, C: 0, E: 0, I: 0 });
  }

  function handleAnswer(types: string[]) {
    const newScores = { ...scores };
    types.forEach(type => {
      if (['F', 'C', 'E', 'I'].includes(type)) {
        newScores[type as keyof typeof scores]++;
      }
    });
    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
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
        calculateResult(newScores);
        setPageState('result');
      }, 2500);
    }
  }

  function calculateResult(finalScores: typeof scores) {
    const fScore = finalScores.F;
    const cScore = finalScores.C;
    const eScore = finalScores.E;
    const iScore = finalScores.I;

    const fChar = fScore >= 3 ? 'F' : 'f';
    const cChar = cScore >= 3 ? 'C' : 'c';
    const eChar = eScore >= 3 ? 'E' : 'e';
    const iChar = iScore >= 3 ? 'I' : 'i';

    const code = fChar + cChar + eChar + iChar;
    setResultCode(code);

    const personality = personalityTypes[code] || personalityTypes['fCEE'];
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
⚽ WCTI 世界杯球迷人格测试结果

【${resultCode}】${result.name}
${result.tagline}

📊 球迷特征：
${result.traits.map(t => '• ' + t).join('\n')}

🎬 名场面：${result.moment}

"${result.slogan}"

⚠️ 危险指数：${'⭐'.repeat(result.stars)}

🏆 最适合：${result.bestTeam}

测试你的球迷人格：WCTI 世界杯球迷人格测试
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
          <span className="sample-code">FCEI</span>
          <span className="sample-code">fCEE</span>
          <span className="sample-code">FcEi</span>
          <span className="sample-code">fcei</span>
        </div>
        <button className="start-btn" onClick={startQuiz}>
          开始测试
        </button>
      </div>
    );
  }

  function renderQuestionPage() {
    const q = questions[currentQuestion];
    return (
      <div className="question-page">
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
          <div className="progress-text">{currentQuestion + 1}/{questions.length}</div>
        </div>
        <div className={styles.questionCard}>
          <div className="question-number">第{currentQuestion + 1}题</div>
          <div className="question-text">{q.question}</div>
          <div className="options">
            {q.options.map((opt, i) => {
              const letters = ['A', 'B', 'C', 'D'];
              return (
                <button
                  key={i}
                  className="option-btn"
                  onClick={() => handleAnswer(opt.type)}
                >
                  <span className="option-letter">{letters[i]}</span>
                  <span>{opt.text}</span>
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
          <button className="retake-btn" onClick={() => { setPageState('start'); setCurrentQuestion(0); setScores({ F: 0, C: 0, E: 0, I: 0 }); }}>
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