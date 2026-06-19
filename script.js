// ================================================================
// 🚀 NEXUS AI - COMPLETE WORKING
// ================================================================

const CONFIG = {
    groq: {
        apiKey: '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',
        url: 'https://api.groq.com/openai/v1/chat/completions',
        models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant']
    },
    searxng: ['https://searx.be', 'https://searxng.info', 'https://search.boven.site', 'https://searx.space'],
    huggingface: {
        token: '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',
        model: 'runwayml/stable-diffusion-v1-5',
        url: 'https://api-inference.huggingface.co/models/'
    }
};

const Safety = {
    blockedTopics: {
        'hack': { response: "🔒 I can't provide hacking instructions.\n\nHere are some tips to keep your accounts safe:\n- Use strong passwords\n- Enable two-factor authentication\n- Avoid suspicious links" },
        'phishing': { response: "🎣 Phishing is serious.\n\nProtect yourself:\n- Never click suspicious links\n- Always verify sender emails\n- Use email filters" },
        'crack': { response: "💻 Software security tips:\n\n- Download from official sources\n- Keep software updated\n- Use antivirus protection" },
        'brute force': { response: "🛡️ Protect against brute force:\n\n- Use strong passwords\n- Enable account lockout\n- Use rate limiting" },
        'keylog': { response: "⌨️ Protect against keyloggers:\n\n- Use antivirus software\n- Avoid suspicious downloads\n- Use on-screen keyboards" },
        'steal': { response: "🔐 Secure your accounts:\n\n- Use unique passwords\n- Enable 2FA\n- Monitor for suspicious activity" },
        'bypass': { response: "🛡️ Security best practices:\n\n- Use strong authentication\n- Keep systems updated\n- Educate users about threats" },
        'exploit': { response: "🛡️ Protect your systems:\n\n- Regularly patch software\n- Use firewalls\n- Conduct security audits" }
    },
    check(message) {
        const lower = message.toLowerCase();
        for (const [key, value] of Object.entries(this.blockedTopics)) {
            if (lower.includes(key)) return { blocked: true, response: value.response };
        }
        return { blocked: false };
    }
};

const State = { chatCode: '', isProcessing: false, chatHistory: [], memory: {}, currentInstance: 0 };

let modalCallback = null;
function showModal(options) {
    const overlay = document.getElementById('modalOverlay');
    document.getElementById('modalIcon').textContent = options.icon || '🤔';
    document.getElementById('modalTitle').textContent = options.title || 'Are you sure?';
    document.getElementById('modalMessage').textContent = options.message || 'This action cannot be undone.';
    const confirmBtn = document.getElementById('modalConfirmBtn');
    confirmBtn.textContent = options.confirmText || 'Confirm';
    confirmBtn.className = 'btn-confirm' + (options.danger ? ' danger' : '');
    modalCallback = options.onConfirm || null;
    overlay.classList.add('show');
}
function closeModal() { document.getElementById('modalOverlay').classList.remove('show'); modalCallback = null; }
function confirmModal() { if (modalCallback) modalCallback(); closeModal(); }
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
document.getElementById('modalOverlay')?.addEventListener('click', (e) => { if (e.target === e.currentTarget) closeModal(); });

const SpellChecker = {
    corrections: {
        'lycrys': 'lyrics', 'lyric': 'lyrics', 'lyrcis': 'lyrics',
        'lyirics': 'lyrics', 'lyrix': 'lyrics', 'lyrrics': 'lyrics',
        'lyyrics': 'lyrics', 'lryics': 'lyrics', 'lyrcs': 'lyrics',
        'lycris': 'lyrics', 'lyircs': 'lyrics',
        'sonng': 'song', 'sonf': 'song', 'soong': 'song',
        'sogn': 'song', 'sog': 'song', 'sng': 'song',
        'artis': 'artist', 'artest': 'artist', 'artistt': 'artist',
        'artst': 'artist', 'arst': 'artist', 'artits': 'artist',
        'albm': 'album', 'alubm': 'album', 'albim': 'album',
        'albumn': 'album', 'albu': 'album',
        'digtal': 'digital', 'digitial': 'digital', 'digial': 'digital',
        'digiital': 'digital', 'digtal': 'digital', 'digitaal': 'digital',
        'halucations': 'hallucinations', 'halucation': 'hallucination',
        'halusinations': 'hallucinations', 'halusination': 'hallucination',
        'hallucinaions': 'hallucinations', 'halucinaions': 'hallucinations',
        'halucinashuns': 'hallucinations', 'halucinashun': 'hallucination',
        'circus': 'circus', 'circuis': 'circus', 'sircus': 'circus',
        'amazing': 'amazing', 'amzing': 'amazing', 'amazng': 'amazing',
        'pomni': 'Pomni', 'pomny': 'Pomni', 'pomney': 'Pomni',
        'pomne': 'Pomni', 'pomni': 'Pomni',
        'jax': 'Jax', 'jaxx': 'Jax', 'jacks': 'Jax',
        'jaxs': 'Jax', 'jax': 'Jax',
        'ragatha': 'Ragatha', 'ragata': 'Ragatha', 'ragath': 'Ragatha',
        'caine': 'Caine', 'cain': 'Caine', 'cane': 'Caine',
        'gangle': 'Gangle', 'gangl': 'Gangle', 'gangel': 'Gangle',
        'kinger': 'Kinger', 'kingar': 'Kinger', 'kingr': 'Kinger',
        'zooble': 'Zooble', 'zoobl': 'Zooble', 'zoob': 'Zooble',
        'gooseworx': 'Gooseworx', 'gooseworks': 'Gooseworx',
        'or3o': 'OR3O', 'or30': 'OR3O', 'or3e': 'OR3O',
        'oroe': 'OR3O', 'oro': 'OR3O',
        'thier': 'their', 'teh': 'the', 'whta': 'what',
        'waht': 'what', 'thsi': 'this', 'jsut': 'just',
        'becuase': 'because', 'becasue': 'because',
        'becouse': 'because', 'becuase': 'because',
        'whoes': 'who is', 'whos': 'who is', 'whoses': 'who is',
        'who': 'who is', 'whos': 'who is',
        'whats': 'what is', 'wats': 'what is',
        'wat': 'what is', 'wut': 'what is',
        'wheres': 'where is', 'weres': 'where is',
        'wher': 'where is', 'wherr': 'where is',
        'hows': 'how is', 'howz': 'how is',
        'how': 'how is', 'hows': 'how is',
        'va': 'voice actor', 'v/a': 'voice actor',
        've': 'voice actor', 'v': 'voice actor',
        'actor': 'voice actor', 'actr': 'voice actor',
        'voiced': 'voice actor', 'voice': 'voice actor',
        'digtal halucations': 'Digital Hallucinations',
        'digital halucations': 'Digital Hallucinations',
        'digitial halucations': 'Digital Hallucinations',
        'amazing digtal circus': 'The Amazing Digital Circus',
        'amazing digital circus': 'The Amazing Digital Circus',
        'digtal circus': 'The Amazing Digital Circus',
        'digital circus': 'The Amazing Digital Circus',
        'tadc': 'The Amazing Digital Circus',
        'tdac': 'The Amazing Digital Circus',
        'plz': 'please', 'pls': 'please',
        'thx': 'thanks', 'tnx': 'thanks',
        'u': 'you', 'ur': 'your',
        'r': 'are', 'y': 'why',
        '2': 'to', '4': 'for',
        'b': 'be', 'c': 'see',
        'k': 'okay', 'ok': 'okay',
        'ye': 'yeah', 'yea': 'yeah',
        'nah': 'no', 'nope': 'no',
        'yep': 'yes', 'yup': 'yes',
        'tim cook': 'Tim Cook', 'timcook': 'Tim Cook',
        'satya nadella': 'Satya Nadella', 'satyanadella': 'Satya Nadella',
        'sundar pichai': 'Sundar Pichai', 'sundarpichai': 'Sundar Pichai',
        'elon musk': 'Elon Musk', 'elonmusk': 'Elon Musk',
        'mark zuckerberg': 'Mark Zuckerberg', 'markzuckerberg': 'Mark Zuckerberg',
        'sam altman': 'Sam Altman', 'samaltman': 'Sam Altman',
        'fermat': 'Fermat', 'riemann': 'Riemann', 'rieman': 'Riemann',
        'goldbach': 'Goldbach', 'goldback': 'Goldbach',
        'collatz': 'Collatz', 'colatz': 'Collatz',
        'euler': 'Euler', 'eulr': 'Euler',
        'quantum': 'quantum', 'quntum': 'quantum',
        'string': 'string', 'strng': 'string',
        'dark matter': 'dark matter', 'darkmatter': 'dark matter',
        'dark energy': 'dark energy', 'darkenergy': 'dark energy'
    },
    fuzzyMatch(word) {
        if (word.length < 3) return word;
        for (const [key, value] of Object.entries(this.corrections)) {
            if (key.length < 3) continue;
            if (word.includes(key) || key.includes(word)) return value;
            let matches = 0;
            const wordChars = word.toLowerCase().split('');
            const keyChars = key.toLowerCase().split('');
            const tempKey = [...keyChars];
            wordChars.forEach(c => { const idx = tempKey.indexOf(c); if (idx !== -1) { matches++; tempKey.splice(idx, 1); } });
            const minLength = Math.min(word.length, key.length);
            if (matches >= minLength * 0.7 && matches > 2) return value;
        }
        return word;
    },
    correct(text) {
        const words = text.split(' ');
        const correctedWords = words.map(word => {
            const lower = word.toLowerCase();
            if (this.corrections[lower]) return this.corrections[lower];
            const fuzzy = this.fuzzyMatch(lower);
            if (fuzzy !== lower) return fuzzy;
            return word;
        });
        return correctedWords.join(' ');
    }
};

const SearchEngine = {
    async search(query) {
        const correctedQuery = SpellChecker.correct(query);
        console.log('📝 Original:', query);
        console.log('📝 Corrected:', correctedQuery);
        for (let i = 0; i < CONFIG.searxng.length; i++) {
            const idx = (State.currentInstance + i) % CONFIG.searxng.length;
            const instance = CONFIG.searxng[idx];
            try {
                const url = `${instance}/search?q=${encodeURIComponent(correctedQuery)}&format=json&categories=general&language=en&safesearch=1`;
                const response = await fetch(url, { headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' } });
                if (!response.ok) continue;
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    return { success: true, results: data.results.slice(0, 5), instance: instance, query: correctedQuery, original: query, corrected: correctedQuery !== query };
                }
            } catch (error) { continue; }
        }
        return { success: false, message: 'No results found', query: correctedQuery, original: query, corrected: correctedQuery !== query };
    },
    formatResults(data) {
        if (!data.results || data.results.length === 0) {
            let msg = `🌐 No results found.`;
            if (data.corrected) msg += `\n\n💡 I understood you meant: "${data.query}"`;
            return msg;
        }
        let html = `<div class="search-results"><div class="sr-title">🌐 Search Results</div>`;
        if (data.corrected) html += `<div class="sr-item" style="color:var(--text-muted);font-size:12px;border-bottom:1px solid var(--border-color);padding:4px 0;">💡 I understood you meant: "${data.query}"</div>`;
        data.results.forEach((r, index) => {
            const title = r.title || 'Result';
            const snippet = r.content || r.snippet || 'No description';
            const url = r.url || '#';
            html += `<div class="sr-item"><strong>${index + 1}. <a href="${url}" target="_blank" style="color:var(--accent);text-decoration:none;">${title}</a></strong><br>${snippet.slice(0, 400)}${snippet.length > 400 ? '...' : ''}</div>`;
        });
        html += `</div>`;
        return html;
    }
};

function isImageRequest(message) {
    const keywords = ['draw', 'paint', 'generate image', 'create image', 'make a picture', 'illustrate', 'artwork', 'visualize', 'image of', 'picture of', 'draw me', 'show me', 'anime', 'art', 'render', 'sketch', 'design', 'generate a', 'create a', 'make me', 'generate', 'create', 'make'];
    return keywords.some(k => message.toLowerCase().includes(k));
}

function createImageLoadingHTML(prompt) {
    return `<div class="image-loading-overlay"><div class="spinner"></div><div class="loading-text">🎨 Generating image<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span></div><div class="progress-bar"><div class="fill"></div></div><div style="font-size:12px;color:var(--text-muted);margin-top:8px;">"${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''}"</div></div>`;
}

function createImageResultHTML(imageUrl, prompt) {
    return `<div class="generated-image-container"><img src="${imageUrl}" alt="${prompt}" /><div class="image-label"><span class="dot"></span>🎨 Generated by Stable Diffusion<span style="color:var(--text-muted);font-size:10px;">• ${prompt.slice(0, 30)}${prompt.length > 30 ? '...' : ''}</span></div></div>`;
}

async function generateImage(prompt) {
    try {
        const model = CONFIG.huggingface.model;
        const url = CONFIG.huggingface.url + model;
        console.log('🎨 Generating image for:', prompt);
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${CONFIG.huggingface.token}`, 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                inputs: prompt,
                parameters: { negative_prompt: 'ugly, blurry, low quality, distorted, bad anatomy', num_inference_steps: 20, guidance_scale: 7.5 }
            })
        });
        if (response.status === 503) {
            const data = await response.json();
            if (data.error && data.error.includes('loading')) {
                console.log('⏳ Model is loading, waiting 10 seconds...');
                await new Promise(resolve => setTimeout(resolve, 10000));
                return generateImage(prompt);
            }
        }
        if (!response.ok) {
            const error = await response.json();
            console.error('Image generation error:', error);
            throw new Error(error.error || 'Image generation failed');
        }
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        console.log('✅ Image generated successfully!');
        return imageUrl;
    } catch (error) {
        console.error('Image generation error:', error);
        throw error;
    }
}

const AIEngine = {
    formatResponse(text) {
        let paragraphs = text.split('\n\n').filter(p => p.trim());
        let formatted = paragraphs.map(p => {
            if (p.includes('-') || p.includes('•')) {
                let lines = p.split('\n').filter(l => l.trim());
                let bulletPoints = lines.map(l => {
                    if (l.trim().startsWith('-') || l.trim().startsWith('•')) {
                        return `<div class="bullet-point">• ${l.trim().replace(/^[-•]\s*/, '')}</div>`;
                    }
                    return `<div class="text-line">${l.trim()}</div>`;
                });
                return bulletPoints.join('');
            }
            if (/^\d+\./.test(p.trim())) {
                let lines = p.split('\n').filter(l => l.trim());
                let numberedItems = lines.map(l => {
                    if (/^\d+\./.test(l.trim())) return `<div class="numbered-item">${l.trim()}</div>`;
                    return `<div class="text-line">${l.trim()}</div>`;
                });
                return numberedItems.join('');
            }
            return `<div class="text-paragraph">${p}</div>`;
        });
        return formatted.join('<br><br>');
    },
    async getResponse(message) {
        const safetyCheck = Safety.check(message);
        if (safetyCheck.blocked) return this.formatResponse(safetyCheck.response);
        const system = `You are NEXUS, a helpful AI assistant created by Turki.

RULES:
1. ALWAYS give COMPLETE answers (minimum 3 sentences)
2. NEVER give one-word answers
3. Be friendly, helpful, and conversational

KNOWLEDGE:
- TADC: Created by Gooseworx, characters: Pomni (Lizzie Freeman), Jax (Michael Kovach)
- OR3O: Singer who made "Digital Hallucinations" about TADC
- CEOs: Apple (Tim Cook), Google (Sundar Pichai), OpenAI (Sam Altman)
- Minecraft: Sandbox game where you can build, explore, survive

Recent: ${State.chatHistory.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')}`;
        for (const model of CONFIG.groq.models) {
            try {
                const response = await fetch(CONFIG.groq.url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${CONFIG.groq.apiKey}` },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            { role: 'system', content: system },
                            ...State.chatHistory.slice(-5),
                            { role: 'user', content: message }
                        ],
                        max_tokens: 800,
                        temperature: 0.7
                    })
                });
                if (!response.ok) continue;
                const data = await response.json();
                const rawText = data.choices?.[0]?.message?.content || null;
                if (rawText) return this.formatResponse(rawText);
                return null;
            } catch (e) { continue; }
        }
        return "I'm having trouble processing that. Try asking something else!";
    }
};

const Storage = {
    generateCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
        return code;
    },
    saveChat(code, messages) {
        try { localStorage.setItem(`nexus_chat_${code}`, JSON.stringify(messages)); localStorage.setItem('nexus_current_code', code); return true; }
        catch (e) { return false; }
    },
    loadChat(code) {
        try { const data = localStorage.getItem(`nexus_chat_${code}`); return data ? JSON.parse(data) : null; }
        catch (e) { return null; }
    },
    getAllChats() {
        const chats = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('nexus_chat_')) {
                const code = key.replace('nexus_chat_', '');
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data && data.length > 0) chats.push({ code, messages: data, preview: data[0]?.text?.slice(0, 40) || 'Empty', count: data.length, last: data[data.length - 1]?.timestamp || Date.now() });
                } catch (e) {}
            }
        }
        chats.sort((a, b) => b.last - a.last);
        return chats;
    },
    deleteChat(code) {
        localStorage.removeItem(`nexus_chat_${code}`);
        localStorage.removeItem(`nexus_memory_${code}`);
        if (code === State.chatCode) Chat.new();
        UI.renderChatList();
        UI.showToast('🗑️ Chat deleted');
    },
    clearAllChats() {
        const chats = this.getAllChats();
        if (chats.length === 0) return;
        showModal({ icon: '🗑️', title: 'Delete All Chats?', message: 'This will permanently delete all your chats.', confirmText: 'Delete All', danger: true, onConfirm: () => {
            chats.forEach(chat => { localStorage.removeItem(`nexus_chat_${chat.code}`); localStorage.removeItem(`nexus_memory_${chat.code}`); });
            localStorage.removeItem('nexus_current_code');
            Chat.new();
            UI.showToast('🗑️ All chats cleared');
        } });
    },
    loadMemory(code) {
        try { const data = localStorage.getItem(`nexus_memory_${code}`); State.memory = data ? JSON.parse(data) : {}; }
        catch (e) { State.memory = {}; }
    },
    saveMemory() { localStorage.setItem(`nexus_memory_${State.chatCode}`, JSON.stringify(State.memory)); },
    getCurrentCode() {
        const urlParams = new URLSearchParams(window.location.search);
        let code = urlParams.get('c');
        if (code && /^[A-Z0-9]{6}$/.test(code)) return code;
        return null;
    },
    updateURL(code) { const url = new URL(window.location); url.searchParams.set('c', code); window.history.replaceState({}, '', url); }
};

const UI = {
    appendMessage(text, sender) {
        const container = document.getElementById('messagesContainer');
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        if (sender === 'bot') {
            div.innerHTML = `<div class="msg-header"><span>✦ NEXUS</span><span class="badge">AI</span><span class="search-badge">🌐</span></div><div class="msg-content">${text}</div>`;
        } else {
            div.innerHTML = `<div class="msg-content">${text}</div>`;
        }
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        return div;
    },
    showTyping() {
        const container = document.getElementById('messagesContainer');
        const div = document.createElement('div');
        div.className = 'message bot';
        div.id = 'typing-' + Date.now();
        div.innerHTML = `<div class="msg-header"><span>✦ NEXUS</span><span class="badge">AI</span></div><div class="typing-indicator"><span></span><span></span><span></span></div>`;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        return div.id;
    },
    showSearching() {
        const container = document.getElementById('messagesContainer');
        const div = document.createElement('div');
        div.className = 'message bot';
        div.id = 'search-' + Date.now();
        div.innerHTML = `<div class="msg-header"><span>✦ NEXUS</span><span class="badge">AI</span></div><div class="searching-animation"><span class="spinner"></span>🌐 Searching<span class="dots"><span>.</span><span>.</span><span>.</span></span></div>`;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        return div.id;
    },
    showGenerating(prompt) {
        const container = document.getElementById('messagesContainer');
        const div = document.createElement('div');
        div.className = 'message bot';
        div.id = 'generating-' + Date.now();
        div.innerHTML = `<div class="msg-header"><span>✦ NEXUS</span><span class="badge">AI</span></div><div class="msg-content">${createImageLoadingHTML(prompt)}</div>`;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        return div.id;
    },
    showGeneratedImage(containerId, imageUrl, prompt) {
        const container = document.getElementById(containerId);
        if (container) {
            const content = container.querySelector('.msg-content');
            if (content) content.innerHTML = createImageResultHTML(imageUrl, prompt);
        }
    },
    removeBubble(id) {
        const el = document.getElementById(id);
        if (el) { el.style.transition = 'opacity 0.3s ease'; el.style.opacity = '0'; setTimeout(() => { if (el.parentNode) el.remove(); }, 350); }
    },
    getMessages() {
        const msgs = [];
        document.querySelectorAll('.message').forEach(el => {
            const text = el.querySelector('.msg-content')?.textContent || el.textContent;
            const sender = el.classList.contains('user') ? 'user' : 'bot';
            msgs.push({ text, sender, timestamp: Date.now() });
        });
        return msgs;
    },
    renderChatList() {
        const list = document.getElementById('chatList');
        const chats = Storage.getAllChats();
        if (chats.length === 0) { list.innerHTML = `<div class="empty-state">No chats yet</div>`; return; }
        list.innerHTML = chats.map(chat => `<div class="chat-list-item ${chat.code === State.chatCode ? 'active' : ''}" onclick="Chat.load('${chat.code}')"><div class="chat-info"><div class="chat-code">${chat.code}</div><div class="chat-preview">${chat.preview}${chat.count > 1 ? '...' : ''}</div><div class="chat-meta">${chat.count} messages</div></div><button class="chat-delete" onclick="event.stopPropagation();Storage.deleteChat('${chat.code}')">✕</button></div>`).join('');
    },
    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
    },
    updateStatus(status) {
        const el = document.getElementById('statusText');
        if (el) el.textContent = status;
    }
};

const Chat = {
    init() {
        let code = Storage.getCurrentCode();
        if (!code) { code = Storage.generateCode(); Storage.updateURL(code); }
        State.chatCode = code;
        localStorage.setItem('nexus_current_code', code);
        const saved = Storage.loadChat(code);
        if (saved && saved.length > 0) {
            const welcome = document.querySelector('.welcome-screen');
            if (welcome) welcome.remove();
            saved.forEach(msg => UI.appendMessage(msg.text, msg.sender));
            State.chatHistory = saved.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));
        }
        Storage.loadMemory(code);
        UI.renderChatList();
        UI.updateStatus('Online');
        document.getElementById('userInput').focus();
    },
    new() {
        if (State.chatHistory.length > 0) {
            showModal({ icon: '✨', title: 'Start New Chat?', message: 'Your current chat will be saved.', confirmText: 'Start New', onConfirm: () => this._createNew() });
            return;
        }
        this._createNew();
    },
    _createNew() {
        const newCode = Storage.generateCode();
        State.chatCode = newCode;
        Storage.updateURL(newCode);
        localStorage.setItem('nexus_current_code', newCode);
        const container = document.getElementById('messagesContainer');
        container.innerHTML = `<div class="welcome-screen"><span class="icon">✦</span><h1>NEXUS AI</h1><p>I can answer questions AND generate images! 🎨</p><div class="features"><div class="feat"><span>🎪</span> TADC</div><div class="feat"><span>🎵</span> OR3O</div><div class="feat"><span>🏢</span> CEOs</div><div class="feat"><span>🔢</span> Math</div><div class="feat"><span>🎨</span> Images</div><div class="feat"><span>🔍</span> Search</div></div></div>`;
        State.chatHistory = [];
        State.memory = {};
        UI.renderChatList();
        UI.showToast('✨ New chat created');
        document.getElementById('userInput').focus();
    },
    load(code) {
        if (code === State.chatCode) return;
        if (State.chatHistory.length > 0) { Storage.saveChat(State.chatCode, UI.getMessages()); Storage.saveMemory(); }
        State.chatCode = code;
        Storage.updateURL(code);
        localStorage.setItem('nexus_current_code', code);
        const container = document.getElementById('messagesContainer');
        const saved = Storage.loadChat(code);
        container.innerHTML = '';
        if (saved && saved.length > 0) {
            saved.forEach(msg => UI.appendMessage(msg.text, msg.sender));
            State.chatHistory = saved.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));
        } else {
            container.innerHTML = `<div class="welcome-screen"><span class="icon">📂</span><h1>NEXUS AI</h1><p>I can answer questions AND generate images! 🎨</p></div>`;
            State.chatHistory = [];
        }
        Storage.loadMemory(code);
        UI.renderChatList();
        UI.showToast('📂 Chat loaded');
        document.getElementById('userInput').focus();
    },
    async send() {
        const input = document.getElementById('userInput');
        const msg = input.value.trim();
        if (!msg || State.isProcessing) return;
        const welcome = document.querySelector('.welcome-screen');
        if (welcome) welcome.remove();
        const correctedMsg = SpellChecker.correct(msg);
        if (correctedMsg !== msg) console.log(`📝 Original: "${msg}" → Corrected: "${correctedMsg}"`);
        UI.appendMessage(msg, 'user');
        input.value = '';
        State.isProcessing = true;
        document.getElementById('sendBtn').disabled = true;
        input.disabled = true;
        UI.updateStatus('Processing...');
        State.chatHistory.push({ role: 'user', content: correctedMsg });
        Storage.saveChat(State.chatCode, UI.getMessages());
        let bubbleId = UI.showTyping();
        try {
            let response = null;
            let usedSearch = false;
            const safetyCheck = Safety.check(correctedMsg);
            if (safetyCheck.blocked) {
                UI.removeBubble(bubbleId);
                UI.appendMessage(safetyCheck.response, 'bot');
                State.chatHistory.push({ role: 'assistant', content: safetyCheck.response });
                Storage.saveChat(State.chatCode, UI.getMessages());
                UI.renderChatList();
                State.isProcessing = false;
                document.getElementById('sendBtn').disabled = false;
                input.disabled = false;
                input.focus();
                UI.updateStatus('Online');
                return;
            }
            if (isImageRequest(correctedMsg)) {
                UI.updateStatus('🎨 Creating image...');
                UI.removeBubble(bubbleId);
                const imageBubbleId = UI.showGenerating(correctedMsg);
                try {
                    const imageUrl = await generateImage(correctedMsg);
                    if (imageUrl) {
                        UI.showGeneratedImage(imageBubbleId, imageUrl, correctedMsg);
                        UI.showToast('🎨 Image generated successfully!');
                        State.chatHistory.push({ role: 'assistant', content: `[Image generated: ${correctedMsg}]` });
                        Storage.saveChat(State.chatCode, UI.getMessages());
                        UI.renderChatList();
                    } else {
                        UI.removeBubble(imageBubbleId);
                        UI.appendMessage('❌ Failed to generate image. Please try again.', 'bot');
                    }
                } catch (error) {
                    console.error('Image error:', error);
                    UI.removeBubble(imageBubbleId);
                    UI.appendMessage(`❌ Failed to generate image. Please try again.`, 'bot');
                }
                State.isProcessing = false;
                document.getElementById('sendBtn').disabled = false;
                input.disabled = false;
                input.focus();
                UI.updateStatus('Online');
                return;
            }
            UI.updateStatus('🧠 Thinking...');
            response = await AIEngine.getResponse(correctedMsg);
            console.log('🤖 Response:', response ? 'Generated' : 'None');
            if (!response) {
                UI.updateStatus('🌐 Searching...');
                UI.removeBubble(bubbleId);
                bubbleId = UI.showSearching();
                const searchResult = await SearchEngine.search(correctedMsg);
                UI.removeBubble(bubbleId);
                if (searchResult.success && searchResult.results && searchResult.results.length > 0) {
                    response = SearchEngine.formatResults(searchResult);
                    usedSearch = true;
                }
            }
            if (!response) response = "I couldn't find an answer. Try rephrasing!";
            UI.removeBubble(bubbleId);
            const msgDiv = UI.appendMessage(response, 'bot');
            if (usedSearch) { const badge = msgDiv.querySelector('.search-badge'); if (badge) badge.classList.add('active'); }
            State.chatHistory.push({ role: 'assistant', content: response });
            State.memory[correctedMsg.slice(0, 30)] = response.slice(0, 100);
            Storage.saveMemory();
            Storage.saveChat(State.chatCode, UI.getMessages());
            UI.renderChatList();
        } catch (e) {
            console.error('❌ Error:', e);
            UI.removeBubble(bubbleId);
            UI.appendMessage(`❌ ${e.message || 'Something went wrong'}`, 'bot');
        } finally {
            State.isProcessing = false;
            document.getElementById('sendBtn').disabled = false;
            input.disabled = false;
            input.focus();
            UI.updateStatus('Online');
        }
    }
};

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }
function newChat() { Chat.new(); }
function clearAllChats() { Storage.clearAllChats(); }

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('sendBtn').addEventListener('click', () => Chat.send());
    document.getElementById('userInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') Chat.send(); });
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'n') { e.preventDefault(); Chat.new(); }
        if (e.key === 'Escape') { const sidebar = document.getElementById('sidebar'); if (sidebar.classList.contains('open')) sidebar.classList.remove('open'); }
    });
    document.addEventListener('click', (e) => {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !e.target.closest('.hamburger')) sidebar.classList.remove('open');
        }
    });
    Chat.init();
    console.log('🚀 NEXUS AI - Fully Working!');
    console.log('🔑 Current Code:', State.chatCode);
    console.log('🎨 Try: "draw a cat" or "create an image of a sunset"');
});
