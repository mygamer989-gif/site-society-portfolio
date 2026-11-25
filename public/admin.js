(function () {
  'use strict';

  let csrfToken = '';
  let useRecovery = false;

  const loadingEl = document.getElementById('admin-loading');
  const setupView = document.getElementById('setup-view');
  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  const logoutBtn = document.getElementById('logout-btn');

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizePreviewUrl(raw) {
    const trimmed = String(raw || '').trim();
    if (!trimmed) return '';
    try {
      const u = new URL(trimmed);
      if (u.hostname === 'drive.google.com') {
        const m = u.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        const id = m?.[1] || u.searchParams.get('id');
        if (id) return `https://lh3.googleusercontent.com/d/${id}`;
      }
      return u.toString();
    } catch {
      return trimmed.startsWith('/') ? trimmed : '';
    }
  }

  async function api(path, options = {}) {
    const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
    if (csrfToken && options.method && options.method !== 'GET') {
      headers['X-CSRF-Token'] = csrfToken;
    }
    const res = await fetch(path, { ...options, headers, credentials: 'same-origin' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `خطا در درخواست (${res.status})`);
    }
    return data;
  }

  async function init() {
    try {
      const status = await api('/api/admin/status');
      loadingEl.hidden = true;
      if (status.needsSetup) {
        setupView.hidden = false;
        loginView.hidden = true;
        dashboardView.hidden = true;
        logoutBtn.hidden = true;
      } else if (!status.authenticated) {
        setupView.hidden = true;
        loginView.hidden = false;
        dashboardView.hidden = true;
        logoutBtn.hidden = true;
      } else {
        csrfToken = status.csrfToken || '';
        setupView.hidden = true;
        loginView.hidden = true;
        dashboardView.hidden = false;
        logoutBtn.hidden = false;
        loadAllDashboardData();
      }
    } catch (err) {
      loadingEl.textContent = err.message || 'خطا در اتصال به سرور مدیریت.';
    }
  }

  // Initial Setup
  const setupForm = document.getElementById('setup-form');
  const setupStatus = document.getElementById('setup-status');
  const setupResult = document.getElementById('setup-result');
  setupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    setupStatus.textContent = '';
    try {
      const data = await api('/api/admin/setup', {
        method: 'POST',
        body: JSON.stringify({
          setupToken: document.getElementById('s-token').value,
          username: document.getElementById('s-username').value,
          password: document.getElementById('s-password').value,
        }),
      });
      setupForm.hidden = true;
      setupResult.hidden = false;
      const secretEl = document.getElementById('totp-secret-display');
      secretEl.textContent = data.totpSecret;

      const qrMount = document.getElementById('totp-qr-mount');
      if (qrMount && typeof window.qrcode === 'function') {
        const qr = window.qrcode(0, 'M');
        qr.addData(data.otpauthUri);
        qr.make();
        qrMount.innerHTML = qr.createSvgTag({ cellSize: 5, margin: 2 });
      }

      const copyBtn = document.getElementById('copy-secret-btn');
      if (copyBtn) {
        copyBtn.onclick = async () => {
          await navigator.clipboard.writeText(data.totpSecret).catch(() => {});
          copyBtn.textContent = 'کپی شد!';
          setTimeout(() => { copyBtn.textContent = 'کپی کلید'; }, 1800);
        };
      }

      document.getElementById('recovery-codes-display').innerHTML = data.recoveryCodes
        .map((c) => `<div class="recovery-item">${esc(c)}</div>`)
        .join('');
    } catch (err) {
      setupStatus.textContent = err.message;
      setupStatus.className = 'form-status error';
    }
  });

  document.getElementById('go-login-btn')?.addEventListener('click', () => {
    setupView.hidden = true;
    loginView.hidden = false;
  });

  // Login Step 1
  const loginStep1 = document.getElementById('login-step1');
  const loginStep2 = document.getElementById('login-step2');
  const loginStatus = document.getElementById('login-status');

  loginStep1?.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginStatus.textContent = '';
    try {
      await api('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({
          username: document.getElementById('l-username').value,
          password: document.getElementById('l-password').value,
        }),
      });
      loginStep1.hidden = true;
      loginStep2.hidden = false;
    } catch (err) {
      loginStatus.textContent = err.message;
      loginStatus.className = 'form-status error';
    }
  });

  document.getElementById('toggle-recovery-btn')?.addEventListener('click', () => {
    useRecovery = !useRecovery;
    document.getElementById('totp-input-wrap').hidden = useRecovery;
    document.getElementById('recovery-input-wrap').hidden = !useRecovery;
    document.getElementById('toggle-recovery-btn').textContent = useRecovery
      ? 'استفاده از کد ۶ رقمی Authenticator'
      : 'استفاده از کد بازیابی یک‌بارمصرف';
  });

  // Login Step 2 (2FA)
  loginStep2?.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginStatus.textContent = '';
    try {
      const payload = useRecovery
        ? { recoveryCode: document.getElementById('l-recovery').value }
        : { totpCode: document.getElementById('l-totp').value };
      const data = await api('/api/admin/verify-2fa', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      csrfToken = data.csrfToken;
      loginView.hidden = true;
      dashboardView.hidden = false;
      logoutBtn.hidden = false;
      loadAllDashboardData();
    } catch (err) {
      loginStatus.textContent = err.message;
      loginStatus.className = 'form-status error';
    }
  });

  logoutBtn?.addEventListener('click', async () => {
    await api('/api/admin/logout', { method: 'POST' }).catch(() => {});
    window.location.reload();
  });

  // Tabs
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      ['projects', 'settings', 'inquiries', 'security'].forEach((t) => {
        document.getElementById(`tab-${t}`).hidden = t !== tab;
      });
    });
  });

  // Live Image Preview
  const imgInput = document.getElementById('p-image');
  const imgPreview = document.getElementById('p-image-preview');
  imgInput?.addEventListener('input', () => {
    const url = normalizePreviewUrl(imgInput.value);
    imgPreview.innerHTML = url
      ? `<img src="${esc(url)}" alt="پیش‌نمایش تصویر" />`
      : 'پیش‌نمایش تصویر اینجا نمایش داده می‌شود';
  });

  // Projects CRUD
  async function loadProjects() {
    const listEl = document.getElementById('admin-projects-list');
    const data = await api('/api/admin/projects');
    const projects = data.projects || [];
    if (projects.length === 0) {
      listEl.innerHTML = '<p style="color: var(--ink-secondary);">هنوز پروژه‌ای ثبت نشده است.</p>';
      return;
    }
    listEl.innerHTML = projects
      .map(
        (p) => `
      <div class="project-row">
        <div class="project-row-head">
          <div>
            <strong>${esc(p.title)}</strong>
            <span style="color: var(--ink-secondary); font-size: 0.82rem; margin-right: 8px;">${esc(p.category)} · ترتیب: ${p.display_order}</span>
          </div>
          <span class="badge ${p.is_published ? 'badge-live' : 'badge-draft'}">
            ${p.is_published ? 'منتشرشده' : 'پیش‌نویس'}
          </span>
        </div>
        <p style="color: var(--ink-secondary); font-size: 0.88rem;">${esc(p.description)}</p>
        <div class="row-actions">
          <button class="btn btn-gold-outline btn-sm" data-action="toggle" data-id="${esc(p.id)}" data-pub="${p.is_published ? '1' : '0'}">
            ${p.is_published ? 'عدم انتشار' : 'انتشار در سایت'}
          </button>
          <button class="btn btn-ghost btn-sm" data-action="edit" data-id="${esc(p.id)}">ویرایش</button>
          <button class="btn btn-danger btn-sm" data-action="delete" data-id="${esc(p.id)}">حذف</button>
        </div>
      </div>
    `
      )
      .join('');

    listEl.querySelectorAll('button[data-action]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        if (action === 'toggle') {
          const isPub = btn.dataset.pub === '1';
          await api(`/api/admin/projects/${id}/publish`, {
            method: 'PATCH',
            body: JSON.stringify({ is_published: !isPub }),
          });
          loadProjects();
        } else if (action === 'delete') {
          if (!confirm('آیا از حذف دائمی این پروژه مطمئن هستید؟')) return;
          await api(`/api/admin/projects/${id}`, { method: 'DELETE' });
          loadProjects();
        } else if (action === 'edit') {
          const proj = projects.find((x) => x.id === id);
          if (!proj) return;
          document.getElementById('p-id').value = proj.id;
          document.getElementById('p-title').value = proj.title;
          document.getElementById('p-category').value = proj.category;
          document.getElementById('p-order').value = String(proj.display_order);
          document.getElementById('p-desc').value = proj.description;
          document.getElementById('p-techs').value = (proj.technologies || []).join(', ');
          document.getElementById('p-image').value = proj.thumbnail_url || '';
          document.getElementById('p-live').value = proj.live_url || '';
          document.getElementById('p-published').checked = proj.is_published;
          document.getElementById('form-heading').textContent = 'ویرایش پروژه';
          document.getElementById('reset-project-btn').hidden = false;
          imgInput.dispatchEvent(new Event('input'));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  const projectForm = document.getElementById('project-form');
  const projectStatus = document.getElementById('project-status');
  const resetProjectBtn = document.getElementById('reset-project-btn');

  function resetProjectForm() {
    projectForm.reset();
    document.getElementById('p-id').value = '';
    document.getElementById('form-heading').textContent = 'افزودن پروژه جدید';
    resetProjectBtn.hidden = true;
    imgPreview.innerHTML = 'پیش‌نمایش تصویر اینجا نمایش داده می‌شود';
  }

  resetProjectBtn?.addEventListener('click', resetProjectForm);

  projectForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    projectStatus.textContent = '';
    const id = document.getElementById('p-id').value;
    const payload = {
      title: document.getElementById('p-title').value,
      category: document.getElementById('p-category').value,
      display_order: Number(document.getElementById('p-order').value || 0),
      description: document.getElementById('p-desc').value,
      technologies: document.getElementById('p-techs').value,
      thumbnail_url: document.getElementById('p-image').value,
      live_url: document.getElementById('p-live').value,
      is_published: document.getElementById('p-published').checked,
    };
    try {
      if (id) {
        await api(`/api/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await api('/api/admin/projects', { method: 'POST', body: JSON.stringify(payload) });
      }
      resetProjectForm();
      projectStatus.textContent = 'پروژه با موفقیت ذخیره شد.';
      projectStatus.className = 'form-status success';
      loadProjects();
    } catch (err) {
      projectStatus.textContent = err.message;
      projectStatus.className = 'form-status error';
    }
  });

  // Preview Modal
  const previewModal = document.getElementById('preview-modal');
  document.getElementById('preview-btn')?.addEventListener('click', () => {
    const title = document.getElementById('p-title').value || 'پروژه بدون عنوان';
    const category = document.getElementById('p-category').value || 'دسته‌بندی';
    const desc = document.getElementById('p-desc').value || 'پیش‌نمایش توضیحات پروژه.';
    const imgUrl = normalizePreviewUrl(document.getElementById('p-image').value);
    const liveUrl = document.getElementById('p-live').value;
    const techs = document
      .getElementById('p-techs')
      .value.split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    document.getElementById('preview-card-mount').innerHTML = `
      <article class="project-card">
        <div class="project-media">
          ${imgUrl ? `<img src="${esc(imgUrl)}" alt="${esc(title)}" />` : '<div class="project-media-placeholder">بدون تصویر</div>'}
        </div>
        <div class="project-body">
          <div class="project-meta"><span class="project-category">${esc(category)}</span></div>
          <h3 class="project-title">${esc(title)}</h3>
          <p class="project-desc">${esc(desc)}</p>
          <div class="project-techs">${techs.map((t) => `<span class="tech-pill">${esc(t)}</span>`).join('')}</div>
          ${liveUrl ? `<a href="${esc(liveUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-gold-outline btn-sm">مشاهده وب‌سایت زنده &#8599;</a>` : ''}
        </div>
      </article>
    `;
    previewModal.hidden = false;
  });

  document.getElementById('close-preview-btn')?.addEventListener('click', () => {
    previewModal.hidden = true;
  });

  // Settings
  async function loadSettings() {
    const data = await api('/api/admin/settings');
    const s = data.settings || {};
    document.getElementById('set-email').value = s.contact_email || '';
    document.getElementById('set-phone').value = s.contact_phone || '';
    document.getElementById('set-telegram').value = s.social_telegram || '';
    document.getElementById('set-canonical').value = s.canonical_url || '';
    document.getElementById('set-github').value = s.social_github || '';
    document.getElementById('set-x').value = s.social_x || '';
    document.getElementById('set-linkedin').value = s.social_linkedin || '';
    document.getElementById('set-instagram').value = s.social_instagram || '';
  }

  document.getElementById('settings-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('settings-status');
    status.textContent = '';
    try {
      await api('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({
          contact_email: document.getElementById('set-email').value,
          contact_phone: document.getElementById('set-phone').value,
          social_telegram: document.getElementById('set-telegram').value,
          canonical_url: document.getElementById('set-canonical').value,
          social_github: document.getElementById('set-github').value,
          social_x: document.getElementById('set-x').value,
          social_linkedin: document.getElementById('set-linkedin').value,
          social_instagram: document.getElementById('set-instagram').value,
        }),
      });
      status.textContent = 'تنظیمات با موفقیت ذخیره شد.';
      status.className = 'form-status success';
    } catch (err) {
      status.textContent = err.message;
      status.className = 'form-status error';
    }
  });

  // Inquiries
  async function loadInquiries() {
    const data = await api('/api/admin/inquiries');
    const list = data.inquiries || [];
    const badge = document.getElementById('inquiries-badge');
    if (badge) {
      badge.textContent = String(list.length);
      badge.style.display = list.length > 0 ? 'inline-block' : 'none';
    }
    const el = document.getElementById('inquiries-list');
    if (list.length === 0) {
      el.innerHTML = '<p style="color: var(--ink-secondary);">هنوز پیامی از طرف مشتریان ثبت نشده است.</p>';
      return;
    }
    el.innerHTML = list
      .map(
        (q) => `
      <div class="project-row">
        <div class="project-row-head">
          <div>
            <strong>${esc(q.name)}</strong> (<span dir="ltr">${esc(q.email)}</span>)
            ${q.company ? `· ${esc(q.company)}` : ''}
            ${q.service ? `· <span style="color: var(--bronze-dark);">${esc(q.service)}</span>` : ''}
          </div>
          <span style="color: var(--ink-muted); font-size: 0.78rem;" dir="ltr">${esc(q.created_at)}</span>
        </div>
        <p style="color: var(--ink-secondary); font-size: 0.9rem;">${esc(q.message)}</p>
        <div class="row-actions">
          <a class="btn btn-gold-outline btn-sm" href="mailto:${esc(q.email)}">پاسخ با ایمیل</a>
          <button class="btn btn-danger btn-sm" data-del-inq="${esc(q.id)}">حذف</button>
        </div>
      </div>
    `
      )
      .join('');

    el.querySelectorAll('button[data-del-inq]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        await api(`/api/admin/inquiries/${btn.dataset.delInq}`, { method: 'DELETE' });
        loadInquiries();
      });
    });
  }

  // Sessions & Owner Controls
  async function loadSessions() {
    const data = await api('/api/admin/sessions');
    const list = data.sessions || [];
    const el = document.getElementById('sessions-list');
    if (!el) return;
    el.innerHTML = list
      .map(
        (s) => `
      <div class="project-row" style="padding:12px 14px;">
        <div class="project-row-head">
          <span style="font-family:var(--font-mono);font-size:0.78rem;" dir="ltr">${esc(s.ip_address)} · ${esc(s.id)}</span>
          ${s.is_current ? '<span class="badge badge-live">نشست فعلی</span>' : '<span class="badge badge-draft">سایر دستگاه‌ها</span>'}
        </div>
        <div style="font-size:0.76rem;color:var(--ink-muted);" dir="ltr">${esc(s.user_agent)}</div>
      </div>
    `
      )
      .join('');
  }

  document.getElementById('revoke-others-btn')?.addEventListener('click', async () => {
    await api('/api/admin/sessions/revoke-others', { method: 'POST' });
    loadSessions();
    loadLogs();
  });

  document.getElementById('change-pw-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const st = document.getElementById('pw-status');
    st.textContent = '';
    try {
      await api('/api/admin/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: document.getElementById('pw-current').value,
          newPassword: document.getElementById('pw-new').value,
        }),
      });
      e.target.reset();
      st.textContent = 'رمز عبور تغییر کرد.';
      st.className = 'form-status success';
      loadLogs();
    } catch (err) {
      st.textContent = err.message;
      st.className = 'form-status error';
    }
  });

  document.getElementById('regen-recovery-btn')?.addEventListener('click', async () => {
    if (!confirm('کدهای بازیابی قبلی باطل و ۸ کد جدید ساخته می‌شوند. ادامه می‌دهید؟')) return;
    const data = await api('/api/admin/regenerate-recovery', { method: 'POST' });
    const mount = document.getElementById('new-recovery-mount');
    mount.innerHTML = data.recoveryCodes.map((c) => `<div class="recovery-item">${esc(c)}</div>`).join('');
    mount.hidden = false;
    loadLogs();
  });

  document.getElementById('download-backup-btn')?.addEventListener('click', async () => {
    const data = await api('/api/admin/backup');
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `site-society-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Security Logs
  async function loadLogs() {
    const data = await api('/api/admin/security-logs');
    const logs = data.logs || [];
    const el = document.getElementById('logs-list');
    if (logs.length === 0) {
      el.innerHTML = '<p style="color: var(--ink-secondary);">رویداد امنیتی ثبت نشده است.</p>';
      return;
    }
    el.innerHTML = logs
      .map(
        (l) => `
      <div class="project-row" style="padding: 12px 14px;">
        <div class="project-row-head">
          <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--bronze-dark);" dir="ltr">${esc(l.event)}</span>
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--ink-muted);" dir="ltr">${esc(l.created_at)} · ${esc(l.ip_address)}</span>
        </div>
        ${l.details ? `<div style="font-size: 0.78rem; color: var(--ink-secondary);" dir="ltr">${esc(l.details)}</div>` : ''}
      </div>
    `
      )
      .join('');
  }

  document.getElementById('clear-logs-btn')?.addEventListener('click', async () => {
    if (!confirm('لاگ‌های امنیتی پاک شوند؟')) return;
    await api('/api/admin/security-logs', { method: 'DELETE' });
    loadLogs();
  });

  function loadAllDashboardData() {
    loadProjects();
    loadSettings();
    loadInquiries();
    loadSessions();
    loadLogs();
  }

  init();
})();
