export function typewriter(el, phrases, { speed = 45, pause = 2500 } = {}) {
    let phraseIdx = 0, charIdx = 0, deleting = false;
    function tick() {
        const phrase = phrases[phraseIdx];
        if (!deleting) { el.textContent = phrase.slice(0, ++charIdx); if (charIdx === phrase.length) { setTimeout(() => { deleting = true; tick(); }, pause); return; } }
        else { el.textContent = phrase.slice(0, --charIdx); if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; } }
        setTimeout(tick, deleting ? speed / 2 : speed);
    }
    tick();
}
