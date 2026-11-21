const HIT_VOLUME=.055;
let gameAudio=null,gameAudioBus=null,mulchBuffers=null,crunchVariation=0,soundMuted=false,lastPetalSound=-Infinity,lastPlayerSound=-Infinity;
try{soundMuted=localStorage.getItem('bloomfall-muted')==='true';}catch{}
// Short irregular noise grains imitate mulch and dry leaf crunches.
function makeMulchBuffer(context,heavy){
  const duration=heavy?.17:.11,buffer=context.createBuffer(1,Math.ceil(context.sampleRate*duration),context.sampleRate),data=buffer.getChannelData(0);
  let seed=heavy?731:347,brown=0;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<data.length;i++){
    const t=i/context.sampleRate,noise=random()*2-1;brown=(brown+noise*.16)*.86;
    const grains=Math.pow(Math.max(0,Math.sin(t*(heavy?310:450))),10);
    const attack=Math.min(1,t/.002),decay=Math.exp(-t/(heavy?.045:.029));
    data[i]=Math.max(-1,Math.min(1,(brown*.95+noise*(.12+grains*.38))*attack*decay));
  }
  return buffer;
}
function unlockGameAudio(){try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;if(!gameAudio){gameAudio=new Audio();gameAudioBus=gameAudio.createGain();gameAudioBus.gain.value=soundMuted?0:HIT_VOLUME;const limiter=gameAudio.createDynamicsCompressor();limiter.threshold.value=-18;limiter.ratio.value=8;gameAudioBus.connect(limiter);limiter.connect(gameAudio.destination);mulchBuffers={petal:makeMulchBuffer(gameAudio,false),player:makeMulchBuffer(gameAudio,true)};}if(gameAudio.state==='suspended')gameAudio.resume().catch(()=>{});}catch{}}
function renderSoundButton(){const b=document.getElementById('sound-toggle');if(b){b.textContent=soundMuted?'♪ Sound off':'♫ Sound on';b.setAttribute('aria-pressed',String(!soundMuted));}}
function toggleGameSound(){soundMuted=!soundMuted;unlockGameAudio();if(gameAudioBus)gameAudioBus.gain.value=soundMuted?0:HIT_VOLUME;try{localStorage.setItem('bloomfall-muted',String(soundMuted));}catch{}renderSoundButton();}
function playHitSound(kind){
  if(soundMuted||!gameAudio||!mulchBuffers||gameAudio.state!=='running')return;
  const now=gameAudio.currentTime,petal=kind==='petal';
  if(now-(petal?lastPetalSound:lastPlayerSound)<(petal?.055:.02))return;
  if(petal)lastPetalSound=now;else lastPlayerSound=now;
  try{
    const source=gameAudio.createBufferSource(),filter=gameAudio.createBiquadFilter(),gain=gameAudio.createGain();
    source.buffer=mulchBuffers[petal?'petal':'player'];source.playbackRate.value=.92+(crunchVariation++%5)*.04;
    filter.type='lowpass';filter.frequency.value=petal?2400:1600;filter.Q.value=.5;
    gain.gain.value=petal?.65:.85;
    source.connect(filter);filter.connect(gain);gain.connect(gameAudioBus);source.start(now);source.stop(now+.24);
    source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};
  }catch{}
}
document.addEventListener('DOMContentLoaded',()=>{document.getElementById('sound-toggle').onclick=toggleGameSound;renderSoundButton();});
