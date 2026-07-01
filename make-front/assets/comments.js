/*
 * Shared comment engine for make-front/ UI mockups.
 * Comments are stored in localStorage, isolated per page by data-page-id.
 * NOTE: comments live only in the browser — they are NOT written back to disk.
 * Reviewers must use "Copy All" or "Export .md" to get feedback to an AI.
 *
 * Optional: change KEY_PREFIX to the project code to avoid localStorage
 * collisions when several projects are opened over file://.
 */
(function () {
  var KEY_PREFIX = 'sts-ui-comments::';
  function pageId() { return document.body.dataset.pageId || 'SCREEN'; }
  function key() { return KEY_PREFIX + pageId(); }
  function load() {
    try { return JSON.parse(localStorage.getItem(key()) || '[]'); } catch (e) { return []; }
  }
  function save(list) { localStorage.setItem(key(), JSON.stringify(list)); }

  function render() {
    var list = load();
    var box = document.getElementById('commentList');
    if (!box) return;
    box.innerHTML = '';
    if (!list.length) {
      box.innerHTML = '<p class="empty">ยังไม่มีคอมเมนต์ — ลองพิมพ์ข้อเสนอแนะเกี่ยวกับหน้าจอนี้ด้านล่าง</p>';
    } else {
      list.slice().reverse().forEach(function (c, revIdx) {
        var idx = list.length - 1 - revIdx;
        var div = document.createElement('div');
        div.className = 'comment-item' + (c.status === 'done' ? ' done' : '');
        var head = document.createElement('div');
        head.className = 'c-head';
        var time = document.createElement('span');
        time.className = 'c-time';
        time.textContent = c.time;
        var actions = document.createElement('div');
        actions.className = 'c-actions';
        var toggleBtn = document.createElement('button');
        toggleBtn.dataset.act = 'toggle'; toggleBtn.dataset.idx = idx;
        toggleBtn.textContent = c.status === 'done' ? '↺ reopen' : '✓ done';
        var delBtn = document.createElement('button');
        delBtn.dataset.act = 'del'; delBtn.dataset.idx = idx;
        delBtn.textContent = '✕';
        actions.appendChild(toggleBtn); actions.appendChild(delBtn);
        head.appendChild(time); head.appendChild(actions);
        var textEl = document.createElement('div');
        textEl.className = 'c-text';
        textEl.textContent = c.text;
        div.appendChild(head); div.appendChild(textEl);
        box.appendChild(div);
      });
      box.querySelectorAll('button').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var idx = +btn.dataset.idx;
          var list = load();
          if (btn.dataset.act === 'del') { list.splice(idx, 1); }
          else { list[idx].status = list[idx].status === 'done' ? 'open' : 'done'; }
          save(list); render();
        });
      });
    }
    updateCount();
  }

  function updateCount() {
    var list = load();
    var badge = document.getElementById('commentCount');
    if (!badge) return;
    var openCount = list.filter(function (c) { return c.status !== 'done'; }).length;
    badge.textContent = list.length ? (openCount + ' open / ' + list.length + ' total') : 'no comments';
  }

  function addComment() {
    var ta = document.getElementById('commentInput');
    var text = ta.value.trim();
    if (!text) return;
    var list = load();
    list.push({ text: text, time: new Date().toLocaleString('th-TH'), status: 'open' });
    save(list); ta.value = ''; render();
  }

  function exportMd() {
    var list = load();
    var id = pageId();
    var md = '# UI Feedback — ' + id + '\n\n';
    if (!list.length) { md += '_no comments_\n'; }
    else {
      list.forEach(function (c, i) {
        md += (i + 1) + '. [' + (c.status === 'done' ? 'x' : ' ') + '] (' + c.time + ') ' + c.text + '\n';
      });
    }
    var blob = new Blob([md], { type: 'text/markdown' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = id + '-feedback.md';
    document.body.appendChild(a); a.click(); a.remove();
  }

  function copyAll() {
    var list = load();
    var id = pageId();
    var txt = 'UI Feedback - ' + id + '\n';
    if (!list.length) txt += '(no comments)\n';
    list.forEach(function (c, i) {
      txt += (i + 1) + '. (' + c.time + ') [' + (c.status || 'open') + '] ' + c.text + '\n';
    });
    var finish = function () {
      var btn = document.getElementById('copyBtn');
      if (btn) { var old = btn.textContent; btn.textContent = '✓ Copied!'; setTimeout(function () { btn.textContent = old; }, 1500); }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(finish).catch(function () { fallbackCopy(txt, finish); });
    } else { fallbackCopy(txt, finish); }
  }

  function fallbackCopy(txt, cb) {
    var ta = document.createElement('textarea');
    ta.value = txt; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta); if (cb) cb();
  }

  document.addEventListener('DOMContentLoaded', function () {
    render();
    var addBtn = document.getElementById('addCommentBtn');
    if (addBtn) addBtn.addEventListener('click', addComment);
    var exportBtn = document.getElementById('exportBtn');
    if (exportBtn) exportBtn.addEventListener('click', exportMd);
    var copyBtn = document.getElementById('copyBtn');
    if (copyBtn) copyBtn.addEventListener('click', copyAll);
    var ta = document.getElementById('commentInput');
    if (ta) ta.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) addComment();
    });
  });
})();
