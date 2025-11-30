// Small JS helpers for the resume page

(function(){
  const themeBtn = document.getElementById('theme-toggle');
  const downloadBtn = document.getElementById('download-btn');
  const easterBtn = document.getElementById('show-easter');

  function setTheme(isDark){
    document.body.classList.toggle('dark', isDark);
    themeBtn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  }

  // load theme from localstorage
  setTheme(localStorage.getItem('theme') === 'dark');
  themeBtn.addEventListener('click', ()=>{
    const isDark = !document.body.classList.contains('dark');
    setTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  downloadBtn.addEventListener('click', ()=>{
    window.print();
  });

  // Easter egg: Hidden QA hunt
  // This is a multi-step secret that requires both UI clicks and console commands to unlock.
  // Steps: 1) Click the 'Find Easter Egg' button 3 times consecutively. 2) Open the console and call revealHint('alpha').
  // 3) Wait for a second secret status from the console; call confirmBadge(<encodedString>) to decode it. This mirrors 'QA detective' work.

  let clickCount = 0;
  let clickTimer = null;

  easterBtn.addEventListener('click', ()=>{
    clickCount += 1;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(()=>clickCount=0, 2000);
    if(clickCount>=3){
      clickCount = 0;
      // Print cryptic test logs to the console
      console.log('%c[QA-HUNT] Run the revealHint function in the console with the right code to proceed 🕵️', 'color: #6aa0ff; font-weight: bold');
      console.log('%cHint: use revealHint("alpha")', 'color:#9aa9c2');
      // Add UI hint for users that get to this stage
      const hint = document.createElement('div');
      hint.className = 'eh-hint visible';
      hint.textContent = 'Keep an eye on the console for your next step.';
      document.querySelector('.controls').appendChild(hint);
      setTimeout(()=>hint.remove(), 7000);
    }
  });

  // Expose helper for console
  window.revealHint = function(key){
    if(key !== 'alpha'){
      console.error('[QA-HUNT] Wrong key format — try again');
      return;
    }
    // second step — provide an encoded string
    const encoded = btoa('QA-BADGE-LEVEL-2:' + new Date().getTime());
    console.log('%c[QA-HUNT] Step 2 complete. Send the value to confirmBadge(encoded) to decode and validate.', 'color:#7dd3fc; font-weight:700');
    console.log('%cYour code:', 'color:#9aa9c2', encoded);
  };

  window.confirmBadge = function(encodedString){
    try{
      const decoded = atob(encodedString);
      if(!decoded.startsWith('QA-BADGE-LEVEL-2:')){
        console.error('[QA-HUNT] Invalid badge code');
        return;
      }
      // success UI
      const success = document.createElement('div');
      success.className = 'eh-hint visible';
      success.textContent = 'QA Hunt complete! Copy the secret token and add it to your resume JSON file if you want to show it.';
      document.querySelector('.controls').appendChild(success);
      setTimeout(()=>success.remove(), 11000);
      console.log('%c[QA-HUNT] Congrats! Share this token as proof: %s', 'color:#86efac; font-weight:700', decoded);

      // Extra fun: show a small confetti effect
      try{
        // Lightweight confetti implementation — small and dependency-free
        const confetti = (function(){
          const colors=['#ff577f','#ffbf47','#6aa0ff','#86efac'];
          const container = document.createElement('div');
          container.style.position='fixed';container.style.top=0;container.style.left=0;container.style.width='100%';container.style.height='100%';container.style.pointerEvents='none';container.style.overflow='visible';
          document.body.appendChild(container);
          for(let i=0;i<40;i++){
            const el=document.createElement('div');
            el.style.position='absolute';el.style.width='10px';el.style.height='6px';el.style.background=colors[Math.floor(Math.random()*colors.length)];
            el.style.left=Math.random()*100+'%';el.style.top='-10px';el.style.opacity='0.9';el.style.transform='rotate('+Math.random()*360+'deg)';
            el.style.borderRadius='2px';el.style.transition='transform 1.2s linear, top 1.2s linear, opacity 1.2s linear';
            container.appendChild(el);
            setTimeout(()=>{el.style.top=(80+Math.random()*20)+'%';el.style.transform='rotate('+ (Math.random()*360) +'deg)';el.style.opacity='0'},20+i*10);
            setTimeout(()=>el.remove(), 1400+i*10);
          }
          setTimeout(()=>container.remove(),2000);
        })();
      }catch(e){console.warn('Confetti failed', e)}

    }catch(e){
      console.error('[QA-HUNT] Provided code is not valid.');
    }
  };

  // Bonus: detect certain keystrokes for more secret actions
  let keySequence = '';
  const secretSequence = 'upupdowndownba';
  document.addEventListener('keydown', (e)=>{
    keySequence += e.key.toLowerCase();
    if(keySequence.length>secretSequence.length){ keySequence = keySequence.slice(-secretSequence.length); }
    if(keySequence.includes(secretSequence)){
      console.log('%c[QA-HUNT] Konami-esque sequence detected. Pro-tip: click the "Find Easter Egg" button 3 times too.', 'color:#fca5a5');
    }
  });

})();
