let novas=[];
// The gallery and actual loot rolls share this single table.
const MOB_SPECIES=[
 {id:'mob0',name:'Scarlet Ladybug',icon:'🐞',color:'#e5a18a',drops:[0,1,5,10,16],detail:'A spotted shell and a determined little scuttle.'},
 {id:'mob1',name:'Meadow Bee',icon:'🐝',color:'#edd18a',drops:[3,4,9,12,17],detail:'Golden stripes, quick wings, and a taste for nectar.'},
 {id:'mob2',name:'Jade Beetle',icon:'🪲',color:'#9ecbb3',drops:[2,6,11,14,15],detail:'An iridescent shell hides a sturdy garden scavenger.'},
 {id:'mob3',name:'Silk Spider',icon:'🕷',color:'#c1a6d1',drops:[7,8,12,13,16],detail:'A violet hunter weaving between the flowers.'},
 {id:'boss0',name:'Meadow Guardian',icon:'🐞',color:'#dca086',drops:[0,1,10,11,16]},
 {id:'boss1',name:'Queen of Thorns',icon:'🌹',color:'#dda1ad',drops:[1,2,8,13,16]},
 {id:'boss2',name:'Amber Empress',icon:'🐝',color:'#e9c67f',drops:[3,9,12,14,17]},
 {id:'boss3',name:'Mossback Titan',icon:'🐢',color:'#a9c295',drops:[2,5,6,11,15]},
 {id:'boss4',name:'The Pale Weaver',icon:'🕷',color:'#baa4cb',drops:[4,7,8,12,16]},
 {id:'boss5',name:'Eternal Bloom',icon:'🌸',color:'#deb5ce',drops:[7,9,13,15,17]}
];

MOB_SPECIES.forEach((mob,i)=>{if(i>=4)mob.bossKind=i-4;else mob.kind=i;mob.tier=0;});
MOB_SPECIES[1].drops.push(18);MOB_SPECIES[6].drops.push(18);
for(let tier=1;tier<=2;tier++)for(let kind=0;kind<4;kind++){const base=MOB_SPECIES[kind];MOB_SPECIES.push({...base,id:'mob'+kind+'tier'+tier,name:(tier===1?'Elite ':'Champion ')+base.name,tier,kind,detail:tier===1?'An armored hunter that lunges at your flower. 3.5× health and 1.7× contact damage.':'A formidable hunter with three-way ranged attacks. 6× health and 2.4× contact damage.',color:tier===1?'#dfc189':'#c7a2de'});}
function mobSpecies(e){return MOB_SPECIES.find(m=>e.boss?m.bossKind===e.kind:m.bossKind===undefined&&m.kind===e.kind&&m.tier===(e.tier||0));}
function lootProfile(e,garden=s.garden){const tier=e.tier||0,base=Math.floor((garden-1)/2);return {floor:Math.min(7,base+(e.boss?2:tier)),chance:e.boss||tier===2?1:tier===1?.8:.65,rolls:e.boss?3+Math.min(3,Math.floor((garden-1)/3)):tier===2?2:1,bonus:e.boss?.35:tier===2?.25:tier===1?.18:.15};}
function recordMobKill(e){const id=mobSpecies(e).id;s.mobKills[id]=(s.mobKills[id]||0)+1;}
function rollMobLoot(e){const species=mobSpecies(e),profile=lootProfile(e);for(let i=0;i<profile.rolls;i++){if(Math.random()>=profile.chance)continue;const t=species.drops[Math.floor(Math.random()*species.drops.length)],r=Math.min(7,profile.floor+(Math.random()<profile.bonus?1:0));addPetal(t,r);const log=s.mobDrops[species.id]||(s.mobDrops[species.id]={});log[t]=(log[t]||0)+1;if(e.boss||e.tier||r>1)toast('Found '+RARITIES[r]+' '+TYPES[t][0]+'!');}}
function renderGallery(){let discovered=0;$('mob-gallery').innerHTML=MOB_SPECIES.map(mob=>{const kills=s.mobKills[mob.id]||0,boss=mob.bossKind!==undefined,legacy=boss&&s.defeated.includes(mob.bossKind),known=kills>0||legacy;if(known)discovered++;const log=s.mobDrops[mob.id]||{},profile=lootProfile({boss,kind:boss?mob.bossKind:mob.kind,tier:mob.tier});return '<article class="card mob-card '+(known?'':'undiscovered')+'"><div class="mob-portrait" style="--mob-color:'+mob.color+'">'+(known?mob.icon:'?')+'</div><small>'+(boss?'GUARDIAN':mob.tier===2?'CHAMPION':mob.tier===1?'ELITE':'WILDLIFE')+' · '+(known?'DISCOVERED':'UNDEFEATED')+'</small><h3>'+(known?mob.name:'Unknown creature')+'</h3><p>'+(known?(mob.detail||BOSSES[mob.bossKind][2]):'Defeat this creature to reveal its name and drops.')+'</p><div class="gallery-count"><b>'+fmt(kills)+'</b> kills recorded'+(legacy&&kills===0?' · defeated before this update':'')+'</div>'+(known?'<h4>Possible petal drops</h4><div class="loot-list">'+mob.drops.map(t=>'<div><span style="color:'+TYPES[t][2]+';text-shadow:0 1px 2px #76836e">'+TYPES[t][1]+'</span><b>'+TYPES[t][0]+'</b><small>'+fmt(log[t]||0)+' found</small></div>').join('')+'</div><p class="loot-rate">'+profile.rolls+' roll(s) · '+Math.round(profile.chance*100)+'% drop chance per roll · equally likely types<br><b>At garden '+s.garden+': '+RARITIES[profile.floor]+' or better</b> · '+Math.round(profile.bonus*100)+'% chance of +1 rarity (cap: Transcendent)</p>':'<div class="locked-loot">? &nbsp; ? &nbsp; ?<small>Loot table undiscovered</small></div>')+'</article>';}).join('');$('gallery-summary').textContent=discovered+' / '+MOB_SPECIES.length+' species discovered · '+fmt(Object.values(s.mobKills).reduce((a,n)=>a+n,0))+' kills recorded';}

