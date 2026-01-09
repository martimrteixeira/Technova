  const cards = document.querySelectorAll(".card");
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");
  const title = document.getElementById("info-title");
  const text = document.getElementById("info-text");
  const editor = document.getElementById("editor-code");
  const challengeText = document.getElementById("challenge");
  const progressBar = document.getElementById("progress-bar");
  const loginModal = document.getElementById("loginModal");
  const loginBtn = document.getElementById("loginBtn");
  const usernameInput = document.getElementById("usernameInput");
  const welcome = document.getElementById("welcome");
  const savedUser = localStorage.getItem("username");
  const htmlEditor = document.getElementById("html-code");
  const cssEditor = document.getElementById("css-code");
  const jsEditor = document.getElementById("js-code");
  const preview = document.getElementById("preview");

  // Carregar código salvo
  htmlEditor.value = localStorage.getItem("html_code") || "";
  cssEditor.value = localStorage.getItem("css_code") || "";
  jsEditor.value = localStorage.getItem("js_code") || "";

  if (savedUser) {
    loginModal.style.display = "none";
    welcome.innerText = `👋 Olá, ${savedUser}!`;
  } else {
    loginModal.style.display = "flex";
  }

  loginBtn.onclick = () => {
    const name = usernameInput.value.trim();

    if (name.length < 2) {
      alert("Digite um nome válido");
      return;
    }

    localStorage.setItem("username", name);
    welcome.innerText = `👋 Olá, ${name}!`;
    loginModal.style.display = "none";
  };


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
    const html = htmlEditor.value;
    const css = cssEditor.value;
    const js = jsEditor.value;

    // salvar
    localStorage.setItem("html_code", html);
    localStorage.setItem("css_code", css);
    localStorage.setItem("js_code", js);

    // montar preview
    const result = `
  <!DOCTYPE html>
  <html>
  <head>
  <style>${css}</style>
  </head>
  <body>
  ${html}
  <script>${js}<\/script>
  </body>
  </html>
    `;

    preview.srcdoc = result;
  };

    if (!currentLang) return alert("Escolha uma linguagem!");

    localStorage.setItem("code_" + currentLang, code);

    if (currentLang === "html") {
      preview.srcdoc = code;
    }

    if (data[currentLang].check(code)) {
      alert("✅ Desafio concluído!");
    }
  ;

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



  const achievementsList = document.getElementById("achievements");
  const rankingList = document.getElementById("ranking");

  let achievements = JSON.parse(localStorage.getItem("achievements")) || [];
  let score = Number(localStorage.getItem("score")) || 0;

  // Atualizar conquistas
  function renderAchievements() {
    achievementsList.innerHTML = "";
    achievements.forEach(a => {
      const li = document.createElement("li");
      li.innerText = "🏅 " + a;
      achievementsList.appendChild(li);
    });
  }

  // Atualizar ranking
  function renderRanking() {
    const user = localStorage.getItem("username");
    if (!user) return;

    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

    const existing = ranking.find(r => r.name === user);
    if (existing) {
      existing.score = score;
    } else {
      ranking.push({ name: user, score });
    }

    ranking.sort((a, b) => b.score - a.score);
    localStorage.setItem("ranking", JSON.stringify(ranking));

    rankingList.innerHTML = "";
    ranking.forEach(r => {
      const li = document.createElement("li");
      li.innerText = `${r.name} — ${r.score} pts`;
      rankingList.appendChild(li);
    });
  }

  // Adicionar conquista
  function addAchievement(text) {
    if (!achievements.includes(text)) {
      achievements.push(text);
      localStorage.setItem("achievements", JSON.stringify(achievements));
      score += 10;
      localStorage.setItem("score", score);
      renderAchievements();
      renderRanking();
      alert("🏆 Nova conquista desbloqueada!");
    }
  }

  // Conquistas automáticas
  cards.forEach(card => {
    card.addEventListener("click", () => {
      addAchievement("Primeira linguagem selecionada");
    });
  });

  document.getElementById("runBtn").addEventListener("click", () => {
    addAchievement("Primeiro código executado");
  });

  // Inicializar
  renderAchievements();
  renderRanking();



