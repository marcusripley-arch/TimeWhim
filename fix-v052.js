// v0.5.2 — adapt Odd One to solo vs social use.
(function(){
  const q = (s) => document.querySelector(s);
  const qa = (s) => [...document.querySelectorAll(s)];
  const previousRenderAction = renderAction;

  renderAction = function(a){
    if(a.id !== 'q1') return previousRenderAction(a);

    const el = q('#actionArea');
    el.innerHTML = `<div class="action-prompt">Choose one</div><div class="options">${a.choices.map(c=>`<button class="option" type="button" data-choice="${c}">${c}</button>`).join('')}</div><div id="actionFeedback"></div>`;

    qa('[data-choice]').forEach(b=>b.onclick=()=>{
      qa('[data-choice]').forEach(x=>x.classList.toggle('selected',x===b));
      state.answers[a.id] = {choice:b.dataset.choice};

      if(state.people === 'solo'){
        q('#actionFeedback').innerHTML = `
          <div class="feedback ok">There is no single correct answer. Your rule is the activity.</div>
          <label style="margin-top:12px">Why did you choose ${b.dataset.choice}?</label>
          <textarea id="oddReason" placeholder="My rule is…"></textarea>
          <button class="secondary" type="button" id="saveOddReason">Save my rule</button>`;
        q('#saveOddReason').onclick=()=>{
          state.answers[a.id].reason = q('#oddReason').value.trim();
          q('#saveOddReason').textContent = 'Saved';
          ev('activity_answer',{id:a.id,answer:b.dataset.choice,hasReason:!!state.answers[a.id].reason});
        };
      } else {
        q('#actionFeedback').innerHTML = '<div class="feedback ok">Explain your rule to each other. The stranger but defensible, the better.</div>';
        ev('activity_answer',{id:a.id,answer:b.dataset.choice});
      }
    });
  };

  const badge = q('.badge');
  if(badge) badge.textContent = 'v0.5.2 · Interactive';
})();
