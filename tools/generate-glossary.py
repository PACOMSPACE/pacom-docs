from pathlib import Path
import json,re,html,hashlib,collections,argparse
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description="Generate the PACOM glossary Introduction page with a flat sidebar and A-Z rows.")
parser.add_argument('--source',type=Path,default=ROOT/'glossary/data.json')
parser.add_argument('--report-dir',type=Path,required=True)
args=parser.parse_args()
SRC=args.source
OUT=args.report_dir
OUT.mkdir(parents=True,exist_ok=True)
entries=json.loads(SRC.read_text())
categories=[('Fundamentals','fundamentals','基础概念'),('Systems & controls','systems-controls','系统与控制'),('Protocols & standards','protocols-standards','协议与标准'),('Connectivity','connectivity','网络与通信'),('Data & software','data-software','数据与软件'),('Energy & sustainability','energy-sustainability','能源与可持续发展'),('Health & occupancy','health-occupancy','室内环境与空间使用'),('Certifications & ratings','certifications-ratings','认证、评级与合规'),('Building types','building-types','建筑与项目类型')]
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
write('glossary/index.mdx',fm(title='术语表',description='219 条智能建筑中英文术语，涵盖建筑控制、通信、数据、能源及认证。',sidebarTitle='简介',mode='wide',hideFooterPagination=True)+'''import { GlossaryIndex } from "/snippets/glossary-index.jsx";

<GlossaryIndex />

<details>
<summary>编写说明与来源</summary>

英文词目参考 [Smart Building Database](https://smartbuildingdatabase.com/tools/glossary)。中文名称、释义及适用范围依据各词条列明的资料整理；名称中的 **〔企业〕**、**〔用途类别对应〕** 等标记保留来源语境。点击术语可查阅完整依据和参考来源。

资料复核日期：2026-11-05

</details>
''')
# Public data preserves every naming/scope/citation field. Local research-log paths stay in the immutable source file.
write('glossary/data.json',json.dumps(public,ensure_ascii=False,indent=2)+'\n')
indexdata=[{k:e[k] for k in ['id','en','zh_display','definition_zh','scope_note','name_basis','evidence_note']}|{'category':bycat[e['category']][0]} for e in entries]
indexdata.sort(key=lambda x:x['en'].casefold())
component=(ROOT/'tools/glossary-index.template.jsx').read_text()
component=component.replace('__ENTRIES__',json.dumps(indexdata,ensure_ascii=False)).replace('__CATEGORIES__',json.dumps([{'id':slug,'name':cn,'count':sum(e['category']==en for e in entries)}for en,slug,cn in categories],ensure_ascii=False))
write('snippets/glossary-index.jsx',component)
# Match the current remote navigation and leave its two top-level tabs intact.
config=json.loads((ROOT/'docs.json').read_text())
tab=next(t for t in config['navigation']['languages'][0]['tabs'] if t['tab']=='产品文档')
glossary_group={'group':'术语表','pages':['glossary/index']}
positions=[i for i,g in enumerate(tab['groups']) if g['group'] in ('参考资料','术语表')]
if positions:
 tab['groups'][positions[0]]=glossary_group
 for i in reversed(positions[1:]):del tab['groups'][i]
else:tab['groups'].append(glossary_group)
# Keep detail and compatibility routes searchable/reachable without visible sidebar subdivisions.
tab['groups']=[g for g in tab['groups'] if g['group'] not in ('术语详情','术语兼容页面')]
tab['groups'].append({'group':'术语详情','hidden':True,'searchable':True,'pages':['glossary/terms/'+e['id'] for e in entries]})
tab['groups'].append({'group':'术语兼容页面','hidden':True,'searchable':False,'pages':['glossary/'+slug for _,slug,_ in categories]+['glossary/ai']})
write('docs.json',json.dumps(config,ensure_ascii=False,indent=2)+'\n')
dev=(ROOT/'developers/index.mdx').read_text()
old='\n\n## 参考词汇\n\n[智能建筑词汇](/glossary/index)收录 219 条中英文词汇，可按主题分类和关键词查阅名称、释义与来源。'
new='\n\n## 术语表\n\n[术语表](/glossary/index)收录 219 条中英文术语，可按字母索引和关键词查阅名称、释义与来源。'
dev=dev.replace('可按原站九类目录和关键词查阅名称、释义与来源。','可按字母索引和关键词查阅名称、释义与来源。')
if old in dev:dev=dev.replace(old,new)
elif new not in dev:dev=dev.rstrip()+new+'\n'
write('developers/index.mdx',dev)
report={'count':len(entries),'unique_ids':len({e['id']for e in entries}),'categories':{cn:sum(e['category']==en for e in entries)for en,_,cn in categories},'source_citations':sum(len(e['sources'])for e in entries),'unique_source_urls':len({s['url']for e in entries for s in e['sources']}),'immutable_input_sha256':hashlib.sha256(SRC.read_bytes()).hexdigest(),'public_source_check_omission':'7 research-process notes omitted from public data; naming, evidence, scopes and all references retained. Original supplied file unchanged.','llm_id':entries[-1]['id'],'sidebar_subcategories':0,'page_topic_filters':len(categories),'index_layout':'Introduction: topic filters, alphabet anchors and all term rows','supplementary_terms':[e['id'] for e in entries if e['category'] not in {c[0]for c in categories}],'files':paths}
(OUT/'manifest.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items()if k!='files'},ensure_ascii=False,indent=2));print('files',len(paths))
