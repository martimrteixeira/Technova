document.addEventListener("DOMContentLoaded", () => {

  // LOGIN
  const modal = document.getElementById("loginModal");
  const loginBtn = document.getElementById("loginBtn");
  const input = document.getElementById("usernameInput");
  const welcome = document.getElementById("welcome");

  const user = localStorage.getItem("username");

  if (user) {
    modal.style.display = "none";
    welcome.innerText = `👋 Olá, ${user}`;
  }

  loginBtn.onclick = () => {
    if (input.value.trim().length < 2) return alert("Nome inválido");
    localStorage.setItem("username", input.value);
    welcome.innerText = `👋 Olá, ${input.value}`;
    modal.style.display = "none";
  };

  // EDITOR
  const html = document.getElementById("html-code");
  const css = document.getElementById("css-code");
  const js = document.getElementById("js-code");
  const preview = document.getElementById("preview");
  const runBtn = document.getElementById("runBtn");

  runBtn.onclick = () => {
    runBtn.innerText = "⏳ Executando...";
    setTimeout(() => runBtn.innerText = "▶ Executar", 500);

    const result = `
<!DOCTYPE html>
<html>
<head><style>${css.value}</style></head>
<body>
${html.value}
<script>${js.value}<\/script>
</body>
</html>`;

    preview.srcdoc = result;

    addAchievement("Primeiro código executado");
  };

  // CONQUISTAS + RANKING
  const achievementsEl = document.getElementById("achievements");
  const rankingEl = document.getElementById("ranking");

  let achievements = JSON.parse(localStorage.getItem("achievements")) || [];
  let score = Number(localStorage.getItem("score")) || 0;

  function renderAchievements() {
    achievementsEl.innerHTML = "";
    achievements.forEach(a => {
      const li = document.createElement("li");
      li.innerText = "🏅 " + a;
      achievementsEl.appendChild(li);
    });
  }

  function addAchievement(text) {
    if (!achievements.includes(text)) {
      achievements.push(text);
      score += 10;
      localStorage.setItem("achievements", JSON.stringify(achievements));
      localStorage.setItem("score", score);
      renderAchievements();
      renderRanking();
      alert("🏆 Nova conquista!");
    }
  }

  function renderRanking() {
    const name = localStorage.getItem("username");
    if (!name) return;

    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
    const found = ranking.find(r => r.name === name);

    if (found) found.score = score;
    else ranking.push({ name, score });

    ranking.sort((a,b) => b.score - a.score);
    localStorage.setItem("ranking", JSON.stringify(ranking));

    rankingEl.innerHTML = "";
    ranking.forEach(r => {
      const li = document.createElement("li");
      li.innerText = `${r.name} — ${r.score} pts`;
      rankingEl.appendChild(li);
    });
  }

  renderAchievements();
  renderRanking();
});
