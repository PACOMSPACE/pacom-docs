// Annotations are separate from the unchanged source photographs.
export const EG20Viewer = ({ icons = {} }) => {
  const [active, setActive] = useState("overview");
  const tabRefs = useRef([]);
  const [zoomed, setZoomed] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (zoomed && !dialog.open) dialog.showModal();
    if (!zoomed && dialog.open) dialog.close();
    return () => { if (dialog.open) dialog.close(); };
  }, [zoomed]);

  const base = "/images/devices/eg20/";
  const views = {
    rear: {
      name: "背面接口", file: "eg20-rear-ports.png", crop: [120, 1080, 2760, 840],
      alt: "EG20 背面正视图，标出 USB-C、存储卡槽、音频、两处 HDMI、12V 电源与以太网接口的位置",
      labels: [
        { text: "USB-C 接口", anchors: [[615, 1494]], label: [460, 1130], line: 1215 },
        { text: "存储卡槽", anchors: [[949, 1408]], label: [949, 1130], line: 1215 },
        { text: "12V 电源接口", anchors: [[2093, 1494]], label: [1990, 1130], line: 1215 },
        { text: "以太网接口", anchors: [[2386, 1524]], label: [2590, 1130], line: 1215 },
        { text: "音频接口", anchors: [[951, 1500]], label: [951, 1830], line: 1780 },
        { text: "HDMI 接口", anchors: [[1300, 1524], [1738, 1524]], label: [1519, 1830], line: 1780 },
      ],
    },
    front: {
      name: "前面", file: "eg20-front.png", crop: [120, 1110, 2760, 760],
      alt: "EG20 前面正视图，显示 PACOM 标识与电源按键的位置",
      labels: [{ text: "电源按键", anchors: [[2327, 1553]], label: [2327, 1795], line: 1750 }],
    },
    side: {
      name: "侧面接口", file: "eg20-side-ports.png", crop: [120, 1110, 2760, 760],
      alt: "EG20 侧面正视图，标出三处 USB-A 外形接口的位置",
      labels: [{ text: "USB-A 接口", anchors: [[1057, 1519], [1419, 1519], [1782, 1519]], label: [1419, 1795], line: 1750 }],
    },
    hero: { name: "前侧斜视图", file: "eg20-overview.png", crop: [60, 770, 2880, 1460], alt: "EG20 前侧斜视图，显示 PACOM 标识、电源按键与 USB 接口" },
    left: { name: "前侧另一视角", file: "eg20-front-left.png", crop: [60, 770, 2880, 1460], alt: "EG20 前侧另一角度的斜视图，显示机身整体与防盗锁孔" },
    rearAngle: { name: "后侧斜视图", file: "eg20-rear-perspective.png", crop: [60, 770, 2880, 1460], alt: "EG20 后侧斜视图，显示背面连接接口与侧面 USB 接口" },
    top: { name: "俯视图", file: "eg20-top.png", crop: [90, 560, 2820, 1880], alt: "EG20 俯视图，显示机身顶部纹理与整体轮廓" },
    mounting: {
      name: "底部与安装支架", file: "eg20-mounting-bracket.png", crop: [80, 300, 2840, 2160],
      alt: "EG20 底部与安装支架，标出安装挂孔与支架固定螺钉的位置",
      labels: [
        { text: "安装挂孔", anchors: [[709, 712], [1958, 711], [2374, 711]], label: [1540, 375], line: 470 },
        { text: "固定螺钉", anchors: [[818, 1303]], label: [225, 1420], line: 1420, horizontal: true },
        { text: "固定螺钉", anchors: [[2188, 1303]], label: [2775, 1420], line: 1420, horizontal: true },
      ],
    },
    accessories: { name: "产品与附件", file: "eg20-accessories.png", dimensions: [3840, 2160], alt: "EG20 网关与电源适配器、安装支架、四枚螺钉和快速入门指南的附件示意" },
  };
  const gallery = [views.hero, views.left, views.rearAngle, views.front, views.rear, views.side, views.top];

  // A shared projection scale keeps the long edge, short edge and thickness honest.
  // UniFi's 640px drawings show a 340px-wide body inside a padded 456px frame.
  const projectionScale = 340 / 2491;
  const sheetImage = (view, sourceCenterX, centerY) => ({
    view, left: 320 - sourceCenterX * projectionScale,
    top: centerY - 1500 * projectionScale, width: 3000 * projectionScale,
  });
  const drawings = [
    {
      name: "前后视图", file: views.rear.file, sheet: [640, 386],
      images: [sheetImage(views.rear, 1499.5, 100), sheetImage(views.front, 1500.5, 314)],
      downloads: [views.rear, views.front],
      labels: [
        { text: "USB-C 接口", anchors: [[199.27, 99.18]], label: [100, 38], line: 60 },
        { text: "存储卡槽", anchors: [[244.86, 87.44]], label: [250, 38], line: 60 },
        { text: "12V 电源", anchors: [[401.01, 99.18]], label: [405, 38], line: 60 },
        { text: "以太网接口", anchors: [[441, 103.28]], label: [550, 38], line: 60 },
        { text: "音频接口", anchors: [[245.13, 100]], label: [190, 175], line: 148 },
        { text: "HDMI 接口", anchors: [[292.77, 103.28], [352.55, 103.28]], label: [335, 175], line: 148 },
        { text: "电源按键", anchors: [[432.81, 321.23]], label: [433, 254], line: 278 },
      ],
    },
    { name: "俯视图", file: views.top.file, sheet: [640, 383], images: [sheetImage(views.top, 1500, 165)], labels: [], caption: "俯视图" },
    {
      name: "侧面接口", file: views.side.file, sheet: [640, 220],
      images: [sheetImage(views.side, 1499, 110)],
      labels: [{ text: "USB-A 接口", anchors: [[259.67, 112.59], [309.08, 112.59], [358.63, 112.59]], label: [309, 185], line: 160 }],
    },
  ];

  const renderDrawing = (drawing) => {
    const [w, h] = drawing.sheet;
    return <span className="pacom-drawing-canvas" style={{ aspectRatio: w + " / " + h, "--pacom-photo-ratio": w / h }}>
      {drawing.images.map(({ view, left, top, width }) => <img key={view.file} src={base + view.file} alt={view.alt} width="3000" height="3000" loading="lazy" draggable="false" style={{ width: width / w * 100 + "%", left: left / w * 100 + "%", top: top / h * 100 + "%" }} />)}
      {drawing.labels.map((item, i) => <span key={i} className="pacom-drawing-annotation" aria-hidden="true">
        {item.anchors.map(([ax, ay], j) => <span key={j}>
          <span className="pacom-leader-vertical" style={{ left: ax / w * 100 + "%", top: Math.min(ay, item.line) / h * 100 + "%", height: Math.abs(ay - item.line) / h * 100 + "%" }} />
          <span className="pacom-leader-dot" style={{ left: ax / w * 100 + "%", top: ay / h * 100 + "%" }} />
        </span>)}
        <span className="pacom-leader-horizontal" style={{ left: Math.min(item.label[0], ...item.anchors.map(p => p[0])) / w * 100 + "%", top: item.line / h * 100 + "%", width: (Math.max(item.label[0], ...item.anchors.map(p => p[0])) - Math.min(item.label[0], ...item.anchors.map(p => p[0]))) / w * 100 + "%" }} />
        <span className="pacom-leader-vertical" style={{ left: item.label[0] / w * 100 + "%", top: Math.min(item.label[1], item.line) / h * 100 + "%", height: Math.abs(item.label[1] - item.line) / h * 100 + "%" }} />
        <span className="pacom-leader-label" style={{ left: item.label[0] / w * 100 + "%", top: item.label[1] / h * 100 + "%" }}>{item.text}</span>
      </span>)}
      {drawing.caption && <span className="pacom-drawing-caption">{drawing.caption}</span>}
    </span>;
  };

  const renderPhoto = (view, annotated = false, galleryFrame = false) => {
    if (view.sheet) return renderDrawing(view);
    const crop = galleryFrame ? [-195, -195, 3390, 3390] : view.crop;
    const [x, y, w, h] = crop || [0, 0, 3840, 2160];
    const px = (value) => (value - x) / w * 100;
    const py = (value) => (value - y) / h * 100;
    return (
      <span className="pacom-photo-canvas" style={{ aspectRatio: w + " / " + h, "--pacom-photo-ratio": w / h }}>
        <img src={base + view.file} alt={view.alt} width={view.dimensions ? 3840 : 3000} height={view.dimensions ? 2160 : 3000} loading="lazy" draggable="false" style={{ width: (crop ? 3000 / w * 100 : 100) + "%", left: -x / w * 100 + "%", top: -y / h * 100 + "%" }} />
        {annotated && (view.labels || []).map((item, i) => {
          const xs = item.anchors.map((point) => px(point[0]));
          const lx = px(item.label[0]);
          const ly = py(item.label[1]);
          const lineY = py(item.line);
          return (
            <span key={i} className="pacom-annotation" aria-hidden="true">
              {item.anchors.map((point, j) => (
                <span key={j}>
                  <span className="pacom-leader-vertical" style={{ left: px(point[0]) + "%", top: Math.min(py(point[1]), lineY) + "%", height: Math.abs(py(point[1]) - lineY) + "%" }} />
                  <span className="pacom-leader-dot" style={{ left: px(point[0]) + "%", top: py(point[1]) + "%" }} />
                </span>
              ))}
              {(xs.length > 1 || item.horizontal || xs[0] !== lx) && <span className="pacom-leader-horizontal" style={{ left: Math.min(...xs, lx) + "%", top: lineY + "%", width: (Math.max(...xs, lx) - Math.min(...xs, lx)) + "%" }} />}
              {!item.horizontal && <span className="pacom-leader-vertical" style={{ left: lx + "%", top: Math.min(ly, lineY) + "%", height: Math.abs(ly - lineY) + "%" }} />}
              <span className={"pacom-leader-label" + (item.horizontal ? " pacom-leader-label-side" : "")} style={{ left: item.horizontal ? "clamp(32px, " + lx + "%, calc(100% - 32px))" : lx + "%", top: ly + "%" }}>{item.text}</span>
            </span>
          );
        })}
      </span>
    );
  };

  const actions = (view, annotated = false) => (
    <div className="pacom-image-actions">
      {(view.downloads || [view]).map(item => <a key={item.file} href={base + item.file} download aria-label={"下载" + item.name} title={"下载" + item.name + "原图"}>{icons.download}<span className="pacom-action-label">{view.downloads ? item.name : "下载"}</span></a>)}
      <button type="button" onClick={() => setZoomed({ view, annotated })} aria-label={"放大" + view.name}>{icons.zoom}<span className="pacom-action-label">放大</span></button>
    </div>
  );
  const figure = (view, annotated = false, className = "") => (
    <figure key={view.file} className={"pacom-technical-view " + className}>
      <figcaption className="sr-only">{view.name}</figcaption>
      <button type="button" className="pacom-photo-button" onClick={() => setZoomed({ view, annotated })} aria-label={"查看" + view.name + "大图"}>{renderPhoto(view, annotated)}</button>
      {actions(view, annotated)}
    </figure>
  );
  const groups = [
    { name: "产品概览", rows: [
      ["产品名称", "PACOM 边缘网关"],
      ["型号", "EG20"],
      ["电源按键", "前面"],
      ["连接接口", "背面与侧面"],
    ] },
    { name: "接口布局", rows: [
      ["USB-C 接口", "背面 · 1 个"],
      ["USB-A 接口", "侧面 · 3 个"],
      ["HDMI 接口", "背面 · 2 个"],
      ["以太网接口", "背面 · 1 个"],
      ["音频接口", "背面 · 1 个"],
      ["存储卡槽", "背面 · 1 个"],
      ["电源接口", "背面 · 标有 12V"],
    ] },
    { name: "安装与附件", rows: [
      ["安装支架", "底部支架与安装挂孔"],
      ["附件示意", "电源适配器、安装支架、螺钉、快速入门指南"],
    ] },
  ];
  const tabs = [
    { id: "overview", name: "产品概览" },
    { id: "gallery", name: "产品图片" },
    { id: "mounting", name: "安装支架" },
    { id: "accessories", name: "附件示意" },
  ];
  const moveTab = (event, index) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setActive(tabs[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="pacom-product-viewer">
      <header className="pacom-device-header">
        <span className="pacom-device-thumbnail"><img src={base + "eg20-overview.png"} alt="PACOM EG20 边缘网关" width="62" height="62" /></span>
        <div><h1>PACOM 边缘网关</h1><p>EG20</p></div>
      </header>
      <div className="pacom-device-tabs" role="tablist" aria-label="EG20 产品资料">
        {tabs.map((tab, index) => <button key={tab.id} ref={(node) => { tabRefs.current[index] = node; }} type="button" className="pacom-device-tab" role="tab" id={"eg20-tab-" + tab.id} aria-controls={"eg20-panel-" + tab.id} aria-selected={active === tab.id} tabIndex={active === tab.id ? 0 : -1} onClick={() => setActive(tab.id)} onKeyDown={(event) => moveTab(event, index)}>{tab.name}</button>)}
      </div>
      {tabs.map((tab) => <div key={tab.id} className="pacom-device-panel" role="tabpanel" id={"eg20-panel-" + tab.id} aria-labelledby={"eg20-tab-" + tab.id} hidden={active !== tab.id} tabIndex={0}>
        {tab.id === "overview" && <div className="pacom-datasheet">
          <div className="pacom-technical-stack">{drawings.map(view => figure(view, true, "pacom-drawing-sheet"))}</div>
          <div className="pacom-specifications">{groups.map((group) => <details open className="pacom-spec-group" key={group.name}>
            <summary className="pacom-spec-heading">{icons.chevron}<span>{group.name}</span></summary>
            <dl className="pacom-spec-rows">{group.rows.map(([label, value]) => <div className="pacom-spec-row" key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          </details>)}</div>
        </div>}
        {tab.id === "gallery" && <div className="pacom-gallery-grid">{gallery.map((view) => <figure className="pacom-gallery-item" key={view.file}>
          <figcaption className="sr-only">{view.name}</figcaption>
          <button type="button" className="pacom-photo-button" aria-label={"查看" + view.name + "大图"} onClick={() => setZoomed({ view, annotated: false })}>{renderPhoto(view, false, true)}</button>
          {actions(view)}
        </figure>)}</div>}
        {tab.id === "mounting" && <div>{figure(views.mounting, true, "pacom-mounting-image")}<p className="pacom-device-note">支架图用于辨认安装挂孔和固定螺钉的位置。安装尺寸与操作步骤请以对应版本的安装说明为准。</p></div>}
        {tab.id === "accessories" && <div>{figure(views.accessories, false, "pacom-accessories-image")}<p className="pacom-device-note">图中展示网关、电源适配器、安装支架、螺钉与快速入门指南。实际随箱物品以所购版本的包装清单为准。</p></div>}
      </div>)}
      <dialog ref={dialogRef} className="pacom-photo-dialog" aria-label={zoomed ? zoomed.view.name + "大图" : "产品大图"} onCancel={() => setZoomed(null)} onClose={() => setZoomed(null)}>
        {zoomed && <div className="pacom-photo-dialog-content"><div className="pacom-photo-dialog-header"><span>{zoomed.view.name}</span><button type="button" autoFocus onClick={() => setZoomed(null)} aria-label="关闭大图">{icons.close}</button></div><div className="pacom-photo-dialog-image">{renderPhoto(zoomed.view, zoomed.annotated)}</div><div className="pacom-photo-dialog-footer">{(zoomed.view.downloads || [zoomed.view]).map(item => <a key={item.file} href={base + item.file} download>{zoomed.view.downloads ? "下载" + item.name + "原图" : "下载原图"}</a>)}</div></div>}
      </dialog>
    </div>
  );
};
