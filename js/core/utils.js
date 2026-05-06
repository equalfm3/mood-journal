import state from './state.js';

export function toast(msg, duration = 2500) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('visible');
    setTimeout(() => el.classList.remove('visible'), duration);
}

export function hideAllSections() {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('visible'));
}

export function showSection(id) {
    hideAllSections();
    document.getElementById(id)?.classList.add('visible');
}

export function formatDate(ts) {
    return new Date(ts).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function moodEmoji(mood) {
    return ['', '😞', '😔', '😐', '🙂', '😊'][mood] || '😐';
}

export function saveEntries() {
    localStorage.setItem('innerlens-entries', JSON.stringify(state.entries.slice(0, 365)));
}
