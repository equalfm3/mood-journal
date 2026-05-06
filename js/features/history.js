/**
 * Journal history view
 */
import state from '../core/state.js';
import { showSection, formatDate, moodEmoji } from '../core/utils.js';

export function showHistory() {
    showSection('history-section');
    const grid = document.getElementById('history-grid');

    if (state.entries.length === 0) {
        grid.innerHTML = `<p class="empty-state">No entries yet. Start journaling to see your history here.</p>`;
        return;
    }

    grid.innerHTML = state.entries.map(entry => {
        const emotions = entry.emotions.slice(0, 3).join(', ');
        const activities = entry.activities.slice(0, 3).join(', ');
        return `
            <div class="history-card">
                <div class="history-card-header">
                    <span class="history-mood">${moodEmoji(entry.mood)}</span>
                    <span class="history-date">${formatDate(entry.timestamp)}</span>
                    <span class="history-energy">⚡ ${entry.energy}/5</span>
                </div>
                ${entry.text ? `<p class="history-text">${entry.text.slice(0, 120)}${entry.text.length > 120 ? '...' : ''}</p>` : ''}
                <div class="history-meta">
                    ${emotions ? `<span class="history-tag">${emotions}</span>` : ''}
                    ${activities ? `<span class="history-tag">${activities}</span>` : ''}
                    ${entry.sleepHours ? `<span class="history-tag">🌙 ${entry.sleepHours}h</span>` : ''}
                </div>
            </div>
        `;
    }).join('');
}
