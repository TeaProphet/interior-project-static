const fs=require('node:fs'),path=require('node:path');
const {DatabaseSync}=require('node:sqlite');
const root=path.resolve(__dirname,'..'), source=path.resolve(root,'..');
const write=(p,s)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),s)};
for(const p of ['src','public','index.html','package.json','package-lock.json','tailwind.config.ts','postcss.config.js','tsconfig.json','tsconfig.app.json','tsconfig.node.json','eslint.config.js']) fs.cpSync(path.join(source,'interyer-proekt-web',p),path.join(root,p),{recursive:true});
const d=new DatabaseSync(path.join(source,'interyer-proekt-cms/.tmp/data.db'),{readOnly:true});
const report={categories:0,images:0,missing:[]};
for(const row of d.prepare('select * from furniture_type where published_at is not null').all()){
 const photos=[];
 for(const f of d.prepare('select f.* from files f join files_related_mph r on r.file_id=f.id where r.related_id=? and r.related_type=? and r.field=? order by r."order"').all(row.id,'api::furniture-types.furniture-types','photos')){
  const name=path.basename(f.url),src=path.join(source,'interyer-proekt-cms/public/uploads',name);
  if(!fs.existsSync(src)){report.missing.push(name);continue;}
  fs.mkdirSync(path.join(root,'public/media'),{recursive:true});fs.copyFileSync(src,path.join(root,'public/media',name));
  photos.push({id:f.id,name:f.name,url:'/media/'+name});report.images++;
 }
 const c={id:row.document_id,documentId:row.document_id,title:row.title,description:row.description||'',order:row.order||0,photos,updatedAt:new Date(row.updated_at).toISOString()};
 write('content/furniture/'+c.id+'.json',JSON.stringify(c,null,2)+'\n');report.categories++;
}
const r=d.prepare('select * from contact where published_at is not null order by published_at desc limit 1').get();
if(!r)throw Error('No published contacts');
const contacts={};for(const [a,b] of Object.entries({phoneNumber:'phone_number',whatsappNumber:'whatsapp_number',telegram:'telegram',vk:'vk',address:'address',email:'email',inn:'inn',ogrn:'ogrn'}))contacts[a]=r[b]||'';
write('content/contacts.json',JSON.stringify(contacts,null,2)+'\n');d.close();
write('IMPORT-REPORT.json',JSON.stringify(report,null,2));
// Remove obsolete features from the independent copy only.
for(const name of ['Reviews','ReviewVerify','Partnership'])fs.rmSync(path.join(root,'src/pages',name+'.tsx'),{force:true});
for(const name of ['ReviewCard','ReviewSubmitModal','ProjectCalculationModal'])fs.rmSync(path.join(root,'src/components',name+'.tsx'),{force:true});
fs.rmSync(path.join(root,'src/services/reviewService.ts'),{force:true});
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory()){walk(p);continue;}if(!/\.tsx?$/.test(p))continue;let s=fs.readFileSync(p,'utf8');
 s=s.replace(/^import .*?(?:ReviewCard|ProjectCalculationModal|reviewService|\.\/pages\/(?:Reviews|Partnership)).*?;\r?\n/gm,'');
 s=s.replace(/<ProjectCalculationModal[\s\S]*?\/>/g,'<Link to="/contacts"><Button variant="contact">Контакты</Button></Link>');
 s=s.replace(/<Link\s[^>]*?to="\/(?:reviews|partnership)"[\s\S]*?<\/Link>/g,'');
 s=s.replace(/\s*<Route path="\/(?:reviews|partnership)"[^\n]+/g,'');
 if(p.endsWith('Home.tsx')){s=s.replace(/  const \[reviews[^\n]+\n/,'').replace(', reviewsData','').replace(/,\s*reviewService.getFeaturedReviews\(3\)/,'').replace(/\s*setReviews\(reviewsData\);/,'').replace(/\{\/\* Reviews Section \*\/\}[\s\S]*?<\/section>/,'').replace('Оставляете заявку на сайте или звоните','Связываетесь с нами по телефону');}
 fs.writeFileSync(p,s);
}}
walk(path.join(root,'src'));
write('src/config/api.ts','export const FEATURE_FLAGS = { HIDE_PRIVACY_AND_FORMS: true };\n');
console.log(report);
