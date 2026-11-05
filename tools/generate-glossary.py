from pathlib import Path
import json,re,html,hashlib,collections,argparse
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description="Generate the PACOM glossary with the source site's nine visible categories.")
parser.add_argument('--source',type=Path,default=ROOT/'glossary/data.json')
parser.add_argument('--report-dir',type=Path,required=True)
args=parser.parse_args()
SRC=args.source
OUT=args.report_dir
OUT.mkdir(parents=True,exist_ok=True)
entries=json.loads(SRC.read_text())
categories=[('Fundamentals','fundamentals','基础概念'),('Systems & controls','systems-controls','系统与控制'),('Protocols & standards','protocols-standards','协议与标准'),('Connectivity','connectivity','连接与通信'),('Data & software','data-software','数据与软件'),('Energy & sustainability','energy-sustainability','能源与可持续发展'),('Health & occupancy','health-occupancy','健康与空间使用'),('Certifications & ratings','certifications-ratings','认证与评级'),('Building types','building-types','建筑类型')]
assert len(entries)==219 and len({x['id'] for x in entries})==219
assert entries[-1]['id']=='large-language-model' and entries[-1]['number']==219
bycat={a:(b,c) for a,b,c in categories}
# AI is the source registry marker for the supplementary LLM entry, not a tenth visible category.
bycat['AI']=('ai','AI')
paths=[]
def write(path,s):
 p=ROOT/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(s);paths.append(path)
def fm(**kwargs):return '---\n'+'\n'.join(k+': '+json.dumps(v,ensure_ascii=False) for k,v in kwargs.items())+'\n---\n\n'
def md(s):
 s=html.escape(str(s),quote=False)
 return re.sub(r'([\\`*\[\]{}<>])',r'\\\1',s)
def link(label,url):
 assert url.startswith(('https://','/'))
 return '['+md(label)+']('+url.replace(' ','%20').replace('(','%28').replace(')','%29')+')'
# Each detail is static MDX so definitions and citations remain readable without client-side components.
public=[]
for e in entries:
 slug,cn=bycat[e['category']]
 data={**e,'sources':[{k:v for k,v in s.items() if k!='source_check'} for s in e['sources']]}
 public.append(data)
 s=fm(title=e['zh_display'],description=e['en'],glossaryId=e['id'],glossaryNumber=e['number'],glossaryCategory=e['category'],hideFooterPagination=True)
 s+=link('术语表概览','/glossary/index')
 if e['category']=='AI':s+='\n\n原站分类标记：AI。此词条保留在全部术语中，未列入原站九类公开目录。\n\n'
 else:s+=' · '+link(cn,'/glossary/'+slug)+'\n\n'
 s+='## 中文释义\n\n'+md(e['definition_zh'])+'\n\n'
 s+='## 名称依据与适用范围\n\n**名称依据**：'+md(e['name_basis'])+'\n\n**释义依据**：'+md(e['evidence_note'])+'\n\n'
 if e['scope_note']:s+='**范围说明**：'+md(e['scope_note'])+'\n\n'
 s+='## 参考来源\n\n'
 for i,source in enumerate(data['sources'],1):
  s+=str(i)+'. '+link(source['title'],source['url'])+'\n\n'
  for key,label in [('kind','来源类型'),('lang','语言'),('locator','来源定位'),('excerpt','原文摘录'),('scope_note','来源范围')]:
   if source.get(key):s+='   - **'+label+'**：'+md(source[key])+'\n'
  s+='\n'
 s+='## 英文原词条\n\n'+link('Smart Building Database · '+e['en'],e['original_url'])+'\n\n'
 s+='资料复核日期：'+e['reviewed_on']+'\n'
 write('glossary/terms/'+e['id']+'.mdx',s)
# Visible category pages also contain a complete, static route to every entry.
for en,slug,cn in categories:
 items=sorted((e for e in entries if e['category']==en),key=lambda e:e['en'].casefold())
 s=fm(title=cn,description=en+' · '+str(len(items))+' 条词汇',sidebarTitle='分类概览',hideFooterPagination=True)
 s+=link('全部词汇与检索','/glossary/index')+'\n\n'
 s+='保留中英文名称、中文释义、名称依据和参考来源。名称中的范围限定随词条一并显示。\n\n'
 for e in items:
  s+='### '+md(e['en'])+'\n\n'+link(e['zh_display'],'/glossary/terms/'+e['id'])+'\n\n'+md(e['definition_zh'])+'\n\n'
 write('glossary/'+slug+'.mdx',s)
# Keep the former AI URL reachable without presenting an additional public category.
llm=next(e for e in entries if e['id']=='large-language-model')
write('glossary/ai.mdx',fm(title='AI 词条',description='原站注册信息中的 AI 标记，保留旧链接访问。',hideFooterPagination=True)+link('术语表概览','/glossary/index')+'\n\n原站公开目录按九类列示。大语言模型词条的原站分类标记为 AI，保留在全部术语中检索。\n\n'+link(llm['zh_display'],'/glossary/terms/'+llm['id'])+'\n\n'+md(llm['definition_zh'])+'\n')
write('glossary/index.mdx',fm(title='术语表',description='219 条中英文术语，按原站九类目录查阅和检索。',sidebarTitle='概览',mode='wide',hideFooterPagination=True)+'''import { GlossaryIndex } from "/snippets/glossary-index.jsx";

英文词目来自 [Smart Building Database](https://smartbuildingdatabase.com/tools/glossary)。中文命名与释义依据各条列明的资料整理，保留英文专名及来源语境。名称中的 **〔企业〕**、**〔用途类别对应〕** 等标记表示名称依据与适用范围，详见词条详情。

本表是依据来源整理的中文说明，不是某一标准定义的逐字原文，也不是原站已有的中文版本。

目录按原站九类列示，另保留源站已发布但未列入该目录的大语言模型词条，可在全部术语中检索。

<GlossaryIndex />

## 按类别查阅

'''+''.join('- '+link(cn+'（'+str(sum(e['category']==en for e in entries))+'）','/glossary/'+slug)+'\n' for en,slug,cn in categories)+'\n资料复核日期：2026-11-05\n')
# Public data preserves every naming/scope/citation field. Local research-log paths stay in the immutable source file.
write('glossary/data.json',json.dumps(public,ensure_ascii=False,indent=2)+'\n')
indexdata=[{k:e[k] for k in ['id','en','zh_display','definition_zh','scope_note','name_basis','evidence_note']}|{'category':bycat[e['category']][0]} for e in entries]
indexdata.sort(key=lambda x:x['en'].casefold())
component='''export const GlossaryEntries = __ENTRIES__;
export const GlossaryCategories = __CATEGORIES__;
export const GlossaryIndex = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState(40);
  const normalize = (value) => value.normalize("NFKC").toLocaleLowerCase().replace(/\\s+/g, " ").trim();
  const words = normalize(query).split(" ").filter(Boolean);
  const results = GlossaryEntries.filter(entry => (!category || entry.category === category) && words.every(word => normalize([entry.en, entry.zh_display, entry.definition_zh, entry.scope_note, entry.name_basis, entry.evidence_note].join(" ")).includes(word)));
  const changeQuery = value => { setQuery(value); setLimit(40); };
  const changeCategory = value => { setCategory(value); setLimit(40); };
  return <div className="pacom-glossary not-prose">
    <style>{__CSS__}</style>
    <div className="pacom-glossary-controls">
      <div className="pacom-glossary-search"><label htmlFor="glossary-search">搜索术语</label><input id="glossary-search" type="search" value={query} onChange={event => changeQuery(event.target.value)} placeholder="输入中文、英文、缩写或释义关键词" autoComplete="off" /></div>
      <div className="pacom-glossary-category"><label htmlFor="glossary-category">主题分类</label><select id="glossary-category" value={category} onChange={event => changeCategory(event.target.value)}><option value="">全部术语</option>{GlossaryCategories.map(item => <option key={item.id} value={item.id}>{item.name}（{item.count}）</option>)}</select></div>
    </div>
    <div className="pacom-glossary-status"><p role="status" aria-live="polite">共 {results.length} 条{results.length > limit ? "，当前显示 " + limit + " 条" : ""} · 按英文名称排序</p>{(query || category) && <button type="button" onClick={() => {changeQuery("");changeCategory("");}}>清除筛选</button>}</div>
    <ul className="pacom-glossary-results" aria-label="术语检索结果">{results.slice(0, limit).map(entry => <li key={entry.id}><a href={"/glossary/terms/" + entry.id}><span className="pacom-glossary-en" lang="en">{entry.en}</span><span className="pacom-glossary-zh">{entry.zh_display}</span><span className="pacom-glossary-definition">{entry.definition_zh}</span><span className="pacom-glossary-tag">{(GlossaryCategories.find(item => item.id === entry.category)?.name || (entry.category === "ai" ? "AI · 原站分类标记" : "原站补充词条"))}<span aria-hidden="true"> ↗</span></span></a></li>)}</ul>
    {results.length === 0 && <p className="pacom-glossary-empty">没有匹配术语。可尝试英文缩写、中文名称或切换分类。</p>}
    {results.length > limit && <button type="button" className="pacom-glossary-more" onClick={() => setLimit(limit + 40)}>显示更多术语（剩余 {results.length - limit} 条）</button>}
  </div>;
};
'''
css='''
.pacom-glossary{--glossary-border:#e5e7eb;--glossary-muted:#626875;--glossary-ink:#202a44;margin:24px 0 32px;color:var(--glossary-ink);font-family:var(--pacom-font-sans);font-size:14px;line-height:1.6}
.pacom-glossary *{box-sizing:border-box}.pacom-glossary-controls{display:grid;grid-template-columns:minmax(0,1fr) minmax(180px,240px);gap:16px}.pacom-glossary label{display:block;margin:0 0 8px;font-size:14px;font-weight:600}.pacom-glossary input,.pacom-glossary select{width:100%;min-width:0;min-height:44px;margin:0;padding:10px 12px;border:1px solid var(--glossary-border);border-radius:6px;color:inherit;background:transparent;font:inherit}.pacom-glossary input::placeholder{color:var(--glossary-muted)}
.pacom-glossary-status{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin:16px 0}.pacom-glossary-status p{margin:0;color:var(--glossary-muted);font-size:13px}.pacom-glossary-status button{flex-shrink:0;border:0;background:transparent;color:#007eaf;font:inherit;cursor:pointer;padding:4px 0}.pacom-glossary-results{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;padding:0;margin:0;list-style:none}.pacom-glossary-results li{padding:0;margin:0;min-width:0}.pacom-glossary-results a{display:flex;flex-direction:column;height:100%;padding:20px;border:1px solid var(--glossary-border);border-radius:8px;color:inherit;text-decoration:none;overflow-wrap:anywhere}.pacom-glossary-results a:hover{border-color:#00aeef;background:rgba(0,174,239,.035)}.pacom-glossary-en{font-size:16px;font-weight:600;line-height:1.4}.pacom-glossary-zh{display:block;font-weight:500;line-height:1.6;margin-top:6px}.pacom-glossary-definition{display:block;margin-top:10px;color:var(--glossary-muted);font-size:13px;line-height:1.65}.pacom-glossary-tag{display:block;margin-top:auto;padding-top:14px;color:var(--glossary-muted);font-size:12px}.pacom-glossary-tag span{color:#007eaf}.pacom-glossary-more{display:block;min-height:44px;margin:24px auto 0;padding:10px 20px;border:1px solid var(--glossary-border);border-radius:6px;background:transparent;color:inherit;font:inherit;cursor:pointer}.pacom-glossary-empty{padding:24px 0;color:var(--glossary-muted)}.pacom-glossary a:focus-visible,.pacom-glossary button:focus-visible,.pacom-glossary input:focus-visible,.pacom-glossary select:focus-visible{outline:2px solid #00aeef;outline-offset:3px}.dark .pacom-glossary{--glossary-border:#383b42;--glossary-muted:#a8aab2;--glossary-ink:#e5e7eb}.dark .pacom-glossary-status button,.dark .pacom-glossary-tag span{color:#00aeef}@media(max-width:640px){.pacom-glossary-controls,.pacom-glossary-results{grid-template-columns:minmax(0,1fr)}.pacom-glossary-controls{gap:12px}.pacom-glossary-results a{padding:16px}.pacom-glossary-status{align-items:flex-start}.pacom-glossary-en{font-size:16px}}
'''
component=component.replace('__ENTRIES__',json.dumps(indexdata,ensure_ascii=False)).replace('__CATEGORIES__',json.dumps([{'id':slug,'name':cn,'count':sum(e['category']==en for e in entries)}for en,slug,cn in categories],ensure_ascii=False)).replace('__CSS__',json.dumps(css))
write('snippets/glossary-index.jsx',component)
# Match the current remote navigation and leave its two top-level tabs intact.
config=json.loads((ROOT/'docs.json').read_text())
tab=next(t for t in config['navigation']['languages'][0]['tabs'] if t['tab']=='产品文档')
glossary_group={'group':'术语表','pages':['glossary/index']+[
 {'group':cn,'expanded':False,'pages':['glossary/'+slug]+['glossary/terms/'+e['id'] for e in entries if e['category']==en]}
 for en,slug,cn in categories]+[
 {'group':'补充术语','hidden':True,'searchable':True,'pages':['glossary/terms/'+e['id'] for e in entries if e['category'] not in {c[0] for c in categories}]+['glossary/ai']}
]}
positions=[i for i,g in enumerate(tab['groups']) if g['group'] in ('参考资料','术语表')]
if positions:
 tab['groups'][positions[0]]=glossary_group
 for i in reversed(positions[1:]):del tab['groups'][i]
else:tab['groups'].append(glossary_group)
write('docs.json',json.dumps(config,ensure_ascii=False,indent=2)+'\n')
dev=(ROOT/'developers/index.mdx').read_text()
old='\n\n## 参考词汇\n\n[智能建筑词汇](/glossary/index)收录 219 条中英文词汇，可按主题分类和关键词查阅名称、释义与来源。'
new='\n\n## 术语表\n\n[术语表](/glossary/index)收录 219 条中英文术语，可按原站九类目录和关键词查阅名称、释义与来源。'
if old in dev:dev=dev.replace(old,new)
elif new not in dev:dev=dev.rstrip()+new+'\n'
write('developers/index.mdx',dev)
report={'count':len(entries),'unique_ids':len({e['id']for e in entries}),'categories':{cn:sum(e['category']==en for e in entries)for en,_,cn in categories},'source_citations':sum(len(e['sources'])for e in entries),'unique_source_urls':len({s['url']for e in entries for s in e['sources']}),'immutable_input_sha256':hashlib.sha256(SRC.read_bytes()).hexdigest(),'public_source_check_omission':'7 research-process notes omitted from public data; naming, evidence, scopes and all references retained. Original supplied file unchanged.','llm_id':entries[-1]['id'],'visible_category_count':len(categories),'supplementary_terms':[e['id'] for e in entries if e['category'] not in {c[0]for c in categories}],'files':paths}
(OUT/'manifest.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items()if k!='files'},ensure_ascii=False,indent=2));print('files',len(paths))
