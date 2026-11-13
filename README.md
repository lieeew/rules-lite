# rules-lite

个人 Clash 规则仓库，包含自定义规则、规则集副本和 Clash Verge 扩展脚本。

## 文件说明

| 文件 | 用途 |
| --- | --- |
| `scrip.js` | Clash Verge 扩展脚本，配置 DNS、代理组和规则集 |
| `direct-rules.txt` | 自定义直连规则，支持 `DOMAIN-KEYWORD` 等 classical 规则 |
| `proxy-rules.txt` | 自定义代理规则 |
| `microsoft-rules.txt` | 自定义微软服务规则 |
| `blacklist-rules.txt` | 自定义拦截规则 |
| `reject.txt`、`icloud.txt`、`apple.txt`、`google.txt`、`proxy.txt`、`direct.txt`、`private.txt`、`gfw.txt`、`tld-not-cn.txt` | domain 格式规则集 |
| `telegramcidr.txt`、`cncidr.txt`、`lancidr.txt` | ipcidr 格式规则集 |
| `applications.txt`、`OpenAI.yaml` | classical 格式规则集 |
| `rules.txt` | 原始域名列表，脚本未直接引用 |

脚本目前接入上述规则集副本及 `direct-rules.txt`；另外三份自定义规则文件尚未接入脚本。`direct.txt` 已移除包含 `cloudflare` 的条目；鱼皮产品的关键词直连规则放在 `direct-rules.txt` 中。

## 使用

1. 在 Clash Verge 的扩展脚本中使用 `scrip.js` 的内容。
2. 保留订阅中的代理节点或代理提供者。脚本会替换 DNS、代理组、规则及规则集配置。
3. Claude 组可选择 `REJECT`、`节点选择`，以及名称为 `f4675880-singbox_hysteria2` 的固定节点；按需修改脚本中的节点名。

规则下载地址统一为：

```text
https://fastly.jsdelivr.net/gh/lieeew/rules-lite@release/<文件名>
```

例如：

```text
https://fastly.jsdelivr.net/gh/lieeew/rules-lite@release/direct.txt
https://fastly.jsdelivr.net/gh/lieeew/rules-lite@release/direct-rules.txt
```

## 修改与发布

- 编辑对应的规则文件。YAML 规则集保留 `payload:`，条目格式须与脚本中的 `behavior` 一致；domain 文件不能直接写入 `DOMAIN-KEYWORD`。
- 将规则修改推送到 `main`，或手动运行 **Generate Rules for Clash** 工作流。
- 工作流将根目录的 `.txt` 和 `.yaml` 文件发布到 `release` 分支及 GitHub Release，并请求刷新 CDN 缓存。
- 发布完成后，在 Clash 中刷新规则集；修改脚本后需同步更新客户端中的扩展脚本。

规则集是保存在本仓库中的副本，工作流不会自动同步上游内容。

## 来源

项目基于 [zhanyeye/clash-rules-lite](https://github.com/zhanyeye/clash-rules-lite)；规则集来自 [Loyalsoldier/clash-rules](https://github.com/Loyalsoldier/clash-rules) 和 [blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script)，在此基础上作个人调整。
