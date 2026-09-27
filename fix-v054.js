// v0.5.4 — Fast Trivia becomes a real multiple-choice mini-quiz.
(function(){
  const q = (s) => document.querySelector(s);
  const qa = (s) => [...document.querySelectorAll(s)];
  const previousRenderAction = renderAction;

  const quiz = [
    {q:'Largest ocean?', choices:['Atlantic Ocean','Indian Ocean','Pacific Ocean','Arctic Ocean'], answer:'Pacific Ocean'},
    {q:'Closest planet to the Sun?', choices:['Venus','Mercury','Mars','Earth'], answer:'Mercury'},
    {q:'How many bones are in a typical adult human?', choices:['186','206','226','246'], answer:'206'},
    {q:'Capital of Canada?', choices:['Toronto','Vancouver','Montreal','Ottawa'], answer:'Ottawa'}
  ];

  renderAction = function(a){
    if(a.mode !== 'trivia') return previousRenderAction(a);

    const el = q('#actionArea');
    let index = 0;
    let score = 0;
    const answers = [];

    const draw = () => {
      const item = quiz[index];
      el.innerHTML = `
        <div class="action-prompt">Question ${index + 1} of ${quiz.length}</div>
        <div class="feedback" style="margin-bottom:12px"><strong>${item.q}</strong></div>
        <div class="options">${item.choices.map(c=>`<button class="option" type="button" data-quiz-choice="${c}">${c}</button>`).join('')}</div>
        <div id="quizFeedback"></div>
        <button class="secondary" type="button" id="nextQuiz" style="display:none">${index === quiz.length - 1 ? 'See result' : 'Next question'}</button>`;

      qa('[data-quiz-choice]').forEach(b=>b.onclick=()=>{
        if(answers[index]) return;
        const selected = b.dataset.quizChoice;
        const correct = selected === item.answer;
        answers[index] = {selected,correct};
        if(correct) score++;
        qa('[data-quiz-choice]').forEach(x=>{
          x.disabled = true;
          if(x.dataset.quizChoice === item.answer) x.classList.add('selected');
        });
        q('#quizFeedback').innerHTML = `<div class="feedback ${correct?'ok':'warn'}">${correct?'Correct.':`Not quite — the answer is ${item.answer}.`}</div>`;
        q('#nextQuiz').style.display = 'block';
        state.answers[a.id] = {score,total:quiz.length,answers};
        ev('trivia_answer',{question:index+1,selected,correct,score});
      });

      q('#nextQuiz').onclick=()=>{
        if(!answers[index]) return;
        if(index < quiz.length - 1){
          index++;
          draw();
        } else {
          el.innerHTML = `
            <div class="action-prompt">Quiz complete</div>
            <div class="feedback ok"><strong>${score} / ${quiz.length}</strong><br><br>${score===4?'Perfect round.':score>=3?'Nice — almost perfect.':score>=2?'Solid round.':"That’s the fun of a quick quiz — now you know a few more."}</div>`;
          state.answers[a.id] = {score,total:quiz.length,answers};
          ev('trivia_complete',{score,total:quiz.length});
        }
      };
    };

    draw();
  };

  const badge = q('.badge');
  if(badge) badge.textContent = 'v0.5.4 · Interactive';
})();
