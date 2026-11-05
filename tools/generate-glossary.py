from pathlib import Path
import json,re,html,hashlib,collections,argparse
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description="Generate the PACOM glossary with topic filters and A-Z rows, without term detail pages.")
parser.add_argument('--source',type=Path,default=ROOT/'glossary/data.json')
parser.add_argument('--report-dir',type=Path,required=True)
args=parser.parse_args()
SRC=args.source
OUT=args.report_dir
OUT.mkdir(parents=True,exist_ok=True)
entries=json.loads(SRC.read_text())
# Apply the requested public-name cleanup to both archived and current inputs.
removed_name_notes=(
 '〔NTi中文用语〕','〔香港政府用语〕','〔政府救护及TAF生物风险管理资料用语〕',
 '〔香港机电工程署建筑运维用语〕','〔路创、尚飞中文用语〕','〔浙江省导则用语〕',
 '〔西门子中文资料用语〕','〔本词主要指外围护部分〕','〔企业中文用语〕','〔GB 50314语境〕',
 '〔NREL中文用语〕','〔华为及建筑设计企业用语〕','〔SBTi用语〕','〔SMUD中文用语〕',
 '〔中瑞合作研究用语〕','建研所用语：建筑设施维护管理信息交付标准','建筑设施维护管理信息交付标准',
 '建研所用语：','〔公共机构标准用语〕','〔厂商中文用语〕',
 '；中文转述名','〔其历史中文指引用语〕','〔飞利浦产品用语〕','〔通力用语〕',
 '〔江苏省质量和标准化研究院平台用语〕','〔GRESB用语〕','〔空调自然冷却语境〕',
 '〔施耐德、西门子中文用语〕','〔须区分语境〕','〔IFRS／GRESB用语〕',
 '〔政府及IEA中文用语〕','〔不同政府中文用语〕',
 '〔HPE用语〕','；IPCC AR6用语','〔Google Cloud中文技术文档用语〕','〔RMI用语〕',
 '〔WHO用语〕','〔标准类别用语〕','〔建筑空间／设施语境〕','；亦称大型语言模型',
 '；能源与环境设计先锋〔GBCI中文用语〕','〔DGNB中文用语〕','〔Tridium用语〕',
 '〔香港规划用语〕','〔USGBC用语〕','〔政府中文用语〕',
 '〔AWS、工研院中文用语〕','〔并列设施类别〕','〔厂商用语〕',
 '〔GB/T50155暖通语境〕','〔IURC China项目中文用语〕',
 '中文转述名','耗能密度','IPCC AR6用语','亦称大型语言模型','〔GBCI中文用语〕',
 '〔USGBC中文用语〕','〔政府平台收录方案用语〕','〔DALI联盟及国标用语〕',
 '〔住建部技术指南用语〕','〔建研所智慧空间研究用语〕','〔中瑞零碳建筑合作项目中文用语〕',
 '〔楼宇测控点语境，西门子用语〕','〔香港建筑署用语〕','〔GB55031功能类别对应，非逐字英译〕',
 '〔香港政府组合用语〕','〔对应本词零售用途〕','〔施耐德楼宇技术资料用语〕',
 '〔国标用途类别对应〕','〔西雅图政府用语〕','〔香港绿色建筑议会用语〕',
 '〔政府公开研究用语〕','〔政府研究用语〕','〔联合国中文报告用语〕',
 '〔场馆类别对应〕','〔建筑用能按用途细分语境〕','〔CTBUH历史中文用语〕',
 '〔NCC电信法规用语〕','〔恒基地产项目中文用语，功能类别对应〕','另见“热储能”用法',
)
entries=[dict(e) for e in entries if e['id'] not in ('enocean','nabers')]
for e in entries:
 for note in removed_name_notes:e['zh_display']=e['zh_display'].replace(note,'')
 e['zh_display']=e['zh_display'].strip('；：，、 ')
 e['definition_zh']=e['definition_zh'].replace('必须说明能源范围、现场或源头能耗及建筑面积口径。','')
 if e['definition_zh'].endswith('；'):e['definition_zh']=e['definition_zh'][:-1]+'。'
# Individual term pages are no longer part of the published glossary.
removed_pages=[]
for obsolete_page in sorted((ROOT/'glossary/terms').glob('*.mdx')):
 removed_pages.append(str(obsolete_page.relative_to(ROOT)));obsolete_page.unlink()
obsolete_ai_page=ROOT/'glossary/ai.mdx'
if obsolete_ai_page.exists():
 removed_pages.append('glossary/ai.mdx');obsolete_ai_page.unlink()
categories=[('Fundamentals','fundamentals','基础概念'),('Systems & controls','systems-controls','系统与控制'),('Protocols & standards','protocols-standards','协议与标准'),('Connectivity','connectivity','网络与通信'),('Data & software','data-software','数据与软件'),('Energy & sustainability','energy-sustainability','能源与可持续发展'),('Health & occupancy','health-occupancy','室内环境与空间使用'),('Certifications & ratings','certifications-ratings','认证、评级与合规'),('Building types','building-types','建筑与项目类型')]
assert len(entries)==len({x['id'] for x in entries})
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
# Retain the structured source data without generating individual term pages.
public=[]
for e in entries:
 slug,cn=bycat[e['category']]
 data={**e,'sources':[{k:v for k,v in s.items() if k!='source_check'} for s in e['sources']]}
 public.append(data)
# Category compatibility pages show the same names and definitions without detail links.
for en,slug,cn in categories:
 items=sorted((e for e in entries if e['category']==en),key=lambda e:e['en'].casefold())
 s=fm(title=cn,description=en+' · '+str(len(items))+' 条词汇',sidebarTitle='分类概览',hideFooterPagination=True)
 s+=link('全部词汇与检索','/glossary/index')+'\n\n'
 s+='按英文名称排列的中英文术语与中文释义。\n\n'
 for e in items:
  s+='### '+md(e['en'])+'\n\n'+md(e['zh_display'])+'\n\n'+md(e['definition_zh'])+'\n\n'
 write('glossary/'+slug+'.mdx',s)
write('glossary/index.mdx',fm(title='术语表',description=f'{len(entries)} 条智能建筑中英文术语，涵盖建筑控制、通信、数据、能源及认证。',sidebarTitle='术语表',mode='wide',hideFooterPagination=True)+'''import { GlossaryIndex } from "/snippets/glossary-index.jsx";

<GlossaryIndex />

<details>
<summary>编写说明与来源</summary>

英文词目参考 [Smart Building Database](https://smartbuildingdatabase.com/tools/glossary)。本页集中展示中英文术语与中文释义，可按主题、字母索引和关键词查阅。

资料复核日期：2026-11-05

</details>
''')
# Public data preserves every naming/scope/citation field. Local research-log paths stay in the immutable source file.
write('glossary/data.json',json.dumps(public,ensure_ascii=False,indent=2)+'\n')
indexdata=[{k:e[k] for k in ['id','en','zh_display','definition_zh']}|{'category':bycat[e['category']][0]} for e in entries]
indexdata.sort(key=lambda x:x['en'].casefold())
component=(ROOT/'tools/glossary-index.template.jsx').read_text()
component=component.replace('__ENTRIES__',json.dumps(indexdata,ensure_ascii=False)).replace('__CATEGORIES__',json.dumps([{'id':slug,'name':cn,'count':sum(e['category']==en for e in entries)}for en,slug,cn in categories],ensure_ascii=False))
write('snippets/glossary-index.jsx',component)
# Match the current remote navigation and leave its two top-level tabs intact.
config=json.loads((ROOT/'docs.json').read_text())
tab=next(t for t in config['navigation']['languages'][0]['tabs'] if t['tab']=='产品文档')
glossary_group={'group':'工具','pages':['glossary/index']}
positions=[i for i,g in enumerate(tab['groups']) if g['group'] in ('参考资料','术语表','工具')]
if positions:
 tab['groups'][positions[0]]=glossary_group
 for i in reversed(positions[1:]):del tab['groups'][i]
else:tab['groups'].append(glossary_group)
# Remove individual detail routes and keep only category compatibility pages.
tab['groups']=[g for g in tab['groups'] if g['group'] not in ('术语详情','术语兼容页面')]
tab['groups'].append({'group':'术语兼容页面','hidden':True,'searchable':False,'pages':['glossary/'+slug for _,slug,_ in categories]})
write('docs.json',json.dumps(config,ensure_ascii=False,indent=2)+'\n')
dev=(ROOT/'developers/index.mdx').read_text()
old='\n\n## 参考词汇\n\n[智能建筑词汇](/glossary/index)收录 219 条中英文词汇，可按主题分类和关键词查阅名称、释义与来源。'
new=f'\n\n## 术语表\n\n[术语表](/glossary/index)收录 {len(entries)} 条中英文术语，可按主题、字母索引和关键词查阅名称与释义。'
dev=dev.replace('可按原站九类目录和关键词查阅名称、释义与来源。','可按字母索引和关键词查阅名称、释义与来源。')
dev=re.sub(r'(\[术语表\]\(/glossary/index\)收录 )\d+( 条中英文术语)',lambda m:m[1]+str(len(entries))+m[2],dev)
dev=dev.replace('可按字母索引和关键词查阅名称、释义与来源。','可按主题、字母索引和关键词查阅名称与释义。')
if old in dev:dev=dev.replace(old,new)
elif new not in dev:dev=dev.rstrip()+new+'\n'
write('developers/index.mdx',dev)
report={'count':len(entries),'unique_ids':len({e['id']for e in entries}),'categories':{cn:sum(e['category']==en for e in entries)for en,_,cn in categories},'source_citations':sum(len(e['sources'])for e in entries),'unique_source_urls':len({s['url']for e in entries for s in e['sources']}),'public_data_sha256':hashlib.sha256((ROOT/'glossary/data.json').read_bytes()).hexdigest(),'cleanup':'Requested display-name text and EUI sentence removed. EnOcean and NABERS excluded. All individual term pages and the single-term AI compatibility page removed.','detail_page_count':len(list((ROOT/'glossary/terms').glob('*.mdx'))),'llm_id':entries[-1]['id'],'sidebar_subcategories':0,'page_topic_filters':len(categories),'index_layout':'Topic filters, alphabet anchors and non-link term rows','supplementary_terms':[e['id'] for e in entries if e['category'] not in {c[0]for c in categories}],'files':paths}
(OUT/'manifest.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items()if k!='files'},ensure_ascii=False,indent=2));print('files',len(paths))
