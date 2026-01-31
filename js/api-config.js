// ═══════════════════════════════════════════════════════════════
// SATURNO FORGE — API CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const API_CONFIG = {
    // Storage keys
    STORAGE_KEY: 'claude_api_key',
    PROXY_KEY: 'cors_proxy_url',

    // Default CORS proxy (for development/testing only)
    // For production: deploy your own proxy or use a backend
    DEFAULT_PROXY: 'https://corsproxy.io/?',

    // Get API key from localStorage
    getApiKey() {
        return localStorage.getItem(this.STORAGE_KEY);
    },

    // Set API key in localStorage
    setApiKey(key) {
        if (key && key.startsWith('sk-ant-')) {
            localStorage.setItem(this.STORAGE_KEY, key);
            return true;
        }
        return false;
    },

    // Clear API key
    clearApiKey() {
        localStorage.removeItem(this.STORAGE_KEY);
    },

    // Check if API key is configured
    hasApiKey() {
        const key = this.getApiKey();
        return key && key.startsWith('sk-ant-');
    },

    // Get CORS proxy URL
    getProxy() {
        return localStorage.getItem(this.PROXY_KEY) || this.DEFAULT_PROXY;
    },

    // Set custom CORS proxy
    setProxy(url) {
        localStorage.setItem(this.PROXY_KEY, url);
    },

    // Build proxied API URL
    getApiUrl() {
        const proxy = this.getProxy();
        return proxy + encodeURIComponent('https://api.anthropic.com/v1/messages');
    }
};

// ═══════════════════════════════════════════════════════════════
// API KEY UI COMPONENT
// ═══════════════════════════════════════════════════════════════

function renderApiKeyModal() {
    return `
        <div id="api-key-modal" class="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center hidden">
            <div class="bg-[#0a0a0a] border border-zinc-800 p-8 max-w-md w-full mx-4">
                <h2 class="text-white font-bold text-lg mb-2">API Configuration</h2>
                <p class="text-zinc-500 text-[11px] mb-6">Enter your Claude API key to enable AI synthesis.</p>

                <div class="space-y-4">
                    <div>
                        <label class="text-[10px] text-zinc-600 uppercase tracking-widest block mb-2">Claude API Key</label>
                        <input
                            type="password"
                            id="api-key-input"
                            placeholder="sk-ant-..."
                            class="w-full bg-zinc-900 border border-zinc-800 p-3 text-sm text-white outline-none focus:border-amber-500"
                        >
                    </div>

                    <div>
                        <label class="text-[10px] text-zinc-600 uppercase tracking-widest block mb-2">CORS Proxy (Optional)</label>
                        <input
                            type="text"
                            id="proxy-input"
                            placeholder="https://corsproxy.io/?"
                            class="w-full bg-zinc-900 border border-zinc-800 p-3 text-sm text-zinc-400 outline-none focus:border-zinc-600"
                        >
                        <p class="text-[9px] text-zinc-600 mt-1">Leave default for testing. Deploy your own for production.</p>
                    </div>
                </div>

                <div class="flex gap-3 mt-6">
                    <button onclick="saveApiConfig()" class="flex-1 bg-amber-500 text-black py-2 text-[11px] font-bold uppercase hover:bg-amber-400">
                        Save
                    </button>
                    <button onclick="closeApiModal()" class="flex-1 border border-zinc-800 text-zinc-400 py-2 text-[11px] uppercase hover:border-zinc-600">
                        Cancel
                    </button>
                </div>

                <div id="api-status" class="mt-4 text-[10px] hidden"></div>
            </div>
        </div>
    `;
}

function openApiModal() {
    const modal = document.getElementById('api-key-modal');
    const keyInput = document.getElementById('api-key-input');
    const proxyInput = document.getElementById('proxy-input');

    // Pre-fill if exists
    if (API_CONFIG.hasApiKey()) {
        keyInput.value = '••••••••••••••••••••';
        keyInput.dataset.hasKey = 'true';
    }
    proxyInput.value = API_CONFIG.getProxy();

    modal.classList.remove('hidden');
}

function closeApiModal() {
    document.getElementById('api-key-modal').classList.add('hidden');
}

function saveApiConfig() {
    const keyInput = document.getElementById('api-key-input');
    const proxyInput = document.getElementById('proxy-input');
    const status = document.getElementById('api-status');

    // Only save key if it was changed (not the masked placeholder)
    if (keyInput.value && keyInput.dataset.hasKey !== 'true') {
        if (!API_CONFIG.setApiKey(keyInput.value)) {
            status.className = 'mt-4 text-[10px] text-red-500';
            status.textContent = 'Invalid API key format. Must start with sk-ant-';
            status.classList.remove('hidden');
            return;
        }
    }

    // Save proxy if provided
    if (proxyInput.value) {
        API_CONFIG.setProxy(proxyInput.value);
    }

    status.className = 'mt-4 text-[10px] text-green-500';
    status.textContent = 'Configuration saved!';
    status.classList.remove('hidden');

    setTimeout(() => {
        closeApiModal();
        updateApiStatusIndicator();
    }, 1000);
}

function updateApiStatusIndicator() {
    const indicator = document.getElementById('api-status-indicator');
    if (indicator) {
        if (API_CONFIG.hasApiKey()) {
            indicator.className = 'text-green-500';
            indicator.textContent = '● API Ready';
        } else {
            indicator.className = 'text-red-500';
            indicator.textContent = '● No API Key';
        }
    }
}
