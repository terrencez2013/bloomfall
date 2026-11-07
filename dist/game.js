'use strict';
const $=id=>document.getElementById(id),TAU=Math.PI*2;
const TYPES=[['Daisy','✿','#f9faf0','A balanced little fighter.',1],['Rose','❀','#df8c91','Heavy petals with a dangerous edge.',1.65],['Cactus','✦','#719565','Slow-growing, hard-hitting spikes.',2.1],['Honey','⬡','#deb65e','Sweet rewards: +8% nectar per equipped petal.',.85],['Iris','✧','#a395cd','Quick orbit and a longer reach.',1.3],['Clover','☘','#6da580','Restores health while you explore.',.8],['Frost','❄','#83b9c2','Chills enemies on contact.',1.2],['Lotus','❋','#df9cbd','Rare beauty. Extraordinary damage.',2.8]];
TYPES.push(['Nightshade','☠','#99bd58','Poisons on contact: 65% petal DPS for 3 seconds.',.8],['Thunderbell','ϟ','#86cbea','On every contact, chains lightning through up to 4 enemies. No cooldown.',.9],['Dandelion','➶','#e7d692','Each active petal gives +8% movement and +15% orbit speed.',.75],['Ramroot','➤','#e4a06b','Repels mobs on contact. Bosses resist knockback.',1.15],['Broodbud','⬢','#ba9bd4','Summons a friendly beetle every 5s. Up to 2 per petal.',.5]);
TYPES.push(['Ember','♨','#ef9364','Contact ignites a 3s burn that spreads damage to nearby mobs.',1.1],['Lodestone','◈','#88b1a8','Doubles pickup reach and pulls nectar to you faster.',.7],['Aegis','◉','#9ab7ed','Each active shield reduces incoming damage by 12%, up to 60%.',.65],['Bloodroot','♥','#d47b8c','Contact damage heals you for 18% of damage dealt.',1.2],['Starburst','✺','#f0c97d','30% chance on hit to release a 220px shockwave for 350% damage. 12.5 base HP.',.85]);
TYPES.push(['Whirligig','≋','#74d3c4','Unbreakable: infinite health. Adds +35% orbit speed, plus 5% per rarity. Stacks up to +300%.',.7]);
const RELOAD=8;
const RARITIES=['Common','Unusual','Rare','Epic','Legendary','Mythic','Divine','Transcendent'],RC=['#879579','#6caa64','#629cc0','#a17fc2','#c9a147','#d58089','#6fbdb0','#c184cd'];
const BOSSES=[['Meadow Guardian','🐞','A charging ladybug. Watch for the red trail.'],['Queen of Thorns','🌹','Radial thorns leave small gaps. Keep moving.'],['Amber Empress','🐝','Calls in a buzzing swarm of protectors.'],['Mossback Titan','🐢','Heavy stomps ripple through the garden.'],['The Pale Weaver','🕷','A spiral of silk, a tightening orbit.'],['Eternal Bloom','🌸','The garden itself fights back. All patterns awaken.']];
const BIOMES=['Sunlit meadow','Clover hollow','Amber orchard','Moss cathedral','Moonlit thicket','Eternal conservatory','Scarlet wilderness','Crystal wetlands','Astral garden','Forgotten roots','Celestial canopy','The infinite bloom'];
const RESEARCH=[['Sharp edges','Petal damage +18% each level','damage',24],['Deep roots','Maximum health +22 each level','health',20],['Sweet tooth','Nectar and XP +12% each level','fortune',30],['Wind dancer','Movement +5%, orbit +6% each level','speed',28],['Wider bloom','An extra permanent petal slot (up to 20 total)','slots',100],['Second spring','Regeneration +1.2 HP per second','regen',35]];
function fresh(){return {level:1,xp:0,nectar:0,seeds:0,garden:1,wave:1,kills:0,rebirth:0,best:1,research:{damage:0,health:0,fortune:0,speed:0,slots:0,regen:0},inventory:[{t:0,r:0,n:5},{t:1,r:0,n:1},{t:5,r:0,n:1}],loadout:Array.from({length:5},()=>({t:0,r:0})),defeated:[],waveKills:0};}
let s=fresh();try{const data=JSON.parse(localStorage.getItem('bloomfall-v1'));if(data&&Array.isArray(data.inventory)&&data.research)s={...s,...data};}catch(e){}
if(!s.abilityPetals){for(let t=8;t<13;t++)s.inventory.push({t,r:0,n:1});s.abilityPetals=true;}s.bestLevel=Math.max(s.bestLevel||1,s.level);
s.mobKills=s.mobKills||{};s.mobDrops=s.mobDrops||{};
if(!s.expansionPetals){for(let t=13;t<18;t++){const p=s.inventory.find(q=>q.t===t&&q.r===0);if(p)p.n++;else s.inventory.push({t,r:0,n:1});}s.expansionPetals=true;}
if(!s.whirligigGift){const p=s.inventory.find(q=>q.t===18&&q.r===0);if(p)p.n++;else s.inventory.push({t:18,r:0,n:1});s.whirligigGift=true;}
let inventoryOpen=false,newPetals=0,petalState=[];
function petalHP(p){if(p.t===18)return Infinity;return Math.round([7,5,15,9,6,8,7,12,5,6,4,11,6,5,9,12,5,25,5][p.t]*Math.pow(2,p.r)*(1+s.rebirth*.15))*(p.t===17?.5:1);}
function petalLife(i){const p=s.loadout[i],key=p.t+','+p.r;let life=petalState[i];if(!life||life.key!==key)life=petalState[i]={key,hp:petalHP(p),cool:0};return life;}
function damagePetal(i,amount){if(s.loadout[i].t===18)return;const life=petalLife(i);if(life.cool>0)return;life.hp=Math.max(0,life.hp-amount);if(life.hp===0){life.cool=RELOAD;const p=s.loadout[i];burst(player.x,player.y,TYPES[p.t][2],7);}}
function toggleInventory(force){inventoryOpen=force===undefined?!inventoryOpen:force;keys={};pointer=null;$('inventory').classList.toggle('hidden',!inventoryOpen);$('inventory').setAttribute('aria-hidden',String(!inventoryOpen));if(inventoryOpen){newPetals=0;renderCollection();$('close-inventory').focus();}else $('open-inventory').focus();render();}
let saving=true;function save(){try{localStorage.setItem('bloomfall-v1',JSON.stringify(s));}catch(e){if(saving){toast('Storage unavailable. Keep this tab open to retain progress.');saving=false;}}}
let hp=maxHP(),running=false,paused=false,tab='garden',started=false,dead=false,equipSlot=0,elapsed=0,spawnClock=0,angle=0,hitFlash=0,last=0,uiClock=0,bossPending=false;
let enemies=[],shots=[],drops=[],particles=[],texts=[];let player={x:0,y:0},keys={},pointer=null;
const canvas=$('game'),ctx=canvas.getContext('2d');let w=900,h=590;
function maxHP(){return 100+(s.level-1)*9+s.research.health*22;}
function slotCount(){return Math.min(20,5+Math.floor((s.bestLevel||s.level)/3)+s.research.slots);}
function syncSlots(){if(s.loadout.length>20){s.loadout.length=20;petalState.length=20;}while(s.loadout.length<slotCount()){addPetal(0,0);s.loadout.push({t:0,r:0});}equipSlot=Math.min(equipSlot,s.loadout.length-1);}
function activeCount(t){return s.loadout.filter((p,i)=>p.t===t&&petalLife(i).cool===0).length;}
function petalAngle(i){const ring=Math.floor(i/16),n=Math.min(16,s.loadout.length-ring*16);return angle+(i%16)/n*TAU+ring*.15;}
function orbitRadius(i,base){return base+Math.floor(i/16)*26;}
function orbitSpeed(){return 1+activeCount(10)*.15+Math.min(3,s.loadout.reduce((v,p,i)=>v+(p.t===18&&petalLife(i).cool===0?.35+p.r*.05:0),0));}
function power(p){return 12*TYPES[p.t][4]*Math.pow(2.25,p.r)*(1+s.research.damage*.18)*(1+s.rebirth*.25)*(1+(s.level-1)*.045);}
function needXP(){return Math.floor(20*Math.pow(s.level,1.28));}
function petalHealthRatio(i){return s.loadout[i].t===18?1:petalLife(i).hp/petalHP(s.loadout[i]);}
function fmtPetalHP(n){return Number.isFinite(n)&&n<10000&&n%1!==0?n.toLocaleString():fmt(n);}
function fmt(n){if(n===Infinity)return "∞";return n>=1e6?(n/1e6).toFixed(1)+'m':n>=1e4?(n/1e3).toFixed(1)+'k':Math.floor(n).toLocaleString();}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('show'),3200);}
function item(t,r){return s.inventory.find(p=>p.t===t&&p.r===r);}
function autoEquipPetals(t,r,count=1){for(let n=0;n<count;n++){let slot=-1;for(let i=0;i<s.loadout.length;i++){const equipped=s.loadout[i];if(equipped.t===t&&equipped.r<r&&(slot<0||equipped.r<s.loadout[slot].r))slot=i;}if(slot<0)break;s.loadout[slot]={t,r};petalState[slot]={key:t+','+r,hp:running?0:petalHP({t,r}),cool:running?RELOAD:0};toast('Auto-equipped '+RARITIES[r]+' '+TYPES[t][0]+' in slot '+(slot+1));}}
function addPetal(t,r,count=1){newPetals+=count;let p=item(t,r);if(p)p.n+=count;else s.inventory.push({t,r,n:count});autoEquipPetals(t,r,count);}
function xp(n){s.xp+=n;while(s.xp>=needXP()){s.xp-=needXP();s.level++;s.bestLevel=Math.max(s.bestLevel||1,s.level);const oldSlots=s.loadout.length;syncSlots();if(s.loadout.length>oldSlots)toast("New petal slot unlocked!");hp=Math.min(maxHP(),hp+35);burst(player.x,player.y,'#dfc86d',25);toast('Level '+s.level+' · Growing stronger');}}
function cost(u){return Math.floor(u[3]*Math.pow(1.65,s.research[u[2]]));}
function render(){syncSlots();const trait=waveTrait();$('wave-trait').textContent=trait.name?trait.name+' · '+trait.text:'A random modifier is revealed when the wave starts.';$('slot-progress').textContent=slotCount()>=20?'All 20 petal slots unlocked':slotCount()+' / 20 slots · Next free slot at level '+(3*(Math.floor(s.bestLevel/3)+1))+' · Research adds more';if(tab==='crafting')renderCrafting(); $('nectar').textContent=fmt(s.nectar);$('seeds').textContent=fmt(s.seeds);$('level').textContent=s.level;$('cycle').textContent='· Rebirth '+s.rebirth;$('rank').textContent=['Little sprout','Meadow wanderer','Wild blossom','Garden sovereign','Astral bloom'][Math.min(4,Math.floor(s.level/8))];$('hptext').textContent=Math.ceil(Math.max(0,hp))+' / '+maxHP();$('hpbar').style.width=100*Math.max(0,hp)/maxHP()+'%';$('xptext').textContent=fmt(s.xp)+' / '+fmt(needXP())+' XP';$('xpbar').style.width=100*s.xp/needXP()+'%';$('kills').textContent=fmt(s.kills);$('power').textContent=fmt(s.loadout.reduce((a,p)=>a+power(p),0));$('biome').textContent=BIOMES[(s.garden-1)%12];$('zone').textContent='GARDEN '+String(s.garden).padStart(2,'0');$('wave').textContent='WAVE '+s.wave+' / 5';$('slots').textContent=slotCount()+' SLOTS · '+orbitSpeed().toFixed(2)+'× ORBIT';$('goal').textContent='Meet '+BOSSES[(s.garden-1)%6][0];$('goaldesc').textContent='Wave '+s.wave+' · '+s.waveKills+' / '+quota()+' wildlife. '+(s.wave===5?'The guardian is near.':'Keep growing to awaken the guardian.');$('milestones').innerHTML=Array.from({length:5},(_,i)=>'<i class="'+(i<s.wave-1?'done':'')+'"></i>').join('');$('status').textContent=paused?'Garden paused':running?'Collect · grow · repeat':'Ready to bloom';
 $('loadout').innerHTML=s.loadout.map((p,i)=>'<button class="petal-slot" data-slot="'+i+'" title="'+TYPES[p.t][0]+' · '+RARITIES[p.r]+' · '+fmt(power(p))+' DPS · '+fmtPetalHP(Math.min(petalHP(p),Math.ceil(petalLife(i).hp)))+'/'+fmtPetalHP(petalHP(p))+' HP; select slot to replace" style="border-color:'+RC[p.r]+';'+(i===equipSlot?'box-shadow:0 0 0 2px #91a47a55':'')+'">'+TYPES[p.t][1]+'<small>'+(petalLife(i).cool>0?Math.ceil(petalLife(i).cool)+'s':(i+1))+'</small><i class="slot-health" style="width:'+100*petalHealthRatio(i)+'%"></i></button>').join('');
 $('open-inventory').textContent='▦ Inventory [I]'+(newPetals?' · '+newPetals+' new':'');
 $('inventory-slots').innerHTML=s.loadout.map((p,i)=>'<button data-slot="'+i+'" aria-pressed="'+(i===equipSlot)+'" class="inventory-slot '+(i===equipSlot?'selected':'')+'">'+TYPES[p.t][1]+' <b>Slot '+(i+1)+'</b><small>'+TYPES[p.t][0]+' · '+fmt(power(p))+' DPS · '+fmtPetalHP(Math.min(petalHP(p),Math.ceil(petalLife(i).hp)))+'/'+fmtPetalHP(petalHP(p))+' HP</small></button>').join('');
 if(tab==='petals'||inventoryOpen)renderCollection();if(tab==='research')renderResearch();if(tab==='atlas')renderBosses();if(tab==='gallery')renderGallery();
}
function renderCollection(){ const html=s.inventory.slice().sort((a,b)=>b.r-a.r||a.t-b.t).filter(p=>p.n>0).map(p=>{const used=s.loadout.filter(q=>q.t===p.t&&q.r===p.r).length;return '<article class="card"><span class="symbol" style="color:'+TYPES[p.t][2]+';text-shadow:0 1px 2px #809471">'+TYPES[p.t][1]+'</span><span class="rarity" style="color:'+RC[p.r]+'">'+RARITIES[p.r]+' · '+p.n+' owned</span><h3>'+TYPES[p.t][0]+'</h3><p>'+TYPES[p.t][3]+'</p><div class="petal-stats"><b>⚔ '+fmt(power(p))+' <small>DPS</small></b><b>♡ '+fmtPetalHP(petalHP(p))+' <small>HP</small></b></div><small>'+used+' equipped · '+(p.n-used)+' available · 8s regrow</small><div><button data-equip="'+p.t+','+p.r+'" '+(used>=p.n?'disabled':'')+'>Equip in slot '+(equipSlot+1)+'</button><button data-fuse="'+p.t+','+p.r+'" '+(p.n-used<5||p.r===7?'disabled':'')+'>Craft ↗</button></div></article>';}).join('');$('collection').innerHTML=html;$('inventory-items').innerHTML=html;}
function renderResearch(){$('upgrades').innerHTML=RESEARCH.map(u=>'<article class="card"><span class="symbol">'+({damage:'✦',health:'♡',fortune:'✧',speed:'≋',slots:'❋',regen:'↟'}[u[2]])+'</span><small>PERMANENT · LEVEL '+s.research[u[2]]+'</small><h3>'+u[0]+'</h3><p>'+u[1]+'</p><button data-upgrade="'+u[2]+'" '+(s.nectar<cost(u)||(u[2]==='slots'&&slotCount()>=20)?'disabled':'')+'>'+((u[2]==='slots'&&slotCount()>=20)?'Fully grown':fmt(cost(u))+' nectar · Upgrade')+'</button></article>').join('');$('rebirth').textContent=s.best>=4?'Rebirth · +'+(s.best*3)+' seeds':'Rebirth · unlock at garden 4';$('rebirth').disabled=s.best<4;}
function renderBosses(){$('bosses').innerHTML=BOSSES.map((b,i)=>'<article class="card"><span class="symbol">'+b[1]+'</span><small>GARDEN '+(i+1)+' · '+(s.defeated.includes(i)?'DEFEATED ✓':'UNDISCOVERED')+'</small><h3>'+b[0]+'</h3><p>'+b[2]+'</p><small>'+(s.defeated.includes(i)?'Returns stronger every six gardens.':'Defeat to unlock the next garden.')+'</small></article>').join('');}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.tab){tab=b.dataset.tab;document.querySelectorAll('.page').forEach(p=>p.classList.toggle('hidden',p.id!==tab));document.querySelectorAll('.nav').forEach(p=>p.classList.toggle('active',p.dataset.tab===tab));keys={};pointer=null;render();}if(b.dataset.slot!==undefined){equipSlot=Number(b.dataset.slot);if(!inventoryOpen)toggleInventory(true);else render();}if(b.dataset.equip){const [t,r]=b.dataset.equip.split(',').map(Number);const p=item(t,r),used=s.loadout.filter(q=>q.t===t&&q.r===r).length;if(p&&p.n>used){if(s.loadout[equipSlot].t===t&&s.loadout[equipSlot].r===r)return;s.loadout[equipSlot]={t,r};petalState[equipSlot]={key:t+','+r,hp:0,cool:running?RELOAD:0};if(!running)petalState[equipSlot].hp=petalHP(s.loadout[equipSlot]);toast(TYPES[t][0]+' equipped in slot '+(equipSlot+1));equipSlot=(equipSlot+1)%slotCount();save();render();}}if(b.dataset.recipe||b.dataset.fuse){recipe=(b.dataset.recipe||b.dataset.fuse).split(',').map(Number);openCrafting();} if(b.dataset.upgrade){const u=RESEARCH.find(u=>u[2]===b.dataset.upgrade);if(s.nectar>=cost(u)&&!(u[2]==='slots'&&slotCount()>=20)){s.nectar-=cost(u);s.research[u[2]]++;if(u[2]==='slots')syncSlots();if(u[2]==='health')hp+=22;save();render();}}});
$('craft').onclick=()=>{if(s.nectar<25)return toast('Gather 25 nectar from wildlife first.');s.nectar-=25;const r=Math.min(7,Math.floor(Math.max(0,Math.log2(1+s.garden/3)))+(Math.random()<.12?1:0)),t=Math.floor(Math.random()*TYPES.length);addPetal(t,r);toast('Grew '+RARITIES[r]+' '+TYPES[t][0]);save();render();};
$('rebirth').onclick=()=>{if(s.best<4)return;s.seeds+=s.best*3;s.rebirth++;s.nectar=0;s.garden=1;s.wave=1;rollWaveTrait();s.waveKills=0;s.level=1;s.xp=0;hp=maxHP();clearArena();toast('Reborn. All petal power permanently increased by 25%.');save();render();};
function clearArena(){bossShake=0;summons=[];arcs=[];novas=[];petalState=[];enemies=[];shots=[];drops=[];bossPending=false;spawnClock=0;player={x:w/2,y:h/2};}
function begin(){if(!waveTrait().name){rollWaveTrait();save();}started=true;dead=false;running=true;paused=false;hp=maxHP();clearArena();$('overlay').style.display='none';$('pause').textContent='Ⅱ Pause';render();}
$('open-inventory').onclick=()=>toggleInventory();$('close-inventory').onclick=()=>toggleInventory(false);$('inventory').addEventListener('click',e=>{if(e.target===$('inventory'))toggleInventory(false);});
$('start').onclick=begin;$('pause').onclick=()=>{if(!started)return;paused=!paused;$('pause').textContent=paused?'▶ Resume':'Ⅱ Pause';render();};
window.addEventListener('keydown',e=>{if(e.code==='KeyG'&&!e.repeat){e.preventDefault();if(inventoryOpen)toggleInventory(false);showTab(tab==='gallery'?'garden':'gallery');return;}if(e.code==='KeyC'&&!e.repeat){e.preventDefault();if(inventoryOpen)toggleInventory(false);if(tab==='crafting')showTab('garden');else openCrafting();return;}if(e.code==='KeyI'&&!e.repeat){e.preventDefault();toggleInventory();return;}if(e.code==='Escape'&&inventoryOpen){toggleInventory(false);return;}if(inventoryOpen){if(e.code==='Tab'){const controls=Array.from($('inventory').querySelectorAll('button:not(:disabled)'));let index=controls.indexOf(document.activeElement);index=(index+(e.shiftKey?-1:1)+controls.length)%controls.length;e.preventDefault();controls[index]?.focus();}return;}if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();keys[e.code]=true;if(e.code==='KeyP')$('pause').click();});window.addEventListener('keyup',e=>keys[e.code]=false);window.addEventListener('blur',()=>{keys={};pointer=null;if(running&&!paused){paused=true;$('pause').textContent='▶ Resume';render();}});
canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);const r=canvas.getBoundingClientRect();pointer={x:e.clientX-r.left,y:e.clientY-r.top};});canvas.addEventListener('pointermove',e=>{if(pointer){const r=canvas.getBoundingClientRect();pointer={x:e.clientX-r.left,y:e.clientY-r.top};}});canvas.addEventListener('pointerup',()=>pointer=null);canvas.addEventListener('pointercancel',()=>pointer=null);canvas.style.touchAction='none';
function resize(){const r=canvas.getBoundingClientRect();w=r.width;h=r.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);player.x=Math.max(35,Math.min(w-35,player.x||w/2));player.y=Math.max(70,Math.min(h-50,player.y||h/2));}new ResizeObserver(resize).observe(canvas);
const WAVE_TRAITS={
  horde:{name:'Horde',text:'Bugs arrive in groups of three. 50% more kills to clear.',quota:1.5,interval:.55,batch:3,cap:48},
  armored:{name:'Armored',text:'Bugs have 60% more health.',health:1.6},
  rush:{name:'Rush',text:'Bugs move 40% faster.',speed:1.4},
  frenzy:{name:'Frenzy',text:'Bugs hit 50% harder and attack 30% more often.',damage:1.5,attacks:1.3},
  elites:{name:'Elite Surge',text:'More elites appear, with 75% more health and 35% more damage.',elite:.55,eliteHealth:1.75,eliteDamage:1.35}
};
function waveTrait(){return Object.hasOwn(WAVE_TRAITS,s.waveTrait)?WAVE_TRAITS[s.waveTrait]:{};}
function rollWaveTrait(){
  const choices=Object.keys(WAVE_TRAITS).filter(key=>key!==s.waveTrait&&(key!=='elites'||s.garden>=2||s.wave>=3));
  s.waveTrait=choices[Math.floor(Math.random()*choices.length)];
}
function quota(){return Math.ceil((4+s.wave*2+Math.min(10,s.garden))*(waveTrait().quota||1));}
function difficulty(garden=s.garden,wave=s.wave){const g=Math.max(0,garden-1),w=Math.max(0,wave-1);return {health:Math.pow(1.85,g)*Math.pow(1.1,w),damage:Math.pow(1.32,g)*Math.pow(1.06,w),speed:Math.min(2.25,1+g*.075+w*.035),attacks:Math.min(2.5,1+g*.1+w*.06)};}
let bossShake=0;
const bossMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)');
function bossImpact(boss,force){
  const intensity=1+Math.min(.8,(s.garden-1)*.09)+.7*(1-Math.max(0,boss.hp)/boss.max);
  if(!bossMotion?.matches)bossShake=Math.max(bossShake,Math.min(18,force*intensity));
  const count=bossMotion?.matches?5:Math.round(10+force*intensity*3);
  burst(boss.x,boss.y,'#ffbd56',count);
  if(!bossMotion?.matches)burst(boss.x,boss.y,'#fc7280',Math.ceil(count*.55));
}
function spawn(boss=false,forcedTier){const trait=boss?{}:waveTrait();const a=Math.random()*TAU,scale=difficulty().health*(1+s.rebirth*.2),kind=boss?(s.garden-1)%6:Math.floor(Math.random()*4);let x=w/2+Math.cos(a)*w*.55,y=h/2+Math.sin(a)*h*.55;x=Math.max(25,Math.min(w-25,x));y=Math.max(85,Math.min(h-55,y));const tier=boss?0:forcedTier??(s.garden>=4&&Math.random()<.14?2:(s.garden>=2||s.wave>=3)&&Math.random()<(trait.elite||.28)?1:0);const healthBoost=(trait.health||1)*(tier===1?(trait.eliteHealth||1):1);enemies.push({tier,attackScale:trait.attacks||1,damageScale:(boss?1.3:1+tier*.7)*(trait.damage||1)*(tier===1?(trait.eliteDamage||1):1),x,y,r:boss?38:13+kind*3+tier*4,hp:(boss?3600:30+kind*15)*scale*(1+tier*2.5)*1.5*healthBoost,max:(boss?3600:30+kind*15)*scale*(1+tier*2.5)*1.5*healthBoost,speed:(boss?43.2:(26+kind*8)*(1+tier*.2)*1.2)*difficulty().speed*(trait.speed||1),kind,boss,cool:2/difficulty().attacks/(trait.attacks||1),hit:0,slow:0,t:0,charge:0,vx:0,vy:0});if(boss)bossImpact(enemies[enemies.length-1],8);}
function burst(x,y,c,n=8){for(let i=0;i<n;i++){let a=Math.random()*TAU;particles.push({x,y,vx:Math.cos(a)*(20+Math.random()*80),vy:Math.sin(a)*(20+Math.random()*80),life:.5+Math.random()*.4,c});}}
function radial(e,count,speed,offset=0){for(let i=0;i<count;i++){const a=i/count*TAU+offset;shots.push({x:e.x,y:e.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,life:5,r:5,owner:e,damageScale:e.damageScale||1});}}
function die(e){s.kills++;recordMobKill(e);const reward=(e.boss?220:12+e.kind*4)*Math.pow(1.25,s.garden-1)*(1+s.research.fortune*.12+s.seeds*.005)*(1+(e.tier||0)*1.5);drops.push({x:e.x,y:e.y,n:reward,xp:reward*(e.boss?2.2:1.32)});burst(e.x,e.y,e.boss?'#c6a95e':'#9aaa70',e.boss?40:10);rollMobLoot(e);if(e.boss){bossImpact(e,11);const bi=(s.garden-1)%6;if(!s.defeated.includes(bi))s.defeated.push(bi);s.seeds+=s.garden;s.garden++;s.best=Math.max(s.best,s.garden);s.wave=1;rollWaveTrait();s.waveKills=0;bossPending=false;shots=[];hp=maxHP();toast('Guardian defeated! Welcome to '+BIOMES[(s.garden-1)%12]+'.');save();}else{s.waveKills++;if(s.waveKills>=quota()&&!bossPending){s.waveKills=0;if(s.wave<5){s.wave++;rollWaveTrait();hp=Math.min(maxHP(),hp+40);toast('Wave '+s.wave+' · '+(waveTrait().name||'The garden stirs'));save();}else{bossPending=true;spawn(true);toast(BOSSES[(s.garden-1)%6][0]+' has awakened!');}}}}
function hurt(amount,source){if(hp<=0||(source&&elapsed<(source.nextPlayerHit||0)))return;if(source)source.nextPlayerHit=elapsed+1;hp-=amount*((keys.ShiftLeft||keys.ShiftRight)? .45:1)*(1-Math.min(.6,activeCount(15)*.12));hitFlash=.12;burst(player.x,player.y,'#ce8d78');if(hp<=0){hp=0;running=false;dead=true;s.waveKills=0;save();$('overlay').style.display='flex';$('overlay').querySelector('h2').innerHTML='Even flowers<br>begin again.';$('overlay').querySelector('p').textContent='Your petals, level, nectar, and research are safe. Return with a full heart.';$('start').innerHTML='Bloom again ↗';render();}}
function update(dt){elapsed+=dt;bossShake=Math.max(0,bossShake-dt*30);for(let i=0;i<s.loadout.length;i++){const life=petalLife(i);if(life.cool>0){life.cool=Math.max(0,life.cool-dt);if(life.cool===0)life.hp=petalHP(s.loadout[i]);}else life.hp=Math.min(petalHP(s.loadout[i]),life.hp+dt*.6);}hitFlash=Math.max(0,hitFlash-dt);let dx=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0),dy=(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0);if(pointer){dx=pointer.x-player.x;dy=pointer.y-player.y;if(Math.hypot(dx,dy)<5)dx=dy=0;}let len=Math.hypot(dx,dy),speed=145*(1+s.research.speed*.05+activeCount(10)*.08);if(len){player.x+=dx/len*speed*dt;player.y+=dy/len*speed*dt;}player.x=Math.max(25,Math.min(w-25,player.x));player.y=Math.max(70,Math.min(h-50,player.y));hp=Math.min(maxHP(),hp+dt*(6+s.research.regen*1.2+activeCount(5)*3));angle+=dt*(1.8+s.research.speed*.11)*orbitSpeed();spawnClock-=dt;if(spawnClock<=0&&enemies.length<(waveTrait().cap||24)){const trait=waveTrait(),count=Math.min(trait.batch||1,(trait.cap||24)-enemies.length);spawnClock=Math.max(.5,1.6-s.garden*.04)*(trait.interval||1);for(let i=0;i<count;i++)spawn();}const extend=keys.Space||pointer,guard=keys.ShiftLeft||keys.ShiftRight,orbit=guard?30:extend?93:57;
 updateAbilities(dt,orbit);for(const e of enemies){e.t+=dt;if(e.burnTime>0){e.burnTime-=dt;for(const target of enemies){if(Math.hypot(target.x-e.x,target.y-e.y)<65){target.hp-=e.burnDps*dt;}}if(Math.random()<dt*10)burst(e.x,e.y,'#f19b55',1);}if(e.poisonTime>0){e.hp-=e.poisonDps*dt;e.poisonTime-=dt;if(Math.random()<dt*8)burst(e.x,e.y,"#9fd34e",1);}e.hit=Math.max(0,e.hit-dt);e.slow=Math.max(0,e.slow-dt);const ax=player.x-e.x,ay=player.y-e.y,d=Math.hypot(ax,ay)||1;let v=e.speed*(e.slow>0?.45:1);if(e.charge>0){e.x+=e.vx*dt;e.y+=e.vy*dt;e.charge-=dt;}else{e.x+=ax/d*v*dt;e.y+=ay/d*v*dt;}if(e.hp>0&&d<e.r+17)hurt((e.boss?39:12)*difficulty().damage*(e.damageScale||1),e);if(!e.boss&&e.tier){e.cool-=dt;if(e.cool<=0){e.cool=(e.tier===2?1.7:2.8)/difficulty().attacks/(e.attackScale||1);if(e.tier===1){e.vx=ax/d*250;e.vy=ay/d*250;e.charge=.45;}else{const a=Math.atan2(ay,ax);for(let j=-1;j<=1;j++)shots.push({x:e.x,y:e.y,vx:Math.cos(a+j*.2)*160,vy:Math.sin(a+j*.2)*160,life:4,r:5,owner:e,damageScale:e.damageScale/(1+e.tier*.7)});}}}if(e.boss){e.cool-=dt;if(e.cool<=0){e.cool=2.1/difficulty().attacks;e.hit=.15;bossImpact(e,6);if(e.kind===0||e.kind===5){e.vx=ax/d*280;e.vy=ay/d*280;e.charge=.75;}if([1,3,5].includes(e.kind))radial(e, e.kind===3?18:12,105,e.t);if(e.kind===2){spawn();spawn();spawn();}if(e.kind===4)radial(e,9,135,e.t*1.7);}}for(let i=0;i<s.loadout.length;i++){const p=s.loadout[i];if(petalLife(i).cool>0)continue;const a=petalAngle(i),r=orbitRadius(i,orbit)+(p.t===4?12:0),px=player.x+Math.cos(a)*r,py=player.y+Math.sin(a)*r;if(Math.hypot(px-e.x,py-e.y)<e.r+10){triggerHitAbility(i,e,px,py);damagePetal(i,(e.boss?25:10+e.kind*2.5)*difficulty().damage*(e.damageScale||1)*dt*(guard?.45:1));const dealt=Math.min(Math.max(0,e.hp),power(p)*dt*(guard?.6:1)*(extend?1.1:1));e.hp-=dealt;if(p.t===16)hp=Math.min(maxHP(),hp+dealt*.18);if(p.t===13){e.burnTime=3;e.burnDps=power(p)*.45;}e.hit=.08;if(p.t===6)e.slow=1;if(p.t===8){e.poisonTime=3;e.poisonDps=Math.max(e.poisonDps||0,power(p)*.65);}if(p.t===11){const k=e.boss?35:155;e.x-=ax/d*k*dt;e.y-=ay/d*k*dt;e.x=Math.max(15,Math.min(w-15,e.x));e.y=Math.max(75,Math.min(h-45,e.y));}if(Math.random()<dt*12)burst(px,py,RC[p.r],2);}}if(e.hp<=0){e.dead=true;die(e);}}
 enemies=enemies.filter(e=>!e.dead);for(const p of shots){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;for(let i=0;i<s.loadout.length&&p.life>0;i++){if(petalLife(i).cool>0)continue;const a=petalAngle(i),r=orbitRadius(i,orbit)+(s.loadout[i].t===4?12:0);if(Math.hypot(p.x-player.x-Math.cos(a)*r,p.y-player.y-Math.sin(a)*r)<15){damagePetal(i,12*difficulty().damage*(p.damageScale||1));p.life=0;burst(p.x,p.y,'#f0ca75',4);}}if(p.life>0&&Math.hypot(p.x-player.x,p.y-player.y)<20){hurt(19*difficulty().damage*(p.damageScale||1),p.owner||p);p.life=0;}}shots=shots.filter(p=>p.life>0&&p.x>-20&&p.x<w+20&&p.y>0&&p.y<h);
 for(const d of drops){const dx=player.x-d.x,dy=player.y-d.y,l=Math.hypot(dx,dy);if(l<(activeCount(14)?330:170)){const attraction=activeCount(14)?9:6;d.x+=dx*Math.min(1,dt*attraction);d.y+=dy*Math.min(1,dt*attraction);}if(l<24){const honey=1+s.loadout.filter((p,i)=>p.t===3&&petalLife(i).cool===0).length*.08;s.nectar+=d.n*honey;xp(d.xp);d.dead=true;}}drops=drops.filter(d=>!d.dead);if(drops.length>200)drops.splice(0,drops.length-200);for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;}particles=particles.filter(p=>p.life>0);uiClock+=dt;if(uiClock>.25){uiClock=0;render();} }
function circle(x,y,r,color,stroke){ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fillStyle=color;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke();}}
function flower(x,y,r=18,face=true){for(let i=0;i<6;i++){let a=i/6*TAU;circle(x+Math.cos(a)*r*.75,y+Math.sin(a)*r*.75,r*.53,'#fffdf0','#d4d5b3');}circle(x,y,r*.7,'#edcd70','#c4a951');if(face){circle(x-4,y-2,1.8,'#505334');circle(x+4,y-2,1.8,'#505334');ctx.beginPath();ctx.arc(x,y+1,4,0,Math.PI);ctx.strokeStyle='#62603c';ctx.stroke();}}
const GARDEN_PALETTES=[
  ['#efffba','#b9e779','#65ad65','#368d55','#ff74a5','#ffd260'],
  ['#e6ffc7','#a3e6ad','#52af9a','#248867','#e9a5ff','#fff285'],
  ['#fff4b2','#f0d087','#c7915f','#89603b','#f87789','#ffe67d'],
  ['#e5ffd0','#a6dba0','#64a88e','#2e7466','#ffad7d','#f8ef92'],
  ['#f8ebff','#cfc3f4','#9785cb','#66578f','#ff99d5','#b8fff3'],
  ['#fff0c9','#f4bbad','#c883a1','#9c587d','#f97494','#ffe698']
];
function gardenNoise(n){const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);}
function drawGardenBackdrop(){
  const [light,mid,edge,leaf,pink,gold]=GARDEN_PALETTES[(s.garden-1)%GARDEN_PALETTES.length];
  const meadow=ctx.createRadialGradient(w*.43,h*.32,0,w*.5,h*.5,Math.hypot(w,h)*.62);
  meadow.addColorStop(0,light);meadow.addColorStop(.58,mid);meadow.addColorStop(1,edge);
  ctx.fillStyle=meadow;ctx.fillRect(0,0,w,h);
  ctx.save();
  for(let i=0;i<56;i++){
    const x=gardenNoise(i*3)*w,y=gardenNoise(i*3+1)*h,sz=3+gardenNoise(i*3+2)*5;
    ctx.globalAlpha=.19;ctx.strokeStyle=leaf;ctx.lineWidth=1.3;
    ctx.beginPath();ctx.moveTo(x-sz,y+sz);ctx.quadraticCurveTo(x-sz,y,x-sz*1.3,y-sz*.2);
    ctx.moveTo(x,y+sz);ctx.quadraticCurveTo(x+sz*.45,y,x+sz*.9,y-sz*.6);ctx.stroke();
    if(i%5===0){ctx.globalAlpha=.53;circle(x+8,y-2,2.1,pink);circle(x+11,y+1,2.5,gold);}
  }
  for(let i=0;i<44;i++){
    const side=i%4,along=gardenNoise(i+80),inset=4+gardenNoise(i+170)*26;
    const x=side<2?(side===0?inset:w-inset):along*w;
    const y=side<2?along*h:(side===2?inset:h-inset);
    const r=4+gardenNoise(i+250)*6;
    ctx.globalAlpha=.34;ctx.fillStyle=leaf;
    ctx.beginPath();ctx.ellipse(x-6,y+5,r*1.65,r*.65,-.65,0,TAU);ctx.fill();
    ctx.beginPath();ctx.ellipse(x+7,y+7,r*1.65,r*.65,.75,0,TAU);ctx.fill();
    ctx.globalAlpha=.83;
    for(let j=0;j<5;j++){const a=j*TAU/5;circle(x+Math.cos(a)*r*.62,y+Math.sin(a)*r*.62,r*.48,i%3===0?gold:pink);}
    circle(x,y,r*.35,'#fff4b9');
  }
  for(let i=0;i<18;i++){
    const x=(gardenNoise(i+400)*w+elapsed*(4+i%4))%w;
    const y=gardenNoise(i+450)*h+Math.sin(elapsed*.7+i)*11;
    ctx.globalAlpha=.19+.21*(.5+.5*Math.sin(elapsed*1.5+i));
    circle(x,y,1+gardenNoise(i+500)*1.7,'#fffceb');
  }
  ctx.restore();
}
function draw(){drawGardenBackdrop();ctx.save();if(bossShake>0&&!bossMotion?.matches)ctx.translate(Math.sin(elapsed*91)*bossShake,Math.cos(elapsed*73)*bossShake*.65);for(const d of drops){circle(d.x,d.y,5,'#e4bf61','#c9ab57');circle(d.x-1,d.y-1,1.4,'#fff1b4');}drawAbilities();for(const e of enemies){drawMob(e);if(e.poisonTime>0)circle(e.x,e.y,e.r+3,'#00000000','#8abb49');if(e.hp<e.max&&!e.boss){ctx.fillStyle='#35462f44';ctx.fillRect(e.x-e.r,e.y-e.r-12,e.r*2,4);ctx.fillStyle='#e69165';ctx.fillRect(e.x-e.r,e.y-e.r-12,e.r*2*e.hp/e.max,4);}}for(const p of shots){circle(p.x,p.y,p.r,'#bc8977','#947059');}const orbit=(keys.ShiftLeft||keys.ShiftRight)?30:(keys.Space||pointer)?93:57;ctx.setLineDash([3,7]);ctx.strokeStyle='#80956626';ctx.beginPath();ctx.arc(player.x,player.y,orbit,0,TAU);ctx.stroke();ctx.setLineDash([]);circle(player.x+2,player.y+7,20,'#6b7b4520');ctx.globalAlpha=hitFlash>0?.5:1;flower(player.x,player.y);ctx.globalAlpha=1;s.loadout.forEach((p,i)=>{if(petalLife(i).cool>0)return;const a=petalAngle(i),r=orbitRadius(i,orbit)+(p.t===4?12:0),x=player.x+Math.cos(a)*r,y=player.y+Math.sin(a)*r;circle(x+1,y+3,8,'#5d75451a');circle(x,y,10,TYPES[p.t][2],RC[p.r]);ctx.font='15px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=p.t===0?'#bba563':'#fffaf0';ctx.fillText(TYPES[p.t][1],x,y+1);ctx.fillStyle='#44563844';ctx.fillRect(x-10,y+14,20,3);ctx.fillStyle=petalHealthRatio(i)>.3?'#6eaa67':'#d97562';ctx.fillRect(x-10,y+14,20*petalHealthRatio(i),3);});for(const p of particles){ctx.globalAlpha=Math.max(0,p.life);circle(p.x,p.y,2.5,p.c);}ctx.globalAlpha=1;ctx.restore();const boss=enemies.find(e=>e.boss);$('bossbar').style.display=boss?'block':'none';if(boss){$('bossname').textContent=BOSSES[boss.kind][0]+' · '+fmt(boss.hp)+' HP';$('bossfill').style.width=100*Math.max(0,boss.hp)/boss.max+'%';}}
function frame(time){const dt=Math.min(.04,(time-last)/1000||.016);last=time;if(running&&!paused&&!inventoryOpen&&tab==='garden')update(dt);if(tab==='garden')draw();requestAnimationFrame(frame);}setInterval(save,5000);window.addEventListener('pagehide',save);resize();syncSlots();render();requestAnimationFrame(frame);



















