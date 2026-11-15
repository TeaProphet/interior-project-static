const fs=require('node:fs'),ts=require('typescript'),assert=require('node:assert/strict');
const source=fs.readFileSync('src/admin/github.ts','utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const mod={exports:{}};new Function('exports','module',code)(mod.exports,mod);const {GitHub}=mod.exports;
const content={categories:[{id:'a',documentId:'a',title:'Кухни',description:'',order:0,photos:[],updatedAt:''}],contacts:{phoneNumber:'123'}};
const snap={head:'old',tree:'oldtree',content,paths:['content/contacts.json','content/furniture/a.json']};
const calls=[];
global.fetch=async(url,opts)=>{calls.push({url,opts});let json={};if(url.endsWith('git/ref/heads/main'))json={object:{sha:'old'}};if(url.endsWith('git/trees'))json={sha:'newtree'};if(url.endsWith('git/commits'))json={sha:'newcommit'};return{ok:true,json:async()=>json};};
(async()=>{
const client=new GitHub('test-token');const saved=await client.save(snap,content,new Map());assert.equal(saved.tree,'newtree');assert.equal(saved.sha,'newcommit');assert.equal(calls.filter(x=>x.opts.method==='PATCH').length,1);assert.equal(JSON.parse(calls.at(-1).opts.body).force,false);
global.fetch=async()=>({ok:true,json:async()=>({object:{sha:'someone-else'}})});await assert.rejects(()=>client.save(snap,content,new Map()),/другим редактором/);
global.fetch=async()=>({ok:false,status:401});await assert.rejects(()=>client.load(),/истёк/);
global.fetch=async()=>({ok:false,status:403});await assert.rejects(()=>client.load(),/Доступ ограничен/);
global.fetch=async()=>{throw Error('offline')};await assert.rejects(()=>client.load(),/Проверьте интернет/);
client.clear();await assert.rejects(()=>client.load(),/Войдите/);
console.log('PASS: atomic commit, conflict, invalid token, permissions, network, logout');
})().catch(e=>{console.error(e);process.exitCode=1});
