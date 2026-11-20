# GetNice 首页图片对照与 HSM 生成方案

参考：[GetNice 首页](https://getnice.com/)。参考素材仅保存在 `reference-getnice/` 供本地分析，不用于 HSM 网站。`reference-getnice/source/` 保存从参考站提取的九张原图，目录下其他图片是网页截屏中的位置裁切。生成时使用 HSM 原始产品图作为形状参考，不使用参考站品牌、产品或人物。

| 位置 | 参考图 | 观察到的摄影处理 | HSM 对应位置和提示词 |
| --- | --- | --- | --- |
| 首屏右侧 | `source/hero.jpg` | 手与产品近景，暖色皮肤高光，深色虚化背景，低调侧光，浅景深；图片本身偏暗，未证实有额外蒙版 | `hero-flow`、`hero-level`、`hero-pressure`：保持各型号外形，换成工程师检查传感器的近景 |
| 第一组大图，左侧 | `source/feature1.jpg` | 冷灰蓝背景，宽大的白色实体展台，柔和漫射光，产品完整展示 | `feature-flow`：HSM20 在白色展台上 |
| 第二组大图，右侧 | `source/feature2.jpg` | 同一影棚风格，产品位于白色立方体上，留白较多；旁边是独立深色文案区 | `feature-level`：液位探头和线缆陈列在白色展台上 |
| 双列故事图 | `source/story1.png`、`source/story2.png` | 黑白暗调纪实，颗粒感，人物和动作特写；下半部是独立深色文字面板 | `story-factory`、`story-custom`：检测和调试传感器的虚构场景，不作为真实员工或客户背书 |
| 资源横幅，右侧 | `source/banner.jpg` | 明亮自然光，人物在真实使用环境交流，横向裁切 | `resource-banner`：工程师讨论传感器的示意场景 |
| 三张资源卡 | `source/guide1.jpg`、`source/guide2.jpg`、`source/guide3.jpg` | 浅景深、近距离使用场景；暗色与明亮自然光交替 | `guide-output`、`guide-level`、`guide-ip`：分别展示流量、液位和传感器处理场景 |
| 两张底部产品卡 | 复用 `source/feature1.jpg`、`source/feature2.jpg` | 与两组大图同一组影棚画面，横向浅裁切 | `product-flow`、`product-level`：对应 HSM 两个真实型号 |

每个位置完整英文生成提示词、HSM 产品参考图文件名及对应区块，见 [reference-image-prompts.json](reference-image-prompts.json)。生成图为示意图，必须检查型号外形、接头、探头、仪表文字和安装方式；不得代替实拍图用于确认技术规格。色调和构图为人工对照，不能单凭主观观感宣称达到 90% 相似度。
