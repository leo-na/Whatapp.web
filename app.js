// ---------- Helpers ----------
const pad2 = (n) => String(n).padStart(2, "0");
const formatTime = (d) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
const nowISO = () => new Date().toISOString();

const STORAGE_KEY = "chat_ui_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ---------- Initial Data ----------
const defaultState = {
  activeChatId: "maman",
  chats: [
    {
      id: "maman",
      name: "Maman",
      status: "en ligne",
      unread: 2,
      messages: [
        { id: crypto.randomUUID(), dir: "in", text: "Salut ! Tu es où ?", at: nowISO() },
        { id: crypto.randomUUID(), dir: "out", text: "J’arrive dans 10 minutes 🙂", at: nowISO() },
        { id: crypto.randomUUID(), dir: "in", text: "Ok, fais attention ❤️", at: nowISO() }
      ]
    },
    {
      id: "groupe",
      name: "Groupe Projet",
      status: "3 en ligne",
      unread: 0,
      messages: [
        { id: crypto.randomUUID(), dir: "in", text: "Ok pour 14h 👍", at: nowISO() }
      ]
    },
    {
      id: "amine",
      name: "Amine",
      status: "vu aujourd’hui",
      unread: 1,
      messages: [
        { id: crypto.randomUUID(), dir: "in", text: "Je t’envoie ça tout à l’heure.", at: nowISO() }
      ]
    }
  ]
};

// Merge saved state with defaults (lightweight)
const saved = loadState();
let state = saved && saved.chats ? saved : structuredClone(defaultState);

// ---------- DOM ----------
const chatListEl = document.getElementById("chatList");
const searchInputEl = document.getElementById("searchInput");
const messagesEl = document.getElementById("messages");
const chatTitleEl = document.getElementById("chatTitle");
const chatStatusEl = document.getElementById("chatStatus");
const composerInputEl = document.getElementById("composerInput");
const sendBtnEl = document.getElementById("sendBtn");
const emptyStateEl = document.getElementById("emptyState");

const btnReset = document.getElementById("btnReset");
const btnNewChat = document.getElementById("btnNewChat");
const btnClearChat = document.getElementById("btnClearChat");

// ---------- Rendering ----------
function getActiveChat() {
  return state.chats.find((c) => c.id === state.activeChatId) || null;
}

function renderChatList(filterText = "") {
  const ft = filterText.trim().toLowerCase();
  chatListEl.innerHTML = "";

  const chats = state.chats.filter((c) => c.name.toLowerCase().includes(ft));

  for (const chat of chats) {
    const lastMsg = chat.messages[chat.messages.length - 1];
    const time = lastMsg ? formatTime(new Date(lastMsg.at)) : "";
    const preview = lastMsg ? lastMsg.text : "Aucun message";

    const a = document.createElement("a");
    a.className = "chat";
    a.setAttribute("role", "button");
    a.setAttribute("tabindex", "0");
    a.dataset.chatId = chat.id;
    a.setAttribute("aria-selected", String(chat.id === state.activeChatId));

    a.innerHTML = `
      <div class="chat__avatar" aria-hidden="true"></div>
      <div class="chat__meta">
        <div class="chat__top">
          <span class="chat__name"></span>
          <span class="chat__time">${time}</span>
        </div>
        <div class="chat__bottom">
          <span class="chat__preview"></span>
          <span class="chat__badge" data-count="${chat.unread}">${chat.unread}</span>
        </div>
      </div>
    `;

    a.querySelector(".chat__name").textContent = chat.name;
    a.querySelector(".chat__preview").textContent = preview;

    a.addEventListener("click", () => setActiveChat(chat.id));
    a.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setActiveChat(chat.id);
      }
    });

    chatListEl.appendChild(a);
  }
}

function renderMessages() {
  const chat = getActiveChat();

  // empty state
  if (!chat) {
    emptyStateEl.style.display = "flex";
    return;
  }
  emptyStateEl.style.display = chat.messages.length ? "none" : "flex";

  // header
  chatTitleEl.textContent = chat.name;
  chatStatusEl.textContent = chat.status;

  // keep the day pill, clear others
  [...messagesEl.querySelectorAll(".msg")].forEach((n) => n.remove());

  for (const m of chat.messages) {
    const row = document.createElement("div");
    row.className = `msg ${m.dir === "out" ? "msg--out" : "msg--in"}`;

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = m.text;

    const meta = document.createElement("span");
    meta.className = "meta";
    meta.textContent = formatTime(new Date(m.at));

    bubble.appendChild(meta);
    row.appendChild(bubble);
    messagesEl.appendChild(row);
  }

  scrollToBottom();
}

function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function updateSendButton() {
  const hasText = composerInputEl.value.trim().length > 0;
  sendBtnEl.disabled = !hasText || !getActiveChat();
}

// ---------- Actions ----------
function setActiveChat(chatId) {
  state.activeChatId = chatId;

  // mark as read
  const chat = getActiveChat();
  if (chat) {
    chat.unread = 0;
  }

  saveState(state);
  renderChatList(searchInputEl.value);
  renderMessages();
  updateSendButton();
}

function sendMessage() {
  const chat = getActiveChat();
  if (!chat) return;

  const text = composerInputEl.value.trim();
  if (!text) return;

  chat.messages.push({
    id: crypto.randomUUID(),
    dir: "out",
    text,
    at: nowISO()
  });

  composerInputEl.value = "";
  updateSendButton();

  saveState(state);
  renderChatList(searchInputEl.value);
  renderMessages();

  // Fake auto-reply (demo)
  queueAutoReply(chat.id, text);
}

function queueAutoReply(chatId, userText) {
  const replies = [
    "OK 👍",
    "Je vois !",
    "Ça marche 🙂",
    "Bien reçu.",
    "Haha 😄",
    "On en reparle tout à l’heure."
  ];

  const reply = replies[Math.floor(Math.random() * replies.length)];

  // small "typing" effect via status
  const chat = state.chats.find((c) => c.id === chatId);
  if (!chat) return;

  const prevStatus = chat.status;
  chat.status = "écrit…";
  saveState(state);

  if (state.activeChatId === chatId) {
    chatStatusEl.textContent = chat.status;
  }

  setTimeout(() => {
    const c = state.chats.find((x) => x.id === chatId);
    if (!c) return;

    c.messages.push({
      id: crypto.randomUUID(),
      dir: "in",
      text: reply,
      at: nowISO()
    });

    if (state.activeChatId !== chatId) {
      c.unread = (c.unread || 0) + 1;
    }

    c.status = prevStatus;
    saveState(state);

    renderChatList(searchInputEl.value);
    if (state.activeChatId === chatId) {
      renderMessages();
    }
  }, 800 + Math.random() * 900);
}

function clearCurrentChat() {
  const chat = getActiveChat();
  if (!chat) return;

  chat.messages = [];
  chat.unread = 0;

  saveState(state);
  renderChatList(searchInputEl.value);
  renderMessages();
  updateSendButton();
}

function resetAll() {
  localStorage.removeItem(STORAGE_KEY);
  state = structuredClone(defaultState);
  saveState(state);

  renderChatList("");
  setActiveChat(state.activeChatId);

  composerInputEl.value = "";
  updateSendButton();
}

function createNewChat() {
  const name = prompt("Nom de la nouvelle discussion :", "Nouveau contact");
  if (!name) return;

  const id =
    name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "") +
    "-" +
    Math.floor(Math.random() * 1000);

  state.chats.unshift({
    id,
    name,
    status: "hors ligne",
    unread: 0,
    messages: [{ id: crypto.randomUUID(), dir: "in", text: `Salut ! Je suis ${name}.`, at: nowISO() }]
  });

  state.activeChatId = id;
  saveState(state);

  renderChatList(searchInputEl.value);
  renderMessages();
  updateSendButton();
}

// ---------- Events ----------
searchInputEl.addEventListener("input", (e) => {
  renderChatList(e.target.value);
});

composerInputEl.addEventListener("input", updateSendButton);

composerInputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

sendBtnEl.addEventListener("click", sendMessage);
btnClearChat.addEventListener("click", clearCurrentChat);
btnReset.addEventListener("click", resetAll);
btnNewChat.addEventListener("click", createNewChat);

saveState(state);        
setActiveChat(state.activeChatId);
updateSendButton();
