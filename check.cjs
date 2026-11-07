const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const elements=new Map();let handler;
const noop=()=>{};const ctx=new Proxy({},{get:(_,key)=>key==="createRadialGradient"?()=>({addColorStop:noop}):noop,set:()=>true});
function el(id){if(!elements.has(id))elements.set(id,{style:{},setAttribute:noop,focus:noop,classList:{add:noop,remove:noop,toggle:noop},getBoundingClientRect:()=>({width:900,height:590}),getContext:()=>ctx,addEventListener:noop,querySelector:()=>el(id+'child')});return elements.get(id);}
const box={console,Math,JSON,devicePixelRatio:1,document:{getElementById:el,querySelectorAll:()=>[],addEventListener:(type,fn)=>handler=fn},window:{addEventListener:noop},localStorage:{getItem:()=>null,setItem:noop},ResizeObserver:class{observe(){}},requestAnimationFrame:noop,setInterval:noop,setTimeout:noop,clearTimeout:noop};vm.createContext(box);vm.runInContext(fs.readFileSync('dist/gallery.js','utf8'),box);vm.runInContext(fs.readFileSync('dist/abilities.js','utf8'),box);vm.runInContext(fs.readFileSync('dist/mobs.js','utf8'),box);vm.runInContext(fs.readFileSync('dist/game.js','utf8'),box);
box.handler=handler;vm.runInContext(`
const chooseWaveTrait=rollWaveTrait;rollWaveTrait=()=>{s.waveTrait=null;};begin();for(let i=0;i<600;i++)update(1/60);draw();
if(!Number.isFinite(hp)||enemies.length===0)throw Error('Combat simulation failed');
for(let j=1;j<=6;j++){s.garden=j;enemies=[];spawn(true);let b=enemies[0];b.cool=0;update(.016);draw();b.hp=0;update(.016);if(s.garden!==j+1)throw Error('Boss progression failed '+j);}
s.inventory=fresh().inventory;s.nectar=10000;tab='petals';render();addPetal(1,0);addPetal(1,0);if(item(1,0).n!==3)throw Error('Inventory');
s.xp=100;xp(0);if(s.level<2)throw Error('Level growth');
tab='research';render();$('rebirth').onclick();if(s.garden!==1||s.rebirth!==1||s.seeds===0)throw Error('Rebirth');
s.inventory=fresh().inventory;s.loadout=fresh().loadout;addPetal(1,0);addPetal(1,0);clearArena();hp=maxHP();running=true;
toggleInventory(true);const before=elapsed;frame(1000);if(elapsed!==before)throw Error('Inventory must pause combat');toggleInventory(false);
const click=dataset=>handler({target:{closest:()=>({dataset})}});
equipSlot=0;click({equip:'1,0'});if(s.loadout[0].t!==1||petalLife(0).cool!==8)throw Error('Equip cooldown');
click({equip:'1,0'});click({equip:'1,0'});const owned=s.loadout.filter(p=>p.t===1&&p.r===0).length;click({equip:'1,0'});if(s.loadout.filter(p=>p.t===1&&p.r===0).length!==owned)throw Error('Over-equipping');
clearArena();damagePetal(0,1e6);if(petalLife(0).hp!==0||petalLife(0).cool!==8)throw Error('Petal break');
spawnClock=100;for(let i=0;i<450;i++)update(.02);if(petalLife(0).cool!==0||petalLife(0).hp!==petalHP(s.loadout[0]))throw Error('Petal regrowth');
for(let i=0;i<10;i++)addPetal(2,0);click({fuse:'2,0'});craftBatch(true);if(!item(2,1)||item(2,0).n!==0)throw Error('Fusion');
clearArena();angle=0;shots=[{x:player.x+57,y:player.y,vx:0,vy:0,life:5,r:5}];const healthBefore=petalLife(0).hp;update(.001);if(shots.length!==0||petalLife(0).hp>=healthBefore)throw Error('Petal projectile interception');
console.log('PASS: inventory pause, equip limits, swap cooldown, break/regrowth, fusion and projectile blocking');
// Five-petal crafting protects equipped copies and creates no items with insufficient stock.
s.bestLevel=1;s.research.slots=0;s.inventory=[{t:0,r:0,n:9}];s.loadout=Array.from({length:5},()=>({t:0,r:0}));recipe=[0,0];craftBatch(true);if(item(0,1))throw Error('Craft used equipped petals');addPetal(0,0);craftBatch(false);if(item(0,0).n!==5||item(0,1).n!==1)throw Error('Craft accounting');
s.bestLevel=1;s.research.slots=0;s.level=4;s.xp=0;xp(needXP());if(slotCount()!==6||s.loadout.length!==6)throw Error('Level slot unlock');s.level=1;if(slotCount()!==6)throw Error('Permanent milestone');s.bestLevel=100;s.research.slots=100;syncSlots();if(slotCount()!==20||s.loadout.length!==20)throw Error('Slot cap');
// Exercise each ability in controlled combat.
s.bestLevel=1;s.research.slots=0;s.garden=1;s.loadout=[{t:8,r:0}];clearArena();angle=0;spawnClock=100;enemies=[{x:player.x+57,y:player.y,r:15,hp:1e5,max:1e5,speed:0,kind:0,boss:false,t:0,hit:0,slow:0}];update(.01);if(!enemies[0].poisonTime)throw Error('Poison application');const poisoned=enemies[0];s.loadout=[{t:0,r:0}];const prev=poisoned.hp;update(.1);if(poisoned.hp>=prev)throw Error('Poison ticks');
s.loadout=[{t:9,r:0}];clearArena();enemies=Array.from({length:4},(_,i)=>({x:player.x+70+i*20,y:player.y,r:12,hp:100,max:100,speed:0,kind:0,boss:false,t:0,hit:0,slow:0}));triggerHitAbility(0,enemies[0],player.x+57,player.y);if(enemies.some(e=>e.hp===100)||arcs.length!==4)throw Error('Chain lightning');
s.loadout=[{t:12,r:0}];clearArena();updateAbilities(.01,57);updateAbilities(5,57);if(summons.length!==2)throw Error('Summoning');draw();
s.loadout=[{t:10,r:0}];clearArena();if(activeCount(10)!==1)throw Error('Speed passive');damagePetal(0,1000);if(activeCount(10)!==0)throw Error('Broken passive');
s.loadout=[{t:11,r:0}];clearArena();angle=0;spawnClock=100;enemies=[{x:player.x+57,y:player.y,r:15,hp:1e5,max:1e5,speed:0,kind:0,boss:false,t:0,hit:0,slow:0}];const ex=enemies[0].x;update(.01);if(enemies[0].x<=ex)throw Error('Knockback');
s.rebirth=0;if(petalHP({t:0,r:0})!==7)throw Error('Reduced health');
// Every actual drop must match the corresponding gallery table, and all petals have a source.
const reachable=new Set();for(let k=0;k<MOB_SPECIES.length;k++){const mob=MOB_SPECIES[k],e={boss:mob.bossKind!==undefined,kind:mob.bossKind??mob.kind,tier:mob.tier};mob.drops.forEach(t=>reachable.add(t));s.mobDrops[mob.id]={};s.mobKills[mob.id]=0;recordMobKill(e);for(let n=0;n<100;n++)rollMobLoot(e);if(s.mobKills[mob.id]!==1)throw Error('Gallery kill count');if(Object.keys(s.mobDrops[mob.id]).some(t=>!mob.drops.includes(Number(t))))throw Error('Loot mismatch');if(e.boss&&Object.values(s.mobDrops[mob.id]).reduce((a,n)=>a+n,0)!==300)throw Error('Boss loot quantity');}if(reachable.size!==19)throw Error('Missing petal drop source');renderGallery();if(!$('mob-gallery').innerHTML.includes('Scarlet Ladybug'))throw Error('Gallery display');
s.garden=1;s.level=1;s.loadout=[{t:0,r:0}];clearArena();spawnClock=100;hp=30;update(1);if(hp<36)throw Error('Healing buff');if(needXP()!==20||quota()>7)throw Error('Progression buff');
s.loadout=[{t:15,r:0}];clearArena();hp=100;invuln=0;hurt(10);if(Math.abs(hp-91.2)>.01)throw Error('Aegis');
s.loadout=[{t:14,r:0}];clearArena();spawnClock=100;drops=[{x:player.x+250,y:player.y,n:1,xp:1}];const dropX=drops[0].x;update(.01);if(drops[0].x>=dropX)throw Error('Lodestone pickup');
s.loadout=[{t:13,r:0}];clearArena();angle=0;spawnClock=100;enemies=[{x:player.x+57,y:player.y,r:15,hp:1e5,max:1e5,speed:0,kind:0,boss:false,t:0,hit:0,slow:0}];update(.01);if(!enemies[0].burnTime)throw Error('Ember');
s.loadout=[{t:16,r:0}];clearArena();angle=0;spawnClock=100;hp=30;enemies=[{x:player.x+57,y:player.y,r:15,hp:1e5,max:1e5,speed:0,kind:0,boss:false,t:0,hit:0,slow:0}];update(.01);if(hp<=30.06)throw Error('Bloodroot');
const savedRandom=Math.random;Math.random=()=>0;s.loadout=[{t:17,r:0}];clearArena();enemies=[{x:player.x+100,y:player.y,r:12,hp:100,max:100,speed:0,kind:0,boss:false,t:0,hit:0,slow:0}];triggerHitAbility(0,enemies[0],player.x+57,player.y);updateAbilities(.2,57);if(enemies[0].hp>=100||novas.length!==1)throw Error('Starburst');draw();
// Starburst must damage exactly once as its ring crosses a target, kill, award loot and repeat.
s.garden=1;s.wave=1;s.waveKills=0;s.bestLevel=1;s.research.slots=0;s.level=1;s.loadout=[{t:17,r:0}];clearArena();angle=0;spawnClock=100;enemies=[{x:player.x+57,y:player.y,r:12,hp:20,max:20,speed:0,kind:0,boss:false,t:0,hit:0,slow:0}];const killBefore=s.kills;for(let i=0;i<30;i++)update(.02);if(enemies.length||s.kills!==killBefore+1)throw Error('Starburst kill/reward integration');
clearArena();enemies=[{x:player.x+150,y:player.y,r:12,hp:1000,max:1000,speed:0,kind:0,boss:false,t:0,hit:0,slow:0}];triggerHitAbility(0,enemies[0],player.x+57,player.y);updateAbilities(.3,57);const afterHit=enemies[0].hp;updateAbilities(.2,57);if(enemies[0].hp!==afterHit)throw Error('Repeated nova hit');for(let i=0;i<130;i++)updateAbilities(.02,57);triggerHitAbility(0,enemies[0],player.x+57,player.y);updateAbilities(.3,57);if(enemies[0].hp>=afterHit)throw Error('Starburst recast');
// Elites are stronger and use distinct attacks; champion projectiles reach combat.
s.garden=4;clearArena();spawn(false,0);spawn(false,1);spawn(false,2);const normal=enemies[0],elite=enemies[1],champ=enemies[2];if(elite.hp/(30+elite.kind*15)<=normal.hp/(30+normal.kind*15)||champ.hp/(30+champ.kind*15)<=elite.hp/(30+elite.kind*15))throw Error('Hard mob health');elite.cool=0;champ.cool=0;s.loadout=[{t:0,r:0}];update(.01);if(elite.charge<=0||shots.length<3)throw Error('Elite/champion attacks');draw();
if(lootProfile({boss:true},1).floor<2||lootProfile({tier:1},1).floor!==1||lootProfile({tier:2},1).floor!==2)throw Error('Loot rarity floors');if(lootProfile({boss:true},10).rolls!==6)throw Error('Late boss reward scaling');
s.garden=1;s.inventory=[];rollMobLoot({boss:true,kind:0});if(s.inventory.some(p=>p.r<2)||s.inventory.reduce((n,p)=>n+p.n,0)!==3)throw Error('Boss guaranteed rare drops');
s.loadout=[{t:18,r:0}];clearArena();if(Math.abs(orbitSpeed()-1.35)>.001)throw Error('Whirligig orbit bonus');damagePetal(0,100);damagePetal(0,Infinity);if(petalLife(0).hp!==Infinity||petalLife(0).cool!==0||Math.abs(orbitSpeed()-1.35)>.001||petalHealthRatio(0)!==1)throw Error('Unbreakable Whirligig');s.loadout=Array.from({length:20},()=>({t:18,r:0}));clearArena();if(orbitSpeed()!==4||orbitRadius(19,57)!==83)throw Error('Orbit rings and bonus cap');draw();
console.log('PASS: Starburst wave hits, kills, rewards, recasts, elite/champion stats and attacks, loot rarity floors, late-boss loot, Whirligig and 20-petal rendering');
console.log('PASS: gallery kill tracking, matching loot tables, every petal obtainable, boss rewards, healing, progression, Aegis, Lodestone, Ember, Bloodroot and Starburst');
console.log('PASS: protected batch crafting, permanent slot milestones, 20-slot cap, poison, lightning chains, summons, speed passive and knockback');
s.bestLevel=1;s.level=1;s.research.slots=0;s.inventory=[{t:1,r:0,n:2},{t:1,r:1,n:1},{t:0,r:0,n:2}];s.loadout=[{t:1,r:1},{t:1,r:0},{t:1,r:0},{t:0,r:0},{t:0,r:0}];clearArena();running=true;addPetal(1,2);if(s.loadout[1].r!==2||s.loadout.filter(p=>p.t===1&&p.r===2).length!==1)throw Error('Auto upgrade weakest slot');if(petalLife(1).cool!==RELOAD||item(1,0).n!==2)throw Error('Auto equip regrowth or retained inventory');addPetal(1,2,2);if(s.loadout.filter(p=>p.t===1&&p.r===2).length!==3)throw Error('Batch auto upgrade');const layout=JSON.stringify(s.loadout);addPetal(1,0);addPetal(2,3);if(JSON.stringify(s.loadout)!==layout)throw Error('Auto downgrade or unrelated replacement');
for(let garden=1;garden<=30;garden++){const profile=lootProfile({boss:true},garden);if(profile.chance!==1||profile.bonus!==.35||profile.rolls!==3+Math.min(3,Math.floor((garden-1)/3))||profile.floor!==Math.min(7,Math.floor((garden-1)/2)+2))throw Error('Boss drop profile changed');}if(lootProfile({tier:1},1).chance!==.8||lootProfile({tier:1},1).bonus!==.18||lootProfile({tier:2},1).bonus!==.25)throw Error('Elite adjustment');
s.garden=1;s.wave=1;s.waveKills=0;s.research.fortune=0;s.seeds=0;clearArena();die({boss:false,kind:0,tier:0,x:0,y:0});if(Math.abs(drops[0].xp-12*1.32)>.0001||drops[0].n!==12)throw Error('Reduced mob XP without nectar change');
s.bestLevel=100;s.research.slots=100;s.inventory=[{t:0,r:0,n:48}];s.loadout=Array.from({length:48},()=>({t:0,r:0}));petalState=Array.from({length:48},()=>({hp:1,cool:0}));equipSlot=47;syncSlots();if(s.loadout.length!==20||petalState.length!==20||equipSlot!==19||item(0,0).n!==48||available(item(0,0))!==28)throw Error('Old save cap migration loses petals');render();if(!$('slot-progress').textContent.includes('All 20'))throw Error('Slot cap display');const slotResearch=s.research.slots;click({upgrade:'slots'});if(s.research.slots!==slotResearch)throw Error('Research exceeds cap');
console.log('PASS: 20-slot migration preserves all owned petals and disables further slot research');
console.log('PASS: auto-equip weakest same-type slot, batch copy limits, retained petals, no downgrade, lower mob XP, elite tuning, unchanged boss drop profiles across 30 gardens');
s.garden=1;s.wave=1;s.rebirth=0;clearArena();for(let tier=0;tier<=2;tier++){spawn(false,tier);const e=enemies[enemies.length-1];if(Math.abs(e.hp-(30+e.kind*15)*(1+tier*2.5)*1.5)>.001||Math.abs(e.speed-(26+e.kind*8)*(1+tier*.2)*1.2)>.001)throw Error('Increased mob difficulty');}spawn(true);const newBoss=enemies[enemies.length-1];if(newBoss.hp!==975||newBoss.speed!==43.2)throw Error('Increased boss difficulty');
console.log('PASS: tougher health and speed for regular mobs, elites, champions and bosses');
const early=difficulty(1,1),later=difficulty(4,1),lateWave=difficulty(4,5);if(early.health!==1||later.health<6||later.damage<2||lateWave.health<=later.health||lateWave.damage<=later.damage||lateWave.attacks<=later.attacks||lateWave.speed<=later.speed)throw Error('Progressive difficulty curve');if(difficulty(100,5).speed>2.25||difficulty(100,5).attacks>2.5)throw Error('Difficulty speed limits');
console.log('PASS: sharply increasing garden and wave health, damage, speed, and attack pressure');
for(const type of [9,17]){s.garden=1;s.wave=1;s.bestLevel=1;s.research.slots=0;s.loadout=[{t:type,r:0}];clearArena();angle=0;spawnClock=100;enemies=[{x:player.x+150,y:player.y,r:12,hp:1000,max:1000,speed:0,kind:0,boss:false,t:0,hit:0,slow:0}];for(let j=0;j<5;j++)update(.02);if(arcs.length||novas.length||enemies[0].hp!==1000)throw Error('Special triggered without contact');angle=0;enemies[0].x=player.x+57;update(.001);if(type===9&&arcs.length!==1)throw Error('Thunderbell contact trigger');if(type===17&&novas.length!==1)throw Error('Starburst contact trigger');let effects=type===9?arcs.length:novas.length;triggerHitAbility(0,enemies[0],player.x+57,player.y);if((type===9?arcs.length:novas.length)<=effects)throw Error('Contact special still has a cooldown');effects=type===9?arcs.length:novas.length;damagePetal(0,1000);petalLife(0).ability=0;triggerHitAbility(0,enemies[0],player.x+57,player.y);if((type===9?arcs.length:novas.length)!==effects)throw Error('Broken petal special');}
s.rebirth=0;if(petalHP({t:17,r:0})!==25||petalHP({t:17,r:1})!==50)throw Error('Starburst health scaling');
s.loadout=[{t:17,r:0}];clearArena();Math.random=()=>.2;triggerHitAbility(0,{},0,0);if(novas.length)throw Error('Starburst triggered at the 20% cutoff');Math.random=()=>.199;triggerHitAbility(0,{},0,0);if(novas.length!==1)throw Error('Starburst failed below the 20% cutoff');Math.random=savedRandom;
console.log('PASS: Starburst and Thunderbell only activate on physical petal hits, allow immediate repeats, and stay inactive while broken');
s.loadout=[{t:18,r:0}];clearArena();spawnClock=100;for(let j=0;j<10;j++){damagePetal(0,1e20);update(.02);}render();draw();if(petalLife(0).hp!==Infinity||petalHealthRatio(0)!==1||!$('inventory-slots').innerHTML.includes('∞')||$('loadout').innerHTML.includes('NaN'))throw Error('Infinite health display or combat');
s.loadout=[{t:9,r:0}];clearArena();enemies=[{x:player.x+57,y:player.y,r:12,hp:1e6,max:1e6,speed:0,kind:0,boss:false,t:0,hit:0,slow:0}];petalLife(0).ability=99;const lightningBefore=enemies[0].hp;for(let j=0;j<10;j++)triggerHitAbility(0,enemies[0],player.x+57,player.y);if(arcs.length!==10||enemies[0].hp>=lightningBefore)throw Error('Unrestricted lightning');
console.log('PASS: no lightning cooldown, infinite Whirligig health, permanent orbit bonus, and valid infinity displays');
rollWaveTrait=chooseWaveTrait;s.garden=2;s.wave=3;s.waveTrait='horde';const baseQuota=4+s.wave*2+s.garden;if(quota()!==Math.ceil(baseQuota*1.5))throw Error('Horde quota');
s.waveTrait='elites';clearArena();Math.random=()=>0;spawn(false,1);const eliteBoost=enemies[0];s.waveTrait=null;spawn(false,1);if(eliteBoost.hp!==enemies[1].hp*1.75||eliteBoost.damageScale<=enemies[1].damageScale)throw Error('Elite Surge stats');
s.waveTrait='armored';spawn(true);const bossHealth=enemies[2].hp;s.waveTrait=null;spawn(true);if(enemies[3].hp!==bossHealth)throw Error('Trait changed boss stats');
s.waveTrait='horde';s.waveKills=quota()-1;die({boss:false,kind:0,tier:0,x:0,y:0});if(s.wave!==4||!waveTrait().name||s.waveTrait==='horde')throw Error('Wave did not get a new modifier');Math.random=savedRandom;
console.log('PASS: wave modifiers change horde quota and elite stats, leave bosses alone, and rotate on wave clear');
save();console.log('PASS: combat, drawing, six boss transitions, inventory, XP, research rendering, rebirth and saving');
`,box);



















