/* ═══════════════════════════════════════════════════════════
   MAIN SCRIPT — preloader, animations, interactions
   ═══════════════════════════════════════════════════════════ */
    /**
     * ═══════════════════════════════════════════════════════════
     * PRELOADER — Logo animation → dot zoom-out → reveal
     * 0.0s–0.85s: dot + letters animate in
     * 1.4s: logo fades, zoom dot starts expanding
     * 2.2s: zoom dot fades, preloader removed, site visible
     * ═══════════════════════════════════════════════════════════
     */
    window.addEventListener('load', () => {
      const preloader = document.getElementById('preloader');
      const zoomDot = document.getElementById('preloaderZoomDot');

      // Step 1: After letters finish, fade out the logo text
      setTimeout(() => {
        preloader.classList.add('zoom-out');
      }, 1400);

      // Step 2: Start the dot zoom-out expansion
      setTimeout(() => {
        zoomDot.style.opacity = '1';
        zoomDot.style.transform = 'translate(-50%, -50%) scale(1)';
        zoomDot.classList.add('expand');
      }, 1500);

      // Step 3: Remove preloader, show site
      setTimeout(() => {
        preloader.style.display = 'none';
        zoomDot.style.display = 'none';
        document.body.classList.remove('loading');
      }, 2300);
    });

    /**
     * ═══════════════════════════════════════════════════════════
     * CURSOR GLOW — Follows the mouse with a soft radial light
     * Uses requestAnimationFrame for smooth 60fps tracking
     * ═══════════════════════════════════════════════════════════
     */
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateGlow() {
      // Smooth interpolation (lerp) for fluid following
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // Hide cursor glow on mobile / touch devices
    if ('ontouchstart' in window) {
      cursorGlow.style.display = 'none';
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * NAVBAR — Frosted glass effect on scroll
     * ═══════════════════════════════════════════════════════════
     */
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    /**
     * ═══════════════════════════════════════════════════════════
     * MOBILE NAV TOGGLE
     * ═══════════════════════════════════════════════════════════
     */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close nav on link click (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });

    /**
     * ═══════════════════════════════════════════════════════════
     * SCROLL REVEAL — IntersectionObserver-based animations
     * Elements with .reveal or .stagger classes animate in
     * when they enter the viewport
     * ═══════════════════════════════════════════════════════════
     */
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after revealing (one-time animation)
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    // Observe all reveal and stagger elements
    document.querySelectorAll('.reveal, .stagger').forEach(el => {
      revealObserver.observe(el);
    });

    /**
     * ═══════════════════════════════════════════════════════════
     * COUNTER ANIMATION — Number → "+" reveal → context typewriter
     *
     * Choreography per stat:
     *   0.0s  → number starts counting from 0
     *   0.0s–2.0s → number eases up to target (easeOutQuart)
     *   2.0s  → number lands; "+" suffix springs in
     *   2.2s  → context line types in char by char
     *
     * The "+" used to render alongside the count from the start, which
     * spoiled the reveal. Now it appears only after the number lands.
     * The context line gives each stat a quiet narrative beat without
     * competing with the number itself.
     * ═══════════════════════════════════════════════════════════
     */
    function animateCounter(numEl) {
      const target = parseInt(numEl.dataset.count, 10);
      const duration = 2000;
      const startTime = performance.now();

      const valueEl = numEl.querySelector('.stat-num-value');
      const plusEl  = numEl.querySelector('.stat-plus');

      // Find the sibling context element (same parent .stat)
      const statEl    = numEl.closest('.stat');
      const contextEl = statEl ? statEl.querySelector('.stat-context') : null;

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // easeOutQuart for natural deceleration
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(eased * target);

        if (valueEl) {
          valueEl.textContent = current;
        } else {
          // Defensive fallback if the markup ever loses the inner span
          numEl.textContent = current + '+';
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          // Number finished landing — reveal the "+" with a slight beat
          if (plusEl) {
            setTimeout(() => plusEl.classList.add('is-visible'), 80);
          }
          // Then type the context label after the "+" has appeared
          if (contextEl) {
            setTimeout(() => typewriteContext(contextEl), 280);
          }
        }
      }

      requestAnimationFrame(update);
    }

    /**
     * Types the data-context string into the element one character at a
     * time. Spaces become non-breaking inline blocks so the inline-block
     * char spans don't collapse whitespace. Idempotent — safe to call
     * twice (it bails if already populated).
     */
    function typewriteContext(el) {
      const text = el.dataset.context || '';
      if (!text || el.dataset.typed === 'true') return;
      el.dataset.typed = 'true';

      // Build the DOM once with all chars hidden
      const frag = document.createDocumentFragment();
      const chars = [];
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        const span = document.createElement('span');
        if (c === ' ') {
          span.className = 'ctx-space';
        } else {
          span.className = 'ctx-char';
          span.textContent = c;
        }
        frag.appendChild(span);
        chars.push(span);
      }
      el.appendChild(frag);

      // Reveal each char with a small stagger (~30ms per char)
      chars.forEach((span, i) => {
        if (span.classList.contains('ctx-char')) {
          setTimeout(() => span.classList.add('is-visible'), i * 30);
        }
      });
    }

    // Trigger counter animation when hero stats come into view
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) counterObserver.observe(heroStats);

    /**
     * ═══════════════════════════════════════════════════════════
     * SMOOTH SCROLL — for anchor links
     * ═══════════════════════════════════════════════════════════
     */
    /**
     * ═══════════════════════════════════════════════════════════
     * STICKY PROCESS CARDS — Highlight active card on scroll
     * Uses IntersectionObserver to detect which card is most
     * centered in the viewport and applies the .active class
     * ═══════════════════════════════════════════════════════════
     */
    const processCards = document.querySelectorAll('.process-card');

    if (processCards.length) {
      const processObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            processCards.forEach(c => c.classList.remove('active'));
            entry.target.classList.add('active');
          }
        });
      }, {
        threshold: [0.6],
        rootMargin: '-20% 0px -40% 0px'
      });

      processCards.forEach(card => processObserver.observe(card));
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * ORB LIGHTING — Specular highlight + shadow follow cursor
     * Light source position and shadow direction update per orb
     * based on mouse position relative to each orb's center
     * ═══════════════════════════════════════════════════════════
     */
    const radarOrbs = document.querySelectorAll('.radar-orb');

    if (!('ontouchstart' in window)) {
      document.addEventListener('mousemove', (e) => {
        radarOrbs.forEach(orb => {
          const rect = orb.getBoundingClientRect();
          const orbCenterX = rect.left + rect.width / 2;
          const orbCenterY = rect.top + rect.height / 2;

          // Normalize cursor position relative to orb center (-1 to 1)
          const dx = (e.clientX - orbCenterX) / (window.innerWidth / 2);
          const dy = (e.clientY - orbCenterY) / (window.innerHeight / 2);

          // Clamp values
          const clampedDx = Math.max(-1, Math.min(1, dx));
          const clampedDy = Math.max(-1, Math.min(1, dy));

          // Light position: highlight moves toward cursor (20-80% range)
          const lightX = 50 + clampedDx * 30;
          const lightY = 50 + clampedDy * 30;

          // Shadow: cast opposite to light source
          const shadowX = clampedDx * -12;
          const shadowY = clampedDy * -12 + 6;

          orb.style.setProperty('--light-x', lightX + '%');
          orb.style.setProperty('--light-y', lightY + '%');
          orb.style.setProperty('--shadow-x', shadowX + 'px');
          orb.style.setProperty('--shadow-y', shadowY + 'px');
        });
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    /* ═══════════════════════════════════════════════════════════
       LAUGON-STYLE HERO — Subtle portrait parallax
       Only translates the bottom image layer. The text-clipped
       photo layer uses background-attachment: fixed so it stays
       perfectly aligned to the viewport — letters always show the
       SAME spot of the image, never sliding crops.
    ═══════════════════════════════════════════════════════════ */
    (function initLhHeroParallax() {
      const heroEl = document.getElementById('lhHero');
      const img = document.getElementById('lhHeroImage');
      if (!heroEl || !img) return;
      if ('ontouchstart' in window) return;

      const MAX_SHIFT = 12;
      let rafId = null;
      let pendingX = 0, pendingY = 0;

      heroEl.addEventListener('mousemove', (e) => {
        const r = heroEl.getBoundingClientRect();
        const xRatio = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const yRatio = ((e.clientY - r.top) / r.height - 0.5) * 2;
        pendingX = -xRatio * MAX_SHIFT;
        pendingY = -yRatio * MAX_SHIFT;
        if (!rafId) {
          rafId = requestAnimationFrame(() => {
            img.style.transform =
              `translate3d(${pendingX}px, ${pendingY}px, 0)`;
            rafId = null;
          });
        }
      });

      heroEl.addEventListener('mouseleave', () => {
        img.style.transform = 'translate3d(0, 0, 0)';
      });
    })();

    /* ═══════════════════════════════════════════════════════════
       FREESTYLE SERVICES SECTION — GSAP + ScrollTrigger
       Bulletproof version: waits for window.load (preloader done),
       sets initial states via gsap.set() ONLY (never CSS), wraps
       everything in try/catch with a clearProps failsafe so a JS
       error can never leave the section invisible.
    ═══════════════════════════════════════════════════════════ */
    function initServicesFreestyle() {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('[services] GSAP or ScrollTrigger not loaded');
        return;
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.registerPlugin(ScrollTrigger);

      const section = document.querySelector('.services');
      if (!section) return;

      const headingWords = section.querySelectorAll('.services-heading .word');
      const cards = gsap.utils.toArray(section.querySelectorAll('.service-card'));
      if (!cards.length) return;

      const allInner = section.querySelectorAll(
        '.service-number, .service-icon, .service-title, .service-description, .service-tag'
      );

      try {
        // Heading words: rise + scale into place
        if (headingWords.length) {
          gsap.set(headingWords, { y: 40, opacity: 0, scale: 0.7 });
          gsap.to(headingWords, {
            y: 0, opacity: 1, scale: 1,
            duration: 0.9, stagger: 0.1,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          });
        }

        // Cards: fan out from a stacked center
        const stackOffsets = [
          { x:  120, rotate: -6 },
          { x:    0, rotate:  0 },
          { x: -120, rotate:  6 },
        ];
        cards.forEach((card, i) => {
          const o = stackOffsets[i] || { x: 0, rotate: 0 };
          gsap.set(card, {
            x: o.x, rotate: o.rotate, scale: 0.9, y: 40, opacity: 0,
            transformOrigin: 'center bottom',
          });
        });
        gsap.to(cards, {
          x: 0, y: 0, rotate: 0, scale: 1, opacity: 1,
          duration: 1, ease: 'power3.out',
          stagger: { each: 0.12, from: 'center' },
          scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });

        // Per-card content cascade
        cards.forEach((card) => {
          const num   = card.querySelector('.service-number');
          const icon  = card.querySelector('.service-icon');
          const title = card.querySelector('.service-title');
          const desc  = card.querySelector('.service-description');
          const tags  = card.querySelectorAll('.service-tag');

          if (num)   gsap.set(num,   { x: -40, opacity: 0 });
          if (icon)  gsap.set(icon,  { scale: 0.5, opacity: 0 });
          if (title) gsap.set(title, { y: 16, opacity: 0 });
          if (desc)  gsap.set(desc,  { y: 16, opacity: 0 });
          if (tags.length) gsap.set(tags, { y: 12, opacity: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          });
          if (num)   tl.to(num,   { x: 0, opacity: 1, duration: 0.6, ease: 'back.out(2)' });
          if (icon)  tl.to(icon,  { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2.2)' }, '-=0.35');
          if (title) tl.to(title, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.25');
          if (desc)  tl.to(desc,  { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.3');
          if (tags.length) tl.to(tags, { y: 0, opacity: 1, duration: 0.35, stagger: 0.04, ease: 'power2.out' }, '-=0.25');
        });

        ScrollTrigger.refresh();
      } catch (err) {
        console.error('[services] Animation init failed, restoring visibility:', err);
        // Failsafe: clear all props so nothing stays invisible
        gsap.set([...headingWords, ...cards, ...allInner], { clearProps: 'all' });
      }
    }

    /* ═══════════════════════════════════════════════════════════
       SPLITTEXT — Section heading reveals
       Animates .split-heading elements (about, work, process,
       tools, radar, contact) with line + word stagger on scroll.

       Skips: .hero-headline (custom CSS animation), .services-heading
       (already animated by initServicesFreestyle), .lh-hero__name
       (marquee), project wordmarks (already animated per-card).

       Bulletproof pattern: gsap.set for initial state, autoSplit for
       responsive re-splitting on resize, try/catch + clearProps
       failsafe so a failure never leaves a heading invisible.
    ═══════════════════════════════════════════════════════════ */
    function initSplitHeadings() {
      if (typeof gsap === 'undefined' || typeof SplitText === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('[splittext] GSAP / SplitText / ScrollTrigger not loaded');
        return;
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.registerPlugin(SplitText, ScrollTrigger);

      const headings = document.querySelectorAll('.split-heading');
      if (!headings.length) return;

      // Wait for fonts so line breaks don't reflow after the split
      const start = document.fonts && document.fonts.ready
        ? document.fonts.ready
        : Promise.resolve();

      start.then(() => {
        headings.forEach((heading) => {
          try {
            SplitText.create(heading, {
              type: 'lines, words',
              mask: 'lines',
              linesClass: 'split-line',
              autoSplit: true,
              onSplit(self) {
                // Set initial state via GSAP (never CSS) so a failure
                // can never leave the heading invisible
                gsap.set(self.words, { yPercent: 110, opacity: 0 });

                return gsap.to(self.words, {
                  yPercent: 0,
                  opacity: 1,
                  duration: 0.9,
                  ease: 'power3.out',
                  stagger: 0.045,
                  scrollTrigger: {
                    trigger: heading,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                  },
                });
              },
            });
          } catch (err) {
            console.warn('[splittext] split failed for heading, leaving as-is:', err, heading);
            // Failsafe — if split throws, the heading still renders normally
          }
        });

        ScrollTrigger.refresh();
      });
    }

    // Wait for full load (preloader done + layout stable) before measuring
    if (document.readyState === 'complete') {
      initServicesFreestyle();
      initSplitHeadings();
    } else {
      window.addEventListener('load', () => {
        initServicesFreestyle();
        initSplitHeadings();
      });
    }

/* ═══════════════════════════════════════════════════════════
   LUCIDE ICONS — initialize after CDN load
   ═══════════════════════════════════════════════════════════ */
    // Guard against lucide load failure (ad blocker / network issue)
    try {
      if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
      }
    } catch (err) {
      console.warn('[lucide] createIcons skipped:', err);
    }

/* ═══════════════════════════════════════════════════════════
   PROJECT CARDS — GSAP letter stagger + parallax + ghost shift
   ═══════════════════════════════════════════════════════════ */
    (function () {
      try {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (typeof gsap === 'undefined') return;

        const cards = document.querySelectorAll('.project-card');
        if (!cards.length) return;

        const isTouch = window.matchMedia('(hover: none)').matches;

        cards.forEach(card => {
          const wordmark = card.querySelector('.project-wordmark');
          const ghost    = card.querySelector('.project-wordmark .ghost');
          const chars    = card.querySelectorAll('.project-wordmark .word:not(.ghost .word) .char');
          const bg       = card.querySelector('.project-thumbnail-bg');
          if (!wordmark || !bg) return;

          // Initial letter entry — set hidden state via gsap.set (never CSS),
          // so a failed script can't leave the wordmark invisible
          if (chars.length && !prefersReduced) {
            gsap.set(chars, { y: 80, opacity: 0, rotateX: -40 });

            const reveal = () => {
              gsap.to(chars, {
                y: 0, opacity: 1, rotateX: 0,
                duration: 0.9,
                ease: 'power3.out',
                stagger: 0.04
              });
            };

            // Reveal when card enters viewport
            const io = new IntersectionObserver((entries) => {
              entries.forEach(e => {
                if (e.isIntersecting) {
                  reveal();
                  io.unobserve(e.target);
                }
              });
            }, { threshold: 0.25 });
            io.observe(card);
          }

          // Skip cursor effects on touch devices and reduced motion
          if (isTouch || prefersReduced) return;

          let rect = null;

          card.addEventListener('mouseenter', () => {
            rect = card.getBoundingClientRect();
            // Ghost shifts slightly on hover for stereoscopic split
            if (ghost) {
              gsap.to(ghost, {
                x: 14, y: -8,
                duration: 0.7,
                ease: 'power3.out'
              });
            }
          });

          card.addEventListener('mousemove', (e) => {
            if (!rect) rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            // Wordmark floats opposite the cursor with subtle 3D tilt
            gsap.to(wordmark, {
              x: (x - 0.5) * -24,
              y: (y - 0.5) * -18,
              rotateY: (x - 0.5) * 6,
              rotateX: (y - 0.5) * -4,
              duration: 0.9,
              ease: 'power3.out',
              transformPerspective: 900
            });

            // Gradient pans toward cursor for depth
            gsap.to(bg, {
              backgroundPosition: `${50 + (x - 0.5) * 26}% ${50 + (y - 0.5) * 26}%`,
              duration: 1.2,
              ease: 'power2.out'
            });
          });

          card.addEventListener('mouseleave', () => {
            rect = null;
            gsap.to(wordmark, {
              x: 0, y: 0, rotateY: 0, rotateX: 0,
              duration: 1.1,
              ease: 'elastic.out(1, 0.7)'
            });
            if (ghost) {
              gsap.to(ghost, {
                x: 0, y: 0,
                duration: 0.9,
                ease: 'elastic.out(1, 0.6)'
              });
            }
            gsap.to(bg, {
              backgroundPosition: '50% 50%',
              duration: 1.2,
              ease: 'power3.out'
            });
          });
        });
      } catch (err) {
        console.warn('[project-cards] motion init skipped:', err);
      }
    })();

/* ═══════════════════════════════════════════════════════════
   TOOLKIT — spotlight cursor tracking on category cards
   ═══════════════════════════════════════════════════════════ */
    (function(){
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      document.querySelectorAll('.tool-category').forEach(function(card){
        card.addEventListener('mousemove', function(e){
          var r = card.getBoundingClientRect();
          card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
          card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
        });
      });
    })();
