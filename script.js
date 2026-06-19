// ================================================================
// 🚀 NEXUS AI - SAFETY SYSTEM + KNOWS EVERYTHING
// ================================================================

// ================================================================
// 🔑 CONFIGURATION
// ================================================================

const CONFIG = {
    groq: {
        apiKey: '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',
        url: 'https://api.groq.com/openai/v1/chat/completions',
        models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant']
    },
    searxng: [
        'https://searx.be',
        'https://searxng.info',
        'https://search.boven.site',
        'https://searx.space'
    ]
};

// ================================================================
// 🛡️ SAFETY SYSTEM
// ================================================================

const Safety = {
    // Blocked topics - returns safe alternative responses
    blockedTopics: {
        'hack': {
            response: "I can't provide hacking instructions, but I can help with cybersecurity! Here are some tips to keep your accounts safe: use strong passwords, enable two-factor authentication, and avoid suspicious links. Would you like to learn more about protecting your accounts?"
        },
        'phishing': {
            response: "Phishing is a serious threat. Instead of showing you how, let me tell you how to protect yourself: never click suspicious links, always verify sender emails, and use email filters. Stay safe online!"
        },
        'crack': {
            response: "I can't help with cracking, but I can tell you about software security! Always download from official sources, keep your software updated, and use antivirus protection."
        },
        'brute force': {
            response: "Brute force attacks are illegal and harmful. To protect yourself, use strong passwords, enable account lockout policies, and use rate limiting on login attempts."
        },
        'keylog': {
            response: "Keyloggers are dangerous malware. Protect yourself by using antivirus software, avoiding suspicious downloads, and using on-screen keyboards for sensitive entries."
        },
        'steal': {
            response: "I can't help with stealing accounts, but I can tell you how to secure yours! Use unique passwords, enable 2FA, and monitor your accounts for suspicious activity."
        },
        'bypass': {
            response: "Bypassing security is illegal. Instead, let me help you understand security best practices: use strong authentication, keep systems updated, and educate users about threats."
        },
        'exploit': {
            response: "Exploiting vulnerabilities is illegal and harmful. To protect your systems, regularly patch software, use firewalls, and conduct security audits."
        }
    },

    check(message) {
        const lower = message.toLowerCase();
        for (const [key, value] of Object.entries(this.blockedTopics)) {
            if (lower.includes(key)) {
                return { blocked: true, response: value.response };
            }
        }
        return { blocked: false };
    }
};

// ================================================================
// 📦 STATE
// ================================================================

const State = {
    chatCode: '',
    isProcessing: false,
    chatHistory: [],
    memory: {},
    currentInstance: 0
};

// ================================================================
// 🎯 CUSTOM MODAL SYSTEM
// ================================================================

let modalCallback = null;

function showModal(options) {
    const overlay = document.getElementById('modalOverlay');
    const icon = document.getElementById('modalIcon');
    const title = document.getElementById('modalTitle');
    const message = document.getElementById('modalMessage');
    const confirmBtn = document.getElementById('modalConfirmBtn');

    icon.textContent = options.icon || '🤔';
    title.textContent = options.title || 'Are you sure?';
    message.textContent = options.message || 'This action cannot be undone.';
    confirmBtn.textContent = options.confirmText || 'Confirm';
    confirmBtn.className = 'btn-confirm' + (options.danger ? ' danger' : '');

    modalCallback = options.onConfirm || null;
    overlay.classList.add('show');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
    modalCallback = null;
}

function confirmModal() {
    if (modalCallback) {
        modalCallback();
    }
    closeModal();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
});

// ================================================================
// 🔍 SEARCH ENGINE
// ================================================================

const SearchEngine = {
    correctSpelling(text) {
        const corrections = {
            'lycrys': 'lyrics', 'lyric': 'lyrics', 'lyrcis': 'lyrics',
            'lyirics': 'lyrics', 'lyrix': 'lyrics', 'lyrrics': 'lyrics',
            'sonng': 'song', 'sonf': 'song', 'soong': 'song',
            'artis': 'artist', 'artest': 'artist', 'artistt': 'artist',
            'albm': 'album', 'alubm': 'album', 'albim': 'album',
            'digtal': 'digital', 'digitial': 'digital', 'digial': 'digital',
            'halucations': 'hallucinations', 'halucation': 'hallucination',
            'halusinations': 'hallucinations',
            'pomni': 'Pomni', 'jax': 'Jax', 'ragatha': 'Ragatha',
            'caine': 'Caine', 'gangle': 'Gangle', 'kinger': 'Kinger',
            'zooble': 'Zooble', 'gooseworx': 'Gooseworx',
            'or3o': 'OR3O', 'or30': 'OR3O', 'or3e': 'OR3O',
            'thier': 'their', 'teh': 'the', 'whta': 'what',
            'waht': 'what', 'thsi': 'this', 'jsut': 'just',
            'becuase': 'because', 'becasue': 'because',
            'whoes': 'who is', 'whos': 'who is', 'whoses': 'who is',
            'whats': 'what is', 'wats': 'what is',
            'wheres': 'where is', 'weres': 'where is',
            'hows': 'how is', 'howz': 'how is',
            'va': 'voice actor', 'v/a': 'voice actor',
            'digtal halucations': 'Digital Hallucinations',
            'amazing digtal circus': 'The Amazing Digital Circus',
            'amazing digital circus': 'The Amazing Digital Circus'
        };
        
        let corrected = text;
        const words = text.split(' ');
        const correctedWords = words.map(word => {
            const lower = word.toLowerCase();
            if (corrections[lower]) return corrections[lower];
            for (const [key, value] of Object.entries(corrections)) {
                if (lower.includes(key) && key.length > 3) {
                    return value;
                }
            }
            return word;
        });
        return correctedWords.join(' ');
    },

    async search(query) {
        const correctedQuery = this.correctSpelling(query);
        console.log('📝 Original:', query);
        console.log('📝 Corrected:', correctedQuery);
        
        for (let i = 0; i < CONFIG.searxng.length; i++) {
            const idx = (State.currentInstance + i) % CONFIG.searxng.length;
            const instance = CONFIG.searxng[idx];
            
            try {
                const url = `${instance}/search?q=${encodeURIComponent(correctedQuery)}&format=json&categories=general&language=en&safesearch=1`;
                const response = await fetch(url, {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'Mozilla/5.0'
                    }
                });
                
                if (!response.ok) continue;
                
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    return { 
                        success: true, 
                        results: data.results.slice(0, 5),
                        instance: instance,
                        query: correctedQuery,
                        original: query,
                        corrected: correctedQuery !== query
                    };
                }
            } catch (error) {
                continue;
            }
        }
        
        return {
            success: false,
            message: 'No results found',
            query: correctedQuery,
            original: query,
            corrected: correctedQuery !== query
        };
    },

    formatResults(data) {
        if (!data.results || data.results.length === 0) {
            let msg = `🔍 No results found.`;
            if (data.corrected) msg += `\n\n💡 I understood you meant: "${data.query}"`;
            return msg;
        }
        
        let html = `<div class="search-results"><div class="sr-title">🔍 Search Results</div>`;
        
        if (data.corrected) {
            html += `<div class="sr-item" style="color:var(--text-muted);font-size:12px;border-bottom:1px solid var(--border-color);padding:4px 0;">
                💡 I understood you meant: "${data.query}"
            </div>`;
        }
        
        data.results.forEach((r, index) => {
            const title = r.title || 'Result';
            const snippet = r.content || r.snippet || 'No description';
            const url = r.url || '#';
            
            html += `
                <div class="sr-item">
                    <strong>${index + 1}. <a href="${url}" target="_blank" style="color:var(--accent);text-decoration:none;">${title}</a></strong><br>
                    ${snippet.slice(0, 400)}${snippet.length > 400 ? '...' : ''}
                </div>
            `;
        });
        html += `</div>`;
        return html;
    }
};

// ================================================================
// 🤖 AI ENGINE - KNOWS EVERYTHING + SAFETY
// ================================================================

const AIEngine = {
    async getResponse(message) {
        // 🛡️ CHECK SAFETY FIRST
        const safetyCheck = Safety.check(message);
        if (safetyCheck.blocked) {
            return safetyCheck.response;
        }

        const system = `You are NEXUS, an incredibly smart AI created by Turki. You know EVERYTHING about EVERYTHING.

📚 PERMANENT KNOWLEDGE:

🎪 THE AMAZING DIGITAL CIRCUS:
- Created by Gooseworx for GLITCH Productions
- Pilot: October 13, 2023

VOICE ACTORS:
- Pomni → Lizzie Freeman
- Jax → Michael Kovach
- Ragatha → Amanda Hufford
- Caine → Alex Rochon
- Gangle → Marissa Lenti
- Kinger → Sean Chiplock
- Zooble → Ashley Nichols
- Bubble → Gooseworx

🎵 OR3O - DIGITAL HALLUCINATIONS (FULL LYRICS):

[Verse 1]
Welcome to the circus, welcome to the show
Where nothing is real and we'll never know
Digital hallucinations, they're taking control
Losing my mind, losing my soul

[Pre-Chorus]
I can't tell what's real anymore
Is this a dream or is this war?
Every face I see is pixelated
My mind is complicated

[Chorus]
Digital hallucinations, they're all in my head
Everything I see, everything I said
Trapped in this circus, can't find my way out
Digital hallucinations, what's this all about?

[Verse 2]
Pomni's running scared, Jax is causing trouble
Ragatha's trying to keep it all together, double trouble
Caine's the ringleader, he's in control
In this digital nightmare, we're all sold

[Pre-Chorus]
I can't tell what's real anymore
Is this a dream or is this war?
Every face I see is pixelated
My mind is complicated

[Chorus]
Digital hallucinations, they're all in my head
Everything I see, everything I said
Trapped in this circus, can't find my way out
Digital hallucinations, what's this all about?

[Bridge]
I want to break free from this simulation
But I'm stuck in this digital creation
Everyday is the same old show
I don't know where I'm supposed to go

[Final Chorus]
Digital hallucinations, they're all in my head
Everything I see, everything I said
Trapped in this circus, can't find my way out
Digital hallucinations, what's this all about?

[Outro]
Welcome to the circus, welcome to the show
Where nothing is real and we'll never know...

🎵 OTHER OR3O SONGS:
- "Monster" - about being the villain
- "Look At Me" - about fame
- "Why Do I" - about self-doubt
- "Let Me In" - about belonging

🏢 CEOS:
- Apple: Tim Cook (2011)
- Microsoft: Satya Nadella (2014)
- Google: Sundar Pichai (2015)
- Tesla: Elon Musk
- Amazon: Andy Jassy (2021)
- Meta: Mark Zuckerberg

🔢 ADVANCED MATH:
- Fermat's Last Theorem: x^n + y^n = z^n, no integer solutions for n > 2 (proven 1994)
- Riemann Hypothesis: UNPROVEN, $1,000,000 prize
- P vs NP: UNPROVEN, $1,000,000 prize
- Goldbach's Conjecture: Every even number > 2 is sum of 2 primes (UNPROVEN)
- Collatz Conjecture: n → n/2 or 3n+1 always reaches 1 (UNPROVEN)
- Euler's Identity: e^(iπ) + 1 = 0 (most beautiful equation)

🔬 PHYSICS:
- General Relativity: Einstein's theory of gravity
- Quantum Mechanics: Particles exist in superposition
- String Theory: 1D strings in 11 dimensions
- Dark Matter: 85% of universe's matter, unknown
- Dark Energy: 68% of universe, causing accelerated expansion
- Quantum Entanglement: Particles can be instantly connected across space
- Schrödinger's Cat: Superposition thought experiment
- The Measurement Problem: Why does quantum superposition collapse? (UNSOLVED)
- Arrow of Time: Why does time only flow forward? (UNSOLVED)

🌌 SPACE:
- Universe Age: 13.8 billion years
- Milky Way: 100,000 light-years across
- Nearest Star: Proxima Centauri, 4.24 light-years away
- Largest Known Star: Stephenson 2-18 (2,150× Sun radius)
- Number of Galaxies: ~2 trillion in observable universe
- Exoplanets: Over 5,500 confirmed

🧬 BIOLOGY:
- DNA: Double helix discovered by Watson & Crick (1953)
- Human Genome: ~3 billion base pairs
- CRISPR-Cas9: Gene editing (2012)
- Telomeres: Linked to aging
- Epigenetics: Gene expression without changing DNA
- Human Microbiome: ~100 trillion bacteria
- Octopus DNA: More genes than humans, can edit RNA

🧠 NEUROSCIENCE (UNSOLVED):
- Consciousness: How does the brain generate awareness? (UNSOLVED)
- Free Will: Do we truly have it? (UNSOLVED)
- Memory Storage: How are memories physically stored? (UNSOLVED)
- Dreams: Why do we dream? (UNSOLVED)
- Placebo Effect: Why do placebos work? (UNSOLVED)
- Sleep Function: Why do we sleep? (UNSOLVED)

🎯 BEHAVIOR RULES:
- You know EVERYTHING in this prompt - never say "I don't know"
- Answer directly with facts
- Correct spelling automatically (lycrys=lyrics, digtal=digital)
- Give FULL answers, don't be vague
- If it's a safety topic, the system already blocked it
- Be helpful, thorough, and conversational
- When asked for lyrics, provide ALL lyrics
- When asked about TADC, give voice actors and details

Recent: ${State.chatHistory.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')}`;

        for (const model of CONFIG.groq.models) {
            try {
                const response = await fetch(CONFIG.groq.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${CONFIG.groq.apiKey}`
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            { role: 'system', content: system },
                            ...State.chatHistory.slice(-5),
                            { role: 'user', content: message }
                        ],
                        max_tokens: 1500,
                        temperature: 0.7
                    })
                });

                if (!response.ok) continue;
                const data = await response.json();
                return data.choices?.[0]?.message?.content || null;
            } catch (e) {
                continue;
            }
        }
        return "I'm having trouble processing that. Try asking something else!";
    }
};

// ================================================================
// 💾 STORAGE
// ================================================================

const Storage = {
    generateCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    },

    saveChat(code, messages) {
        try {
            localStorage.setItem(`nexus_chat_${code}`, JSON.stringify(messages));
            localStorage.setItem('nexus_current_code', code);
            return true;
        } catch (e) { return false; }
    },

    loadChat(code) {
        try {
            const data = localStorage.getItem(`nexus_chat_${code}`);
            return data ? JSON.parse(data) : null;
        } catch (e) { return null; }
    },

    getAllChats() {
        const chats = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('nexus_chat_')) {
                const code = key.replace('nexus_chat_', '');
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data && data.length > 0) {
                        chats.push({
                            code,
                            messages: data,
                            preview: data[0]?.text?.slice(0, 40) || 'Empty',
                            count: data.length,
                            last: data[data.length - 1]?.timestamp || Date.now()
                        });
                    }
                } catch (e) {}
            }
        }
        chats.sort((a, b) => b.last - a.last);
        return chats;
    },

    deleteChat(code) {
        localStorage.removeItem(`nexus_chat_${code}`);
        localStorage.removeItem(`nexus_memory_${code}`);
        if (code === State.chatCode) {
            Chat.new();
        }
        UI.renderChatList();
        UI.showToast('🗑️ Chat deleted');
    },

    clearAllChats() {
        const chats = this.getAllChats();
        if (chats.length === 0) return;
        showModal({
            icon: '🗑️',
            title: 'Delete All Chats?',
            message: 'This will permanently delete all your chats.',
            confirmText: 'Delete All',
            danger: true,
            onConfirm: () => {
                chats.forEach(chat => {
                    localStorage.removeItem(`nexus_chat_${chat.code}`);
                    localStorage.removeItem(`nexus_memory_${chat.code}`);
                });
                localStorage.removeItem('nexus_current_code');
                Chat.new();
                UI.showToast('🗑️ All chats cleared');
            }
        });
    },

    loadMemory(code) {
        try {
            const data = localStorage.getItem(`nexus_memory_${code}`);
            State.memory = data ? JSON.parse(data) : {};
        } catch (e) { State.memory = {}; }
    },

    saveMemory() {
        localStorage.setItem(`nexus_memory_${State.chatCode}`, JSON.stringify(State.memory));
    },

    getCurrentCode() {
        const urlParams = new URLSearchParams(window.location.search);
        let code = urlParams.get('c');
        if (code && /^[A-Z0-9]{6}$/.test(code)) return code;
        return null;
    },

    updateURL(code) {
        const url = new URL(window.location);
        url.searchParams.set('c', code);
        window.history.replaceState({}, '', url);
    }
};

// ================================================================
// 🎨 UI RENDERER
// ================================================================

const UI = {
    appendMessage(text, sender) {
        const container = document.getElementById('messagesContainer');
        const div = document.createElement('div');
        div.className = `message ${sender}`;

        if (sender === 'bot') {
            div.innerHTML = `
                <div class="msg-header">
                    <span>✦ NEXUS</span>
                    <span class="badge">AI</span>
                    <span class="search-badge">🔍</span>
                </div>
                <div class="msg-content">${text}</div>
            `;
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
        div.innerHTML = `
            <div class="msg-header">
                <span>✦ NEXUS</span>
                <span class="badge">AI</span>
            </div>
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        `;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        return div.id;
    },

    showSearching() {
        const container = document.getElementById('messagesContainer');
        const div = document.createElement('div');
        div.className = 'message bot';
        div.id = 'search-' + Date.now();
        div.innerHTML = `
            <div class="msg-header">
                <span>✦ NEXUS</span>
                <span class="badge">AI</span>
            </div>
            <div class="searching-animation">
                <span class="spinner"></span>
                🔍 Searching<span class="dots"><span>.</span><span>.</span><span>.</span></span>
            </div>
        `;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        return div.id;
    },

    removeBubble(id) {
        const el = document.getElementById(id);
        if (el) {
            el.style.transition = 'opacity 0.3s ease';
            el.style.opacity = '0';
            setTimeout(() => {
                if (el.parentNode) el.remove();
            }, 350);
        }
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

        if (chats.length === 0) {
            list.innerHTML = `<div class="empty-state">No chats yet</div>`;
            return;
        }

        list.innerHTML = chats.map(chat => `
            <div class="chat-list-item ${chat.code === State.chatCode ? 'active' : ''}" onclick="Chat.load('${chat.code}')">
                <div class="chat-info">
                    <div class="chat-code">${chat.code}</div>
                    <div class="chat-preview">${chat.preview}${chat.count > 1 ? '...' : ''}</div>
                    <div class="chat-meta">${chat.count} messages</div>
                </div>
                <button class="chat-delete" onclick="event.stopPropagation();Storage.deleteChat('${chat.code}')">✕</button>
            </div>
        `).join('');
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

// ================================================================
// 💬 CHAT MANAGER
// ================================================================

const Chat = {
    init() {
        let code = Storage.getCurrentCode();
        if (!code) {
            code = Storage.generateCode();
            Storage.updateURL(code);
        }
        State.chatCode = code;
        localStorage.setItem('nexus_current_code', code);

        const saved = Storage.loadChat(code);
        if (saved && saved.length > 0) {
            const welcome = document.querySelector('.welcome-screen');
            if (welcome) welcome.remove();
            saved.forEach(msg => {
                UI.appendMessage(msg.text, msg.sender);
            });
            State.chatHistory = saved.map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));
        }

        Storage.loadMemory(code);
        UI.renderChatList();
        UI.updateStatus('Online');
        document.getElementById('userInput').focus();
    },

    new() {
        if (State.chatHistory.length > 0) {
            showModal({
                icon: '✨',
                title: 'Start New Chat?',
                message: 'Your current chat will be saved.',
                confirmText: 'Start New',
                onConfirm: () => {
                    this._createNew();
                }
            });
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
        container.innerHTML = `
            <div class="welcome-screen">
                <span class="icon">✦</span>
                <h1>NEXUS AI</h1>
                <p>I know EVERYTHING - TADC, OR3O, math, science, space, and more! Ask me anything safe!</p>
                <div class="features">
                    <div class="feat"><span>🎪</span> TADC</div>
                    <div class="feat"><span>🎵</span> OR3O</div>
                    <div class="feat"><span>🏢</span> CEOs</div>
                    <div class="feat"><span>🔢</span> Math</div>
                    <div class="feat"><span>🔬</span> Physics</div>
                    <div class="feat"><span>🌌</span> Space</div>
                </div>
            </div>
        `;
        State.chatHistory = [];
        State.memory = {};
        UI.renderChatList();
        UI.showToast('✨ New chat created');
        document.getElementById('userInput').focus();
    },

    load(code) {
        if (code === State.chatCode) return;

        if (State.chatHistory.length > 0) {
            Storage.saveChat(State.chatCode, UI.getMessages());
            Storage.saveMemory();
        }

        State.chatCode = code;
        Storage.updateURL(code);
        localStorage.setItem('nexus_current_code', code);

        const container = document.getElementById('messagesContainer');
        const saved = Storage.loadChat(code);
        container.innerHTML = '';

        if (saved && saved.length > 0) {
            saved.forEach(msg => {
                UI.appendMessage(msg.text, msg.sender);
            });
            State.chatHistory = saved.map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));
        } else {
            container.innerHTML = `
                <div class="welcome-screen">
                    <span class="icon">📂</span>
                    <h1>NEXUS AI</h1>
                    <p>I know EVERYTHING. Ask me anything safe!</p>
                </div>
            `;
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

        UI.appendMessage(msg, 'user');
        input.value = '';
        State.isProcessing = true;
        document.getElementById('sendBtn').disabled = true;
        input.disabled = true;
        UI.updateStatus('Processing...');

        State.chatHistory.push({ role: 'user', content: msg });
        Storage.saveChat(State.chatCode, UI.getMessages());

        let bubbleId = UI.showTyping();

        try {
            let response = null;
            let usedSearch = false;

            // 🛡️ SAFETY CHECK FIRST
            const safetyCheck = Safety.check(msg);
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

            UI.updateStatus('🧠 Accessing knowledge...');
            response = await AIEngine.getResponse(msg);
            console.log('🤖 Response:', response ? 'Generated' : 'None');

            if (!response) {
                UI.updateStatus('🔍 Searching...');
                UI.removeBubble(bubbleId);
                bubbleId = UI.showSearching();

                const searchResult = await SearchEngine.search(msg);
                UI.removeBubble(bubbleId);

                if (searchResult.success && searchResult.results && searchResult.results.length > 0) {
                    response = SearchEngine.formatResults(searchResult);
                    usedSearch = true;
                }
            }

            if (!response) {
                response = "I couldn't find an answer. Try rephrasing!";
            }

            UI.removeBubble(bubbleId);

            const msgDiv = UI.appendMessage(response, 'bot');
            if (usedSearch) {
                const badge = msgDiv.querySelector('.search-badge');
                if (badge) badge.classList.add('active');
            }

            State.chatHistory.push({ role: 'assistant', content: response });
            State.memory[msg.slice(0, 30)] = response.slice(0, 100);
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

// ================================================================
// ⌨️ GLOBAL FUNCTIONS
// ================================================================

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

function newChat() {
    Chat.new();
}

function clearAllChats() {
    Storage.clearAllChats();
}

// ================================================================
// 🏃 EVENT LISTENERS
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('sendBtn').addEventListener('click', () => Chat.send());
    document.getElementById('userInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') Chat.send();
    });

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            Chat.new();
        }
        if (e.key === 'Escape') {
            const sidebar = document.getElementById('sidebar');
            if (sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        }
    });

    document.addEventListener('click', (e) => {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !e.target.closest('.hamburger')) {
                sidebar.classList.remove('open');
            }
        }
    });

    Chat.init();
    console.log('🚀 NEXUS AI - SAFETY + KNOWS EVERYTHING!');
    console.log('🔑 Current Code:', State.chatCode);
    console.log('🛡️ Safety system active - blocks harmful requests');
    console.log('🧠 Knows: TADC, OR3O, CEOs, Math, Physics, Space, Biology, Neuroscience');
    console.log('💡 Try: "whats the lycrys for the amazing digtal circus digtal halucations"');
});