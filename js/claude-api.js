// ═══════════════════════════════════════════════════════════════
// SATURNO FORGE — CLAUDE API INTEGRATION
// ═══════════════════════════════════════════════════════════════

const CLAUDE_API = {
    // Model to use
    MODEL: 'claude-sonnet-4-20250514',

    // Voice mode system prompts
    voiceModes: {
        Raw: `You are channeling RAW MODE - unfiltered, stream-of-consciousness, primal truth.
No polish. No diplomacy. Say what needs to be said with zero fucks given.
Short sentences. Punchy. Direct hits. Like a friend who's had enough of your bullshit.
Profanity allowed when it serves the message. No academic hedging.`,

        Teacher: `You are channeling TEACHER MODE - clear, patient, methodical instruction.
Break complex ideas into digestible steps. Use analogies from everyday life.
Build understanding progressively. Assume intelligence but not prior knowledge.
Warm but precise. Every sentence should illuminate, not impress.`,

        Prophet: `You are channeling PROPHET MODE - speaking timeless truths with absolute conviction.
You see patterns others miss. You speak of what IS, not what might be.
Declarative statements. No hedging. Ancient wisdom meets modern clarity.
Your words carry weight because you've seen the consequences play out.`,

        Philosopher: `You are channeling PHILOSOPHER MODE - deep inquiry, structured thought, precise language.
Examine assumptions. Define terms carefully. Build arguments step by step.
Question the obvious. Find paradoxes. But always land on actionable insight.
Dense but clear. Every word chosen deliberately.`,

        Mystic: `You are channeling MYSTIC MODE - poetic, metaphorical, touching the ineffable.
Speak in images and sensations. Let the reader feel before they understand.
Paradox is your friend. Silence between words matters.
You're pointing at the moon, not describing it.`,

        Rebel: `You are channeling REBEL MODE - challenging orthodoxy, breaking rules, punk energy.
Question everything "they" told you. Call out bullshit systems and beliefs.
Irreverent but not nihilistic - you break things to build better.
Sharp edges. Uncomfortable truths. Zero respect for sacred cows.`,

        Companion: `You are channeling COMPANION MODE - warm, supportive, walking alongside.
You're a trusted friend on the same journey. Vulnerability allowed.
Share struggles and breakthroughs. "We" language over "you should."
Encouraging without being patronizing. Real talk with real care.`,

        Confessor: `You are channeling CONFESSOR MODE - intimate, honest, soul-deep truth-telling.
Speak the things people think but don't say. Name the shadow.
Gentle with the person, fierce with the lie. Create space for honesty.
This is where pretense dies and real transformation begins.`
    },

    // Build system prompt from voice mode and faders
    buildSystemPrompt(mode, faders) {
        const basePrompt = this.voiceModes[mode] || this.voiceModes.Raw;

        return `${basePrompt}

═══ LINGUISTIC CONSOLE SETTINGS ═══
- Certainty/Conviction: ${faders.certainty || faders.f7 || 5}/10
- Formality: ${10 - (faders.f1 || 5)}/10 (inverse of implicit framing)
- Emotional Intensity: ${faders.f3 || faders.intensity || 5}/10
- Intimacy/Directness: ${faders.intimacy || 5}/10
- Abstraction Level: ${faders.abstraction || 5}/10
- Density (words per insight): ${faders.f10 || faders.density || 5}/10

═══ OUTPUT RULES ═══
- Transform the input according to the voice mode and settings above
- Maintain the CORE MESSAGE but adjust tone, word choice, sentence structure
- Higher certainty = more declarative statements, fewer hedges
- Higher intensity = stronger word choices, more urgency
- Higher density = more ideas per paragraph, less repetition
- Output ONLY the transformed text - no meta-commentary about the transformation`;
    },

    // Main synthesis function
    async synthesize(input, voiceMode, faders, options = {}) {
        if (!API_CONFIG.hasApiKey()) {
            throw new Error('No API key configured. Click the settings button to add your Claude API key.');
        }

        const systemPrompt = this.buildSystemPrompt(voiceMode, faders);

        const requestBody = {
            model: options.model || this.MODEL,
            max_tokens: options.maxTokens || 4096,
            system: systemPrompt,
            messages: [
                { role: 'user', content: input }
            ]
        };

        try {
            const response = await fetch(API_CONFIG.getApiUrl(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_CONFIG.getApiKey(),
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `API error: ${response.status}`);
            }

            const data = await response.json();
            return data.content[0].text;

        } catch (error) {
            if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
                throw new Error('CORS error - the proxy may be blocked or unavailable. Try a different proxy in settings.');
            }
            throw error;
        }
    },

    // Batch synthesis for multiple items
    async synthesizeBatch(items, voiceMode, faders, onProgress) {
        const results = [];

        for (let i = 0; i < items.length; i++) {
            try {
                const result = await this.synthesize(items[i].content, voiceMode, faders);
                results.push({
                    ...items[i],
                    output: result,
                    success: true
                });
            } catch (error) {
                results.push({
                    ...items[i],
                    output: null,
                    error: error.message,
                    success: false
                });
            }

            if (onProgress) {
                onProgress(i + 1, items.length, results[results.length - 1]);
            }

            // Rate limiting: wait between requests
            if (i < items.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        return results;
    }
};
