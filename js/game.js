{
const W=960,H=540,FLOOR=470,GRAV=1500;let WORLD=6200;
const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const $=id=>document.getElementById(id);
const rnd=(a,b)=>a+Math.random()*(b-a);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const TOUCH=('ontouchstart' in window)||navigator.maxTouchPoints>0;
function fit(){const s=Math.min(innerWidth/W,innerHeight/H);cv.style.width=Math.floor(W*s)+'px';cv.style.height=Math.floor(H*s)+'px'}
addEventListener('resize',fit);fit();

/* ---------- settings + sound ---------- */
let SET={nums:1,shake:1,names:1,sfx:1,music:1,loot:0,qarrow:1};try{Object.assign(SET,JSON.parse(localStorage.getItem('starbell-settings')||'{}'))}catch(e){}
const saveSet=()=>{try{localStorage.setItem('starbell-settings',JSON.stringify(SET))}catch(e){}};
let AC=null,musStep=0;
function ac(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();return AC}
addEventListener('pointerdown',()=>ac(),{passive:true});addEventListener('keydown',()=>ac());
function osc(f,d,type,v,slide,delay){const a=AC;if(!a||a.state!=='running')return;const t=a.currentTime+(delay||0),o=a.createOscillator(),g=a.createGain();o.type=type||'square';o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f*slide),t+d);g.gain.setValueAtTime(v||.05,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d+.03)}
const tone=(...a)=>{if(SET.sfx)osc(...a)};
const SFX={hit:()=>tone(220,.06,'square',.025,.5),crit:()=>{tone(440,.08,'square',.035,.6);tone(880,.07,'triangle',.03,.8)},coin:()=>{tone(988,.05,'square',.02);tone(1319,.08,'square',.02,1,.05)},
 jump:()=>tone(300,.12,'triangle',.04,1.8),hurt:()=>tone(160,.18,'sawtooth',.045,.5),lvl:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.16,'triangle',.05,1,i*.08)),
 skill:()=>tone(620,.14,'sawtooth',.025,.45),ult:()=>{tone(180,.45,'sawtooth',.045,3);tone(90,.5,'square',.03,1.5)},warp:()=>tone(300,.6,'sine',.06,4),
 up:()=>[784,988,1319].forEach((f,i)=>tone(f,.18,'triangle',.05,1,i*.07)),fail:()=>tone(300,.32,'sawtooth',.045,.3),boss:()=>{tone(80,.9,'sawtooth',.06,.6);tone(120,.9,'square',.03,.5)},
 chest:()=>[659,784,988,1319,1568].forEach((f,i)=>tone(f,.13,'square',.03,1,i*.06)),pet:()=>[880,1175].forEach((f,i)=>tone(f,.12,'triangle',.04,1,i*.08))};
const sfxT={};function sfx(k){if(!SET.sfx||!AC)return;const n=performance.now();if(n-(sfxT[k]||0)<(k==='hit'||k==='coin'?70:30))return;sfxT[k]=n;try{SFX[k]()}catch(e){}}
const SCALES={town:[262,294,330,392,440,523],field:[220,262,294,330,392,440],night:[196,233,262,294,349,392],boss:[110,131,147,165,196,220]};
setInterval(()=>{try{if(!SET.music||!AC||AC.state!=='running'||state!=='play'||paused)return;const z=ZONES[curZone],k=!z?'town':z.boss||z.arena||z.trial?'boss':z.safe?'town':(MAPS[MAP].music||'field'),sc=SCALES[k],st=musStep++%16;
 if(st%8===0)osc(sc[0]/2,1.6,'triangle',.03);
 if(k==='boss'){if(st%2===0)osc(sc[(st/2)%3]*2,.2,'sawtooth',.01)}
 else if(st%2===0||Math.random()<.25){const n=sc[Math.floor(Math.random()*sc.length)];osc(n*(Math.random()<.2?2:1),.4,'triangle',.016)}}catch(e){}},230);

/* ---------- sprites ---------- */
function spr(rows,pal,sc){const w=Math.max(...rows.map(r=>r.length)),h=rows.length,c=document.createElement('canvas');c.width=w*sc;c.height=h*sc;const g=c.getContext('2d');
  rows.forEach((r,y)=>{for(let x=0;x<r.length;x++){const col=pal[r[x]];if(!col)continue;g.fillStyle=col;g.fillRect(x*sc,y*sc,sc,sc)}});return c}
function white(rows,sc){const p={};rows.join('').split('').forEach(ch=>{if(ch!=='.')p[ch]='#ffffff'});return spr(rows,p,sc)}
function shade(hex,f){const n=parseInt(hex.slice(1),16);const r=clamp(Math.round((n>>16)*f),0,255),g=clamp(Math.round((n>>8&255)*f),0,255),b=clamp(Math.round((n&255)*f),0,255);return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}
const HEAD=["...hhhhh....","..hhhhhhh...",".hhhhhhhhh..",".hhsssssshh.",".hhsessesh..",".hssssssss..","..ssssss....","..wwcccww...",".cccgcccc...","cccccgcccc..","scccccccccs.",".cccccccccc.",".dddddddddd."];
const LEGS=[["..dd....dd..","..bb....bb..",".bbb...bbb.."],["...dd..dd...","...bb..bb...","..bbb.bbb..."],["..dd..dd....",".bb....bb...","............"]];
const SL=["....gggg....","..gggggggg..",".gllgggggg..",".glggggggggg","gggegggeggg.","ggggggggggg.","gggggmmgggg.","ggggggggggg.",".ggggggggg..","..ddddddd..."];
const WO=["..........ppp...",".pp..pp..ppppp..","pppppppppppeppp.","pppppppppppppp..",".dd..dd..dd....."];
const BA=[["w............w","ww....bb....ww","www.bbbbbb.www","wwwwbebbebwwww",".wwwbbbbbbwww.","..ww.bbbb.ww..","......bb......"],["..............","......bb......","....bbbbbb....","wwwwbebbebwwww","wwwwbbbbbbwwww","ww...bbbb...ww","w.....bb.....w"]];
const GO=["....kkkkkk....","...kkkkkkkk...","...kekkkkek...","...kkkkkkkk...","....kkllkk....",".kkkkkkkkkkkk.","kkkklkkkklkkkk","kkk.kkkkkk.kkk","kkk.kkkkkk.kkk","kk..kkkkkk..kk","kk..kkkkkk..kk","....kk..kk....","....kk..kk....","...kkk..kkk...","...kkk..kkk..."];
const BO=["..ss................ss..","..sss..............sss..","...sss.....hhhh...sss...","...ssss...hhhhhh.ssss...","....sssssshhhhhhssss....",".....sssshheehhhsss.....","......sshhhhhhhhss......",".......hhhmmmmhhh.......","......hhhhhhhhhhhh......",".....hhhhhhhhhhhhhh.....","....hhhhhggggghhhhhh....","...hhh.hhhhhhhhhh.hhh...","...hh..hhhhhhhhhh..hh...","..hhh..hhhhhhhhhh..hhh..","..cc...hhhhhhhhhh...cc..",".......hhhh..hhhh.......",".......hhh....hhh.......","......hhhh....hhhh......",".....cccc......cccc....."];

const CL={
 fresh:{name:'Freshman',stat:'str',col:'#5a6aa0',hair:'#cfd3e0',hp:125,sp:40,aspd:.32,base:{str:3,dex:3,int:3,vit:3},desc:'',
   sk:['Practice Swing','Rising Cut','Locked','Locked'],cd:[0,3,0,0],cost:[0,6,0,0]},
 blade:{name:'Blade Cadet',stat:'str',col:'#c8423a',hair:'#3a2a20',hp:140,sp:40,aspd:.3,base:{str:5,dex:2,int:1,vit:4},desc:'Sword course. Tough, close range, big hits.',
   sk:['Slash','Rising Cut','Whirl Step','Bell Breaker'],cd:[0,3,6,14],cost:[0,6,12,24]},
 archer:{name:'Wind Archer',stat:'dex',col:'#3f9b5a',hair:'#a8642c',hp:110,sp:45,aspd:.36,base:{str:2,dex:5,int:1,vit:3},desc:'Elven archery course. Fast shots, wind arts, safe distance.',
   sk:['Shot','Twin Feather','Gale Shot','Arrow Shower'],cd:[0,3,6,14],cost:[0,6,12,24]},
 mage:{name:'Spark Mage',stat:'int',col:'#4a5fd1',hair:'#e8d27a',hp:95,sp:60,aspd:.45,base:{str:1,dex:2,int:6,vit:2},desc:'Arcana course (very good boy). Area spells clear whole packs.',
   sk:['Spark','Ember Pop','Frost Lantern','Starfall Lecture'],cd:[0,3,7,15],cost:[0,7,14,28]}
};
const ADV={blade:{name:'Bell Knight',sk:'Tolling Guard',cd:22,cost:30},archer:{name:'Gale Ranger',sk:'Tempest Volley',cd:12,cost:30},mage:{name:'Astral Scholar',sk:'Comet Seminar',cd:16,cost:36}};
const JB={fresh:{},blade:{str:4,vit:3},archer:{dex:4,str:2},mage:{int:5,dex:2}};
const COURSES=['blade','archer','mage'];
const PSPR={};
for(const k in CL){const c=CL[k],pal={h:c.hair,s:'#f5cfa8',e:'#2a2030',w:'#ffffff',c:c.col,g:'#f2c14e',d:shade(c.col,.6),b:'#3a2c2a'};
  PSPR[k]=LEGS.map(l=>spr(HEAD.concat(l),pal,3));PSPR[k+'W']=white(HEAD.concat(LEGS[0]),3)}
const MT={
 slime:{hpM:1,atkM:.8,expM:.8,goldM:.7,w:38,h:34,hp:40,atk:8,exp:12,gold:[2,6],spd:70,names:['Dew Slime','Ink Slime'],pals:[{g:'#6fd3a8',l:'#d8fff0',e:'#1d2a3a',m:'#245a4a',d:'#3e9c78'},{g:'#8a5cd6',l:'#e5d4ff',e:'#fff3b0',m:'#2c1850',d:'#5a3a9a'}],rows:[SL]},
 worm:{hpM:1.3,atkM:1,expM:1.1,goldM:.9,w:56,h:28,hp:55,atk:10,exp:16,gold:[3,7],spd:50,names:['Page Worm'],pals:[{p:'#e3b36a',e:'#2a2030',d:'#a87a3a'}],rows:[WO]},
bat:{hpM:.9,atkM:1,expM:1,goldM:1,w:52,h:32,hp:60,atk:13,exp:24,gold:[5,10],spd:120,fly:1,lvb:1,names:['Quill Bat'],pals:[{w:'#3b3560',b:'#5a4f8a',e:'#ffd36a'}],rows:BA},
golem:{hpM:2.6,atkM:1.4,expM:2.4,goldM:2.4,w:46,h:62,hp:170,atk:17,exp:52,gold:[10,20],spd:38,lvb:2,drop:.16,names:['Chalk Golem'],pals:[{k:'#e9e6dc',e:'#3a7bd5',l:'#b8b3a3'}],rows:[GO]},
boss:{hpM:25,atkM:1.2,expM:25,goldM:10,ai:'boss',isBoss:1,lvl:18,wake:'The old bell shudders… the Gargoyle wakes!',dmsg:'The Gargoyle crumbles! The bell rings out over the academy.',w:78,h:96,hp:9000,atk:62,exp:1600,gold:[250,350],spd:80,names:['Gargoyle of the Old Bell'],pals:[{s:'#6a5d86',h:'#8d8a9c',e:'#ff5a5a',m:'#2a2235',g:'#7fe3ff',c:'#d9d2c0'}],rows:[BO],sc:4},
 frog:{hpM:1,atkM:1,expM:1,goldM:1,jv:1.35,jx:2.2,ai:'slime',skin:'frog',w:44,h:36,hp:1400,atk:115,exp:260,gold:[30,60],spd:80,ms:.3,names:['Bog Frog'],pals:[{g:'#7aa84a',l:'#e8ffc8',e:'#2a2030',m:'#3a5a2a',d:'#4f7a30'}],rows:[SL]},
 wisp:{hpM:.8,atkM:1,expM:1,goldM:1,dive:1,ai:'bat',skin:'wisp',w:48,h:34,hp:1100,atk:125,exp:280,gold:[35,65],spd:130,fly:1,lvb:1,ms:.25,names:['Mist Wisp'],pals:[{w:'#6fd3d3',b:'#bff8ff',e:'#ffd36a'}],rows:BA},
 sentinel:{hpM:2.6,atkM:1.4,expM:2.4,goldM:2.4,ai:'golem',skin:'sentinel',w:50,h:66,hp:3600,atk:150,exp:650,gold:[60,110],spd:40,lvb:2,drop:.16,ms:.45,names:['Rune Sentinel'],pals:[{k:'#7a8a9a',e:'#7fffd0',l:'#56606e'}],rows:[GO]},
 chimera:{hpM:25,atkM:1.2,expM:25,goldM:35,ai:'boss',skin:'chimera',isBoss:1,lvl:30,w:110,h:130,hp:50000,atk:220,exp:14000,gold:[1500,2200],spd:90,ms:.85,names:['Moonlit Chimera'],wake:'Moonlight floods the dome… the Chimera stirs!',dmsg:'The Chimera fades into starlight. Lanternfall is safe!',pals:[{s:'#4a5d96',h:'#8a9adc',e:'#fff36a',m:'#1a2245',g:'#c9a0ff',c:'#d9d2f0'}],rows:[BO],sc:4}
 ,blotling:{ai:'slime',skin:'blot',w:44,h:38,spd:80,ms:.4,hpM:1.1,atkM:1,expM:1.6,goldM:1.2,split:1,names:['Blotling'],pals:[{g:'#2a3a8a',l:'#8aa0ff',e:'#f2c14e',m:'#101840',d:'#1a2460'}],rows:[SL]},
 inkwraith:{ai:'bat',skin:'wraith',w:48,h:34,spd:130,fly:1,lvb:1,ms:.5,hpM:.8,atkM:1.05,expM:1.6,goldM:1.2,dive:1,phase:1,names:['Inkwraith'],pals:[{w:'#3a2a6a',b:'#8a4ad6',e:'#f2c14e'}],rows:BA},
 mimic:{ai:'mimic',skin:'mimic',w:50,h:66,spd:60,ms:.5,hpM:1.6,atkM:1.3,expM:2.8,goldM:2,drop:.1,names:['Portrait Mimic'],pals:[{k:'#c9a060',e:'#ff5a5a',l:'#8a6a3a'}],rows:[GO]},
 armour:{ai:'golem',skin:'armour',w:54,h:70,spd:42,lvb:1,ms:.53,hpM:2.6,atkM:1.4,expM:3.2,goldM:2.4,drop:.16,sweep:1,names:['Cursed Armour'],pals:[{k:'#6a6a8a',e:'#c98aff',l:'#4a4a66'}],rows:[GO]},
 shadow:{ai:'boss',skin:'shade',isBoss:1,lvl:40,w:90,h:118,spd:95,ms:.52,hpM:70,atkM:1.3,expM:60,goldM:60,names:["The Headmaster's Shadow"],wake:'The cracked bell seal flares violet… the Headmaster\'s Shadow rises!',dmsg:'The Shadow shrieks as the bell seal flares… and a single black page tears free and flies upward.',pals:[{s:'#2a1a4a',h:'#4a3a7a',e:'#c98aff',m:'#140c28',g:'#8a4ad6',c:'#8a80c0'}],rows:[BO],sc:4},
 mirror:{ai:'mirror',w:30,h:60,spd:170,names:['Your Shadow'],hpM:1,atkM:1,expM:0,goldM:0,pals:[{g:'#000',l:'#222',e:'#c98aff',m:'#000',d:'#111'}],rows:[SL]}
};
/* Monster stats come from one level curve (L = monster level) times each type's role multipliers.
   To add a monster: give it hpM/atkM/expM/goldM and an ai ('slime','worm','bat','golem','boss'). */
const CURVE={hp:L=>(10+10*L)*(1+L*.08),atk:L=>(.025+.0015*L)*(182+28.8*L)+3.4+1.4*L,def:L=>Math.round(L*.6),exp:L=>25*L**1.7/(8+.6*L),gold:L=>2+1.6*L+.05*L*L,tier:L=>Math.min(8,1+Math.floor(L/6))};
const MS={};
for(const k in MT){const t=MT[k],sc=t.sc||3;MS[k]=t.pals.map(p=>t.rows.map(r=>spr(r,p,sc)));MS[k+'W']=white(t.rows[0],sc)}
/* ---------- hand-drawn art ---------- */
const MAN=window.SB_MAN;
const ARTDATA=window.SB_URL;
const IMG={},WIMG={};let artReady=false;
/* Art lives in art/<group>/<key>.webp (see manifest.json). core loads at start; each region's group
   loads before you enter it (loading bar), and the next regions prefetch quietly in the background. */
const ART_G={},ARTFAIL={},GST={};for(const k in MAN){const g=MAN[k].group||'core';(ART_G[g]=ART_G[g]||[]).push(k)}
const gReady=g=>!!(GST[g]&&GST[g].ok);
function loadGroup(g){if(GST[g])return GST[g].p;const ks=ART_G[g]||[],st=GST[g]={n:ks.length,d:0,ok:false};
 st.p=new Promise(res=>{let left=ks.length,end=false;const fin=()=>{if(end)return;end=true;st.ok=true;
   for(const k of ks)if(!IMG[k])ARTFAIL[k]=1;tintArt();res()};
  if(!left){fin();return}setTimeout(fin,45000);
  ks.forEach(k=>{const im=new Image();im.decoding='async';
   im.onload=()=>{IMG[k]=im;st.d++;if(--left===0)fin()};im.onerror=()=>{ARTFAIL[k]=1;st.d++;if(--left===0)fin()};im.src=ARTDATA[k]})});
 return st.p}
function loadArt(done){loadWithBar(['core'],'Opening the academy gates…').then(()=>{artReady=!ART_G.core.some(k=>ARTFAIL[k]);done()})}
const MGC={};function mapGroups(i){if(MGC[i])return MGC[i];const M=MAPS[i],s=new Set(['core']),add=k=>{if(k&&MAN[k])s.add(MAN[k].group||'core')};
 if(M.arena)Object.keys(ART_G).forEach(g=>s.add(g));
 for(const z of M.zones){(z.bg||[]).forEach(b=>add(b[0]));(z.tk||[]).forEach(add);
  for(const t of [...(z.mobs||[]),z.boss]){if(!t||!MT[t])continue;const sk=MT[t].skin||t;for(const k in MAN)if(k===sk||k.startsWith(sk+'_'))add(k)}}
 (M.obj||[]).forEach(o=>add(o.art||(o.k==='frame'?'vframe':'')));return MGC[i]=[...s]}
function showLdr(t){$('ldrT').textContent=t;$('ldrB').style.width='0%';$('ldr').classList.add('on')}
function loadWithBar(gs,t){const L=gs.filter(g=>!gReady(g));if(!L.length)return Promise.resolve();showLdr(t);
 const iv=setInterval(()=>{let n=0,d=0;for(const g of L){const st=GST[g];n+=st?st.n:(ART_G[g]||[]).length;d+=st?st.d:0}$('ldrB').style.width=Math.round(100*d/Math.max(1,n))+'%'},80);
 return Promise.all(L.map(loadGroup)).then(()=>{clearInterval(iv);$('ldrB').style.width='100%';$('ldr').classList.remove('on')})}
let PFQ=Promise.resolve();function prefetch(gs){for(const g of gs)if(!GST[g])PFQ=PFQ.then(()=>loadGroup(g))}
function prefetchFrom(i){const M=MAPS[i];if(!M)return;const gs=[];(M.obj||[]).forEach(o=>{if(o.k==='warp'&&MAPS[o.to])gs.push(...mapGroups(o.to))});prefetch(gs)}
let LOADING=0;function needMap(i,fn){const gs=mapGroups(i);if(gs.every(gReady)){fn();prefetchFrom(i);return}if(LOADING)return;LOADING=1;
 const wp=paused;paused=true;loadWithBar(gs,'Loading '+MAPS[i].name+'…').then(()=>{LOADING=0;paused=wp;fn();prefetchFrom(i)})}
function whiteOf(k){if(WIMG[k])return WIMG[k];const im=IMG[k],c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d');g.drawImage(im,0,0);g.globalCompositeOperation='source-in';g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);return WIMG[k]=c}
/* animation smoothness: per-key frame sequences, code breathing, squash/stretch hook (XF) */
const SEQ={knight_walk:{f:[1,2,3,4]},warden_walk:{f:[1,2,3,4]},ranger_walk:{f:[1,2]},mage_walk:{f:[1,2]},archer_walk:{f:[0,1]},boss_walk:{f:[0,1,2,4]},mimic_walk:{f:[0]},pet_moth:{f:[0,1]},
 shop:{f:[0],bob:1.5},npc_pets:{f:[0],bob:1.5},ranger_idle:{f:[0],bob:1.5},mage_idle:{f:[0],bob:1.5},boss_idle:{f:[0],bob:2},pet_grimoire:{f:[0],bob:3,per:2.2}};
let XF=null,S0IN=0;const ATKD=.37;
function sqI(k,i,n){const q=SEQ[k.split(/[#@]/)[0]];if(q){const L=q.f.length;return Math.min(n-1,q.f[((Math.floor(i)%L)+L)%L])}return ((Math.floor(i)%n)+n)%n}
function sqB(k){const q=SEQ[k.split(/[#@]/)[0]];return q&&q.bob?Math.round(q.bob*(.5-.5*Math.cos(T*6.2832/(q.per||1.6)))):0}
function fr(k,i,x,y,s,flip,white){const m=MAN[k],im=IMG[k];if(!im||!m.n)return false;s/=m.ds||1;i=sqI(k,i,m.n);ctx.save();ctx.translate(Math.round(x),Math.round(y)-sqB(k)+(XF&&XF.dy||0));if(flip)ctx.scale(-1,1);if(XF){if(XF.r)ctx.rotate(XF.r);if(XF.sx||XF.sy)ctx.scale(XF.sx||1,XF.sy||1)}
 ctx.drawImage(white?whiteOf(k):im,i*m.fw,0,m.fw,m.fh,-m.ax*s,-m.ay*s,m.fw*s,m.fh*s);ctx.restore();return true}
function frC(k,i,x,y,s,rot,flip){const m=MAN[k],im=IMG[k];if(!im)return false;s/=m.ds||1;i=sqI(k,i,m.n);ctx.save();ctx.translate(Math.round(x),Math.round(y)-sqB(k));if(rot)ctx.rotate(rot);if(flip)ctx.scale(-1,1);
 ctx.drawImage(im,i*m.fw,0,m.fw,m.fh,-m.fw*s/2,-m.fh*s/2,m.fw*s,m.fh*s);ctx.restore();return true}
function makeFreshArt(){if(IMG.fresh_idle)return;for(const a of ['idle','walk','jump','attack','hurt']){const src=IMG['blade_'+a];if(!src)continue;const c=document.createElement('canvas');c.width=src.width;c.height=src.height;const g=c.getContext('2d');g.drawImage(src,0,0);
  try{const d=g.getImageData(0,0,c.width,c.height),p=d.data;for(let i=0;i<p.length;i+=4){const r=p[i],gg=p[i+1],b=p[i+2];if(p[i+3]&&r>70&&r>gg*1.55&&r>b*1.45){const l=r/255;p[i]=Math.round(55+95*l);p[i+1]=Math.round(70+100*l);p[i+2]=Math.round(110+120*l)}}g.putImageData(d,0,0)}catch(e){}
  IMG['fresh_'+a]=c;MAN['fresh_'+a]=MAN['blade_'+a]}}
const RA=k=>!!ARTDATA[k],THSPR={blade:'warden',archer:'laureate',mage:'prof'};const anim=(k,x,y,s,life,o={})=>fx.push({k:'a',key:k,x,y,s,life,max:life,...o});
const ICO_CH={Charm:'charm',Brooch:'brooch',Pendant:'pendant'},ICO_W={fresh:'psword',blade:'saber',archer:'bow',mage:'wand'};
const itemIcon=it=>{if(it.t>=7){const k='ico_t'+Math.min(8,it.t)+'_'+(it.slot==='weapon'?ICO_W[it.cls]||'saber':'charm');if(ARTDATA[k])return k}return 'ico_'+(it.slot==='weapon'?ICO_W[it.cls]||'saber':ICO_CH[it.name.split(' ').pop()]||'charm')};
const TIERC=['#c9c2dc','#d98a4a','#bfe9ff','#ffd23f','#c98aff','#ffb070','#9fe8ff','#7f8cff','#ff6a9a'];


/* ---------- world ---------- */
const MAPS=[
 {name:'Starbell Academy',w:6200,spawn:300,music:'field',zones:[
  {name:'Starbell Courtyard',x0:0,x1:900,lv:0,safe:1,fb:0,sky:['#7cc6ff','#d9f2ff'],gr:'#7a6a55',top:'#9fd46a',bg:[['bg_court_far',.12,0],['bg_court_mid',.35,250]],tk:['t_court_top','t_court_fill','p_court']},
  {name:'Moonpetal Gardens',x0:900,x1:2700,lv:1,fb:1,mobs:['slime','worm','slime'],cap:13,dlv:3,sky:['#ff9e7a','#ffe7c2'],gr:'#5c7a3a',top:'#8bc34a',bg:[['bg_garden_far',.08,0],['bg_garden_mid',.25,300],['bg_garden_near',.5,150]],tk:['t_garden_top','t_garden_fill','p_garden'],ph:96},
  {name:'Hall of Whispering Books',x0:2700,x1:4700,lv:2,fb:2,mobs:['slime','bat','golem','bat'],cap:14,dlv:10,sky:['#2e2140','#5d3f56'],gr:'#5a3b2a',top:'#b07a40',bg:[['bg_lib_far',.12,0],['bg_lib_mid',.42,290]],tk:['t_lib_top','t_lib_fill','p_lib']},
  {name:'Old Bell Tower',x0:4700,x1:6200,lv:3,fb:3,mobs:['bat'],cap:4,dlv:16,boss:'boss',bx:5900,rec:'Boss area · recommended Lv 15+',sky:['#1e1640','#8a4a7a'],gr:'#433d52',top:'#7a7390',bg:[['bg_tower_far',.06,0],['bg_tower_mid',.22,260],['bg_tower_near',.55,190]],tk:['t_tower_top','t_tower_fill','p_tower']}],
  plats:[[1050,385,160],[1300,315,140],[1560,385,180],[1900,330,160],[2200,390,200],[2460,320,140],[2860,380,180],[3110,305,160],[3360,375,200],[3660,300,160],[3960,380,180],[4260,320,200],[4900,375,150],[5180,300,160],[5470,375,150]],
  obj:[{k:'warp',x:50,to:1,tx:160,lv:20,label:'Lantern Gate · Lv 20+'},{k:'warp',x:5300,to:3,tx:160,lv:30,key:1,stair:1,ly:-150,label:'Sealed Stair · Lv 30 + Moonstone Key'},{k:'deco',art:'board',x:150,s:.62,ly:-96,label:'Gardens → Library → Bell Tower'},{k:'heal',art:'fountain',x:470,s:.78,fps:5,dy:4,ly:-104,label:'Fountain · rest here to heal'},{k:'shop',art:'shop',x:735,s:.58,fps:1/3,label:'Shopkeeper · Shop'}]},
 {name:'Lanternfall Village',w:6400,spawn:300,music:'night',shop:{name:"Marlo's Lantern Outfitter",note:'Lanternfall gear is only sold here.',tiers:[5,6],bulk:1},zones:[
  {name:'Lanternfall Village',x0:0,x1:1100,lv:0,safe:1,sky:['#3a2a5a','#ff9e6a'],gr:'#5a4636',top:'#c8a46a',bg:[['bg_vil_far',.12,0],['bg_vil_mid',.35,300]],tk:['t_vil_top','t_vil_fill','p_vil']},
  {name:'Mistveil Marsh',x0:1100,x1:3400,mobs:['frog','wisp','frog'],cap:14,dlv:22,sky:['#2a4a4a','#9fc8b0'],gr:'#2f4a3a',top:'#5a8a5a',bg:[['bg_marsh_far',.08,0],['bg_marsh_mid',.25,300],['bg_marsh_near',.5,170]],tk:['t_marsh_top','t_marsh_fill','p_marsh'],ph:96},
  {name:'Sunken Observatory',x0:3400,x1:5300,mobs:['wisp','sentinel','wisp'],cap:14,dlv:26,sky:['#14243a','#3f6a8a'],gr:'#2a3448',top:'#6a8ab0',bg:[['bg_ruin_far',.12,0],['bg_ruin_mid',.42,290]],tk:['t_ruin_top','t_ruin_fill','p_ruin']},
  {name:'Moonlit Dome',x0:5300,x1:6400,mobs:['wisp'],cap:4,dlv:28,boss:'chimera',bx:6100,rec:'Boss area · recommended Lv 28+',sky:['#0e1030','#4a3a8a'],gr:'#2a2648',top:'#8a80c0',bg:[['bg_dome_far',.06,0],['bg_dome_mid',.22,300],['bg_dome_near',.55,150]],tk:['t_dome_top','t_dome_fill','p_dome'],ph:110}],
  plats:[[1250,385,160],[1500,315,150],[1780,385,180],[2080,325,160],[2380,390,200],[2680,320,150],[3000,385,180],[3550,380,180],[3800,305,160],[4060,375,200],[4360,300,160],[4660,380,180],[4960,320,180],[5450,375,150],[5720,300,160],[6000,375,150]],
  obj:[{k:'warp',x:50,to:0,tx:160,label:'Lantern Gate · to Starbell'},{k:'heal',art:'well',x:400,s:.78,f0:1,nf:2,fps:3,dy:4,ly:-170,label:'Lantern Well · heals'},{k:'merchant',art:'npc_merchant',x:640,s:.58,fps:.4,ly:-132,label:'Marlo · Outfitter'},{k:'pets',art:'npc_pets',x:900,s:.6,fps:.5,ly:-128,label:'Pip · Pet Keeper'}]},
 {name:'Starbell Trials',hidden:1,arena:1,music:'boss',w:1700,spawn:220,zones:[
  {name:'Trial Arena',x0:0,x1:1700,arena:1,mobs:[],cap:0,dlv:0,tier:5,btier:6,sky:['#0e1030','#4a3a8a'],gr:'#2a2648',top:'#8a80c0',bg:RA('bg_rush_far')?[['bg_rush_far',.06,0],['bg_rush_mid',.22,320]]:[['bg_dome_far',.06,0],['bg_dome_mid',.22,300],['bg_dome_near',.55,150]],tk:['t_dome_top','t_dome_fill','p_dome'],ph:110}],
  plats:[[520,370,170],[900,300,170],[1280,370,170]],
  obj:[{k:'exit',x:60,label:'Leave the Trials'}]}
 ,{id:'archive',name:'The Forbidden Archive',w:6400,spawn:300,music:'night',shop:{name:"Quillon's Quiet Counter",note:'Archive gear is only sold here. Please whisper.',tiers:[7,8],bulk:1,shard10:1},zones:[
  {name:'Candlelit Reading Room',x0:0,x1:1100,safe:1,sky:['#141a3a','#3a2a4a'],gr:'#3a2a2a',top:'#c9a060',bg:[['bg_rr_far',.12,0],['bg_rr_mid',.42,290]],tk:['t_rr_top','t_rr_fill','p_rr']},
  {name:'Ink Catacombs',x0:1100,x1:3300,mobs:['blotling','inkwraith','blotling'],cap:14,dlv:32,sky:['#0a0e24','#1a2448'],gr:'#141a3a',top:'#3a4a8a',bg:[['bg_cat_far',.12,0],['bg_cat_mid',.42,290]],tk:['t_cat_top','t_cat_fill','p_cat']},
  {name:'Hall of Living Portraits',x0:3300,x1:5300,mobs:['mimic','armour','inkwraith','mimic'],cap:13,dlv:36,sky:['#1a1030','#4a2a5a'],gr:'#2a1a3a',top:'#8a6aa0',bg:[['bg_por_far',.12,0],['bg_por_mid',.42,290]],tk:['t_por_top','t_por_fill','p_por']},
  {name:'The Sealed Vault',x0:5300,x1:6400,mobs:['inkwraith'],cap:3,dlv:38,boss:'shadow',bx:6000,rec:'Boss area · recommended Lv 38+',sky:['#0c0820','#3a1a5a'],gr:'#1a1030',top:'#8a4ad6',bg:[['bg_vlt_far',.06,0],['bg_vlt_mid',.22,285]],tk:['t_vlt_top','t_vlt_fill','p_vlt']}],
  plats:[[1260,385,150],[1520,320,140],[1800,390,170],[2100,330,150],[2400,385,170],[2720,320,150],[3020,385,160],[3500,380,180],[3780,310,160],[4060,380,190],[4360,300,160],[4660,380,180],[4960,320,170],[5520,380,140],[5980,380,140]],
  obj:[{k:'warp',x:150,to:0,tx:5300,stair:1,ly:-150,label:'Sealed Stair · up to the Bell Tower'},{k:'heal',art:'candelabra',x:400,s:.74,f0:0,nf:2,fps:3,dy:4,ly:-188,label:'Everlit Candelabra · heals'},{k:'quillon',art:'npc_quillon',x:660,s:.62,fps:.4,ly:-132,label:'Archivist Quillon · Shop'},{k:'lumen',art:'npc_lumen',x:900,s:.58,fps:.5,ly:-142,ghost:1,label:'Prefect Lumen'},{k:'frame',x:5520},{k:'frame',x:5830},{k:'frame',x:6150}]}
 ,{id:'thesis',name:'Thesis Defence',hidden:1,trial:1,music:'boss',w:1700,spawn:300,zones:[
  {name:'The Sealed Vault',x0:0,x1:1700,trial:1,mobs:[],cap:0,dlv:40,sky:['#0c0820','#3a1a5a'],gr:'#1a1030',top:'#8a4ad6',bg:[['bg_vlt_far',.06,0],['bg_vlt_mid',.22,285]],tk:['t_vlt_top','t_vlt_fill','p_vlt']}],
  plats:[[560,370,160],[1100,370,160]],obj:[{k:'texit',x:60,label:'Leave the trial'}]}
];
/* REGION TEMPLATE: to add a region, push one entry to MAPS:
   {name, w (width), spawn (x), music:'field'|'night'|'boss'|'town', shop:{name,note,tiers:[t..],bulk},
    zones:[{name,x0,x1,safe|mobs:[types],cap,dlv (monster level),boss:type,bx,rec,sky,bg,tk,ph}],
    plats:[[x,y,w]...], obj:[{k:'warp',x,to,tx,lv,label},{k:'heal'|'shop'|'merchant'|'pets'|'deco',art,x,s,fps,label}]}
   then link it with a warp from the previous region and add its quests to QUESTS ({map:i} for 'visit'). */
let MAP=0,ZONES,PLAT,hitStop=0;const AR=()=>MAPS.findIndex(m=>m.arena),MI=id=>MAPS.findIndex(m=>m.id===id);const marks=[],pz=[];
function loadMap(i){MAP=i;const M=MAPS[i];WORLD=M.w;ZONES=M.zones;PLAT=[{x:-50,y:FLOOR,w:WORLD+100,h:80}];M.plats.forEach(([x,y,w])=>PLAT.push({x,y,w,h:16}))}
loadMap(0);
const ZM=[0,1,3.4,6.5];
const zoneAt=x=>ZONES.findIndex(z=>x>=z.x0&&x<z.x1);

/* ---------- state ---------- */
let state='title',paused=false,T=0,cam=0,shake=0,curZone=-1,banner=0,saveT=0,bossCd=0,nearObj=null,fadeT=0,petsAtPip=false;
const pet={x:0,y:0,dir:1};let curMul=1,combo=0,comboT=0;const comboB=()=>Math.min(.3,Math.floor(combo/5)*.01);
const PETS={
 chick:{name:'Pocket Chick',desc:'Starter pet from your welcome pack. +4% max HP.',cost:0,starter:1,hp:.04,key:'pet_chick',s:.26},
 grimoire:{name:'Little Grimoire',desc:'Prefect Lumen\'s reward. +10% max SP, −5% skill cooldowns.',cost:0,quest:1,sp:.1,cdr:.05,key:'pet_grimoire',s:.3},
 mochi:{name:'Mochi',desc:'Bouncy pudding slime. +12% max HP.',cost:3000,hp:.12,key:'pet_mochi',s:.32},
 moth:{name:'Lantern Moth',desc:'Glows in the dark. +8% ATK.',cost:5000,atk:.08,key:'pet_moth',s:.3},
 wisp:{name:'Star Wisp',desc:'Lucky little star. +6% crit, +15% gold.',cost:8000,crit:6,gold:.15,key:'pet_wisp',s:.28}};
const petLv=id=>(P&&P.petLv&&P.petLv[id])||1,petNeed=lv=>20+lv*20;
const petB=k=>P&&P.pet&&PETS[P.pet]?(PETS[P.pet][k]||0)*(1+.1*(petLv(P.pet)-1))*(1+.04*pl('pcare')):0;
function petBuffTxt(id){const p=PETS[id],f=1+.1*(petLv(id)-1),o=[];if(p.hp)o.push('+'+Math.round(p.hp*100*f)+'% max HP');if(p.atk)o.push('+'+Math.round(p.atk*100*f)+'% ATK');if(p.crit)o.push('+'+(p.crit*f).toFixed(1)+'% crit');if(p.sp)o.push('+'+Math.round(p.sp*100*f)+'% max SP');if(p.cdr)o.push('−'+(p.cdr*100*f).toFixed(1)+'% cooldowns');if(p.gold)o.push('+'+Math.round(p.gold*100*f)+'% gold');return o.join(', ')}
let P=null,S=null;
const mobs=[],proj=[],eproj=[],fx=[],nums=[],loot=[],timers=[],log=[];
const K={left:0,right:0,atk:0};
const eff=k=>P[k]+((JB[P.cls]||{})[k]||0)*(P.thesis?3:P.adv?2:1);
const MASTER={blade:{name:'Grand Bellwarden',sk:['Tolling Slash','Skyrend Cut','Cyclone Step','Great Bell Breaker','Cathedral Guard']},archer:{name:'Tempest Laureate',sk:['Piercing Shot','Triple Feather','Cyclone Shot','Arrow Storm','Hurricane Volley']},mage:{name:'Star Professor',sk:['Starspark','Nova Pop','Aurora Lantern','Starfall Symposium','Comet Dissertation']}};
const title=()=>P.thesis&&MASTER[P.cls]?MASTER[P.cls].name:P.adv&&ADV[P.cls]?ADV[P.cls].name:CL[P.cls].name;
const skC=i=>{const c=CL[P.cls];if(i===4)return ADV[P.cls]?{...ADV[P.cls],cd:ADV[P.cls].cd*.5*skCdr(4)*(1-petB('cdr')),sk:P.thesis&&MASTER[P.cls]?MASTER[P.cls].sk[4]:ADV[P.cls].sk}:{cd:1,cost:0,sk:''};return {cd:c.cd[i]*.5*skCdr(i)*(1-petB('cdr')),cost:c.cost[i],sk:P.thesis&&MASTER[P.cls]?MASTER[P.cls].sk[i]:c.sk[i]}};
const LVCAP=100;
const PAS={blade:[{id:'iron',n:'Iron Uniform',req:10,d:l=>'+'+3*l+'% max HP, +'+2*l+' DEF'},{id:'rhythm',n:'Bell Rhythm',req:15,d:l=>'+'+4*l+'% damage to stunned enemies'},{id:'wind',n:'Second Wind',req:20,d:l=>'Heal '+(0.6*l).toFixed(1)+'% max HP per kill'},{id:'resolve',n:"Warden's Resolve",req:30,d:l=>'Below 40% HP, take −'+4*l+'% damage'},{id:'toll',n:'Resounding Toll',req:'thesis',d:l=>'Bell Breaker stuns +'+(0.2*l).toFixed(1)+'s, shockwaves +'+5*l+'% size'}],
 archer:[{id:'eagle',n:'Eagle Eye',req:10,d:l=>'+'+(1.5*l).toFixed(1)+'% crit chance'},{id:'fleet',n:'Fleet Foot',req:15,d:l=>'+'+3*l+'% move speed'},{id:'far',n:'Far Shot',req:20,d:l=>'+'+3*l+'% damage to enemies over 250 px away'},{id:'keen',n:'Keen Edge',req:30,d:l=>'Crits ×'+(1.6+.06*l).toFixed(2)+' (from ×1.6)'},{id:'tail',n:'Tailwind',req:'thesis',d:l=>'Each crit cuts skills 2 and 3 cooldown by '+(0.1*l).toFixed(1)+'s (max twice a second)'}],
 mage:[{id:'focus',n:'Deep Focus',req:10,d:l=>'+'+4*l+'% max SP, +'+5*l+'% SP regen'},{id:'linger',n:'Lingering Magic',req:15,d:l=>'Slows, burns and freezes last +'+10*l+'% longer'},{id:'ward',n:'Arcane Ward',req:20,d:l=>4*l+'% of damage taken is paid from SP'},{id:'over',n:'Overcharge',req:30,d:l=>'+'+3*l+'% damage on skills (not the basic attack)'},{id:'const',n:'Constellation',req:'thesis',d:l=>3*l+'% chance per skill to refund its SP and cooldown'}],
 el:[{id:'lunch',n:'Healthy Lunch',req:25,d:l=>'Potions and ethers restore +'+5*l+'% more'},{id:'pcare',n:'Pet Care',req:25,d:l=>'Pet buff +'+4*l+'% stronger'}]};
const pl=id=>(P&&P.pas&&P.pas[id])||0,pasSpent=()=>Object.values(P.pas||{}).reduce((a,v)=>a+v,0);
const pasList=()=>P.cls==='fresh'?[]:(PAS[P.cls]||[]).concat(PAS.el),pasOpen=p=>p.req==='thesis'?!!P.thesis:P.lv>=p.req;
const lm=()=>1+.1*pl('linger');
const skLv=i=>(P.skl&&P.skl[i])||1,skMul=i=>(1+.08*(skLv(i)-1))*(i>0?1+.03*pl('over'):1),skCdr=i=>1-.03*(skLv(i)-1);
const skEarn=()=>P.cls==='fresh'?0:Math.max(0,Math.min(P.lv,LVCAP)-9)+(P.adv?3:0)+(P.thesis?3:0),skFree=()=>skEarn()-(P.skl||[1,1,1,1,1]).reduce((a,v)=>a+v-1,0)-pasSpent();
const ADVSPR={blade:'knight',archer:'ranger',mage:'scholar'};
const spk=()=>P.thesis&&IMG[THSPR[P.cls]+'_idle']?THSPR[P.cls]:P.adv&&ADVSPR[P.cls]&&IMG[ADVSPR[P.cls]+'_idle']?ADVSPR[P.cls]:P.cls;
const skIcon=i=>i===4?'sk_adv_'+P.cls:P.cls==='fresh'?'sk_blade'+Math.min(i,3):'sk_'+P.cls+Math.min(i,3);
function newPlayer(cls){const c=CL[cls];return {cls,b0:{...c.base},q:0,qc:0,eths:2,adv:false,lv:1,exp:0,pts:0,...c.base,gold:20,pots:3,inv:[],weapon:null,charm:null,hp:0,sp:0,x:300,y:FLOOR,vx:0,vy:0,w:30,h:60,atkA:0,hurtA:0,dir:1,onG:0,inv_t:0,atkT:0,cds:[0,0,0,0],anim:0,dash:0,dashHit:null,deadT:0,swing:0,kbT:0}}
function stats(){const c=CL[P.cls],w=P.weapon||{},ch=P.charm||{};const prim=eff(c.stat),am=(P.adv?1.12:1)*(P.thesis?1.1:1)*((P.guard||0)>0?1.3:1)*(1+petB('atk'));
 return {mhp:Math.round((c.hp+eff('vit')*14+P.lv*12+ua(ch,'hp'))*(P.adv?1.1:1)*(P.thesis?1.1:1)*(1+petB('hp'))*(1+.03*pl('iron'))),msp:Math.round((c.sp+eff('int')*3+P.lv*3)*(1+petB('sp'))*(1+.04*pl('focus'))),atk:Math.round((6+P.lv*2.2+prim*2.6+ua(w,'atk')+cAtk(ch))*am),def:Math.round(eff('vit')*.8+ua(ch,'def')+2*pl('iron')),crit:Math.min(60,5+eff('dex')*.45+petB('crit')+1.5*pl('eagle'))}}
const EXPR=1.5;const need=l=>Math.round(25*l**1.7);
function msg(t,col){log.push({t,col:col||'#fff',life:4});if(log.length>5)log.shift()}

/* ---------- save ---------- */
let KEY='starbell-academy-v1';
function save(){try{const o={...P};['dashHit'].forEach(k=>delete o[k]);localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}}
function loadSave(k){try{const s=localStorage.getItem(k||KEY);return s?JSON.parse(s):null}catch(e){return null}}

/* ---------- physics ---------- */
function moveBody(e,dt){
 e.x=clamp(e.x+e.vx*dt,e.w/2,WORLD-e.w/2);
 const prev=e.y;e.y+=e.vy*dt;e.onG=0;
 if(e.vy>=0)for(const p of PLAT){if(e.x>p.x-4&&e.x<p.x+p.w+4&&prev<=p.y+1&&e.y>=p.y){e.y=p.y;e.vy=0;e.onG=1;break}}
}
const rect=e=>({l:e.x-e.w/2,r:e.x+e.w/2,t:e.y-e.h,b:e.y});
const over=(a,b)=>a.l<b.r&&a.r>b.l&&a.t<b.b&&a.b>b.t;

/* ---------- combat ---------- */
const DL=[];function dpsNow(){const t0=T-10;while(DL.length&&DL[0][0]<t0)DL.shift();if(!DL.length)return 0;let s=0;for(const e of DL)s+=e[1];return Math.round(s/Math.max(3,T-DL[0][0]))}
function dmgMob(m,mult,o={}){
 if(m.dead)return;let d=S.atk*mult*curMul*rnd(.9,1.1);const crit=Math.random()*100<S.crit;if(crit){d*=1.6+.06*pl('keen');if(pl('tail')&&T-(P.twT||-9)>=.5){P.twT=T;P.cds[2]=Math.max(0,P.cds[2]-.1*pl('tail'));P.cds[3]=Math.max(0,P.cds[3]-.1*pl('tail'))}}d*=1+.01*logMs(m.type);if(m.stun>0)d*=1+.04*pl('rhythm');if(Math.abs(m.x-P.x)>250)d*=1+.03*pl('far');
 d=Math.max(1,Math.round(d-m.def));if(!(m.frzCd>T)){m.frz=.065;m.frzCd=T+.25}if(!m.boss)m.x+=Math.sign((m.x-P.x)||1)*5;if(m.ai==='mimic'&&m.st==='disguise'){m.st='reveal';m.sT=.3}if(m.sh>0){const a=Math.min(m.sh,d);m.sh-=a;d-=a}m.hp-=d;DL.push([T,d]);if(DL.length>600)DL.shift();m.flash=.06;m.aggro=1;if(m.af){if(m.af.includes('thorny')&&d>0&&P.deadT<=0){const r=Math.max(1,Math.round(d*.05));P.hp=Math.max(1,P.hp-r);if(Math.random()<.3)nums.push({x:P.x,y:P.y-60,t:'-'+r,life:.6,col:'#7dff9a'})}if(m.af.includes('frenzy')&&!m.fz&&m.hp<m.mhp*.5){m.fz=1;m.atk*=1.3}}
 combo++;comboT=2.5;sfx(crit?'crit':'hit');nums.push({x:m.x+rnd(-8,8),y:m.y-m.h-6,t:d,crit,life:.9,col:crit?'#ffd23f':'#ffffff'});
 if(o.kb&&!m.boss)m.vx=(o.dir||P.dir)*o.kb;
 if(o.launch&&!m.boss&&!m.fly)m.vy=-o.launch;
 if(o.stun)m.stun=m.boss?o.stun*.3:o.stun;
 if(o.slow)m.slow=o.slow*lm();
 if(fx.length<160)anim('spark',m.x+rnd(-8,8),m.y-m.h/2+rnd(-8,8),crit?.5:.36,.18,{c:1});if(m.boss&&(crit||o.stun))m.hurtT=.18;
 for(let i=0;i<2;i++)fx.push({k:'p',x:m.x,y:m.y-m.h/2,vx:rnd(-160,160),vy:rnd(-200,40),life:.4,max:.4,c:crit?'#ffd23f':'#fff6d6',s:4});
 if(crit||mult*curMul>=2.5)hitStop=Math.max(hitStop,.045);if(m.hp<=0){hitStop=Math.max(hitStop,m.boss?.22:m.elite?.08:.03);killMob(m)}
}
function hitArea(r,mult,o={},set){for(const m of mobs){if(m.dead||(set&&set.has(m)))continue;if(over(r,rect(m))){set&&set.add(m);dmgMob(m,mult,o)}}}
function hitCircle(x,y,rad,mult,o={}){for(const m of mobs){if(m.dead)continue;const cx=clamp(x,m.x-m.w/2,m.x+m.w/2),cy=clamp(y,m.y-m.h,m.y);if((cx-x)**2+(cy-y)**2<=rad*rad)dmgMob(m,mult,{...o,dir:Math.sign(m.x-x)||1})}}
function ring(x,y,r,c,life=.4){fx.push({k:'r',x,y,r,c,life,max:life})}
function later(t,f){timers.push({t,f})}

function cast(i){if(i)HEV.skill=1;else HEV.atk=1;const sm=skMul(i),np=proj.length,nt=timers.length,cd0=P.cds[i];curMul=sm;try{cast0(i)}finally{curMul=1}
 for(let k=np;k<proj.length;k++)proj[k].skm=sm;
 for(let k=nt;k<timers.length;k++){const f=timers[k].f;timers[k].f=()=>{const o=curMul,n0=proj.length;curMul=sm;try{f()}finally{curMul=o}for(let q=n0;q<proj.length;q++)proj[q].skm=sm}}
 if(i===2)P.dashMul=sm;if(i>0&&P.cds[i]>cd0+.01){sfx(i>=3?'ult':'skill');if(pl('const')&&Math.random()<.03*pl('const')){P.cds[i]=0;P.sp=Math.min(S.msp,P.sp+skC(i).cost);msg('Constellation! '+skC(i).sk+' refunded','#bcd0ff')}}}
function cast0(i){
 if(P.deadT>0)return;const c=CL[P.cls],kind=P.cls==='fresh'?'blade':P.cls;
 if(P.cls==='fresh'&&i>=2){msg('Unlocks when you choose a course at Lv 10','#ffd23f');return}
 if(i===4&&!P.adv)return;
 if(i===0){if(!S0IN){if(P.atkT>0)return;P.atkT=c.aspd;P.swing=.18;P.atkA=ATKD;later(.18,()=>{if(P.deadT>0)return;S0IN=1;try{cast0(0)}finally{S0IN=0}});return}}
 else{const k=skC(i);if(P.cds[i]>0)return;if(P.sp<k.cost){msg('Not enough SP','#9fd0ff');return}P.sp-=k.cost;P.cds[i]=k.cd}
 if(!S0IN){P.swing=.18;P.atkA=ATKD-.18}const d=P.dir,x=P.x,y=P.y;
 if(i===4){
  if(kind==='blade'){if(P.thesis){S=stats();P.hp=Math.min(S.mhp,P.hp+S.mhp*.2);nums.push({x:P.x,y:P.y-70,t:'+'+Math.round(S.mhp*.2),life:1,col:'#7dff9a'});for(const m of mobs)if(!m.dead&&!m.boss&&Math.abs(m.x-x)<320)m.x+=(x-m.x)*.65;if(IMG.fx_heal)anim('fx_heal',x,y+4,.6,.8,{c:1});if(IMG.fx_bellwave)anim('fx_bellwave',x,y+6,1.2,.6,{c:1})}P.guard=8;hitCircle(x,y-20,170,3.2,{stun:1,kb:220});anim('shock',x-70,y+4,1.1,.45,{flip:1});anim('shock',x+70,y+4,1.1,.45);anim('lvl',x,y,.9,.7,{follow:1});shake=.3;msg('Tolling Guard! ATK +30%, damage taken −30% for 8s','#ffd23f')}
  if(kind==='archer'){P.whirl=.45;(P.thesis?[-400,-300,-200,-100,0,100,200,300,400]:[-260,-130,0,130,260]).forEach(v=>proj.push({x:x+d*16,y:y-30,vx:d*880,vy:v,r:14,mult:2.3,life:.9,hit:new Set(),k:'gale',pierce:1,boom:P.thesis&&v===0}));if(P.thesis&&IMG.fx_windboom)anim('fx_windboom',x+d*70,y-30,1,.5,{c:1});msg('Tempest Volley!','#c9ffb0')}
  if(kind==='mage'){(P.thesis?[0,1,2,3,4]:[0,1,2]).forEach(k=>{const tx=x+d*(130+k*130);later(.1+k*.28,()=>proj.push({x:tx-d*150,y:-40,vx:d*150,vy:950,r:22,mult:0,life:1.3,hit:new Set(),k:'meteor',tx,big:1,well:P.thesis}))});msg(P.thesis?'Comet Dissertation!':'Comet Seminar!','#bcd0ff')}
  return}
 if(kind==='blade'){
  if(i===0){hitArea({l:Math.min(x,x+d*72),r:Math.max(x,x+d*72),t:y-56,b:y},1,{kb:140});if(P.thesis&&(P.slashN=(P.slashN||0)+1)%3===0){hitArea({l:Math.min(x,x+d*190),r:Math.max(x,x+d*190),t:y-40,b:y+4},1.2,{kb:200});anim(RA('fx_tshock')?'fx_tshock':'shock',x+d*110,y+4,RA('fx_tshock')?.75:.8,.35,{flip:d<0})}}
  if(i===1){hitArea({l:Math.min(x,x+d*86),r:Math.max(x,x+d*86),t:y-110,b:y},1.9,{launch:420});anim(P.adv&&RA('fx_kslash')?'fx_kslash':'slash',x+d*44,y-38,P.adv&&RA('fx_kslash')?.55:.62,.25,{flip:d<0,c:1});P.vy=Math.min(P.vy,-180);if(P.thesis)later(.22,()=>{hitArea({l:Math.min(P.x,P.x+d*110),r:Math.max(P.x,P.x+d*110),t:P.y-200,b:P.y-30},1.4,{});anim(RA('fx_sky')?'fx_sky':'slash',P.x+d*55,P.y-110,RA('fx_sky')?.75:.8,.3,{flip:d<0,c:1})})}
  if(i===2){if(P.thesis)addPZ({x:x+d*120,y:y-28,r:115,t:2,tick:.35,mult:.45,col:'#ffd6cc',art:'fx_whirlwind'});P.dash=.24;P.dashHit=new Set();P.inv_t=Math.max(P.inv_t,.3);for(let k=0;k<8;k++)fx.push({k:'p',x,y:y-20,vx:-d*rnd(60,200),vy:rnd(-40,40),life:.35,max:.35,c:'#ffb0a0',s:5})}
  if(i===3){P.vy=-380;const R=(P.thesis?262:175)*(1+.05*pl('toll')),st=(P.thesis?3:1.6)+.2*pl('toll'),wave=()=>{hitCircle(P.x,P.y-20,R,4.6,{stun:st,kb:260});ring(P.x,P.y-10,R,'#ffd23f',.5);anim('shock',P.x-70,P.y+4,1.1,.45,{flip:1});anim('shock',P.x+70,P.y+4,1.1,.45);shake=.35};later(.32,wave);if(P.thesis)later(.62,()=>{hitCircle(P.x,P.y-20,R,2.2,{stun:st,kb:200});if(IMG.fx_bellwave)anim('fx_bellwave',P.x,P.y+6,R/150,.5,{c:1});ring(P.x,P.y-10,R*1.1,'#fff2a8',.5)})}
 }
 if(kind==='archer'){
  const arrow=(vy,mult,o={})=>proj.push({x:x+d*16,y:y-28,vx:d*760,vy,r:7,mult,life:.75,hit:new Set(),k:'arrow',...o});
  if(i===0)arrow(0,1,P.thesis?{pc:2}:{});
  if(i===1){[-140,0,140].forEach(v=>arrow(v,1.3,P.thesis?{home:1}:{}));anim('fx_volley',x+d*62,y-38,.5,.25,{flip:d<0,c:1})}
  if(i===2){P.vx=-d*360;P.vy=-330;P.kbT=.3;P.whirl=.4;proj.push({x:x+d*16,y:y-30,vx:d*900,vy:0,r:12,mult:2.9,life:.9,hit:new Set(),k:'gale',pierce:1});if(P.thesis)addPZ({x:x+d*240,y:y-30,r:170,t:2,pull:260,tick:.4,mult:.35,col:'#c9ffb0',art:'fx_vortex'})}
  if(i===3){const x0=x+d*80,W2=P.thesis?450:320,N=P.thesis?24:16;for(let k=0;k<N;k++)later(k*.06,()=>proj.push({x:x0+d*rnd(0,W2),y:-20,vx:0,vy:950,r:8,mult:.95,life:1,hit:new Set(),k:'rain',pierce:1,slow:P.thesis?2:0}));if(P.thesis&&IMG.fx_cloud)anim('fx_cloud',x0+d*W2/2,70,1.6,1.6,{c:1});msg('Arrow Shower!','#c9ffb0')}
 }
 if(kind==='mage'){
  if(i===0)proj.push({x:x+d*18,y:y-30,vx:d*480,vy:0,r:9,mult:1.1,life:.9,hit:new Set(),k:'orb',chain:P.thesis?2:0});
  if(i===1){let best=null,bd=420;for(const m of mobs){if(m.dead)continue;const dd=Math.hypot(m.x-x,m.y-y);if(dd<bd){bd=dd;best=m}}
   const tx=best?best.x:x+d*160,ty=best?best.y-best.h/2:y-30;later(.12,()=>{hitCircle(tx,ty,80,2.3,{kb:120});ring(tx,ty,80,'#ff8a3d',.35);if(P.thesis)addPZ({x:tx,y:ty,r:85,t:3*lm(),tick:.5,mult:.4,col:'#ff8a3d',art:'fx_burn',ady:40});anim('ember',tx,ty+30,1.6,.45);for(let k=0;k<6;k++)fx.push({k:'p',x:tx,y:ty,vx:rnd(-260,260),vy:rnd(-260,120),life:.5,max:.5,c:k%2?'#ff8a3d':'#ffd23f',s:5})})}
  if(i===2){hitCircle(x,y-20,150,1.9,{slow:3});if(P.thesis)for(const m of mobs){if(m.dead||Math.hypot(m.x-x,m.y-m.h/2-y+20)>170)continue;m.frostN=(m.frostN||0)+1;if(m.frostN>=3){m.frostN=0;m.stun=Math.max(m.stun,(m.boss?.45:1.5)*lm());ring(m.x,m.y-m.h/2,40,'#dff8ff',.5);if(IMG.fx_ice)anim('fx_ice',m.x,m.y+4,Math.max(.5,m.h/120),.7,{c:1})}}ring(x,y-20,150,'#9fe8ff',.5);anim('frost',x,y-20,2.4,.5,{c:1});for(let k=0;k<20;k++){const a=k/20*6.28;fx.push({k:'p',x:x+Math.cos(a)*40,y:y-20+Math.sin(a)*40,vx:Math.cos(a)*300,vy:Math.sin(a)*300,life:.45,max:.45,c:'#dff8ff',s:4})}}
  if(i===3){const NM=P.thesis?12:6;if(P.thesis){const tx=x+d*(90+6*60);later(.15+12*.16,()=>proj.push({x:tx-d*150,y:-40,vx:d*150,vy:950,r:22,mult:0,life:1.3,hit:new Set(),k:'meteor',tx,big:1}))}for(let k=0;k<NM;k++){const tx=x+d*(90+(k%6)*60)+rnd(-30,30);later(.15+k*.16,()=>proj.push({x:tx-d*120,y:-30,vx:d*120,vy:900,r:16,mult:0,life:1.2,hit:new Set(),k:'meteor',tx}))}msg('Starfall Lecture!','#bcd0ff')}
 }
}
function usePot(){HEV.pot=1;if(P.deadT>0)return;if(P.pots<=0){msg('No potions left. Buy some in the Shop','#ffb0b0');return}if(P.hp>=S.mhp){msg('HP already full');return}P.pots--;const h=Math.round(S.mhp*.4*(1+.05*pl('lunch')));P.hp=Math.min(S.mhp,P.hp+h);nums.push({x:P.x,y:P.y-60,t:'+'+h,life:1,col:'#7dff9a'})}
function useEth(){if(P.deadT>0)return;if(!(P.eths>0)){msg('No ethers left. Buy some in the Shop','#9fd0ff');return}if(P.sp>=S.msp){msg('SP already full');return}P.eths--;const h=Math.round(S.msp*.5*(1+.05*pl('lunch')));P.sp=Math.min(S.msp,P.sp+h);nums.push({x:P.x,y:P.y-60,t:'+'+h+' SP',life:1,col:'#9fd0ff'})}
function jump(){if(P.deadT>0)return;if(P.onG){P.vy=-570;P.onG=0;sfx('jump')}}
function hurtP(d,from){
 if(P.inv_t>0||P.dash>0||P.deadT>0)return;if((P.guard||0)>0)d*=.7;if(P.hp<S.mhp*.4)d*=1-.04*pl('resolve');if(pl('ward')){const w=Math.min(P.sp,d*.04*pl('ward'));P.sp-=w;d-=w}d=Math.max(1,Math.round(d*rnd(.9,1.1)-S.def));P.hp-=d;lastHurt=d;sfx('hurt');P.inv_t=.75;P.hurtA=.3;P.vy=-240;P.vx=(P.x<from?-1:1)*260;P.kbT=.18;shake=Math.max(shake,d>S.mhp*.15?.3:.12);hitStop=Math.max(hitStop,.065);
 nums.push({x:P.x,y:P.y-56,t:d,life:.9,col:'#ff6b6b'});
 if(P.hp<=0){P.hp=0;P.deadT=2.2;P.deaths=(P.deaths||0)+1;const loss=MAP===AR()||MAPS[MAP].trial?0:Math.round(need(P.lv)*.08);P.exp=Math.max(0,P.exp-loss);msg('You fainted. Off to the infirmary… (−'+loss+' EXP)','#ffb0b0')}
}
function gainExp(e){if(P.lv>=LVCAP){P.exp=need(P.lv);return}P.exp+=e;while(P.lv<LVCAP&&P.exp>=need(P.lv)){P.exp-=need(P.lv);P.lv++;P.pts+=4;S=stats();P.hp=S.mhp;P.sp=S.msp;if(P.lv>=LVCAP){P.exp=need(P.lv);msg('Lv '+LVCAP+' reached: this is the beta level cap!','#ffd23f')}sfx('lvl');msg('Level up! Lv '+P.lv+' · +4 stat points','#ffd23f');if(P.lv===10&&P.cls==='fresh')msg('You can choose your course now! Press Course.','#7dff9a');qCheck();anim('lvl',P.x,P.y,.8,.9,{follow:1});updBadge();save()}}

/* ---------- items ---------- */
const BAG=100;const TIER=['Practice','Bronze','Moonsilver','Starlit','Bellforged','Lanternlight','Astral','Inkbound','Sealbreaker'];
const WN={fresh:'Practice Sword',blade:'Saber',archer:'Longbow',mage:'Wand'};
const CN=['Charm','Brooch','Pendant'];
let uid=1;
function makeItem(t,slot,fixed){slot=slot||(Math.random()<.55?'weapon':'charm');const v=()=>fixed?1:rnd(.8,1.25);
 if(slot==='weapon')return {id:Date.now()+(uid++),slot,cls:P.cls,t,name:TIER[t]+' '+WN[P.cls],atk:Math.round((4+t*7)*v())};
 return {id:Date.now()+(uid++),slot,t,name:TIER[t]+' '+CN[Math.floor(Math.random()*3)],atk:Math.round((2+t*3.5)*v()),def:Math.round((1+t*2.2)*v()),hp:Math.round((15+t*28)*v())}}
const ua=(it,k)=>Math.round((it[k]||0)*(1+.1*(it.up||0)));
const itName=it=>it.name+(it.up?' +'+it.up:'');
const cAtk=c=>c&&c.slot?Math.round((c.atk!=null?c.atk:2+c.t*3.5)*(1+.1*(c.up||0))):0;
function itemTxt(it){return it.slot==='weapon'?'ATK +'+ua(it,'atk'):'ATK +'+cAtk(it)+' · DEF +'+ua(it,'def')+' · HP +'+ua(it,'hp')}
const UPR=[1,1,1,.75,.75,.75,.55,.55,.4,.4];
const upCost=it=>({g:Math.round((150+it.t*250)*((it.up||0)+1)),s:(it.up||0)+1,r:UPR[it.up||0]});
function upgrade(slot){const it=P[slot];if(!it||(it.up||0)>=10)return;const c=upCost(it);if(P.gold<c.g||(P.shards||0)<c.s){msg('Need '+c.g+' gold and '+c.s+' Star Shards','#ffb0b0');return}
 P.gold-=c.g;P.shards-=c.s;if(Math.random()<c.r){it.up=(it.up||0)+1;msg('Upgrade success! '+itName(it),'#7dff9a');anim('fx_upgrade',P.x,P.y-36,1,.7,{c:1});sfx('up')}else{msg('Upgrade failed… the shards crumble, but your gear is safe.','#ffb0b0');anim('fx_fail',P.x,P.y-30,.9,.6,{c:1});sfx('fail')}
 S=stats();P.hp=Math.min(P.hp,S.mhp);renderBag();save()}
function dropLoot(x,y,k,val,item){loot.push({x,y:y-10,vx:rnd(-90,90),vy:rnd(-380,-240),w:14,h:14,k,val,item,t:0,onG:0})}

const QUESTS=[
 {t:'First Lesson',d:'Defeat 8 Dew Slimes in Moonpetal Gardens.',kill:'slime0',n:8,r:{exp:80,gold:60,pots:3}},
 {t:'Bookworms',d:'Defeat 6 Page Worms in Moonpetal Gardens.',kill:'worm',n:6,r:{exp:150,gold:80,eths:2}},
 {t:'Getting Stronger',d:'Reach Lv 5. Spend your stat points from the Stats button.',lv:5,r:{gold:150,item:[1,'charm']}},
 {t:'Course Selection',d:'Reach Lv 10, then press Course and choose Blade, Archer or Mage.',course:1,r:{exp:300,gold:200,item:[1,'weapon']}},
 {t:'Library Duty',d:'Defeat 10 Quill Bats in the Hall of Whispering Books.',kill:'bat',n:10,r:{exp:900,gold:300,pots:5}},
 {t:'Ink Spill',d:'Defeat 10 Ink Slimes in the Hall of Whispering Books.',kill:'slime1',n:10,r:{exp:1200,gold:350,eths:3}},
 {t:'Chalk Dust',d:'Defeat 5 Chalk Golems in the Hall of Whispering Books.',kill:'golem',n:5,r:{exp:1800,gold:500,item:[2,'weapon']}},
 {t:'The Old Bell',d:'Defeat the Gargoyle of the Old Bell (recommended Lv 15+).',kill:'boss',n:1,r:{exp:3000,gold:1200,item:[3,'charm']}},
 {t:'Graduation',d:'Reach Lv 20 to earn your advanced title and a fifth skill.',lv:20,r:{adv:1,gold:1500,item:[3,'weapon']}},
 {t:'Field Trip',d:'Reach Lv 20, then step through the Lantern Gate at the far left of the Courtyard to reach Lanternfall Village.',map:1,r:{exp:2000,gold:1000,pots:5}},
 {t:'Bog Hoppers',d:'Defeat 15 Bog Frogs in Mistveil Marsh.',kill:'frog',n:15,r:{exp:5000,gold:1500,eths:3}},
 {t:'A Friend for the Road',d:'Talk to Pip the Pet Keeper in Lanternfall Village and adopt a pet.',pet:1,r:{gold:2000,pots:5}},
 {t:'Will-o\'-Wisps',d:'Defeat 15 Mist Wisps in Mistveil Marsh or the Sunken Observatory.',kill:'wisp',n:15,r:{exp:7000,gold:2000,item:[5,'charm']}},
 {t:'Ruin Sentries',d:'Defeat 8 Rune Sentinels in the Sunken Observatory.',kill:'sentinel',n:8,r:{exp:10000,gold:3000,item:[5,'weapon']}},
 {t:'The Moonlit Chimera',d:'Defeat the Moonlit Chimera in the Moonlit Dome (recommended Lv 28+).',kill:'chimera',n:1,r:{exp:20000,gold:6000,item:[6,'charm']}},
 {hand:[{t:"Under the old bell, a stair you've never noticed. The Moonstone Key fits perfectly."}],t:'Below the Bell',d:'Reach Lv 30 and carry the Moonstone Key. Under the old bell, a stair you\'ve never noticed. Open the Sealed Stair in the Old Bell Tower.',map:3,r:{exp:30000,gold:5000,pots:5,eths:5}},
 {t:'Shhh!',d:'Talk to Archivist Quillon in the Candlelit Reading Room.',talk:'quillon',r:{exp:10000,gold:3000,shards:5}},
 {t:'Spilled Ink',d:'Defeat 20 Blotlings in the Ink Catacombs (the little ones don\'t count).',kill:'blotling',n:20,r:{exp:40000,gold:8000,item:[6,'weapon']}},
 {hand:[{who:'Prefect Lumen',art:'npc_lumen',t:"These are torn from Headmaster Starbell's diary! You can read them any time from your Bag."},{who:'Prefect Lumen',art:'npc_lumen',t:'And this little one has been following you around. I think it wants to come along!'}],t:'Missing Pages',d:'Collect 10 Lost Pages for Prefect Lumen. They drop from Archive monsters while this quest is active. She says they\'re torn from Headmaster Starbell\'s diary…',collect:'page',n:10,r:{exp:45000,gold:8000,pet:'grimoire'}},
 {t:'Lights Out',d:'Defeat 15 Inkwraiths.',kill:'inkwraith',n:15,r:{exp:50000,gold:10000,item:[7,'charm']}},
 {t:'Don\'t Blink',d:'Defeat 12 Portrait Mimics in the Hall of Living Portraits.',kill:'mimic',n:12,r:{exp:60000,gold:12000,shards:10}},
 {t:'Hollow Guard',d:'Defeat 8 Cursed Armours in the Hall of Living Portraits.',kill:'armour',n:8,r:{exp:70000,gold:14000,item:[7,'weapon']}},
 {hand:[{who:'Prefect Lumen',art:'npc_lumen',t:'Every master of Starbell must face the worst version of themselves. It\'s our oldest tradition: the Thesis Defence.'},{who:'Prefect Lumen',art:'npc_lumen',t:'When you reach Lv 40, talk to me and I\'ll open the Vault for you. Alone.'}],t:'The Headmaster\'s Shadow',d:'Defeat the Headmaster\'s Shadow in the Sealed Vault (recommended Lv 38+). Then talk to Prefect Lumen.',kill:'shadow',n:1,r:{exp:120000,gold:30000,item:[8,'charm']}},
 {hand:[{who:'Prefect Lumen',art:'npc_lumen',t:'You know… I think I can finally rest.'},{who:'Prefect Lumen',art:'npc_lumen',t:'Take my prefect badge. Wear it well, Professor.'}],t:'Thesis Defence',d:'Reach Lv 40, then ask Prefect Lumen to begin the Thesis Defence and defeat Your Shadow in the Sealed Vault.',thesis:1,r:{gold:50000,item:[8,'weapon']}},
 {t:'Extra Credit',d:'Defeat 40 monsters anywhere. Repeatable.',kill:'any',n:40,rep:1,r:{goldLv:300,pots:10,eths:5}}];
const curQ=()=>QUESTS[Math.min(P.q||0,QUESTS.length-1)];
function qProg(){const q=curQ();if(q.kill)return [Math.min(P.qc||0,q.n),q.n];if(q.lv)return [Math.min(P.lv,q.lv),q.lv];if(q.map)return [((P.vm||{})[q.map]||(q.map===1&&P.vis1))?1:0,1];if(q.pet)return [(P.pets||[]).length?1:0,1];if(q.talk)return [((P.talked||{})[q.talk])?1:0,1];if(q.collect)return [Math.min(P.pages||0,q.n),q.n];if(q.thesis)return [P.thesis?1:0,1];return [P.cls!=='fresh'?1:0,1]}
function qReady(){const [a,b]=qProg();return a>=b}
function qCheck(){if(qReady()&&!P.qAnn){P.qAnn=1;msg('Quest complete: '+curQ().t+'! Claim it in Quests.','#7dff9a');updBadge()}}
function rewardTxt(r){const o=[];if(r.exp)o.push(Math.round(r.exp*EXPR)+' EXP');if(r.goldLv)o.push((r.goldLv*P.lv).toLocaleString('en')+' gold (300 × your level)');if(r.gold)o.push(r.gold+' gold');if(r.pots)o.push(r.pots+' potions');if(r.eths)o.push(r.eths+' ethers');if(r.shards)o.push(r.shards+' Star Shards');if(r.pet)o.push(PETS[r.pet].name+' pet');if(r.item)o.push(TIER[r.item[0]]+' '+(r.item[1]==='weapon'?'weapon':'charm'));if(r.adv)o.push('advanced title + 5th skill');return o.join(' · ')}
function claimQ(){if(!qReady())return;const q=curQ(),r=q.r;let over=false;if(r.item){over=P.inv.length>=BAG;{const ni=makeItem(r.item[0],r.item[1]);P.inv.push(ni);gotItem(ni)}if(over)msg('Your satchel is over its '+BAG+'-item limit. Sell some gear in the Shop.','#ffb0b0')}
 if(q.hand)setTimeout(()=>say(q.hand),60);P.gold+=(r.gold||0)+(r.goldLv||0)*P.lv;P.pots+=r.pots||0;P.shards=(P.shards||0)+(r.shards||0);if(r.pet){P.pets=P.pets||[];if(!P.pets.includes(r.pet))P.pets.push(r.pet);P.pet=r.pet;S=stats();sfx('pet')}if(q.collect)P.pages=0;P.eths=(P.eths||0)+(r.eths||0);
 if(r.adv&&P.cls!=='fresh'){P.adv=true;S=stats();P.hp=S.mhp;anim('lvl',P.x,P.y,1,1,{follow:1});msg('You are now '+(/^[AEIOU]/.test(title())?'an ':'a ')+title()+'! New skill: '+ADV[P.cls].sk,'#ffd23f');setupSkills()}
 msg('Quest reward: '+rewardTxt(r),'#ffd23f');if(!q.rep)P.q=(P.q||0)+1;P.qc=0;P.qAnn=0;if(r.exp)gainExp(Math.round(r.exp*EXPR));qCheck();updBadge();save()}
function killMob(m){
 m.dead=1;if(m.mirror){thesisWin();return}
  {const k=m.type;P.mlog=P.mlog||{};const c=P.mlog[k]=(P.mlog[k]||0)+1,R={100:[50,3],500:[200,10],1000:[500,25]}[c];if(R){const g=R[0]*m.lvl;P.gold+=g;P.shards=(P.shards||0)+R[1];msg('Monster Log: '+c+' '+MT[k].names[0]+'s! +'+g.toLocaleString('en')+' gold, +'+R[1]+' Star Shards, +1% damage to them','#ffd23f');sfx('chest')}}
  if(m.elite==='shiny')P.kS=(P.kS||0)+1;else if(m.elite)P.kE=(P.kE||0)+1;
  if(m.boss&&(P.deaths||0)===m.d0){P.clean=P.clean||{};P.clean[m.type]=1}
  if(m.af&&m.af.includes('split'))for(const k of [-1,1]){const c=spawnMob(m.type,m.z,m.x+k*24,m.lvl);c.kid=1;c.elite=null;c.af=null;c.sh=0;c.hp=c.mhp=Math.round(m.mhp*.3);c.exp=m.exp*.15;c.gold=m.gold.map(v=>v*.15);c.drop=.02;c.name=m.name.replace(/^(Elite|Shiny) /,'')+' (split)';c.w*=.75;c.h*=.75;c.vy=-300;c.vx=k*200;c.y=Math.min(m.y,FLOOR)}if(MT[m.type].split&&!m.mini){for(const k of [-1,1]){const c=spawnMob(m.type,m.z,m.x+k*24,m.lvl);c.mini=1;c.hp=c.mhp=Math.round(m.mhp*.25);c.exp=m.exp*.15;c.gold=m.gold.map(v=>v*.2);c.name='Mini Blotling';c.w*=.7;c.h*=.7;c.vy=-320;c.vx=k*220;c.drop=.02;c.y=Math.min(m.y,FLOOR)}}
  if(MAPS[MAP].id==='archive'&&curQ().collect&&!qReady()&&Math.random()<.25)dropLoot(m.x,m.y-m.h/2,'page',1);
  if(m.type==='chimera'&&!P.mkey){P.mkey=1;msg('The Chimera drops the Moonstone Key!','#c9a0ff');later(.8,()=>scene('key',[{art:'ico_mkey',t:'Something glints in the fading moonlight: a key carved from moonstone, marked with the same sigil as the academy bell.'},{t:'It hums softly, pulling you toward the Old Bell Tower.'}]))}
  {const q=curQ(),key=m.mini?'blotmini':m.type==='slime'?'slime'+m.v:m.type;if(q.kill&&(q.kill===key||q.kill==='any')&&!qReady()){P.qc=(P.qc||0)+1;qCheck()}}const z=ZONES[m.z];if(pl('wind')&&P.deadT<=0)P.hp=Math.min(S.mhp,P.hp+S.mhp*.006*pl('wind'));gainExp(Math.round(m.exp*xpFall(m)*EXPR*(P.starter&&P.lv<20?1.3:1)*(1+comboB())));
  if(P.pet&&PETS[P.pet]){const id=P.pet,lv=petLv(id);P.petXp=P.petXp||{};P.petLv=P.petLv||{};if(lv<10){P.petXp[id]=(P.petXp[id]||0)+(m.boss?20:1);if(P.petXp[id]>=petNeed(lv)){P.petXp[id]-=petNeed(lv);P.petLv[id]=lv+1;msg(PETS[id].name+' grew to Lv '+(lv+1)+'! '+petBuffTxt(id),'#ffd23f');anim('fx_upgrade',pet.x,pet.y,.5,.6,{c:1});sfx('pet');S=stats()}}}
  const g=Math.round(rnd(...m.gold)*(1+petB('gold')));dropLoot(m.x,m.y-m.h/2,'gold',g);
 if(Math.random()<.1)dropLoot(m.x,m.y-m.h/2,'pot',1);if(m.boss||Math.random()<.1)dropLoot(m.x,m.y-m.h/2,'shard',m.boss?5:1);if(Math.random()<.04)dropLoot(m.x,m.y-m.h/2,'eth',1);
const ch=m.boss?1:m.drop,tt=Math.min(8,(m.tier||1)+(m.elite==='shiny'?1:0));if(m.elite==='shiny')dropLoot(m.x,m.y-m.h/2,'shard',3);
 if(Math.random()<ch)dropLoot(m.x,m.y-m.h/2,'item',0,makeItem(Math.min(6,tt)));
 if(m.boss){{const day=new Date().toDateString();P.daily=P.daily||{};if(P.daily[m.type]!==day){P.daily[m.type]=day;const g2=Math.round(rnd(...m.gold)*2);P.gold+=g2;P.shards=(P.shards||0)+5;P.pots+=3;
   if(P.inv.length<BAG){const ni=makeItem(Math.min(8,m.tier||4),Math.random()<.5?'weapon':'charm');P.inv.push(ni);gotItem(ni)}msg('Daily boss chest! +'+g2+' gold, 5 Star Shards, 3 potions and a bonus item','#ffd23f');anim('fx_upgrade',m.x,m.y-60,1.3,.9,{c:1});sfx('chest')}}
  dropLoot(m.x+20,m.y-30,'item',0,makeItem(Math.min(8,m.tier||4),'weapon'));for(let k=0;k<3;k++)dropLoot(m.x,m.y-30,'pot',1);bossCd=60;msg(MT[m.type].dmsg,'#ffd23f');if(m.type==='boss')later(.8,()=>scene('garg',[{t:'The Gargoyle crumbles. Above you, the old bell shudders… and a hairline crack runs down its side.'},{t:"It sways. But it doesn't ring."}]));if(m.type==='shadow')later(.8,()=>scene('shadow',[{t:'The Shadow shrieks as the bell seal flares… and a single black page tears free and flies upward, out through the tower and into the sky.'},{who:'Prefect Lumen',art:'npc_lumen',t:"You did it! But that page… that was its heart. The Umbral Page. It's out there now."},{who:'Prefect Lumen',art:'npc_lumen',t:'Come and see me in the Reading Room. There\'s something every master of Starbell has to do.'}]));shake=.5}
 for(let k=0;k<10;k++)fx.push({k:'p',x:m.x,y:m.y-m.h/2,vx:rnd(-200,200),vy:rnd(-260,60),life:.6,max:.6,c:'#f6ecd2',s:5});
}

/* ---------- mobs ---------- */
function spawnMob(type,zi,x,lvl){
 const t=MT[type],z=ZONES[zi],v=type==='slime'&&z.dlv>=8?1:0,L=lvl||(t.isBoss?t.lvl:z.dlv+(t.lvb||0));
 const onPlat=!t.fly&&Math.random()<.35;let y=FLOOR;
 if(onPlat){const ps=PLAT.filter(p=>p.h<20&&p.x>z.x0&&p.x+p.w<z.x1);if(ps.length){const p=ps[Math.floor(Math.random()*ps.length)];x=p.x+rnd(20,p.w-20);y=p.y}}
 const g=CURVE.gold(L)*(t.goldM||1),hp=Math.round(CURVE.hp(L)*(t.hpM||1));
 const m={type,z:zi,x,y:t.fly?rnd(230,360):y,w:t.w,h:t.h,vx:0,vy:0,hp,mhp:hp,atk:CURVE.atk(L)*(t.atkM||1),def:CURVE.def(L),exp:CURVE.exp(L)*(t.expM||1),gold:[g*.6,g*1.2],tier:z.tier!=null&&!t.isBoss?z.tier:Math.min(8,CURVE.tier(L)+(t.isBoss?1:0)),
  spd:t.spd,fly:t.fly,v,dir:Math.random()<.5?-1:1,tm:rnd(.3,1.5),hitCd:0,stun:0,slow:0,flash:0,aggro:0,st:'idle',sT:0,anim:rnd(0,6),name:t.names[Math.min(v,t.names.length-1)],lvl:L,boss:!!t.isBoss,ai:t.ai||type,drop:t.drop||.07};
 if(!t.isBoss&&!z.arena&&!lvl){const r=Math.random();if(r<.012){m.elite='shiny';m.hp=m.mhp=hp*2;m.exp*=6;m.gold=m.gold.map(v=>v*8);m.drop=1;m.name='Shiny '+m.name;if(Math.abs(x-P.x)<900)msg('A shiny '+t.names[0]+' appeared!','#ffd23f')}
  else if(r<.1){m.elite='elite';m.hp=m.mhp=hp*3;m.atk*=1.3;m.exp*=3;m.gold=m.gold.map(v=>v*3);m.drop*=3;m.name='Elite '+m.name;m.w*=1.15;m.h*=1.15}}
 if(m.elite){const ks=Object.keys(AFX);m.af=[];while(m.af.length<(m.elite==='shiny'?2:1)){const a=ks[Math.floor(Math.random()*ks.length)];if(!m.af.includes(a))m.af.push(a)}
  if(m.af.includes('shield'))m.sh=m.mhp*.2;if(m.af.includes('hasty'))m.spd*=1.4}
 if(t.isBoss)m.d0=P?P.deaths||0:0;
 mobs.push(m);return m}
function updMob(m,dt){if(m.boss&&!m.mirror){m.age=(m.age||0)+dt;const lim=ENR[m.type];if(lim&&!m.enr&&m.age>lim){m.enr=1;m.spd*=1.3;m.atk*=1.3;msg(m.name+' is enraged! +30% speed and damage','#ff5a5a');sfx('boss');shake=.4}}
 m.anim+=dt;m.flash-=dt;if(m.frz>0){m.frz-=dt;return}m.wd=(m.wd||0)+Math.abs(m.vx||0)*dt;m.slamT=(m.slamT||0)-dt;m.hurtT=(m.hurtT||0)-dt;m.hitCd-=dt;m.slow-=dt;const z=ZONES[m.z];
 const dx=P.x-m.x,adx=Math.abs(dx),near=P.deadT<=0&&adx<(m.boss?700:330)&&Math.abs(P.y-m.y)<220;
 const sp=m.spd*(m.slow>0?.45:1);
 if(m.stun>0){m.stun-=dt;m.vx*=.9;if(!m.fly){m.vy+=GRAV*dt;moveBody(m,dt)}return}
 m.tm-=dt;
if(m.ai==='slime'){if(m.onG){m.vx*=.8;if(m.tm<=0){if(near)m.dir=Math.sign(dx)||1;else if(Math.random()<.4)m.dir*=-1;{const t=MT[m.type];m.vy=-rnd(260,360)*(near?t.jv||1:1);m.vx=m.dir*sp*1.7*(near?t.jx||1:1)}m.tm=rnd(.7,1.4)}}}
else if(m.ai==='worm'){if(near)m.dir=Math.sign(dx)||1;else if(m.tm<=0){m.dir*=-1;m.tm=rnd(1.5,3)}m.vx=m.dir*sp}
else if(m.ai==='golem'){
if(m.st==='wind'){m.vx=0;m.sT-=dt;if(m.sT<=0){m.st='idle';m.tm=2.2;m.slamT=.35;anim('shock',m.x+m.dir*36,m.y+4,.6,.35);shake=Math.max(shake,.1);if(Math.abs(P.x-(m.x+m.dir*34))<(MT[m.type].sweep?110:70)&&Math.abs(P.y-m.y)<60)hurtP(m.atk*1.4,m.x)}}
  else{if(near){m.dir=Math.sign(dx)||1;if(adx<75&&m.tm<=0){m.st='wind';m.sT=.6}}else if(m.tm<=0){m.dir*=-1;m.tm=rnd(2,4)}m.vx=m.st==='wind'?0:m.dir*sp}}
else if(m.ai==='bat'){let ty=near?P.y-30+Math.sin(T*3+m.anim)*30:280+Math.sin(m.anim)*60;if(MT[m.type].dive){if(m.dive>0){m.dive-=dt;ty=P.y-20;m.vx+=((Math.sign(dx)||1)*sp*3-m.vx)*dt*6}else if(near&&adx<300&&(m.dcd=(m.dcd||rnd(1,3))-dt)<=0){m.dive=.7;m.dcd=rnd(2.5,4)}}if(near)m.dir=Math.sign(dx)||1;else if(m.tm<=0){m.dir*=-1;m.tm=rnd(2,4)}
  if(!(m.dive>0))m.vx+=(m.dir*sp-m.vx)*dt*2;m.vy+=((ty-m.y)*(m.dive>0?6:2)-m.vy)*dt*3;m.x=clamp(m.x+m.vx*dt,z.x0+20,z.x1-20);m.y=clamp(m.y+m.vy*dt,120,FLOOR-10)}
 else if(m.ai==='mimic'){if(m.st==='reveal'){m.sT-=dt;m.vx=0;m.dir=Math.sign(dx)||1;if(m.sT<=0){m.st='lunge';m.sT=.5;m.vx=m.dir*560;m.vy=-260}}
  else if(m.st==='lunge'){m.sT-=dt;if(m.sT<=0){m.ai='golem';m.st='idle';m.tm=.8}}
  else{m.st='disguise';m.vx=0;if(P.deadT<=0&&adx<150&&Math.abs(P.y-m.y)<130){m.st='reveal';m.sT=.55;sfx('hurt')}}}
 else if(m.ai==='mirror')updMirror(m,dt,dx);
 else if(m.boss)updBoss(m,dt,dx,sp);
 if(!m.fly){m.vy+=GRAV*dt;moveBody(m,dt);if(m.x<z.x0+20||m.x>z.x1-20){m.x=clamp(m.x,z.x0+20,z.x1-20);m.dir*=-1;m.vx=-m.vx}}
 if(m.hitCd<=0&&P.deadT<=0&&m.st!=='disguise'&&m.st!=='reveal'&&over(rect(m),rect(P))){lastHurt=0;hurtP(m.atk,m.x);m.hitCd=.9*(m.af&&m.af.includes('hasty')?.7:1);if(lastHurt&&m.af&&m.af.includes('vamp'))m.hp=Math.min(m.mhp,m.hp+lastHurt*.15)}
}
function updBoss(m,dt,dx,sp){
 const rage=m.hp<m.mhp*.5?1.35:1;m.sT-=dt;
 if(m.type==='shadow')updShadow(m,dt);if(m.st==='idle'||m.st==='walk'){m.dir=Math.sign(dx)||1;m.vx=m.dir*sp*rage*.8;if(m.sT<=0){const r=Math.random();const z=ZONES[m.z];if(r<.4){m.st='prep';m.sT=.55;m.vx=0;m.tx=clamp(P.x,z.x0+70,z.x1-70)}else if(r<.75){m.st='wind';m.sT=.7;m.vx=0;m.cl=480*rage*.8}else{m.st='walk';m.sT=1.5}}}
 else if(m.st==='prep'){m.vx=0;if(m.sT<=0){m.st='leap';m.vy=-620;m.vx=clamp((m.tx-m.x)/.83,-560,560);m.sT=2}}
 else if(m.st==='wind'){m.vx=0;if(m.sT<=0){m.st='charge';m.sT=.8;m.vx=m.dir*480*rage}}
 else if(m.st==='charge'){if(m.sT<=0){m.st='walk';m.sT=1.2/rage}}
 else if(m.st==='leap'){if(m.onG&&m.vy===0&&m.sT<1.9){m.st='walk';m.sT=1.3/rage;m.slamT=.45;shake=.3;anim('shock',m.x,m.y+6,1.4,.45);
  [-1,1].forEach(s=>eproj.push({x:m.x,y:m.y-14,vx:s*360*rage,w:26,h:26,dmg:m.atk*.8,life:1.8}));if(Math.abs(P.x-m.x)<110&&Math.abs(P.y-m.y)<40)hurtP(m.atk*1.2,m.x)}}
}
function spawner(dt){
 ZONES.forEach((z,zi)=>{if(z.safe)return;z.st=(z.st||0)-dt;const n=mobs.filter(m=>m.z===zi&&!m.dead&&!m.boss).length;
  if(n<z.cap&&z.st<=0){let x,tries=0;do{x=rnd(z.x0+60,z.x1-60);tries++}while(Math.abs(x-P.x)<280&&tries<10);spawnMob(z.mobs[Math.floor(Math.random()*z.mobs.length)],zi,x);if(n<z.cap-2&&Math.random()<.5)spawnMob(z.mobs[Math.floor(Math.random()*z.mobs.length)],zi,clamp(x+rnd(-90,90),z.x0+40,z.x1-40));z.st=n<z.cap/2?.25:1}});
bossCd-=dt;const bz=ZONES.findIndex(z=>z.boss);if(bz>=0&&zoneAt(P.x)===bz&&bossCd<=0&&!mobs.some(m=>m.boss&&!m.dead)){const z=ZONES[bz],b=spawnMob(z.boss,bz,z.bx);b.y=FLOOR;bossCd=1e9;msg(MT[z.boss].wake,'#ff8a8a');sfx('boss');shake=.4}
}

/* ---------- input ---------- */
const KEYMAP={ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right',j:'atk',J:'atk',z:'atk',Z:'atk'};
const PRESS={' ':'jump',ArrowUp:'jump',w:'jump',W:'jump',k:'s1',K:'s1',x:'s1',X:'s1',l:'s2',L:'s2',c:'s2',C:'s2',i:'s3',I:'s3',v:'s3',V:'s3',q:'pot',Q:'pot',e:'eth',E:'eth',u:'s4',U:'s4',g:'equip',G:'equip',Shift:'s4',b:'bag',B:'bag',t:'stats',T:'stats',p:'shop',P:'shop',o:'quest',O:'quest',f:'talk',F:'talk',m:'map',M:'map',s:'talk',S:'talk',ArrowDown:'talk'};
function press(p){if(state!=='play'||DQ)return;if(p==='bag'){openBag();return}if(p==='equip'){openEquip();return}if(p==='stats'){openStats();return}if(p==='shop'){openShop();return}if(p==='quest'){openQuest();return}if(p==='map'){openMap();return}if(paused)return;if(p==='talk'){talk();return}
  if(p==='jump')jump();else if(p==='pot')usePot();else if(p==='eth')useEth();else if(p[0]==='s')cast(+p[1])}
addEventListener('keydown',e=>{if(e.target&&/^(INPUT|TEXTAREA)$/.test(e.target.tagName))return;{const k=e.key;if(k==='Shift'||'zxcvZXCV'.includes(k)&&k.length===1){if(!SET.ks){SET.ks=1;saveSet()}}else if(k.length===1&&'jklJKLiIuU'.includes(k)&&SET.ks){SET.ks=0;saveSet()}}if(DQ){if(e.key===' '||e.key==='Enter'||e.key==='f'||e.key==='F'){nextLine();e.preventDefault()}else if(e.key==='Escape')$('dlgS').click();return}if(KEYMAP[e.key]){K[KEYMAP[e.key]]=1;e.preventDefault()}else if(PRESS[e.key]&&!e.repeat){press(PRESS[e.key]);e.preventDefault()}else if(e.key==='Escape')closeAll()});
addEventListener('keyup',e=>{if(e.target&&/^(INPUT|TEXTAREA)$/.test(e.target.tagName))return;if(KEYMAP[e.key])K[KEYMAP[e.key]]=0});
addEventListener('blur',()=>{K.left=K.right=K.atk=0;JOY.x=JOY.y=0});
document.querySelectorAll('.tb').forEach(b=>{
 const on=e=>{e.preventDefault();b.classList.add('down');try{b.setPointerCapture(e.pointerId)}catch(_){}if(b.dataset.k)K[b.dataset.k]=1;else press(b.dataset.p)};
 const off=()=>{b.classList.remove('down');if(b.dataset.k)K[b.dataset.k]=0};
 b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointercancel',off);b.addEventListener('lostpointercapture',off)});
const JOY={x:0,y:0,id:null,up:0,dn:0};
(()=>{const z=$('jzone'),j=$('joy'),k=$('knob'),R=36;
 const rest=()=>{j.style.left=(JOY.lh?innerWidth-118:22)+'px';j.style.top='';j.style.bottom='18px';k.style.transform='';j.classList.remove('down')};
 const mv=e=>{let dx=e.clientX-JOY.cx,dy=e.clientY-JOY.cy;const d=Math.hypot(dx,dy);if(d>R){dx*=R/d;dy*=R/d}
  JOY.x=dx/R;JOY.y=dy/R;k.style.transform='translate('+dx.toFixed(1)+'px,'+dy.toFixed(1)+'px)';
  const up=JOY.y<-.72&&Math.abs(JOY.x)<.7;if(up&&!JOY.up)press('jump');JOY.up=up;const dn=JOY.y>.72&&Math.abs(JOY.x)<.7;if(dn&&!JOY.dn)press('talk');JOY.dn=dn};
 const end=e=>{if(e.pointerId!==JOY.id)return;JOY.id=null;JOY.x=JOY.y=0;JOY.up=JOY.dn=0;rest()};
 z.addEventListener('pointerdown',e=>{e.preventDefault();if(JOY.id!==null)return;JOY.id=e.pointerId;try{z.setPointerCapture(e.pointerId)}catch(_){}
  JOY.cx=e.clientX;JOY.cy=e.clientY;j.style.left=(e.clientX-48)+'px';j.style.top=(e.clientY-48)+'px';j.style.bottom='auto';j.classList.add('down');k.style.transform=''});
 JOY.rest=rest;z.addEventListener('pointermove',e=>{if(e.pointerId===JOY.id)mv(e)});['pointerup','pointercancel','lostpointercapture'].forEach(t=>z.addEventListener(t,end))})();

/* ---------- 18. player experience pass ---------- */
/* HUD panel v2: hud_frame 178x66 in its own overlay canvas at a whole number of device pixels per art pixel (hud_layout.json) */
const HB={p:null,hp:0,tr:0,sp:0,ex:0,t:0,hold:0},HPC={},HUDL={w:380,h:132};
function hudHead(){const k=lookKey(spk()+'_idle');if(HPC[k])return HPC[k];const im=IMG[k],m=MAN[k],c=document.createElement('canvas');c.width=34;c.height=31;if(!im||!m)return c;
 const t=document.createElement('canvas');t.width=m.fw;t.height=m.fh;const tg=t.getContext('2d');tg.drawImage(im,0,0,m.fw,m.fh,0,0,m.fw,m.fh);let y0=m.fh,y1=0,sx=0,sn=0;
 try{const d=tg.getImageData(0,0,m.fw,m.fh).data;for(let y=0;y<m.fh;y++)for(let x=0;x<m.fw;x++)if(d[(y*m.fw+x)*4+3]>40){if(y<y0)y0=y;if(y>y1)y1=y}
  const lim=y0+(y1-y0)*.3;for(let y=y0;y<lim;y++)for(let x=0;x<m.fw;x++)if(d[(y*m.fw+x)*4+3]>40){sx+=x;sn++}}catch(e){y0=0;y1=m.fh}
 const pre=k.split('_')[0],HO={mage:[.5,.16],scholar:[.5,.14],prof:[.5,.2]}[pre]||[.46,-.03],h=y1-y0,Sw=h*HO[0],Sh=Sw*31/34,cx=sn?sx/sn:m.fw/2,g=c.getContext('2d');g.imageSmoothingEnabled=false;
 /* nearest-neighbour downscale, sampled once: each output pixel takes the source pixel at its centre */
 try{const src=tg.getImageData(0,0,m.fw,m.fh).data,out=g.createImageData(34,31);for(let y=0;y<31;y++)for(let x=0;x<34;x++){const sxp=Math.floor(cx-Sw/2+(x+.5)*Sw/34),syp=Math.floor(y0+h*HO[1]+(y+.5)*Sh/31),o=(y*34+x)*4;if(sxp<0||syp<0||sxp>=m.fw||syp>=m.fh)continue;const q=(syp*m.fw+sxp)*4;out.data[o]=src[q];out.data[o+1]=src[q+1];out.data[o+2]=src[q+2];out.data[o+3]=src[q+3]}g.putImageData(out,0,0)}catch(e){}
 return HPC[k]=c}
function hbar(g,x,y,w,h,f,tr,col,lab,num){f=clamp(f,0,1);tr=clamp(tr,0,1);g.fillStyle='#0d0a1a';g.fillRect(x,y,w,h);
 if(tr>f){g.fillStyle='#ffe3e8';g.fillRect(x+Math.round(w*f),y,Math.round(w*(tr-f)),h)}
 const fw=Math.round(w*f);if(fw>0){g.fillStyle=col;g.fillRect(x,y,fw,h);g.fillStyle='#ffffff55';g.fillRect(x,y,fw,1);g.fillStyle='#ffffffcc';g.fillRect(x+fw-1,y,1,h)}
 if(lab){const fs=h>=7?6:5;g.font='700 '+fs+'px "Starbell","StarbellNum",monospace';g.lineWidth=1.6;g.lineJoin='round';g.strokeStyle='#120e24';g.textAlign='left';const by=y+h-1;g.strokeText(lab,x+2,by);g.fillStyle='#fff';g.fillText(lab,x+2,by);
  if(num){g.textAlign='right';g.strokeText(num,x+w-2,by);g.fillText(num,x+w-2,by)}g.textAlign='left'}}
function hudPanel(){const hc=$('hudCv');if(!hc)return;const r=cv.getBoundingClientRect(),fsc=r.width/W,dpr=window.devicePixelRatio||1,kd=Math.max(1,Math.round(2*fsc*dpr));
 if(hc.width!==178*kd){hc.width=178*kd;hc.height=66*kd}hc.style.width=(178*kd/dpr)+'px';hc.style.height=(66*kd/dpr)+'px';hc.style.left=Math.round(r.left+8*fsc)+'px';hc.style.top=Math.round(r.top+8*fsc)+'px';hc.style.display='block';
 HUDL.w=178*kd/dpr/fsc;HUDL.h=66*kd/dpr/fsc;
 const g=hc.getContext('2d');g.setTransform(kd,0,0,kd,0,0);g.imageSmoothingEnabled=false;g.clearRect(0,0,178,66);
 const fk=P.thesis&&IMG.hud_frame_thesis?'hud_frame_thesis':'hud_frame',fi=IMG[fk];
 const dt=clamp(T-HB.t,0,.1);HB.t=T;const hp=clamp(P.hp/S.mhp,0,1),sp=clamp(P.sp/S.msp,0,1),ex=P.lv>=LVCAP?1:clamp(P.exp/need(P.lv),0,1);
 if(HB.p!==P){HB.p=P;HB.hp=HB.tr=hp;HB.sp=sp;HB.ex=ex}
 if(hp<HB.hp-.001&&HB.tr<=HB.hp+.001)HB.hold=.35;HB.hp+=(hp-HB.hp)*Math.min(1,dt*12);HB.sp+=(sp-HB.sp)*Math.min(1,dt*12);HB.ex+=(ex-HB.ex)*Math.min(1,dt*8);
 if(HB.tr<HB.hp)HB.tr=HB.hp;else{HB.hold-=dt;if(HB.hold<=0)HB.tr=Math.max(HB.hp,HB.tr-dt*.9)}
 if(fi)g.drawImage(fi,0,0);
 g.save();g.beginPath();g.arc(24.5,32.5,18,0,7);g.clip();g.drawImage(hudHead(),8,16);g.restore();
 hbar(g,52,30,116,7,HB.hp,HB.tr,'#e0485e','HP',Math.ceil(P.hp)+' / '+S.mhp);hbar(g,52,40,116,7,HB.sp,0,'#4f8ff0','SP',Math.floor(P.sp)+' / '+S.msp);hbar(g,52,50,116,5,HB.ex,0,'#6ad08a','EXP',(ex*100).toFixed(1)+'%');
 g.textAlign='left';g.font='700 10px "Starbell","StarbellNum",monospace';{const ws=pname().split(' ');const nw=ws.reduce((a,w)=>a+g.measureText(w).width,0)+(ws.length-1)*4,sc=Math.min(1,116/nw);g.fillStyle='#28214c';g.fillRect(50,8,Math.round(nw*sc)+4,6);g.lineWidth=2;g.lineJoin='round';g.strokeStyle='#120e24';let nx=52;for(const w of ws){const ww=g.measureText(w).width*sc;g.strokeText(w,nx,13,ww);g.fillStyle='#f6ecd2';g.fillText(w,nx,13,ww);nx+=ww+4*sc}}
 g.font='600 7px "Starbell","StarbellNum",monospace';g.fillStyle='#f2c14e';g.fillText(title()+' · Lv '+P.lv,52,24,116)}
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const FN=['Pip','Mira','Tobin','Juno','Ada','Rook','Wren','Lark','Nell','Ivo','Theo','Bree','Cass','Oren','Fern','Hugo','Lumi','Sable','Kit','Remy','Elsa','Rafi'];
const LN=['Ashwick','Quill','Starling','Brightbell','Inkwell','Hollow','Moss','Thistle','Larkspur','Gale','Ember','Frost','Vale','Penrose','Bramble','Crisp','Dunmore','Fable'];
const randName=()=>{for(let k=0;k<40;k++){const n=FN[Math.random()*FN.length|0]+' '+LN[Math.random()*LN.length|0];if(n.length<=12)return n}return 'Mira Quill'};
const HAIRC=[null,'#2a2430','#7a3e1d','#f0cf6a','#d8dce6','#ff8fc0','#3fc1b5','#8a5ad6'],HAIRN=['Default','Black','Chestnut','Blonde','Silver','Pink','Teal','Violet'];
const ACCC=[null,'#c0283a','#2f4fc8','#2f7a3a','#e0b030','#7a2f6a','#1f8f8a','#3a3a44'],ACCN=['Default','Crimson','Royal blue','Forest green','Gold','Plum','Teal','Charcoal'];
const nameOk=n=>n.length>=2&&n.length<=12&&/^[\p{L}\p{N}]+( [\p{L}\p{N}]+)*$/u.test(n);
const pname=()=>P&&P.name||'Student',pfirst=()=>pname().split(' ')[0],plast=()=>{const w=pname().split(' ');return w[w.length-1]};
/* hair/accent recolour: per-outfit colour windows (hue degrees, sat/val 0-1, top/bot = fraction of the frame's height) */
const RED=[[328,360],[0,12]],LOOKCFG={fresh:{h:{v1:.34,top:.36},a:{h:[[185,240]],s0:.1,v0:.2}},blade:{h:{h:[[185,290]],s1:.5,v0:.45,top:.34},a:{h:RED,s0:.45}},knight:{h:{h:[[185,290]],s1:.5,v0:.45,top:.3},a:{h:RED,s0:.45}},warden:{h:{h:[[185,300]],s1:.55,v0:.45,top:.3},a:{h:RED,s0:.45}},
 archer:{h:{h:[[55,160]],s0:.2,top:.3},a:{h:[[55,170]],s0:.2,bot:.3}},ranger:{h:{h:[[38,62]],s0:.4,v0:.5,top:.35},a:{h:[[70,170]],s0:.2}},laureate:{h:{h:[[55,160]],s0:.2,top:.28},a:{h:[[55,170]],s0:.2,bot:.28}},
 mage:{h:{h:[[8,45]],s0:.35,v0:.6},a:{h:[[195,255]],s0:.25}}};LOOKCFG.scholar=LOOKCFG.prof=LOOKCFG.mage;
function rgb2hsv(r,g,b){const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;let h=0;if(d){if(mx===r)h=((g-b)/d)%6;else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60;if(h<0)h+=360}return [h,mx?d/mx:0,mx]}
function hsv2rgb(h,s,v){const c=v*s,x=c*(1-Math.abs((h/60)%2-1)),m=v-c,t=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];return [t[0]+m,t[1]+m,t[2]+m]}
const inR=(h,R)=>R.some(([a,b])=>h>=a&&h<=b);
const selL=(c,h,s,v,ry)=>!!c&&(!c.h||inR(h,c.h))&&s>=(c.s0||0)&&s<=(c.s1??1)&&v>=(c.v0??.08)&&v<=(c.v1??1)&&(c.top==null||ry<=c.top)&&(c.bot==null||ry>=c.bot);
function framePass(im,m,f){const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d');g.drawImage(im,0,0);const id=g.getImageData(0,0,c.width,c.height);const n=m.n||1,fw=m.fw||c.width;
 const spans=[];for(let q=0;q<n;q++){let y0=c.height,y1=0;for(let y=0;y<c.height;y++){for(let x=q*fw;x<(q+1)*fw;x++)if(id.data[(y*c.width+x)*4+3]>40){if(y<y0)y0=y;if(y>y1)y1=y;break}}spans.push([y0,Math.max(1,y1-y0)])}
 return {c,g,id,fw,n,spans}}
const LSTAT={};function lookStat(pre){if(LSTAT[pre])return LSTAT[pre];const k=pre+'_idle',im=IMG[k],m=MAN[k],cfg=LOOKCFG[pre],st={hs:.5,hv:.5,as:.5,av:.5};if(!im||!m)return st;
 try{const F=framePass(im,m),p=F.id.data,W2=F.c.width,[y0,hh]=F.spans[0];let a=[0,0,0],b=[0,0,0];for(let y=y0;y<=y0+hh;y++)for(let x=0;x<F.fw;x++){const i=(y*W2+x)*4;if(p[i+3]<20)continue;const [h,s,v]=rgb2hsv(p[i]/255,p[i+1]/255,p[i+2]/255),ry=(y-y0)/hh;if(selL(cfg.h,h,s,v,ry)){a[0]+=s;a[1]+=v;a[2]++}else if(selL(cfg.a,h,s,v,ry)){b[0]+=s;b[1]+=v;b[2]++}}
  if(a[2]){st.hs=a[0]/a[2];st.hv=a[1]/a[2]}if(b[2]){st.as=b[0]/b[2];st.av=b[1]/b[2]}}catch(e){}return LSTAT[pre]=st}
const hexHSV=h=>{const v=parseInt(h.slice(1),16);return rgb2hsv((v>>16&255)/255,(v>>8&255)/255,(v&255)/255)};
function lookKey(k,L){L=L||(P&&P.look);if(!L||!(L.hair||L.accent))return k;const pre=k.split('_')[0],cfg=LOOKCFG[pre];if(!cfg)return k;const key=k+'@'+(L.hair|0)+'.'+(L.accent|0);if(IMG[key])return key;const im=IMG[k],m=MAN[k];if(!im||!m||!m.n)return k;
 try{const st=lookStat(pre),F=framePass(im,m),p=F.id.data,W2=F.c.width,TH=L.hair?hexHSV(HAIRC[L.hair]):null,TA=L.accent?hexHSV(ACCC[L.accent]):null;
  for(let q=0;q<F.n;q++){const [y0,hh]=F.spans[q];for(let y=y0;y<=y0+hh&&y<F.c.height;y++){const ry=(y-y0)/hh;for(let x=q*F.fw;x<(q+1)*F.fw;x++){const i=(y*W2+x)*4;if(p[i+3]<20)continue;const [h,s,v]=rgb2hsv(p[i]/255,p[i+1]/255,p[i+2]/255);let T2=null,ms,mv;
   if(TH&&selL(cfg.h,h,s,v,ry)){T2=TH;ms=st.hs;mv=st.hv}else if(TA&&!selL(cfg.h,h,s,v,ry)&&selL(cfg.a,h,s,v,ry)){T2=TA;ms=st.as;mv=st.av}if(!T2)continue;
   const o=hsv2rgb(T2[0],Math.min(1,s*T2[1]/Math.max(.05,ms)),Math.min(1,v*T2[2]/Math.max(.05,mv)));p[i]=o[0]*255;p[i+1]=o[1]*255;p[i+2]=o[2]*255}}}
  F.g.putImageData(F.id,0,0);IMG[key]=F.c;MAN[key]=m;return key}catch(e){return k}}
/* Student ID card */
const ID={mode:'',look:{hair:0,accent:0},pre:'fresh'};
function drawIdPrev(){const c=$('idPrev'),g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);const k=lookKey(ID.pre+'_idle',ID.look),m=MAN[k],im=IMG[k];if(!im||!m)return;const s=Math.min(110/m.fw,140/m.fh);g.imageSmoothingEnabled=false;g.drawImage(im,0,0,m.fw,m.fh,(c.width-m.fw*s)/2,c.height-6-m.fh*s,m.fw*s,m.fh*s)}
function renderIdSw(){const mk=(arr,names,cur,attr)=>arr.map((c,i)=>'<button class="sw'+(c?'':' def')+(i===cur?' on':'')+'" '+attr+'="'+i+'" title="'+names[i]+'" aria-label="'+names[i]+'"'+(c?' style="background:'+c+'"':'')+'></button>').join('');
 $('idHair').innerHTML=mk(HAIRC,HAIRN,ID.look.hair,'data-h');$('idAcc').innerHTML=mk(ACCC,ACCN,ID.look.accent,'data-a');
 $('idHair').querySelectorAll('[data-h]').forEach(b=>b.onclick=()=>{ID.look.hair=+b.dataset.h;renderIdSw()});$('idAcc').querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{ID.look.accent=+b.dataset.a;renderIdSw()});drawIdPrev()}
function openID(mode){ID.mode=mode;const ex=mode!=='new'&&P;ID.look={hair:ex&&P.look?P.look.hair|0:0,accent:ex&&P.look?P.look.accent|0:0};ID.pre=ex?spk():'fresh';if(!LOOKCFG[ID.pre])ID.pre='fresh';
 const nm=mode!=='look',lk=mode!=='rename';$('idNameBox').hidden=!nm;$('idLook').hidden=!lk;$('idCancel').hidden=mode==='new'||mode==='old';
 $('idT').textContent=mode==='look'?'Appearance':mode==='rename'?'Rename your student':'Student ID card';
 $('idName').value=mode==='rename'?pname():mode==='old'||mode==='new'?randName():'';$('idMsg').textContent='2–12 letters or numbers, single spaces allowed.';
 const cost=mode==='rename'&&(P.renames||0)>0?10000:0;$('idCost').textContent=mode==='rename'?(cost?'Costs 10,000 gold (you have '+P.gold.toLocaleString('en')+')':'Your first rename is free'):mode==='old'?'New: name your student. Colours can be changed later in Settings.':'';
 renderIdSw();if(state==='play')paused=true;$('mId').classList.add('on');if(nm)setTimeout(()=>{try{$('idName').focus();$('idName').select()}catch(e){}},50)}
$('idDice').onclick=()=>{$('idName').value=randName();$('idMsg').textContent='2–12 letters or numbers, single spaces allowed.'};
$('idCancel').onclick=()=>{$('mId').classList.remove('on');if(state==='play')paused=false};
$('idName').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();$('idOk').click()}});
$('idOk').onclick=()=>{const mode=ID.mode;let n=$('idName').value.trim().replace(/\s+/g,' ');
 if(mode!=='look'&&!nameOk(n)){$('idMsg').textContent=n.length<2?'Please enter at least 2 characters.':n.length>12?'12 characters at most.':'Use letters, numbers and single spaces only.';$('idName').focus();return}
 if(mode==='rename'){if(n===P.name){$('mId').classList.remove('on');paused=false;return}const cost=(P.renames||0)>0?10000:0;if(P.gold<cost){$('idMsg').textContent='You need 10,000 gold to rename again.';return}P.gold-=cost;P.renames=(P.renames||0)+1;P.name=n;msg('You are now '+n+(cost?' (−10,000 gold)':'')+'.','#7dff9a')}
 else if(mode==='look'){P.look={...ID.look};msg('Appearance updated.','#7dff9a')}
 $('mId').classList.remove('on');
 if(mode==='new'){const p=newPlayer('fresh');p.name=n;p.look={...ID.look};p.hintOn=1;p.renames=0;startGame(p);save();return}
 if(mode==='old'){P.name=n;P.look={...ID.look};P.renames=0;msg('Welcome back, '+pfirst()+'!','#ffd23f')}
 paused=false;save()};
/* Tutorial hints */
let HEV={},hintT=0,curHint=null;
const HINTS=[{id:'move',t:'Move with ◀ ▶ (A/D). Jump with Jump (W/Space).',w:()=>true,d:()=>P.hx0!=null&&Math.abs(P.x-P.hx0)>80},
 {id:'atk',t:'Hold Attack to keep swinging.',w:()=>mobs.some(m=>!m.dead&&m.x>cam+20&&m.x<cam+W-20),d:()=>HEV.atk},
 {id:'skill',t:'Skills hit harder but need a cooldown and SP.',w:()=>!!(P.hints.atk&&(P.mlog&&Object.keys(P.mlog).length||P.lv>=2)),d:()=>HEV.skill},
 {id:'stats',t:'You have stat points! Open Stats to spend them.',w:()=>P.pts>0,d:()=>HEV.stats},
 {id:'talk',t:'Tap Talk (F / ↓) to chat.',w:()=>!!nearObj&&!['warp','exit','texit'].includes(nearObj.k),d:()=>HEV.talk},
 {id:'pot',t:'Drink a potion, or turn on auto-potion in the Bag.',w:()=>P.deadT<=0&&P.hp<S.mhp*.4,d:()=>HEV.pot||HEV.bag},
 {id:'quest',t:'Quest complete! Claim it in Quests.',w:()=>qReady(),d:()=>HEV.quest},
 {id:'course',t:'Choose your course with the Course button.',w:()=>P.cls==='fresh'&&P.lv>=10,d:()=>P.cls!=='fresh'||HEV.course},
 {id:'skpt',t:'Skill points: open Stats → Skills to power up skills and passives.',w:()=>skFree()>0,d:()=>HEV.stats}];
function showHint(h){curHint=h;const e=$('hint');try{const r=cv.getBoundingClientRect();e.style.left=(r.left+r.width*.7)+'px';e.style.top=(r.top+r.height*.22)+'px'}catch(_){}e.innerHTML=esc(h.t)+'<small>tap to dismiss</small>';e.style.display='block'}
function hideHint(){curHint=null;const e=$('hint');if(e)e.style.display='none'}
$('hint').onclick=()=>{if(curHint&&P){P.hints[curHint.id]=1;save()}hideHint()};
function hintTick(dt){if(!P||!P.hintOn||DQ)return;hintT-=dt;if(hintT>0)return;hintT=.25;P.hints=P.hints||{};
 if(curHint){if(curHint.d()){P.hints[curHint.id]=1;hideHint();hintT=1.2}return}
 for(const h of HINTS){if(P.hints[h.id])continue;let w=false;try{w=h.w()}catch(e){}if(!w)continue;let d=false;try{d=h.d()}catch(e){}if(d){P.hints[h.id]=1;continue}showHint(h);break}}
/* Attendance card */
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const attReady=()=>!!P&&(P.att||{}).last!==today();
function attReward(s){const r=['5 potions','3 ethers'];if(s%5===0)r.push('5 Star Shards');if(s===10)r.push((300*P.lv).toLocaleString('en')+' gold');if(s===20)r.push('10 Star Shards',(500*P.lv).toLocaleString('en')+' gold');if(s===30)r.push('25 Star Shards',((P.att||{}).cards?'':'title «Perfect Attendance»'));return r.filter(Boolean)}
function claimAtt(){if(!attReady())return;const a=P.att=P.att||{n:0,total:0,cards:0};if(a.n>=30)a.n=0;a.n++;a.total=(a.total||0)+1;a.last=today();const s=a.n,r=attReward(s);
 P.pots+=5;P.eths=(P.eths||0)+3;if(s%5===0)P.shards=(P.shards||0)+5;if(s===10)P.gold+=300*P.lv;if(s===20){P.shards=(P.shards||0)+10;P.gold+=500*P.lv}if(s===30){P.shards=(P.shards||0)+25;a.cards=(a.cards||0)+1}
 sfx('chest');msg('Attendance stamp '+s+'/30: '+r.join(', '),'#7dff9a');achCheck();save();openAtt()}
function openAtt(){const a=P.att||{n:0,total:0},rd=attReady(),cur=rd&&a.n>=30?0:a.n||0,nx=cur+1;
 const cells=Array.from({length:30},(_,i)=>{const s=i+1,big=s%5===0;return '<i class="'+(s<=cur?'on':'')+(big?' big':'')+'" title="Stamp '+s+'">'+(s<=cur?'★':s)+'</i>'}).join('');
 openInfo('Attendance card · '+cur+'/30','<p class="muted">One stamp per day you play (your device\'s date). Missing a day never resets the card. Lifetime stamps: '+(a.total||0)+'.</p><div class="att">'+cells+'</div>'+
  '<p><b>Every day:</b> 5 potions + 3 ethers · <b>every 5th:</b> 5 Star Shards · <b>10th:</b> 300 × level gold · <b>20th:</b> 10 Star Shards + 500 × level gold · <b>30th:</b> 25 Star Shards'+((a.cards||0)?'':' + title «Perfect Attendance»')+'</p>'+
  (rd?'<div class="row"><span>Today: stamp '+nx+' · '+attReward(nx).join(', ')+'</span><button class="btn alt" id="attGo">Claim stamp</button></div>':'<p class="muted">Today\'s stamp is claimed. Come back tomorrow!</p>'));
 const b=$('attGo');if(b)b.onclick=claimAtt}
$('bAtt').onclick=()=>{closeAll();openAtt()};$('bAtt2').onclick=()=>{closeAll();openAtt()};
/* Mobile control settings (per device) */
function applyControls(){const sz=(SET.bsz||100)/100,op=(SET.bop||100)/100,lh=!!SET.lh;
 document.querySelectorAll('#touch .tb').forEach(b=>{if(!b.dataset.o)b.dataset.o=JSON.stringify({l:b.style.left,r:b.style.right,b:b.style.bottom});const o=JSON.parse(b.dataset.o),side=o.l?'l':'r',v=parseFloat(o.l||o.r)||0,bt=parseFloat(o.b)||0,s2=lh?(side==='l'?'r':'l'):side;
  b.style.left=s2==='l'?Math.round(v*sz)+'px':'';b.style.right=s2==='r'?Math.round(v*sz)+'px':'';b.style.bottom=Math.round(bt*sz)+'px';b.style.transformOrigin=(s2==='l'?'left':'right')+' bottom';b.style.transform=sz===1?'':'scale('+sz+')';b.style.opacity=op});
 const z=$('jzone');z.style.left=lh?'auto':'0';z.style.right=lh?'0':'auto';JOY.lh=lh;if(JOY.rest&&JOY.id==null)JOY.rest()}
applyControls();addEventListener('resize',()=>{if(SET.lh)applyControls()});

/* ---------- Equipment screen (equip_window 344x184, positions from equip_layout.json) ---------- */
const EQL={weapon:{card:[14,48,132,58],box:[20,57,40],tx:66},charm:{card:[198,48,132,58],box:[284,57,40],tx:204}};let EQZ=2;
function tcol(t){const c=TIERC[t]||'#c9c2dc',v=parseInt(c.slice(1),16),r=v>>16&255,g=v>>8&255,b=v&255,l=(.299*r+.587*g+.114*b)/255;if(l<.6)return c;const k=.5,m=(a,z)=>Math.round(a*(1-k)+z*k);return 'rgb('+m(r,58)+','+m(g,47)+','+m(b,90)+')'}
function openEquip(){paused=true;BF='all';const z=Math.max(1,Math.min(3,Math.floor(Math.min((innerWidth-16)/344,(innerHeight-12)/184))));EQZ=z;const c=$('eqCv');c.width=344*z;c.height=184*z;c.style.width=344*z+'px';c.style.height=184*z+'px';$('mEquip').classList.add('on');drawEq()}
function eqText(g,t,x,y,size,col,al,w,ol,mw){g.font=(w||'600')+' '+size+'px "Starbell","StarbellNum",monospace';g.textAlign=al||'left';if(ol){g.lineWidth=Math.max(1.5,size/4);g.strokeStyle='#1b1633';g.strokeText(t,x,y,mw)}g.fillStyle=col;g.fillText(t,x,y,mw)}
function drawEq(){if(!$('mEquip').classList.contains('on')||!P)return;requestAnimationFrame(drawEq);const c=$('eqCv'),g=c.getContext('2d'),now=performance.now()/1000;g.setTransform(EQZ,0,0,EQZ,0,0);g.imageSmoothingEnabled=false;g.clearRect(0,0,344,184);
 if(IMG.equip_window)g.drawImage(IMG.equip_window,0,0);
 eqText(g,'Equipment',172,17,11,'#f6ecd2','center','700',true);
 for(const sl of ['weapon','charm']){const L=EQL[sl],it=P[sl],[bx,by,bs]=L.box,cx=bx+bs/2,cy=by+bs/2;
  if(it){const gr=g.createRadialGradient(cx,cy,2,cx,cy,bs/2-3);gr.addColorStop(0,(TIERC[it.t]||'#fff')+'b0');gr.addColorStop(1,(TIERC[it.t]||'#fff')+'00');g.fillStyle=gr;g.fillRect(bx+4,by+4,bs-8,bs-8);
   const k=itemIcon(it),im=IMG[k],m=MAN[k];if(im&&m){const fw=m.fw||im.width,fh=m.fh||im.height,s=30/Math.max(fw,fh);g.drawImage(im,0,0,fw,fh,Math.round(cx-fw*s/2),Math.round(cy-fh*s/2),fw*s,fh*s)}
   if(it.up)eqText(g,'+'+it.up,bx+bs-3,by+11,8,'#fff','right','700',true)}
  else{g.fillStyle='#1b1633a0';g.fillRect(bx+4,by+4,bs-8,bs-8)}
  const tx=L.tx;eqText(g,sl==='weapon'?'WEAPON':'CHARM',tx,63,6,'#9a7436','left','700');
  if(it){eqText(g,it.name,tx,76,8,tcol(it.t),'left','700',false,76);eqText(g,sl==='weapon'?'ATK '+ua(it,'atk')+' · Tier '+it.t:'DEF '+ua(it,'def')+' · HP '+ua(it,'hp'),tx,90,7.5,'#4a3f6b','left','700',false,76)}
  else eqText(g,'Empty',tx,77,7.5,'#9a8a70','left','700')}
 {const k=lookKey(spk()+'_idle'),m=MAN[k],im=IMG[k];if(im&&m){const n=m.n||1,f=sqI(k,now*2.2,n),s=Math.min(1,80/m.fh/(m.ds||1))/(m.ds||1),q=SEQ[k.split(/[#@]/)[0]],bob=q&&q.bob?Math.round(q.bob/2*(.5-.5*Math.cos(now*6.2832/(q.per||1.6)))):0;
  const gu=P.weapon?(P.weapon.up||0):0,bk=spk()+'_idle';if(gu>=4)wGlow(g,bk,now*2.2,172,153-bob,s,false,gu,0,now);g.drawImage(im,f*m.fw,0,m.fw,m.fh,Math.round(172-m.ax*s),Math.round(153-m.ay*s-bob),m.fw*s,m.fh*s);if(gu>=4)wGlow(g,bk,now*2.2,172,153-bob,s,false,gu,1,now)}}
 if(P.pet&&PETS[P.pet]){const pd=PETS[P.pet],k=pd.key,m=MAN[k],im=IMG[k];if(im&&m){const n=m.n||1,f=sqI(k,now*6,n),ds=m.ds||1,s=pd.s/ds*.8,y=128+Math.round(Math.sin(now*2.4)*3);g.drawImage(im,f*m.fw,0,m.fw,m.fh,Math.round(210-m.fw*s/2),Math.round(y-m.fh*s/2),m.fw*s,m.fh*s)}}
 eqText(g,'Tap a card to change or upgrade',14,129,6.5,'#8a7350','left','600');
 const w=P.weapon,ch=P.charm;eqText(g,'Total: ATK '+(ua(w||{},'atk')+cAtk(ch))+' · DEF '+ua(ch||{},'def')+' · HP '+ua(ch||{},'hp'),330,129,7,'#5a4320','right','700')}
$('eqCv').addEventListener('click',e=>{const r=$('eqCv').getBoundingClientRect(),x=(e.clientX-r.left)/r.width*344,y=(e.clientY-r.top)/r.height*184;
 for(const sl of ['weapon','charm']){const [cx,cy,cw,ch]=EQL[sl].card;if(x>=cx&&x<=cx+cw&&y>=cy&&y<=cy+ch){closeAll();BF=sl;openBag();BF=sl;renderBag();return}}});
$('bEquip').onclick=()=>{if(state==='play'&&!DQ)openEquip()};$('bEq2').onclick=()=>{closeAll();openEquip()};

/* ---------- weapon-shaped upgrade glow (wm_<outfit>_<anim> masks: weapon pixels only, one per frame) ---------- */
const WG={};
function wgData(base){if(WG[base]!==undefined)return WG[base];const mk='wm_'+base,im=IMG[mk],m=MAN[mk];if(!im||!m)return WG[base]=null;
 const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d');g.drawImage(im,0,0);const pts=[];
 try{const d=g.getImageData(0,0,c.width,c.height).data;for(let f=0;f<m.n;f++){const L=[];for(let y=0;y<m.fh;y+=2)for(let x=f*m.fw;x<(f+1)*m.fw;x+=2)if(d[(y*c.width+x)*4+3]>128)L.push([x-f*m.fw,y]);pts.push(L)}}catch(e){}
 return WG[base]={im,m,pts,tint:{}}}
function wgTint(D,col){if(D.tint[col])return D.tint[col];const c=document.createElement('canvas');c.width=D.im.width;c.height=D.im.height;const g=c.getContext('2d');g.drawImage(D.im,0,0);g.globalCompositeOperation='source-in';g.fillStyle=col;g.fillRect(0,0,c.width,c.height);return D.tint[col]=c}
const WGS=document.createElement('canvas');
function wGlow(g,k,i,x,y,s,flip,up,over,tt){const base=k.split(/[#@]/)[0],D=wgData(base);if(!D)return;const m=D.m,f=sqI(base,i,m.n),L=D.pts[f];if(!L||!L.length)return;tt=tt==null?T:tt;
 const lv=up>=10?2:up>=7?1:0,col=['#9fd0ff','#ffd23f','#ff9ad8'][lv],str=[.6,.85,1][lv];
 g.save();g.translate(Math.round(x),Math.round(y)-(g===ctx?sqB(base)+0:0)+(g===ctx&&XF&&XF.dy||0));if(flip)g.scale(-1,1);if(XF&&g===ctx){if(XF.r)g.rotate(XF.r);if(XF.sx||XF.sy)g.scale(XF.sx||1,XF.sy||1)}
 const sx0=f*m.fw,ox=-m.ax*s,oy=-m.ay*s,w=m.fw*s,h=m.fh*s,d=g===ctx?2:1.5;
 if(!over){/* soft 1-2 px outline around the weapon, drawn under the sprite */const tc=wgTint(D,col);g.globalAlpha=str*(.8+.2*Math.sin(tt*4));g.globalCompositeOperation='source-over';
  for(const [dx,dy] of [[-d,0],[d,0],[0,-d],[0,d],[-d,-d],[d,d],[-d,d],[d,-d]])g.drawImage(tc,sx0,0,m.fw,m.fh,ox+dx,oy+dy,w,h)}
 else{/* shimmer band sliding along the weapon + sparkles on weapon pixels */WGS.width=m.fw;WGS.height=m.fh;const q=WGS.getContext('2d');q.clearRect(0,0,m.fw,m.fh);q.globalCompositeOperation='source-over';q.drawImage(wgTint(D,'#ffffff'),sx0,0,m.fw,m.fh,0,0,m.fw,m.fh);
  const ph=((tt*.55)%1.6)-.3,gr=q.createLinearGradient(0,m.fh,m.fw,0);gr.addColorStop(clamp(ph-.12,0,1),'rgba(255,255,255,0)');gr.addColorStop(clamp(ph,0,1),'rgba(255,255,255,1)');gr.addColorStop(clamp(ph+.12,0,1),'rgba(255,255,255,0)');
  q.globalCompositeOperation='destination-in';q.fillStyle=gr;q.fillRect(0,0,m.fw,m.fh);g.globalCompositeOperation='source-over';g.globalAlpha=.7*str;g.drawImage(WGS,0,0,m.fw,m.fh,ox,oy,w,h);
  g.globalAlpha=1;const nS=1+lv*2,seed=Math.floor(tt*5);for(let j=0;j<nS;j++){const p=L[(seed*7919+j*104729)%L.length],a=.5+.5*Math.sin(tt*9+j*2.1),px=ox+p[0]*s,py=oy+p[1]*s,r=(1.2+lv*.6)*a;g.fillStyle=col;g.fillRect(px-r,py-.5,r*2,1);g.fillRect(px-.5,py-r,1,r*2);g.fillStyle='#fff';g.fillRect(px-.5,py-.5,1,1)}}
 g.restore()}

/* ---------- panels ---------- */
function closeAll(){document.querySelectorAll('.modal:not(#mStart):not(#mId)').forEach(m=>m.classList.remove('on'));paused=false}
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeAll);document.querySelectorAll('.modal:not(#mStart):not(#mId)').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeAll()}));
$('bStats').onclick=openStats;$('bBag').onclick=openBag;$('bShop').onclick=openShop;$('bQuest').onclick=openQuest;$('bCourse').onclick=openCourse;$('bSet').onclick=()=>{if(state==='play')openSet()};
function openSet(){paused=true;renderSet();$('mSet').classList.add('on')}
function renderSet(){const L=[['nums','Damage numbers'],['shake','Screen shake'],['names','Monster names and levels'],['sfx','Sound effects'],['music','Music'],['qarrow','Quest arrow']];const RC=(P.renames||0)>0?'10,000 gold':'free the first time';
 $('setRows').innerHTML=L.map(([k,t])=>'<div class="row"><b>'+t+'</b><button class="btn'+(SET[k]?' alt':'')+'" data-set="'+k+'">'+(SET[k]?'On':'Off')+'</button></div>').join('')+
  '<div class="row"><div><b>Tutorial hints</b><br><span class="muted">Short tips for new players</span></div><button class="btn'+(P&&P.hintOn?' alt':'')+'" id="bHints">'+(P&&P.hintOn?'On':'Off')+'</button></div>'+'<div class="row"><div><b>Rename</b><br><span class="muted">'+esc(pname())+' · '+RC+'</span></div><button class="btn alt" id="bRen">Rename</button></div>'+'<div class="row"><div><b>Appearance</b><br><span class="muted">Hair and uniform colours · free</span></div><button class="btn alt" id="bLook">Change</button></div>'+(TOUCH?'<div class="row"><div><b>Controls</b><br><span class="muted">Button size, opacity and layout</span></div><span style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end"><button class="btn alt" id="bBsz">Size '+(SET.bsz||100)+'%</button><button class="btn alt" id="bBop">Opacity '+(SET.bop||100)+'%</button><button class="btn alt" id="bLh">'+(SET.lh?'Left-handed':'Right-handed')+'</button><button class="btn" id="bCtlR">Reset</button></span></div>':'')+'<div class="row"><div><b>Playtest report</b><br><span class="muted">Copy a short code to send to Mario</span></div><button class="btn alt" id="bRep">Report</button></div><div class="row"><div><b>Save code</b><br><span class="muted">Back up or move this character</span></div><button class="btn alt" id="bCode">Export / import</button></div><div class="row"><div><b>Loot filter</b><br><span class="muted">Auto-sells dropped gear below this tier</span></div><button class="btn alt" id="bLoot">'+(SET.loot?'Below '+TIER[SET.loot]:'Off')+'</button></div>';
 $('setRows').querySelectorAll('[data-set]').forEach(b=>b.onclick=()=>{const k=b.dataset.set;SET[k]=SET[k]?0:1;ac();saveSet();renderSet()});
 $('bLoot').onclick=()=>{SET.loot=(SET.loot+1)%8;saveSet();renderSet()};$('bHints').onclick=()=>{if(!P)return;P.hintOn=P.hintOn?0:1;if(!P.hintOn)hideHint();save();renderSet()};$('bRen').onclick=()=>{$('mSet').classList.remove('on');openID('rename')};$('bLook').onclick=()=>{$('mSet').classList.remove('on');openID('look')};
 if(TOUCH){const cyc=(v,a)=>a[(a.indexOf(v)+1)%a.length];$('bBsz').onclick=()=>{SET.bsz=cyc(SET.bsz||100,[80,100,120,140]);saveSet();applyControls();renderSet()};$('bBop').onclick=()=>{SET.bop=cyc(SET.bop||100,[30,45,60,75,90,100]);saveSet();applyControls();renderSet()};$('bLh').onclick=()=>{SET.lh=SET.lh?0:1;saveSet();applyControls();renderSet()};$('bCtlR').onclick=()=>{SET.bsz=100;SET.bop=100;SET.lh=0;saveSet();applyControls();renderSet()}}$('bCode').onclick=()=>{$('mSet').classList.remove('on');openCode('game')};$('bRep').onclick=()=>{$('mSet').classList.remove('on');openCode('report')}}
const encSave=o=>{const j=JSON.stringify(o);let h=0;for(let i=0;i<j.length;i++)h=(h*31+j.charCodeAt(i))|0;return 'SBA1.'+btoa(unescape(encodeURIComponent(j)))+'.'+(h>>>0).toString(36)};
function decSave(t){try{t=(t||'').replace(/\s+/g,'');const m=t.match(/^SBA1\.([A-Za-z0-9+/=]+)\.([a-z0-9]+)$/);if(!m)return null;const j=decodeURIComponent(escape(atob(m[1])));let h=0;for(let i=0;i<j.length;i++)h=(h*31+j.charCodeAt(i))|0;if((h>>>0).toString(36)!==m[2])return null;const o=JSON.parse(j);return o&&CL[o.cls]&&typeof o.lv==='number'?o:null}catch(e){return null}}
let codeMode='game',codeArm=0;
function openCode(mode){codeMode=mode;codeArm=0;document.querySelector('#mCode h2').textContent=mode==='report'?'Playtest report':'Save code';
 if(mode==='report'){save();paused=true;$('codeTxt').value=reportTxt();$('codeInfo').innerHTML=REPORT_INFO;$('codeMsg').textContent='';renderCodeBtns();$('mCode').classList.add('on');return}if(mode==='game'){save();paused=true;$('codeTxt').value=encSave((()=>{const o={...P};delete o.dashHit;return o})());$('codeInfo').textContent='This code is your whole character. Copy it somewhere safe to back up, move to another device, or send it with a bug report. To load a different character here, paste its code and press Load.'}
 else{$('codeTxt').value='';$('codeInfo').textContent='Paste a save code, then choose which slot to load it into.'}$('codeMsg').textContent='';renderCodeBtns();$('mCode').classList.add('on')}
function renderCodeBtns(){const b=$('codeBtns');if(codeMode==='report')b.innerHTML='<button class="btn alt" id="bCopy">Copy report</button>';else 
 if(codeMode==='game')b.innerHTML='<button class="btn alt" id="bCopy">Copy code</button><button class="btn" id="bLoadHere">'+(codeArm?'Tap again: replace this character':'Load pasted code')+'</button>';
 else b.innerHTML=[1,2,3].map(n=>{const v=loadSave(slotKey(n)),ok=v&&CL[v.cls];return '<button class="btn alt" data-cslot="'+n+'">'+(codeArm===n?'Tap again: replace Slot '+n:'Load into Slot '+n+(ok?' (Lv '+v.lv+')':' (empty)'))+'</button>'}).join('');
 const cp=$('bCopy');if(cp)cp.onclick=()=>{const t=$('codeTxt');t.focus();t.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}if(navigator.clipboard)navigator.clipboard.writeText(t.value).then(()=>{$('codeMsg').textContent='Copied!'}).catch(()=>{if(!ok)$('codeMsg').textContent='Select the text above and copy it manually.'});$('codeMsg').textContent=ok?'Copied!':'Copying…'};
 const lh=$('bLoadHere');if(lh)lh.onclick=()=>{const o=decSave($('codeTxt').value);if(!o){$('codeMsg').textContent='That code is not valid. Check that you copied all of it.';return}if(!codeArm){codeArm=1;renderCodeBtns();return}
  try{localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}$('mCode').classList.remove('on');closeAll();startGame(o);msg('Save code loaded: '+(o.adv&&ADV[o.cls]?ADV[o.cls].name:CL[o.cls].name)+' Lv '+o.lv,'#7dff9a')};
 b.querySelectorAll('[data-cslot]').forEach(x=>x.onclick=()=>{const n=+x.dataset.cslot,o=decSave($('codeTxt').value);if(!o){$('codeMsg').textContent='That code is not valid. Check that you copied all of it.';return}
  const v=loadSave(slotKey(n));if(v&&CL[v.cls]&&codeArm!==n){codeArm=n;renderCodeBtns();return}try{localStorage.setItem(slotKey(n),JSON.stringify(o))}catch(e){}$('mCode').classList.remove('on');codeArm=0;renderSlots()})}
$('bCodeClose').onclick=()=>{$('mCode').classList.remove('on');if(state==='play')paused=false};
$('bSwitch').onclick=()=>{save();closeAll();state='title';P=null;mobs.length=proj.length=eproj.length=loot.length=timers.length=0;loadMap(0);$('top').hidden=true;$('touch').classList.remove('on');$('mStart').classList.add('on');renderSlots()};$('bMap').onclick=()=>{if(state==='play')openMap()};
const tb=(k,t)=>'<img class="tico" src="'+isrc(k)+'" alt=""><span class="tl">'+t+'</span>';
function updBadge(){if(!P)return;{const bp=P.pts+Math.max(0,skFree());$('bStats').innerHTML=tb('ico_book','Stats')+(bp?'<span class="badge">'+bp+'</span>':'')}$('bSet').innerHTML=tb('ico_gear','Settings');$('bQuest').innerHTML=tb('ico_quest','Quests')+(qReady()?'<span class="badge">!</span>':'');$('bShop').innerHTML=tb('ico_bagsack','Shop');$('bBag').innerHTML=tb('ico_satchel','Bag');$('bEquip').innerHTML=tb('ico_saber','Equip');$('bMap').innerHTML=tb('ico_map','Map');$('bCourse').innerHTML=tb('ico_cap','Course')+'<span class="badge">!</span>';$('bCourse').hidden=!(P.cls==='fresh'&&P.lv>=10)}
let shopTab='buy',sellArm=0,shopMode='academy';
const PRICE=[0,1200,4000,9000,18000,24000,40000,70000,110000],REQ=[1,5,10,15,20,25,30,35,40];
function shopItems(){if(shopMode!=='academy'){const SH=MAPS[shopMode].shop,v=SH.bulk?[{k:'pot10',name:'Potion ×10',txt:'Ten potions, a little cheaper',cost:230,ico:'ico_potion'},{k:'eth10',name:'Ether ×10',txt:'Ten ethers, a little cheaper',cost:360,ico:'ico_ether'}]:[];if(SH.shard10)v.push({k:'shard10',name:'Star Shard ×10',txt:'Ten upgrade shards, a little cheaper',cost:1800,ico:'ico_shard'});
  for(const t of SH.tiers){v.push({k:'w'+t,name:TIER[t]+' '+WN[P.cls],txt:'ATK +'+(4+t*7)+' · needs Lv '+REQ[t],cost:PRICE[t],lv:REQ[t],ico:'ico_'+ICO_W[P.cls],t});v.push({k:'c'+t,name:TIER[t]+' Pendant',txt:'ATK +'+Math.round(2+t*3.5)+' · DEF +'+Math.round(1+t*2.2)+' · HP +'+(15+t*28)+' · needs Lv '+REQ[t],cost:PRICE[t],lv:REQ[t],ico:'ico_pendant',t})}return v}
 const o=[{k:'pot',name:'Potion',txt:'Restores 40% HP',cost:25,ico:'ico_potion'},{k:'eth',name:'Ether',txt:'Restores 50% SP',cost:40,ico:'ico_ether'},{k:'shard',name:'Star Shard',txt:'Upgrade material for gear (open your Bag)',cost:200,ico:'ico_shard'}];
 for(let t=1;t<=4;t++){o.push({k:'w'+t,name:TIER[t]+' '+WN[P.cls],txt:'ATK +'+(4+t*7)+' · needs Lv '+REQ[t],cost:PRICE[t],lv:REQ[t],ico:'ico_'+ICO_W[P.cls],t});o.push({k:'c'+t,name:TIER[t]+' Pendant',txt:'ATK +'+Math.round(2+t*3.5)+' · DEF +'+Math.round(1+t*2.2)+' · HP +'+(15+t*28)+' · needs Lv '+REQ[t],cost:PRICE[t],lv:REQ[t],ico:'ico_pendant',t})}
 return o}
function openShop(mode){shopMode=typeof mode==='number'&&MAPS[mode]&&MAPS[mode].shop?mode:'academy';paused=true;sellArm=0;shopTab='buy';const SH=shopMode!=='academy'?MAPS[shopMode].shop:null;$('shopTitle').textContent=SH?SH.name:'Academy Shop';$('shopNote').textContent=SH?SH.note:'Opens anywhere. Prices in gold.';renderShop();$('mShop').classList.add('on')}
$('tBuy').onclick=()=>{shopTab='buy';renderShop()};$('tSell').onclick=()=>{shopTab='sell';sellArm=0;renderShop()};
function renderShop(){$('tBuy').setAttribute('aria-pressed',shopTab==='buy');$('tSell').setAttribute('aria-pressed',shopTab==='sell');
 $('shopInfo').textContent=P.gold+' gold · '+P.pots+' potions · '+(P.eths||0)+' ethers · '+P.inv.length+'/'+BAG+' items';
 const img=(k,t,h)=>'<img class="ico" src="'+isrc(k)+'" alt="" style="'+(t!=null?'background:'+TIERC[t]+'55;':'')+(h?'filter:hue-rotate(200deg)':'')+'">';
 if(shopTab==='buy'){$('shopList').innerHTML=shopItems().map(it=>{const lock=it.lv&&P.lv<it.lv;return '<div class="row'+(lock?' lock':'')+'"><div style="display:flex;gap:10px;align-items:center">'+img(it.ico,it.t,it.hue)+'<div><b>'+itName(it)+'</b><br><span class="muted">'+it.txt+'</span></div></div><button class="btn alt" data-buy="'+it.k+'"'+(lock||P.gold<it.cost?' disabled':'')+'>'+it.cost+'g</button></div>'}).join('');
  $('shopList').querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>buy(b.dataset.buy))}
 else{const tot=P.inv.reduce((a,it)=>a+sellV(it),0);
  $('shopList').innerHTML=(P.inv.length?'<div class="row"><b>Sell everything in your satchel</b><button class="btn alt" id="sellAll">'+(sellArm?'Tap again: +'+tot+'g':'Sell all · '+tot+'g')+'</button></div>':'')+(P.inv.length?P.inv.map(it=>'<div class="row"><div style="display:flex;gap:10px;align-items:center">'+img(itemIcon(it),it.t)+'<div><b>'+itName(it)+'</b><br><span class="muted">'+itemTxt(it)+'</span></div></div><button class="btn" data-sell="'+it.id+'">Sell '+sellV(it)+'g</button></div>').join(''):'<p class="muted">Nothing to sell. Equipped gear is never listed here.</p>');
  $('shopList').querySelectorAll('[data-sell]').forEach(b=>b.onclick=()=>{const i=P.inv.findIndex(x=>x.id==b.dataset.sell);if(i<0)return;P.gold+=sellV(P.inv[i]);P.inv.splice(i,1);renderShop();save()});
  const sa=$('sellAll');if(sa)sa.onclick=()=>{if(!sellArm){sellArm=1;renderShop();return}P.gold+=tot;P.inv=[];sellArm=0;renderShop();save()}}}
function buy(k){const it=shopItems().find(x=>x.k===k);if(!it||P.gold<it.cost||(it.lv&&P.lv<it.lv))return;
 if(k[0]==='w'||k[0]==='c'){if(P.inv.length>=BAG){msg('Satchel full','#ffb0b0');return}const n=makeItem(it.t,k[0]==='w'?'weapon':'charm',1);if(k[0]==='c')n.name=TIER[it.t]+' Pendant';P.inv.push(n);msg('Bought '+n.name+'. Equip it from your Bag.','#ffd23f')}
else if(k==='pot')P.pots++;else if(k==='eth')P.eths=(P.eths||0)+1;else if(k==='pot10')P.pots+=10;else if(k==='shard10')P.shards=(P.shards||0)+10;else if(k==='shard')P.shards=(P.shards||0)+1;else if(k==='eth10')P.eths=(P.eths||0)+10;
 else if(k==='reset'){const b0=P.b0||CL[P.cls].base;let r=0;for(const s of ['str','dex','int','vit']){r+=Math.max(0,P[s]-b0[s]);P[s]=Math.min(P[s],b0[s])}if(!r){msg('No points to refund');return}P.pts+=r;msg('Refunded '+r+' stat points','#7dff9a');updBadge()}
 P.gold-=it.cost;S=stats();P.hp=Math.min(P.hp,S.mhp);renderShop();save()}
function openQuest(){HEV.quest=1;paused=true;renderQuest();$('mQuest').classList.add('on')}
function renderQuest(){const q=curQ(),[a,b]=qProg(),done=qReady();
 $('qBody').innerHTML='<p class="muted">Quest '+Math.min((P.q||0)+1,QUESTS.length)+' of '+QUESTS.length+(q.rep?' · repeatable':'')+'</p><h2 style="font-size:22px">'+q.t+'</h2><p>'+q.d+'</p><div class="qbar"><i style="width:'+(a/b*100)+'%"></i></div><p><b>'+a+' / '+b+'</b></p><p>Reward: '+rewardTxt(q.r)+'</p>'+
  (q.course&&P.cls==='fresh'&&P.lv>=10?'<p><button class="btn alt" id="qCourse">Choose course now</button></p>':'')+
  '<p><button class="btn alt" id="qClaim"'+(done?'':' disabled')+'>'+(done?'Claim reward':'Not done yet')+'</button></p>';
 $('qDone').textContent=(P.q||0)+' quests completed';$('qClaim').onclick=()=>{const q0=P.q,n0=P.inv.length;claimQ();renderQuest();if((P.q!==q0||curQ().rep)&&P.inv.length>BAG)$('qDone').textContent='Reward claimed! Your satchel is over its limit, so sell some gear soon.';else if(P.q!==q0)$('qDone').textContent='Reward claimed!'};const qc=$('qCourse');if(qc)qc.onclick=()=>{closeAll();openCourse()}}
function openCourse(){HEV.course=1;if(P.cls!=='fresh'){msg('You already chose a course');return}if(P.lv<10){msg('Courses open at Lv 10');return}paused=true;
 $('courseList').innerHTML=COURSES.map(k=>'<button class="cls" data-c="'+k+'"><canvas></canvas><b>'+CL[k].name+'</b><small>'+CL[k].desc+'</small></button>').join('');
 $('courseList').querySelectorAll('.cls').forEach(b=>{drawCard(b);b.onclick=()=>chooseCourse(b.dataset.c)});$('mCourse').classList.add('on')}
function chooseCourse(k){if(P.cls!=='fresh')return;P.cls=k;if(P.weapon&&P.weapon.cls!==k){if(P.inv.length<BAG)P.inv.push(P.weapon);P.weapon=null}{const w=makeItem(2,'weapon',1),c=makeItem(2,'charm',1);c.name=TIER[2]+' Pendant';w.name=TIER[2]+' '+WN[k];
   if(P.weapon&&P.inv.length<BAG)P.inv.push(P.weapon);if(P.charm&&(P.charm.t||0)<2&&P.inv.length<BAG)P.inv.push(P.charm);P.weapon=w;if(!P.charm||(P.charm.t||0)<2)P.charm=c;else if(P.inv.length<BAG)P.inv.push(c)}
  P.cds=[0,0,0,0,0];S=stats();P.hp=S.mhp;P.sp=S.msp;
  anim('lvl',P.x,P.y,1,1,{follow:1});msg('Welcome to the '+CL[k].name+' course! Two new skills unlocked.','#ffd23f');msg('Course kit equipped: '+TIER[2]+' '+WN[k]+' and '+TIER[2]+' Pendant (Lv 10 set)','#7dff9a');setupSkills();qCheck();updBadge();closeAll();save()}
function drawCard(b){const k=b.dataset.c+'_idle',m=MAN[k],cvs=b.querySelector('canvas');if(!IMG[k]||!m)return;cvs.width=m.fw;cvs.height=m.fh;cvs.getContext('2d').drawImage(IMG[k],0,0,m.fw,m.fh,0,0,m.fw,m.fh)}
const SD={str:'Melee power (Blade main stat)',dex:'Bow power, +crit chance (Archer main stat)',int:'Spell power, +max SP (Mage main stat)',vit:'Max HP and defence'};
const PIC={};function pasIcon(p){if(PIC[p.id])return PIC[p.id];if(ARTDATA['pas_'+p.id])return PIC[p.id]=ARTDATA['pas_'+p.id];const c=document.createElement('canvas');c.width=c.height=48;const g=c.getContext('2d'),col={blade:'#c8423a',archer:'#3f9b5a',mage:'#4a5fd1'}[PAS.el.includes(p)?'':P.cls]||'#b08a3a';
 g.fillStyle='#1b1633';g.fillRect(0,0,48,48);g.fillStyle=col;g.fillRect(4,4,40,40);g.strokeStyle='#f2c14e';g.lineWidth=3;g.strokeRect(4,4,40,40);g.fillStyle='#f6ecd2';g.font='bold 22px monospace';g.textAlign='center';g.textBaseline='middle';
 g.fillText(p.n.split(/[ ']/).filter(Boolean).map(w=>w[0]).join('').slice(0,2).toUpperCase(),24,26);return PIC[p.id]=c.toDataURL()}
function renderSkills(){const n=P.adv?5:4,f=skFree();P.skl=P.skl||[1,1,1,1,1];
 $('skPts').textContent=P.cls==='fresh'?'Skill points unlock when you choose a course at Lv 10.':f+' skill point'+(f===1?'':'s')+' to spend · you earn 1 per level from Lv 10 to '+LVCAP+'. Spend them on skills or passives below.';
 $('skRows').innerHTML=Array.from({length:n},(_,i)=>{const k=skC(i),lv=skLv(i),lock=P.cls==='fresh';
  return '<div class="row'+(lock?' lock':'')+'"><div style="display:flex;gap:10px;align-items:center">'+(IMG[skIcon(i)]?'<img class="ico" src="'+isrc(skIcon(i))+'" alt="">':'')+'<div><b>'+k.sk+' · Lv '+lv+'</b><br><span class="muted">Damage +'+Math.round((skMul(i)-1)*100)+'%'+(i?' · cooldown −'+Math.round((1-skCdr(i))*100)+'%':'')+'</span></div></div><button class="btn alt" data-sk="'+i+'"'+(f>0&&lv<10&&!lock?'':' disabled')+' aria-label="Raise '+k.sk+'">'+(lv>=10?'Max':'+1')+'</button></div>'}).join('');
 {const L=pasList();if(L.length)$('skRows').insertAdjacentHTML('beforeend','<h3 style="margin:14px 0 2px">Passives</h3><p class="muted" style="margin:0 0 4px">Always on. Max Lv 5 each. They share your skill points.</p>'+L.map(p=>{const l=pl(p.id),open=pasOpen(p);
  return '<div class="row'+(open?'':' lock')+'"><div style="display:flex;gap:10px;align-items:center"><img class="ico" src="'+pasIcon(p)+'" alt=""><div><b>'+p.n+' · Lv '+l+'/5</b><br><span class="muted">'+(open?(l?p.d(l):'Lv 1: '+p.d(1))+(l&&l<5?' · next: '+p.d(l+1):''):(p.req==='thesis'?'Unlocks after the Thesis':'Unlocks at Lv '+p.req)+' · '+p.d(1)+' per level')+'</span></div></div><button class="btn alt" data-pas="'+p.id+'"'+(open&&l<5&&f>0?'':' disabled')+' aria-label="Raise '+p.n+'">'+(l>=5?'Max':'+1')+'</button></div>'}).join(''));
 $('skRows').querySelectorAll('[data-pas]').forEach(b=>b.onclick=()=>{const id=b.dataset.pas,p=pasList().find(x=>x.id===id);if(!p||!pasOpen(p)||pl(id)>=5||skFree()<=0)return;P.pas=P.pas||{};P.pas[id]=pl(id)+1;S=stats();renderStats();updBadge();save()})}
 $('skRows').querySelectorAll('[data-sk]').forEach(b=>b.onclick=()=>{const i=+b.dataset.sk;if(skFree()<=0||skLv(i)>=10)return;P.skl[i]=skLv(i)+1;renderStats();updBadge();save()})}
function openStats(){HEV.stats=1;resArm='';paused=true;renderStats();$('mStats').classList.add('on')}
let resArm='';
function resetStats(){const b0=P.b0||CL[P.cls].base;let r=0;for(const k of ['str','dex','int','vit']){r+=Math.max(0,P[k]-b0[k]);P[k]=Math.min(P[k],b0[k])}if(!r){msg('No stat points to refund');return}P.pts+=r;S=stats();P.hp=Math.min(P.hp,S.mhp);P.sp=Math.min(P.sp,S.msp);msg('Refunded '+r+' stat points','#7dff9a')}
function resetSkills(){const r=(P.skl||[1,1,1,1,1]).reduce((a,v)=>a+v-1,0)+pasSpent();if(!r){msg('No skill points to refund');return}P.skl=[1,1,1,1,1];P.pas={};S=stats();P.hp=Math.min(P.hp,S.mhp);P.sp=Math.min(P.sp,S.msp);msg('Refunded '+r+' skill points','#7dff9a')}
function renderStats(){S=stats();const c=CL[P.cls];renderSkills();
 const spent=['str','dex','int','vit'].reduce((a,k)=>a+Math.max(0,P[k]-(P.b0||c.base)[k]),0),kspent=(P.skl||[1,1,1,1,1]).reduce((a,v)=>a+v-1,0)+pasSpent();
 $('bResS').textContent=resArm==='s'?'Tap again to confirm':'Reset stats';$('bResS').disabled=!spent;$('bResK').textContent=resArm==='k'?'Tap again to confirm':'Reset skills';$('bResK').disabled=!kspent;
 $('bResS').onclick=()=>{if(resArm!=='s'){resArm='s';renderStats();return}resArm='';resetStats();updBadge();renderStats();save()};
 $('bResK').onclick=()=>{if(resArm!=='k'){resArm='k';renderStats();return}resArm='';resetSkills();updBadge();renderStats();save()};
 $('stPts').textContent=c.name+' · Lv '+P.lv+' · '+P.pts+' point'+(P.pts===1?'':'s')+' to spend';
 $('stRows').innerHTML=['str','dex','int','vit'].map(k=>'<div class="row"><div><b>'+k.toUpperCase()+' '+P[k]+'</b>'+(k===c.stat?' ★':'')+'<br><span class="muted">'+SD[k]+'</span></div><span style="display:flex;gap:6px">'+[1,5,'all'].map(n=>'<button class="btn alt" data-up="'+k+'" data-n="'+n+'"'+(P.pts>=(n==='all'?1:n)||(n===5&&P.pts>0)?'':' disabled')+' aria-label="Raise '+k+' by '+n+'">'+(n==='all'?'All':'+'+n)+'</button>').join('')+'</span></div>').join('');
 {const cm=1.6+.06*pl('keen'),bm=P.cls==='mage'?1.1:1,est=Math.round(S.atk*bm*(1+S.crit/100*(cm-1))/(c.aspd||.5)),rec=dpsNow();$('stDer').innerHTML='ATK '+S.atk+' · DEF '+S.def+' · HP '+S.mhp+' · SP '+S.msp+' · Crit '+S.crit.toFixed(1)+'% (×'+cm.toFixed(2)+')<br><b>DPS</b> basic attack ≈ '+est.toLocaleString('en')+'/s · last 10s of fighting: '+(rec?rec.toLocaleString('en')+'/s':'—')}
 $('stRows').querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>{const n=Math.min(P.pts,b.dataset.n==='all'?P.pts:+b.dataset.n);if(n>0){P[b.dataset.up]+=n;P.pts-=n;S=stats();updBadge();renderStats();save()}})}
let BF='all',BS='new',bagSel=null;const ipow=it=>ua(it,'atk')+ua(it,'def')*1.5+ua(it,'hp')*.15,canEq=it=>it.slot!=='weapon'||it.cls===P.cls,better=it=>canEq(it)&&ipow(it)>(P[it.slot]?ipow(P[it.slot]):-1);
function cmpTxt(it){if(!canEq(it))return 'Another course\'s weapon: you can\'t equip it.';const cur=P[it.slot],S0=stats();P[it.slot]=it;const S1=stats();P[it.slot]=cur;const f=(n,a,b)=>{const d=b-a;return n+' '+a+' → '+b+' <b style="color:'+(d>0?'#2f8a4a':d<0?'#c43c3c':'#6b5a3a')+'">'+(d>0?'+':'')+d+'</b>'};return 'If equipped (vs '+(cur?itName(cur):'nothing')+'):<br>'+[f('ATK',S0.atk,S1.atk),f('DEF',S0.def,S1.def),f('HP',S0.mhp,S1.mhp)].join(' · ')}
function openBag(){HEV.bag=1;paused=true;bagSel=null;renderBag();$('mBag').classList.add('on')}
function renderBag(){
 $('bagInfo').textContent=P.gold+' gold · '+P.pots+' potions · '+(P.eths||0)+' ethers · '+(P.shards||0)+' Star Shards · '+P.inv.length+'/'+BAG+' items';
 const eq=s=>{const it=P[s];let b='';if(it){if((it.up||0)>=10)b='<button class="btn" disabled>Max +10</button>';else{const c=upCost(it);b='<button class="btn alt" data-up2="'+s+'"'+(P.gold>=c.g&&(P.shards||0)>=c.s?'':' disabled')+'>Upgrade +'+((it.up||0)+1)+'<br><small>'+c.g+'g · '+c.s+' shard'+(c.s>1?'s':'')+' · '+Math.round(c.r*100)+'%</small></button>'}}
  return '<div class="row"><div><b>'+(s==='weapon'?'Weapon':'Charm')+':</b> '+(it?itName(it)+'<br><span class="muted">'+itemTxt(it)+'</span>':'<span class="muted">none</span>')+'</div>'+b+'</div>'};
$('bagEq').innerHTML=eq('weapon')+eq('charm')+'<div class="row"><div><b>Pet:</b> '+(P.pet&&PETS[P.pet]?PETS[P.pet].name+' · Lv '+petLv(P.pet)+'<br><span class="muted">'+petBuffTxt(P.pet)+'</span>':'<span class="muted">none yet · adopt one from Pip in Lanternfall</span>')+'</div><button class="btn alt" id="bPets">Pets</button></div>';$('bPets').onclick=()=>{closeAll();openPets(false)};
  $('bagEq').insertAdjacentHTML('beforeend','<div class="row"><div><b>Auto-potion</b><br><span class="muted">Drinks a potion when HP falls below this</span></div><button class="btn alt" id="bAP">'+(P.ap?'Below '+P.ap+'%':'Off')+'</button></div><div class="row"><div><b>Auto-ether</b><br><span class="muted">Drinks an ether when SP falls below this</span></div><button class="btn alt" id="bAE">'+(P.ae?'Below '+P.ae+'%':'Off')+'</button></div>');
  const cyc=v=>[0,30,50,70][([0,30,50,70].indexOf(v||0)+1)%4];$('bAP').onclick=()=>{P.ap=cyc(P.ap);renderBag();save()};$('bAE').onclick=()=>{P.ae=cyc(P.ae);renderBag();save()};
  $('bagEq').querySelectorAll('[data-up2]').forEach(b=>b.onclick=()=>upgrade(b.dataset.up2));
 const FL={all:'All',weapon:'Weapons',charm:'Charms',use:'Usable',up:'Upgrades ▲'},SO={new:'Newest',tier:'Tier',pow:'Power'};let L=P.inv.map((it,i)=>[it,i]).filter(([it])=>BF==='all'||BF===it.slot||(BF==='use'&&canEq(it))||(BF==='up'&&better(it)));L.sort((a,b)=>BS==='tier'?(b[0].t-a[0].t)||(ipow(b[0])-ipow(a[0])):BS==='pow'?ipow(b[0])-ipow(a[0]):b[1]-a[1]);
 const chips=P.inv.length?'<div class="row" style="flex-wrap:wrap;gap:6px;justify-content:flex-start">'+Object.keys(FL).map(k=>'<button class="btn'+(BF===k?'':' alt')+'" data-bf="'+k+'" style="padding:4px 10px">'+FL[k]+'</button>').join('')+'<span class="muted" style="margin-left:auto">Sort</span>'+Object.keys(SO).map(k=>'<button class="btn'+(BS===k?'':' alt')+'" data-bs="'+k+'" style="padding:4px 10px">'+SO[k]+'</button>').join('')+'</div><p class="muted" style="margin:4px 0">Tap an item to compare it with what you\'re wearing.</p>':'';
 $('bagList').innerHTML=chips+(P.inv.length?(L.length?'':'<p class="muted">Nothing matches this filter.</p>')+L.map(([it])=>{const ok=canEq(it),bt=better(it),sel=bagSel===it.id;return '<div class="row" data-row="'+it.id+'" style="cursor:pointer'+(sel?';background:#f2c14e33':'')+'"><div style="display:flex;gap:10px;align-items:center"><img src="'+ARTDATA[itemIcon(it)]+'" width="30" height="30" alt="" style="background:'+TIERC[it.t]+'55;border-radius:8px;padding:2px"><div><b>'+itName(it)+'</b>'+(bt?' <b style="color:#2f8a4a">▲</b>':'')+'<br><span class="muted">'+itemTxt(it)+(ok?'':' · other course')+'</span>'+(sel?'<br><span style="font-size:14px">'+cmpTxt(it)+'</span>':'')+'</div></div><div style="display:flex;gap:6px"><button class="btn alt" data-eq="'+it.id+'"'+(ok?'':' disabled')+'>Equip</button><button class="btn" data-sell="'+it.id+'">Sell '+sellV(it)+'g</button></div></div>'}).join(''):'<p class="muted">Empty. Monsters sometimes drop gear.</p>');
 $('bagList').querySelectorAll('[data-bf]').forEach(b=>b.onclick=()=>{BF=b.dataset.bf;renderBag()});$('bagList').querySelectorAll('[data-bs]').forEach(b=>b.onclick=()=>{BS=b.dataset.bs;renderBag()});
 $('bagList').querySelectorAll('[data-row]').forEach(r=>r.onclick=e=>{if(e.target.closest('button'))return;const id=+r.dataset.row;bagSel=bagSel===id?null:id;renderBag()});
 
 $('bagList').querySelectorAll('[data-eq]').forEach(b=>b.onclick=()=>{const i=P.inv.findIndex(x=>x.id==b.dataset.eq);if(i<0)return;const it=P.inv[i];P.inv.splice(i,1);if(P[it.slot])P.inv.push(P[it.slot]);P[it.slot]=it;S=stats();P.hp=Math.min(P.hp,S.mhp);renderBag();save()});
 $('bagList').querySelectorAll('[data-sell]').forEach(b=>b.onclick=()=>{const i=P.inv.findIndex(x=>x.id==b.dataset.sell);if(i<0)return;P.gold+=sellV(P.inv[i]);P.inv.splice(i,1);renderBag();save()});
}
const sellV=it=>8+it.t*14+(it.atk||0)+(it.def||0)+(it.up||0)*20*(it.t+1);
$('bBuy').onclick=()=>{closeAll();openShop()};

/* ---------- better gear popup ---------- */
const gScore=it=>!it?-1:it.slot==='weapon'?ua(it,'atk'):cAtk(it)*3+ua(it,'def')*4+ua(it,'hp')*.5;
let toastQ=[],toastT=null;
function gotItem(it){if(!P||!it)return;if(it.slot==='weapon'&&it.cls!==P.cls)return;if(gScore(it)<=gScore(P[it.slot]))return;toastQ=toastQ.filter(x=>x.slot!==it.slot);toastQ.push(it);if(!toastT)showToast()}
function equipById(id){const i=P.inv.findIndex(x=>x.id==id);if(i<0)return false;const it=P.inv[i];P.inv.splice(i,1);if(P[it.slot])P.inv.push(P[it.slot]);P[it.slot]=it;S=stats();P.hp=Math.min(P.hp,S.mhp);save();return true}
function showToast(){const t=$('toast');clearTimeout(toastT);toastT=null;let it;while((it=toastQ.shift())&&(!P||!P.inv.some(x=>x.id===it.id)||gScore(it)<=gScore(P[it.slot]))){}if(!it){t.style.display='none';return}
 const cur=P[it.slot],d=it.slot==='weapon'?'ATK '+(cur?ua(cur,'atk'):0)+' → '+ua(it,'atk'):'ATK '+cAtk(cur)+' → '+cAtk(it)+' · DEF '+(cur?ua(cur,'def'):0)+' → '+ua(it,'def');
 t.innerHTML='<img src="'+isrc(itemIcon(it))+'" alt="" width="34" height="34" style="background:'+TIERC[it.t]+'55;border-radius:8px;padding:2px;flex:none"><div style="flex:1;min-width:0"><b>Better gear!</b> '+itName(it)+'<br><span class="muted" style="font-size:13px">'+d+'</span></div><button class="btn alt" id="tEq">Equip</button><button class="btn" id="tNo" aria-label="Dismiss">✕</button>';
 t.style.display='flex';$('tEq').onclick=()=>{if(equipById(it.id)){msg('Equipped '+itName(it),'#7dff9a');sfx('up')}showToast()};$('tNo').onclick=()=>showToast();toastT=setTimeout(showToast,8000)}

/* ---------- boss rush ---------- */
const RT=[{n:'Normal',lv:15,ml:18,gold:3000,sh:10,it:5,up:0},{n:'Hard',lv:25,ml:28,gold:9000,sh:25,it:6,up:2},{n:'Nightmare',lv:35,ml:38,gold:25000,sh:60,it:6,up:4}];
const RW=[{name:'Library Guardians',m:['golem','golem','golem']},{name:'The Old Bell',m:['boss']},{name:'Lanternfall Vanguard',m:['sentinel','sentinel','wisp','wisp','frog']},{name:'Moonlit Chimera',m:['chimera']},{name:"The Headmaster's Shadow",m:['shadow'],f:.6},{name:'Final Exam',m:['boss','chimera'],f:.65}];
const RUSH={active:false,done:false,tier:0,wave:0,t:0,next:0,from:null};
const fmtT=t=>{t=Math.floor(t);return Math.floor(t/60)+':'+String(t%60).padStart(2,'0')};
function startRush(tier){if(P.lv<RT[tier].lv)return;if(MAP!==AR())RUSH.from={map:MAP,x:P.x};
 travel(AR(),MAPS[AR()].spawn,'Welcome to the Starbell Trials: '+RT[tier].n+'. Wave 1 starts in 3 seconds!');Object.assign(RUSH,{active:true,done:false,tier,wave:0,t:0,next:3});S=stats();P.hp=S.mhp;P.sp=S.msp;P.cds=[0,0,0,0,0]}
function spawnWave(){const T=RT[RUSH.tier],w=RW[RUSH.wave];RUSH.wave++;const n=w.m.length;
 w.m.forEach((type,k)=>{const m=spawnMob(type,0,n===1?1250:760+k*(700/Math.max(1,n-1)),T.ml);m.rush=1;m.aggro=1;m.hp=m.mhp=Math.round(m.hp*(m.boss?1:2.5)*(w.f||1));if(!m.boss){m.exp*=2;m.gold=m.gold.map(v=>v*2)}if(!MT[type].fly)m.y=FLOOR});
 msg('Wave '+RUSH.wave+': '+w.name+'!','#ff8a8a');banner=0;shake=.3;sfx('boss')}
/* ---------- marks (telegraphed ground attacks) + player zones ---------- */
function addMark(x,r,t,dmg,kind){marks.push({x:clamp(x,40,WORLD-40),r,t,max:t,dmg,kind})}
function updMarks(dt){for(let i=marks.length-1;i>=0;i--){const k=marks[i];k.t-=dt;if(k.t>0)continue;
  if(P.deadT<=0&&Math.abs(P.x-k.x)<k.r&&P.y>FLOOR-170){hurtP(k.dmg,k.x);if(k.kind==='frost')P.slowT=2}
  if(k.kind==='star'||k.kind==='frost'){anim('ember',k.x,FLOOR,1.6,.45);shake=Math.max(shake,.15)}else for(let q=0;q<8;q++)fx.push({k:'p',x:k.x+rnd(-k.r,k.r),y:FLOOR-rnd(0,30),vx:0,vy:-120,life:.35,max:.35,c:'#c98aff',s:4});marks.splice(i,1)}}
function drawMarks(){for(const k of marks){const x=k.x-cam,f=clamp(k.t/k.max,0,1),a=.25+.2*Math.sin(T*18);if(RA('fx_tele')){ctx.save();ctx.globalAlpha=.75+.25*Math.sin(T*18);frC('fx_tele',T*8,x,FLOOR,k.r*2.2/276);ctx.restore()}ctx.save();ctx.fillStyle='rgba(255,60,60,'+a+')';ctx.beginPath();ctx.ellipse(x,FLOOR,k.r,12,0,0,7);ctx.fill();ctx.strokeStyle='rgba(255,90,90,.9)';ctx.lineWidth=3;ctx.stroke();
  ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,FLOOR,k.r*f,12*f,0,0,7);ctx.stroke();
  if(f<.5){const yy=FLOOR-260*f*2;if(k.kind==='arrow')frC('arrow',0,x,yy,.5,Math.PI/2);else if(artReady)frC('meteor',0,x,yy,.6)}ctx.restore()}}
function addPZ(o){o.tt=0;o.skm=curMul;o.max=o.t;pz.push(o)}
function updPZ(dt){for(let i=pz.length-1;i>=0;i--){const z=pz[i];z.t-=dt;z.tt-=dt;
  if(z.pull)for(const m of mobs){if(m.dead||m.boss)continue;const dx=z.x-m.x;if(Math.abs(dx)<z.r&&Math.abs(z.y-m.y)<z.r)m.x+=Math.sign(dx)*Math.min(Math.abs(dx),z.pull*dt)}
  if(z.tt<=0){z.tt=z.tick;const o=curMul;curMul=z.skm||1;hitCircle(z.x,z.y,z.r,z.mult,{});curMul=o}
  if(z.t<=0)pz.splice(i,1)}}
function drawPZ(){for(const z of pz){const x=z.x-cam;if(z.art&&RA(z.art)){ctx.save();ctx.globalAlpha=.9*clamp(z.t/.35,0,1);frC(z.art,T*10,x,z.y+(z.ady||0),z.r*2/MAN[z.art].fw);ctx.restore();continue}ctx.save();ctx.globalAlpha=.25+.25*clamp(z.t/z.max,0,1);ctx.strokeStyle=z.col;ctx.lineWidth=4;for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(x,z.y,z.r*(.4+.3*k),T*4+k*2,T*4+k*2+3.4);ctx.stroke()}ctx.globalAlpha*=.4;ctx.fillStyle=z.col;ctx.beginPath();ctx.arc(x,z.y,z.r*.8,0,7);ctx.fill();ctx.restore()}}

/* ---------- headmaster's shadow extras ---------- */
const PORT0=[5520,5830,6150],PORTA=[330,850,1370];let PORT=PORT0;
function updShadow(m,dt){PORT=MAP===AR()?PORTA:PORT0;m.castT=(m.castT||0)-dt;const ph=m.hp<m.mhp*.3?3:m.hp<m.mhp*.6?2:1;
 if(ph>(m.ph||1)){m.ph=ph;shake=.45;sfx('boss');msg(ph===2?'Phase 2 · "Pop Quiz!" The portraits stir…':'Phase 3 · "Final Exam!"','#c98aff');
  if(ph===2)for(const px of [PORT[0],PORT[2]]){const c=spawnMob('mimic',m.z,px,m.rush?m.lvl:38);if(m.rush){c.rush=1;c.y=FLOOR}c.ai='golem';c.st='idle';c.aggro=1;anim('fx_upgrade',px,FLOOR-80,.9,.6,{c:1})}}
 if(ph>=2){m.k2=(m.k2||3)-dt;if(m.k2<=0){m.k2=ph===3?3.2:4.5;m.castT=.6;for(const o of [-110,0,110])addMark(P.x+o+rnd(-20,20),48,.95,m.atk*1.0,'arrow')}}
 if(ph>=3){m.k3=(m.k3||2)-dt;if(m.k3<=0){m.k3=4.5;m.castT=.7;addMark(P.x,78,1.15,m.atk*1.4,'star');addMark(P.x+(Math.random()<.5?-180:180),78,1.35,m.atk*1.4,'star')}
  m.tp=(m.tp||5)-dt;if(m.tp<=0&&m.st!=='leap'&&m.st!=='prep'&&m.onG){m.tp=6;const px=PORT.filter(v=>Math.abs(v-m.x)>150)[Math.floor(Math.random()*2)]||PORT[1];for(let q=0;q<14;q++)fx.push({k:'p',x:m.x,y:m.y-m.h/2,vx:rnd(-200,200),vy:rnd(-200,100),life:.5,max:.5,c:'#8a4ad6',s:5});if(IMG.fx_shtp)anim('fx_shtp',m.x,FLOOR-80,.7,.5,{c:1});m.x=px;m.vx=0;m.st='walk';m.sT=.7;anim(IMG.fx_shtp?'fx_shtp':'fx_upgrade',px,FLOOR-80,IMG.fx_shtp?.7:1.1,.6,{c:1})}}}

/* ---------- thesis defence ---------- */
const TH={active:false,t:0};
function openLumen(){const L='Prefect Lumen',A='npc_lumen',q=curQ(),ready=q.thesis&&!P.thesis;
 if(!(P.sc&&P.sc.lumen)){scene('lumen',[{who:L,art:A,t:'Oh! A living student! Is the cafeteria still serving starbell pudding?'},{who:L,art:A,t:"I'm Lumen. I was a prefect here… about a hundred years ago. I came down to look at the Vault and, well. I never quite left."},{who:L,art:A,t:"Something terrible is sealed down here. If you're going further, be careful. And come talk to me any time!"}]);return}
 if(P.thesis){say([{who:L,art:A,t:"Congratulations, Professor "+plast()+"! …Can I call you Professor? I've never met one who wasn't scary."}]);return}
 if(ready){if(P.lv>=40)say([{who:L,art:A,t:"Every master of Starbell had to face the worst version of themselves. It's our oldest tradition: the Thesis Defence."},{who:L,art:A,t:'Are you ready?',opts:[{t:'Begin the Thesis Defence',f:startThesis},{t:'Not yet'}]}]);else say([{who:L,art:A,t:"The Thesis Defence is only for Lv 40 students. Come back when you're stronger!"}]);return}
 if(q.collect){say([{who:L,art:A,t:"Those pages are torn from Headmaster Starbell's diary. Bring me ten and I'll tell you what he did… and I have a little friend for you."}]);return}
 if(q.kill==='shadow'){say([{who:L,art:A,t:"I saw it a century ago. The Headmaster's Shadow, sealed in the Vault. Please be careful."}]);return}
 say([{who:L,art:A,t:['Is the cafeteria still serving starbell pudding? Asking for a ghost.','Quillon pretends he hates company. He doesn\'t.','Your Quests are in the top bar, if you\'re lost. I was lost for a hundred years!'][Math.floor(Math.random()*3)]}])}
function startThesis(){if(P.lv<40||P.thesis)return;travel(MI('thesis'),300,'The Vault seals behind you. Something steps out of your shadow…');TH.active=true;TH.t=1.8;S=stats();P.hp=S.mhp;P.sp=S.msp;P.cds=[0,0,0,0,0]}
function spawnMirror(){S=stats();const m=spawnMob('mirror',0,1250,40);m.hp=m.mhp=Math.round(S.mhp*25);m.atk=S.atk*.8*.4;m.def=0;m.sk=spk();m.cls=P.cls==='fresh'?'blade':P.cls;m.boss=true;m.mirror=true;m.y=FLOOR;m.dir=-1;m.name='Your Shadow';m.lvl=P.lv;sfx('boss');shake=.4;msg('Your Shadow wants your title. Take it back!','#c98aff')}
function updTrial(dt){if(!MAPS[MAP].trial||!TH.active)return;if(P.deadT>0){TH.active=false;thesisResult(false);return}if(TH.t>0){TH.t-=dt;if(TH.t<=0)spawnMirror()}}
function updMirror(m,dt,dx){const adx=Math.abs(dx);m.atkA=(m.atkA||0)-dt;m.sT-=dt;m.c1=(m.c1==null?1.5:m.c1)-dt;m.c2=(m.c2==null?4:m.c2)-dt;m.dir=Math.sign(dx)||1;
 if(m.cls==='blade'){
  if(m.st==='wind'){m.vx=0;if(m.sT<=0){m.st='idle';m.atkA=.3;anim('slash',m.x+m.dir*50,m.y-38,.62,.25,{flip:m.dir<0,c:1});if(Math.abs(P.x-(m.x+m.dir*50))<75&&Math.abs(P.y-m.y)<80)hurtP(m.atk*1.6,m.x)}}
  else if(m.st==='dashprep'){m.vx=0;if(m.sT<=0){m.st='dash';m.sT=.37;m.vx=m.dir*900}}
  else if(m.st==='dash'){if(m.sT<=0){m.st='idle';m.vx=0}}
  else if(m.c2<=0&&adx<520){m.st='dashprep';m.sT=.65;m.c2=5}
  else if(adx<90&&m.c1<=0){m.st='wind';m.sT=.42;m.c1=1.3}
  else m.vx=m.dir*175}
 else{const want=m.cls==='archer'?340:300;m.vx=adx<want-60?-m.dir*165:adx>want+60?m.dir*150:0;
  if(m.c1<=0){m.c1=m.cls==='archer'?1.3:1.8;m.atkA=.3;eproj.push({x:m.x+m.dir*20,y:m.y-32,vx:m.dir*(m.cls==='archer'?620:420),w:26,h:14,dmg:m.atk,life:1.8,k:m.cls})}
  if(m.c2<=0){m.c2=m.cls==='archer'?6:7;for(const o of [-120,0,120])addMark(P.x+o,m.cls==='archer'?46:70,1,m.atk*1.6,m.cls==='archer'?'arrow':'frost')}}}
function thesisWin(){TH.active=false;P.thesis=true;S=stats();P.hp=S.mhp;qCheck();setupSkills();updBadge();anim('fx_upgrade',P.x,P.y-40,1.6,1.2,{c:1});sfx('chest');save();
 msg('You are now a '+title()+'! All five skills upgraded.','#ffd23f');scene('thesis',[{who:'Prefect Lumen',art:'npc_lumen',t:"Congratulations, Professor! …Can I call you Professor? I've never met one who wasn't scary."}],()=>thesisResult(true))}
function thesisResult(win){paused=true;$('rushT').textContent=win?'Thesis passed!':'Thesis failed';
 $('rushB').innerHTML=win?'<p>You defeated Your Shadow. You are now a <b>'+title()+'</b>.</p><p>All five skills are upgraded: '+MASTER[P.cls].sk.join(', ')+'. You also gain ×1.1 ATK, +10% max HP, a tripled course bonus and +3 skill points.</p><p class="muted">Claim the Thesis Defence quest for your Sealbreaker weapon.</p><p>Lumen: "Congratulations, Professor! …Can I call you Professor? I\'ve never met one who wasn\'t scary."</p>'
  :'<p>Your Shadow won this time. Failing costs nothing, so try again whenever you like.</p><p class="muted">Tip: watch the red marks on the floor and move out before they land.</p>';
 $('rushAgain').textContent=win?'Back to the Reading Room':'Try again';$('rushLeave').textContent='Leave';
 $('rushAgain').onclick=()=>{$('mRush').classList.remove('on');paused=false;P.deadT=0;if(win)leaveThesis();else{S=stats();P.hp=S.mhp;startThesis()}};
 $('rushLeave').onclick=()=>{$('mRush').classList.remove('on');paused=false;P.deadT=0;leaveThesis()};$('mRush').classList.add('on')}
function leaveThesis(){TH.active=false;S=stats();P.hp=S.mhp;P.sp=S.msp;travel(MI('archive'),300,'Back in the Candlelit Reading Room.')}

function updRush(dt){if(MAP!==AR()||!RUSH.active)return;RUSH.t+=dt;
 if(P.deadT>0){RUSH.active=false;showRush(false);return}
 if(mobs.some(m=>m.rush&&!m.dead))return;
 if(RUSH.wave>=RW.length){finishRush();return}
 if(RUSH.next<=0)RUSH.next=RUSH.wave?2.5:3;RUSH.next-=dt;if(RUSH.next<=0){RUSH.next=0;spawnWave()}}
function finishRush(){RUSH.active=false;RUSH.done=true;const T=RT[RUSH.tier],day=new Date().toDateString();P.rush=P.rush||{};P.rushDay=P.rushDay||{};
 const first=P.rushDay[RUSH.tier]!==day;P.rushDay[RUSH.tier]=day;const best=!P.rush[RUSH.tier]||RUSH.t<P.rush[RUSH.tier];if(best)P.rush[RUSH.tier]=RUSH.t;
 const g=T.gold*(first?2:1);P.gold+=g;P.shards=(P.shards||0)+T.sh;const it=makeItem(T.it,Math.random()<.5?'weapon':'charm');it.up=T.up;P.inv.push(it);gotItem(it);
 RUSH.rew={g,sh:T.sh,it,first,best};anim('fx_upgrade',P.x,P.y-40,1.4,1,{c:1});sfx('chest');save();showRush(true)}
function showRush(win){paused=true;const T=RT[RUSH.tier];$('rushT').textContent=win?'Trial cleared!':'Run failed';
 $('rushB').innerHTML=win?'<p><b>'+T.n+'</b> cleared in <b>'+fmtT(RUSH.t)+'</b>'+(RUSH.rew.best?' · new best time!':' · best '+fmtT(P.rush[RUSH.tier]))+'</p><p>Rewards: '+RUSH.rew.g.toLocaleString('en')+' gold'+(RUSH.rew.first?' (first clear today, ×2)':'')+' · '+RUSH.rew.sh+' Star Shards · '+itName(RUSH.rew.it)+' ('+itemTxt(RUSH.rew.it)+')</p>'
  :'<p>You fainted on wave '+RUSH.wave+' of '+RW.length+' ('+(RW[RUSH.wave-1]||RW[0]).name+') after '+fmtT(RUSH.t)+'. No EXP was lost.</p><p class="muted">Tip: upgrade your gear, raise VIT, or set Auto-potion in your Bag.</p>';
 $('rushAgain').onclick=()=>{$('mRush').classList.remove('on');paused=false;P.deadT=0;startRush(RUSH.tier)};$('rushLeave').onclick=()=>{$('mRush').classList.remove('on');paused=false;P.deadT=0;leaveRush()};$('mRush').classList.add('on')}
function leaveRush(){RUSH.active=false;RUSH.done=false;const f=RUSH.from||{map:0,x:300};S=stats();P.hp=S.mhp;P.sp=S.msp;travel(f.map,MAPS[f.map].spawn,'Back from the Starbell Trials.')}

/* ---------- pre-Region 4 polish (14.1–14.4) ---------- */
const VER='0.18 player experience (22 Nov 2026)';let lastHurt=0,achT=2,DQ=null;
const xpFall=m=>{if(m.boss)return 1;const g=P.lv-m.lvl;return g>=8?Math.max(.1,1-.15*(g-7)):1};
function lvChip(L){const g=P.lv-L,c=g>=8?'#8a849a':L-P.lv>=5?'#c43c4a':'#3f9b5a',t=g>=8?'too low for you':L-P.lv>=5?'dangerous':'good for you';return '<span class="chip" style="background:'+c+'">Lv '+L+' · '+t+'</span>'}
const ENR={boss:180,chimera:240,shadow:360};
const AFX={shield:{n:'Shielded',c:'#7fb8ff'},hasty:{n:'Hasty',c:'#ffe066'},vamp:{n:'Vampiric',c:'#ff7a7a'},split:{n:'Splitting',c:'#c98aff'},thorny:{n:'Thorny',c:'#7dff9a'},frenzy:{n:'Frenzied',c:'#ffa040'}};
const logMs=k=>{const c=(P&&P.mlog&&P.mlog[k])||0;return (c>=100)+(c>=500)+(c>=1000)};
const ACH=[
 {id:'attend',n:'Perfect Attendance',d:'Fill a 30-stamp attendance card',c:()=>((P.att||{}).cards||0)>=1},
 {id:'lesson',n:'First Lesson Learned',d:'Finish quest 1',c:()=>(P.q||0)>=1},
 {id:'course',n:'Course Declared',d:'Choose a course',c:()=>P.cls!=='fresh'},
 {id:'bell',n:'Bell Ringer',d:'Beat the Gargoyle of the Old Bell',c:()=>((P.mlog||{}).boss||0)>0||(P.q||0)>=8},
 {id:'moon',n:'Moonstruck',d:'Beat the Moonlit Chimera',c:()=>((P.mlog||{}).chimera||0)>0||!!P.mkey},
 {id:'below',n:'Below the Bell',d:'Enter the Forbidden Archive',c:()=>!!(P.vm&&P.vm[MI('archive')])},
 {id:'defended',n:'Defended',d:'Pass the Thesis Defence',c:()=>!!P.thesis},
 {id:'shiny',n:'Shiny Hunter',d:'Defeat 10 shiny monsters',c:()=>(P.kS||0)>=10},
 {id:'elite',n:'Elite Slayer',d:'Defeat 100 elite monsters',c:()=>(P.kE||0)>=100},
 {id:'upgraded',n:'Fully Upgraded',d:'Own any +10 item',c:()=>[P.weapon,P.charm,...P.inv].some(it=>it&&(it.up||0)>=10)},
 {id:'petlover',n:'Pet Lover',d:'Raise any pet to Lv 10',c:()=>(P.pets||[]).some(k=>petLv(k)>=10)},
 {id:'exam',n:'Exam Season',d:'Clear Boss Rush on Hard',c:()=>!!(P.rush&&P.rush[1])},
 {id:'honour',n:'Honour Student',d:'Beat all three bosses without fainting during the fight',c:()=>{const c=P.clean||{};return c.boss&&c.chimera&&c.shadow}}];
const ACHM={};ACH.forEach(a=>ACHM[a.id]=a);
function achCheck(){if(!P)return;P.ach=P.ach||{};for(const a of ACH){if(P.ach[a.id])continue;let ok=false;try{ok=a.c()}catch(e){}if(ok){P.ach[a.id]=1;P.gold+=1000;P.shards=(P.shards||0)+2;if(!P.ttl)P.ttl=a.id;msg('Achievement: '+a.n+'! Title unlocked · +1,000 gold, +2 Star Shards','#ffd23f');sfx('chest')}}}
function openInfo(t,h){paused=true;$('infoT').textContent=t;$('infoB').innerHTML=h;$('mInfo').classList.add('on')}
function openAch(){achCheck();P.ach=P.ach||{};openInfo('Achievements · '+Object.keys(P.ach).length+'/'+ACH.length,'<p class="muted">Each unlocks a title shown above your character, plus 1,000 gold and 2 Star Shards.</p>'+ACH.map(a=>{const ok=P.ach[a.id],w=P.ttl===a.id;return '<div class="row'+(ok?'':' lock')+'"><div style="display:flex;gap:10px;align-items:center">'+(RA('ico_badge')?'<img class="ico" src="'+ARTDATA.ico_badge+'" alt="">':'')+'<div><b>'+(ok?'★ ':'☆ ')+a.n+'</b><br><span class="muted">'+a.d+'</span></div></div>'+(ok?'<button class="btn'+(w?'':' alt')+'" data-ttl="'+a.id+'">'+(w?'Wearing':'Wear title')+'</button>':'')+'</div>'}).join(''));
 $('infoB').querySelectorAll('[data-ttl]').forEach(b=>b.onclick=()=>{P.ttl=P.ttl===b.dataset.ttl?null:b.dataset.ttl;save();openAch()})}
function openLog(){P.mlog=P.mlog||{};const ks=Object.keys(MT).filter(k=>k!=='mirror');openInfo('Monster Log','<p class="muted">Milestones at 100 / 500 / 1,000 kills give gold, Star Shards and +1% damage to that monster each.</p>'+ks.map(k=>{const c=P.mlog[k]||0,ms=logMs(k),nx=[100,500,1000].find(v=>c<v);return '<div class="row'+(c?'':' lock')+'"><div><b>'+(c?MT[k].names.join(' / '):'???')+(MT[k].isBoss?' (boss)':'')+'</b><br><span class="muted">'+c.toLocaleString('en')+' defeated'+(nx?' · next milestone '+nx:' · all milestones done')+(ms?' · +'+ms+'% damage':'')+'</span></div></div>'}).join(''))}
const DIARY=["Day one as Headmaster. The bell rang true this morning. Starbell will teach every child who knocks.","The board wants trophies. I want students. Lately I'm not sure which part of me is speaking.","Found an old spell in the Restricted Section: to cut away what you would not be. Quillon disapproves. Quillon disapproves of everything.","My ambition whispers at every faculty meeting. I am so tired of it.","It is done. I feel lighter. Kinder. The thing that came out of me stood up and smiled with my face.","It wants the academy. It wants the bell. It wants to be Headmaster.","Sealed it beneath the tower. As long as the bell rings each dawn, the seal holds.","A prefect wandered too close to the vault today. She will not leave. I've asked Quillon to keep her company.","If you are reading this, the bell has gone quiet. I'm sorry. I left you my worst homework.","Don't face it alone, and don't face it unready. Face your own shadow first. Then ring the bell, student."];
function openDiary(){const n=P.pagesT||0;openInfo("Headmaster Starbell's Diary · "+n+'/10',n?DIARY.map((t,i)=>'<div class="row'+(i<n?'':' lock')+'"><div><b>Page '+(i+1)+'</b><br>'+(i<n?'<i>"'+t+'"</i>':'<span class="muted">Not found yet. Lost Pages drop in the Forbidden Archive during the Missing Pages quest.</span>')+'</div></div>').join(''):'<p class="muted">No pages yet. Lost Pages drop from Archive monsters during Prefect Lumen\'s Missing Pages quest.</p>')}
$('bDiary').onclick=()=>{closeAll();openDiary()};$('bLog').onclick=()=>{closeAll();openLog()};$('bLog2').onclick=()=>{closeAll();openLog()};$('bAch').onclick=()=>{closeAll();openAch()};
const REPORT_INFO='<b>Beta checklist</b><br>1. Start a new Freshman; note how long Lv 10, 20, 30 and 40 take.<br>2. Try all three courses to at least Lv 20; which feels weakest?<br>3. Beat each boss; note deaths and fight length.<br>4. Try Boss Rush Normal and Hard.<br>5. Note anywhere you had nothing useful to spend gold, stat or skill points on.<br>6. Send this report at Lv 20, 30, 40 and whenever something feels off.';
function reportTxt(){const eq=it=>it?'T'+it.t+'+'+(it.up||0):'-',ar=ZONES[zoneAt(P.x)],used=(P.skl||[1,1,1,1,1]).reduce((a,v)=>a+v-1,0);
 return ['SBR1','v='+VER,'name='+pname(),'class='+P.cls,'title='+title(),'lv='+P.lv,'area='+(ar?ar.name:MAPS[MAP].name),'play='+Math.round((P.playT||0)/60)+'m','deaths='+(P.deaths||0),'gold='+P.gold,'weapon='+eq(P.weapon),'charm='+eq(P.charm),'pet='+(P.pet?P.pet+' L'+petLv(P.pet):'-'),'skillpts act/pas/free='+used+'/'+pasSpent()+'/'+skFree(),'statpts free='+P.pts,'quest='+((P.q||0)+1),'rush='+RT.map((t,i)=>t.n+' '+(P.rush&&P.rush[i]?fmtT(P.rush[i]):'-')).join(', '),'elites='+(P.kE||0),'shinies='+(P.kS||0),'thesis='+(P.thesis?'yes':'no'),'achievements='+Object.keys(P.ach||{}).length,'stamps='+((P.att||{}).total||0)].join(' | ')}
const PCACHE={};function portrait(k){if(PCACHE[k])return PCACHE[k];const im=IMG[k],m=MAN[k];if(!im)return '';const fw=m&&m.fw?m.fw:im.width,fh=m&&m.fh?m.fh:im.height,c=document.createElement('canvas');c.width=fw;c.height=fh;c.getContext('2d').drawImage(im,0,0,fw,fh,0,0,fw,fh);return PCACHE[k]=c.toDataURL()}
function say(lines,done){if(!lines||!lines.length){done&&done();return}if(DQ){const d0=DQ.done;DQ.l=DQ.l.concat(lines);DQ.done=()=>{d0&&d0();done&&done()};return}DQ={l:lines.slice(),i:0,done};paused=true;showLine()}
function scene(id,lines,done){P.sc=P.sc||{};if(P.sc[id]){done&&done();return}P.sc[id]=1;save();say(lines,done)}
function showLine(){const L=DQ.l[DQ.i],pic=L.art?portrait(L.art):'';$('dlgP').hidden=!pic;if(pic)$('dlgP').src=pic;$('dlgN').textContent=L.who||'';$('dlgX').textContent=L.t;
 $('dlgO').innerHTML=(L.opts||[]).map((o,j)=>'<button class="btn alt" data-o="'+j+'">'+o.t+'</button>').join('')+(L.opts?'':'<span class="dlgHint">'+(DQ.i<DQ.l.length-1?'Tap to continue ▸':'Tap to close')+'</span>');
 $('dlgO').querySelectorAll('[data-o]').forEach(b=>b.onclick=e=>{e.stopPropagation();const o=L.opts[+b.dataset.o];endDlg(false);o.f&&o.f()});$('dlg').classList.add('on')}
function nextLine(){if(!DQ)return;if(DQ.l[DQ.i].opts)return;if(++DQ.i>=DQ.l.length)endDlg(true);else showLine()}
function endDlg(run){const d=DQ;DQ=null;$('dlg').classList.remove('on');paused=!!document.querySelector('.modal.on:not(#mStart)');if(run&&d&&d.done)d.done()}
$('dlg').onclick=nextLine;$('dlgS').onclick=e=>{e.stopPropagation();if(!DQ)return;const last=DQ.l.length-1;if(DQ.l[last].opts&&DQ.i<last){DQ.i=last;showLine()}else if(!DQ.l[DQ.i].opts)endDlg(true);else endDlg(false)};

/* ---------- maps, npcs, pets ---------- */
function spawnAll(){ZONES.forEach((z,zi)=>{if(z.safe)return;for(let n=0;n<z.cap;n++)spawnMob(z.mobs[n%z.mobs.length],zi,rnd(z.x0+80,z.x1-80))})}
function travel(i,x,note){marks.length=0;pz.length=0;if(i!==AR())RUSH.active=false;loadMap(i);P.map=i;P.x=x;P.y=FLOOR;P.vx=P.vy=0;mobs.length=proj.length=eproj.length=loot.length=timers.length=0;if(bossCd>1e8)bossCd=0;spawnAll();
 cam=clamp(P.x-W*.42,0,WORLD-W);curZone=-1;nearObj=null;fadeT=.6;sfx('warp');pet.x=P.x-40;pet.y=P.y-70;P.vm=P.vm||{};if(!P.vm[i]){P.vm[i]=1;qCheck();if(MAPS[i].id==='archive')later(.7,()=>scene('stair',[{art:'stair_open',t:"Under the old bell, a stair you've never noticed. The Moonstone Key fits perfectly."},{t:'The air below smells of candle wax and very old ink.'}]))}msg(note||('You step through the Lantern Gate… '+MAPS[i].name+'!'),'#ffd23f');updBadge();save()}
const seen=(mi,zi)=>{const z=MAPS[mi].zones[zi];if(P.vz&&P.vz[mi+':'+zi])return true;if(mi===0)return zi===0||P.lv>=z.dlv;return zi===0&&!!((P.vm||{})[mi]||(mi===1&&P.vis1))};
function openMap(){paused=true;renderMap();$('mMap').classList.add('on')}
function renderMap(){$('mapList').innerHTML=MAPS.map((M,mi)=>M.hidden?'':'<h3 style="margin:12px 0 2px">'+M.name+'</h3>'+M.zones.map((z,zi)=>{const ok=seen(mi,zi),here=mi===MAP&&zi===zoneAt(P.x);
  return '<div class="row'+(ok?'':' lock')+'"><div><b>'+z.name+'</b><br><span class="muted">'+(z.safe?'Town · heal and shops':lvChip(z.boss?MT[z.boss].lvl:z.dlv)+' '+(z.boss?'Boss area':'Monsters'))+'</span></div><button class="btn alt" data-go="'+mi+':'+zi+'"'+(ok&&!here?'':' disabled')+'>'+(here?'You are here':ok?'Travel':'Not visited')+'</button></div>'}).join('')).join('');
 P.rush=P.rush||{};$('mapList').insertAdjacentHTML('beforeend','<h3 style="margin:14px 0 2px;display:flex;gap:8px;align-items:center">'+(RA('ico_rush')?'<img class="ico" src="'+ARTDATA.ico_rush+'" alt="">':'')+'Boss Rush · Starbell Trials</h3><p class="muted" style="margin:0 0 4px">6 waves of guardians and bosses, back to back. No EXP lost if you faint.</p>'+RT.map((t,i)=>'<div class="row'+(P.lv>=t.lv?'':' lock')+'"><div style="display:flex;gap:10px;align-items:center">'+(RA('badge_n')?'<img class="ico" src="'+ARTDATA[['badge_n','badge_h','badge_nm'][i]]+'" alt="">':'')+'<div><b>'+t.n+'</b><br><span class="muted">Recommended Lv '+t.lv+'+ · '+(P.rush[i]?'best '+fmtT(P.rush[i]):'not cleared yet')+'</span></div></div><button class="btn alt" data-rush="'+i+'"'+(P.lv>=t.lv&&!RUSH.active?'':' disabled')+'>'+(RUSH.active&&RUSH.tier===i?'In progress':P.lv>=t.lv?'Enter':'Lv '+t.lv)+'</button></div>').join(''));
 $('mapList').querySelectorAll('[data-rush]').forEach(b=>b.onclick=()=>{closeAll();startRush(+b.dataset.rush)});
 $('mapList').querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{const [mi,zi]=b.dataset.go.split(':').map(Number);closeAll();goTo(mi,zi)})}
function goTo(mi,zi){if(P.deadT>0)return;const z=MAPS[mi].zones[zi],x=z.safe?MAPS[mi].spawn:z.x0+90,note='Fast travel: '+z.name;
 if(mi!==MAP){travel(mi,x,note);return}P.x=x;P.y=FLOOR;P.vx=P.vy=0;cam=clamp(P.x-W*.42,0,WORLD-W);fadeT=.6;pet.x=P.x-40;pet.y=P.y-70;msg(note,'#ffd23f');save()}
function talk(){const o=nearObj;if(!o)return;HEV.talk=1;
 if(o.k==='warp'){if(o.lv&&P.lv<o.lv){msg('This gate is sealed until Lv '+o.lv+'.','#ffb0b0');return}if(o.key&&!P.mkey){msg('The Sealed Stair is locked. A moon-shaped keyhole glows faintly…','#ffb0b0');return}travel(o.to,o.tx)}
 else if(o.k==='merchant')openShop(MAP);else if(o.k==='pets')openPets(true);else if(o.k==='shop')openShop();else if(o.k==='exit')leaveRush();else if(o.k==='texit')leaveThesis();else if(o.k==='quillon'){P.talked=P.talked||{};P.talked.quillon=1;qCheck();const Q='Archivist Quillon',A='npc_quillon';if(!(P.sc&&P.sc.quillon))scene('quillon',[{who:Q,art:A,t:'Quiet, please. And wipe your boots. The ink is load-bearing.'},{who:Q,art:A,t:'Three hundred years I have shelved these books, and not one student has returned a single one on time.'},{who:Q,art:A,t:'I sell gear, if you must. Whisper your order.'}],()=>openShop(MAP));else say([{who:Q,art:A,t:['Welcome back, '+pfirst()+'. Whisper your order.','Shoes. Wiped. Thank you.','Mind the ink.'][Math.floor(Math.random()*3)]}],()=>openShop(MAP))}else if(o.k==='lumen')openLumen()}
const ISRC={};function isrc(k){if(ISRC[k])return ISRC[k];{const m0=MAN[k];if(ARTDATA[k]&&!(m0&&(m0.n||1)>1))return ARTDATA[k];if(!IMG[k])return ARTDATA[k]||''}const im=IMG[k],m=MAN[k];if(!im)return '';const c=document.createElement('canvas');c.width=m&&m.fw?m.fw:im.width;c.height=m&&m.fh?m.fh:im.height;c.getContext('2d').drawImage(im,0,0);return ISRC[k]=c.toDataURL()}
function openPets(atPip){petsAtPip=!!atPip;paused=true;renderPets();$('mPets').classList.add('on')}
function renderPets(){P.pets=P.pets||[];$('petInfo').textContent=P.gold+' gold · '+(petsAtPip?'"Every student needs a friend!" Pip hatches eggs here.':'Switch pets anywhere. New pets come from Pip in Lanternfall Village.');
 $('petList').innerHTML=Object.entries(PETS).map(([k,p])=>{const own=P.pets.includes(k),act=P.pet===k;
  return '<div class="row"><div style="display:flex;gap:10px;align-items:center"><img class="ico" src="'+isrc(p.key)+'" alt=""><div><b>'+p.name+(act?' · with you':'')+'</b><br><span class="muted">'+p.desc.split('. ')[0]+'. Lv '+petLv(k)+(petLv(k)<10?' ('+((P.petXp||{})[k]||0)+'/'+petNeed(petLv(k))+' kills)':' MAX')+' · '+petBuffTxt(k)+'</span></div></div>'+
(p.quest&&!own?'<button class="btn" disabled>Quest reward</button>':p.starter&&!own?'<button class="btn" disabled>Starter gift</button>':own?'<button class="btn'+(act?'':' alt')+'" data-pet="'+k+'">'+(act?'Send home':'Bring along')+'</button>':'<button class="btn alt" data-pbuy="'+k+'"'+(!petsAtPip||P.gold<p.cost?' disabled':'')+'>'+(petsAtPip?p.cost+'g':'At Pip')+'</button>')+'</div>'}).join('');
 $('petList').querySelectorAll('[data-pbuy]').forEach(b=>b.onclick=()=>buyPet(b.dataset.pbuy));
 $('petList').querySelectorAll('[data-pet]').forEach(b=>b.onclick=()=>{const k=b.dataset.pet;P.pet=P.pet===k?null:k;pet.x=P.x-40;pet.y=P.y-70;S=stats();P.hp=Math.min(P.hp,S.mhp);renderPets();save()})}
function buyPet(k){const p=PETS[k];P.pets=P.pets||[];if(!petsAtPip||!p||P.gold<p.cost||P.pets.includes(k))return;P.gold-=p.cost;P.pets.push(k);P.pet=k;pet.x=P.x-40;pet.y=P.y-70;msg(p.name+' hatched and joined you!','#ffd23f');qCheck();updBadge();renderPets();save()}
function updPet(dt){if(!P.pet||!PETS[P.pet])return;let tx=P.x-P.dir*46,ty=P.y-72+Math.sin(T*3)*6,best=null,bd=420;
 if(P.deadT<=0)for(const l of loot){if(l.t<.4||(l.k==='item'&&P.inv.length>=BAG))continue;const d=Math.hypot(l.x-P.x,l.y-P.y);if(d<bd){bd=d;best=l}}
 if(best){tx=best.x;ty=best.y-4}
 const dx=tx-pet.x,dy=ty-pet.y,dd=Math.hypot(dx,dy),mx=(best?620:Math.max(260,dd*5))*dt;
 if(dd>mx){pet.x+=dx/dd*mx;pet.y+=dy/dd*mx}else{pet.x=tx;pet.y=ty}if(Math.abs(dx)>3)pet.dir=Math.sign(dx);
 if(best&&Math.hypot(best.x-pet.x,best.y-pet.y)<24)collect(loot.indexOf(best))}
function collect(i){const l=loot[i];if(!l)return false;
 if(l.k==='gold'){P.gold+=l.val;sfx('coin')}else if(l.k==='pot'){P.pots++;msg('Picked up a potion','#7dff9a')}else if(l.k==='eth'){P.eths=(P.eths||0)+1;msg('Picked up an ether','#9fd0ff')}else if(l.k==='page'){P.pages=(P.pages||0)+1;const nw=(P.pagesT||0)<10;P.pagesT=Math.min(10,(P.pagesT||0)+1);msg('Lost Page '+Math.min(P.pages,10)+'/10'+(nw?' · new diary page in your Bag':''),'#e8d9b4');qCheck()}else if(l.k==='shard'){P.shards=(P.shards||0)+l.val;msg('Picked up '+(l.val>1?l.val+' Star Shards':'a Star Shard'),'#9fe8ff')}
 else{if(SET.loot&&l.item.t<SET.loot){const v=sellV(l.item);P.gold+=v;msg('Auto-sold '+l.item.name+' (+'+v+'g)','#c9c2dc');loot.splice(i,1);return true}if(P.inv.length>=BAG){if(!l.warn){l.warn=1;msg('Satchel full! Sell something.','#ffb0b0')}return false}P.inv.push(l.item);msg('Got '+l.item.name+' ('+itemTxt(l.item)+')','#ffd23f');gotItem(l.item)}
 loot.splice(i,1);return true}
function drawPet(){if(!P.pet||!PETS[P.pet])return;const p=PETS[P.pet],sx=Math.round(pet.x-cam),sy=Math.round(pet.y);
 ctx.fillStyle='#0002';ctx.beginPath();ctx.ellipse(sx,FLOOR,10,3,0,0,7);ctx.fill();
 if(!(IMG[p.key]&&frC(p.key,T*6,sx,sy,p.s,0,pet.dir<0))){ctx.fillStyle='#ffd23f';ctx.beginPath();ctx.arc(sx,sy,9,0,7);ctx.fill()}}
function drawWarp(sx){if(IMG.warp){fr('warp',T*6,sx,FLOOR+2,.89);return}
 ctx.save();ctx.strokeStyle='#4a3f6a';ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(sx-38,FLOOR);ctx.lineTo(sx-38,FLOOR-110);ctx.arc(sx,FLOOR-110,38,Math.PI,0);ctx.lineTo(sx+38,FLOOR);ctx.stroke();
 const g=ctx.createRadialGradient(sx,FLOOR-70,4,sx,FLOOR-70,50);g.addColorStop(0,'#fff6c8');g.addColorStop(.45,'#c9a0ffcc');g.addColorStop(1,'#6a4ad000');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(sx,FLOOR-72,30,66+Math.sin(T*3)*3,0,0,7);ctx.fill();
 ctx.fillStyle='#fff6c8';for(let k=0;k<6;k++){const a=T*2+k*1.05;ctx.fillRect(sx+Math.cos(a)*22-2,FLOOR-72+Math.sin(a*1.3)*50-2,4,4)}
 ctx.fillStyle='#f2c14e';ctx.beginPath();ctx.arc(sx,FLOOR-158,8+Math.sin(T*4),0,7);ctx.fill();ctx.restore()}
const PH=[
 ['bg_vil_far','bg_court_far',-25,[1,.72,.66]],['bg_vil_mid','bg_court_mid',-25,[1,.78,.7]],['t_vil_top','t_court_top',-15,[.95,.82,.76]],['t_vil_fill','t_court_fill',-15,[.9,.78,.72]],['p_vil','p_court',-15,[.95,.82,.76]],
 ['bg_marsh_far','bg_garden_far',70,[.55,.75,.75]],['bg_marsh_mid','bg_garden_mid',70,[.6,.8,.78]],['bg_marsh_near','bg_garden_near',70,[.65,.85,.8]],['t_marsh_top','t_garden_top',60,[.7,.85,.8]],['t_marsh_fill','t_garden_fill',60,[.6,.75,.72]],['p_marsh','p_garden',60,[.7,.85,.8]],
 ['bg_ruin_far','bg_lib_far',170,[.7,.85,.95]],['bg_ruin_mid','bg_lib_mid',170,[.7,.85,.95]],['t_ruin_top','t_lib_top',170,[.8,.9,1]],['t_ruin_fill','t_lib_fill',170,[.7,.8,.9]],['p_ruin','p_lib',170,[.8,.9,1]],
 ['bg_dome_far','bg_tower_far',50,[.8,.8,1.1]],['bg_dome_mid','bg_tower_mid',50,[.8,.8,1.1]],['bg_dome_near','bg_tower_near',50,[.8,.8,1.1]],['t_dome_top','t_tower_top',50,[.85,.85,1.1]],['t_dome_fill','t_tower_fill',50,[.8,.8,1.05]],['p_dome','p_tower',50,[.85,.85,1.1]],
 ['frog','slime_g',-40,[1.1,1,.65]],
 ['bg_rr_far','bg_lib_far',-10,[1.1,.85,.6]],['bg_rr_mid','bg_lib_mid',-10,[1.05,.85,.65]],['t_rr_top','t_lib_top',0,[1,.85,.7]],['t_rr_fill','t_lib_fill',0,[.9,.75,.65]],['p_rr','p_lib',0,[1,.85,.7]],
 ['bg_cat_far','bg_lib_far',200,[.4,.48,.85]],['bg_cat_mid','bg_lib_mid',200,[.45,.5,.85]],['t_cat_top','t_lib_top',200,[.5,.55,.85]],['t_cat_fill','t_lib_fill',200,[.4,.45,.75]],['p_cat','p_lib',200,[.55,.6,.9]],
 ['bg_por_far','bg_lib_far',250,[.75,.55,.9]],['bg_por_mid','bg_lib_mid',250,[.8,.6,.9]],['t_por_top','t_lib_top',250,[.8,.65,.9]],['t_por_fill','t_lib_fill',250,[.65,.5,.75]],['p_por','p_lib',250,[.85,.7,.95]],
 ['bg_vlt_far','bg_tower_far',40,[.6,.45,.95]],['bg_vlt_mid','bg_tower_mid',40,[.6,.45,.95]],['bg_vlt_near','bg_tower_near',40,[.6,.45,.95]],['t_vlt_top','t_tower_top',40,[.65,.5,.95]],['t_vlt_fill','t_tower_fill',40,[.6,.45,.9]],['p_vlt','p_tower',40,[.7,.55,1]],
 ['blot','slime_p',200,[.35,.42,.85]],['wraith','wisp',80,[.75,.5,1.1]],
 ['mimic_walk','sentinel_walk',20,[1.1,.85,.55]],['mimic_wind','sentinel_wind',20,[1.1,.85,.55]],['mimic_slam','sentinel_slam',20,[1.1,.85,.55]],
 ['armour_walk','sentinel_walk',230,[.75,.7,.95]],['armour_wind','sentinel_wind',230,[.75,.7,.95]],['armour_slam','sentinel_slam',230,[.75,.7,.95]],
 ['shade_idle','boss_idle',230,[.5,.38,.95]],['shade_walk','boss_walk',230,[.5,.38,.95]],['shade_wind','boss_wind',230,[.5,.38,.95]],['shade_leap','boss_leap',230,[.5,.38,.95]],['shade_slam','boss_slam',230,[.5,.38,.95]],['shade_hurt','boss_hurt',230,[.5,.38,.95]],
 ['npc_quillon','npc_merchant',190,[.7,.85,1.25]],['npc_lumen','npc_pets',180,[.85,.95,1.3]],['candelabra','well',-15,[1.25,.9,.5]],['pet_grimoire','ico_book',230,[.9,.75,1.25]],['wisp','bat',170,[1.1,1.3,1.35]],
 ['sentinel_walk','golem_walk',140,[.72,.9,.85]],['sentinel_wind','golem_wind',140,[.72,.9,.85]],['sentinel_slam','golem_slam',140,[.72,.9,.85]],
 ['chimera_idle','boss_idle',200,[.9,.9,1.25]],['chimera_walk','boss_walk',200,[.9,.9,1.25]],['chimera_wind','boss_wind',200,[.9,.9,1.25]],['chimera_leap','boss_leap',200,[.9,.9,1.25]],['chimera_slam','boss_slam',200,[.9,.9,1.25]],['chimera_hurt','boss_hurt',200,[.9,.9,1.25]],
['pet_chick','slime_g',-75,[1.35,1.2,.55]],['pet_mochi','slime_p',70,[1.25,1,1.05]],['pet_moth','bat',200,[1.6,1.3,.7]],['pet_wisp','orb',-150,[1.25,1.15,.8]],
 ['npc_merchant','shop',25,[1,.95,.9]],['npc_pets','shop',110,[1,1,1]],['well','fountain',-40,[1,.9,.8]]];
function drawIcons(){const mk=(k,f)=>{if(IMG[k])return;const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');f(g);IMG[k]=c;MAN[k]={n:1,fw:64,fh:64,ax:32,ay:64}};
 mk('ico_shard',g=>{g.fillStyle='#3a8ad0';g.beginPath();g.moveTo(32,4);g.lineTo(52,30);g.lineTo(32,60);g.lineTo(12,30);g.fill();g.fillStyle='#9fe8ff';g.beginPath();g.moveTo(32,8);g.lineTo(46,30);g.lineTo(32,52);g.fill();g.fillStyle='#fff';g.fillRect(26,18,5,12)});
 mk('ico_gear',g=>{g.translate(32,32);g.fillStyle='#8a8aa8';for(let k=0;k<8;k++){g.rotate(Math.PI/4);g.fillRect(-6,-28,12,12)}g.beginPath();g.arc(0,0,20,0,7);g.fill();g.fillStyle='#d9d2e8';g.beginPath();g.arc(0,0,14,0,7);g.fill();g.fillStyle='#4a4468';g.beginPath();g.arc(0,0,7,0,7);g.fill()});
 mk('ico_map',g=>{g.fillStyle='#e8d9b4';g.fillRect(8,12,48,40);g.strokeStyle='#6b4a2a';g.lineWidth=4;g.strokeRect(8,12,48,40);g.strokeStyle='#c43c6a';g.setLineDash([5,4]);g.beginPath();g.moveTo(14,44);g.lineTo(28,30);g.lineTo(38,38);g.lineTo(48,20);g.stroke();g.setLineDash([]);g.fillStyle='#c43c6a';g.fillRect(44,16,8,8)})}
function tintArt(){drawIcons();for(const [k,src,deg,mul] of PH){if(IMG[k]||!IMG[src]||(ARTDATA[k]&&!ARTFAIL[k]))continue;const im=IMG[src],c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d');g.drawImage(im,0,0);
 try{const d=g.getImageData(0,0,c.width,c.height),p=d.data,a=deg*Math.PI/180,co=Math.cos(a),si=Math.sin(a);
  const M=[.213+.787*co-.213*si,.715-.715*co-.715*si,.072-.072*co+.928*si,.213-.213*co+.143*si,.715+.285*co+.14*si,.072-.072*co-.283*si,.213-.213*co-.787*si,.715-.715*co+.715*si,.072+.928*co+.072*si];
  for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const r=p[i],gg=p[i+1],b=p[i+2];p[i]=(M[0]*r+M[1]*gg+M[2]*b)*mul[0];p[i+1]=(M[3]*r+M[4]*gg+M[5]*b)*mul[1];p[i+2]=(M[6]*r+M[7]*gg+M[8]*b)*mul[2]}g.putImageData(d,0,0)}catch(e){}
 IMG[k]=c;if(MAN[src]&&!MAN[k])MAN[k]={...MAN[src]}}}

/* ---------- start ---------- */
function setupSkills(){[1,2,3,4].forEach(i=>{const b=document.querySelector('.tb[data-p="s'+i+'"]'),lockd=P.cls==='fresh'&&i>=2;
  if(i===4){b.style.display=P.adv?'grid':'none';if(!P.adv)return}
  const ik=skIcon(i),has=!!IMG[ik]&&!lockd;$('tn'+i).textContent=lockd?'Lv 10':has?'':skC(i).sk;b.style.backgroundImage=has?'url('+ARTDATA[ik]+')':'';b.style.opacity=lockd?.5:1;b.classList.toggle('gold',!!P.thesis)})}
function startGame(p){P=p;P.map=MAPS[P.map]&&!MAPS[P.map].hidden?P.map:0;TH.active=false;if(!P.mkey&&((P.q||0)>14||(P.daily&&P.daily.chimera)))P.mkey=1;RUSH.active=false;loadMap(P.map);P.pets=P.pets||[];if(P.pet&&!PETS[P.pet])P.pet=null;P.skl=P.skl||[1,1,1,1,1];P.pas=P.pas||{};P.sc=P.sc||{};if((P.q||0)>18&&!P.pagesT)P.pagesT=10;combo=0;P.w=30;P.h=60;P.atkA=P.hurtA=0;P.guard=0;P.q=P.q||0;P.qc=P.qc||0;P.eths=P.eths??2;P.b0=P.b0||{...CL[P.cls].base};P.qAnn=0;S=stats();if(!(P.hp>0))P.hp=S.mhp;P.sp=Math.min(P.sp||S.msp,S.msp);P.x=MAPS[MAP].spawn;P.y=FLOOR;P.deadT=0;P.cds=[0,0,0,0,0];P.vx=P.vy=0;
 mobs.length=proj.length=eproj.length=loot.length=timers.length=0;bossCd=0;spawnAll();pet.x=P.x-40;pet.y=P.y-70;cam=clamp(P.x-W*.42,0,WORLD-W);curZone=-1;
 state='play';$('mStart').classList.remove('on');$('top').hidden=false;updBadge();
 setupSkills();if(TOUCH)$('touch').classList.add('on');qCheck();
msg('Welcome, '+pname()+'! Open Quests for your first lesson.','#ffd23f');P.hints=P.hints||{};if(P.hintOn===undefined)P.hintOn=0;P.hx0=P.x;HEV={};hintT=1.5;hideHint();if(!P.name)later(.4,()=>openID('old'));else if(attReady())later(1,()=>msg('Attendance stamp ready! Claim it from the Bag or Map.','#7dff9a'));
  if(!P.starterGear){P.starterGear=1;const w=makeItem(1,'weapon',1),c=makeItem(1,'charm',1);c.name=TIER[1]+' Pendant';const got=[];
   for(const it of [w,c]){if(!P[it.slot]){P[it.slot]=it;got.push(it.name+' (equipped)')}else if(P.inv.length<BAG){P.inv.push(it);got.push(it.name+' (in Bag)')}}
   S=stats();if(got.length)msg('Starter gear: '+got.join(' and '),'#7dff9a')}
  if(P.lv<=2&&!(P.sc&&P.sc.intro))later(.5,()=>scene('intro',[{who:'The Principal',art:'principal_portrait',t:'Welcome to Starbell Academy, '+pname()+'!'},{who:'The Principal',art:'principal_portrait',t:"I'm afraid our practice grounds have gone a little… wild. Slimes in the gardens, bats in the library, and the old bell hasn't rung in weeks."},{who:'The Principal',art:'principal_portrait',t:'Your first lesson is waiting on the Quest board. Do be careful, and do come back in one piece.'}]));
  if(!P.starter){P.starter=1;P.pots+=10;P.eths=(P.eths||0)+5;if(!P.pets.includes('chick'))P.pets.push('chick');if(!P.pet)P.pet='chick';pet.x=P.x-40;pet.y=P.y-70;S=stats();P.hp=S.mhp;
   msg('Starter pack: +10 potions, +5 ethers, a Pocket Chick pet and Study Notes (+30% EXP until Lv 20)','#7dff9a')}save()}
$('clsList').innerHTML=COURSES.map(k=>'<button class="cls" data-c="'+k+'"><canvas width="36" height="48"></canvas><b>'+CL[k].name+'</b><small>'+CL[k].desc+'</small></button>').join('');
$('clsList').querySelectorAll('.cls').forEach(b=>{const g=b.querySelector('canvas').getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(PSPR[b.dataset.c][0],0,0);b.disabled=true;
 b.onclick=null;b.style.cursor='default'});
const slotKey=n=>n===1?'starbell-academy-v1':'starbell-academy-v1-s'+n;let slotArm=0;
function renderSlots(){$('slots').innerHTML=[1,2,3].map(n=>{const v=loadSave(slotKey(n)),ok=v&&CL[v.cls];
  return '<div class="row"><div><b>Slot '+n+(ok&&v.name?' · '+esc(v.name):'')+'</b><br><span class="muted">'+(ok?(v.adv&&ADV[v.cls]?ADV[v.cls].name:CL[v.cls].name)+' · Lv '+v.lv+(MAPS[v.map||0]?' · '+MAPS[v.map||0].name:''):'Empty')+'</span></div><span style="display:flex;gap:8px">'+(ok?'<button class="btn alt" data-play="'+n+'">Continue</button>':'')+'<button class="btn" data-new="'+n+'">'+(ok?(slotArm===n?'Tap again to replace':'New'):'Enroll')+'</button></span></div>'}).join('')+'<p style="margin:8px 0 0"><button class="btn" id="bImport">Import save code</button></p>';$('bImport').onclick=()=>openCode('title');
 $('slots').querySelectorAll('[data-play]').forEach(b=>b.onclick=()=>{KEY=slotKey(+b.dataset.play);slotArm=0;startGame(loadSave(KEY))});
 $('slots').querySelectorAll('[data-new]').forEach(b=>b.onclick=()=>{const n=+b.dataset.new,v=loadSave(slotKey(n));if(v&&CL[v.cls]&&slotArm!==n){slotArm=n;renderSlots();return}slotArm=0;KEY=slotKey(n);openID('new')})}
{const w=(f,mi)=>function(...a){needMap(mi(...a),()=>f.apply(this,a))};
 travel=w(travel,i=>i);startRush=w(startRush,()=>AR());startThesis=w(startThesis,()=>MI('thesis'));leaveThesis=w(leaveThesis,()=>MI('archive'));
 leaveRush=w(leaveRush,()=>(RUSH.from||{map:0}).map);startGame=w(startGame,p=>MAPS[p.map]&&!MAPS[p.map].hidden?p.map:0)}
loadArt(()=>{makeFreshArt();tintArt();{const ms=[0];for(const n of [1,2,3]){const v=loadSave(slotKey(n));if(v&&MAPS[v.map|0]&&!MAPS[v.map|0].hidden)ms.push(v.map|0)}prefetch([...new Set(ms.flatMap(mapGroups))])}document.querySelectorAll('#clsList .cls').forEach(b=>{b.disabled=false;drawCard(b)});renderSlots()});
$('ctrlInfo').textContent=TOUCH?'Touch: touch anywhere on the left half to move (flick up to jump, down to talk), hold Attack, skills, Potion and Ether.Quests, Shop, Stats and Bag are in the top bar. A Talk button appears near people and gates. Progress saves in this browser.':'Keys: ←/→ or A/D move · Space jump · J or Z attack (hold) · K/L/I or X/C/V skills · U or Shift title skill · Q potion · E ether · O quests · P shop · T stats· B bag · F or ↓ talk / use gate · M map · Settings in the top bar. Progress saves in this browser.';

/* ---------- update ---------- */
function update(dt){
 T+=dt;S=stats();
 for(let i=timers.length-1;i>=0;i--){timers[i].t-=dt;if(timers[i].t<=0){const f=timers[i].f;timers.splice(i,1);f()}}
 // player
if(P.deadT>0){P.deadT-=dt;if(P.deadT<=0){P.x=MAPS[MAP].spawn;P.y=FLOOR;P.vx=P.vy=0;P.hp=S.mhp;P.sp=S.msp;P.inv_t=1.5}}
 else{
  P.inv_t-=dt;P.atkT-=dt;P.swing-=dt;P.atkA-=dt;P.hurtA-=dt;P.whirl=(P.whirl||0)-dt;P.guard=(P.guard||0)-dt;P.kbT-=dt;P.cds=P.cds.map(c=>Math.max(0,c-dt));
  P.sp=Math.min(S.msp,P.sp+(2.2+eff('int')*.18)*1.5*(1+.05*pl('focus'))*dt);
  if(P.dash>0){curMul=P.dashMul||1;P.dash-=dt;P.vx=P.dir*900;hitArea(rect({x:P.x,y:P.y,w:70,h:56}),2.4,{kb:200},P.dashHit);if(Math.random()<.6)fx.push({k:'p',x:P.x,y:P.y-rnd(5,45),vx:-P.dir*100,vy:0,life:.25,max:.25,c:'#ffd6cc',s:4})}
  else if(P.kbT<=0){let mv=(K.right?1:0)-(K.left?1:0);if(!mv&&Math.abs(JOY.x)>.18)mv=clamp(JOY.x*1.25,-1,1);if(mv)P.dir=Math.sign(mv);P.vx=mv*235*(1+.03*pl('fleet'))*((P.slowT=(P.slowT||0)-dt)>0?.6:1)}
  curMul=1;P.vy+=GRAV*dt;moveBody(P,dt);
  if(K.atk)cast(0);
   P.apT=(P.apT||0)-dt;if(P.apT<=0){if(P.ap&&P.pots>0&&P.hp<S.mhp*P.ap/100){usePot();P.apT=1.2}else if(P.ae&&(P.eths||0)>0&&P.sp<S.msp*P.ae/100){useEth();P.apT=1.2}}
if(MAPS[MAP].obj.some(o=>o.k==='heal'&&Math.abs(P.x-o.x)<110)){P.hp=Math.min(S.mhp,P.hp+S.mhp*.3*dt);P.sp=Math.min(S.msp,P.sp+S.msp*.3*dt)}
  hintTick(dt);P.anim+=dt*(Math.abs(P.vx)>1&&P.onG?9*Math.min(1.6,Math.abs(P.vx)/235):0);
 }
 for(const m of mobs)if(!m.dead)updMob(m,dt);
 for(let i=mobs.length-1;i>=0;i--)if(mobs[i].dead)mobs.splice(i,1);
 // projectiles
 for(let i=proj.length-1;i>=0;i--){const p=proj[i];curMul=p.skm||1;p.life-=dt;if(p.home){let b=null,bd=420;for(const m of mobs){if(m.dead||Math.sign(m.x-p.x)!==Math.sign(p.vx))continue;const dd=Math.abs(m.x-p.x);if(dd<bd){bd=dd;b=m}}if(b)p.vy+=((b.y-b.h/2-p.y)*5-p.vy)*dt*4}p.x+=p.vx*dt;p.y+=p.vy*dt;let dead=p.life<=0;
  if(p.k==='meteor'){if(p.y>=FLOOR-10){hitCircle(p.x,FLOOR-20,p.big?135:80,p.big?4.4:2.9,{kb:150,stun:p.big?1.2:0});if(p.well)addPZ({x:p.x,y:FLOOR-30,r:170,t:2,pull:220,tick:.5,mult:.3,col:'#c9a0ff',art:'fx_gwell'});if(p.big){shake=.3;if(IMG.fx_impact)anim('fx_impact',p.x,FLOOR+8,1.1,.5)}ring(p.x,FLOOR-14,80,'#bcd0ff',.4);anim('ember',p.x,FLOOR,1.7,.45);shake=Math.max(shake,.12);for(let k=0;k<10;k++)fx.push({k:'p',x:p.x,y:FLOOR-10,vx:rnd(-220,220),vy:rnd(-300,-60),life:.5,max:.5,c:k%2?'#bcd0ff':'#ffffff',s:5});dead=1}else if(Math.random()<.7)fx.push({k:'p',x:p.x,y:p.y,vx:rnd(-30,30),vy:-60,life:.3,max:.3,c:'#9fb4ff',s:5})}
  else{if(p.k==='rain'&&p.y>FLOOR)dead=1;
   const r={l:p.x-p.r,r:p.x+p.r,t:p.y-p.r,b:p.y+p.r};
   for(const m of mobs){if(m.dead||p.hit.has(m))continue;if(over(r,rect(m))){p.hit.add(m);dmgMob(m,p.mult,{kb:p.k==='gale'?220:90,dir:Math.sign(p.vx)||P.dir,slow:p.slow||0});if(p.k==='orb')ring(p.x,p.y,26,'#9fd0ff',.2);if(p.chain){let n=p.chain;const done=new Set([m]);while(n-->0){let b=null,bd=230;for(const o of mobs){if(o.dead||done.has(o))continue;const dd=Math.hypot(o.x-m.x,o.y-m.y);if(dd<bd){bd=dd;b=o}}if(!b)break;done.add(b);dmgMob(b,.6*p.mult,{});for(let q=0;q<6;q++)fx.push({k:'p',x:m.x+(b.x-m.x)*q/6,y:m.y-m.h/2+(b.y-b.h/2-m.y+m.h/2)*q/6,vx:0,vy:0,life:.25,max:.25,c:'#dff2ff',s:4})}}if(p.boom){dead=1;break}if(p.pc){p.pc--;if(p.pc<=0){dead=1;break}}else if(!p.pierce){dead=1;break}}}}
  if(dead){if(p.boom){hitCircle(p.x,p.y,130,2.4,{kb:200});ring(p.x,p.y,130,'#c9ffb0',.45);anim('ember',p.x,p.y+40,1.8,.45)}proj.splice(i,1)}}
 curMul=1;for(let i=eproj.length-1;i>=0;i--){const e=eproj[i];e.life-=dt;e.x+=e.vx*dt;if(Math.random()<.5)fx.push({k:'p',x:e.x,y:e.y,vx:0,vy:-40,life:.3,max:.3,c:'#7fe3ff',s:5});
  if(P.deadT<=0&&over({l:e.x-e.w/2,r:e.x+e.w/2,t:e.y-e.h/2,b:e.y+e.h/2},rect(P))){hurtP(e.dmg,e.x);e.life=0}if(e.life<=0)eproj.splice(i,1)}
 // loot
 for(let i=loot.length-1;i>=0;i--){const l=loot[i];l.t+=dt;if(!l.onG){l.vy+=GRAV*dt;moveBody(l,dt);if(l.onG)l.vx=0}
  const d=Math.hypot(P.x-l.x,P.y-20-l.y);if(l.t>.4&&d<130&&P.deadT<=0){l.x+=(P.x-l.x)*dt*8;l.y+=(P.y-20-l.y)*dt*8;l.onG=1}
   if(l.t>.4&&d<26&&P.deadT<=0&&collect(i))continue;
  if(l.t>40)loot.splice(i,1)}
 for(let i=fx.length-1;i>=0;i--){const f=fx[i];f.life-=dt;if(f.follow){f.x=P.x;f.y=P.y}if(f.k==='p'){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=500*dt}if(f.life<=0)fx.splice(i,1)}
 for(let i=nums.length-1;i>=0;i--){const n=nums[i];n.life-=dt;n.y-=40*dt;if(n.life<=0)nums.splice(i,1)}
 for(let i=log.length-1;i>=0;i--){log[i].life-=dt;if(log[i].life<=0)log.splice(i,1)}
  spawner(dt);updRush(dt);updTrial(dt);updMarks(dt);updPZ(dt);updPet(dt);fadeT=Math.max(0,fadeT-dt);comboT-=dt;if(comboT<=0)combo=0;
  nearObj=null;if(P.deadT<=0&&P.onG)for(const o of MAPS[MAP].obj){if(o.k!=='heal'&&o.k!=='deco'&&Math.abs(P.x-o.x)<60){nearObj=o;break}}
  if(TOUCH){const tt=$('tTalk'),want=nearObj?'grid':'none';if(tt.style.display!==want)tt.style.display=want}
cam+=((clamp(P.x-W*.42,0,WORLD-W))-cam)*Math.min(1,dt*8);shake=Math.max(0,shake-dt);
 const zi=zoneAt(P.x);if(zi!==curZone){curZone=zi;banner=3;if(zi>=0){P.vz=P.vz||{};P.vz[MAP+':'+zi]=1}}banner-=dt;
 P.playT=(P.playT||0)+dt;achT-=dt;if(achT<=0){achT=2;achCheck()}saveT+=dt;if(saveT>3){saveT=0;save()}
 // touch cooldown overlays
 if(TOUCH){document.querySelectorAll('.tb[data-p^="s"]').forEach(b=>{const i=+b.dataset.p[1],cd=skC(i).cd||1;b.firstElementChild.style.height=(P.cds[i]/cd*100)+'%'})}
}

/* ---------- render ---------- */
function hash(n){const s=Math.sin(n*127.1)*43758.5453;return s-Math.floor(s)}
function drawBg(zi){
const z=ZONES[zi],sx0=z.x0-cam,sx1=z.x1-cam;if(sx1<0||sx0>W)return;const BGL=z.bg;
 ctx.save();ctx.beginPath();ctx.rect(Math.max(0,sx0),0,Math.min(W,sx1)-Math.max(0,sx0),H);ctx.clip();
 const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,z.sky[0]);g.addColorStop(1,z.sky[1]);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  if(BGL&&BGL.every(l=>IMG[l[0]])){for(const [k,f,lh] of BGL){const im=IMG[k],h=lh||H,bw=Math.round(im.width*h/im.height),y=lh?FLOOR+26-h:0,off=cam*f,i0=Math.floor(off/bw)-1;
   for(let i=i0;i<i0+Math.ceil(W/bw)+3;i++){const bx=Math.round(i*bw-off);if(i&1){ctx.save();ctx.translate(bx+bw,0);ctx.scale(-1,1);ctx.drawImage(im,0,y,bw,h);ctx.restore()}else ctx.drawImage(im,bx,y,bw,h)}}
  ctx.restore();return}
 const par=(f,sp,fn)=>{const off=cam*f;const i0=Math.floor((off+sx0*f-200)/sp);for(let i=i0;i<i0+Math.ceil(W/sp)+4;i++)fn(i*sp-off,i)};
  if(z.fb===0){ctx.fillStyle='#ffffffaa';par(.1,260,(x,i)=>{ctx.beginPath();ctx.ellipse(x,70+hash(i)*60,60,18,0,0,7);ctx.fill()});
  ctx.fillStyle='#9a86c8';par(.3,420,(x,i)=>{const h=150+hash(i)*90;ctx.fillRect(x,FLOOR-h-40,90,h+40);ctx.beginPath();ctx.moveTo(x-12,FLOOR-h-40);ctx.lineTo(x+45,FLOOR-h-120);ctx.lineTo(x+102,FLOOR-h-40);ctx.fill();ctx.fillStyle='#ffe9a8';for(let w=0;w<3;w++)ctx.fillRect(x+18+w*22,FLOOR-h+10,10,16);ctx.fillStyle='#9a86c8'});
  // academy gate + fountain in world space
  const fx0=470-cam;ctx.fillStyle='#c9c2dc';ctx.fillRect(fx0-70,FLOOR-24,140,24);ctx.fillStyle='#7fd0ff';ctx.fillRect(fx0-60,FLOOR-20,120,10);ctx.fillStyle='#c9c2dc';ctx.fillRect(fx0-10,FLOOR-80,20,60);
  ctx.fillStyle='#bfe9ff';for(let k=0;k<6;k++){const a=T*3+k;ctx.fillRect(fx0+Math.sin(a)*30-2,FLOOR-84+Math.abs(Math.cos(a))*40,4,4)}
  ctx.fillStyle='#2c2452';ctx.font='600 17px "Starbell","StarbellNum",monospace';ctx.textAlign='center';ctx.fillText('Fountain · rest here to heal',fx0,FLOOR-96);
  const bx=150-cam;ctx.fillStyle='#6b4a2a';ctx.fillRect(bx-4,FLOOR-90,8,90);ctx.fillStyle='#f6ecd2';ctx.fillRect(bx-70,FLOOR-150,140,70);ctx.strokeStyle='#2c2452';ctx.lineWidth=3;ctx.strokeRect(bx-70,FLOOR-150,140,70);
  ctx.fillStyle='#2c2452';ctx.font='600 15px "Starbell","StarbellNum",monospace';ctx.fillText('Notice board',bx,FLOOR-132);ctx.fillText('Gardens → Library',bx,FLOOR-114);ctx.fillText('→ Bell Tower boss',bx,FLOOR-98)}
  if(z.fb===1){ctx.fillStyle='#c98a6a';par(.15,380,(x,i)=>{ctx.beginPath();ctx.ellipse(x,FLOOR+20,260,140+hash(i)*60,0,0,7);ctx.fill()});
  ctx.fillStyle='#7aa84a';par(.4,300,(x,i)=>{ctx.beginPath();ctx.ellipse(x,FLOOR+10,180,70+hash(i+3)*40,0,0,7);ctx.fill()});
  par(.7,140,(x,i)=>{ctx.fillStyle='#4d6b2f';ctx.fillRect(x,FLOOR-60,6,60);ctx.fillStyle=hash(i)>.5?'#ffd23f':'#ff8fb1';ctx.fillRect(x-8,FLOOR-74,22,16);ctx.fillStyle='#fff6';ctx.fillRect(x-4,FLOOR-70,6,6)})}
  if(z.fb===2){ctx.fillStyle='#3d2a3f';par(.3,220,(x,i)=>{ctx.fillRect(x,40,130,FLOOR);ctx.fillStyle='#ffd88a33';ctx.beginPath();ctx.arc(x+65,140,40,Math.PI,0);ctx.fill();ctx.fillRect(x+25,140,80,90);ctx.fillStyle='#3d2a3f'});
  par(.6,180,(x,i)=>{ctx.fillStyle='#4a2f22';ctx.fillRect(x,170,150,FLOOR-170);for(let r=0;r<5;r++){ctx.fillStyle='#2e1c14';ctx.fillRect(x,180+r*58,150,6);for(let b=0;b<12;b++){ctx.fillStyle=['#a33b3b','#3b6aa3','#d9a63b','#4f8a4a','#7a4aa3'][Math.floor(hash(i*31+r*7+b)*5)];ctx.fillRect(x+6+b*12,186+r*58+hash(b+r)*10,9,44-hash(b+r)*10)}}})}
  if(z.fb===3){ctx.fillStyle='#fff';par(.05,90,(x,i)=>ctx.fillRect(x,20+hash(i)*200,2,2));
  ctx.fillStyle='#2d2540';par(.25,500,(x,i)=>{ctx.fillRect(x+60,60,120,FLOOR);ctx.beginPath();ctx.arc(x+120,150,70,Math.PI,0);ctx.fill()});
  ctx.fillStyle='#b08a3a';par(.25,500,(x)=>{ctx.beginPath();ctx.moveTo(x+90,120);ctx.quadraticCurveTo(x+120,70,x+150,120);ctx.lineTo(x+160,170);ctx.lineTo(x+80,170);ctx.fill()});
  ctx.fillStyle='#3a3350';par(.55,260,(x,i)=>{const h=120+hash(i)*140;ctx.fillRect(x,FLOOR-h,40,h);ctx.fillRect(x-8,FLOOR-h,56,12)})}
 ctx.restore();
}
function drawPlat(){if(!artReady)return drawPlatOld();
 for(let zi=0;zi<ZONES.length;zi++){const z=ZONES[zi],a=Math.max(z.x0,cam-48),b=Math.min(z.x1,cam+W+48);if(b<=a)continue;const [tk,fk]=z.tk,top=IMG[tk],fill=IMG[fk];if(!top||!fill)continue;
  ctx.save();ctx.beginPath();ctx.rect(z.x0-cam,FLOOR-30,z.x1-z.x0,H);ctx.clip();
  const th=Math.round(48*top.height/top.width),fh=Math.round(48*fill.height/fill.width);for(let x=Math.floor(a/48)*48;x<b;x+=48){for(let y=FLOOR-4+th;y<H;y+=fh)ctx.drawImage(fill,x-cam,y,48,fh);ctx.drawImage(top,x-cam,FLOOR-4,48,th)}
  ctx.restore()}
 for(const p of PLAT){if(p.h>20||p.x+p.w<cam-40||p.x>cam+W+40)continue;const z=ZONES[Math.max(0,zoneAt(p.x))],k=z.tk[2],m=MAN[k],im=IMG[k];if(!im||!m)continue;const w=p.w+24,h=Math.min(m.fh*w/m.fw,z.ph||86);
  ctx.drawImage(im,0,0,m.fw,m.fh,p.x-12-cam,p.y-8,w,h)}}
function drawObjects(){if(!artReady)return;ctx.textAlign='center';ctx.font='600 16px "Starbell","StarbellNum",monospace';
 const lab=(t,x,y,hi)=>{if(x<-60||x>W+60)return;ctx.fillStyle=hi?'#f2c14e':'#1b1633cc';const w=ctx.measureText(t).width+14;x=clamp(x,w/2+4,W-w/2-4);ctx.fillRect(x-w/2,y-16,w,22);ctx.fillStyle=hi?'#1b1633':'#f6ecd2';ctx.fillText(t,x,y)};
 for(const o of MAPS[MAP].obj){const sx=o.x-cam;if(sx<-160||sx>W+160)continue;const gate=o.k==='warp'||o.k==='exit';
  if(o.k==='frame'){if(RA('vframe')){fr('vframe',0,sx,FLOOR-195,.8);continue}ctx.save();ctx.fillStyle='#1a1030';ctx.fillRect(sx-44,FLOOR-250,88,110);ctx.strokeStyle='#c9a060';ctx.lineWidth=6;ctx.strokeRect(sx-44,FLOOR-250,88,110);ctx.fillStyle='#8a4ad633';ctx.fillRect(sx-38,FLOOR-244,76,98);ctx.restore();continue}
  if(o.stair&&RA('stair_open'))fr(o.key&&!(P.lv>=(o.lv||0)&&P.mkey)?'stair_locked':'stair_open',0,sx,FLOOR+4,.66);else if(gate||o.k==='texit')drawWarp(sx);else if(o.art){if(o.ghost){ctx.save();ctx.globalAlpha=.72+.1*Math.sin(T*2)}fr(o.art,o.nf?o.f0+Math.floor(T*o.fps)%o.nf:Math.floor(T*(o.fps||0)),sx,FLOOR+(o.dy||2)-(o.ghost?12+6*Math.sin(T*1.6):0),o.s);if(o.ghost)ctx.restore()}
  const ly=FLOOR+(o.ly||(gate||o.k==='texit'?-200:-104));if(o.label)lab(o.label,sx,ly);if(nearObj===o)lab(TOUCH?'Tap Talk':(gate?'Press F to travel':'Press F to talk'),sx,ly-28,1)}}
function drawPlatOld(){for(const p of PLAT){const x0=Math.max(p.x,cam-10),x1=Math.min(p.x+p.w,cam+W+10);if(x1<=x0)continue;
  for(let zi=0;zi<ZONES.length;zi++){const z=ZONES[zi];const a=Math.max(x0,z.x0),b=Math.min(x1,z.x1);if(b<=a)continue;
  ctx.fillStyle=z.gr;ctx.fillRect(a-cam,p.y,b-a,p.h);ctx.fillStyle=z.top;ctx.fillRect(a-cam,p.y,b-a,6);ctx.fillStyle='#0002';for(let x=Math.ceil(a/24)*24;x<b;x+=24)ctx.fillRect(x-cam,p.y+10+(x%48?6:18),12,4)}}}
function bar(x,y,w,h,v,col,bg){ctx.fillStyle=bg||'#1b1633';ctx.fillRect(x,y,w,h);ctx.fillStyle=col;ctx.fillRect(x+2,y+2,(w-4)*clamp(v,0,1),h-4)}
const MSC={slime:.42,worm:.48,bat:.42,golem:.52,boss:.8};
function mobKey(m){const sk=MT[m.type].skin||m.type;switch(m.ai){
  case 'slime':{if(m.type==='frog')return [sk,!m.onG||m.tm<.25?1:0];if(m.type!=='slime')return [sk,!m.onG?2:m.tm<.25?1:0];const k=m.v?'slime_p':'slime_g';return [k,!m.onG?(m.v?1:2):m.tm<.25?(m.v?2:1):0]}
 case 'worm':return ['worm',m.anim*5];case 'bat':return m.dive>0&&IMG[sk+'_dive']?[sk+'_dive',0]:[sk,m.anim*9];
  case 'mimic':return [sk+(m.st==='disguise'&&RA(sk+'_disg')?'_disg':m.st==='lunge'?'_slam':m.st==='reveal'?'_wind':'_walk'),m.st==='walk'||m.st==='idle'?m.anim*4:0];
  case 'mirror':{const c=m.sk;return m.atkA>0?[c+'_attack',(1-m.atkA/.3)*3]:Math.abs(m.vx)>1?[c+'_walk',m.wd/26]:[c+'_idle',m.anim*2.2]}
  case 'golem':return m.st==='wind'?[sk+'_wind',0]:m.slamT>0?[sk+'_slam',0]:[sk+'_walk',Math.abs(m.vx)>1?m.wd/12:0];
  default:return m.castT>0&&IMG[sk+'_cast']?[sk+'_cast',0]:m.hurtT>0?[sk+'_hurt',0]:m.st==='wind'||m.st==='prep'?[sk+'_wind',0]:m.st==='leap'&&!m.onG?[sk+'_leap',0]:m.slamT>0?[sk+'_slam',0]:Math.abs(m.vx)>1?[sk+'_walk',m.wd/12]:[sk+'_idle',m.anim*2]}}
function drawTele(m){const sx=m.x-cam,a=.25+.2*Math.sin(T*18);ctx.save();
 if(m.boss&&(m.st==='prep'||(m.st==='leap'&&!m.onG))){const tx=m.tx-cam;ctx.fillStyle='rgba(255,60,60,'+a+')';ctx.beginPath();ctx.ellipse(tx,FLOOR,115,16,0,0,7);ctx.fill();ctx.strokeStyle='rgba(255,90,90,.9)';ctx.lineWidth=3;ctx.stroke();
  ctx.fillStyle='rgba(255,60,60,'+(a*.6)+')';ctx.fillRect(tx-115,FLOOR-8,230,8)}
 else if(m.boss&&m.st==='wind'){const L=m.cl||380,x0=m.dir>0?sx:sx-L;ctx.fillStyle='rgba(255,60,60,'+a+')';ctx.fillRect(x0,FLOOR-70,L,70);ctx.strokeStyle='rgba(255,90,90,.9)';ctx.lineWidth=3;ctx.strokeRect(x0,FLOOR-70,L,70);
  ctx.fillStyle='rgba(255,220,220,.9)';for(let k=1;k<4;k++){const ax=sx+m.dir*L*k/4;ctx.beginPath();ctx.moveTo(ax+m.dir*14,FLOOR-35);ctx.lineTo(ax-m.dir*6,FLOOR-48);ctx.lineTo(ax-m.dir*6,FLOOR-22);ctx.fill()}}
 else if(m.ai==='golem'&&m.st==='wind'){const cx=sx+m.dir*34,hw=MT[m.type].sweep?110:70;ctx.fillStyle='rgba(255,60,60,'+a+')';ctx.fillRect(cx-hw,FLOOR-60,hw*2,60);ctx.strokeStyle='rgba(255,90,90,.8)';ctx.lineWidth=2;ctx.strokeRect(cx-hw,FLOOR-60,hw*2,60)}
 else if(m.ai==='mirror'&&m.st==='wind'){const cx=sx+m.dir*50;ctx.fillStyle='rgba(255,60,60,'+a+')';ctx.fillRect(cx-70,FLOOR-70,140,70)}
 else if(m.ai==='mirror'&&m.st==='dashprep'){const L=330,x0=m.dir>0?sx:sx-L;ctx.fillStyle='rgba(255,60,60,'+a+')';ctx.fillRect(x0,FLOOR-60,L,60);ctx.strokeStyle='rgba(255,90,90,.9)';ctx.lineWidth=3;ctx.strokeRect(x0,FLOOR-60,L,60)}
 ctx.restore()}
const EK={};function eliteKey(k,e){const key=k+'#'+e;if(EK[key])return key;const im=IMG[k];if(!im)return k;const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d');g.drawImage(im,0,0);
 try{const d=g.getImageData(0,0,c.width,c.height),p=d.data;for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const r=p[i],gg=p[i+1],b=p[i+2],l=(r+gg+b)/3;
  if(e==='elite'){p[i]=Math.min(255,l*.5+r*.6+60);p[i+1]=gg*.55;p[i+2]=b*.55}else if(e==='shadow'){p[i]=l*.25+r*.12+20;p[i+1]=l*.12+gg*.08+8;p[i+2]=l*.4+b*.2+40}else if(e==='master'){p[i]=Math.min(255,r*1.08+28);p[i+1]=Math.min(255,gg*1.03+16);p[i+2]=b*.82}else{p[i]=Math.min(255,l*.6+150);p[i+1]=Math.min(255,l*.55+120);p[i+2]=Math.min(255,l*.35+30)}}g.putImageData(d,0,0)}catch(err){}
 IMG[key]=c;MAN[key]=MAN[k];EK[key]=1;return key}
function drawMob(m){
 if(artReady){drawTele(m);if(m.enr||m.sh>0){ctx.save();const ex=m.x-cam;if(m.enr){if(RA('fx_enrage')){ctx.globalAlpha=.6+.2*Math.sin(T*10);frC('fx_enrage',T*8,ex,m.y-m.h/2,Math.max(m.w,m.h)*1.7/170)}else{ctx.globalAlpha=.3+.15*Math.sin(T*10);ctx.fillStyle='#ff2a2a';ctx.beginPath();ctx.ellipse(ex,m.y-m.h/2,m.w*.95,m.h*.75,0,0,7);ctx.fill()}}if(m.sh>0&&RA('fx_shield')){ctx.globalAlpha=.5+.3*(m.sh/(m.mhp*.2));frC('fx_shield',T*6,ex,m.y-m.h/2,Math.max(m.w,m.h)*1.35/164)}else if(m.sh>0){ctx.globalAlpha=.35+.25*(m.sh/(m.mhp*.2));ctx.strokeStyle='#7fb8ff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(ex,m.y-m.h/2,Math.max(m.w,m.h)*.62,0,7);ctx.stroke()}ctx.restore()}const [k,i]=mobKey(m),sx=Math.round(m.x-cam),sy=Math.round(m.y),sc=MT[m.type].ms||MSC[m.type],fl=m.dir<0;
  ctx.fillStyle='#0003';ctx.beginPath();ctx.ellipse(sx,m.fly?FLOOR:sy,m.w/2,4,0,0,7);ctx.fill();
  const jx=m.st==='wind'||m.st==='prep'?Math.sin(T*60)*2:0,ek=m.elite?eliteKey(k,m.elite):k,es=(m.ai==='mirror'?.5:m.elite?sc*1.15:sc)*(m.mini?.62:1)*(m.kid?.75:1),ek2=m.ai==='mirror'?eliteKey(k,'shadow'):ek;
   if(!RA('mimic_disg')&&(m.st==='disguise'||m.st==='reveal')){ctx.save();ctx.fillStyle='#1a1030';ctx.fillRect(sx-40,sy-m.h-30,80,m.h+30);ctx.strokeStyle='#c9a060';ctx.lineWidth=6;ctx.strokeRect(sx-40,sy-m.h-30,80,m.h+30);ctx.restore()}
   const ph=MT[m.type].phase&&!(m.dive>0)&&(m.dcd||9)>.6;if(ph)ctx.globalAlpha=.35;if(m.elite==='shiny'){ctx.save();ctx.globalAlpha=.35+.2*Math.sin(T*6);ctx.fillStyle='#ffe680';ctx.beginPath();ctx.ellipse(sx,sy-m.h/2,m.w*.9,m.h*.75,0,0,7);ctx.fill();ctx.restore();if(Math.random()<.15)fx.push({k:'p',x:m.x+rnd(-20,20),y:m.y-rnd(0,m.h),vx:0,vy:-40,life:.6,max:.6,c:'#fff6b0',s:3})}XF=m.type==='frog'&&!m.onG?{sx:.92,sy:1.1}:k==='mimic_walk'&&Math.abs(m.vx)>1?{r:Math.sin(m.wd/9)*.06,dy:-Math.round(Math.abs(Math.sin(m.wd/9))*2)}:null;fr(ek2,i,sx+jx,sy+(m.fly?0:2),es,fl);ctx.globalAlpha=1;if(m.st==='reveal'&&!RA('mimic_disg')){ctx.fillStyle='#ff3030';ctx.fillRect(sx-14,sy-m.h*.78,8,6);ctx.fillRect(sx+6,sy-m.h*.78,8,6)}if(m.flash>0){ctx.globalAlpha=.7;fr(k,i,sx+jx,sy+(m.fly?0:2),es,fl,1);ctx.globalAlpha=1}
  XF=null;drawMobUi(m,sx,sy);return}
 const set=MS[m.type][m.v]||MS[m.type][0];let img=set[0];if(m.type==='bat')img=set[Math.floor(m.anim*8)%2];
 const sx=m.x-cam,sy=m.y;let bob=m.type==='slime'&&m.onG?Math.sin(m.anim*6)*1.5:0;
 ctx.save();ctx.translate(Math.round(sx),Math.round(sy));
 if(m.st==='wind'){ctx.translate(Math.sin(T*60)*2,0)}
 ctx.fillStyle='#0003';ctx.beginPath();ctx.ellipse(0,m.fly?FLOOR-sy:0,m.w/2,4,0,0,7);ctx.fill();
ctx.scale(m.ai==='worm'||m.ai==='boss'?-m.dir:m.dir,1);ctx.drawImage(img,-img.width/2,-img.height+bob);
 if(m.flash>0){ctx.globalAlpha=.75;const w=MS[m.type+'W'];ctx.drawImage(w,-w.width/2,-w.height+bob);ctx.globalAlpha=1}
 ctx.restore();drawMobUi(m,sx,sy)}
function drawMobUi(m,sx,sy){
 if(m.stun>0&&RA('fx_stun'))frC('fx_stun',T*8,sx,sy-m.h-14,.5);else if(m.stun>0){ctx.fillStyle='#ffd23f';for(let k=0;k<3;k++)ctx.fillRect(sx+Math.cos(T*6+k*2)*14-2,sy-m.h-10+Math.sin(T*6+k*2)*4,4,4)}
 if(m.slow>0){ctx.fillStyle='#9fe8ff88';ctx.fillRect(sx-m.w/2,sy-6,m.w,6)}
 if(!m.boss&&m.hp<m.mhp){bar(sx-22,sy-m.h-12,44,7,m.hp/m.mhp,'#ff5a5a')}
 if(SET.names&&!m.boss&&Math.abs(P.x-m.x)<200){ctx.fillStyle=m.elite==='shiny'?'#ffe680':m.elite?'#ff9a9a':'#fff';ctx.font='14px "Starbell","StarbellNum",monospace';ctx.textAlign='center';ctx.fillText(m.name+' Lv'+m.lvl,sx,sy-m.h-16)}
 if(m.af&&Math.abs(P.x-m.x)<260){ctx.font='12px "Starbell","StarbellNum",monospace';ctx.textAlign='center';const tags=m.af.map(a=>AFX[a]);const tw=tags.map(a=>ctx.measureText(a.n).width+10);let x0=sx-(tw.reduce((a,v)=>a+v,0)-4)/2;tags.forEach((a,j)=>{ctx.fillStyle=a.c;ctx.fillRect(x0,sy-m.h-46,tw[j]-4,15);ctx.fillStyle='#1b1633';ctx.fillText(a.n,x0+(tw[j]-4)/2,sy-m.h-34);x0+=tw[j]})}
}
function drawPlayer(){
 if(artReady){const c=spk(),sx=Math.round(P.x-cam),sy=Math.round(P.y);let k,i=0;
  {const g=!!P.onG;if(P._pg!==undefined&&g!==P._pg){if(!g&&P.vy<0)P.toAt=T;else if(g&&P.deadT<=0){P.ldAt=T;for(let q=0;q<6;q++)fx.push({k:'p',x:P.x+rnd(-14,14),y:P.y-2,vx:rnd(-70,70),vy:rnd(-60,-10),life:.3,max:.3,c:'#d9cbb0',s:4})}}P._pg=g}
  ctx.save();if(P.deadT>0)ctx.globalAlpha=.45;else if(P.inv_t>0&&Math.floor(T*20)%2)ctx.globalAlpha=.5;
  ctx.fillStyle='#0003';ctx.beginPath();ctx.ellipse(sx,sy,16,4,0,0,7);ctx.fill();
  if(P.whirl>0&&IMG.fx_whirl)k=(c==='ranger'&&IMG.fx_whirl_r)?'fx_whirl_r':'fx_whirl';else if(P.deadT>0||P.hurtA>0)k=c+'_hurt';else if(P.atkA>0){const e=ATKD-P.atkA;k=c+'_attack';i=e<.18?0:e<.25?1:2;if(c==='mage'&&i===0)k='mage_idle'}else if(!P.onG)k=c+'_jump';else if(Math.abs(P.vx)>1){k=c+'_walk';i=P.anim}else{k=c+'_idle';i=T*2.2}
  if(P.guard>0){if(IMG.aura){ctx.save();ctx.globalAlpha=.55+.25*Math.sin(T*6);fr('aura',T*4,sx,sy+22,.46);ctx.restore()}else{ctx.strokeStyle='#ffd23f99';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(sx,sy-30,30,42,0,0,7);ctx.stroke()}}
  const bob=k===c+'_walk'?Math.abs(Math.sin(P.anim*Math.PI))*2.5:0;{const lk=k.indexOf('fx_')===0?k:lookKey(k),pk=P.thesis&&c!==THSPR[P.cls]&&k.indexOf('fx_')!==0?eliteKey(lk,'master'):lk,tj=T-(P.toAt||-9),tl=T-(P.ldAt||-9);XF=k.indexOf('fx_')===0?null:tj<.12?{sx:.92,sy:1.08}:tl<.09?{sx:1.1,sy:.9}:k==='archer_walk'?{r:.05}:null;const gu=P.weapon&&P.deadT<=0&&!(P.hurtA>0)&&k.indexOf('fx_')!==0?(P.weapon.up||0):0;if(gu>=4)wGlow(ctx,k,i,sx,sy+2-bob,.5,P.dir<0,gu,0);fr(pk,i,sx,sy+2-bob,.5,P.dir<0);if(gu>=4)wGlow(ctx,k,i,sx,sy+2-bob,.5,P.dir<0,gu,1);if(P.hurtA>.25&&P.deadT<=0){const a0=ctx.globalAlpha;ctx.globalAlpha=a0*.85;fr(pk,i,sx,sy+2-bob,.5,P.dir<0,1);ctx.globalAlpha=a0}XF=null}ctx.restore();return}
 if(P.deadT>0){ctx.globalAlpha=.4}
 if(P.inv_t>0&&Math.floor(T*20)%2&&P.deadT<=0){ctx.globalAlpha=.45}
 const f=!P.onG?2:Math.abs(P.vx)>1?Math.floor(P.anim)%2:0,img=PSPR[P.cls][f],sx=Math.round(P.x-cam),sy=Math.round(P.y);
 ctx.fillStyle='#0003';ctx.beginPath();ctx.ellipse(sx,sy,15,4,0,0,7);ctx.fill();
 ctx.save();ctx.translate(sx,sy);ctx.scale(P.dir,1);ctx.drawImage(img,-18,-48);
 const sw=P.swing>0?P.swing/.18:0;
 if(P.cls==='blade'){ctx.save();ctx.translate(10,-24);ctx.rotate(-1.2+sw*2.2*(P.swing>0?1:0)+(P.swing>0?0:.6));ctx.fillStyle='#d9e3f0';ctx.fillRect(0,-3,30,6);ctx.fillStyle='#f2c14e';ctx.fillRect(-4,-6,5,12);ctx.restore()}
 if(P.cls=='archer'){ctx.strokeStyle='#8a5a2a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(10,-26,16,-1.2,1.2);ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(10+16*Math.cos(-1.2),-26+16*Math.sin(-1.2));ctx.lineTo(10-sw*8,-26);ctx.lineTo(10+16*Math.cos(1.2),-26+16*Math.sin(1.2));ctx.stroke()}
 if(P.cls=='mage'){ctx.fillStyle='#6b4a2a';ctx.fillRect(12,-40,4,36);ctx.fillStyle=sw>0?'#ffffff':'#9fd0ff';ctx.beginPath();ctx.arc(14,-44,6+sw*4,0,7);ctx.fill()}
 ctx.restore();ctx.globalAlpha=1;
}
function drawProj(p){const x=p.x-cam;
 if(artReady){const a=Math.atan2(p.vy,p.vx);
  if(p.k==='arrow'&&p.pc&&RA('fx_pierce')){frC('fx_pierce',T*12,x,p.y,.45,a);return}if(p.k==='arrow'||p.k==='rain'){frC('arrow',0,x,p.y,.5,a);return}
  if(p.k==='gale'){frC('gale',0,x,p.y,.5,0,p.vx<0);return}
  if(p.k==='orb'&&P.adv&&RA('fx_starbolt')){frC('fx_starbolt',T*12,x,p.y,.42,0,p.vx<0);return}if(p.k==='orb'){ctx.fillStyle='#9fd0ff44';ctx.beginPath();ctx.arc(x,p.y,14,0,7);ctx.fill();frC('orb',0,x,p.y,.42);return}
  if(p.k==='meteor'){if(p.big&&P.thesis&&RA('fx_meteor2')){frC('fx_meteor2',T*8,x,p.y-30,.6,0,p.vx<0);return}if(p.big&&IMG.comet){frC('comet',0,x-(p.vx>0?-30:30),p.y-40,.55,0,p.vx>0);return}frC('meteor',0,x,p.y,.8,0,p.vx>0);return}}
 if(p.k==='arrow'||p.k==='rain'){ctx.save();ctx.translate(x,p.y);ctx.rotate(Math.atan2(p.vy,p.vx));ctx.fillStyle='#f6ecd2';ctx.fillRect(-14,-1,22,3);ctx.fillStyle='#d9d2c0';ctx.fillRect(8,-3,6,7);ctx.fillStyle='#7ad19a';ctx.fillRect(-16,-3,5,7);ctx.restore()}
 else if(p.k==='gale'){ctx.fillStyle='#c9ffb0aa';ctx.beginPath();ctx.ellipse(x,p.y,30,10,0,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(x-18,p.y-2,36,4)}
 else if(p.k==='orb'){ctx.fillStyle='#9fd0ff66';ctx.beginPath();ctx.arc(x,p.y,13,0,7);ctx.fill();ctx.fillStyle='#e8f4ff';ctx.beginPath();ctx.arc(x,p.y,6,0,7);ctx.fill()}
 else if(p.k==='meteor'){ctx.fillStyle='#bcd0ff88';ctx.beginPath();ctx.arc(x,p.y,22,0,7);ctx.fill();ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(x,p.y,11,0,7);ctx.fill()}}
function render(){if(state!=='play'){const hc=$('hudCv');if(hc)hc.style.display='none'}
 ctx.save();if(shake>0&&SET.shake)ctx.translate(rnd(-6,6)*shake*2,rnd(-6,6)*shake*2);
 if(state!=='play'){cam=(Math.sin(performance.now()/6000)*.5+.5)*200}
  for(let zi=0;zi<ZONES.length;zi++)drawBg(zi);
 drawPlat();drawObjects();
 if(state==='play'){
  for(const l of loot){const x=l.x-cam,y=l.y-7+Math.sin(T*5+l.t)*2;
   if(artReady){if(l.k==='gold'){if(RA('fx_coin'))frC('fx_coin',T*8+l.x*.05,x,y-6,.32);else frC('ico_coin',0,x,y,.17)}else if(l.k==='pot')frC('ico_potion',0,x,y-2,.22);else if(l.k==='eth')frC('ico_ether',0,x,y-2,.22);else if(l.k==='page'){if(RA('ico_page'))frC('ico_page',0,x,y-12,.3);else frC('ico_scroll',0,x,y-2,.2)}else if(l.k==='shard')frC('ico_shard',0,x,y-2,.38);else{ctx.fillStyle=TIERC[l.item.t]+'66';ctx.beginPath();ctx.arc(x,y,13,0,7);ctx.fill();frC(itemIcon(l.item),0,x,y,.24)}continue}
   if(l.k==='gold'){ctx.fillStyle='#f2c14e';ctx.beginPath();ctx.arc(x,y,6,0,7);ctx.fill();ctx.fillStyle='#fff3';ctx.fillRect(x-3,y-3,3,3)}else if(l.k==='pot'){ctx.fillStyle='#ff6b8a';ctx.fillRect(x-5,y-4,10,10);ctx.fillStyle='#f6ecd2';ctx.fillRect(x-3,y-8,6,4)}else{ctx.fillStyle=['#c9c2dc','#d98a4a','#bfe9ff','#ffd23f','#ff8a8a'][l.item.t];ctx.fillRect(x-7,y-7,14,14);ctx.strokeStyle='#2c2452';ctx.lineWidth=2;ctx.strokeRect(x-7,y-7,14,14);ctx.fillStyle='#fff8';ctx.fillRect(x-4,y-4,4,4)}}
  for(const m of mobs)drawMob(m);
   drawPZ();drawMarks();drawPet();drawPlayer();if(P.deadT<=0){ctx.textAlign='center';const tx=Math.round(P.x-cam),ty=Math.round(P.y),ht=!!(P.ttl&&ACHM[P.ttl]);if(P.name){ctx.font='600 13px "Starbell","StarbellNum",monospace';ctx.lineWidth=3;ctx.strokeStyle='#1b1633';ctx.strokeText(P.name,tx,ty-(ht?98:84));ctx.fillStyle='#fff';ctx.fillText(P.name,tx,ty-(ht?98:84))}if(ht){ctx.font='13px "Starbell","StarbellNum",monospace';const tt='«'+ACHM[P.ttl].n+'»';ctx.fillStyle='#1b1633';ctx.fillText(tt,tx+1,ty-83);ctx.fillStyle='#ffd23f';ctx.fillText(tt,tx,ty-84)}}
for(const p of proj)drawProj(p);
  for(const e of eproj){if(artReady&&e.k==='archer'&&frC('arrow',0,e.x-cam,e.y,.5,e.vx<0?Math.PI:0))continue;if(artReady&&e.k==='mage'&&frC('orb',0,e.x-cam,e.y,.5))continue;if(artReady&&frC('shock',T*8,e.x-cam,e.y,.55,0,e.vx<0))continue;ctx.fillStyle='#7fe3ffaa';ctx.beginPath();ctx.ellipse(e.x-cam,e.y,16,13,0,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(e.x-cam-4,e.y-4,8,8)}
  for(const f of fx){const a=clamp(f.life/f.max,0,1);ctx.globalAlpha=a;
   if(f.k==='a'){ctx.globalAlpha=f.c?a:1;const n=MAN[f.key].n,i=Math.min(n-1,(1-a)*n);(f.key==='lvl'||f.key==='shock')?fr(f.key,i,f.x-cam,f.y,f.s,f.flip):frC(f.key,i,f.x-cam,f.y,f.s,0,f.flip)}
   else if(f.k==='p'){ctx.fillStyle=f.c;ctx.fillRect(f.x-cam-f.s/2,f.y-f.s/2,f.s,f.s)}
   else if(f.k==='r'){ctx.strokeStyle=f.c;ctx.lineWidth=4;ctx.beginPath();ctx.arc(f.x-cam,f.y,f.r*(1.15-a*.5),0,7);ctx.stroke()}
   else if(f.k==='s'){ctx.strokeStyle=f.c;ctx.lineWidth=f.big?8:5;ctx.beginPath();const st=f.d>0?-1.3:Math.PI+1.3-2.6;ctx.arc(f.x-cam,f.y,f.big?46:34,st,st+2.6*(1-a*.3));ctx.stroke()}
   ctx.globalAlpha=1}
  ctx.textAlign='center';if(SET.nums)for(const n of nums){ctx.globalAlpha=clamp(n.life*1.5,0,1);ctx.font=(n.crit?'700 22px':'600 17px')+' "Starbell","StarbellNum",monospace';ctx.fillStyle='#1b1633';ctx.fillText(n.t,n.x-cam+2,n.y+2);ctx.fillStyle=n.col;ctx.fillText(n.t,n.x-cam,n.y)}ctx.globalAlpha=1;
 }
  ctx.restore();
  if(fadeT>0){ctx.fillStyle='rgba(15,12,34,'+(fadeT/.6).toFixed(2)+')';ctx.fillRect(0,0,W,H)}
  if(state==='play')hud();
}
function qTarget(){const q=curQ();if(!q||qReady()||MAPS[MAP].hidden||TH.active)return null;
 const objIn=k=>{for(let i=0;i<MAPS.length;i++){const o=MAPS[i].obj.find(o=>o.k===k);if(o)return [i,o.x,null,o.label.split(' ·')[0]]}return null};
 const pick=(i,t)=>{for(const z of MAPS[i].zones){if(z.boss===t||(z.mobs||[]).includes(t))return [i,z.boss===t?z.bx:(z.x0+z.x1)/2,z,z.name]}return null};
 const zoneFor=t=>{let r=pick(MAP,t);if(r)return r;for(let i=0;i<MAPS.length;i++){if(!MAPS[i].hidden&&(r=pick(i,t)))return r}return null};
 let r=null;if(q.kill&&q.kill!=='any'){r=q.kill==='slime0'?[0,1800,MAPS[0].zones[1],MAPS[0].zones[1].name]:q.kill==='slime1'?[0,3700,MAPS[0].zones[2],MAPS[0].zones[2].name]:zoneFor(q.kill)}
 else if(q.map!=null)r=[q.map,0,null,''];else if(q.talk)r=objIn(q.talk);else if(q.pet)r=objIn('pets');else if(q.collect)r=zoneFor('blotling');else if(q.thesis&&P.lv>=40)r=objIn('lumen');
 if(!r)return null;if(r[0]!==MAP){const ws=MAPS[MAP].obj.filter(o=>o.k==='warp'),w=ws.find(o=>o.to===r[0])||ws.find(o=>o.to===0);return w?{x:w.x,lab:w.label.split(' ·')[0]}:null}
 const z=r[2];if(z&&!z.boss&&P.x>=z.x0&&P.x<=z.x1)return null;return {x:r[1],lab:r[3]}}
function drawQArrow(){if(!SET.qarrow||P.deadT>0)return;const t=qTarget();if(!t)return;const dx=t.x-P.x;if(Math.abs(dx)<120)return;const sx=t.x-cam,b=Math.sin(T*5)*4;ctx.save();ctx.font='600 14px "Starbell","StarbellNum",monospace';ctx.textAlign='center';
 if(sx>30&&sx<W-30){const y=FLOOR-215+b;ctx.fillStyle='#f2c14e';ctx.strokeStyle='#1b1633';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(sx-13,y-14);ctx.lineTo(sx+13,y-14);ctx.lineTo(sx,y+4);ctx.closePath();ctx.stroke();ctx.fill()}
 else{const R0=dx>0,ax=R0?W-26+b:26-b,ay=250;ctx.fillStyle='#1b1633cc';const lab='Quest: '+t.lab+' · '+Math.round(Math.abs(dx)/10)+'m',tw=ctx.measureText(lab).width+14,lx=R0?W-48-tw/2:48+tw/2;ctx.fillRect(lx-tw/2,ay-11,tw,22);ctx.fillStyle='#f6ecd2';ctx.fillText(lab,lx,ay+5);
  ctx.fillStyle='#f2c14e';ctx.strokeStyle='#1b1633';ctx.lineWidth=3;ctx.beginPath();const d=R0?1:-1;ctx.moveTo(ax+d*12,ay);ctx.lineTo(ax-d*8,ay-14);ctx.lineTo(ax-d*8,ay+14);ctx.closePath();ctx.stroke();ctx.fill()}ctx.restore()}
function hud(){
 const c=CL[P.cls],HX=Math.round((HUDL.w+24+W)/2);drawQArrow();
 hudPanel();
 const HY=Math.round(8+HUDL.h+4),HW=Math.round(HUDL.w);ctx.font='14px "Starbell","StarbellNum",monospace';ctx.textAlign='left';ctx.fillStyle='#1b1633c0';ctx.fillRect(8,HY,HW,22);{let hx=16;const ht=(t,c)=>{ctx.fillStyle=c;ctx.fillText(t,hx,HY+16);hx+=ctx.measureText(t).width+12};ht(P.gold.toLocaleString('en')+'g','#f2c14e');ht(P.pots+' pot','#ff9fb4');ht((P.eths||0)+' eth','#9fd0ff');if(P.pts)ht('+'+P.pts+' stat pts','#7dff9a')}
 {const q=curQ(),[qa,qb]=qProg(),rd=qa>=qb;ctx.fillStyle='#1b1633c0';ctx.fillRect(8,HY+24,HW,24);ctx.fillStyle=rd?'#7dff9a':'#f6ecd2';ctx.font='15px "Starbell","StarbellNum",monospace';ctx.fillText((rd?'✓ ':'Quest: ')+q.t+'  '+qa+'/'+qb+(rd?' · claim in Quests':''),16,HY+41)}
 if(MAP===AR()&&(RUSH.active||RUSH.done)){const w=RW[Math.min(RUSH.wave,RW.length)-1];ctx.textAlign='center';ctx.fillStyle='#1b1633d0';ctx.fillRect(HX-190,166,380,46);ctx.strokeStyle='#f2c14e';ctx.lineWidth=2;ctx.strokeRect(HX-190,166,380,46);
  ctx.font='600 17px "Starbell","StarbellNum",monospace';ctx.fillStyle='#ffd23f';ctx.fillText('Boss Rush · '+RT[RUSH.tier].n+' · '+fmtT(RUSH.t),HX,185);ctx.font='15px "Starbell","StarbellNum",monospace';ctx.fillStyle='#f6ecd2';
  ctx.fillText(RUSH.done?'Cleared!':w?'Wave '+RUSH.wave+'/'+RW.length+' · '+w.name+' · '+mobs.filter(m=>m.rush&&!m.dead).length+' left':RUSH.next>0?'Get ready… '+Math.ceil(RUSH.next):'',HX,204);ctx.textAlign='left'}
 if(P.guard>0){ctx.fillStyle='#ffd23f';ctx.fillText('Tolling Guard '+P.guard.toFixed(0)+'s',16,HY+68)}
 if(!TOUCH){const keys=SET.ks?['Z','X','C','V','Sh']:['J','K','L','I','U'],ns=P.adv?5:4;for(let i=0;i<ns;i++){const x=W-ns*66-12+i*66,y=H-74,lockd=P.cls==='fresh'&&i>=2;ctx.fillStyle='#1b1633d0';ctx.fillRect(x,y,58,58);ctx.strokeStyle=P.thesis?'#ffd23f':i===4?'#7dff9a':i===3?'#ff8a8a':'#f2c14e';ctx.lineWidth=P.thesis?4:2;ctx.strokeRect(x,y,58,58);
  ctx.textAlign='center';const sk=lockd?null:IMG[skIcon(i)];if(sk){ctx.drawImage(sk,x+1,y+1,56,56);ctx.fillStyle='#1b1633';ctx.fillRect(x+40,y+40,16,16)}
  ctx.fillStyle='#f6ecd2';ctx.font='13px "Starbell","StarbellNum",monospace';const nm=sk?[]:(lockd?['Lv 10']:skC(i).sk.split(' '));nm.forEach((w,j)=>ctx.fillText(w,x+29,y+24+j*13-(nm.length-1)*6));ctx.fillStyle='#f2c14e';ctx.fillText(keys[i],sk?x+48:x+29,y+53);
  if(i&&P.cds[i]>0){ctx.fillStyle='#000a';const f=P.cds[i]/skC(i).cd;ctx.fillRect(x,y+58*(1-f),58,58*f);ctx.fillStyle='#fff';ctx.font='600 16px "Starbell","StarbellNum",monospace';ctx.fillText(P.cds[i].toFixed(1),x+29,y+36)}}}
 ctx.textAlign='left';ctx.font='16px "Starbell","StarbellNum",monospace';log.forEach((l,i)=>{ctx.globalAlpha=clamp(l.life,0,1);ctx.fillStyle='#1b1633';ctx.fillText(l.t,21,H-(TOUCH?170:96)-(log.length-1-i)*20+1);ctx.fillStyle=l.col;ctx.fillText(l.t,20,H-(TOUCH?170:96)-(log.length-1-i)*20)});ctx.globalAlpha=1;
 if(banner>0&&curZone>=0){ctx.globalAlpha=clamp(banner,0,1);ctx.textAlign='center';ctx.font='700 30px "Starbell","StarbellNum",monospace';ctx.fillStyle='#1b1633';ctx.fillText(ZONES[curZone].name,HX+2,92);ctx.fillStyle='#f6ecd2';ctx.fillText(ZONES[curZone].name,HX,90);
  const z=ZONES[curZone];ctx.font='17px "Starbell","StarbellNum",monospace';ctx.fillText(z.safe?'Safe zone · Shop and Quests are in the top bar':z.arena?'Boss Rush · '+RT[RUSH.tier].n:z.trial?'Thesis Defence · face the worst version of yourself':z.boss?z.rec:'Monsters around Lv '+z.dlv,HX,114);ctx.globalAlpha=1}
 const b=mobs.find(m=>m.boss&&!m.dead);if(b&&ZONES[curZone]&&(ZONES[curZone].boss||ZONES[curZone].arena||ZONES[curZone].trial)){ctx.textAlign='center';bar(HX-200,150,400,16,b.hp/b.mhp,'#c43c6a');ctx.fillStyle='#f6ecd2';ctx.font='600 16px "Starbell","StarbellNum",monospace';ctx.fillText(b.name+' · Lv '+b.lvl+(ENR[b.type]?(b.enr?' · ENRAGED':' · enrage in '+fmtT(Math.max(0,ENR[b.type]-(b.age||0)))):''),HX,144)}
 if(combo>=5){ctx.textAlign='right';ctx.globalAlpha=clamp(comboT,0,1);ctx.font='700 34px "Starbell","StarbellNum",monospace';const ct=combo+' COMBO';ctx.fillStyle='#1b1633';ctx.fillText(ct,W-18,232);ctx.fillStyle=combo>=50?'#ff8a8a':combo>=20?'#ffd23f':'#f6ecd2';ctx.fillText(ct,W-20,230);
  const cb=Math.round(comboB()*100);if(cb){ctx.font='600 17px "Starbell","StarbellNum",monospace';ctx.fillStyle='#7dff9a';ctx.fillText('+'+cb+'% EXP',W-20,252)}ctx.globalAlpha=1}
 if(P.deadT>0){ctx.fillStyle='#0008';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.fillStyle='#f6ecd2';ctx.font='700 30px "Starbell","StarbellNum",monospace';ctx.fillText('You fainted…',W/2,H/2)}
}
try{document.fonts.load('16px Starbell');document.fonts.load('16px StarbellNum')}catch(e){}
let last=performance.now();
let errShown=0;function loop(now){requestAnimationFrame(loop);const dt=Math.min(.033,(now-last)/1000);last=now;try{if(state==='play'&&!paused){if(hitStop>0)hitStop=Math.max(0,hitStop-dt);else update(dt)}render()}catch(e){ctx.restore&&ctx.restore();if(!errShown++)console.error(e)}}
requestAnimationFrame(loop);
addEventListener('beforeunload',()=>{if(P)save()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&P)save()});
}
