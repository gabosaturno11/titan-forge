// ═══════════════════════════════════════════════════════════════
// SATURNO FORGE — CLAUDE API INTEGRATION
// Uses SATURNO BEAST API backend (no CORS issues!)
// ═══════════════════════════════════════════════════════════════

const CLAUDE_API = {
    // Default model
    MODEL: 'claude-sonnet-4-20250514',

    // Main synthesis function - uses YOUR backend
    async synthesize(input, voiceMode, faders, options = {}) {
        if (!API_CONFIG.hasApiKey()) {
            throw new Error('No API key configured. Click the settings button to add your Claude API key.');
        }

        const requestBody = {
            content: input,
            mode: voiceMode || 'Raw',
            faders: {
                certainty: faders.certainty || faders.f1 || 5,
                formality: faders.formality || faders.f2 || 5,
                intensity: faders.intensity || faders.f3 || 5,
                intimacy: faders.intimacy || faders.f4 || 5,
                abstraction: faders.abstraction || faders.f5 || 5,
                density: faders.density || faders.f6 || 5
            },
            provider: options.provider || 'anthropic',
            model: options.model || this.MODEL
        };

        try {
            const response = await fetch(API_CONFIG.getSynthesizeUrl(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_CONFIG.getApiKey()
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `API error: ${response.status}`);
            }

            const data = await response.json();
            return data.output || data.result || data.content;

        } catch (error) {
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Network error - check your connection or backend URL in settings.');
            }
            throw error;
        }
    },

    // Transform function (alternative endpoint)
    async transform(input, voiceMode, faders, options = {}) {
        if (!API_CONFIG.hasApiKey()) {
            throw new Error('No API key configured.');
        }

        const requestBody = {
            content: input,
            mode: voiceMode || 'Raw',
            faders: {
                certainty: faders.certainty || 5,
                formality: faders.formality || 5,
                intensity: faders.intensity || 5,
                intimacy: faders.intimacy || 5,
                abstraction: faders.abstraction || 5,
                density: faders.density || 5
            }
        };

        try {
            const response = await fetch(API_CONFIG.getTransformUrl(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_CONFIG.getApiKey()
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `API error: ${response.status}`);
            }

            const data = await response.json();
            return data.output || data.result || data.content;

        } catch (error) {
            throw error;
        }
    },

    // Batch synthesis for multiple items
    async synthesizeBatch(items, voiceMode, faders, onProgress) {
        if (!API_CONFIG.hasApiKey()) {
            throw new Error('No API key configured.');
        }

        // Use backend batch endpoint if available (max 10 items)
        if (items.length <= 10) {
            try {
                const requestBody = {
                    items: items.map(item => ({
                        id: item.id || item.title,
                        content: item.content
                    })),
                    mode: voiceMode || 'Raw',
                    faders: {
                        certainty: faders.certainty || 5,
                        formality: faders.formality || 5,
                        intensity: faders.intensity || 5,
                        intimacy: faders.intimacy || 5,
                        abstraction: faders.abstraction || 5,
                        density: faders.density || 5
                    }
                };

                const response = await fetch(API_CONFIG.getBatchUrl(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_CONFIG.getApiKey()
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    throw new Error('Batch API failed, falling back to sequential');
                }

                const data = await response.json();
                return data.results.map((result, i) => ({
                    ...items[i],
                    output: result.output,
                    success: result.success,
                    error: result.error
                }));

            } catch (error) {
                // Fall back to sequential processing
                console.log('Batch failed, processing sequentially:', error.message);
            }
        }

        // Sequential fallback for large batches or if batch endpoint fails
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
    },

    // Get available voice modes from backend
    async getModes() {
        try {
            const response = await fetch(API_CONFIG.getModesUrl());
            if (!response.ok) throw new Error('Failed to fetch modes');
            const data = await response.json();
            return data.modes || data;
        } catch (error) {
            // Return default modes if backend unavailable
            return ['Raw', 'Teacher', 'Prophet', 'Philosopher', 'Mystic', 'Rebel', 'Companion', 'Confessor'];
        }
    }
};
