// v0.5.5 — turn Fast Trivia into a paced quiz mini-game.
(function(){
  const q = (s) => document.querySelector(s);
  const qa = (s) => [...document.querySelectorAll(s)];
  const previousRenderAction = renderAction;

  const quiz = [
    {
      q:'Largest ocean?',
      choices:['Atlantic Ocean','Indian Ocean','Pacific Ocean','Arctic Ocean'],
      answer:'Pacific Ocean',
      fact:'The Pacific covers roughly one third of Earth’s surface.'
    },
    {
      q:'Closest planet to the Sun?',
      choices:['Venus','Mercury','Mars','Earth'],
      answer:'Mercury',
      fact:'A year on Mercury lasts only 88 Earth days.'
    },
    {
      q:'How many bones are in a typical adult human?',
      choices:['186','206','226','246'],
      answer:'206',
      fact:'Babies are born with more bones; many fuse together as they grow.'
    },
    {
      q:'Capital of Canada?',
      choices:['Toronto','Vancouver','Montreal','Ottawa'],
      answer:'Ottawa',
      fact:'Ottawa became the capital in the 19th century, chosen by Queen Victoria.'
    }
  ];

  renderAction = function(a){
    if(a.mode !== 'trivia') return previousRenderAction(a);

    const el = q('#actionArea');
    let index = 0;
    let score = 0;
    let answered = false;
    let timer = null;
    let seconds = 12;
    const answers = [];

    const stopClock = () => {
      if(timer) clearInterval(timer);
      timer = null;
    };

    const finishAnswer = (selected, timedOut=false) => {
      if(answered) return;
      answered = true;
      stopClock();
      const item = quiz[index];
      const correct = selected === item.answer;
      answers[index] = {selected:selected || null, correct, timedOut};
      if(correct) score++;

      qa('[data-quiz-choice]').forEach(x=>{
        x.disabled = true;
        if(x.dataset.quizChoice === item.answer) x.classList.add('selected');
      });

      const lead = timedOut ? `Time’s up — the answer is ${item.answer}.` : (correct ? 'Correct.' : `Not quite — the answer is ${item.answer}.`);
      q('#quizFeedback').innerHTML = `
        <div class="feedback ${correct?'ok':'warn'}"><strong>${lead}</strong><br><br>${item.fact}</div>`;
      q('#nextQuiz').style.display = 'block';
      state.answers[a.id] = {score,total:quiz.length,answers};
      ev('trivia_answer',{question:index+1,selected:selected || null,correct,timedOut,score});
    };

    const startClock = () => {
      stopClock();
      seconds = 12;
      const drawClock = () => {
        const node = q('#quizClock');
        if(node) node.textContent = `${seconds}s`;
      };
      drawClock();
      timer = setInterval(()=>{
        seconds--;
        drawClock();
        if(seconds <= 0) finishAnswer(null,true);
      },1000);
    };

    const draw = () => {
      answered = false;
      const item = quiz[index];
      el.innerHTML = `
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:10px">
          <div class="action-prompt" style="margin:0">Question ${index + 1} of ${quiz.length}</div>
          <div id="quizClock" class="badge" aria-live="polite">12s</div>
        </div>
        <div class="feedback" style="margin-bottom:12px"><strong>${item.q}</strong></div>
        <div class="options">${item.choices.map(c=>`<button class="option" type="button" data-quiz-choice="${c}">${c}</button>`).join('')}</div>
        <div id="quizFeedback"></div>
        <button class="secondary" type="button" id="nextQuiz" style="display:none">${index === quiz.length - 1 ? 'See result' : 'Next question'}</button>`;

      qa('[data-quiz-choice]').forEach(b=>b.onclick=()=>finishAnswer(b.dataset.quizChoice,false));

      q('#nextQuiz').onclick=()=>{
        if(!answered) return;
        if(index < quiz.length - 1){
          index++;
          draw();
        } else {
          stopClock();
          const title = score===4 ? 'Perfect round.' : score===3 ? 'Sharp.' : score===2 ? 'Solid run.' : score===1 ? 'One hit.' : 'Rematch territory.';
          el.innerHTML = `
            <div class="action-prompt">Quiz complete</div>
            <div class="feedback ok"><strong style="font-size:28px">${score} / ${quiz.length}</strong><br><br>${title}</div>
            <div class="footer-note">Fast answers, instant result. Try another round later for a fresh set.</div>`;
          state.answers[a.id] = {score,total:quiz.length,answers};
          ev('trivia_complete',{score,total:quiz.length});
        }
      };

      startClock();
    };

    draw();
  };

  const badge = q('.badge');
  if(badge) badge.textContent = 'v0.5.5 · Interactive';
})();
