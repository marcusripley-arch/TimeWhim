// v0.5.1 — make the interactive state unmistakable and deterministic for tester presets.
(function(){
  const q = (s) => document.querySelector(s);
  const qa = (s) => [...document.querySelectorAll(s)];

  // Keep the action itself above the fold on phones.
  const style = document.createElement('style');
  style.textContent = `
    .activity-card{min-height:0!important}
    .action{margin-top:14px!important;padding-top:14px!important}
    .action-prompt{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.09em;color:var(--muted);margin-bottom:9px}
    .options{grid-template-columns:1fr 1fr}
    .option{min-height:48px;font-weight:750;text-align:center}
    @media(max-width:380px){.options{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  // Deterministic validation sessions: the first activity always proves interaction works.
  const originalBuild = build;
  build = function(){
    state.buildAt = Date.now();
    state.people ||= 'solo';
    state.mood ||= 'curious';
    if(state.preset === 'natural'){
      state.session = [quick.find(a=>a.id==='q1'), mystery, breaks.find(a=>a.id==='b2'), quick.find(a=>a.id==='q4')];
    } else if(state.preset === 'social'){
      state.session = [together.find(a=>a.id==='t3'), together.find(a=>a.id==='t1'), mystery, breaks.find(a=>a.id==='b2'), together.find(a=>a.id==='t4')];
    } else {
      state.session = compose(state.time);
    }
    state.index = 0;
    renderPreview();
    ev('build',{minutes:state.time,preset:state.preset,deterministic:!!state.preset});
    show('preview');
  };
  q('#buildBtn').onclick = build;

  // Replace the action renderer with a compact version for the common tester modes.
  const originalRenderAction = renderAction;
  renderAction = function(a){
    const el = q('#actionArea');
    el.innerHTML = '';

    if(a.mode === 'choice'){
      el.innerHTML = `<div class="action-prompt">Choose one</div><div class="options">${a.choices.map(c=>`<button class="option" type="button" data-choice="${c}">${c}</button>`).join('')}</div><div id="actionFeedback"></div>`;
      qa('[data-choice]').forEach(b=>b.onclick=()=>{
        qa('[data-choice]').forEach(x=>x.classList.toggle('selected',x===b));
        q('#actionFeedback').innerHTML = `<div class="feedback ok">${a.after}</div>`;
        state.answers[a.id] = b.dataset.choice;
        ev('activity_answer',{id:a.id,answer:b.dataset.choice});
      });
      return;
    }

    if(a.id === 'q2'){
      const choices = ['36','40','42','44'];
      el.innerHTML = `<div class="action-prompt">What comes next?</div><div class="options">${choices.map(c=>`<button class="option" type="button" data-pattern="${c}">${c}</button>`).join('')}</div><div id="actionFeedback"></div>`;
      qa('[data-pattern]').forEach(b=>b.onclick=()=>{
        qa('[data-pattern]').forEach(x=>x.classList.toggle('selected',x===b));
        const ok = b.dataset.pattern === '42';
        q('#actionFeedback').innerHTML = `<div class="feedback ${ok?'ok':'warn'}">${ok?'Correct. ':'Not quite. The answer is 42. '}One rule is n(n+1): 1×2, 2×3, 3×4, 4×5, 5×6, then 6×7.</div>`;
        state.answers[a.id] = b.dataset.pattern;
        ev('activity_answer',{id:a.id,correct:ok});
      });
      return;
    }

    originalRenderAction(a);
    // If a future activity accidentally renders nothing, show a visible tester warning instead of a blank card.
    if(!el.children.length){
      el.innerHTML = '<div class="feedback warn">This activity has no interactive control yet. Please use Swap and report it in tester feedback.</div>';
      ev('missing_interaction',{id:a.id,mode:a.mode});
    }
  };

  // Make sure static controls still point to the current functions after overrides.
  q('#startBtn').onclick = startSession;
  q('#doneNext').onclick = completeActivity;

  // Visible build stamp helps distinguish stale browser cache from the current deployment.
  const badge = q('.badge');
  if(badge) badge.textContent = 'v0.5.1 · Interactive';
})();