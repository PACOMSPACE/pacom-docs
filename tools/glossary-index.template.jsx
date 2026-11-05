export const GlossaryEntries = __ENTRIES__;
export const GlossaryCategories = __CATEGORIES__;

export const GlossaryIndex = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const normalize = value => value.normalize("NFKC").toLocaleLowerCase().replace(/\s+/g, " ").trim();
  const words = normalize(query).split(" ").filter(Boolean);
  const results = GlossaryEntries.filter(entry => (!category || entry.category === category) && words.every(word => normalize([entry.en, entry.zh_display, entry.definition_zh].join(" ")).includes(word)));
  const letters = [...new Set(results.map(entry => entry.en[0].toUpperCase()))];

  return <div className="pacom-glossary-intro not-prose">
    <style>{`
      .pacom-glossary-intro{--gl-border:#e5e7eb;--gl-muted:#626875;--gl-ink:#202a44;--gl-surface:#f8fafc;color:var(--gl-ink);font-size:14px;line-height:1.65;margin:24px 0 32px}
      .pacom-glossary-intro *{box-sizing:border-box}
      .pacom-glossary-topics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:24px}
      .pacom-glossary-topics button{display:flex;align-items:center;justify-content:space-between;gap:12px;min-width:0;min-height:50px;padding:12px 14px;border:1px solid var(--gl-border);border-radius:6px;background:transparent;color:inherit;text-align:left;font:inherit;cursor:pointer}
      .pacom-glossary-topics button:hover{background:var(--gl-surface)}
      .pacom-glossary-topics button[aria-pressed=true]{border-color:#007eaf;background:rgba(0,174,239,.06)}
      .pacom-glossary-topics small{display:flex;align-items:center;gap:8px;flex-shrink:0;font-size:11px;letter-spacing:.04em;color:var(--gl-muted);white-space:nowrap}
      .pacom-glossary-topic-clear{font-size:16px;line-height:1;color:var(--gl-ink)}
      .pacom-glossary-toolbar{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:20px}
      .pacom-glossary-search{width:min(100%,360px)}
      .pacom-glossary-search label{display:block;margin-bottom:6px;font-size:12px;color:var(--gl-muted)}
      .pacom-glossary-search input{width:100%;min-height:42px;padding:8px 12px;border:1px solid var(--gl-border);border-radius:6px;background:transparent;color:inherit;font:inherit}
      .pacom-glossary-search input::placeholder{color:var(--gl-muted)}
      .pacom-glossary-status{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:8px;color:var(--gl-muted);font-size:12px}
      .pacom-glossary-status p{margin:0}
      .pacom-glossary-status button{border:0;padding:0;background:transparent;color:#007eaf;font:inherit;cursor:pointer}
      .pacom-glossary-letters{display:flex;flex-wrap:wrap;gap:4px;padding:12px 0 20px;border-bottom:1px solid var(--gl-border)}
      .pacom-glossary-letters a{display:flex;align-items:center;justify-content:center;min-width:32px;min-height:36px;padding:4px 8px;border-radius:4px;color:var(--gl-muted);font-size:13px;font-weight:600;text-decoration:none}
      .pacom-glossary-letters a:hover{color:var(--gl-ink);background:var(--gl-surface)}
      .pacom-glossary-letter{scroll-margin-top:110px;margin-top:36px}
      .pacom-glossary-letter h2{margin:0;padding:0 0 12px;border-bottom:1px solid var(--gl-border);color:inherit;font-size:22px;font-weight:600;line-height:1.4}
      .pacom-glossary-rows{list-style:none;margin:0;padding:0}
      .pacom-glossary-rows li{margin:0;padding:0;border-bottom:1px solid var(--gl-border)}
      .pacom-glossary-row{display:grid;grid-template-columns:minmax(180px,.85fr) minmax(0,1.4fr);gap:28px;padding:18px 0;color:inherit;text-decoration:none;overflow-wrap:anywhere}
      .pacom-glossary-name{display:block;min-width:0}
      .pacom-glossary-en{display:block;font-size:14px;font-weight:600;line-height:1.5}
      .pacom-glossary-zh{display:block;margin-top:5px;color:var(--gl-muted);font-size:13px;line-height:1.65}
      .pacom-glossary-definition{display:block;color:var(--gl-muted);font-size:13px;line-height:1.8}
      .pacom-glossary-empty{padding:28px 0;color:var(--gl-muted)}
      .pacom-glossary-intro a:focus-visible,.pacom-glossary-intro button:focus-visible,.pacom-glossary-intro input:focus-visible{outline:2px solid #00aeef;outline-offset:3px}
      .dark .pacom-glossary-intro{--gl-border:#383b42;--gl-muted:#a8aab2;--gl-ink:#e5e7eb;--gl-surface:#202329}
      .dark .pacom-glossary-status button{color:#00aeef}
      @media(max-width:680px){.pacom-glossary-topics{grid-template-columns:repeat(2,minmax(0,1fr))}.pacom-glossary-toolbar{align-items:stretch;flex-direction:column;gap:12px}.pacom-glossary-search{width:100%}.pacom-glossary-status{margin:0}.pacom-glossary-row{grid-template-columns:minmax(0,1fr);gap:8px;padding:16px 0}.pacom-glossary-letter{margin-top:28px}}
      @media(max-width:380px){.pacom-glossary-topics{grid-template-columns:minmax(0,1fr)}}
    `}</style>

    <nav className="pacom-glossary-topics" aria-label="主题筛选">
      {GlossaryCategories.map(item => <button key={item.id} type="button" aria-label={"按主题筛选：" + item.name} aria-pressed={category === item.id} title={category === item.id ? "再次点击取消筛选" : "选择" + item.name} onClick={() => setCategory(current => current === item.id ? "" : item.id)}><span>{item.name}</span><small>{item.count} 条{category === item.id && <span className="pacom-glossary-topic-clear" aria-hidden="true">×</span>}</small></button>)}
    </nav>

    <div className="pacom-glossary-toolbar">
      <div className="pacom-glossary-search"><label htmlFor="glossary-search">搜索术语</label><input id="glossary-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="中文、英文或释义关键词" autoComplete="off" /></div>
      <div className="pacom-glossary-status"><p role="status" aria-live="polite">共 {results.length} 条 · 按英文名称排列</p>{(query || category) && <button type="button" onClick={() => {setQuery("");setCategory("");}}>清除筛选</button>}</div>
    </div>

    <nav className="pacom-glossary-letters" aria-label="字母索引">{letters.map(letter => <a key={letter} href={"#letter-" + letter}>{letter}</a>)}</nav>

    {letters.map(letter => <section className="pacom-glossary-letter" id={"letter-" + letter} key={letter} aria-labelledby={"heading-" + letter}>
      <h2 id={"heading-" + letter}>{letter}</h2>
      <ul className="pacom-glossary-rows">{results.filter(entry => entry.en[0].toUpperCase() === letter).map(entry => <li key={entry.id}><div className="pacom-glossary-row"><span className="pacom-glossary-name"><span className="pacom-glossary-en" lang="en">{entry.en}</span><span className="pacom-glossary-zh">{entry.zh_display}</span></span><span className="pacom-glossary-definition">{entry.definition_zh}</span></div></li>)}</ul>
    </section>)}

    {results.length === 0 && <p className="pacom-glossary-empty">没有匹配术语。可尝试其他关键词或清除筛选。</p>}
  </div>;
};
