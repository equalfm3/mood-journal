/**
 * Global state
 */
const state = {
    mood: null,
    energy: 3,
    emotions: [],
    activities: [],
    journalText: '',
    sleepHours: null,
    waterGlasses: null,
    entries: JSON.parse(localStorage.getItem('innerlens-entries') || '[]'),
    ollamaUrl: localStorage.getItem('ollama-url') || 'http://localhost:11434',
    ollamaModel: localStorage.getItem('ollama-model') || 'mistral',
};

export default state;
