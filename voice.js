/* ================= 讲解语音：平台语音 > 本机最自然的中文女声 ================= */
const VO={tts:null,sys:[],choice:null,speaking:false,ready:false};
const PLATFORM_VOICES=[['airy','平台语音 · 轻柔'],['rounded','平台语音 · 温润'],['buttery','平台语音 · 醇和'],['glassy','平台语音 · 清亮']];
function voScore(v){const n=(v.name+' '+v.voiceURI).toLowerCase();let s=0;
  if(/zh[-_]?(cn|hans)|cmn/i.test(v.lang))s+=40;else if(/zh/i.test(v.lang))s+=20;else return -1;
  if(/xiaoxiao|晓晓/.test(n))s+=60;if(/xiaoyi|晓伊|xiaohan|晓涵|xiaomo|晓墨|xiaorui|xiaoqiu|xiaoshuang|xiaoyan|晓颜/.test(n))s+=45;
  if(/natural|online|neural/.test(n))s+=40;if(/tingting|婷婷|lili|莉莉|yu-shu|meijia|美佳|sinji/.test(n))s+=30;
  if(/google/.test(n))s+=20;if(/huihui|慧慧|yaoyao|瑶瑶/.test(n))s+=10;if(/kangkang|康康|yunxi|yunyang|yunjian|male/.test(n))s-=25;return s;}
function voLoadSys(){try{VO.sys=speechSynthesis.getVoices().filter(v=>voScore(v)>=0).sort((a,b)=>voScore(b)-voScore(a));}catch(e){VO.sys=[];}voFillMenu();}
try{speechSynthesis.onvoiceschanged=voLoadSys;}catch(e){}setTimeout(voLoadSys,300);
(async()=>{try{if(window.claude&&window.claude.use){const t=await window.claude.use('tts');if(t){VO.tts=t;t.onState&&t.onState(({state})=>{VO.speaking=state==='speaking'||state==='paused';});voFillMenu();}}}catch(e){}})();
function voOptions(){const o=[];if(VO.tts)PLATFORM_VOICES.forEach(([id,n])=>o.push({key:'p:'+id,label:n}));VO.sys.slice(0,8).forEach(v=>o.push({key:'s:'+v.name,label:'本机 · '+v.name.replace(/Microsoft |Online |\(Natural\)|- Chinese.*$/g,'').trim()}));return o;}
function voCurrent(){const o=voOptions();let k=VO.choice;try{k=k||localStorage.getItem('qin_voice');}catch(e){}return o.find(x=>x.key===k)||o[0]||null;}
function voFillMenu(){const sel=document.getElementById('nbVoice');if(!sel)return;const o=voOptions();const cur=voCurrent();
  sel.innerHTML=o.length?o.map(x=>`<option value="${x.key}" ${cur&&cur.key===x.key?'selected':''}>${x.label}</option>`).join(''):'<option>默认语音</option>';}
function stopSpeak(){VO.speaking=false;try{VO.tts&&VO.tts.stop();}catch(e){}try{speechSynthesis.cancel();}catch(e){}}
function speak(t){const text=t.replace(/[“”「」《》]/g,'').replace(/\s*——\s*/g,'，');stopSpeak();const cur=voCurrent();
  if(cur&&cur.key.startsWith('p:')&&VO.tts){VO.speaking=true;VO.tts.speak(text,{voice:cur.key.slice(2),rate:.92}).then(()=>{VO.speaking=false;}).catch(()=>{VO.speaking=false;});return;}
  try{const u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=.9;u.pitch=1.02;const v=cur&&VO.sys.find(x=>'s:'+x.name===cur.key)||VO.sys[0];if(v)u.voice=v;
    u.onend=u.onerror=()=>{VO.speaking=false;};VO.speaking=true;speechSynthesis.speak(u);}catch(e){VO.speaking=false;}}
document.addEventListener('change',e=>{if(e.target&&e.target.id==='nbVoice'){VO.choice=e.target.value;try{localStorage.setItem('qin_voice',VO.choice);}catch(_){}
  speak('七弦有象，相约画中琴人，共抚一曲太古遗音。');}});
