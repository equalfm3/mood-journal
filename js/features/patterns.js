/**
 * Long-term pattern analysis
 */
import state from '../core/state.js';
import { queryOllama } from '../core/ollama.js';
import { showSection, moodEmoji } from '../core/utils.js';

export async function showPatterns() {
    showSection('patterns-section');
    const loading = document.getElementById('patterns-loading');
    const content = document.getElementById('patterns-content');
    loading.classList.add('visible');
    content.innerHTML = '';

    if (state.entries.length < 3) {
        loading.classList.remove('visible');
        content.innerHTML = `<div class="insight-card"><p>You need at least 3 entries for pattern analysis. Keep journaling — insights will appear here as data builds up.</p></div>`;
        return;
    }

    // Build data summary
    const entries = state.entries.slice(0, 30);
    const summary = entries.map(e => ({
        date: new Date(e.timestamp).toLocaleDateString(),
        mood: e.mood,
        energy: e.energy,
        emotions: e.emotions,
        activities: e.activities,
        sleep: e.sleepHours,
    }));

    // Calculate local stats
    const avgMood = (entries.reduce((s, e) => s + e.mood, 0) / entries.length).toFixed(1);
    const avgEnergy = (entries.reduce((s, e) => s + e.energy, 0) / entries.length).toFixed(1);
    const avgSleep = entries.filter(e => e.sleepHours).length > 0
        ? (entries.filter(e => e.sleepHours).reduce((s, e) => s + e.sleepHours, 0) / entries.filter(e => e.sleepHours).length).toFixed(1)
        : 'N/A';

    // Emotion frequency
    const emotionCounts = {};
    entries.forEach(e => e.emotions.forEach(em => { emotionCounts[em] = (emotionCounts[em] || 0) + 1; }));
    const topEmotions = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Activity frequency
    const activityCounts = {};
    entries.forEach(e => e.activities.forEach(a => { activityCounts[a] = (activityCounts[a] || 0) + 1; }));
    const topActivities = Object.entries(activityCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Mood timeline (visual)
    const moodTimeline = entries.slice(0, 14).reverse().map(e => `<span class="mood-dot" title="${new Date(e.timestamp).toLocaleDateString()}: ${e.mood}/5" style="--level:${e.mood}">${moodEmoji(e.mood)}</span>`).join('');

    const prompt = `You are an emotional wellness analyst. Analyze this person's journal data and provide deep pattern insights.

DATA (${entries.length} entries, most recent first):
${JSON.stringify(summary)}

STATS:
- Average mood: ${avgMood}/5
- Average energy: ${avgEnergy}/5
- Average sleep: ${avgSleep} hours
- Top emotions: ${topEmotions.map(([e, c]) => `${e} (${c}x)`).join(', ')}
- Top activities: ${topActivities.map(([a, c]) => `${a} (${c}x)`).join(', ')}

Provide analysis in markdown:

## Mood Trajectory
Is their mood trending up, down, or stable? What's driving it?

## Activity-Mood Connections
Which activities correlate with better/worse moods? Be specific with the data.

## Sleep & Energy Patterns
How does their sleep affect next-day mood and energy? Any patterns?

## Emotional Themes
What recurring emotional patterns do you see? Are there cycles?

## Blind Spots
What might they not be seeing about themselves? What's missing from their routine?

## One Key Insight
The single most important thing they should know about their patterns right now.

Be data-driven. Reference specific days and numbers. Be honest but compassionate. Under 500 words.`;

    try {
        const response = await queryOllama(prompt);
        content.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card"><span class="stat-value">${avgMood}</span><span class="stat-label">Avg Mood</span></div>
                <div class="stat-card"><span class="stat-value">${avgEnergy}</span><span class="stat-label">Avg Energy</span></div>
                <div class="stat-card"><span class="stat-value">${avgSleep}</span><span class="stat-label">Avg Sleep</span></div>
                <div class="stat-card"><span class="stat-value">${entries.length}</span><span class="stat-label">Entries</span></div>
            </div>
            <div class="mood-timeline">${moodTimeline}</div>
            <div class="insight-card">${markdownToHtml(response)}</div>
        `;
    } catch (err) {
        content.innerHTML = `<div class="insight-card"><p>Could not reach Ollama.</p></div>`;
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
        .replace(/^/, '<p>')
        .replace(/$/, '</p>');
}
