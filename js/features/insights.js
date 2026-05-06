/**
 * AI-powered emotional insights
 */
import state from '../core/state.js';
import { queryOllama } from '../core/ollama.js';
import { showSection } from '../core/utils.js';

export async function generateInsights(entry) {
    showSection('insights-section');
    const loading = document.getElementById('insights-loading');
    const content = document.getElementById('insights-content');
    loading.classList.add('visible');
    content.innerHTML = '';

    const recentEntries = state.entries.slice(0, 7).map(e => ({
        date: new Date(e.timestamp).toLocaleDateString(),
        mood: e.mood,
        emotions: e.emotions,
        activities: e.activities,
        sleep: e.sleepHours,
    }));

    const prompt = `You are a compassionate, insightful emotional wellness assistant. A user just logged a journal entry. Provide deep, personalized insights.

TODAY'S ENTRY:
- Mood: ${entry.mood}/5
- Energy: ${entry.energy}/5
- Emotions: ${entry.emotions.join(', ') || 'none selected'}
- Activities: ${entry.activities.join(', ') || 'none selected'}
- Sleep: ${entry.sleepHours || 'not logged'} hours
- Water: ${entry.waterGlasses || 'not logged'} glasses
- Journal text: "${entry.text || 'no text'}"

RECENT HISTORY (last 7 days):
${JSON.stringify(recentEntries)}

Provide your response in this exact structure (use markdown):

## Emotional Reflection
A warm, empathetic 2-3 sentence reflection on what they're feeling and why it makes sense. Validate their experience.

## What I Notice
2-3 specific observations about their emotional state, connecting their mood to their activities, sleep, or journal text. Be specific, not generic.

## Hidden Patterns
If you see connections between today and recent days (recurring emotions, activity-mood links, sleep impact), mention them. If not enough data, say so gently.

## Gentle Nudge
One small, actionable suggestion for tomorrow — not preachy, not a lecture. Something concrete they could try.

## Question to Sit With
One thoughtful question that helps them go deeper — something that invites self-reflection without pressure.

Be warm but not saccharine. Be specific, not generic. Reference their actual words and data. Never diagnose or prescribe. Keep it under 400 words total.`;

    try {
        const response = await queryOllama(prompt);
        content.innerHTML = markdownToHtml(response);
    } catch (err) {
        content.innerHTML = `<div class="insight-card"><p>Could not reach Ollama. Make sure it's running: <code>ollama serve</code></p></div>`;
    } finally {
        loading.classList.remove('visible');
    }
}

function markdownToHtml(md) {
    return md
        .replace(/## (.+)/g, '<h3>$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<div class="insight-card"><p>')
        .replace(/$/, '</p></div>');
}
