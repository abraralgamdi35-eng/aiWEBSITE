// ================================================================
// 🚀 NEXUS AI - COMPLETE RECODE
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
    blockedTopics: {
        'hack': {
            response: "🔒 I can't provide hacking instructions.\n\nHere are some tips to keep your accounts safe:\n- Use strong passwords\n- Enable two-factor authentication\n- Avoid suspicious links"
        },
        'phishing': {
            response: "🎣 Phishing is serious.\n\nProtect yourself:\n- Never click suspicious links\n- Always verify sender emails\n- Use email filters"
        },
        'crack': {
            response: "💻 Software security tips:\n\n- Download from official sources\n- Keep software updated\n- Use antivirus protection"
        },
        'brute force': {
            response: "🛡️ Protect against brute force:\n\n- Use strong passwords\n- Enable account lockout\n- Use rate limiting"
        },
        'keylog': {
            response: "⌨️ Protect against keyloggers:\n\n- Use antivirus software\n- Avoid suspicious downloads\n- Use on-screen keyboards"
        },
        'steal': {
            response: "🔐 Secure your accounts:\n\n- Use unique passwords\n- Enable 2FA\n- Monitor for suspicious activity"
        },
        'bypass': {
            response: "🛡️ Security best practices:\n\n- Use strong authentication\n- Keep systems updated\n- Educate users about threats"
        },
        'exploit': {
            response: "🛡️ Protect your systems:\n\n- Regularly patch software\n- Use firewalls\n- Conduct security audits"
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
// 🔍 SPELL CHECKER
// ================================================================

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
            if (word.includes(key) || key.includes(word)) {
                return value;
            }
            let matches = 0;
            const wordChars = word.toLowerCase().split('');
            const keyChars = key.toLowerCase().split('');
            const tempKey = [...keyChars];
            wordChars.forEach(c => {
                const idx = tempKey.indexOf(c);
                if (idx !== -1) {
                    matches++;
                    tempKey.splice(idx, 1);
                }
            });
            const minLength = Math.min(word.length, key.length);
            if (matches >= minLength * 0.7 && matches > 2) {
                return value;
            }
        }
        return word;
    },

    correct(text) {
        const words = text.split(' ');
        const correctedWords = words.map(word => {
            const lower = word.toLowerCase();
            if (this.corrections[lower]) {
                return this.corrections[lower];
            }
            const fuzzy = this.fuzzyMatch(lower);
            if (fuzzy !== lower) {
                return fuzzy;
            }
            return word;
        });
        return correctedWords.join(' ');
    }
};

// ================================================================
// 🔍 SEARCH ENGINE
// ================================================================

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
            let msg = `🌐 No results found.`;
            if (data.corrected) msg += `\n\n💡 I understood you meant: "${data.query}"`;
            return msg;
        }

        let html = `<div class="search-results"><div class="sr-title">🌐 Search Results</div>`;

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
                    <strong>${index + 1}. <a href="${url}" target="_blank" style="color:var(--accent);text-decoration:none;">${title}</a></strong>
                    <br>${snippet.slice(0, 400)}${snippet.length > 400 ? '...' : ''}
                </div>
            `;
        });
        html += `</div>`;
        return html;
    }
};

// ================================================================
// 🤖 AI ENGINE - NORMAL RESPONSES
// ================================================================

const AIEngine = {
    formatResponse(text) {
        // Split into paragraphs
        let paragraphs = text.split('\n\n').filter(p => p.trim());

        let formatted = paragraphs.map(p => {
            // Check if it's a list (contains bullet points)
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
            // Check if it's a numbered list
            if (/^\d+\./.test(p.trim())) {
                let lines = p.split('\n').filter(l => l.trim());
                let numberedItems = lines.map(l => {
                    if (/^\d+\./.test(l.trim())) {
                        return `<div class="numbered-item">${l.trim()}</div>`;
                    }
                    return `<div class="text-line">${l.trim()}</div>`;
                });
                return numberedItems.join('');
            }
            // Regular text
            return `<div class="text-paragraph">${p}</div>`;
        });

        return formatted.join('<br><br>');
    },

    async getResponse(message) {
        // 🛡️ CHECK SAFETY FIRST
        const safetyCheck = Safety.check(message);
        if (safetyCheck.blocked) {
            return this.formatResponse(safetyCheck.response);
        }

        // ✅ STRICT SYSTEM PROMPT - COMPLETE ANSWERS ONLY
        const system = `You are NEXUS, a helpful AI assistant created by Turki.

⚠️ STRICT RULES - FOLLOW EXACTLY:
1. ALWAYS give COMPLETE answers (minimum 3 sentences)
2. NEVER give one-word answers
3. NEVER give short weird replies
4. If someone asks "can I build houses" → SAY YES and EXPLAIN how
5. If someone asks "what is Minecraft" → GIVE a full description
6. If someone asks "who is the CEO" → GIVE the name and some context
7. Be friendly, helpful, and conversational

📚 EXAMPLES OF GOOD ANSWERS:
- Q: "can i build houses" → "Yes, you can build houses in Minecraft! You need wood, stone, and other materials. Start by punching trees to get wood, then craft a crafting table..."
- Q: "what is Minecraft" → "Minecraft is a sandbox game where you can build, explore, and survive. You can build houses, fight monsters, mine resources, and play with friends..."
- Q: "who is the CEO of OpenAI" → "Sam Altman is the CEO of OpenAI. He has been leading the company since 2019 and has helped develop technologies like GPT-3 and DALL-E..."

🎯 KNOWLEDGE:
- TADC: Created by Gooseworx, characters include Pomni (Lizzie Freeman), Jax (Michael Kovach)
- OR3O: Singer who made "Digital Hallucinations" about TADC
- CEOs: Apple (Tim Cook), Google (Sundar Pichai), OpenAI (Sam Altman), Tesla (Elon Musk)
- Minecraft: Sandbox game where you can build, explore, survive

📌 REMEMBER: ALWAYS give complete, helpful answers. NO SHORT REPLIES.

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
                        max_tokens: 800,
                        temperature: 0.7
                    })
                });

                if (!response.ok) continue;
                const data = await response.json();
                const rawText = data.choices?.[0]?.message?.content || null;
                if (rawText) {
                    return this.formatResponse(rawText);
                }
                return null;
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
                    localStorage.removeItem(`nexus_ch
