// Source photographs remain unchanged. Crops align the product bodies on white canvases.
export const MS20Product = {
  id: "ms20", name: "PACOM 多功能传感器", model: "MS20", base: "/images/devices/ms20/",
  views: [
    { name: "正面", file: "ms20-front.png", size: 1500, crop: [65, 65, 1370], alt: "MS20 正面，显示中央透镜、上方圆形窗口和下方开孔" },
    { name: "前侧斜视图", file: "ms20-perspective.png", size: 1500, crop: [65, 65, 1370], alt: "MS20 前侧斜视图，显示机身厚度和侧面开孔" },
    { name: "背面底盖", file: "ms20-back-cover.png", size: 1500, crop: [65, 65, 1370], alt: "MS20 背面底盖，显示安装槽和底盖卡扣" },
    { name: "移除底盖的背面", file: "ms20-back-open.png", size: 1500, crop: [65, 65, 1370], alt: "MS20 移除底盖的背面，显示接口、铭牌以及 BOOT 和 RESET 孔位" },
  ],
  overviewViews: [0, 3],
  groups: [
    { name: "产品概览", rows: [["产品名称", "PACOM 多功能传感器"], ["型号", "MS20"], ["外观", "圆形机身"], ["安装底盖", "背面可拆卸底盖"]] },
    { name: "铭牌与外观", rows: [["输入电压标识", "9–24 VDC"], ["接口标识", "DALI interface"], ["维护孔位标识", "BOOT / RESET"]] },
  ],
  note: "本页展示产品外观和铭牌标识。测量性能、接口定义、安装接线及配置步骤将在对应技术资料确认后补充。",
  tabs: [{ id: "overview", name: "产品概览" }, { id: "gallery", name: "产品图片" }],
};

export const AQ20Product = {
  id: "aq20", name: "PACOM 空气质量传感器", model: "AQ20", base: "/images/devices/aq20/",
  views: [
    { name: "正面", file: "aq20-front.png", size: 2500, crop: [12, 42, 2500], alt: "AQ20 正面，显示圆柱形机身和空气质量状态指示灯" },
    { name: "背面", file: "aq20-back.png", size: 2501, crop: [0, 36, 2500], alt: "AQ20 背面，显示通风开孔和底部 USB-C 电源接口" },
  ],
  overviewViews: [0, 1],
  groups: [
    { name: "产品概览", rows: [
      ["产品名称", "PACOM 空气质量传感器"], ["型号", "AQ20"],
      ["测量项目", "CO₂、PM1 / PM2.5 / PM4 / PM10、VOC 指数、NOx 指数、温度、相对湿度、气压"],
      ["空气质量分", "0–100，综合 CO₂ 与 PM2.5"], ["状态指示", "多色 LED，亮度可调"],
      ["尺寸", "62.5 × 62.5 × 72 mm（按技术数据表）"], ["重量", "设备 70 g；带壁挂支架 75 g"],
      ["外壳材质", "聚碳酸酯（PC）"], ["适用环境", "室内、非冷凝环境"],
    ] },
    { name: "通信与数据", rows: [
      ["无线通信", "Bluetooth Low Energy（BLE）"], ["无线芯片", "Nordic nRF52840"],
      ["最大发射功率", "+8 dBm"], ["NFC", "NFC-A"], ["室内参考距离", "5–20 m，受接收端、墙体和障碍物影响"],
      ["实时数据", "每秒更新并广播"], ["设备历史记录", "每 5 分钟记录一次，保存最近 10 天"],
      ["系统接入", "PACOM 边缘网关 → PACOM 智能建筑平台"],
    ] },
    { name: "供电与运行", rows: [
      ["电源接口", "USB-C"], ["输入电压", "5 V DC"], ["典型电流", "150–250 mA"],
      ["峰值电流", "500 mA"], ["建议电源容量", "5 V，至少 1 A"],
      ["典型风扇噪声", "< 24 dB(A)，距离 20 cm"], ["典型噪声长期漂移", "< +1 dB(A) / 年"],
    ] },
    { name: "工作与存储条件", rows: [
      ["推荐工作条件", "10–40 °C；20–80% RH，无冷凝"],
      ["短时工作极限", "−10–50 °C；0–90% RH，无冷凝"],
      ["推荐存储条件", "10–30 °C；20–60% RH，无冷凝"],
      ["运输条件", "−40–70 °C；0–80% RH，无冷凝"],
    ] },
    { name: "二氧化碳（CO₂）", rows: [
      ["传感器", "Sensirion SEN66"], ["测量范围", "0–40,000 ppm"], ["分辨率", "1 ppm"],
      ["典型精度 · 400–1,000 ppm", "±(50 ppm + 读数的 2.5%)"],
      ["典型精度 · 1,001–2,000 ppm", "±(50 ppm + 读数的 3%)"],
      ["典型精度 · 2,001–5,000 ppm", "±(40 ppm + 读数的 5%)"],
      ["典型年漂移（运行 5 年后）", "±(5 ppm + 读数的 0.5%)，400–5,000 ppm"],
      ["典型重复性", "±5 ppm"], ["典型响应时间", "60 s（τ63%，400 → 2,000 ppm 阶跃）"],
    ] },
    { name: "颗粒物（PM）", rows: [
      ["传感器", "Sensirion SEN66"], ["测量项目", "PM1、PM2.5、PM4、PM10"],
      ["测量范围", "0–1,000 µg/m³"], ["分辨率", "0.1 µg/m³"],
      ["PM1 / PM2.5 典型精度", "0–100 µg/m³：±(5 µg/m³ + 读数的 5%)\n100–1,000 µg/m³：±读数的 10%"],
      ["PM4 / PM10 典型精度", "0–100 µg/m³：±25 µg/m³\n100–1,000 µg/m³：±读数的 25%"],
      ["长期精度限值漂移", "±2 µg/m³ / 年"],
    ] },
    { name: "挥发性有机物（VOC 指数）", rows: [
      ["传感器", "Sensirion SEN66"], ["有效指数范围", "1–500"], ["分辨率", "1 指数点"],
      ["典型设备间差异", "< ±15 指数点或 < ±读数的 15%，取较大值"],
      ["典型重复性", "< ±5 指数点或 < ±读数的 5%，取较大值"],
      ["典型事件检测时间", "< 60 s"], ["典型达到精度时间", "< 1 h"],
    ] },
    { name: "氮氧化物（NOx 指数）", rows: [
      ["传感器", "Sensirion SEN66"], ["有效指数范围", "1–500"], ["分辨率", "1 指数点"],
      ["典型设备间差异", "< ±50 指数点或 < ±读数的 50%，取较大值"],
      ["典型重复性", "< ±10 指数点或 < ±读数的 10%，取较大值"],
      ["典型事件检测时间", "< 60 s"], ["典型达到精度时间", "< 6 h"],
    ] },
    { name: "温度", rows: [
      ["传感器", "Sensirion SEN66"], ["分辨率", "0.01 °C"],
      ["精度", "典型 ±0.45 °C；最大 ±0.7 °C（25 °C、50% RH）"],
      ["典型重复性", "0.1 °C（25 °C、50% RH）"],
      ["典型响应时间", "< 60 s（τ63%，15 → 25 °C，50% RH）"], ["可用单位", "°C、°F、K"],
    ] },
    { name: "湿度", rows: [
      ["传感器", "Sensirion SEN66"], ["相对湿度分辨率", "0.01% RH"],
      ["精度", "典型 ±4.5% RH；最大 ±6% RH（25 °C、30–70% RH）"],
      ["典型重复性", "±1% RH（25 °C、50% RH）"],
      ["典型响应时间", "< 20 s（τ63%，75 → 25% RH，25 °C）"],
      ["派生数据", "绝对湿度（g/m³）、露点（°C / °F / K）"],
    ] },
    { name: "气压", rows: [
      ["传感器", "Infineon DPS368"], ["整机输出范围", "500–1,155 hPa"], ["分辨率", "1 Pa"],
      ["绝对精度", "±1 hPa"], ["相对精度", "±0.06 hPa"], ["可用单位", "Pa、hPa、mmHg、inHg"],
    ] },
  ],
  note: "精度、响应时间与漂移均按技术数据表的测试条件；典型值用于选型参考。工作条件与测量范围分别列示，短时工作极限不作为长期运行条件。",
  tabs: [
    { id: "overview", name: "产品概览" }, { id: "gallery", name: "产品图片" },
    { id: "features", name: "功能说明" }, { id: "installation", name: "安装与使用" },
  ],
  sections: {
    features: [
      { title: "室内环境监测", text: "AQ20 持续测量二氧化碳、PM1、PM2.5、PM4、PM10 颗粒物质量浓度、VOC 与 NOx 指数、温度、湿度及气压，适用于办公室、会议室、教室和住宅等室内空间。结合读数变化判断通风、清洁或污染源对室内环境的影响。" },
      { title: "空气质量分与指示灯", text: "空气质量分为 0–100，由 CO₂ 与 PM2.5 综合计算，数值越高表示这两项指标下的空气状况越好。多色指示灯便于现场查看；等级按四舍五入后的整数分显示；同时查看具体测量值，判断是哪项读数发生变化。", rows: [["90–100", "优"], ["80–89", "良"], ["50–79", "一般"], ["10–49", "较差"], ["0–9", "很差"]] },
      { title: "VOC 与 NOx 指数", text: "VOC 指数反映相对近期基线的变化，基准值为 100；高于 100 表示相对增加，低于 100 表示相对减少。NOx 指数以 1 为基准，反映氮氧化物事件的相对强度。两者都是指数，不能直接按 ppm 或 µg/m³ 浓度解释，也不能用来识别某一种气体。" },
      { title: "实时数据与本地历史", text: "设备每秒更新并通过 BLE 广播测量数据，可由兼容的接收端同时接收。设备本地按 5 分钟间隔保存最近 10 天的温度、湿度、气压、PM1、PM2.5、PM4、PM10、CO₂、VOC 和 NOx 记录，支持通过 BLE 读取。连续供电使实时测量与历史记录保持连续。" },
      { title: "PACOM 平台与远程监测", text: "通过 PACOM 边缘网关接入 PACOM 智能建筑平台。项目完成网关、运行数据与告警服务的接入验证后，可集中查看空间环境读数、历史趋势和告警，并按权限远程查看。平台的空间空气质量分档与设备的空气质量分采用不同口径；查看结果时应同时确认测量位置、时间与具体指标。历史保留周期、导出范围和可用数据项以项目配置为准。", links: [["平台室内环境", "/platform/environment"], ["趋势分析", "/platform/analytics"], ["告警管理", "/platform/alarms"], ["PACOM 边缘网关", "/devices/edge-gateway"]] },
      { title: "指示灯亮度", text: "底部小按键可循环切换正常、暗、关闭、亮四种模式。按现场需求选择亮度；关闭指示灯后仍可通过接收端查看测量数据。" },
      { title: "固件升级", text: "使用 PACOM 对应硬件的正式固件版本，通过平台设备管理查看升级任务。升级前核对设备型号、硬件版本与目标版本，确保供电和连接稳定；以设备实际回报的运行版本及任务结果确认完成。", links: [["固件升级", "/platform/devices#固件升级"]] },
      { title: "维护与自动校准", text: "CO₂ 自动自校准需要定期接触清洁的新鲜空气。建议每周让房间充分通风约 1 小时，避免设备长期处于持续高 CO₂ 的封闭环境。保持通风口畅通，运行中内置风扇会产生轻微声音。" },
    ],
    installation: [
      { title: "1. 选择测量位置", text: "放在稳定的桌面或层架上，推荐距地面 0.5–1.5 m。选择能代表人员活动区域的位置；避开墙角、狭窄空间以及空调、暖气或风扇的直接气流。不要紧邻窗、门、烤箱、加湿器等会使读数偏离房间整体状况的位置。" },
      { title: "2. 连接电源", text: "将 USB-C 电源线接入设备背面底部接口，使用稳定的 5 V 电源，建议输出能力至少 1 A。连接后设备自动开始测量。保持进出风孔畅通，并避免冷凝；随箱电源、线材及安装附件以所购版本的包装清单为准。" },
      { title: "3. 等待读数稳定", text: "温湿度和颗粒物读数通常需要几分钟稳定。VOC 与 NOx 会适应新环境，初步适应约需 1–2 小时，建议观察完整 24 小时以建立基线。技术数据表中的典型达到精度时间分别为 VOC 少于 1 小时、NOx 少于 6 小时；这与完整环境基线的建立时间含义不同。移到另一个房间后重新观察稳定过程。" },
      { title: "4. 接入 PACOM 系统", text: "使设备处于 PACOM 边缘网关的有效接收范围内，在平台确认设备身份、所属空间和最近更新时间。名称应便于识别房间与安装位置。接入时以实际读数、更新时间和配置回执确认数据链路；完成运行数据与告警服务验证后，再通过平台的室内环境、趋势分析和告警页面查看数据。告警阈值、通知与远程访问按项目需求和账户权限配置。", links: [["设备管理", "/platform/devices"], ["室内环境", "/platform/environment"], ["告警管理", "/platform/alarms"]] },
      { title: "5. 验收与排查", text: "确认供电稳定、通风口无遮挡、网关持续收到数据，并记录测量位置和更新时间。读数明显异常时，先检查是否刚移动设备、附近是否有直吹气流或污染源，以及设备是否完成稳定过程。数据中断时，检查电源、接收距离、障碍物与网关连接状态。" },
    ],
  },
};

export const SensorProductViewer = ({ product, icons = {} }) => {
  const [active, setActive] = useState("overview");
  const [zoomed, setZoomed] = useState(null);
  const tabRefs = useRef([]);
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (zoomed && !dialog.open) dialog.showModal();
    if (!zoomed && dialog.open) dialog.close();
    return () => { if (dialog.open) dialog.close(); };
  }, [zoomed]);

  const photo = (view) => {
    const [x, y, side] = view.crop;
    return <span className="pacom-photo-canvas" style={{ aspectRatio: "1 / 1", "--pacom-photo-ratio": 1 }}>
      <img src={product.base + view.file} alt={view.alt} width={view.size} height={view.size} loading="lazy" draggable="false" style={{ width: view.size / side * 100 + "%", left: -x / side * 100 + "%", top: -y / side * 100 + "%" }} />
    </span>;
  };
  const actions = (view) => <div className="pacom-image-actions">
    <a href={product.base + view.file} download aria-label={"下载" + view.name + "原图"}>{icons.download}<span className="pacom-action-label">下载</span></a>
    <button type="button" onClick={() => setZoomed(view)} aria-label={"放大" + view.name}>{icons.zoom}<span className="pacom-action-label">放大</span></button>
  </div>;
  const figure = (view, gallery = false) => <figure key={view.file} className={gallery ? "pacom-gallery-item" : "pacom-technical-view"}>
    <figcaption className="sr-only">{view.name}</figcaption>
    <button type="button" className="pacom-photo-button" onClick={() => setZoomed(view)} aria-label={"查看" + view.name + "大图"}>{photo(view)}</button>
    {actions(view)}
  </figure>;
  const rows = (items) => <dl className="pacom-spec-rows">{items.map(([label, value]) => <div className="pacom-spec-row" key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
  const moveTab = (event, index) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % product.tabs.length;
    if (event.key === "ArrowLeft") next = (index + product.tabs.length - 1) % product.tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = product.tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault(); setActive(product.tabs[next].id); tabRefs.current[next]?.focus();
  };
  return <div className="pacom-product-viewer">
    <header className="pacom-device-header"><h1>{product.name}</h1><p>{product.model}</p></header>
    <div className="pacom-device-tabs" role="tablist" aria-label={product.model + " 产品资料"}>
      {product.tabs.map((tab, index) => <button key={tab.id} ref={(node) => { tabRefs.current[index] = node; }} className="pacom-device-tab" type="button" role="tab" id={product.id + "-tab-" + tab.id} aria-controls={product.id + "-panel-" + tab.id} aria-selected={active === tab.id} tabIndex={active === tab.id ? 0 : -1} onClick={() => setActive(tab.id)} onKeyDown={(event) => moveTab(event, index)}>{tab.name}</button>)}
    </div>
    {product.tabs.map(tab => <div className="pacom-device-panel" key={tab.id} role="tabpanel" id={product.id + "-panel-" + tab.id} aria-labelledby={product.id + "-tab-" + tab.id} hidden={active !== tab.id} tabIndex={0}>
      {tab.id === "overview" && <div>
        <div className="pacom-datasheet"><div className="pacom-specifications">{product.groups.map(group => <details open className="pacom-spec-group" key={group.name}><summary className="pacom-spec-heading">{icons.chevron}<span>{group.name}</span></summary>{rows(group.rows)}</details>)}</div><div className="pacom-technical-stack">{product.overviewViews.map(index => figure(product.views[index]))}</div></div>
        <p className="pacom-device-note">{product.note}</p>
      </div>}
      {tab.id === "gallery" && <div className="pacom-gallery-grid">{product.views.map(view => figure(view, true))}</div>}
      {product.sections && product.sections[tab.id] && <div className="pacom-device-prose">{product.sections[tab.id].map(section => <section key={section.title}><h2>{section.title}</h2><p>{section.text}</p>{section.rows && rows(section.rows)}{section.links && <nav aria-label={section.title + "相关资料"}>{section.links.map(([name, href]) => <a key={href} href={href}>{name}</a>)}</nav>}</section>)}</div>}
    </div>)}
    <dialog ref={dialogRef} className="pacom-photo-dialog" aria-label={zoomed ? zoomed.name + "大图" : "产品大图"} onCancel={() => setZoomed(null)} onClose={() => setZoomed(null)}>
      {zoomed && <div className="pacom-photo-dialog-content"><div className="pacom-photo-dialog-header"><span>{zoomed.name}</span><button type="button" autoFocus onClick={() => setZoomed(null)} aria-label="关闭大图">{icons.close}</button></div><div className="pacom-photo-dialog-image">{photo(zoomed)}</div><div className="pacom-photo-dialog-footer"><a href={product.base + zoomed.file} download>下载原图</a></div></div>}
    </dialog>
  </div>;
};
