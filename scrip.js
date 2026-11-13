// Clash Verge 扩展脚本：Claude 组支持 REJECT、节点选择和指定的固定代理。

// 国内 DNS 服务器
const domesticNameservers = [
  "https://dns.alidns.com/dns-query", // 阿里云公共 DNS
  "https://doh.pub/dns-query", // 腾讯 DNSPod
  "https://doh.360.cn/dns-query" // 360 安全 DNS
];

// 国外 DNS 服务器
const foreignNameservers = [
  "https://1.1.1.1/dns-query", // Cloudflare（主）
  "https://1.0.0.1/dns-query", // Cloudflare（备）
  "https://208.67.222.222/dns-query", // OpenDNS（主）
  "https://208.67.220.220/dns-query", // OpenDNS（备）
  "https://194.242.2.2/dns-query", // Mullvad（主）
  "https://194.242.2.3/dns-query" // Mullvad（备）
];

// DNS 配置
const dnsConfig = {
  "enable": true,
  "listen": "0.0.0.0:1053",
  "ipv6": true,
  "use-system-hosts": false,
  "cache-algorithm": "arc",
  "enhanced-mode": "fake-ip",
  "fake-ip-range": "198.18.0.1/16",
  "fake-ip-filter": [
    // 本地主机、设备
    "+.lan",
    "+.local",
    // Windows 网络检测
    "+.msftconnecttest.com",
    "+.msftncsi.com",
    // QQ 快速登录检测
    "localhost.ptlogin2.qq.com",
    "localhost.sec.qq.com",
    // 微信快速登录检测
    "localhost.work.weixin.qq.com"
  ],
  "default-nameserver": ["223.5.5.5", "119.29.29.29", "1.1.1.1", "8.8.8.8"],
  "nameserver": [...domesticNameservers, ...foreignNameservers],
  "proxy-server-nameserver": [...domesticNameservers, ...foreignNameservers],
  "nameserver-policy": {
    "geosite:private,cn,geolocation-cn": domesticNameservers,
    "geosite:google,youtube,telegram,gfw,geolocation-!cn": foreignNameservers
  }
};

// 规则集通用配置
const ruleProviderCommon = {
  "type": "http",
  "format": "yaml",
  "interval": 86400
};

// 规则集配置：从自有仓库 release 分支下载。
const ruleProviders = {
  "custom-direct": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/lieeew/rules-lite@release/direct-rules.txt",
    "path": "./ruleset/lieeew/direct-rules.yaml"
  },
  "reject": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/lieeew/rules-lite@release/reject.txt",
    "path": "./ruleset/lieeew/reject.yaml"
  },
  "icloud": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/lieeew/rules-lite@release/icloud.txt",
    "path": "./ruleset/lieeew/icloud.yaml"
  },
  "apple": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/lieeew/rules-lite@release/apple.txt",
    "path": "./ruleset/lieeew/apple.yaml"
  },
  "google": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/lieeew/rules-lite@release/google.txt",
    "path": "./ruleset/lieeew/google.yaml"
  },
  "proxy": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/lieeew/rules-lite@release/proxy.txt",
    "path": "./ruleset/lieeew/proxy.yaml"
  },
  "direct": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/lieeew/rules-lite@release/direct.txt",
    "path": "./ruleset/lieeew/direct.yaml"
  },
  "private": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/lieeew/rules-lite@release/private.txt",
    "path": "./ruleset/lieeew/private.yaml"
  },
  "gfw": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/lieeew/rules-lite@release/gfw.txt",
    "path": "./ruleset/lieeew/gfw.yaml"
  },
  "tld-not-cn": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/lieeew/rules-lite@release/tld-not-cn.txt",
    "path": "./ruleset/lieeew/tld-not-cn.yaml"
  },
  "telegramcidr": {
    ...ruleProviderCommon,
    "behavior": "ipcidr",
    "url": "https://fastly.jsdelivr.net/gh/lieeew/rules-lite@release/telegramcidr.txt",
    "path": "./ruleset/lieeew/telegramcidr.yaml"
  },
  "cncidr": {
    ...ruleProviderCommon,
    "behavior": "ipcidr",
    "url": "https://fastly.jsdelivr.net/gh/lieeew/rules-lite@release/cncidr.txt",
    "path": "./ruleset/lieeew/cncidr.yaml"
  },
  "lancidr": {
    ...ruleProviderCommon,
    "behavior": "ipcidr",
    "url": "https://fastly.jsdelivr.net/gh/lieeew/rules-lite@release/lancidr.txt",
    "path": "./ruleset/lieeew/lancidr.yaml"
  },
  "applications": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/lieeew/rules-lite@release/applications.txt",
    "path": "./ruleset/lieeew/applications.yaml"
  },
  "openai": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/lieeew/rules-lite@release/OpenAI.yaml",
    "path": "./ruleset/lieeew/openai.yaml"
  }
};

// 规则按照顺序匹配，Claude 规则优先。
const rules = [
  // Claude
  "DOMAIN-SUFFIX,anthropic.com,Claude",
  "DOMAIN-SUFFIX,claude.ai,Claude",
  "DOMAIN-SUFFIX,claude.com,Claude",
  "DOMAIN-SUFFIX,claudeusercontent.com,Claude",
  "DOMAIN-SUFFIX,claudemcpcontent.com,Claude",
  "DOMAIN-SUFFIX,intercomcdn.com,Claude",
  "DOMAIN-SUFFIX,facebook.net,Claude",
  "DOMAIN-SUFFIX,snapcraft.io,Claude",
  "DOMAIN-SUFFIX,intercom.io,Claude",
  "DOMAIN-SUFFIX,ubuntu.com,Claude",
  "DOMAIN-SUFFIX,sentry.io,Claude",
  "DOMAIN-SUFFIX,githubusercontent.com,Claude",
  "DOMAIN-SUFFIX,datadoghq.com,Claude",
  "DOMAIN,http-intake.logs.us5.datadoghq.com,Claude",
  "DOMAIN,browser-intake-us5-datadoghq.com,Claude",
  // 自定义规则
  "DOMAIN-SUFFIX,googleapis.cn,节点选择", // Google 服务
  "DOMAIN-SUFFIX,gstatic.com,节点选择", // Google 静态资源
  "DOMAIN-SUFFIX,xn--ngstr-lra8j.com,节点选择", // Google Play 下载服务
  "DOMAIN-SUFFIX,github.io,节点选择", // GitHub Pages
  "DOMAIN,v2rayse.com,节点选择", // V2rayse 节点工具
  // 自定义直连规则
  "RULE-SET,custom-direct,全局直连",
  // blackmatrix7 规则集
  "RULE-SET,openai,节点选择",
  // Loyalsoldier 规则集
  "RULE-SET,applications,全局直连",
  "RULE-SET,private,全局直连",
  "RULE-SET,reject,广告过滤",
  "RULE-SET,icloud,微软服务",
  "RULE-SET,apple,节点选择",
  "RULE-SET,google,节点选择",
  "RULE-SET,proxy,节点选择",
  "RULE-SET,gfw,节点选择",
  "RULE-SET,tld-not-cn,节点选择",
  "RULE-SET,direct,全局直连",
  "RULE-SET,lancidr,全局直连,no-resolve",
  "RULE-SET,cncidr,全局直连,no-resolve",
  "RULE-SET,telegramcidr,节点选择,no-resolve",
  // 其他规则
  "GEOIP,LAN,全局直连,no-resolve",
  "GEOIP,CN,全局直连,no-resolve",
  "MATCH,漏网之鱼"
];

// 代理组通用配置
const groupBaseOption = {
  "interval": 300,
  "timeout": 3000,
  "url": "https://www.google.com/generate_204",
  "lazy": true,
  "max-failed-times": 3,
  "hidden": false
};

// 程序入口
function main(config) {
  const proxyCount = config?.proxies?.length ?? 0;
  const proxyProviderCount = Object.keys(config?.["proxy-providers"] || {}).length;
  if (proxyCount === 0 && proxyProviderCount === 0) {
    throw new Error("配置文件中未找到任何代理");
  }

  config["dns"] = dnsConfig;

  // 所有代理组在这里统一定义。
  config["proxy-groups"] = [
    {
      ...groupBaseOption,
      "name": "节点选择",
      "type": "select",
      "proxies": [],
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg"
    },
    {
      ...groupBaseOption,
      "name": "Claude",
      "type": "select",
      "proxies": ["REJECT", "节点选择"],
      "use": Object.keys(config["proxy-providers"] || {}),
      "include-all-proxies": true,
      // 仅引入这个固定代理；节点不存在时，仍可选择 REJECT 或节点选择。
      "filter": "^f4675880-singbox_hysteria2$",
      "default-selected": "f4675880-singbox_hysteria2",
      "empty-fallback": "REJECT",
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/claude.svg"
    },
    {
      ...groupBaseOption,
      "name": "微软服务",
      "type": "select",
      "proxies": ["全局直连", "节点选择"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/microsoft.svg"
    },
    {
      ...groupBaseOption,
      "name": "漏网之鱼",
      "type": "select",
      "proxies": ["节点选择"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg"
    },
    {
      ...groupBaseOption,
      "name": "谷歌服务",
      "type": "select",
      "proxies": ["节点选择", "全局直连"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/google.svg"
    },
    {
      ...groupBaseOption,
      "name": "国外媒体",
      "type": "select",
      "proxies": ["节点选择", "全局直连"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/youtube.svg"
    },
    {
      ...groupBaseOption,
      "name": "苹果服务",
      "type": "select",
      "proxies": ["节点选择", "全局直连"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/apple.svg"
    },
    {
      ...groupBaseOption,
      "name": "广告过滤",
      "type": "select",
      "proxies": ["REJECT", "DIRECT"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/bug.svg"
    },
    {
      ...groupBaseOption,
      "name": "全局直连",
      "type": "select",
      "proxies": ["DIRECT"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/link.svg"
    },
    {
      ...groupBaseOption,
      "name": "全局拦截",
      "type": "select",
      "proxies": ["REJECT", "DIRECT"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/block.svg"
    }
  ];

  config["rule-providers"] = ruleProviders;
  config["rules"] = rules;

  return config;
}
