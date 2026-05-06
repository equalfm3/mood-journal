/**
 * Journal entry creation and saving
 */
import state from '../core/state.js';
import { toast, saveEntries, showSection } from '../core/utils.js';
import { generateInsights } from './insights.js';

export function initJournal() {
    // Date display
    document.getElementById('section-date').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    // Mood faces
    document.getElementById('mood-faces')?.addEventListener('click', (e) => {
        const face = e.target.closest('.mood-face');
        if (!face) return;
        document.querySelectorAll('.mood-face').forEach(f => f.classList.remove('active'));
        face.classList.add('active');
        state.mood = parseInt(face.dataset.mood);
        document.getElementById('mood-label').textContent = face.dataset.label;
    });

    // Energy slider
    document.getElementById('energy-slider')?.addEventListener('input', (e) => {
        state.energy = parseInt(e.target.value);
    });

    // Emotion chips (multi-select)
    document.getElementById('emotion-chips')?.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (!chip) return;
        chip.classList.toggle('active');
        const val = chip.dataset.value;
        if (state.emotions.includes(val)) state.emotions = state.emotions.filter(v => v !== val);
        else state.emotions.push(val);
    });

    // Activity chips (multi-select)
    document.getElementById('activity-chips')?.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (!chip) return;
        chip.classList.toggle('active');
        const val = chip.dataset.value;
        if (state.activities.includes(val)) state.activities = state.activities.filter(v => v !== val);
        else state.activities.push(val);
    });

    // Save button
    document.getElementById('save-entry-btn')?.addEventListener('click', saveEntry);
}

async function saveEntry() {
    const journalText = document.getElementById('journal-text')?.value || '';
    const sleepHours = parseFloat(document.getElementById('sleep-hours')?.value) || null;
    const waterGlasses = parseInt(document.getElementById('water-glasses')?.value) || null;

    if (!state.mood) {
        toast('Please select your mood first');
        return;
    }

    const entry = {
        id: Date.now(),
        timestamp: Date.now(),
        mood: state.mood,
        energy: state.energy,
        emotions: [...state.emotions],
        activities: [...state.activities],
        text: journalText,
        sleepHours,
        waterGlasses,
    };

    state.entries.unshift(entry);
    saveEntries();
    toast('Entry saved ✓');

    // Generate insights
    await generateInsights(entry);
}

export function resetForm() {
    state.mood = null;
    state.energy = 3;
    state.emotions = [];
    state.activities = [];
    document.querySelectorAll('.mood-face').forEach(f => f.classList.remove('active'));
    document.querySelectorAll('#emotion-chips .chip, #activity-chips .chip').forEach(c => c.classList.remove('active'));
    document.getElementById('mood-label').textContent = '';
    document.getElementById('journal-text').value = '';
    document.getElementById('sleep-hours').value = '';
    document.getElementById('water-glasses').value = '';
    document.getElementById('energy-slider').value = 3;
}
