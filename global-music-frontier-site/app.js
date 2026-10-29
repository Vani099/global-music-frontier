const issues = (window.GMF_ISSUES || []).filter(issue => issue.status === "published");
const app = document.querySelector("#app");
const searchPanel = document.querySelector("#searchPanel");
const searchInput = document.querySelector("#searchInput");

const escapeHtml = value => String(value).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const zhDate = value => new Intl.DateTimeFormat("zh-CN", {year:"numeric", month:"long", day:"numeric"}).format(new Date(`${value}T00:00:00`));

function cover(issue, compact = false) {
  return `<article class="issue-cover ${issue.color || "acid"} ${compact ? "compact" : ""}">
    <div class="cover-top"><span>VOL. ${issue.id}</span><span>${issue.date.replaceAll("-", ".")}</span></div>
    <div class="cover-glyph" aria-hidden="true"><i></i><i></i><i></i></div>
    <div class="cover-copy"><p>GLOBAL MUSIC FRONTIER</p><h2>${escapeHtml(issue.title)}</h2></div>
  </article>`;
}

function homeView(filter = "") {
  const needle = filter.trim().toLowerCase();
  const matches = issues.filter(issue => JSON.stringify(issue).toLowerCase().includes(needle));
  const latest = issues[0];
  const allTags = [...new Set(issues.flatMap(i => i.releases.flatMap(r => r.genres)))].slice(0, 12);
  app.innerHTML = `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">WEEKLY JOURNAL OF NEW MUSIC</p>
        <h1>听见边界<br><em>正在移动。</em></h1>
        <p class="hero-dek">一份关注全球新音乐、独立唱片与声音文化的中文周刊。每周精选、评论与线索，归档成一本可以慢慢翻阅的杂志。</p>
        ${latest ? `<a class="primary-link" href="#/issue/${latest.id}">阅读最新一期 <span>→</span></a>` : ""}
      </div>
      ${latest ? `<a class="cover-link" href="#/issue/${latest.id}" aria-label="阅读第 ${latest.id} 期">${cover(latest)}</a>` : ""}
    </section>
    <section class="archive" id="archive">
      <div class="section-head"><div><p class="eyebrow">THE ARCHIVE</p><h2>${needle ? `搜索结果：${escapeHtml(filter)}` : "全部期刊"}</h2></div><span>${matches.length} ISSUES</span></div>
      <div class="issue-grid">
        ${matches.map(issue => `<a class="archive-card" href="#/issue/${issue.id}">${cover(issue, true)}<div class="card-meta"><span>VOL. ${issue.id}</span><time>${zhDate(issue.date)}</time></div><h3>${escapeHtml(issue.title)}</h3><p>${escapeHtml(issue.dek)}</p></a>`).join("") || `<p class="empty">没有找到相关内容。换一个关键词试试。</p>`}
      </div>
    </section>
    ${!needle ? `<section class="tag-index"><p class="eyebrow">EXPLORE BY SOUND</p><h2>按声音探索</h2><div class="tags">${allTags.map(tag => `<button data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`).join("")}</div></section>` : ""}
  `;
  app.querySelectorAll("[data-tag]").forEach(button => button.addEventListener("click", () => {
    openSearch(button.dataset.tag);
  }));
}

function issueView(id) {
  const issue = issues.find(item => item.id === id);
  if (!issue) return notFound();
  app.innerHTML = `
    <article class="issue-page">
      <a class="back-link" href="#/">← 返回期刊目录</a>
      <header class="issue-hero">
        <div><p class="eyebrow">VOL. ${issue.id} · ${zhDate(issue.date)}</p><h1>${escapeHtml(issue.title)}</h1><p>${escapeHtml(issue.dek)}</p><div class="issue-facts"><span>观察周期：${escapeHtml(issue.period)}</span><span>${issue.releases.length} 张作品</span></div></div>
        ${cover(issue, true)}
      </header>
      <section class="editor-note"><div class="note-label"><span>EDITOR'S NOTE</span><b>本周卷首</b></div><div class="note-body">${issue.editorNote.map((p, i) => `<p class="${i === 0 ? "lead" : ""}">${escapeHtml(p)}</p>`).join("")}</div></section>
      <section class="releases">
        <div class="section-head"><div><p class="eyebrow">ESSENTIAL RELEASES</p><h2>本周值得关注的唱片</h2></div></div>
        ${issue.releases.map(release => `<article class="release">
          <div class="release-rank">${release.rank}</div>
          <div class="album-art" aria-hidden="true"><span>${escapeHtml(release.artist.charAt(0))}</span><i></i></div>
          <div class="release-copy">
            <div class="release-title"><div>${release.pick ? `<span class="pick">本期推荐</span>` : ""}<h3>${escapeHtml(release.artist)} <i>—</i> <em>${escapeHtml(release.album)}</em></h3></div><span class="release-date">${release.releaseDate}</span></div>
            <p class="release-meta">${escapeHtml(release.country)} ／ ${release.genres.map(g => `<button data-tag="${escapeHtml(g)}">${escapeHtml(g)}</button>`).join("、")}<br>${escapeHtml(release.label)}</p>
            <p class="release-summary">${escapeHtml(release.summary)}</p>
            <a class="listen" href="${escapeHtml(release.listenUrl)}" target="_blank" rel="noopener">↗ ${release.track ? `试听《${escapeHtml(release.track)}》` : "查看与试听作品"}</a>
          </div>
        </article>`).join("")}
      </section>
      <nav class="issue-nav"><a href="#/">浏览全部期刊</a><span>VOL. ${issue.id}</span></nav>
    </article>`;
  app.querySelectorAll("[data-tag]").forEach(button => button.addEventListener("click", () => openSearch(button.dataset.tag)));
}

function notFound() {
  app.innerHTML = `<section class="not-found"><p class="eyebrow">404</p><h1>这一期还没有收录。</h1><a class="primary-link" href="#/">返回期刊目录 →</a></section>`;
}

function route() {
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts[0] === "issue") issueView(parts[1]); else homeView();
  window.scrollTo(0, 0);
  app.focus({preventScroll: true});
}

function openSearch(value = "") {
  searchPanel.hidden = false;
  searchInput.value = value;
  searchInput.focus();
  homeView(value);
}

document.querySelector("#searchToggle").addEventListener("click", () => openSearch());
document.querySelector("#searchClose").addEventListener("click", () => { searchPanel.hidden = true; searchInput.value = ""; homeView(); });
searchInput.addEventListener("input", event => homeView(event.target.value));
window.addEventListener("hashchange", route);
route();
