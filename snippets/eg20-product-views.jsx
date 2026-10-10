// Annotations are separate from the unchanged source photographs.
export const EG20Viewer = ({ section = "overview" }) => {
  const [selected, setSelected] = useState(0);
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
        { text: "USB-C 接口", anchors: [[615, 1494]], label: [615, 1130], line: 1215 },
        { text: "存储卡槽", anchors: [[949, 1408]], label: [949, 1130], line: 1215 },
        { text: "12V 电源接口", anchors: [[2093, 1494]], label: [2093, 1130], line: 1215 },
        { text: "以太网接口", anchors: [[2386, 1524]], label: [2440, 1130], line: 1215 },
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
      name: "侧面接口", file: "eg20-side-ports.png", crop: [530, 1110, 1940, 760],
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

  const renderPhoto = (view, annotated = false, galleryFrame = false) => {
    const crop = galleryFrame ? [60, 580, 2880, 1840] : view.crop;
    const [x, y, w, h] = crop || [0, 0, 3840, 2160];
    const px = (value) => (value - x) / w * 100;
    const py = (value) => (value - y) / h * 100;
    return (
      <span className="pacom-photo-canvas" style={{ aspectRatio: w + " / " + h }}>
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
              <span className={"pacom-leader-label" + (item.horizontal ? " pacom-leader-label-side" : "")} style={{ left: lx + "%", top: ly + "%" }}>{item.text}</span>
            </span>
          );
        })}
      </span>
    );
  };

  const figure = (view, annotated = false) => (
    <figure key={view.file} className="pacom-technical-view">
      <figcaption><span>{view.name}</span><button type="button" onClick={() => setZoomed({ view, annotated })} aria-label={"放大" + view.name}>放大查看</button></figcaption>
      <button type="button" className="pacom-photo-button" onClick={() => setZoomed({ view, annotated })} aria-label={"查看" + view.name + "大图"}>{renderPhoto(view, annotated)}</button>
      {annotated && view.labels && <ul className="pacom-mobile-labels">{view.labels.filter((item, i, all) => all.findIndex((other) => other.text === item.text) === i).map((item) => <li key={item.text}>{item.text}</li>)}</ul>}
    </figure>
  );

  return (
    <div className={"pacom-product-viewer pacom-viewer-" + section}>
      {section === "overview" && <div className="pacom-technical-stack">{figure(views.rear, true)}<div className="pacom-technical-pair">{figure(views.front, true)}{figure(views.side, true)}</div></div>}
      {section === "gallery" && <div className="pacom-gallery">
        <div className="pacom-gallery-status" aria-live="polite"><span>{gallery[selected].name}</span><span>{selected + 1} / {gallery.length}</span></div>
        <button type="button" className="pacom-photo-button pacom-gallery-main" aria-label={"放大" + gallery[selected].name} onClick={() => setZoomed({ view: gallery[selected], annotated: false })}>{renderPhoto(gallery[selected], false, true)}</button>
        <div className="pacom-gallery-actions"><button type="button" onClick={() => setZoomed({ view: gallery[selected], annotated: false })}>放大查看</button><a href={base + gallery[selected].file} target="_blank" rel="noopener noreferrer" download>下载图片</a></div>
        <div className="pacom-gallery-thumbnails" aria-label="选择产品视角">{gallery.map((view, index) => <button type="button" key={view.file} aria-label={"选择" + view.name} aria-pressed={selected === index} onClick={() => setSelected(index)}>{renderPhoto(view, false, true)}<span className="pacom-thumbnail-label">{view.name}</span></button>)}</div>
      </div>}
      {section === "mounting" && figure(views.mounting, true)}
      {section === "accessories" && figure(views.accessories)}
      <dialog ref={dialogRef} className="pacom-photo-dialog" aria-label={zoomed ? zoomed.view.name + "大图" : "产品大图"} onCancel={() => setZoomed(null)} onClose={() => setZoomed(null)} onClick={(event) => { if (event.target === dialogRef.current) setZoomed(null); }}>
        {zoomed && <div className="pacom-photo-dialog-content"><div className="pacom-photo-dialog-header"><span>{zoomed.view.name}</span><button type="button" autoFocus onClick={() => setZoomed(null)} aria-label="关闭大图">关闭</button></div><div className="pacom-photo-dialog-image">{renderPhoto(zoomed.view, zoomed.annotated)}</div><div className="pacom-photo-dialog-footer"><a href={base + zoomed.view.file} target="_blank" rel="noopener noreferrer" download>下载图片</a></div></div>}
      </dialog>
    </div>
  );
};
