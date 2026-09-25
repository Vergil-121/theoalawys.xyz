window.SITE = {
  siteName: 'theo的小站',
  siteStart: '2026-09-25',
  owner: 'theo',

  quotes: [
    '黄昏好看，是因为它马上就没了。',
    '这里是 theo 的小角落，慢慢在建。',
    '看过的番、听过的歌、想不通的题，都想记下来。',
    '慢点没关系，别停就行。',
    '今天也挺适合发呆和写点什么。'
  ],

  siteEvents: [
    { date: '2026.09', text: '小站改版，加了动漫和音乐' },
    { date: '2026.09', text: '打卡第一次连着超过 30 天' },
    { date: '2026.08', text: '整理了一份月考复习排期模板' },
    { date: '2026.07', text: '决定把随手记的东西搬到一个正经网站上' }
  ],

  notes: [
    {
      id: 'n1',
      title: '红黑树到底在"转"什么',
      tags: ['计算机', '算法'],
      date: '2026-09-22',
      summary: '用人话讲清楚插入后的旋转与变色，配一张自己画的示意图思路。',
      body: [
        '先记住红黑树的五条性质，其实核心就一句：从任一节点到其所有后代叶子的黑色节点数相同。',
        '插入新节点默认红色，因为红色不破坏"黑高"。真正出问题的是"连续两个红节点"，这时才需要修。',
        '修的方式分两种：变色（叔叔是红）和旋转（叔叔是黑）。旋转本质是"把中间大小的那个节点提上去当父亲"。',
        '死记四种形态不如画一遍：把三个节点按大小排成一列，中间的上去，剩下两个自然成为左右孩子。'
      ]
    },
    {
      id: 'n2',
      title: '英语长难句的拆解顺序',
      tags: ['英语', '方法'],
      date: '2026-09-18',
      summary: '找主句谓语 → 砍掉从句 → 回填修饰，三步定位句子主干。',
      body: [
        '第一步找谓语动词：先数句子里有几个动词，带连词的通常是从句谓语，剩下的那个就是主干。',
        '第二步砍修饰：把从句、分词短语、插入语先用括号圈掉，主干会立刻变短。',
        '第三步回填：把砍掉的部分逐块翻译回去，按中文习惯调整顺序。',
        '练十句真题长难句之后，基本不用再刻意想步骤，眼睛会自动抓主干。'
      ]
    },
    {
      id: 'n3',
      title: '特征值与特征向量的几何直觉',
      tags: ['数学', '线代'],
      date: '2026-09-15',
      summary: '把矩阵看成空间变换，特征向量就是"方向不变"的那些轴。',
      body: [
        '矩阵作用在向量上，一般是既旋转又拉伸。特征向量特殊在：被作用之后方向不变（或反向），只被拉伸。',
        '拉伸的倍数就是特征值。所以 Av = λv 这条式子描述的是"找不被转歪的方向"。',
        '对角化之所以好用，是因为换到特征向量这组基之后，变换只剩下各个方向上的独立缩放。',
        '考试里遇到"反复作用同一个矩阵"，第一反应就该是特征值。'
      ]
    },
    {
      id: 'n4',
      title: 'Anki 卡片怎么写才不会变成背诵负担',
      tags: ['方法', '工具'],
      date: '2026-09-11',
      summary: '一张卡只问一件事，答案控制在两行以内。',
      body: [
        '最小信息原则：一张卡只考一个点。多个点拆成多张卡，复习时才不会出现"会一半"的尴尬。',
        '不要抄书。卡片正面写场景化的问题，背面写自己的话。',
        '公式类卡片改成"推导第一步是什么"，比整段默写更能形成记忆钩子。',
        '每天上限 60 张，超了就停，欠债会滚雪球。'
      ]
    },
    {
      id: 'n5',
      title: '进程、线程、协程到底差在哪',
      tags: ['计算机', '操作系统'],
      date: '2026-09-06',
      summary: '从"谁负责调度"和"切换成本"两个维度去理解。',
      body: [
        '进程是资源分配的基本单位，线程是 CPU 调度的基本单位。同一进程下的线程共享地址空间。',
        '线程切换要陷入内核，保存寄存器和栈；协程切换在用户态完成，成本要低一个量级。',
        'IO 密集型用协程收益很大，CPU 密集型基本没用，反而增加复杂度。',
        '一句话记忆：进程管资源，线程管执行，协程管协作。'
      ]
    },
    {
      id: 'n6',
      title: '费曼技巧实操：四步把知识点讲明白',
      tags: ['方法'],
      date: '2026-08-30',
      summary: '选主题 → 讲给外行 → 卡住就回去看书 → 简化并类比。',
      body: [
        '拿一张白纸写下主题，假装讲给完全不懂的同学听，不许用术语。',
        '卡住的地方就是真正没懂的地方，回去翻书，只补这一块。',
        '补完再讲一遍，直到能一口气讲顺。',
        '最后造一个类比，类比能在考场上帮你快速重建细节。'
      ]
    },
    {
      id: 'n7',
      title: '一篇论文的阅读顺序',
      tags: ['英语', '方法', '科研'],
      date: '2026-08-24',
      summary: '摘要 → 图表 → 结论 → 方法，最后才看引言。',
      body: [
        '摘要和结论先读，判断这篇值不值得花时间。',
        '接着看图，能看懂图基本就懂了主要贡献。',
        '方法部分挑关键公式看，推导可以跳过。',
        '最后读引言，这时候你会明白作者为什么不厌其烦地铺垫。'
      ]
    },
    {
      id: 'n8',
      title: '月考周复习排期的最小可行方案',
      tags: ['方法', '计划'],
      date: '2026-08-18',
      summary: '按科目权重分配时段，每个时段只干一件事。',
      body: [
        '先把所有科目按学分和难度排权重，权重高的拿黄金时段。',
        '以 90 分钟为一个块，块之间留 15 分钟休息，一天不超过 5 块。',
        '每块结束写一句"今天解决了什么"，第二天照着续。',
        '留一个机动块给突发情况，不然第一天崩了后面全乱。'
      ]
    }
  ],

  /* ===== 学习模块：各科当前状态 ===== */
  subjects: [
    {
      key: 'math', name: '数学', icon: '∑', tone: 'violet',
      state: '在学数飞', level: 'on', progress: 62,
      now: '数飞 · 数列与不等式专题',
      next: '错题按题型归档，每周挑一类回做',
      note: '数飞的题很整，练手感好用。就是容易只记住步骤，所以做完我会问自己一句：换个条件还成立吗。'
    },
    {
      key: 'english', name: '英语', icon: 'A', tone: 'teal',
      state: '作文打磨', level: 'on', progress: 55,
      now: '应用文框架 + 读后续写精修',
      next: '一篇改三遍：结构 → 句式 → 衔接，每遍只动一件事',
      note: '打磨不是重写。先定结构，再换句式，最后抠衔接，一次只改一样才看得出差别。'
    },
    {
      key: 'physics', name: '物理', icon: '⚛', tone: 'gold',
      state: '看黄夫刷题型笔记 + 小自信', level: 'on', progress: 48,
      now: '黄夫题型笔记 · 力学模型',
      next: '看完一个题型，合上书自己推一遍公式怎么来的',
      note: '小自信就是刷完一类题之后的那点底气。攒够了再去碰压轴，别一上来就硬刚。'
    },
    {
      key: 'chemistry', name: '化学', icon: '⚗', tone: 'pink',
      state: '在学一化', level: 'on', progress: 40,
      now: '一化 · 反应原理基础',
      next: '方程式按氧化还原 / 酸碱 / 沉淀整理成一张表',
      note: '一化讲得慢，但扎实。别跳课，跳一节后面全靠猜。'
    },
    {
      key: 'biology', name: '生物', icon: '❀', tone: 'gray',
      state: '目前存在疑惑', level: 'stuck', progress: 25,
      now: '卡在遗传和调节，概念连不成线',
      next: '先列出真正不懂的三个点，挨个问老师或找专题视频',
      note: '不是背得少，是背的东西没地方挂。先把一章的逻辑链画出来，再往里填细节。'
    }
  ],

  /* ===== 学习模块：计划感想 ===== */
  plans: [
    {
      id: 'p1', date: '2026-09-25', cat: '计划',
      title: '为什么把打卡表做成全年 52 周',
      text: '以前用月历打卡，一个月一翻就断。换成 52 周连排之后，断了几天在纸上一眼就看得见。压力刚好，不至于焦虑，但也不好意思空着。'
    },
    {
      id: 'p2', date: '2026-09-22', cat: '感想',
      title: '数学：套路会了 ≠ 会了',
      text: '跟着数飞刷了一阵，速度是快了。上周遇到一道换个问法的题直接卡死，才发现我记的是步骤不是原理。现在做完会补一句：这题到底考什么。'
    },
    {
      id: 'p3', date: '2026-09-18', cat: '复盘',
      title: '英语作文：改三遍比写三篇有用',
      text: '之前一周写三篇新作文，分数一动不动。改成一篇改三遍，第二遍就能看出自己老在哪几个句式上打转。慢，但在长。'
    },
    {
      id: 'p4', date: '2026-09-12', cat: '感想',
      title: '物理需要"小自信"，不是大目标',
      text: '目标从"攻克压轴题"改成"这周吃透斜面模型"。小一点之后，刷完一类题的那点底气是真的，攒着攒着就敢碰难题了。'
    },
    {
      id: 'p5', date: '2026-09-05', cat: '复盘',
      title: '生物：卡住的时候先别硬刷',
      text: '生物越学越乱，后来发现是概念之间没连起来。现在改成先画一章的逻辑链再填细节，比多刷二十道题管用。'
    }
  ],

  /* ===== 计划文件（PDF）===== */
  planFiles: [
    {
      id: 'f1',
      name: '每周打卡表 · 全年 52 周打印版',
      file: 'assets/files/weekly-checklist-52weeks.pdf',
      size: '46 KB',
      desc: '一整年 52 周连排，A4 直接打印。每周一行，做完就涂格，断在哪周一眼看得见。'
    },
    {
      id: 'f2',
      name: '高二三科联动冲刺计划 · 整合版',
      file: 'assets/files/sprint-plan-3subjects.pdf',
      size: '665 KB',
      desc: '把三科的节奏对齐到一个时间表里，避免各学各的、最后互相抢时间。按周推进，留了机动块。'
    }
  ],

  diary: [
    { date: '2026-09-23', weather: '阴', mood: '有点累', text: '连着三天早起有点扛不住，明天给自己放半天。重看了秒速五厘米，结尾还是破防。' },
    { date: '2026-09-16', weather: '晴', mood: '兴奋', text: '第一次把特征值给同学讲明白，讲到一半自己也通了。教一遍比看三遍管用。' },
    { date: '2026-09-12', weather: '多云', mood: '焦虑', text: '月考快到了，进度还差一点。晚上列了清单，把大任务拆成小块，焦虑少了一半。' },
    { date: '2026-09-02', weather: '阴', mood: '期待', text: '新学期第一周，选了三门硬课。定了个小目标：每周至少更一篇笔记。' }
  ],

  anime: [
    {
      title: '你的名字。', year: 2016, stars: 5, tag: '新海诚', progress: '剧场版 · 三刷',
      img: 'assets/img/anime/your-name.jpg',
      comment: '三刷了。到黄昏那段还是会停一下，泷喊出名字的时候心跳是跟着鼓点走的。'
    },
    {
      title: '紫罗兰永恒花园', year: 2018, stars: 5, tag: '催泪', progress: '全13话 + 外传',
      img: 'assets/img/anime/violet-evergarden.jpg',
      comment: '第七集看完缓了一整晚，不敢二刷。京阿尼的画面好到每帧都能截下来当壁纸。'
    },
    {
      title: '咒术回战', year: 2020, stars: 5, tag: '热血', progress: '第一季 + 剧场版',
      img: 'assets/img/anime/jujutsu-kaisen.jpg',
      comment: 'OP 一响人就精神了。涉谷事变那阵子追更新，第二天上课全靠意志力撑着。'
    },
    {
      title: '死神 BLEACH', year: 2004, stars: 5, tag: '热血', progress: '追到破面篇',
      img: 'assets/img/anime/bleach.jpg',
      comment: '小时候每周守着更新的番。现在听到 *〜アスタリスク〜 前奏还是会起鸡皮疙瘩。'
    },
    {
      title: '秒速五厘米', year: 2007, stars: 4, tag: '新海诚', progress: '剧场版 · 两刷',
      img: 'assets/img/anime/5cm-per-second.jpg',
      comment: '第一遍觉得闷，隔了几年再看才懂。有些人就是这么慢慢走散的，谁也没做错什么。'
    }
  ],

  /* ===== 游戏板块 ===== */
  games: [
    {
      title: '我的世界 · 起床战争', en: 'Minecraft Bed Wars',
      platform: 'MC 服务器小游戏', tone: 'gold', hours: '300+ 小时', status: '还在打',
      img: '',
      achievements: ['第一次一打四守住床', '速拆：5 分钟内结束一局', '连着三天上分不掉段'],
      exp: '最上头的是床没了之后那几分钟，到底能不能翻盘。手速和路线规划一半一半，开黑比单排赢面大得多。打久了会发现决定胜负的是资源节奏，不是对刀。'
    },
    {
      title: '鬼泣五', en: 'Devil May Cry 5',
      platform: 'Steam', tone: 'pink', hours: '86 小时', status: '已通关 · 二周目坑着',
      img: 'assets/img/games/dmc5.jpg',
      achievements: ['DMD 难度全 S 评价', '血宫全角色通关', 'V 的章节无伤过'],
      exp: '手感这块的天花板。第一次把连招打顺的时候，那种像在弹钢琴的感觉别的动作游戏给不了。尼禄的机械臂换着玩能玩一晚上，但丁的风格切换才是真正深的地方。'
    },
    {
      title: '极限国度', en: 'Riders Republic',
      platform: 'Steam', tone: 'teal', hours: '52 小时', status: '偶尔上去骑两圈',
      img: 'assets/img/games/riders-republic.jpg',
      achievements: ['第一次飞鼠装穿越峡谷', '自行车赛挤进前三', '50 人混战跑完没摔到底'],
      exp: '当风景游戏玩比当竞速游戏玩舒服。骑到山顶看日落那一下会真的停下来截图。撞车是常态，别较真，翻起来继续骑就行。'
    },
    {
      title: '黑神话：悟空', en: 'Black Myth: Wukong',
      platform: 'Steam', tone: 'violet', hours: '74 小时', status: '二周目推进中',
      img: 'assets/img/games/black-myth.jpg',
      achievements: ['虎先锋无伤', '隐藏地图全找到', '二周目通关'],
      exp: '第一次打幽魂死到怀疑人生，后来发现是节奏没找对，翻滚的时机比挥棍重要。画面和音乐是真的顶，第二章无头僧弹唱那段我反复听了好几遍。'
    },
    {
      title: '传送门 2', en: 'Portal 2',
      platform: 'Steam', tone: 'teal', hours: '19 小时', status: '已通关',
      img: 'assets/img/games/portal2.jpg',
      achievements: ['单人模式通关', '合作模式全章节', '拿齐所有成就'],
      exp: '解谜设计太聪明，每个新机制都是先教你再考你。玩到后面开始用传送门玩赖的时候最好玩。剧情里那种客客气气的黑色幽默也很上头。'
    },
    {
      title: '极限竞速：地平线 4', en: 'Forza Horizon 4',
      platform: 'Steam', tone: 'gold', hours: '120 小时', status: '常驻硬盘',
      img: 'assets/img/games/forza4.jpg',
      achievements: ['冬季达喀尔第一', '车房宝物全收集', '四季赛道全金牌'],
      exp: '开车兜风用的，不是拿来卷成绩的。秋天那条林间公路我反复跑过很多次。英国乡间的天气做得太好，下雨的时候开着敞篷都舍不得按跳过。'
    },
    {
      title: '后室', en: 'Escape the Backrooms',
      platform: 'Steam', tone: 'gray', hours: '23 小时', status: '跟朋友开黑才开',
      img: 'assets/img/games/backrooms.jpg',
      achievements: ['单人逃出 Level 0', '四人全队通关', '零道具通关一次'],
      exp: '和三个朋友开黑最吓人，走散之后迷路是真慌。音效做得太狠，戴耳机玩需要点勇气。不过套路熟了之后恐怖感会掉，得靠新关卡续命。'
    }
  ],

  genres: [
    { id: 'all', name: '全部' },
    { id: 'rnb', name: 'R&B / Soul' },
    { id: 'hiphop', name: 'Hip-Hop' },
    { id: 'jazz', name: 'Jazz' },
    { id: 'funk', name: 'Funk / Disco' },
    { id: 'pop', name: 'Pop' },
    { id: 'citypop', name: 'City Pop' },
    { id: 'anime', name: '动漫歌' }
  ],

  artists: [
    { name: '方大同', en: 'Khalil Fong', genre: 'R&B / Soul', img: 'assets/img/artists/khalil.jpg', why: '中文 R&B 的天花板。转音和和声编写干净到不像华语流行，听他的歌会想学乐理。' },
    { name: '迈克尔·杰克逊', en: 'Michael Jackson', genre: 'Pop / Funk', img: 'assets/img/artists/michael.jpg', why: '节奏感这件事的终极答案。Beat It 的鼓点一响，身体比脑子先反应。' },
    { name: '马文·盖伊', en: 'Marvin Gaye', genre: 'Soul', img: 'assets/img/artists/marvin.jpg', why: 'What is going on 把灵魂乐写成了时代记录。声音里有一种温柔的疲惫。' },
    { name: '史蒂夫·汪达', en: 'Stevie Wonder', genre: 'Soul / Funk', img: 'assets/img/artists/stevie.jpg', why: '一个人就是一支乐队。Superstition 的 riff 是放克教科书第一课。' }
  ],

  music: [
    { title: '爱爱爱', artist: '方大同', genre: 'rnb', mood: '温柔', dur: 258, line: '中文 R&B 的入门曲，转音丝滑，和声一层层叠上去的时候最上头。' },
    { title: '三人游', artist: '方大同', genre: 'rnb', mood: '深夜', dur: 271, line: '三个人之间最礼貌也最残忍的距离，他唱得很克制。' },
    { title: 'Singalongsong', artist: '方大同', genre: 'rnb', mood: '轻快', dur: 245, line: '适合走路听，节奏会让人步频变快。' },
    { title: "What's Going On", artist: 'Marvin Gaye', genre: 'rnb', mood: '沉思', dur: 233, line: '1971 年的歌，今天听依然像在回答现在的问题。' },
    { title: 'Sexual Healing', artist: 'Marvin Gaye', genre: 'rnb', mood: '深夜', dur: 239, line: '合成器和人声之间那层空气，是八十年代最性感的留白。' },
    { title: "Isn't She Lovely", artist: 'Stevie Wonder', genre: 'rnb', mood: '开心', dur: 388, line: '写给女儿的歌，前奏的口琴一响心情就会变好。' },
    { title: 'Superstition', artist: 'Stevie Wonder', genre: 'funk', mood: '上头', dur: 245, line: '放克 riff 的天花板，鼓和贝斯咬合得像齿轮。' },
    { title: 'Sir Duke', artist: 'Stevie Wonder', genre: 'funk', mood: '热血', dur: 232, line: '致敬爵士乐大师的一首，铜管一出来整个人就站起来了。' },
    { title: 'Billie Jean', artist: 'Michael Jackson', genre: 'pop', mood: '经典', dur: 294, line: '那个贝斯线只有四个音，却撑起了整个流行乐史。' },
    { title: 'Man in the Mirror', artist: 'Michael Jackson', genre: 'pop', mood: '沉思', dur: 301, line: '想改变世界，先照镜子。副歌的合唱每次都起鸡皮疙瘩。' },
    { title: "Don't Stop 'Til You Get Enough", artist: 'Michael Jackson', genre: 'funk', mood: '舞池', dur: 362, line: '假声一开， disco 球就转起来了。' },
    { title: 'September', artist: 'Earth, Wind & Fire', genre: 'funk', mood: '舞池', dur: 215, line: '全世界婚礼和年会的保险曲目，谁听都会晃。' },
    { title: 'HUMBLE.', artist: 'Kendrick Lamar', genre: 'hiphop', mood: '狠', dur: 177, line: '钢琴 + 808，极简却压得人喘不过气。' },
    { title: 'Money Trees', artist: 'Kendrick Lamar', genre: 'hiphop', mood: '深夜', dur: 386, line: '西海岸叙事的代表作，副歌那段旋律太抓人。' },
    { title: 'No Role Modelz', artist: 'J. Cole', genre: 'hiphop', mood: '松弛', dur: 292, line: '采样做得很软，适合开车时听。' },
    { title: '关于小熊', artist: '蛋堡 Soft Lipa', genre: 'hiphop', mood: '叙事', dur: 274, line: '中文 hip-hop 里少见的温柔叙事，讲一只玩偶的一生。' },
    { title: 'So What', artist: 'Miles Davis', genre: 'jazz', mood: '酷', dur: 545, line: '调式爵士的入门砖，贝斯那句 riff 听一次就会哼。' },
    { title: 'My Favorite Things', artist: 'John Coltrane', genre: 'jazz', mood: '漫游', dur: 803, line: '把一首轻快的歌吹成了冥想，适合深夜写东西。' },
    { title: 'Waltz for Debby', artist: 'Bill Evans', genre: 'jazz', mood: '安静', dur: 401, line: '钢琴三重奏的最佳注解，每个音都很客气。' },
    { title: 'Plastic Love', artist: '竹内まりや', genre: 'citypop', mood: '都市夜', dur: 393, line: 'City Pop 的代名词，前奏贝斯一响就是霓虹街道。' },
    { title: 'Ride On Time', artist: '山下達郎', genre: 'citypop', mood: '夏日', dur: 293, line: '夏天、海边、车里，这首歌是为这三个词写的。' },
    { title: '前前前世', artist: 'RADWIMPS', genre: 'anime', mood: '热血', dur: 285, line: '《你的名字。》为了见你跑过整座城市的冲劲，鼓点就是心跳。' },
    { title: 'スパークル', artist: 'RADWIMPS', genre: 'anime', mood: '黄昏', dur: 380, line: '《你的名字。》黄昏曲，和本站背景绝配。' },
    { title: 'Sincerely', artist: 'TRUE', genre: 'anime', mood: '治愈', dur: 284, line: '《紫罗兰永恒花园》OP，薇尔莉特学会"爱"的那段旅程全在这首里。' },
    { title: '*〜アスタリスク〜', artist: 'ORANGE RANGE', genre: 'anime', mood: '热血', dur: 254, line: '《死神》OP1，一响就回到每周追更新的晚上。' },
    { title: '廻廻奇譚', artist: 'ヒトリエ', genre: 'anime', mood: '狠', dur: 203, line: '《咒术回战》OP1，副歌的爆发力像被咒力砸了一下。' }
  ],

  experiences: [
    {
      id: 'e1',
      title: '月考周复习排期模板（附表格）',
      author: 'theo',
      cat: '备考',
      date: '2026-09-10',
      likes: 32,
      summary: '科目按学分和难度排个权重，切成 90 分钟的块塞进日历，比想到哪学到哪强不少。',
      body: [
        '先给每科排个权重：学分 × 难度 × (1 - 掌握度)。',
        '按权重从高往日历里塞时间块，一天最多五块，留一块机动。',
        '每块结束写一句产出，写不出来就是这块时间在划水。',
        '要模板的话在下面留言，我打包发你。'
      ]
    },
    {
      id: 'e3',
      title: '主课之外的三个免费学习资源',
      author: '团子',
      cat: '资源',
      date: '2026-08-20',
      likes: 25,
      summary: '公开课、习题库，还有一本被低估的教材。都免费，都能直接拿来用。',
      body: [
        '公开课挑带作业和考试的，光看视频记不住。',
        '习题库用来对答案，别拿来抄，抄完等于没做。',
        '教材：学校指定的那本不一定最清楚，图书馆多翻两本对比一下。',
        '资源不用多，一套啃完比收藏一百个链接强。'
      ]
    }
  ],

  skills: [
    { name: '算法与数据结构', lv: 72 },
    { name: '英语阅读', lv: 65 },
    { name: '数学基础', lv: 58 },
    { name: '写作与表达', lv: 80 },
    { name: '前端折腾', lv: 46 }
  ]
};
