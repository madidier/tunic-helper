(function(){"use strict";var e={4149:function(e,n,t){var o=t(9855),s=t(196),a=t(1714),i=t(4552),r=t(9144),l={props:["value"],emits:["change","scrollTopChange"],setup(e,{expose:n,emit:t}){const o=e,a=(0,i.iH)(null);let l=null;(0,s.bv)((()=>{l=r.editor.create(a.value,{value:o.value,language:"markdown",automaticLayout:!0,scrollBeyondLastLine:!1,wordBasedSuggestions:!1,wordWrap:"on"}),l.onDidChangeModelContent((()=>{const e=l.getValue();e!==o.value&&t("change",e)})),l.onDidScrollChange((e=>{e.scrollTopChanged&&t("scrollTopChange",c())}))})),(0,s.Jd)((()=>{l&&l.dispose(),l=null})),(0,s.YP)((()=>o.value),(()=>{l.getValue()!==o.value&&l.setValue(o.value)}));const c=()=>l.getVisibleRanges()[0].startLineNumber,u=e=>{l.revealRangeAtTop({startLineNumber:e,startColumn:1,endLineNumber:e,endColumn:1})},d=e=>{l.executeEdits("tunic-helper",[{range:{startLineNumber:e.position.start.line,startColumn:e.position.start.column,endLineNumber:e.position.end.line,endColumn:e.position.end.column},text:e.value}])};return n({revealLine:u,applyUpdate:d,getTopLine:c}),(e,n)=>((0,s.wg)(),(0,s.iD)("div",{ref_key:"editorContainer",ref:a},null,512))}},c=t(2903);const u=(0,c.Z)(l,[["__scopeId","data-v-234529b5"]]);var d=u,h=t(5782),g=t.n(h);const p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",f="AA",v=23,b=35,m=2,w=e=>64*p.indexOf(e[0])+p.indexOf(e[1]),y=e=>p[e/64|0]+p[e%64],k=e=>e.length/2|0,_=function*(e){for(let n=0;n<k(e);++n)yield w(e.slice(2*n,2*n+2))},C=function*(e){for(let n=0;n<I.length;++n){const t=e>>n&1;yield[I[n],!!t,n]}},S=(e,n,{highlight:t}={})=>{e.save(),e.lineCap="round";for(const o of _(n)){const n={lightgray:[],lightgreen:[],black:[],green:[]};for(const[s,a]of C(o)){if(!a&&!t)continue;e.lineWidth+=m;const o=t&&e.isPointInStroke(s,t.x,t.y);e.lineWidth-=m,n[a?o?"green":"black":o?"lightgreen":"lightgray"].push(s)}for(const t of["lightgray","lightgreen","black","green"]){e.strokeStyle=t;for(const o of n[t])e.stroke(o)}e.translate(v,0)}e.restore(),e.stroke(O(k(n)))},x=(e,n,t)=>{e.save();try{for(const[o,s]of g().enumerate(_(n))){if(e.isPointInPath(F,t.x,t.y))return{code:y(o),index:s};e.translate(v,0)}}finally{e.restore()}},T=(e,n,t)=>{const o=U(e,n,t);if(D(o))return n;const s=g().zip(_(n),_(o)).some((([e,n])=>(e&n)!==n));return s?L(n,o):P(n,o)},U=(e,n,t)=>{e.save(),e.lineCap="round",e.lineWidth+=m;const o=[];for(const s of _(n)){let n=0;for(const[o,,s]of C(f))n|=e.isPointInStroke(o,t.x,t.y)<<s;o.push(y(n)),e.translate(v,0)}return e.restore(),o.join("")},D=e=>/^A*$/.test(e),L=(e,n)=>g().zip(_(e),_(n)).map((([e,n])=>y(e|n))).toArray().join(""),P=(e,n)=>g().zip(_(e),_(n)).map((([e,n])=>y(e&~n))).toArray().join(""),j=(e,n)=>g().zip(_(e),_(n)).map((([e,n])=>y(e&n))).toArray().join(""),H=e=>({width:k(e)*v,height:b}),I=[new Path2D("M 0 6 L 0 24"),new Path2D("M 0 6 L 11 0"),new Path2D("M 11 0 L 22 6"),new Path2D("M 0 6 L 11 12 L 11 15"),new Path2D("M 11 15 L 11 12 L 22 6"),new Path2D("M 11 0 L 11 15"),new Path2D("M 0 24 L 11 18"),new Path2D("M 11 18 L 22 24"),new Path2D("M 0 24 L 11 30"),new Path2D("M 11 30 L 22 24"),new Path2D("M 11 18 L 11 30"),(()=>{const e=new Path2D;return e.arc(11,32,2,0,2*Math.PI),e})()],F=(()=>{const e=new Path2D;return e.rect(0,0,v,b),e})(),O=e=>{const n=new Path2D;return n.moveTo(0,15),n.lineTo(e*v,15),n},Y=({masks:e,parts:n})=>{const t={},o={};for(const s of n||[])t[s.glyph]={...s,mnemonic:s.mnemonic||"="+s.glyph},o[s.mnemonic]=s.glyph;return{masks:e||[],glyphs:t,mnemonics:o}},A=(e,n)=>{if(e===f)return-1;for(let t=0;t<n.length;++t)if(j(e,n[t])===e)return t;return-1},M=(e,n)=>{if(e===f)return[{glyph:f,mnemonic:"",description:"empty"}];const t=[];let o=e;for(const s of n.masks){const a=j(e,s);a!==f&&n.glyphs[a]&&(t.push(n.glyphs[a]),o=P(o,a))}if(o!==f){const e=n.glyphs[o];t.push({glyph:o,mnemonic:e&&e.mnemonic||"="+o,description:e&&e.description||"unknown"})}return t},N=(e,n)=>{const t=[];for(const o of e.split(",")){let e=f;for(const t of o.split(/\s+/))t&&(n.mnemonics[t]?e=L(e,n.mnemonics[t]):3===t.length&&"="===t[0]&&(e=L(e,t.slice(1))));t.push(e)}return t.join("")},q=(e,n)=>e.startsWith(":")?N(e.slice(1),n):e,z=["width","height"];var V={props:{word:String,disabled:Boolean,scale:{type:Number,default:1.5}},emits:["change","hover"],setup(e,{emit:n}){const t=e,o=2,a=(0,i.iH)(null),r=(0,i.iH)(null),l=(0,s.Fl)((()=>{const e=H(t.word),n=e=>(e+2*o)*t.scale;return{width:n(e.width),height:n(e.height)}})),c=(e,n=!0)=>{const s=a.value.getContext("2d");n&&s.clearRect(0,0,l.value.width,l.value.height),s.save(),s.lineWidth=2,s.scale(t.scale,t.scale),s.translate(o,o);try{return e(s)}finally{s.restore()}},u=()=>{c((e=>S(e,t.word,{highlight:r.value})))},d=(e,o)=>{const s=c((n=>T(n,t.word,{x:e,y:o})),!1);s!==t.word&&n("change",s)},h=(e,o)=>{const s={x:e,y:o};t.disabled||(r.value=s),n("hover",c((e=>x(e,t.word,s)),!1))},g=()=>{r.value=null,n("hover",null)};return(0,s.YP)([()=>t.word,l,r],(()=>{(0,s.Y3)((()=>{a.value&&u()}))})),(0,s.bv)(u),(n,t)=>((0,s.wg)(),(0,s.iD)("canvas",{ref_key:"canvas",ref:a,width:(0,i.SU)(l).width,height:(0,i.SU)(l).height,onMousemove:t[0]||(t[0]=e=>h(e.offsetX,e.offsetY)),onMouseleave:t[1]||(t[1]=e=>g()),onClick:t[2]||(t[2]=n=>!e.disabled&&d(n.offsetX,n.offsetY))},null,40,z))}};const R=(0,c.Z)(V,[["__scopeId","data-v-0bdcf195"]]);var W=R;const B=e=>((0,s.dD)("data-v-7b535e88"),e=e(),(0,s.Cn)(),e),K=B((()=>(0,s._)("h4",null,"General",-1))),E={class:"options"},G={class:"checkbox"},J=["checked"],Z=(0,s.Uk)(" Show translations "),Q={class:"checkbox"},X=["checked"],$=(0,s.Uk)(" Show definitions "),ee=B((()=>(0,s._)("h4",null,"Glyph Masks",-1))),ne={class:"masks"},te=["onFocus"],oe=B((()=>(0,s._)("h4",null,"Glyph Parts",-1))),se={class:"parts"},ae=["onFocus"],ie={class:"field has-addons"},re={class:"control mnemo"},le=["value","onChange"],ce={class:"control is-expanded"},ue=["value","onChange"],de={class:"control"},he=["onClick"],ge=(0,s.uE)('<div class="message is-info" data-v-7b535e88><div class="message-header" data-v-7b535e88><p data-v-7b535e88>Glyph Composition</p></div><div class="message-body" data-v-7b535e88><p data-v-7b535e88> Once your glyph parts are set up, you will be able to use them to input a Tunic word via the following syntax: <code data-v-7b535e88>`: a b c, d e f`</code>. </p><p data-v-7b535e88> The colon <code data-v-7b535e88>:</code> must appear right after the backtick <code data-v-7b535e88>`</code> to indicate that you are composing a Tunic word from mnemonics. Each comma <code data-v-7b535e88>,</code> separates one glyph from the next and mnemonics must be separated by spaces. Please note that mnemonics are case-sensitive. </p><p data-v-7b535e88> Your composition may include empty glyphs. For instance, <code data-v-7b535e88>`:abc,,`</code> yields a three-glyph word where the first glyph corresponds to the mnemonic abc, and the second two are empty. </p><p data-v-7b535e88> It is also possible to input a glyph code as a mnemonic by prefixing it with an equal sign. For instance, <code data-v-7b535e88>`:=xx,,,=bb`</code> is equivalent to <code data-v-7b535e88>`xxAAAAbb`</code>. </p><p data-v-7b535e88> Glyph masks are necessary if you want tooltips to dissect a glyph into multiple parts. </p><p data-v-7b535e88> Parts are sorted by, in order: mask, mnemonic, and description. If there are duplicates, when displaying a tooltip, only the last matching part will be displayed. </p></div></div>',1);var pe={props:["settings"],emits:["change"],setup(e,{emit:n}){const t=e,a=(0,s.Fl)((()=>!("showTranslations"in t.settings)||t.settings.showTranslations)),r=(0,s.Fl)((()=>!("showDefinitions"in t.settings)||t.settings.showDefinitions)),l=e=>{n("change",{...t.settings,showTranslations:e.target.checked})},c=e=>{n("change",{...t.settings,showDefinitions:e.target.checked})},u=(0,i.iH)(-1),d=(e,o)=>{const s=t.settings.masks.slice();s[o]=e,n("change",{...t.settings,masks:s})},h=()=>{const e=t.settings.masks&&t.settings.masks.slice()||[];e.push(f),n("change",{...t.settings,masks:e})},g=()=>{const e=t.settings.masks.slice(0,t.settings.masks.length-1);n("change",{...t.settings,masks:e})},p=(0,i.iH)(-1),v=e=>(o,s)=>{const a=t.settings.parts.slice();a[s]={...a[s],[e]:o},n("change",{...t.settings,parts:a})},b=v("glyph"),m=v("mnemonic"),w=v("description"),y=()=>{const e=t.settings.parts&&t.settings.parts.slice()||[];e.push({glyph:f,mnemonic:"",description:""}),n("change",{...t.settings,parts:e})},k=e=>{const o=t.settings.parts.slice();o.splice(e,1),n("change",{...t.settings,parts:o})},_=()=>{const e=t.settings.parts.slice(),{masks:o}=t.settings;e.sort(((e,n)=>{const t=A(e.glyph,o),s=A(n.glyph,o);if(t!==s)return-1===t||-1!==s&&t>s?1:-1;const a=e.mnemonic.localeCompare(n.mnemonic);return 0!==a?a:e.description.localeCompare(n.description)})),n("change",{...t.settings,parts:e})};return(n,t)=>((0,s.wg)(),(0,s.iD)(s.HY,null,[K,(0,s._)("p",E,[(0,s._)("label",G,[(0,s._)("input",{type:"checkbox",checked:(0,i.SU)(a),onChange:t[0]||(t[0]=e=>l(e))},null,40,J),Z]),(0,s._)("label",Q,[(0,s._)("input",{type:"checkbox",checked:(0,i.SU)(r),onChange:t[1]||(t[1]=e=>c(e))},null,40,X),$])]),ee,(0,s._)("p",ne,[((0,s.wg)(!0),(0,s.iD)(s.HY,null,(0,s.Ko)(e.settings.masks||[],((e,n)=>((0,s.wg)(),(0,s.iD)("span",{key:n,tabindex:"0",onBlur:t[2]||(t[2]=e=>u.value=-1),onFocus:e=>u.value=n},[u.value!==n?((0,s.wg)(),(0,s.j4)(W,{key:0,word:e,scale:1,disabled:""},null,8,["word"])):((0,s.wg)(),(0,s.j4)(W,{key:1,word:e,scale:2,onChange:e=>d(e,n)},null,8,["word","onChange"]))],40,te)))),128)),(0,s._)("button",{class:"button is-ghost",onClick:h}," Add "),e.settings.masks&&e.settings.masks.length?((0,s.wg)(),(0,s.iD)("button",{key:0,class:"button is-ghost",onClick:g}," Remove ")):(0,s.kq)("",!0)]),oe,(0,s._)("p",se,[((0,s.wg)(!0),(0,s.iD)(s.HY,null,(0,s.Ko)(e.settings.parts,((e,n)=>((0,s.wg)(),(0,s.iD)(s.HY,{key:n},[(0,s._)("span",{tabindex:"0",onBlur:t[3]||(t[3]=e=>p.value=-1),onFocus:e=>p.value=n},[p.value!==n?((0,s.wg)(),(0,s.j4)(W,{key:0,word:e.glyph,scale:1,disabled:""},null,8,["word"])):((0,s.wg)(),(0,s.j4)(W,{key:1,word:e.glyph,scale:2,onChange:e=>(0,i.SU)(b)(e,n)},null,8,["word","onChange"]))],40,ae),(0,s._)("div",ie,[(0,s._)("div",re,[(0,s._)("input",{class:"input",type:"text",placeholder:"mnemonic",value:e.mnemonic,onChange:e=>(0,i.SU)(m)(e.target.value,n)},null,40,le)]),(0,s._)("div",ce,[(0,s._)("input",{class:"input",type:"text",placeholder:"description",value:e.description,onChange:e=>(0,i.SU)(w)(e.target.value,n)},null,40,ue)]),(0,s._)("div",de,[(0,s._)("button",{class:"button is-danger is-light",onClick:e=>k(n)},"Remove",8,he)])])],64)))),128))]),(0,s._)("p",null,[(0,s._)("button",{class:"button is-ghost",onClick:y},"Add"),(0,s.wy)((0,s._)("button",{class:"button is-ghost",onClick:_},"Sort",512),[[o.F8,e.settings.parts&&e.settings.parts.length>1]])]),ge],64))}};const fe=(0,c.Z)(pe,[["__scopeId","data-v-7b535e88"]]);var ve=fe;const be={class:"dropdown-menu"},me={class:"dropdown-content"},we=(0,s.Uk)(),ye=(0,s.Uk)(),ke={class:"dropdown-item"};var _e={props:["node","settings"],emits:["change","settingsChange"],setup(e,{expose:n,emit:t}){const o=e,r=(0,i.iH)(null),l=(0,i.iH)({}),c=(0,i.iH)(!1),u=(0,i.iH)(""),d=e=>{e&&e.code&&(u.value=e.code)},h=(0,s.Fl)((()=>{switch(o.node.type){case"root":return{container:""};case"link":return{container:"a",href:o.node.url,title:o.node.title,target:"_blank"};case"paragraph":return{container:"p"};case"heading":{const e=0|o.node.depth;return{container:e>0&&e<=6?"h"+e:"h2"}}case"thematicBreak":return{single:"hr"};case"blockquote":return{container:"blockquote"};case"list":return{container:o.node.ordered?"ol":"ul"};case"listItem":return{container:"li"};case"html":return"<br>"===o.node.value?{single:"br"}:{text:o.node.value};case"text":return{text:o.node.value};case"code":if("settings"!==o.node.lang)return{code:!0};try{const e=o.node.value.trim();return{settings:e?JSON.parse(e):{}}}catch(e){return{warn:`Parse error in settings: ${e.message}`}}case"emphasis":return{container:"em"};case"strong":return{container:"strong"};case"inlineCode":{const e=q(o.node.value,o.settings);return{glyphs:e,asKnown:!c.value&&o.settings.showTranslations&&o.settings.definitions[e]}}case"break":return{single:"br"};case"definition":return o.settings.showDefinitions?{defn:q(o.node.label,o.settings),value:o.node.url}:{};default:return{warn:`Unsupported content (${o.node.type})`}}})),g=(0,s.Fl)((()=>M(u.value||f,o.settings))),p=e=>t("change",{position:o.node.position,value:e}),v=e=>t("change",e),b=e=>{t("settingsChange",{position:o.node.position,value:e})},m=e=>t("settingsChange",e),w=()=>!!o.node.children,y=e=>{if(r.value)r.value.scrollIntoView();else if(w()){for(let n=0;n<o.node.children.length;++n)if(o.node.children[n].position.end.line>=e)return void l.value[n].scrollToLine(e);l.value[o.node.children.length-1].scrollToLine(e)}},k=e=>{if(r.value)return o.node.position.start.line;if(w()){for(let n=0;n<o.node.children.length;++n){const t=l.value[n];if(t.isVisibleInRect(e))return t.queryFirstLineVisibleIn(e)}return l.value[o.node.children.length-1].queryFirstLineVisibleIn(e)}},_=e=>{if(r.value){const n=r.value.getBoundingClientRect();return n.bottom>e.top}if(w()){for(let n=0;n<o.node.children.length;++n)if(l.value[n].isVisibleInRect(e))return!0;return!1}};return n({scrollToLine:y,queryFirstLineVisibleIn:k,isVisibleInRect:_}),(n,t)=>{const o=(0,s.up)("TunicRenderer",!0);return(0,i.SU)(h).container?((0,s.wg)(),(0,s.j4)((0,s.LL)((0,i.SU)(h).container),{key:0,href:(0,i.SU)(h).href,title:(0,i.SU)(h).title,target:(0,i.SU)(h).target},{default:(0,s.w5)((()=>[((0,s.wg)(!0),(0,s.iD)(s.HY,null,(0,s.Ko)(e.node.children,((n,t)=>((0,s.wg)(),(0,s.j4)(o,{key:t,node:n,settings:e.settings,ref_for:!0,ref:e=>l.value[t]=e,onChange:v,onSettingsChange:m},null,8,["node","settings"])))),128))])),_:1},8,["href","title","target"])):(0,i.SU)(h).single?((0,s.wg)(),(0,s.j4)((0,s.LL)((0,i.SU)(h).single),{key:1,ref_key:"self",ref:r},null,512)):(0,i.SU)(h).text?((0,s.wg)(),(0,s.iD)("span",{key:2,ref_key:"self",ref:r},(0,a.zw)((0,i.SU)(h).text),513)):""===(0,i.SU)(h).container?((0,s.wg)(!0),(0,s.iD)(s.HY,{key:3},(0,s.Ko)(e.node.children,((n,t)=>((0,s.wg)(),(0,s.j4)(o,{key:t,node:n,settings:e.settings,ref_for:!0,ref:e=>l.value[t]=e,onChange:v,onSettingsChange:m},null,8,["node","settings"])))),128)):(0,i.SU)(h).glyphs?((0,s.wg)(),(0,s.iD)("div",{key:4,ref_key:"self",ref:r,class:(0,a.C_)(["dropdown",{"is-hoverable":!(0,i.SU)(h).asKnown}])},[(0,s._)("span",{class:(0,a.C_)(["dropdown-trigger",{known:(0,i.SU)(h).asKnown}]),tabindex:"0",onBlur:t[0]||(t[0]=e=>c.value=!1),onFocus:t[1]||(t[1]=e=>c.value=!0)},[c.value?((0,s.wg)(),(0,s.j4)(W,{key:0,word:(0,i.SU)(h).glyphs,scale:2,onChange:p,onHover:d},null,8,["word"])):(0,i.SU)(h).asKnown?((0,s.wg)(),(0,s.iD)(s.HY,{key:1},[(0,s.Uk)((0,a.zw)((0,i.SU)(h).asKnown),1)],64)):((0,s.wg)(),(0,s.j4)(W,{key:2,word:(0,i.SU)(h).glyphs,scale:1,onHover:d,disabled:""},null,8,["word"]))],34),(0,s._)("div",be,[(0,s._)("div",me,[((0,s.wg)(!0),(0,s.iD)(s.HY,null,(0,s.Ko)((0,i.SU)(g),((e,n)=>((0,s.wg)(),(0,s.iD)("div",{key:n,class:"dropdown-item"},[(0,s.Wm)(W,{word:e.glyph,scale:.6,disabled:""},null,8,["word"]),we,(0,s._)("b",null,(0,a.zw)(e.mnemonic),1),ye,(0,s._)("em",null,(0,a.zw)(e.description),1)])))),128)),(0,s._)("div",ke,[(0,s._)("b",null,(0,a.zw)((0,i.SU)(h).glyphs),1)])])])],2)):(0,i.SU)(h).defn?((0,s.wg)(),(0,s.iD)("p",{key:5,ref_key:"self",ref:r},[(0,s.Wm)(W,{word:(0,i.SU)(h).defn,disabled:"",scale:1},null,8,["word"]),(0,s.Uk)(": "+(0,a.zw)((0,i.SU)(h).value),1)],512)):(0,i.SU)(h).code?((0,s.wg)(),(0,s.iD)("pre",{key:6,ref_key:"self",ref:r},(0,a.zw)(e.node.value),513)):(0,i.SU)(h).settings?((0,s.wg)(),(0,s.iD)("div",{key:7,class:"box",ref_key:"self",ref:r},[(0,s.Wm)(ve,{settings:(0,i.SU)(h).settings,onChange:b},null,8,["settings"])],512)):(0,i.SU)(h).warn?((0,s.wg)(),(0,s.iD)("span",{key:8,class:"warn",ref_key:"self",ref:r},(0,a.zw)((0,i.SU)(h).warn),513)):(0,s.kq)("",!0)}}};const Ce=(0,c.Z)(_e,[["__scopeId","data-v-5be2f6cf"]]);var Se=Ce,xe=t(5788),Te=t(6182),Ue=t(9153),De=t.n(Ue);const Le={class:"navbar is-primary"},Pe=(0,s._)("div",{class:"navbar-brand"},[(0,s._)("div",{class:"navbar-item"},"Glyph Helper")],-1),je={class:"navbar-menu"},He=(0,s._)("div",{class:"navbar-start"},null,-1),Ie={class:"navbar-end"},Fe={class:"editor-wrapper"},Oe={class:"content"};var Ye={setup(e){const n={},t="tunic-code",l=(0,i.iH)(localStorage.getItem(t)||["# Tutorial","Here's a one-glyph blank Tunic word: `AA`","Here's a two-glyphs Tunic word: `V4Qc`","You can edit a Tunic word or make it bigger by clicking on its visualization in the right panel. Try editing the word above.","Notice that you can create blank words by repeating the A letter between backquotes inside the left panel. Try typing a three-glyph blank word here:","Here's a Tunic word you think you've figured out: `xxbb`.",'It shows up as "foobar" because you\'ve written its definition as follows (look on the left panel):',"[xxbb]: foobar",'Notice that the Tunic word is uniquely represented by the series of letters "xxbb"',"You can still edit that word by clicking on it as you would on glyphs. Try it here: `xxbb`","You can also cycle through Tunic words in your manuscript by using tab or shift+tab after you've clicked on the first word in a sequence on the right panel.","Try it here: `Tm` `V4Qc` `iu` `DkLos/` (it's probably gibberish)","Once you've defined and memorized a Tunic word, you may type it faster by using the code editor' completion feature (try typing \"foo\", then enter or tab):","Content is automatically saved in your browser local storage as you type. I would still advise you to make backups.","# This is a [Markdown](https://en.wikipedia.org/wiki/Markdown) subset","## You can have titles","### Subtitles","#### Sub-subtitles and so on...","- You may use...","- ...lists","And have stuff in *italics*, **bold**, ***or both***","You may use a horizontal separator:","***","Once you are comfortable with the basics and want to use the more advanced features of this tool, read [this](https://gist.github.com/madidier/d39adaddc80eeb54925c1c19d09234e7).","And if you ever want to see this text again, just delete all the text and refresh the page to start over.",""].join("\n\n"));(0,s.YP)(l,(()=>localStorage.setItem(t,l.value)));const c=(0,i.iH)("show-both"),u=(0,i.iH)(),h=(0,i.iH)(),g=(0,i.iH)(),p=(0,s.Fl)((()=>(0,xe.j)().parse(l.value))),f=(0,s.Fl)((()=>{const e=De()(p.value,{type:"code",lang:"settings"}),n=(()=>{try{return e?JSON.parse(e.value):{}}catch(n){return{}}})(),t=Y(n),o={};return(0,Te.Vn)(p.value,"definition",(e=>{o[q(e.label,t)]=e.url})),{showTranslations:!0,showDefinitions:!0,definitions:o,...n,...t}})),v=e=>{u.value.applyUpdate({position:e.position,value:"`"+e.value+"`"})},b=e=>{u.value.applyUpdate({position:e.position,value:"```settings\n"+JSON.stringify(e.value,null,2)+"\n```"})},m=()=>{c.value="show-input",k()},w=()=>{c.value="show-rendered",_()},y=()=>{c.value="show-both",k(),_()},k=()=>{const e=x();null!==e&&(0,s.Y3)((()=>{C(e)}))},_=()=>{const e=u.value.getTopLine();null!==e&&(0,s.Y3)((()=>{S(e)}))},C=e=>{n.editor||(n.renderer&&clearTimeout(n.renderer),n.renderer=setTimeout((()=>{n.renderer=null}),100),u.value&&u.value.revealLine(e))},S=e=>{n.renderer||(n.editor&&clearTimeout(n.editor),n.editor=setTimeout((()=>{n.editor=null}),100),g.value&&g.value.scrollToLine(e))},x=()=>g.value&&h.value?g.value.queryFirstLineVisibleIn(h.value.getBoundingClientRect()):null;let T=!1;const U=()=>{T||(window.requestAnimationFrame((()=>{T=!1;const e=x();null!==e&&C(e)})),T=!0)};return(0,s.bv)((()=>{r.languages.registerCompletionItemProvider("markdown",{provideCompletionItems:(e,n)=>{const t=e.getWordUntilPosition(n),o={startLineNumber:n.lineNumber,endLineNumber:n.lineNumber,...t},s=[];for(const a of Object.keys(f.value.definitions))s.push({label:f.value.definitions[a],kind:r.languages.CompletionItemKind.Function,insertText:"`"+a+"`",range:o});return{suggestions:s}}})})),(e,n)=>((0,s.wg)(),(0,s.iD)(s.HY,null,[(0,s._)("nav",Le,[Pe,(0,s._)("div",je,[He,(0,s._)("div",Ie,[(0,s._)("a",{class:(0,a.C_)(["navbar-item is-tab",{"is-active":"show-input"===c.value}]),href:"#",onClick:m}," Input ",2),(0,s._)("a",{class:(0,a.C_)(["navbar-item is-tab",{"is-active":"show-rendered"===c.value}]),href:"#",onClick:w}," Rendered ",2),(0,s._)("a",{class:(0,a.C_)(["navbar-item is-tab is-hidden-mobile",{"is-active":"show-both"===c.value}]),href:"#",onClick:y}," Both ",2)])])]),(0,s.wy)((0,s._)("div",{class:(0,a.C_)(["input-pane",{fullwidth:"show-both"!==c.value}])},[(0,s._)("div",Fe,[(0,s.Wm)(d,{value:l.value,onChange:n[0]||(n[0]=e=>l.value=e),onScrollTopChange:n[1]||(n[1]=e=>S(e)),ref_key:"editor",ref:u},null,8,["value"])])],2),[[o.F8,"show-rendered"!==c.value]]),(0,s.wy)((0,s._)("div",{class:(0,a.C_)(["rendered-pane",{fullwidth:"show-both"!==c.value}]),ref_key:"rendererContainer",ref:h,onScroll:U},[(0,s._)("div",Oe,[(0,s.Wm)(Se,{ref_key:"renderer",ref:g,node:(0,i.SU)(p),settings:(0,i.SU)(f),onChange:v,onSettingsChange:b},null,8,["node","settings"])])],34),[[o.F8,"show-input"!==c.value]])],64))}};const Ae=Ye;var Me=Ae;(0,o.ri)(Me).mount("#app")}},n={};function t(o){var s=n[o];if(void 0!==s)return s.exports;var a=n[o]={id:o,loaded:!1,exports:{}};return e[o].call(a.exports,a,a.exports,t),a.loaded=!0,a.exports}t.m=e,function(){t.amdO={}}(),function(){var e=[];t.O=function(n,o,s,a){if(!o){var i=1/0;for(u=0;u<e.length;u++){o=e[u][0],s=e[u][1],a=e[u][2];for(var r=!0,l=0;l<o.length;l++)(!1&a||i>=a)&&Object.keys(t.O).every((function(e){return t.O[e](o[l])}))?o.splice(l--,1):(r=!1,a<i&&(i=a));if(r){e.splice(u--,1);var c=s();void 0!==c&&(n=c)}}return n}a=a||0;for(var u=e.length;u>0&&e[u-1][2]>a;u--)e[u]=e[u-1];e[u]=[o,s,a]}}(),function(){t.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return t.d(n,{a:n}),n}}(),function(){t.d=function(e,n){for(var o in n)t.o(n,o)&&!t.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:n[o]})}}(),function(){t.f={},t.e=function(e){return Promise.all(Object.keys(t.f).reduce((function(n,o){return t.f[o](e,n),n}),[]))}}(),function(){t.u=function(e){return"js/"+e+"."+{334:"1ab99c97",416:"8e0283ec",482:"41321a48",649:"db270d97",657:"0efa9c30",691:"7e08479f",842:"f9ec2d59",870:"84442b42",892:"accbf4d7",908:"5abee23f",911:"d5749337",987:"fb9b8b75",1243:"e911c116",1342:"9bffbf3f",1470:"f212ba2e",1539:"3d5491c1",1647:"5a7a91d4",1759:"d55cd9ae",1796:"e9d3eff6",2057:"e91198cf",2317:"77d8f04d",2540:"c6dacf48",2577:"12eba66f",2613:"a42fbaec",2637:"6d604c72",2693:"028d5285",2844:"39c6190b",2951:"26ac5f96",3058:"0b43dfbc",3084:"9375dcd1",3108:"7d83a7bf",3285:"ae208ca2",3371:"73aaf7b0",3426:"64926c4f",3660:"4386b403",3734:"3473ab44",3883:"b102a5c0",4003:"d1fa37fe",4048:"6b114383",4330:"6c7a3cfc",4390:"ba96f0a8",4519:"407684f2",4677:"deae8271",4688:"bdc13aaa",4690:"faf1a3f5",4754:"0f7fdff2",4780:"62d2e96d",5182:"cb087375",5373:"39c6adc5",5377:"dc47cbb3",5863:"de16f915",5873:"571fc976",6011:"0dc8dc5a",6016:"247427c6",6430:"54c661db",6593:"5b559d01",6856:"a307a668",6865:"d50e5c97",6934:"b370e4c3",6994:"1686d2ed",7043:"96333036",7575:"bf9ee38d",7656:"9b1689f8",7695:"8dc9931c",7882:"fc49f552",8272:"43325385",8280:"9a5e392c",8332:"ed1ba210",9042:"90b97668",9079:"7f20f483",9152:"22937e70",9154:"00016d45",9171:"fcb4250b",9289:"97aba4b6",9612:"5a2af207",9650:"c9ad9e43",9676:"5a9ec778",9814:"79d46ee8",9866:"9dd3802c",9912:"78d52ea2",9921:"e03b17e9"}[e]+".js"}}(),function(){t.miniCssF=function(e){}}(),function(){t.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)}}(),function(){var e={},n="tunic-helper:";t.l=function(o,s,a,i){if(e[o])e[o].push(s);else{var r,l;if(void 0!==a)for(var c=document.getElementsByTagName("script"),u=0;u<c.length;u++){var d=c[u];if(d.getAttribute("src")==o||d.getAttribute("data-webpack")==n+a){r=d;break}}r||(l=!0,r=document.createElement("script"),r.charset="utf-8",r.timeout=120,t.nc&&r.setAttribute("nonce",t.nc),r.setAttribute("data-webpack",n+a),r.src=o),e[o]=[s];var h=function(n,t){r.onerror=r.onload=null,clearTimeout(g);var s=e[o];if(delete e[o],r.parentNode&&r.parentNode.removeChild(r),s&&s.forEach((function(e){return e(t)})),n)return n(t)},g=setTimeout(h.bind(null,void 0,{type:"timeout",target:r}),12e4);r.onerror=h.bind(null,r.onerror),r.onload=h.bind(null,r.onload),l&&document.head.appendChild(r)}}}(),function(){t.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){t.nmd=function(e){return e.paths=[],e.children||(e.children=[]),e}}(),function(){t.p="/tunic-helper/"}(),function(){var e={2143:0};t.f.j=function(n,o){var s=t.o(e,n)?e[n]:void 0;if(0!==s)if(s)o.push(s[2]);else{var a=new Promise((function(t,o){s=e[n]=[t,o]}));o.push(s[2]=a);var i=t.p+t.u(n),r=new Error,l=function(o){if(t.o(e,n)&&(s=e[n],0!==s&&(e[n]=void 0),s)){var a=o&&("load"===o.type?"missing":o.type),i=o&&o.target&&o.target.src;r.message="Loading chunk "+n+" failed.\n("+a+": "+i+")",r.name="ChunkLoadError",r.type=a,r.request=i,s[1](r)}};t.l(i,l,"chunk-"+n,n)}},t.O.j=function(n){return 0===e[n]};var n=function(n,o){var s,a,i=o[0],r=o[1],l=o[2],c=0;if(i.some((function(n){return 0!==e[n]}))){for(s in r)t.o(r,s)&&(t.m[s]=r[s]);if(l)var u=l(t)}for(n&&n(o);c<i.length;c++)a=i[c],t.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return t.O(u)},o=self["webpackChunktunic_helper"]=self["webpackChunktunic_helper"]||[];o.forEach(n.bind(null,0)),o.push=n.bind(null,o.push.bind(o))}();var o=t.O(void 0,[4998],(function(){return t(4149)}));o=t.O(o)})();
//# sourceMappingURL=app.ee840ad2.js.map