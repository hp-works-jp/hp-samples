/* core.js — 全サイト共通の動き・更新処理（外部ライブラリなし・約4KB） */
(function(){
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
var esc=function(t){return String(t==null?"":t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
var yen=function(n){return Number(n).toLocaleString()+"円"};
var money=function(p){return p.price!=null&&!isNaN(p.price)?yen(p.price):esc(p.priceText||"")};
function csv(t){var r=[],row=[],c="",q=false,i;for(i=0;i<t.length;i++){var ch=t[i];if(q){if(ch==='"'){if(t[i+1]==='"'){c+='"';i++}else q=false}else c+=ch}else if(ch==='"')q=true;else if(ch===","){row.push(c);c=""}else if(ch==="\n"||ch==="\r"){if(ch==="\r"&&t[i+1]==="\n")i++;row.push(c);r.push(row);row=[];c=""}else c+=ch}if(c||row.length){row.push(c);r.push(row)}return r}
/* お店の人がGoogleスプレッドシートを直すと、お知らせ・料金・営業時間が更新される */
function sheet(S,cb){
  if(!S.sheetUrl)return;
  fetch(S.sheetUrl,{cache:"no-store"}).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(t){
    var news=[],prices=[],hours=[],extra={};
    csv(t).forEach(function(r){var k=(r[0]||"").trim(),a=(r[1]||"").trim(),b=(r[2]||"").trim(),c=(r[3]||"").trim(),d=(r[4]||"").trim();if(!a||k==="種類")return;
      if(k==="お知らせ")news.push({date:a,title:b,body:c});
      else if(k==="料金"){var n=parseInt(c.replace(/[,円]/g,""),10);prices.push({name:a,time:b,price:isNaN(n)||/[^\d,円\s]/.test(c)?null:n,priceText:c,note:d})}
      else if(k==="営業時間")hours.push({day:a,time:b})
      else{(extra[k]=extra[k]||[]).push([a,b,c,d])}});/* 事例・コース・社員紹介など、サイトごとの項目 */
    if(news.length)S.news=news.sort(function(x,y){return String(y.date).localeCompare(String(x.date))}).slice(0,6);
    if(prices.length)S.prices=prices;if(hours.length)S.hours=hours;S.extra=extra;cb()
  }).catch(function(){/* 取得できなければ content.js の内容のまま */})
}
function split(el,delay,step){var i=0;(function w(n){[].slice.call(n.childNodes).forEach(function(c){if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split("").forEach(function(ch){var s=document.createElement("span");s.className="ch";s.style.animationDelay=(delay+i++*step)+"s";s.textContent=ch;f.appendChild(s)});c.parentNode.replaceChild(f,c)}else if(c.nodeType===1&&c.tagName!=="BR")w(c)})})(el)}
function count(el){var t=+el.dataset.n,st=performance.now(),dec=+el.dataset.dec||0;(function f(n){var p=Math.min((n-st)/1800,1),v=t*(1-Math.pow(1-p,4));el.textContent=dec?v.toFixed(dec):Math.floor(v).toLocaleString();if(p<1)requestAnimationFrame(f)})(st)}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("on");if(e.target.dataset.n)count(e.target);$$("[data-n]",e.target).forEach(count);io.unobserve(e.target)}})},{threshold:.15});
var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){$$(".pic",e.target).forEach(function(p){p.classList.add("on")});io2.unobserve(e.target)}})},{threshold:.2});
var seen=[];
function watch(root){jp(root||document.body);$$(".rv,.fade,[data-n]",root).forEach(function(el){if(seen.indexOf(el)<0){seen.push(el);io.observe(el)}});$$(".pic",root).forEach(function(p){if(seen.indexOf(p)<0){seen.push(p);io2.observe(p.parentElement)}})}
function bind(S){
  $$("[data-bind=line]").forEach(function(a){if(S.lineUrl)a.href=S.lineUrl});
  $$("[data-bind=reserve]").forEach(function(a){if(S.reserveUrl)a.href=S.reserveUrl});
  $$("[data-bind=contact]").forEach(function(a){if(S.contactUrl)a.href=S.contactUrl});
  $$("[data-bind=tel]").forEach(function(a){if(S.tel){a.href="tel:"+S.tel.replace(/-/g,"");if(!a.closest(".bar")&&a.dataset.label!=="short")a.textContent=(a.dataset.pre||"電話で予約 ")+S.tel}});
}

/* 文節で改行：文の途中で切れないよう、意味のまとまりの境目にだけ改行の余地を作る */
var _seg=(typeof Intl!=="undefined"&&Intl.Segmenter)?new Intl.Segmenter("ja",{granularity:"word"}):null,_done=typeof WeakSet!=="undefined"?new WeakSet():null;
function _ok(prev,s){ /* 助詞や1〜2文字のひらがなの前では、改行しない */
  if(!s||!prev)return false;var c=s.charAt(0);
  if(/[\u3001\u3002\uff0c\uff0e\uff09\u300d\u300f\u3009\u300b\u3011\u30fb\uff1f\uff01!?)\]]/.test(c))return false;
  if(/^[\u3041-\u3096]+$/.test(s)&&s.length<=2)return false;
  if(/^[\u3041-\u3096]/.test(c)&&s.length<=3&&/(です|ます|ない|いる|ある|する|した|して|れる|せる)$/.test(s)&&prev.length>0)return false;
  if(/^[\u300c\u300e\uff08\u3008\u300a\u3010(]$/.test(prev.slice(-1)))return false;
  if(/[0-9０-９.,]$/.test(prev)&&/^[年月日円名社件回時分秒%％万億歳個本枚台人週間か〜]/.test(c))return false;
  if(prev.length<=1&&/[\u304a\u3054\u4e0d\u7121\u518d\u5168]/.test(prev))return false;
  return true}
function jp(root){
  if(!_seg||!root)return;
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var p=n.parentNode;if(!p||!n.nodeValue.trim())return NodeFilter.FILTER_REJECT;if(/^(SCRIPT|STYLE|TEXTAREA|OPTION|SELECT|TITLE|NOSCRIPT)$/.test(p.nodeName))return NodeFilter.FILTER_REJECT;if(_done&&_done.has(n))return NodeFilter.FILTER_REJECT;if(p.closest&&p.closest("[data-nojp]"))return NodeFilter.FILTER_REJECT;if(!/[\u3040-\u30ff\u4e00-\u9fff]/.test(n.nodeValue))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT}}),nodes=[],n;
  while((n=w.nextNode()))nodes.push(n);
  nodes.forEach(function(t){
    var txt=t.nodeValue,parts=[],cur="";
    Array.from(_seg.segment(txt)).forEach(function(g){var s=g.segment;if(cur&&_ok(cur,s)){parts.push(cur);cur=s}else cur+=s});
    if(cur)parts.push(cur);if(parts.length<2)return;
    var f=document.createDocumentFragment();
    parts.forEach(function(p,i){var tn=document.createTextNode(p);if(_done)_done.add(tn);f.appendChild(tn);if(i<parts.length-1)f.appendChild(document.createElement("wbr"))});
    t.parentNode.replaceChild(f,t)})}

function init(opt){
  opt=opt||{};
  $$("[data-split]").forEach(function(h){split(h,+h.dataset.delay||.2,+h.dataset.step||.06)});
  watch(document);
  $$(".q").forEach(function(q){var b=$("button",q),a=$(".a",q);b.setAttribute("aria-expanded","false");b.addEventListener("click",function(){var o=q.classList.toggle("open");b.setAttribute("aria-expanded",o);a.style.maxHeight=o?a.scrollHeight+"px":0})});
  var hd=$("#hd"),bar=$("#bar"),prog=$("#prog"),road=$("#road"),track=$("#track"),hzb=$("#hzb"),par=$$("[data-par]"),zm=$$("[data-zoom]");
  function onS(){var y=scrollY,vh=innerHeight;
    if(hd)hd.classList.toggle("solid",y>vh*.5);
    if(bar)bar.classList.toggle("show",y>vh*.7);
    if(prog)prog.style.width=(y/Math.max(document.body.scrollHeight-vh,1)*100)+"%";
    par.forEach(function(el){var r=el.parentElement.getBoundingClientRect();el.style.transform="translateY("+(-(r.top+r.height/2-vh/2)*(+el.dataset.par))+"px)"});
    zm.forEach(function(el){var f=el.parentElement.getBoundingClientRect(),q=1-Math.min(Math.max(f.top/vh,0),1);el.style.transform="scale("+(1+q*.2)+")"});
    if(road&&track){var r=road.getBoundingClientRect(),p=Math.min(Math.max(-r.top/Math.max(road.offsetHeight-vh,1),0),1),max=Math.max(track.scrollWidth-innerWidth+40,0);track.style.transform="translateX("+(-p*max)+"px)";if(hzb)hzb.style.width=(p*100)+"%"}
    if(opt.onScroll)opt.onScroll(y,vh)}
  addEventListener("scroll",onS,{passive:true});addEventListener("resize",onS);onS();
}
window.Core={jp:jp,$:$,$$:$$,esc:esc,yen:yen,money:money,csv:csv,sheet:sheet,init:init,watch:watch,bind:bind,count:count,split:split};
})();
