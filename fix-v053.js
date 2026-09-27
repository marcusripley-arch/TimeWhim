// v0.5.3 — guided Mystery flow with explicit steps.
(function(){
  const q = (s) => document.querySelector(s);
  const qa = (s) => [...document.querySelectorAll(s)];

  mystery.prompt = 'Solve the case step by step. Read each clue, then choose the most likely suspect and explain what convinced you.';

  renderMystery = function(el){
    const clues = [
      'The balcony door was locked from inside.',
      'Wet shoe marks stop before the carpet, not at the balcony.',
      'The cleaner logged out at 18:12.',
      'A guest heard a service cart at 18:18.',
      'The night porter had access to a master key and the service cart.'
    ];
    const suspects = ['Cleaner','Guest’s friend','Night porter'];
    let clueIndex = -1;
    let suspect = '';

    el.innerHTML = `
      <div class="notice"><strong>Goal:</strong> decide who most likely took the necklace. You do not need to guess yet — reveal the clues first.</div>
      <div class="feedback"><strong>Case:</strong> A necklace vanished from Room 214 between 18:10 and 18:25.</div>
      <div style="margin-top:14px" id="mysteryStage">
        <div class="action-prompt">Step 1 of 3 · Investigate</div>
        <div id="clueProgress" class="footer-note">0 of ${clues.length} clues revealed</div>
        <div id="revealedClues" style="display:grid;gap:8px;margin:12px 0"></div>
        <button class="secondary" type="button" id="nextClue">Reveal first clue</button>
      </div>
      <div id="suspectStage" style="display:none;margin-top:16px">
        <div class="action-prompt">Step 2 of 3 · Choose a suspect</div>
        <div class="options">${suspects.map(s=>`<button class="option" type="button" data-suspect="${s}">${s}</button>`).join('')}</div>
        <label style="margin-top:12px">What clue mattered most?</label>
        <textarea id="mysteryWhy" placeholder="My theory is… because…"></textarea>
        <button class="secondary" type="button" id="lockTheory" disabled>Lock my theory</button>
      </div>
      <div id="revealStage" style="display:none;margin-top:16px">
        <div class="action-prompt">Step 3 of 3 · Reveal</div>
        <button class="secondary" type="button" id="revealMystery">Reveal strongest theory</button>
        <div id="mysteryResult"></div>
      </div>`;

    const renderClues = () => {
      q('#clueProgress').textContent = `${clueIndex + 1} of ${clues.length} clues revealed`;
      q('#revealedClues').innerHTML = clues.slice(0, clueIndex + 1).map((c,i)=>`<div class="feedback"><strong>Clue ${i+1}:</strong> ${c}</div>`).join('');
      if(clueIndex + 1 >= clues.length){
        q('#nextClue').style.display = 'none';
        q('#suspectStage').style.display = 'block';
      } else {
        q('#nextClue').textContent = clueIndex < 0 ? 'Reveal first clue' : 'Reveal next clue';
      }
    };

    q('#nextClue').onclick = () => {
      if(clueIndex < clues.length - 1){
        clueIndex++;
        renderClues();
        ev('mystery_clue_revealed',{n:clueIndex+1});
      }
    };

    qa('[data-suspect]').forEach(b=>b.onclick=()=>{
      suspect = b.dataset.suspect;
      qa('[data-suspect]').forEach(x=>x.classList.toggle('selected',x===b));
      q('#lockTheory').disabled = false;
    });

    q('#lockTheory').onclick = () => {
      const why = q('#mysteryWhy').value.trim();
      state.answers.m1 = {suspect,why};
      q('#lockTheory').textContent = 'Theory locked';
      q('#revealStage').style.display = 'block';
      ev('mystery_theory_locked',{suspect,hasReason:!!why});
    };

    q('#revealMystery').onclick = () => {
      const isStrongest = suspect === 'Night porter';
      q('#mysteryResult').innerHTML = `
        <div class="feedback ${isStrongest?'ok':'warn'}">
          <strong>Strongest theory: Night porter.</strong><br><br>
          The 18:18 service cart places the porter in the window, and master-key access explains entry without forcing the balcony. The wet shoe marks look more like a staged story than a real route in or out.<br><br>
          ${isStrongest?'Your choice matches the strongest theory.':'Your theory can still be defensible if it explains every clue better.'}
        </div>`;
      ev('mystery_revealed',{suspect,strongest:isStrongest});
    };
  };

  const badge = q('.badge');
  if(badge) badge.textContent = 'v0.5.3 · Interactive';
})();