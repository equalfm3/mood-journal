import state from './state.js';

export async function queryOllama(prompt) {
    const response = await fetch(`${state.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: state.ollamaModel, prompt, stream: false, options: { temperature: 0.7, num_predict: 2048 } }),
    });
    if (!response.ok) throw new Error(`Ollama error: ${response.status}`);
    const data = await response.json();
    return data.response;
}

export async function checkOllama() {
    try {
        const res = await fetch(`${state.ollamaUrl}/api/tags`);
        if (res.ok) { setStatus(true); return true; }
    } catch (e) {}
    setStatus(false);
    return false;
}

function setStatus(connected) {
    const dot = document.querySelector('.status-dot');
    const text = document.querySelector('.status-text');
    if (dot && text) { dot.classList.toggle('error', !connected); text.textContent = connected ? 'Ollama' : 'Offline'; }
}
