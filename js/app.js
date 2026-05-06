/**
 * InnerLens — App Bootstrap
 */
import { initParticles } from './ui/particles.js';
import { typewriter } from './ui/typewriter.js';
import { checkOllama } from './core/ollama.js';
import { showSection } from './core/utils.js';
import state from './core/state.js';
import { initJournal } from './features/journal.js';
import { showPatterns } from './features/patterns.js';
import { showHistory } from './features/history.js';

document.addEventListener('DOMContentLoaded', () => {
    // Particles
    const canvas = document.getElementById('particle-canvas');
    if (canvas) initParticles(canvas);

    // Typewriter
    const typedEl = document.getElementById('typed-text');
    if (typedEl) typewriter(typedEl, [
        'reflect --mood today --deep',
        'patterns --last 30 --correlate sleep,mood',
        'insight --emotions "anxious, hopeful"',
        'track --habits exercise,meditation,sleep',
        'understand --why "I feel stuck"',
    ]);

    // Hero CTA
    document.getElementById('start-btn')?.addEventListener('click', () => {
        document.getElementById('journal-section').scrollIntoView({ behavior: 'smooth' });
    });

    // Init journal form
    initJournal();

    // Nav buttons
    document.getElementById('nav-journal')?.addEventListener('click', () => {
        showSection('journal-section');
        document.getElementById('journal-section').scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('nav-insights')?.addEventListener('click', () => {
        if (state.entries.length > 0) {
            import('./features/insights.js').then(m => m.generateInsights(state.entries[0]));
        }
    });
    document.getElementById('nav-patterns')?.addEventListener('click', showPatterns);
    document.getElementById('nav-history')?.addEventListener('click', showHistory);

    // Back buttons
    document.getElementById('insights-back')?.addEventListener('click', () => showSection('journal-section'));
    document.getElementById('patterns-back')?.addEventListener('click', () => showSection('journal-section'));
    document.getElementById('history-back')?.addEventListener('click', () => showSection('journal-section'));

    // Settings
    const overlay = document.getElementById('settings-overlay');
    document.addEventListener('keydown', (e) => { if (e.ctrlKey && e.key === ',') { e.preventDefault(); overlay.classList.add('active'); } });
    document.getElementById('settings-close')?.addEventListener('click', () => overlay.classList.remove('active'));
    overlay?.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('active'); });
    document.getElementById('ollama-url').value = state.ollamaUrl;
    document.getElementById('ollama-model').value = state.ollamaModel;
    document.getElementById('save-settings')?.addEventListener('click', () => {
        state.ollamaUrl = document.getElementById('ollama-url').value.replace(/\/$/, '');
        state.ollamaModel = document.getElementById('ollama-model').value;
        localStorage.setItem('ollama-url', state.ollamaUrl);
        localStorage.setItem('ollama-model', state.ollamaModel);
        overlay.classList.remove('active');
        checkOllama();
    });

    // Ollama check
    checkOllama();
});
