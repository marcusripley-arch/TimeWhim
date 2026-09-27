// v0.5 hotfix: the first interactive build accidentally rebound every button
// while wiring feedback rows. Rebind the product controls explicitly and scope
// feedback handlers to their own rows.
(function(){
  const q=s=>document.querySelector(s), qa=s=>[...document.querySelectorAll(s)];
  q('#getStarted').onclick=()=>show('tester');
  qa('[data-preset]').forEach(b=>b.onclick=()=>{
    const p=b.dataset.preset; state.preset=p;
    if(p==='natural'){setTime(30);state.people='solo';state.mood='curious';state.constraints=new Set()}
    if(p==='social'){setTime(45);state.people='two';state.mood='fun';state.constraints=new Set(['quiet'])}
    if(p==='travel'){setTime(150);state.people='solo';state.mood='chill';state.constraints=new Set(['offline','battery'])}
    syncSetup(); show('constraints');
  });
  q('#chooseFreely').onclick=()=>show('time');
  qa('[data-min]').forEach(b=>b.onclick=()=>{setTime(+b.dataset.min);qa('[data-min]').forEach(x=>x.classList.toggle('selected',x===b))});
  q('#timeSlider').oninput=e=>setTime(+e.target.value);
  q('#timeNext').onclick=()=>show('people');
  qa('#peopleChoices .choice').forEach(b=>b.onclick=()=>{choose(b,'#peopleChoices .choice','people');q('#groupSize').style.display=state.people==='group'?'flex':'none';q('#peopleNext').disabled=false});
  qa('#groupSize .chip').forEach(b=>b.onclick=()=>choose(b,'#groupSize .chip','groupSize'));
  q('#peopleNext').onclick=()=>show('mood');
  qa('#moodChoices .choice').forEach(b=>b.onclick=()=>{choose(b,'#moodChoices .choice','mood');q('#moodNext').disabled=false});
  q('#surpriseMood').onclick=()=>{state.mood=['fun','curious','chill','connect'][Math.floor(Math.random()*4)];syncSetup();q('#moodNext').disabled=false;ev('mood_surprise',{mood:state.mood})};
  q('#moodNext').onclick=()=>show('constraints');
  qa('#constraintChips .chip').forEach(b=>b.onclick=()=>{const v=b.dataset.v;state.constraints.has(v)?state.constraints.delete(v):state.constraints.add(v);b.classList.toggle('selected');ev('constraint',{v,on:state.constraints.has(v)})});
  q('#buildBtn').onclick=build;
  q('#mixBtn').onclick=()=>{state.session=compose(state.time);renderPreview();ev('mix')};
  q('#startBtn').onclick=startSession;
  q('#doneNext').onclick=completeActivity;
  q('#swapBtn').onclick=swap;
  q('#shorterBtn').onclick=shorter;
  q('#moodBtn').onclick=()=>q('#moodDialog').showModal();
  q('#moreBtn').onclick=()=>q('#moreDialog').showModal();
  qa('[data-replan]').forEach(b=>b.onclick=()=>{
    const r=b.dataset.replan;
    if(r==='quiet')state.constraints.add('quiet');
    if(r==='less')state.time=Math.max(10,Math.round(state.time*.7));
    if(r==='people')state.people=state.people==='solo'?'two':'group';
    if(['fun','chill','connect','curious'].includes(r))state.mood=r;
    replan(r);
  });
  q('#finishNow').onclick=finishSession;
  qa('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
  qa('.feedback-row').forEach(row=>row.querySelectorAll('button').forEach(b=>b.onclick=()=>{
    row.querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));
    state.feedback[row.dataset.key]=b.textContent;
    ev('feedback_choice',{key:row.dataset.key,value:b.textContent});
  }));
  q('#toFeedback').onclick=()=>show('feedback');
  q('#exportBtn').onclick=exportReport;
  q('#restartBtn').onclick=()=>{localStorage.removeItem('timewhim-v05');location.reload()};
  q('#feedbackDone').onclick=()=>{localStorage.removeItem('timewhim-v05');location.reload()};
})();