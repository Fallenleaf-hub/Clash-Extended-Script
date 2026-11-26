function main(config) {
  // 1. 保留该订阅原本抓取到的所有节点
  const rawProxies = config.proxies || [];

  // 2. 地区正则测速分组（设置 tolerance: 50 避免 1ms 波动导致频繁切节点断流）
  const autoGroups = [
    {
      name: "香港节点",
      type: "url-test",
      interval: 600,
      tolerance: 50,
      filter: "(?i)(🇭🇰|(?<![a-zA-Z])HK(?![a-zA-Z])|Hong|香港|深港|沪港|京港|港)",
      "include-all": true
    },
    {
      name: "台湾节点",
      type: "url-test",
      interval: 600,
      tolerance: 50,
      filter: "(?i)(🇹🇼|(?<![a-zA-Z])(TW|TWN)(?![a-zA-Z])|Taiwan|Taipei|台湾|台灣|台北|台中|新北|彰化)",
      "include-all": true
    },
    {
      name: "日本节点",
      type: "url-test",
      interval: 600,
      tolerance: 50,
      filter: "(?i)(🇯🇵|(?<![a-zA-Z])JP(?![a-zA-Z])|Japan|Tokyo|日本|东京|大阪|京日|苏日|沪日|上日|川日|深日|广日)",
      "include-all": true
    },
    {
      name: "新加坡节点",
      type: "url-test",
      interval: 600,
      tolerance: 50,
      filter: "(?i)(🇸🇬|(?<![a-zA-Z])SG(?![a-zA-Z])|(?<![a-zA-Z])Sing|新加坡|狮城|沪新|京新|深新|杭新|广新)",
      "include-all": true
    },
    {
      name: "韩国节点",
      type: "url-test",
      interval: 600,
      tolerance: 50,
      filter: "(?i)(🇰🇷|(?<![a-zA-Z])(KR|KOR)(?![a-zA-Z])|Korea|韩国|首尔|韩|韓|春川)",
      "include-all": true
    },
    {
      name: "美国节点",
      type: "url-test",
      interval: 600,
      tolerance: 50,
      filter: "(?i)(🇺🇸|(?<![a-zA-Z])(US|USA)(?![a-zA-Z])|America|United States|美国|凤凰城|洛杉矶|西雅图|芝加哥|纽约|沪美|美)",
      "include-all": true
    },
    {
      name: "土耳其节点",
      type: "url-test",
      interval: 600,
      tolerance: 50,
      filter: "(?i)(🇹🇷|(?<![a-zA-Z])TR(?![a-zA-Z])|Turkey|Istanbul|土耳其|伊斯坦布尔)",
      "include-all": true
    },
    {
      name: "印度节点",
      type: "url-test",
      interval: 600,
      tolerance: 50,
      filter: "(?i)(🇮🇳|(?<![a-zA-Z])(IN|IND)(?![a-zA-Z])|India|Mumbai|Delhi|印度|孟买|德里)",
      "include-all": true
    },
    {
      name: "菲律宾节点",
      type: "url-test",
      interval: 600,
      tolerance: 50,
      filter: "(?i)(🇵🇭|(?<![a-zA-Z])(PH|PHL)(?![a-zA-Z])|Philippines|Manila|菲律宾|马尼拉)",
      "include-all": true
    }
  ];

  // 包含新地区的分组列表
  const standardProxies = [
    "PROXY",
    "香港节点",
    "台湾节点",
    "日本节点",
    "新加坡节点",
    "韩国节点",
    "美国节点",
    "土耳其节点",
    "印度节点",
    "菲律宾节点",
    "DIRECT"
  ];

  // 节点选择主策略组（包含所有地区组 + 机场所有节点）
  const manualGroup = {
    name: "PROXY",
    type: "select",
    proxies: [
      "香港节点",
      "台湾节点",
      "日本节点",
      "新加坡节点",
      "韩国节点",
      "美国节点",
      "土耳其节点",
      "印度节点",
      "菲律宾节点",
      "DIRECT"
    ].concat(rawProxies.map(p => p.name))
  };

  // 3. 业务策略组列表
  const customGroups = [
    manualGroup,
    { name: "AI", type: "select", proxies: standardProxies },
    { name: "YouTube", type: "select", proxies: standardProxies },
    { name: "Netflix", type: "select", proxies: standardProxies },
    { name: "Disney+", type: "select", proxies: standardProxies },
    { name: "Max", type: "select", proxies: standardProxies },
    { name: "TikTok", type: "select", proxies: standardProxies },
    { name: "Spotify", type: "select", proxies: standardProxies },
    { name: "Telegram", type: "select", proxies: standardProxies },
    { name: "Twitter", type: "select", proxies: standardProxies },
    { name: "Facebook", type: "select", proxies: standardProxies },
    { name: "PayPal", type: "select", proxies: standardProxies },
    { name: "Amazon", type: "select", proxies: standardProxies },
    { name: "苹果服务", type: "select", proxies: standardProxies },
    { name: "谷歌服务", type: "select", proxies: standardProxies },
    { name: "微软服务", type: "select", proxies: standardProxies },
    { name: "哔哩哔哩", type: "select", proxies: ["DIRECT", "PROXY", "香港节点", "台湾节点"] },
    { name: "游戏平台", type: "select", proxies: standardProxies },
    ...autoGroups
  ];

  config["proxy-groups"] = customGroups;

  // 4. 规则集定义（显式指定 format: "text" 与 Clash 专用规则源，修复 RuleCount=0 失效问题）
  config["rule-providers"] = {
    ai: {
      type: "http",
      behavior: "classical",
      format: "yaml",
      url: "https://testingcf.jsdelivr.net/gh/VPSDance/ai-proxy-rules@main/rules/clash/global.yaml",
      path: "./ruleset/ai-vpsdance.yaml",
      interval: 86400
    },
    ByteDance: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/ByteDance/ByteDance.list",
      path: "./ruleset/ByteDance.list",
      interval: 86400
    },
    youtube: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/YouTube/YouTube.list",
      path: "./ruleset/youtube.list",
      interval: 86400
    },
    netflix: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Netflix/Netflix.list",
      path: "./ruleset/netflix.list",
      interval: 86400
    },
    disney: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Disney/Disney.list",
      path: "./ruleset/disney.list",
      interval: 86400
    },
    hbo: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/HBO/HBO.list",
      path: "./ruleset/hbo.list",
      interval: 86400
    },
    spotify: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Spotify/Spotify.list",
      path: "./ruleset/spotify.list",
      interval: 86400
    },
    telegram: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Telegram/Telegram.list",
      path: "./ruleset/telegram.list",
      interval: 86400
    },
    paypal: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/PayPal/PayPal.list",
      path: "./ruleset/paypal.list",
      interval: 86400
    },
    twitter: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Twitter/Twitter.list",
      path: "./ruleset/twitter.list",
      interval: 86400
    },
    facebook: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Facebook/Facebook.list",
      path: "./ruleset/facebook.list",
      interval: 86400
    },
    amazon: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Amazon/Amazon.list",
      path: "./ruleset/amazon.list",
      interval: 86400
    },
    sony: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Sony/Sony.list",
      path: "./ruleset/sony.list",
      interval: 86400
    },
    nintendo: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Nintendo/Nintendo.list",
      path: "./ruleset/nintendo.list",
      interval: 86400
    },
    epic: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Epic/Epic.list",
      path: "./ruleset/epic.list",
      interval: 86400
    },
    steamcn: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/SteamCN/SteamCN.list",
      path: "./ruleset/steamcn.list",
      interval: 86400
    },
    steam: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Steam/Steam.list",
      path: "./ruleset/steam.list",
      interval: 86400
    },
    game: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Game/Game.list",
      path: "./ruleset/game.list",
      interval: 86400
    },
    github: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GitHub/GitHub.list",
      path: "./ruleset/github.list",
      interval: 86400
    },
    microsoft: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Microsoft/Microsoft.list",
      path: "./ruleset/microsoft.list",
      interval: 86400
    },
    google: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Google/Google.list",
      path: "./ruleset/google.list",
      interval: 86400
    },
    apple: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Apple/Apple.list",
      path: "./ruleset/apple.list",
      interval: 86400
    },
    bilibili: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/BiliBili/BiliBili.list",
      path: "./ruleset/bilibili.list",
      interval: 86400
    },
    tiktok: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/TikTok/TikTok.list",
      path: "./ruleset/tiktok.list",
      interval: 86400
    },
    global: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Global/Global.list",
      path: "./ruleset/global.list",
      interval: 86400
    },
    china: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/ChinaMax/ChinaMax.list",
      path: "./ruleset/china.list",
      interval: 86400
    },
    lan: {
      type: "http",
      behavior: "classical",
      format: "text",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Lan/Lan.list",
      path: "./ruleset/lan.list",
      interval: 86400
    },
    pikpak: {
      type: "http",
      behavior: "classical",
      format: "yaml",
      url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/PikPak/PikPak.yaml",
      path: "./ruleset/pikpak.yaml",
      interval: 86400
    },
    direct: {
      type: "http",
      behavior: "domain",
      format: "yaml",
      url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/direct.txt",
      path: "./ruleset/direct.txt",
      interval: 86400
    },
    proxy: {
      type: "http",
      behavior: "domain",
      format: "yaml",
      url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/proxy.txt",
      path: "./ruleset/proxy.txt",
      interval: 86400
    }
  };

  // 5. 分流规则链
  config["rules"] = [
    "DOMAIN-SUFFIX,blowingsnowclouds.cc,DIRECT",
    "DOMAIN-SUFFIX,cyberguard-u1s1.top,DIRECT",
    "RULE-SET,lan,DIRECT",
    "RULE-SET,ai,AI",
    "RULE-SET,youtube,YouTube",
    "RULE-SET,netflix,Netflix",
    "RULE-SET,disney,Disney+",
    "DOMAIN-SUFFIX,litix.io,Max",
    "DOMAIN-SUFFIX,discomax.com,Max",
    "DOMAIN-SUFFIX,brightline.tv,Max",
    "RULE-SET,hbo,Max",
    "RULE-SET,spotify,Spotify",
    "RULE-SET,telegram,Telegram",
    "RULE-SET,paypal,PayPal",
    "RULE-SET,twitter,Twitter",
    "RULE-SET,facebook,Facebook",
    "RULE-SET,amazon,Amazon",
    "RULE-SET,sony,游戏平台",
    "RULE-SET,nintendo,游戏平台",
    "RULE-SET,epic,游戏平台",
    "RULE-SET,steamcn,DIRECT",
    "RULE-SET,steam,游戏平台",
    "RULE-SET,game,游戏平台",
    "RULE-SET,github,PROXY",
    "RULE-SET,microsoft,微软服务",
    "RULE-SET,google,谷歌服务",
    "RULE-SET,apple,苹果服务",
    "RULE-SET,bilibili,哔哩哔哩",
    "RULE-SET,tiktok,TikTok",
    "RULE-SET,pikpak,新加坡节点",
    "RULE-SET,ByteDance,DIRECT",
    "RULE-SET,direct,DIRECT",
    "RULE-SET,china,DIRECT",
    "RULE-SET,proxy,PROXY",
    "RULE-SET,global,PROXY",
    "GEOIP,CN,DIRECT",
    "MATCH,PROXY"
  ];

  return config;
}
