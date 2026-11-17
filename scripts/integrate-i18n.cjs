const ts=require('typescript'), fs=require('fs'), path=require('path');
const root=path.resolve('src');
const files=[];function walk(p){for(const e of fs.readdirSync(p,{withFileTypes:true})){const f=path.join(p,e.name);if(e.isDirectory()){if(!f.includes(path.join('lib','i18n')))walk(f)}else if(f.endsWith('.tsx'))files.push(f)}}walk(root);
let total=0;
for(const f of files){if(/layout\.tsx$|json-ld\.tsx$|language-switcher\.tsx$|hero-scene\.tsx$/.test(f))continue;
 let src=fs.readFileSync(f,'utf8');const sf=ts.createSourceFile(f,src,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX), edits=[];const client=f.includes(path.sep+'components'+path.sep);let used=false;
 function add(s,e,v){edits.push([s,e,v]);used=true;}
 function visit(n){
  if(ts.isJsxText(n)){const text=n.text.replace(/\s+/g,' ');if(/[A-Za-z]/.test(text)){const key=text.trim();add(n.getStart(sf),n.end,'{tx('+JSON.stringify(key)+')}');}return;}
  if(ts.isJsxAttribute(n) && n.initializer && ['alt','title','placeholder','aria-label','label','eyebrow','lede'].includes(n.name.getText(sf)) && ts.isStringLiteral(n.initializer)){if(n.initializer.text)add(n.initializer.getStart(sf),n.initializer.end,'{tx('+JSON.stringify(n.initializer.text)+')}');return;}
  if(ts.isJsxExpression(n)&&n.expression&&!ts.isJsxAttribute(n.parent)) {let ex=n.expression;const text=ex.getText(sf);const blocked=/^(values\.|record\.|reference\b|product\.model\b|item\.model\b|p\.model\b|site\.contact\.(email|phone)\b)/.test(text);if(!blocked && !containsJsx(ex) && !(ts.isCallExpression(ex)&& /\.map$/.test(ex.expression.getText(sf)))){add(ex.getStart(sf),ex.end,'tx('+text+')');return;}}
  ts.forEachChild(n,visit);
 }
 function containsJsx(n){if(ts.isJsxElement(n)||ts.isJsxSelfClosingElement(n)||ts.isJsxFragment(n))return true;let yes=false;ts.forEachChild(n,c=>{if(containsJsx(c))yes=true});return yes;}
 visit(sf);if(!used)continue;
 for(const n of sf.statements){if(ts.isFunctionDeclaration(n)&&n.body&&containsJsx(n.body)){const async=!!n.modifiers?.some(m=>m.kind===ts.SyntaxKind.AsyncKeyword);edits.push([n.body.getStart(sf)+1,n.body.getStart(sf)+1, '\n  const tx = '+(!client&&async?'(await getI18n()).t':'useTranslations()')+';\n']);}}
 edits.sort((a,b)=>b[0]-a[0]);for(const [s,e,v]of edits)src=src.slice(0,s)+v+src.slice(e);
 const imp=client?'@/lib/i18n/client':'@/lib/i18n/server';src='import { useTranslations'+(!client?', getI18n':'')+' } from '+JSON.stringify(imp)+';\n'+src;
 if(client){src=src.replace(/"use client";\s*/,'');src='"use client";\n'+src;}
 fs.writeFileSync(f,src);console.log(path.relative(root,f),edits.length);total+=edits.length;
}console.log('edits',total);
