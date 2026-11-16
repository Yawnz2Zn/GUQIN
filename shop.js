/* ================= SHOP: 20 文创 ================= */
const QP=(id,cx,cy,L,ang,sy)=>qinSVGPath(id,cx,cy,L,ang||0,sy||1,90);
const G_DEFS=`<defs>
 <linearGradient id="gGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9d39a"/><stop offset=".5" stop-color="#b8924a"/><stop offset="1" stop-color="#8a6a2e"/></linearGradient>
 <linearGradient id="gLac" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2619"/><stop offset=".5" stop-color="#1f150f"/><stop offset="1" stop-color="#120c09"/></linearGradient>
 <linearGradient id="gBrass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a5a26"/><stop offset=".35" stop-color="#d9b86a"/><stop offset=".6" stop-color="#a8823c"/><stop offset="1" stop-color="#6b4e20"/></linearGradient>
 <linearGradient id="gWood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d4b07a"/><stop offset="1" stop-color="#a8804a"/></linearGradient>
 <radialGradient id="gShell" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#fdfbf4"/><stop offset=".5" stop-color="#e3e7ea"/><stop offset=".8" stop-color="#e9dcef"/><stop offset="1" stop-color="#cfd9d6"/></radialGradient>
 <filter id="fSh" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur in="SourceAlpha" stdDeviation="5"/><feOffset dx="3" dy="7"/><feComponentTransfer><feFuncA type="linear" slope=".28"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <filter id="fTex"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .3  0 0 0 0 .22  0 0 0 0 .12  0 0 0 .08 0"/><feComposite in2="SourceGraphic" operator="in"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode/></feMerge></filter>
</defs>`;
const BG=(c1,c2)=>`<rect width="300" height="300" fill="${c1}"/><circle cx="210" cy="90" r="130" fill="${c2}" opacity=".55"/><rect width="300" height="300" fill="url(#gNoise)" opacity="0"/>`;
const SEAL=(x,y,t,s=18)=>`<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="#a63a2b"/><text x="${x+s/2}" y="${y+s*.72}" font-size="${s*.55}" fill="#f6e9d6" text-anchor="middle" font-family="ZCOOL XiaoWei,KaiTi,serif">${t}</text>`;
const BR='font-family="Ma Shan Zheng,STXingkai,KaiTi,serif"';
const PRODS=[
 {n:'十式琴签',c:'纸品',p:'¥68',d:'黄铜蚀刻书签一套十枚，每枚是一种琴式的轮廓，背面刻琴式名与来历。',m:'黄铜蚀刻 · 做旧',s:'13 × 2.4 cm / 枚',y:'读书之时，琴在书中。',
  a:()=>BG('#e8dfc9','#d7c7a3')+`<g filter="url(#fSh)">${['fuxi','zhongni','lianzhu','luoxia','jiaoye'].map((id,i)=>`<g transform="rotate(${-24+i*12} 150 250)"><path d="${QP(id,150,120,170,Math.PI/2,1.1)}" fill="url(#gBrass)" stroke="#6b4e20" stroke-width=".8"/><circle cx="150" cy="44" r="3" fill="#e8dfc9"/><path d="M150,40 v-22" stroke="#a63a2b" stroke-width="1.6"/></g>`).join('')}</g>`},
 {n:'十三徽月历',c:'纸品',p:'¥98',d:'2027 年台历：十三个徽位即十三页，十二个月加一页“闰”，每页附一首琴诗与当月宜弹的琴曲。',m:'宣纸印刷 · 胡桃木座',s:'18 × 14 cm',y:'琴上岁时，月月有声。',
  a:()=>BG('#e6e0d0','#cfd6cc')+`<g filter="url(#fSh)"><path d="M70,230 L90,110 H230 L250,230Z" fill="#5a3b26"/><rect x="88" y="70" width="144" height="150" fill="#f4eee0" stroke="#bfae8a"/><rect x="88" y="70" width="144" height="10" fill="#3d5f70"/>
   <text x="160" y="118" font-size="30" text-anchor="middle" fill="#2a231d" ${BR}>七徽</text><text x="160" y="138" font-size="10" text-anchor="middle" fill="#7a6b5c" font-family="serif">七 月 · 弦长二分之一</text>
   ${Array.from({length:13},(_,i)=>`<circle cx="${100+i*10}" cy="168" r="${i===6?4:2.6}" fill="${i===6?'#a63a2b':'#c9b48e'}"/>`).join('')}<path d="M98,190 H222" stroke="#cfc2a4"/>${SEAL(200,196,'琴',14)}</g>`},
 {n:'减字谱印章',c:'文房',p:'¥168',d:'寿山石印章一套四方，印面分别为“大九勾四”“散挑七”等减字，可钤于书页、信笺。',m:'寿山石 · 手工篆刻',s:'2.2 × 2.2 × 6 cm',y:'一字一声，钤印为谱。',
  a:()=>BG('#ebe3d2','#e3cdb8')+`<g filter="url(#fSh)"><path d="M70,120 h50 v95 h-50z" fill="#c4a27a"/><path d="M70,120 q25,-30 50,0" fill="#b08860"/><ellipse cx="95" cy="104" rx="16" ry="12" fill="#a8805a"/>
   <rect x="150" y="110" width="100" height="100" fill="#f6efe2" stroke="#e0d3bb"/><rect x="162" y="122" width="76" height="76" fill="none" stroke="#a63a2b" stroke-width="4"/>
   <text x="186" y="152" font-size="22" fill="#a63a2b" text-anchor="middle" ${BR}>大</text><text x="214" y="152" font-size="22" fill="#a63a2b" text-anchor="middle" ${BR}>九</text><text x="200" y="190" font-size="40" fill="#a63a2b" text-anchor="middle" ${BR}>勹</text><text x="202" y="190" font-size="17" fill="#a63a2b" text-anchor="middle" ${BR}>四</text></g>`},
 {n:'九霄环佩丝巾',c:'佩饰',p:'¥398',d:'桑蚕丝方巾，以伏羲式琴形为中心，四周环绕十三徽与流云，石青底色取自宋画青绿山水。',m:'100% 桑蚕丝 · 手工卷边',s:'90 × 90 cm',y:'环佩叮咚，如闻九霄。',
  a:()=>BG('#e7e1d3','#c9d3cf')+`<g filter="url(#fSh)" transform="rotate(-8 150 150)"><rect x="55" y="55" width="190" height="190" fill="#3d5f70"/><rect x="63" y="63" width="174" height="174" fill="none" stroke="#c9a85a" stroke-width="1.5"/>
   ${Array.from({length:13},(_,i)=>{const a=i/13*6.283;return `<circle cx="${150+Math.cos(a)*72}" cy="${150+Math.sin(a)*72}" r="${i===0?5:3}" fill="#efe7d6"/>`;}).join('')}
   <path d="${QP('fuxi',150,150,120,Math.PI/2,1)}" fill="#1e1612" stroke="#c9a85a"/>${[0,1,2,3].map(k=>`<path d="M${70+k*0},${80+k*48} q15,-10 30,0 t30,0" stroke="#9fb8b8" fill="none" stroke-width="1.4" transform="rotate(${k*90} 150 150)"/>`).join('')}<path d="M245,245 l18,30 M235,245 l10,32" stroke="#3d5f70" stroke-width="3"/></g>`},
 {n:'七弦手绳',c:'佩饰',p:'¥128',d:'七股丝线编成，对应七弦，粗细由外而内渐变；中间穿一颗贝母“七徽”珠。',m:'真丝线 · 天然贝母',s:'周长可调 14–19 cm',y:'七弦系腕，知音在侧。',
  a:()=>BG('#ece4d4','#e2d0c0')+`<g filter="url(#fSh)">${Array.from({length:7},(_,i)=>`<ellipse cx="150" cy="160" rx="${95-i*2.2}" ry="${55-i*1.6}" fill="none" stroke="${['#a63a2b','#8d5b3b','#3d5f70','#2a231d','#6f8c6b','#a68a4f','#7a6b5c'][i]}" stroke-width="${3.4-i*.3}" transform="rotate(${-10+i} 150 160)"/>`).join('')}
   <circle cx="150" cy="215" r="13" fill="url(#gShell)" stroke="#bfb6a8"/><path d="M240,175 q12,30 4,52 M244,175 q16,26 14,54" stroke="#a63a2b" stroke-width="2" fill="none"/></g>`},
 {n:'龙池凤沼香插',c:'生活',p:'¥158',d:'仿琴底造型的长条香插，龙池插线香，凤沼放香灰，一炉清香伴琴。',m:'黑檀木 · 铜胎',s:'26 × 4.5 cm',y:'焚香抚琴，古人雅事。',
  a:()=>BG('#e8e0cf','#d9cdb5')+`<g filter="url(#fSh)"><path d="${QP('zhongni',150,215,230,0,.32)}" fill="url(#gLac)" stroke="#000"/><rect x="104" y="211" width="36" height="7" rx="3" fill="#080605"/><rect x="190" y="212" width="18" height="6" rx="3" fill="#080605"/>
   <path d="M120,214 L118,80" stroke="#8a5a3a" stroke-width="2"/><circle cx="118" cy="80" r="2.4" fill="#d9542b"/><path d="M118,76 C110,60 128,52 118,36 C112,26 124,18 118,8" stroke="#a9a196" stroke-width="1.6" fill="none" opacity=".8"/></g>`},
 {n:'岳山镇纸',c:'文房',p:'¥228',d:'一对黄铜镇纸，取琴首“岳山”的截面，顶端起伏如远山，一端刻“高山”，一端刻“流水”。',m:'实心黄铜 · 手工打磨',s:'18 × 2.2 × 2 cm / 对',y:'左压高山，右镇流水。',
  a:()=>BG('#e5e0d2','#d5d0bf')+`<g filter="url(#fSh)">${[0,1].map(k=>`<g transform="translate(0,${k*58})"><path d="M50,150 L50,128 Q70,118 90,126 Q110,108 130,122 Q150,104 175,120 Q200,112 225,124 Q240,118 250,128 L250,150Z" fill="url(#gBrass)" stroke="#6b4e20"/><text x="${k?210:90}" y="144" font-size="13" fill="#5a3e18" text-anchor="middle" ${BR}>${k?'流水':'高山'}</text></g>`).join('')}</g>`},
 {n:'蕉叶茶则',c:'生活',p:'¥88',d:'竹制茶则，形取蕉叶式琴，柄端作叶柄，面上刻叶脉与一道琴弦。',m:'老竹 · 烫刻',s:'15 × 3.6 cm',y:'一则茶，一曲琴。',
  a:()=>BG('#e9e3d1','#d3dcc6')+`<g filter="url(#fSh)"><path d="${QP('jiaoye',150,150,220,-.5,1.05)}" fill="url(#gWood)" stroke="#7a5a2e"/>${Array.from({length:12},(_,i)=>{const t=(i+1)/14;const x=lerp(56,240,t),y=lerp(200,98,t);return `<path d="M${x},${y} l-8,-14 M${x},${y} l10,10" stroke="#8a6a3a" stroke-width=".8" opacity=".7"/>`;}).join('')}
   <path d="M56,200 L240,98" stroke="#8a6a3a" stroke-width="1"/><circle cx="110" cy="230" r="3" fill="#6f8c6b"/><circle cx="122" cy="236" r="2.6" fill="#6f8c6b"/><circle cx="102" cy="240" r="2.8" fill="#6f8c6b"/></g>`},
 {n:'落霞折扇',c:'佩饰',p:'¥268',d:'十六骨竹扇，扇面绘落霞式古琴与晚霞层峦，扇骨刻“落霞与孤鹜齐飞”。',m:'湘妃竹骨 · 熟宣扇面',s:'展开 33 × 19 cm',y:'一扇落霞，半卷琴声。',
  a:()=>BG('#ebe2d0','#e8cfb6')+`<g filter="url(#fSh)"><path d="M150,250 L40,130 A155,155 0 0 1 260,130 Z" fill="#f2e6cf" stroke="#a68a4f"/>${Array.from({length:16},(_,i)=>{const a=Math.PI*(1.18+i/15*.64);return `<path d="M150,250 L${150+Math.cos(a)*158},${250+Math.sin(a)*158}" stroke="#c9b48e" stroke-width=".7"/>`;}).join('')}
   <path d="M70,150 Q110,120 150,140 T230,128 L240,150 Q190,160 150,165 T60,170Z" fill="#d9a07a" opacity=".55"/><path d="M80,175 Q120,150 160,168 T236,160" stroke="#8d5b3b" fill="none" opacity=".5"/>
   <path d="${QP('luoxia',150,190,120,0,.6)}" fill="#24170f"/><circle cx="210" cy="118" r="10" fill="#c4604a" opacity=".55"/><path d="M150,250 L148,262" stroke="#a63a2b" stroke-width="3"/><circle cx="150" cy="250" r="4" fill="#6b4a32"/></g>`},
 {n:'断纹杯垫',c:'生活',p:'¥118',d:'四枚大漆杯垫，分别再现流水断、蛇腹断、牛毛断、梅花断四种古琴断纹。',m:'大漆 · 木胎',s:'直径 10 cm / 枚',y:'千年断纹，一杯清茶。',
  a:()=>BG('#e6dfcf','#d6c9ad')+`<g filter="url(#fSh)">${[[95,110],[205,110],[95,215],[205,215]].map(([x,y],k)=>`<circle cx="${x}" cy="${y}" r="46" fill="url(#gLac)" stroke="#0b0806"/><g stroke="rgba(200,150,110,.55)" stroke-width=".8" fill="none">${
    k===0?[0,1,2,3,4].map(i=>`<path d="M${x-36},${y-24+i*12} q18,-5 36,0 t36,0"/>`).join(''):k===1?[0,1,2,3,4,5].map(i=>`<path d="M${x-38},${y-25+i*10} h76"/>`).join('')+`<path d="M${x-10},${y-40} v80 M${x+14},${y-40} v80"/>`:k===2?Array.from({length:40},(_,i)=>`<path d="M${x-36+((i*17)%72)},${y-30+((i*29)%60)} l3,8"/>`).join(''):[[-15,-15],[15,-8],[-5,15],[20,20],[-22,10]].map(([dx,dy])=>Array.from({length:5},(_,a)=>`<path d="M${x+dx},${y+dy} l${Math.cos(a*1.256)*8},${Math.sin(a*1.256)*8}"/>`).join('')).join('')
  }</g><text x="${x}" y="${y+62}" font-size="11" text-anchor="middle" fill="#5a4a3a" font-family="ZCOOL XiaoWei,serif">${['流水断','蛇腹断','牛毛断','梅花断'][k]}</text>`).join('')}</g>`},
 {n:'琴轸耳坠',c:'佩饰',p:'¥198',d:'以调弦的“琴轸”为形，925 银镀金，下坠真丝流苏，行走时轻轻摇曳。',m:'925 银 · 真丝流苏',s:'长 6.5 cm',y:'琴轸转处，音自和。',
  a:()=>BG('#ece3d6','#e6cfc8')+`<g filter="url(#fSh)">${[110,190].map(x=>`<path d="M${x},60 v20" stroke="#b8924a" stroke-width="1.6"/><circle cx="${x}" cy="56" r="5" fill="none" stroke="#b8924a" stroke-width="1.6"/><path d="M${x-12},80 h24 l-4,26 q-8,10 -16,0z" fill="url(#gGold)"/><rect x="${x-5}" y="106" width="10" height="34" fill="url(#gGold)"/><circle cx="${x}" cy="146" r="7" fill="url(#gGold)"/>
   ${Array.from({length:9},(_,i)=>`<path d="M${x},152 q${(i-4)*2},40 ${(i-4)*3},80" stroke="#a63a2b" stroke-width="1.3" fill="none"/>`).join('')}<rect x="${x-6}" y="150" width="12" height="8" fill="#8a2a1e"/>`).join('')}</g>`},
 {n:'雁足笔架',c:'文房',p:'¥168',d:'取琴底一对“雁足”为笔架，一高一低，可架两支毛笔。',m:'紫光檀 · 黄铜嵌',s:'12 × 4 × 5 cm',y:'弦系雁足，笔落成章。',
  a:()=>BG('#e7e0d0','#d7cbb3')+`<g filter="url(#fSh)"><rect x="60" y="200" width="180" height="16" rx="3" fill="#3a2418"/>${[110,190].map((x,i)=>`<path d="M${x-14},200 L${x-10},${150-i*10} Q${x},${140-i*10} ${x+10},${150-i*10} L${x+14},200Z" fill="#2a1a12"/><ellipse cx="${x}" cy="${150-i*10}" rx="13" ry="5" fill="url(#gBrass)"/>`).join('')}
   <path d="M70,138 L240,128" stroke="#7a5a3a" stroke-width="6" stroke-linecap="round"/><path d="M230,129 L262,126" stroke="#1e1a17" stroke-width="7" stroke-linecap="round"/><path d="M60,140 L72,138" stroke="#c9b48e" stroke-width="4"/></g>`},
 {n:'琴徽胸针',c:'佩饰',p:'¥238',d:'天然贝母圆形胸针，外圈以金线嵌出十三个徽点，七徽处镶一粒小珍珠。',m:'天然贝母 · 镀金铜',s:'直径 3.5 cm',y:'一徽一月，佩之如岁。',
  a:()=>BG('#ebe5d9','#d9dde0')+`<g filter="url(#fSh)"><circle cx="150" cy="150" r="72" fill="url(#gGold)"/><circle cx="150" cy="150" r="64" fill="url(#gShell)"/>${Array.from({length:13},(_,i)=>{const a=-Math.PI/2+i/13*6.283;return `<circle cx="${150+Math.cos(a)*52}" cy="${150+Math.sin(a)*52}" r="${i===6?5:3}" fill="${i===6?'#fffaf0':'#b8924a'}"/>`;}).join('')}
   <path d="${QP('zhongni',150,150,70,Math.PI/2,1)}" fill="none" stroke="#b8924a" stroke-width="1.6"/></g>`},
 {n:'琴式立体书',c:'纸品',p:'¥168',d:'翻开即“立”起一张古琴与松下抚琴的高士，十页分别讲十种琴式。',m:'特种纸 · 激光雕刻',s:'21 × 15 cm',y:'纸上斫琴，一页一式。',
  a:()=>BG('#e8e1d2','#d2c9b6')+`<g filter="url(#fSh)"><path d="M40,210 L150,240 L260,210 L260,200 L150,228 L40,200Z" fill="#cbbd9e"/><path d="M40,200 L150,228 L150,120 L40,95Z" fill="#f2ead8" stroke="#bfae8a"/><path d="M260,200 L150,228 L150,120 L260,95Z" fill="#ece3cf" stroke="#bfae8a"/>
   <path d="M70,190 Q100,120 125,160 L130,205Z" fill="#7c9b78" opacity=".8"/><path d="M175,200 Q200,110 235,170 L235,192Z" fill="#3e6676" opacity=".8"/>
   <path d="${QP('fuxi',150,190,120,0,.35)}" fill="#24170f" transform="rotate(-6 150 190)"/><path d="M110,150 L112,198 M190,150 L188,196" stroke="#bfae8a" stroke-dasharray="2 2"/></g>`},
 {n:'一比六斫琴套件',c:'体验',p:'¥298',d:'1:6 比例的仲尼式琴模型套件：桐木面板、梓木底板、岳山、龙龈、雁足、七根丝弦，附图解斫琴手册。',m:'桐木 · 梓木 · 丝弦',s:'成品长约 20 cm',y:'亲手斫一张，才算识得琴。',
  a:()=>BG('#e6dfce','#d9c7a5')+`<g filter="url(#fSh)"><rect x="50" y="80" width="200" height="150" fill="#2a231d"/><rect x="58" y="88" width="184" height="134" fill="#3a2f26"/>
   <path d="${QP('zhongni',150,128,150,0,.9)}" fill="url(#gWood)" stroke="#7a5a2e"/><path d="${QP('zhongni',150,170,150,0,.9)}" fill="#a07a50" stroke="#6b4a2a"/>
   <rect x="80" y="196" width="20" height="8" fill="#1a120d"/><rect x="110" y="196" width="10" height="16" fill="#1a120d"/><rect x="126" y="196" width="10" height="16" fill="#1a120d"/>${Array.from({length:7},(_,i)=>`<path d="M150,${198+i*2} h80" stroke="#efe4cb" stroke-width=".6"/>`).join('')}
   <text x="150" y="70" font-size="16" fill="#2a231d" text-anchor="middle" ${BR}>斫琴记</text></g>`},
 {n:'高山流水帆布袋',c:'生活',p:'¥89',d:'本白帆布托特包，正面以七道线勾勒高山与流水，七道线即七根弦。',m:'16 安帆布 · 丝网印',s:'38 × 42 cm',y:'背一座山，装一条河。',
  a:()=>BG('#e3ddd0','#cfcabb')+`<g filter="url(#fSh)"><path d="M110,90 Q110,40 150,40 Q190,40 190,90" fill="none" stroke="#d9cfb8" stroke-width="9"/><path d="M80,90 H220 L230,260 H70Z" fill="#f1ebdd"/>
   ${Array.from({length:7},(_,i)=>`<path d="M90,${200+i*6} Q120,${120+i*6} 140,${180+i*6} T190,${150+i*6} T214,${200+i*6}" stroke="#2a231d" stroke-width="1" fill="none"/>`).join('')}
   <circle cx="186" cy="118" r="10" fill="#a63a2b"/>${SEAL(96,236,'琴',12)}</g>`},
 {n:'溪山琴况卡牌',c:'纸品',p:'¥78',d:'明代徐上瀛《溪山琴况》二十四况：和、静、清、远、古、澹、恬、逸……每张一况，背面为释义与琴诗。',m:'棉卡纸 · 烫金',s:'9 × 6 cm · 24 张',y:'二十四况，一日一况。',
  a:()=>BG('#e8e0d0','#d6c4b0')+`<g filter="url(#fSh)">${['和','静','清','远','古'].map((t,i)=>`<g transform="rotate(${-30+i*15} 150 260)"><rect x="118" y="80" width="64" height="96" rx="4" fill="${i===4?'#f4ecda':'#2a231d'}" stroke="#a68a4f"/><text x="150" y="140" font-size="34" text-anchor="middle" fill="${i===4?'#2a231d':'#d9b86a'}" ${BR}>${t}</text></g>`).join('')}</g>`},
 {n:'泛音声纹夜灯',c:'生活',p:'¥258',d:'铜框亚克力夜灯，内刻七徽泛音的声波曲线，开灯时一道弦光缓缓亮起。',m:'黄铜 · 亚克力 · LED',s:'16 × 10 × 6 cm',y:'夜深人静，一弦泛音。',
  a:()=>BG('#2a231d','#3d3329')+`<g filter="url(#fSh)"><rect x="60" y="210" width="180" height="22" fill="url(#gBrass)"/><rect x="70" y="90" width="160" height="120" fill="rgba(255,240,210,.12)" stroke="#d9b86a"/>
   <path d="M76,150 ${Array.from({length:60},(_,i)=>`L${76+i*2.5},${150+Math.sin(i*.6)*30*Math.sin(Math.PI*i/59)}`).join(' ')}" stroke="#ffe3a6" stroke-width="2" fill="none"/><circle cx="150" cy="150" r="60" fill="rgba(255,220,150,.10)"/></g>`},
 {n:'琴囊笔袋',c:'文房',p:'¥128',d:'仿古琴锦囊的长条笔袋，宋锦面料，系带收口，正好装下一排毛笔或铅笔。',m:'宋锦 · 棉麻里衬',s:'24 × 6 cm',y:'琴入锦囊，笔入琴囊。',
  a:()=>BG('#e8dfcf','#e0c9b8')+`<g filter="url(#fSh)" transform="rotate(-20 150 150)"><path d="${QP('zhongni',150,150,230,0,1.4)}" fill="#7b3a2c" stroke="#3a1a12"/>
   ${Array.from({length:10},(_,i)=>`<circle cx="${60+i*20}" cy="150" r="5" fill="none" stroke="#c9a05a" stroke-width="1"/>`).join('')}<path d="M48,150 H252" stroke="#c9a05a" stroke-dasharray="3 3"/><path d="M262,150 q14,-8 22,6 M262,150 q12,10 24,4" stroke="#c9a05a" stroke-width="2" fill="none"/></g>`},
 {n:'知音冰箱贴',c:'生活',p:'¥45',d:'一组两枚：一枚是抚琴的伯牙，一枚是凝神静听的子期（人物取自宋人《听琴图》笔意），合在一起才是“高山流水”。',m:'软陶 · 手绘 · 磁铁',s:'约 6 × 5 cm / 枚',y:'得一知音，足矣。',
  a:()=>BG('#e6e1d4','#cfd8d0')+`<g filter="url(#fSh)"><rect x="40" y="90" width="110" height="120" rx="14" fill="#f4eee0" stroke="#bfae8a"/><rect x="155" y="100" width="105" height="110" rx="14" fill="#f4eee0" stroke="#bfae8a"/>
   <path d="M50,206 Q70,190 90,198 T132,192" stroke="#7c9b78" stroke-width="2.4" fill="none" opacity=".7"/><path d="M168,206 q12,-6 24,0 t24,0 t24,0" stroke="#3d5f70" stroke-width="2" fill="none" opacity=".7"/>${figImg('player',95,200,98)}${figImg('lslisten',208,202,92,true)}</g>`}
];
const PICK_KEY='qin_picks';let PICKS=new Set();try{PICKS=new Set(JSON.parse(localStorage.getItem(PICK_KEY)||'[]'));}catch(e){}
function savePicks(){try{localStorage.setItem(PICK_KEY,JSON.stringify([...PICKS]));}catch(e){}updCart();}
function prodSVG(i,big){return `<svg class="art" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">${G_DEFS}${PRODS[i].a()}</svg>`;}
let shopCat='全部';
pageInit.shop=function(){const cats=['全部','文房','佩饰','生活','纸品','体验'];$('#shopCats').innerHTML=cats.map(c=>`<button class="chip ${c===shopCat?'on':''}" data-c="${c}">${c}</button>`).join('');
  $$('#shopCats .chip').forEach(b=>b.onclick=()=>{shopCat=b.dataset.c;$$('#shopCats .chip').forEach(x=>x.classList.toggle('on',x===b));renderProds();});renderProds();updCart();};
function renderProds(){$('#prods').innerHTML=PRODS.map((p,i)=>shopCat!=='全部'&&p.c!==shopCat?'':`<div class="card prod ${PICKS.has(i)?'picked':''}" data-i="${i}">${prodSVG(i)}<button class="pick" title="心仪">✓</button><div class="info"><div class="no">No.${String(i+1).padStart(2,'0')} · ${p.c}</div><b>${p.n}</b><p>${p.d.slice(0,30)}…</p></div></div>`).join('');
  $$('.prod').forEach(el=>{const i=+el.dataset.i;$('.pick',el).onclick=e=>{e.stopPropagation();PICKS.has(i)?PICKS.delete(i):PICKS.add(i);el.classList.toggle('picked');savePicks();};el.onclick=()=>openProd(i);});
  $('#shopCount').textContent=`共 ${PRODS.length} 件 · 已选 ${PICKS.size} 件`;}
function updCart(){const c=$('#cart');c.textContent=`已选 ${PICKS.size} 件心仪文创 · 查看`;c.classList.toggle('on',PICKS.size>0&&$('#shop').classList.contains('on'));const sc=$('#shopCount');if(sc)sc.textContent=`共 ${PRODS.length} 件 · 已选 ${PICKS.size} 件`;}
document.addEventListener('pagechange',updCart);
function openProd(i){const p=PRODS[i];openModal(p.n,`No.${String(i+1).padStart(2,'0')} · ${p.c}`,b=>{b.innerHTML=`<div class="pdetail">${prodSVG(i,1)}<div><div class="kicker">${p.c} · 七弦有象</div><h4>${p.n}</h4><p style="font-size:15px;line-height:2;color:var(--ink2);margin-top:10px">${p.d}</p>
  <dl><dt>材质</dt><dd>${p.m}</dd><dt>尺寸</dt><dd>${p.s}</dd><dt>寓意</dt><dd>${p.y}</dd><dt>参考价</dt><dd>${p.p}</dd></dl>
  <div style="margin-top:20px;display:flex;gap:10px"><button class="btn ${PICKS.has(i)?'solid':'zhu'}" id="pdPick">${PICKS.has(i)?'✓ 已选为心仪':'选为心仪'}</button>${i>0?`<button class="btn" onclick="openProd(${i-1})">‹ 上一件</button>`:''}${i<PRODS.length-1?`<button class="btn" onclick="openProd(${i+1})">下一件 ›</button>`:''}</div></div></div>`;
  $('#pdPick').onclick=()=>{PICKS.has(i)?PICKS.delete(i):PICKS.add(i);savePicks();renderProds();openProd(i);};});}
function showCart(){const list=[...PICKS].sort((a,b)=>a-b);const txt=list.map(i=>`No.${String(i+1).padStart(2,'0')} ${PRODS[i].n}`).join('\n');
  openModal('我的心仪文创',`已选 ${list.length} 件`,b=>{b.innerHTML=`<div style="padding:26px"><div class="prods" style="grid-template-columns:repeat(5,1fr)">${list.map(i=>`<div class="card prod">${prodSVG(i)}<div class="info"><b style="font-size:15px">${PRODS[i].n}</b></div></div>`).join('')}</div>
   <pre style="margin-top:20px;font-family:var(--serif);background:rgba(255,255,255,.4);padding:14px;border:1px solid rgba(90,70,50,.2)">${txt}</pre><button class="btn zhu" id="cpy" style="margin-top:12px">复制清单</button></div>`;
   $('#cpy').onclick=()=>{navigator.clipboard.writeText(txt).then(()=>toast('已复制清单'),()=>toast('复制失败，请手动选择文字'));};});}
