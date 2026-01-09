const cards = document.querySelectorAll(".card");
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");

const title = document.getElementById("info-title");
const text = document.getElementById("info-text");
const editor = document.getElementById("editor-code");
const preview = document.getElementById("preview");
const challengeText = document.getElementById("challenge");
const progressBar = document.getElementById("progress-bar");

let currentLang = null;
let progress = localStorage.getItem("progress") || 0;
progressBar.style.width = progress + "%";

const data = {
  html: {
    title: "HTML",
    sobre: "HTML cria a estrutura das páginas.",
    desafio: "Desafio: crie um <h1> com seu nome",
    check: code => code.includes("<h1>")
  },
  css: {
    title: "CSS",
    sobre: "CSS estiliza os elementos.",
    desafio: "Desafio: mude a cor do fundo",
    check: code => code.includes("background")
  },
  js: {
    title: "JavaScript",
    sobre: "JS adiciona interatividade.",
    desafio: "Desafio: use alert()",
    check: code => code.includes("alert")
  }
};

// Selecionar linguagem
cards.forEach(card => {
  card.onclick = () => {
    cards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");

    currentLang = card.dataset.lang;
    const info = data[currentLang];

    title.innerText = info.title;
    text.innerText = info.sobre;
    challengeText.innerText = info.desafio;

    editor.value = localStorage.getItem("code_" + currentLang) || "";

    progress = Math.min(100, Number(progress) + 34);
    progressBar.style.width = progress + "%";
    localStorage.setItem("progress", progress);
  };
});

// Tabs
tabs.forEach(tab => {
  tab.onclick = () => {
    tabs.forEach(t => t.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  };
});

// Executar código
document.getElementById("runBtn").onclick = () => {
  const code = editor.value;

  if (!currentLang) return alert("Escolha uma linguagem!");

  localStorage.setItem("code_" + currentLang, code);

  if (currentLang === "html") {
    preview.srcdoc = code;
  }

  if (data[currentLang].check(code)) {
    alert("✅ Desafio concluído!");
  }
};

// Limpar
document.getElementById("resetBtn").onclick = () => {
  editor.value = "";
  preview.srcdoc = "";
  localStorage.removeItem("code_" + currentLang);
};

// Tema
document.getElementById("themeBtn").onclick = () => {
  document.body.classList.toggle("light");
};
