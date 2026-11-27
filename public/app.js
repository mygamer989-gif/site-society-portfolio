(function () {
  'use strict';

  const DICT = {
    en: {
      page_title: 'SITE SOCIETY — Bespoke Web Design & Digital Engineering Studio',
      nav_home: 'Home',
      nav_work: 'Work',
      nav_about: 'About',
      nav_services: 'Services',
      nav_process: 'Process',
      nav_contact: 'Contact',
      nav_cta: 'Start a Project',
      hero_eyebrow: 'DIGITAL DESIGN & ENGINEERING STUDIO',
      hero_title: 'Bespoke Digital <br /><em>Architecture</em> for <br />Discerning Brands.',
      hero_subtitle:
        'SITE SOCIETY designs and engineers refined websites, editorial digital experiences, and custom web applications — built for clarity, speed, and enduring craft.',
      hero_cta_primary: 'Explore Selected Work',
      hero_cta_secondary: 'Initiate an Inquiry',
      home_strip_label: 'SELECTED SHOWCASES',
      home_strip_cta: 'View All Projects ↗',
      work_kicker: '01 / SELECTED WORK',
      work_title: 'Portfolio',
      work_lead: 'Verified digital products and websites designed, engineered, and deployed by SITE SOCIETY.',
      work_notice:
        'Most showcased projects here are simplified demonstration builds to introduce our design direction and structure; your custom website will be engineered with 100% higher craft, depth, and production quality.',
      work_toggle_on: 'Auto-Slide: ON',
      work_toggle_off: 'Auto-Slide: OFF',
      work_loading: 'Loading curated works...',
      work_empty_t: 'Selected Works',
      work_empty_d: 'Portfolio entries are currently being curated and will be published here once verified.',
      work_error_t: 'Unable to Load Portfolio',
      work_error_d: 'Please refresh the page in a moment.',
      work_view_live: 'View Live Website ↗',
      work_preview_pending: 'PREVIEW PENDING',
      about_kicker: '02 / THE STUDIO',
      about_title: 'Where Editorial Taste Meets <em>Modern Engineering.</em>',
      about_copy:
        'SITE SOCIETY is built around a singular focus: creating websites that feel unmistakable, perform effortlessly, and serve clear business objectives. Every layout, typographic decision, and line of code is crafted with deliberate restraint and attention to detail.',
      pillar1_t: 'Design Precision',
      pillar1_d: 'Coherent visual systems, balanced whitespace, and Swiss-inspired typographic hierarchy tailored to each brand.',
      pillar2_t: 'Modern Development',
      pillar2_d: 'Clean, semantic, edge-ready architecture engineered for reliability, maintainability, and fast global delivery.',
      pillar3_t: 'Business-Focused Execution',
      pillar3_d: 'Every interface is structured to communicate value clearly and guide visitors toward meaningful action.',
      pillar4_t: 'Quality & Security',
      pillar4_d: 'Rigorous attention to accessibility, responsive behavior, technical SEO, and hardened server-side practices.',
      services_kicker: '03 / CAPABILITIES',
      services_title: 'Services',
      services_lead: 'Focused web design and engineering offerings tailored to ambitious businesses and digital products.',
      srv1_t: 'Website Design',
      srv1_d: 'Bespoke visual direction, UI/UX architecture, and responsive design systems crafted from first principles.',
      srv2_t: 'Website Development',
      srv2_d: 'Production-grade frontend and backend implementation with clean code, smooth motion, and strict standards.',
      srv3_t: 'Landing Pages',
      srv3_d: 'High-clarity campaign and product pages designed to present your offering with authority and precision.',
      srv4_t: 'Business Websites',
      srv4_d: 'Complete digital flagships for companies seeking a credible, refined, and memorable online presence.',
      srv5_t: 'E-commerce Websites',
      srv5_d: 'Thoughtfully structured storefronts focused on product presentation, intuitive navigation, and trust.',
      srv6_t: 'Custom Web Applications',
      srv6_d: 'Tailored interactive platforms, dashboards, and full-stack web tools built around your exact workflow.',
      srv7_t: 'Website Optimization',
      srv7_d: 'Core Web Vitals tuning, asset optimization, and technical SEO improvements for faster, cleaner delivery.',
      srv8_t: 'Website Maintenance',
      srv8_d: 'Ongoing updates, security hardening, monitoring, and careful iteration to keep your site dependable.',
      process_kicker: '04 / METHODOLOGY',
      process_title: 'Process',
      process_lead: 'A structured six-stage workflow ensuring clarity from initial conversation to production launch.',
      proc1_t: 'Discovery',
      proc1_d: 'Understanding your goals, audience, brand positioning, and technical requirements.',
      proc2_t: 'Planning',
      proc2_d: 'Defining information architecture, scope, technical stack, and structural wireframes.',
      proc3_t: 'Design',
      proc3_d: 'Crafting typography, color systems, interface components, and responsive layouts.',
      proc4_t: 'Development',
      proc4_d: 'Engineering clean frontend interfaces, secure backend APIs, and database integrations.',
      proc5_t: 'Testing',
      proc5_d: 'Verifying cross-device responsiveness, security controls, SEO metadata, and performance.',
      proc6_t: 'Deployment',
      proc6_d: 'Launching on edge infrastructure with SSL, DNS configuration, and post-launch verification.',
      contact_kicker: '05 / CONTACT',
      contact_title: 'Begin a <em>Conversation.</em>',
      contact_lead: 'Share your project scope, timeline, or questions. Every inquiry is reviewed directly.',
      contact_email_label: 'Direct Email',
      contact_phone_label: 'Phone',
      contact_telegram_label: 'Telegram',
      form_name: 'Full Name',
      form_email: 'Email Address',
      form_phone: 'Phone Number (Optional)',
      form_company: 'Company / Brand (Optional)',
      form_service: 'Service Focus',
      form_brief: 'Project Brief',
      form_submit: 'Send Inquiry',
      form_sending: 'Sending...',
      form_sent: 'Thank you. Your inquiry has been received.',
      form_invalid: 'Please complete your name, valid email, and a brief description.',
      opt_select: 'Select a service',
      ph_name: 'Your name',
      ph_phone: '+98 9...',
      ph_company: 'Brand or organization',
      ph_message: 'Tell us about your project, goals, and timeline...',
      footer_tagline: 'International Website Design & Digital Engineering Studio.',
      footer_rights: 'All rights reserved.',
    },
    fa: {
      page_title: 'SITE SOCIETY — استودیوی طراحی و مهندسی وب',
      nav_home: 'خانه',
      nav_work: 'نمونه کارها',
      nav_about: 'درباره ما',
      nav_services: 'خدمات',
      nav_process: 'فرآیند کار',
      nav_contact: 'تماس',
      nav_cta: 'شروع پروژه',
      hero_eyebrow: 'استودیوی طراحی و مهندسی تجربه‌های دیجیتال',
      hero_title: 'معماری دیجیتال <em>اختصاصی</em><br />برای برندهای پیشرو.',
      hero_subtitle:
        'SITE SOCIETY وب‌سایت‌های متمایز، تجربه‌های دیجیتال دقیق و اپلیکیشن‌های تحت وب مدرن را با تمرکز بر وضوح، سرعت و کیفیت ماندگار طراحی و پیاده‌سازی می‌کند.',
      hero_cta_primary: 'مشاهده نمونه کارها',
      hero_cta_secondary: 'ثبت درخواست پروژه',
      home_strip_label: 'آثار منتخب',
      home_strip_cta: 'مشاهده همه پروژه‌ها ↗',
      work_kicker: '01 / آثار منتخب',
      work_title: 'نمونه کارها',
      work_lead: 'پروژه‌های واقعی و منتشرشده که توسط SITE SOCIETY طراحی، مهندسی و مستقر شده‌اند.',
      work_notice:
        'بیشتر نمونه کارهای این بخش حالت نمایشی ساده برای آشنایی شما با سبک و ساختار کار ما دارند؛ وب‌سایت اختصاصی شما ۱۰۰٪ با کیفیت، جزئیات و استاندارد بسیار بالاتری تولید خواهد شد.',
      work_toggle_on: 'حرکت خودکار: روشن',
      work_toggle_off: 'حرکت خودکار: خاموش',
      work_loading: 'در حال بارگذاری آثار منتخب...',
      work_empty_t: 'آثار منتخب',
      work_empty_d: 'نمونه کارهای پورتفولیو در حال آماده‌سازی هستند و پس از تأیید نهایی در این بخش منتشر می‌شوند.',
      work_error_t: 'خطا در بارگذاری نمونه کارها',
      work_error_d: 'لطفاً صفحه را مجدداً بارگذاری کنید.',
      work_view_live: 'مشاهده وب‌سایت زنده ↗',
      work_preview_pending: 'پیش‌نمایش در انتظار ثبت',
      about_kicker: '02 / درباره استودیو',
      about_title: 'جایی که ظرافت طراحی با <em>مهندسی مدرن</em> پیوند می‌خورد.',
      about_copy:
        'تمرکز SITE SOCIETY بر ساخت وب‌سایت‌هایی است که هویت برند شما را متمایز نشان دهند، بدون نقص عمل کنند و مستقیماً در خدمت اهداف تجاری شما باشند. هر چیدمان، انتخاب تایپوگرافی و خط کد با دقت و وسواس حرفه‌ای اجرا می‌شود.',
      pillar1_t: 'دقت در طراحی',
      pillar1_d: 'سیستم بصری منسجم، فضای سفید متعادل و سلسله‌مراتب تایپوگرافی دقیق متناسب با هر برند.',
      pillar2_t: 'توسعه مدرن',
      pillar2_d: 'معماری تمیز، معنایی و آماده استقرار در لبه شبکه برای سرعت بالا و پایداری طولانی‌مدت.',
      pillar3_t: 'اجرای کسب‌وکارمحور',
      pillar3_d: 'هر رابط کاربری طوری ساختاردهی می‌شود که ارزش برند را شفاف منتقل و مخاطب را هدایت کند.',
      pillar4_t: 'کیفیت و امنیت',
      pillar4_d: 'توجه دقیق به ریسپانسیو بودن، دسترس‌پذیری، سئوی فنی و استانداردهای سخت‌گیرانه امنیتی.',
      services_kicker: '03 / توانمندی‌ها',
      services_title: 'خدمات',
      services_lead: 'خدمات تخصصی طراحی و مهندسی وب متناسب با نیاز کسب‌وکارها و محصولات دیجیتال.',
      srv1_t: 'طراحی وب‌سایت',
      srv1_d: 'خلق هویت بصری اختصاصی، معماری UI/UX و طراحی ریسپانسیو از پایه.',
      srv2_t: 'توسعه وب‌سایت',
      srv2_d: 'پیاده‌سازی فرانت‌اند و بک‌اند استاندارد با کدنویسی تمیز و انیمیشن‌های سبک.',
      srv3_t: 'لندینگ پیج (Landing Pages)',
      srv3_d: 'صفحات معرفی محصول و کمپین با وضوح پیام بالا و ساختار حرفه‌ای.',
      srv4_t: 'وب‌سایت‌های شرکتی و تجاری',
      srv4_d: 'پایگاه دیجیتال جامع برای شرکت‌هایی که به دنبال حضوری معتبر و ماندگار هستند.',
      srv5_t: 'وب‌سایت‌های فروشگاهی',
      srv5_d: 'فروشگاه‌های اینترنتی با تمرکز بر نمایش زیبای محصول، ناوبری روان و اعتمادسازی.',
      srv6_t: 'وب‌اپلیکیشن‌های اختصاصی',
      srv6_d: 'پلتفرم‌های تعاملی، داشبوردها و ابزارهای تحت وب سفارشی مطابق فرآیند کاری شما.',
      srv7_t: 'بهینه‌سازی وب‌سایت',
      srv7_d: 'بهبود Core Web Vitals، بهینه‌سازی دارایی‌ها و ارتقای سئوی فنی برای سرعت بیشتر.',
      srv8_t: 'نگهداری و پشتیبانی',
      srv8_d: 'به‌روزرسانی مداوم، تقویت امنیت، پایش و توسعه تدریجی برای پایداری همیشگی سایت.',
      process_kicker: '04 / متدولوژی',
      process_title: 'فرآیند اجرا',
      process_lead: 'ساختار شش‌مرحله‌ای شفاف از نخستین گفتگو تا استقرار نهایی پروژه.',
      proc1_t: 'کشف و شناخت (Discovery)',
      proc1_d: 'شناخت دقیق اهداف، مخاطبان، جایگاه برند و نیازمندی‌های فنی پروژه.',
      proc2_t: 'برنامه‌ریزی (Planning)',
      proc2_d: 'تدوین معماری اطلاعات، محدوده کار، پشته فناوری و ساختار وایرفریم‌ها.',
      proc3_t: 'طراحی (Design)',
      proc3_d: 'طراحی تایپوگرافی، پالت رنگی، کامپوننت‌های رابط کاربری و چیدمان ریسپانسیو.',
      proc4_t: 'توسعه (Development)',
      proc4_d: 'پیاده‌سازی فرانت‌اند تمیز، APIهای امن بک‌اند و اتصال به پایگاه داده.',
      proc5_t: 'آزمون (Testing)',
      proc5_d: 'بررسی ریسپانسیو در دستگاه‌های مختلف، کنترل‌های امنیتی، متادیتای سئو و کارایی.',
      proc6_t: 'استقرار (Deployment)',
      proc6_d: 'راه‌اندازی روی زیرساخت ابری با گواهی SSL، تنظیمات DNS و پایش پس از انتشار.',
      contact_kicker: '05 / ارتباط با ما',
      contact_title: 'گفتگو را <em>آغاز کنید.</em>',
      contact_lead: 'محدوده پروژه، زمان‌بندی یا پرسش‌های خود را بنویسید. تمام پیام‌ها مستقیماً بررسی می‌شوند.',
      contact_email_label: 'ایمیل مستقیم',
      contact_phone_label: 'شماره تماس',
      contact_telegram_label: 'تلگرام',
      form_name: 'نام و نام خانوادگی',
      form_email: 'ایمیل',
      form_phone: 'شماره تماس (اختیاری)',
      form_company: 'شرکت / برند (اختیاری)',
      form_service: 'موضوع خدمت',
      form_brief: 'توضیحات پروژه',
      form_submit: 'ارسال درخواست',
      form_sending: 'در حال ارسال...',
      form_sent: 'سپاسگزاریم. درخواست شما با موفقیت ثبت شد.',
      form_invalid: 'لطفاً نام، ایمیل معتبر و توضیحات پروژه (حداقل ۱۰ کاراکتر) را وارد کنید.',
      opt_select: 'انتخاب خدمت',
      ph_name: 'نام شما',
      ph_phone: '+98 9...',
      ph_company: 'نام برند یا مجموعه',
      ph_message: 'درباره پروژه، اهداف و زمان‌بندی مورد نظر بنویسید...',
      footer_tagline: 'استودیوی بین‌المللی طراحی و مهندسی وب.',
      footer_rights: 'تمامی حقوق محفوظ است.',
    },
  };

  // Default to English ('en') on first visit
  let currentLang = localStorage.getItem('ss_lang') === 'fa' ? 'fa' : 'en';
  let activeTab = 'home';
  let cachedProjects = null;
  let cachedSettings = null;
  let autoSlideEnabled = true;
  let autoSlideTimer = null;

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Studio Entrance Preloader
  const preloader = document.getElementById('studio-preloader');
  if (preloader) {
    if (reducedMotion) {
      preloader.remove();
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => {
          preloader.classList.add('is-done');
          setTimeout(() => preloader.remove(), 750);
        }, 720);
      });
      // Safety fallback
      setTimeout(() => {
        if (document.body.contains(preloader)) {
          preloader.classList.add('is-done');
          setTimeout(() => preloader.remove(), 750);
        }
      }, 2200);
    }
  }

  // 2. Real-Time 3D Geodesic Sculpture + Orbiting Nodes on Hero Canvas
  function initHero3D() {
    const canvas = document.getElementById('hero-3d-canvas');
    if (!canvas || reducedMotion) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0.35;
    let targetRotY = 0.45;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = Math.min(540, Math.max(380, rect.height));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener(
      'pointermove',
      (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      },
      { passive: true }
    );

    // Icosahedron vertices & edges
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawVerts = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
    ].map(([x, y, z]) => {
      const len = Math.hypot(x, y, z);
      return [x / len, y / len, z / len];
    });

    const edges = [];
    for (let i = 0; i < rawVerts.length; i++) {
      for (let j = i + 1; j < rawVerts.length; j++) {
        const d = Math.hypot(
          rawVerts[i][0] - rawVerts[j][0],
          rawVerts[i][1] - rawVerts[j][1],
          rawVerts[i][2] - rawVerts[j][2]
        );
        if (d < 1.15) edges.push([i, j]);
      }
    }

    const particles = Array.from({ length: 36 }, (_, i) => ({
      theta: (i / 36) * Math.PI * 2,
      phi: Math.acos(2 * ((i * 0.6180339887) % 1) - 1),
      r: 1.35 + (i % 5) * 0.14,
      color: i % 3 === 0 ? 'rgba(22, 91, 76, 0.55)' : i % 3 === 1 ? 'rgba(154, 116, 66, 0.55)' : 'rgba(31, 58, 95, 0.45)',
      size: 1.8 + (i % 3),
    }));

    let angleY = 0;
    let angleX = 0.25;

    function project([x, y, z], cx, cy, scale) {
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX;

      const fov = 3.4;
      const depth = fov / (fov + z2);
      return {
        sx: cx + x1 * scale * depth,
        sy: cy + y2 * scale * depth,
        depth,
        z: z2,
      };
    }

    function frame() {
      if (activeTab === 'home') {
        ctx.clearRect(0, 0, w, h);
        targetRotY += 0.0045;
        angleY += (targetRotY + mouseX * 0.45 - angleY) * 0.06;
        angleX += (targetRotX + mouseY * 0.35 - angleX) * 0.06;

        const isMobile = w < 768;
        const cx = isMobile ? w * 0.78 : document.documentElement.dir === 'rtl' ? w * 0.22 : w * 0.78;
        const cy = isMobile ? h * 0.36 : h * 0.46;
        const scale = isMobile ? 95 : 145;

        const projectedVerts = rawVerts.map((v) => project(v, cx, cy, scale));

        // Draw 3D edges
        ctx.lineWidth = 1.1;
        for (const [a, b] of edges) {
          const pa = projectedVerts[a];
          const pb = projectedVerts[b];
          const alpha = Math.max(0.08, Math.min(0.38, (pa.depth + pb.depth) * 0.16));
          ctx.strokeStyle = `rgba(154, 116, 66, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(pa.sx, pa.sy);
          ctx.lineTo(pb.sx, pb.sy);
          ctx.stroke();
        }

        // Draw inner secondary ring
        for (const p of projectedVerts) {
          ctx.fillStyle = p.z < 0 ? 'rgba(22, 91, 76, 0.75)' : 'rgba(154, 116, 66, 0.35)';
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, 2.8 * p.depth, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw orbiting 3D particles
        for (const pt of particles) {
          const px = pt.r * Math.sin(pt.phi) * Math.cos(pt.theta + angleY * 0.6);
          const py = pt.r * Math.cos(pt.phi);
          const pz = pt.r * Math.sin(pt.phi) * Math.sin(pt.theta + angleY * 0.6);
          const proj = project([px, py, pz], cx, cy, scale);
          ctx.fillStyle = pt.color;
          ctx.beginPath();
          ctx.arc(proj.sx, proj.sy, pt.size * proj.depth, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  // 3. 3D Tilt + Specular Glare + Magnetic Buttons
  function bind3DMotion() {
    if (reducedMotion) return;
    document.querySelectorAll('.project-card, .pillar-card, .service-card, .process-step, .contact-channel-btn').forEach((card) => {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = '1';
      card.classList.add('tilt-card');

      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotY = (x - 0.5) * 9;
        const rotX = (0.5 - y) * 9;
        card.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
        card.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });

    document.querySelectorAll('.btn-gold-solid, .btn-emerald-outline').forEach((btn) => {
      if (btn.dataset.magBound) return;
      btn.dataset.magBound = '1';
      btn.addEventListener('pointermove', (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width / 2) * 0.18;
        const dy = (e.clientY - rect.top - rect.height / 2) * 0.18;
        btn.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.transform = '';
      });
    });
  }

  function runCascade(panel) {
    if (!panel || reducedMotion) return;
    const items = panel.querySelectorAll('.pillar-card, .service-card, .process-step, .contact-channel-btn, .contact-form, .project-card');
    items.forEach((el, idx) => {
      el.classList.remove('is-in');
      el.classList.add('cascade-item');
      el.style.transitionDelay = `${Math.min(idx * 55, 380)}ms`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => el.classList.add('is-in'));
      });
    });
  }

  function t(key) {
    return (DICT[currentLang] && DICT[currentLang][key]) || DICT.en[key] || key;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Tab Switching
  function switchTab(tabName, updateHash = true) {
    const validTabs = ['home', 'work', 'about', 'services', 'process', 'contact'];
    const target = validTabs.includes(tabName) ? tabName : 'home';
    activeTab = target;

    document.querySelectorAll('[data-tab-panel]').forEach((panel) => {
      const isMatch = panel.getAttribute('data-tab-panel') === target;
      panel.hidden = !isMatch;
      panel.classList.toggle('active', isMatch);
      if (isMatch) runCascade(panel);
    });

    document.querySelectorAll('[data-tab-link]').forEach((btn) => {
      if (btn.classList.contains('nav-tab') || btn.classList.contains('m-tab')) {
        btn.classList.toggle('active', btn.getAttribute('data-tab-link') === target);
      }
    });

    if (updateHash) {
      history.replaceState(null, '', target === 'home' ? '#home' : `#${target}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('[data-tab-link]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(el.getAttribute('data-tab-link'));
    });
  });

  window.addEventListener('hashchange', () => {
    const h = window.location.hash.replace('#', '');
    if (h) switchTab(h, false);
  });

  function applyLanguage(lang) {
    currentLang = lang === 'fa' ? 'fa' : 'en';
    localStorage.setItem('ss_lang', currentLang);
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'fa' ? 'rtl' : 'ltr';
    document.title = t('page_title');

    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key) el.textContent = t(key);
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (key) el.innerHTML = t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) el.setAttribute('placeholder', t(key));
    });

    const toggleBtn = document.getElementById('toggle-view-btn');
    if (toggleBtn) {
      toggleBtn.textContent = autoSlideEnabled ? t('work_toggle_on') : t('work_toggle_off');
    }

    if (cachedProjects !== null) renderProjects(cachedProjects);
    if (cachedSettings !== null) renderSettings(cachedSettings);
  }

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });

  const LOCALIZED_PROJECTS = {
    'corebench-pc-hardware': {
      faTitle: 'آزمایشگاه سخت‌افزار کوربنچ',
      faCategory: 'فروشگاه و پنل مدیریت',
      faDesc: 'فروشگاه دوزبانه سخت‌افزار کامپیوتر و پلتفرم بنچمارک مبتنی بر Cloudflare Workers و D1.',
    },
    'ravagh-architecture-studio': {
      faTitle: 'آتلیه معماری رواق',
      faCategory: 'استودیو معماری',
      faDesc: 'وب‌سایت دوزبانه آتلیه معماری رواق با نمایش پروژه‌های فضایی و سیستم ثبت درخواست.',
    },
    'kohan-roastery-bakery': {
      faTitle: 'برشته‌کاری و نانوایی کهن‌دانه',
      faCategory: 'برند و فروشگاه آنلاین',
      faDesc: 'وب‌سایت دوزبانه برشته‌کاری قهوه تخصصی و نانوایی کهن‌دانه با کاتالوگ محصولات و پنل مدیریت.',
    },
    'mina-dental-clinic': {
      faTitle: 'کلینیک تخصصی دندانپزشکی مینا',
      faCategory: 'پزشکی و نوبت‌دهی',
      faDesc: 'وب‌سایت دوزبانه مرکز تخصصی دندانپزشکی و ایمپلنت با معرفی خدمات، رزرو نوبت و پنل مدیریت.',
    },
    'tracedock-edge-telemetry': {
      faTitle: 'ترس‌داک | رصد و تلِمتری لبه',
      faCategory: 'پلتفرم ابری (SaaS)',
      faDesc: 'پلتفرم دوزبانه SaaS برای رصد و تلمتری در لبه شبکه روی Cloudflare Workers و D1.',
    },
    'sareng-horology-leather-atelier': {
      faTitle: 'آتلیه ساعت و چرم سارنگ',
      faCategory: 'آتلیه لوکس',
      faDesc: 'وب‌سایت دوزبانه آتلیه ساعت‌سازی و چرم دست‌دوز سارنگ با Hono SSR و پنل مدیریت React.',
    },
  };

  function getLocalizedProject(p) {
    const meta = LOCALIZED_PROJECTS[p.slug] || null;
    const title = currentLang === 'fa' && meta ? meta.faTitle : p.title;
    const category = currentLang === 'fa' && meta ? meta.faCategory : p.category;
    const description = currentLang === 'fa' && meta ? meta.faDesc : p.description;

    let thumbnail = p.thumbnail_url || '';
    if (/^\/previews\/[a-z0-9-]+\.png$/i.test(thumbnail)) {
      thumbnail = thumbnail.replace(/\.png$/i, `-${currentLang}.png`);
    }

    let liveUrl = p.live_url || '';
    if (liveUrl && /^https:\/\/[a-z0-9-]+\.mygamer989\.workers\.dev\/?$/i.test(liveUrl)) {
      liveUrl = liveUrl.replace(/\/$/, '') + `/${currentLang}`;
    }

    return { ...p, title, category, description, thumbnail_url: thumbnail, live_url: liveUrl };
  }

  // Portfolio Rendering + Home Marquee + Auto-Sliding List
  function renderProjects(projects) {
    const grid = document.getElementById('portfolio-grid');
    const marqueeTrack = document.getElementById('home-marquee-track');
    const localizedList = projects.map(getLocalizedProject);

    if (marqueeTrack) {
      if (localizedList.length === 0) {
        marqueeTrack.innerHTML = '';
      } else {
        const itemsHtml = localizedList
          .map(
            (p) => `
          <a class="marquee-item" href="${escapeHtml(p.live_url || '#work')}" ${p.live_url ? 'target="_blank" rel="noopener noreferrer"' : ''}>
            ${p.thumbnail_url ? `<img src="${escapeHtml(p.thumbnail_url)}" alt="${escapeHtml(p.title)}" loading="lazy" />` : ''}
            <div class="marquee-item-body">
              <span class="marquee-item-title">${escapeHtml(p.title)}</span>
              <span class="marquee-item-cat">${escapeHtml(p.category)}</span>
            </div>
          </a>
        `
          )
          .join('');
        // Duplicate track for seamless infinite marquee motion
        marqueeTrack.innerHTML = itemsHtml + itemsHtml;
      }
    }

    if (!grid) return;

    if (localizedList.length === 0) {
      grid.innerHTML = `
        <div class="portfolio-empty">
          <h3>${escapeHtml(t('work_empty_t'))}</h3>
          <p>${escapeHtml(t('work_empty_d'))}</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = localizedList
      .map((p, idx) => {
        const mediaHtml = p.thumbnail_url
          ? `<img src="${escapeHtml(p.thumbnail_url)}" alt="${escapeHtml(p.title)} preview" loading="lazy" />`
          : `<div class="project-media-placeholder">${escapeHtml(t('work_preview_pending'))}</div>`;

        const techsHtml =
          Array.isArray(p.technologies) && p.technologies.length > 0
            ? `<div class="project-techs">${p.technologies
                .map((tech) => `<span class="tech-pill">${escapeHtml(tech)}</span>`)
                .join('')}</div>`
            : '';

        const liveBtn = p.live_url
          ? `<a href="${escapeHtml(p.live_url)}" target="_blank" rel="noopener noreferrer" class="btn btn-gold-outline btn-sm">${escapeHtml(t('work_view_live'))}</a>`
          : '';

        return `
          <article class="project-card" style="animation-delay:${idx * 90}ms">
            <div class="project-media">${mediaHtml}</div>
            <div class="project-body">
              <div class="project-meta">
                <span class="project-category">${escapeHtml(p.category)}</span>
              </div>
              <h3 class="project-title">${escapeHtml(p.title)}</h3>
              <p class="project-desc">${escapeHtml(p.description)}</p>
              ${techsHtml}
              <div class="project-actions">${liveBtn}</div>
            </div>
          </article>
        `;
      })
      .join('');
    bind3DMotion();
    const workPanel = document.querySelector('[data-tab-panel="work"]');
    if (workPanel && !workPanel.hidden) runCascade(workPanel);
  }

  // Portfolio Horizontal List: Smooth 60fps Ping-Pong Glide ("برن و بیان")
  let slideDir = 1;
  let slidePaused = false;
  let lastFrameTime = 0;

  function glideStep(timestamp) {
    if (!autoSlideEnabled) {
      autoSlideTimer = null;
      return;
    }
    const grid = document.getElementById('portfolio-grid');
    if (grid && activeTab === 'work' && !slidePaused) {
      const maxScroll = grid.scrollWidth - grid.clientWidth;
      if (maxScroll > 10) {
        if (!lastFrameTime) lastFrameTime = timestamp;
        const dt = Math.min(48, timestamp - lastFrameTime);
        lastFrameTime = timestamp;

        const speedPxPerMs = 0.065; // Smooth luxury glide (~65px/sec)
        const isRtl = document.documentElement.dir === 'rtl';
        const delta = speedPxPerMs * dt * slideDir * (isRtl ? -1 : 1);
        grid.scrollLeft += delta;

        const absPos = Math.abs(grid.scrollLeft);
        if (absPos >= maxScroll - 2) {
          slideDir = -1;
        } else if (absPos <= 2) {
          slideDir = 1;
        }
      }
    } else {
      lastFrameTime = 0;
    }
    autoSlideTimer = requestAnimationFrame(glideStep);
  }

  function startAutoSlide() {
    stopAutoSlide();
    const grid = document.getElementById('portfolio-grid');
    if (!autoSlideEnabled || !grid) return;
    grid.classList.add('is-auto-gliding');
    lastFrameTime = 0;
    autoSlideTimer = requestAnimationFrame(glideStep);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      cancelAnimationFrame(autoSlideTimer);
      autoSlideTimer = null;
    }
    const grid = document.getElementById('portfolio-grid');
    if (grid) grid.classList.remove('is-auto-gliding');
  }

  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const toggleSlideBtn = document.getElementById('toggle-view-btn');

  function manualNudge(direction) {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    slidePaused = true;
    grid.classList.remove('is-auto-gliding');
    const step = Math.max(320, grid.clientWidth * 0.52);
    grid.scrollBy({ left: step * direction, behavior: 'smooth' });
    setTimeout(() => {
      if (autoSlideEnabled) grid.classList.add('is-auto-gliding');
      slidePaused = false;
      lastFrameTime = 0;
    }, 800);
  }

  prevBtn?.addEventListener('click', () => {
    manualNudge(document.documentElement.dir === 'rtl' ? 1 : -1);
  });

  nextBtn?.addEventListener('click', () => {
    manualNudge(document.documentElement.dir === 'rtl' ? -1 : 1);
  });

  toggleSlideBtn?.addEventListener('click', () => {
    autoSlideEnabled = !autoSlideEnabled;
    toggleSlideBtn.textContent = autoSlideEnabled ? t('work_toggle_on') : t('work_toggle_off');
    if (autoSlideEnabled) startAutoSlide();
    else stopAutoSlide();
  });

  const gridHover = document.getElementById('portfolio-grid');
  gridHover?.addEventListener('mouseenter', () => { slidePaused = true; });
  gridHover?.addEventListener('mouseleave', () => { slidePaused = false; lastFrameTime = 0; });
  gridHover?.addEventListener('touchstart', () => { slidePaused = true; }, { passive: true });
  gridHover?.addEventListener('touchend', () => {
    setTimeout(() => { slidePaused = false; lastFrameTime = 0; }, 1200);
  }, { passive: true });

  async function loadPortfolio() {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      cachedProjects = Array.isArray(data.projects) ? data.projects : [];
      renderProjects(cachedProjects);
      startAutoSlide();
    } catch {
      grid.innerHTML = `
        <div class="portfolio-empty">
          <h3>${escapeHtml(t('work_error_t'))}</h3>
          <p>${escapeHtml(t('work_error_d'))}</p>
        </div>
      `;
    }
  }

  let turnstileWidgetId = null;
  let turnstileLoaded = false;

  function renderSettings(s) {
    if (s.canonical_url) {
      const canonicalEl = document.getElementById('canonical-link');
      const ogUrlEl = document.getElementById('og-url');
      const cleanCanonical = s.canonical_url.replace(/\/$/, '') + '/';
      if (canonicalEl) canonicalEl.setAttribute('href', cleanCanonical);
      if (ogUrlEl) ogUrlEl.setAttribute('content', cleanCanonical);
    }

    const detailsEl = document.getElementById('confirmed-contact-details');
    if (detailsEl) {
      const phoneIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
      const tgIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`;
      const mailIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;

      const items = [];
      if (s.contact_phone) {
        const telHref = s.contact_phone.replace(/\s+/g, '');
        items.push(`
          <a class="contact-channel-btn" href="tel:${escapeHtml(telHref)}">
            <div class="channel-left">
              <span class="channel-icon" aria-hidden="true">${phoneIcon}</span>
              <div class="channel-meta">
                <span class="detail-label">${escapeHtml(t('contact_phone_label'))}</span>
                <span class="detail-value" dir="ltr">${escapeHtml(s.contact_phone)}</span>
              </div>
            </div>
            <span class="channel-arrow" aria-hidden="true">&#8599;</span>
          </a>
        `);
      }
      if (s.social_telegram) {
        const handle = s.social_telegram.replace(/^https?:\/\/t\.me\//i, '@');
        items.push(`
          <a class="contact-channel-btn" href="${escapeHtml(s.social_telegram)}" target="_blank" rel="noopener noreferrer">
            <div class="channel-left">
              <span class="channel-icon" aria-hidden="true">${tgIcon}</span>
              <div class="channel-meta">
                <span class="detail-label">${escapeHtml(t('contact_telegram_label'))}</span>
                <span class="detail-value" dir="ltr">${escapeHtml(handle)}</span>
              </div>
            </div>
            <span class="channel-arrow" aria-hidden="true">&#8599;</span>
          </a>
        `);
      }
      if (s.contact_email) {
        items.push(`
          <a class="contact-channel-btn" href="mailto:${escapeHtml(s.contact_email)}">
            <div class="channel-left">
              <span class="channel-icon" aria-hidden="true">${mailIcon}</span>
              <div class="channel-meta">
                <span class="detail-label">${escapeHtml(t('contact_email_label'))}</span>
                <span class="detail-value" dir="ltr">${escapeHtml(s.contact_email)}</span>
              </div>
            </div>
            <span class="channel-arrow" aria-hidden="true">&#8599;</span>
          </a>
        `);
      }
      detailsEl.innerHTML = items.join('');
      bind3DMotion();
    }

    const footerSocials = document.getElementById('footer-socials');
    if (footerSocials) {
      const links = [];
      if (s.social_telegram) links.push(`<a href="${escapeHtml(s.social_telegram)}" target="_blank" rel="noopener noreferrer">Telegram</a>`);
      if (s.social_github) links.push(`<a href="${escapeHtml(s.social_github)}" target="_blank" rel="noopener noreferrer">GitHub</a>`);
      if (s.social_x) links.push(`<a href="${escapeHtml(s.social_x)}" target="_blank" rel="noopener noreferrer">X</a>`);
      if (s.social_linkedin) links.push(`<a href="${escapeHtml(s.social_linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`);
      if (s.social_instagram) links.push(`<a href="${escapeHtml(s.social_instagram)}" target="_blank" rel="noopener noreferrer">Instagram</a>`);
      footerSocials.innerHTML = links.join('');
    }

    if (s.turnstile_site_key && !turnstileLoaded) {
      turnstileLoaded = true;
      const slot = document.getElementById('turnstile-container');
      if (slot) {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (window.turnstile) {
            turnstileWidgetId = window.turnstile.render(slot, {
              sitekey: s.turnstile_site_key,
              theme: 'light',
            });
          }
        };
        document.head.appendChild(script);
      }
    }
  }

  async function loadSettings() {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) return;
      const data = await res.json();
      cachedSettings = data.settings || {};
      renderSettings(cachedSettings);
    } catch {
      // Keep empty
    }
  }

  const contactForm = document.getElementById('contact-form');
  const contactStatus = document.getElementById('contact-status');
  const contactSubmit = document.getElementById('contact-submit');

  if (contactForm && contactStatus && contactSubmit) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      contactStatus.textContent = '';
      contactStatus.className = 'form-status';

      const formData = new FormData(contactForm);
      const payload = {
        name: String(formData.get('name') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        phone: String(formData.get('phone') || '').trim(),
        company: String(formData.get('company') || '').trim(),
        service: String(formData.get('service') || '').trim(),
        message: String(formData.get('message') || '').trim(),
        turnstileToken: window.turnstile && turnstileWidgetId !== null ? window.turnstile.getResponse(turnstileWidgetId) : '',
      };

      if (payload.name.length < 2 || !payload.email.includes('@') || payload.message.length < 10) {
        contactStatus.textContent = t('form_invalid');
        contactStatus.classList.add('error');
        return;
      }

      contactSubmit.disabled = true;
      contactSubmit.textContent = t('form_sending');

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Submission failed.');
        contactForm.reset();
        if (window.turnstile && turnstileWidgetId !== null) {
          window.turnstile.reset(turnstileWidgetId);
        }
        contactStatus.textContent = t('form_sent');
        contactStatus.classList.add('success');
      } catch (err) {
        contactStatus.textContent = err.message || 'Unable to send inquiry.';
        contactStatus.classList.add('error');
      } finally {
        contactSubmit.disabled = false;
        contactSubmit.textContent = t('form_submit');
      }
    });
  }

  const initialHash = window.location.hash.replace('#', '');
  if (initialHash) switchTab(initialHash, false);
  applyLanguage(currentLang);
  initHero3D();
  bind3DMotion();
  loadPortfolio();
  loadSettings();
})();
