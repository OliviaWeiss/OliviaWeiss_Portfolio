// Minimalistic flower and square rotation on scroll
window.addEventListener('scroll', function() {
  const flowerRotate = document.getElementById('flower-rotate');
  if (flowerRotate) {
    const scrollY = window.scrollY || window.pageYOffset;
    flowerRotate.style.transform = `rotate(${scrollY * 0.25}deg)`;
  }
});
// No JS needed for skills marquee


// Fade-in effect
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = 0;
  setTimeout(() => {
    document.body.style.transition = 'opacity 1.2s';
    document.body.style.opacity = 1;
  }, 100);

  // Smooth scroll for nav links
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Animate skill bars when in view
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillsSection = document.getElementById('skills');
  let skillsAnimated = false;

  function animateSkills() {
    if (!skillsAnimated && skillsSection && isInViewport(skillsSection)) {
      skillBars.forEach(bar => {
        const percent = bar.getAttribute('data-skill');
        bar.style.width = percent + '%';
      });
      skillsAnimated = true;
    }
  }

  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top < window.innerHeight &&
      rect.bottom > 0
    );
  }

  window.addEventListener('scroll', animateSkills);
  animateSkills();

  // Subtle hover effect for project cards
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('hovered');
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('hovered');
    });
  });

  // Contact form (no backend, just a simple UX effect)
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      contactForm.reset();
      alert('Thank you for your message!');
    });
  }

  // Resume PDF modal: attach to all resume links and create modal dynamically if it's not present
  const resumePath = 'OliviaWeiss_Resume_2025.pdf'; // expected file in site root/public

  function ensurePdfModal() {
    let modal = document.getElementById('pdf-modal');
    if (modal) return modal;
    // Create modal markup (matches index.html's structure)
    modal = document.createElement('div');
    modal.id = 'pdf-modal';
    modal.className = 'pdf-modal';
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML = `
      <div class="pdf-modal-content" role="dialog" aria-modal="true" aria-labelledby="pdf-modal-title">
        <button class="pdf-close" id="pdf-close" aria-label="Close resume viewer">×</button>
        <h3 id="pdf-modal-title" class="sr-only">Resume</h3>
        <iframe id="pdf-frame" src="" frameborder="0" aria-label="Resume viewer"></iframe>
        <div class="pdf-fallback">If the PDF doesn't load, <a id="pdf-download" href="#" target="_blank" rel="noopener">download it here</a>.</div>
      </div>
    `;
    document.body.appendChild(modal);

    // Wire close behavior
    const pdfClose = modal.querySelector('#pdf-close');
    const pdfFrame = modal.querySelector('#pdf-frame');
    modal.addEventListener('click', function(e) { if (e.target === modal) closePdfModal(); });
    if (pdfClose) pdfClose.addEventListener('click', closePdfModal);

    // global Escape handler to close if open
    document.addEventListener('keydown', function onEsc(e){
      if (e.key === 'Escape') {
        const m = document.getElementById('pdf-modal');
        if (m && m.getAttribute('aria-hidden') === 'false') closePdfModal();
      }
    });

    return modal;
  }

  function openPdfModal(href) {
    const src = href || resumePath;
    const modal = ensurePdfModal();
    const pdfFrame = modal.querySelector('#pdf-frame');
    const pdfDownload = modal.querySelector('#pdf-download');
    const pdfClose = modal.querySelector('#pdf-close');
    if (pdfFrame) pdfFrame.src = src;
    if (pdfDownload) pdfDownload.href = src;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (pdfClose) pdfClose.focus();
  }

  function closePdfModal() {
    const modal = document.getElementById('pdf-modal');
    if (!modal) return;
    const pdfFrame = modal.querySelector('#pdf-frame');
    if (pdfFrame) pdfFrame.src = '';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Select resume anchors across pages (common filenames and optional data attributes)
  const resumeAnchors = Array.from(document.querySelectorAll(
    'a[data-resume-modal], a#resume-link, a[href$="OliviaWeiss_Resume_2025.pdf"]'
  ));

  resumeAnchors.forEach(a => {
    a.addEventListener('click', function(e){
      // If user wants direct download (target _blank) and modal isn't desired, they can still use context menu.
      e.preventDefault();
      // Prefer an explicit data-resume attribute; otherwise use the canonical resumePath
      // This avoids trying to load alternate/mistyped filenames like "Olivia_Weiss_Resume.pdf" that may not exist
      const hrefAttr = this.getAttribute('data-resume');
      const href = hrefAttr || resumePath;
      openPdfModal(href);
    });
  });

  // Delegated click handler to ensure the pdf modal can be closed by the close button or backdrop
  document.addEventListener('click', function(e){
    const t = e.target;
    if(t && (t.matches && (t.matches('#pdf-close') || t.matches('#pdf-modal')))){
      // call the close function defined in this scope
      closePdfModal();
    }
  });

  // Video modal (open when Visit project clicked)
  const visitBtn = document.querySelector('.btn-visit');
  const videoModal = document.getElementById('video-modal');
  const videoFrame = document.getElementById('video-frame');
  const videoClose = document.getElementById('video-close');
  const DEFAULT_VIDEO_SRC = 'https://www.youtube.com/embed/1UZvK_0lNFE?rel=0&modestbranding=1';

  function openVideoModal(src){
    const s = src || DEFAULT_VIDEO_SRC;
    if(videoFrame) videoFrame.src = s + (s.includes('?') ? '&autoplay=1' : '?autoplay=1');
    if(videoModal){ videoModal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
    if(videoClose) videoClose.focus();
  }
  function closeVideoModal(){
    if(videoFrame) videoFrame.src = '';
    if(videoModal){ videoModal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
  }
  if(visitBtn){
    visitBtn.addEventListener('click', function(e){
      // If the page has an in-page video modal, intercept and open it with an optional per-button data-video
      if (!videoModal) return; // allow the anchor to work as a normal link
      e.preventDefault();
      const dataVideo = this.dataset && this.dataset.video ? this.dataset.video : null;
      openVideoModal(dataVideo || DEFAULT_VIDEO_SRC);
    });
  }
  if(videoClose) videoClose.addEventListener('click', closeVideoModal);
  if(videoModal) videoModal.addEventListener('click', function(e){ if(e.target === videoModal) closeVideoModal(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && videoModal && videoModal.getAttribute('aria-hidden') === 'false') closeVideoModal(); });

  // Scroll-triggered fade-in animations for sections
  const fadeInSections = document.querySelectorAll('.fade-in-section');
  
  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -100px 0px'
  });

  fadeInSections.forEach(section => {
    fadeInObserver.observe(section);
  });

  // GSAP ScrollTrigger scroll reveal animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // First, set all elements to invisible
    gsap.set('.scroll-reveal', { opacity: 0, y: 30 });
    
    // Animate each scroll-reveal element
    gsap.utils.toArray('.scroll-reveal').forEach((element, index) => {
      gsap.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 90%',
          toggleActions: 'play none none none',
          onEnter: () => console.log('Animating:', element.querySelector('h2, h3')?.textContent || element.tagName)
        }
      });
    });
    
    // Parallax Background Animations
    // Slow-moving main background
    gsap.to('.parallax-bg', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
    
    // Gradient shifts and fades based on scroll
    gsap.to('.parallax-gradient', {
      opacity: 0.8,
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: '50% top',
        scrub: 1
      }
    });
    
    gsap.to('.parallax-gradient', {
      opacity: 0,
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: '50% top',
        end: 'bottom top',
        scrub: 1
      }
    });
    
    // Floating shapes move in different directions
    gsap.to('.shape-circle', {
      y: 200,
      x: -100,
      rotate: 90,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom top',
        scrub: 2
      }
    });
    
    gsap.to('.shape-square', {
      y: -150,
      x: 100,
      rotate: 135,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });
    
    gsap.to('.shape-triangle', {
      y: 300,
      x: -50,
      rotate: -45,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom top',
        scrub: 2.5
      }
    });
    
    console.log('GSAP ScrollTrigger initialized with', document.querySelectorAll('.scroll-reveal').length, 'elements');
  } else {
    console.error('GSAP or ScrollTrigger not loaded');
  }

  // Scroll-based Text Animation
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const textLines = document.querySelectorAll('.text-line');
    const progressDots = document.querySelectorAll('.progress-dot');
    const TOTAL_LINES = textLines.length;
    const VERTICAL_OFFSET = 40;
    const ANIMATION_EASE = 'power2.inOut';

    if (TOTAL_LINES > 0) {
      // Set all lines to completely hidden initially
      gsap.set('.text-line', { 
        opacity: 0, 
        y: VERTICAL_OFFSET,
        display: 'none'
      });

      // Pin the text container while scrolling through the entire section
      ScrollTrigger.create({
        trigger: '.text-animation-section',
        start: 'top top',
        end: 'bottom bottom',
        pin: '.text-pin-container',
        pinSpacing: true,
        anticipatePin: 1,
        markers: false
      });

      // Animate each text line with complete separation
      textLines.forEach((line, index) => {
        const startPercent = (index / TOTAL_LINES) * 100;
        const endPercent = ((index + 1) / TOTAL_LINES) * 100;
        const rangeSize = endPercent - startPercent;
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.text-animation-section',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress * 100;
              
              // Update progress dots
              if (progress >= startPercent && progress < endPercent) {
                progressDots.forEach(dot => dot.classList.remove('active'));
                progressDots[index]?.classList.add('active');
              }
              
              // Force hide other lines when this one is active
              textLines.forEach((otherLine, otherIndex) => {
                if (otherIndex !== index) {
                  const otherStart = (otherIndex / TOTAL_LINES) * 100;
                  const otherEnd = ((otherIndex + 1) / TOTAL_LINES) * 100;
                  
                  // If we're in this line's range and the other line should be hidden
                  if (progress >= startPercent && progress < endPercent) {
                    if (progress < otherStart || progress >= otherEnd) {
                      gsap.set(otherLine, { display: 'none', opacity: 0 });
                    }
                  }
                }
              });
            }
          }
        });

        // Timing: 20% fade in, 50% visible, 20% fade out, 10% gap
        const fadeInStart = startPercent / 100;
        const fadeInEnd = (startPercent + (rangeSize * 0.20)) / 100;
        const fadeOutStart = (startPercent + (rangeSize * 0.70)) / 100;
        const fadeOutEnd = (startPercent + (rangeSize * 0.90)) / 100;

        // Show and fade in
        tl.to(line, {
          display: 'block',
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          duration: fadeInEnd - fadeInStart
        }, fadeInStart);

        // Hold visible
        tl.to(line, {
          opacity: 1,
          y: 0,
          duration: fadeOutStart - fadeInEnd
        }, fadeInEnd);

        // Fade out
        tl.to(line, {
          opacity: 0,
          y: -VERTICAL_OFFSET,
          ease: 'power2.in',
          duration: fadeOutEnd - fadeOutStart
        }, fadeOutStart);

        // Hide completely
        tl.to(line, {
          display: 'none',
          opacity: 0,
          duration: (endPercent / 100) - fadeOutEnd
        }, fadeOutEnd);

        // Ensure fully hidden at the end
        tl.to(line, {
          opacity: 0,
          y: -VERTICAL_OFFSET,
          duration: (endPercent / 100) - fadeOutEnd
        }, fadeOutEnd);
      });

      // Initialize first dot
      progressDots[0]?.classList.add('active');
      
      console.log('Scroll text animation initialized with', TOTAL_LINES, 'text lines');
    }
  }
});

// Lightbox for project images (delegated)
document.addEventListener('click', function(e){
  const target = e.target;
  // open lightbox when clicking a process thumbnail
  if(target.matches('.process-item img')){
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    if(lb && lbImg){
      lbImg.src = target.src;
      lb.setAttribute('aria-hidden','false');
      lb.classList.add('open');
      document.body.style.overflow='hidden';
      const closeBtn = lb.querySelector('#lightbox-close');
      if(closeBtn) closeBtn.focus();
    }
  }

  // delegated close: clicking the close button or backdrop
  if(target.matches('#lightbox-close') || target.matches('#lightbox')){
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    if(lb){
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden','true');
      document.body.style.overflow='';
      if(lbImg) lbImg.src = '';
    }
  }
});

// Escape key closes lightbox (and already handled for pdf modal inside DOMContentLoaded)
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape'){
    const lb = document.getElementById('lightbox');
    if(lb && lb.classList.contains('open')){
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
      const lbImg = document.getElementById('lightbox-img');
      if(lbImg) lbImg.src = '';
    }
  }
});

  // Keyboard activation for thumbnails: Enter or Space on a focused .thumb-wrap opens the lightbox
  document.addEventListener('keydown', function(e){
    if(e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar'){
      const active = document.activeElement;
      if(active && active.classList && active.classList.contains('thumb-wrap')){
        // try to find an image inside and open the lightbox with its src
        const img = active.querySelector('img');
        if(img){
          const lb = document.getElementById('lightbox');
          const lbImg = document.getElementById('lightbox-img');
          if(lb && lbImg){
            lbImg.src = img.src;
            lb.setAttribute('aria-hidden','false');
            lb.classList.add('open');
            document.body.style.overflow='hidden';
            const closeBtn = lb.querySelector('#lightbox-close');
            if(closeBtn) closeBtn.focus();
            e.preventDefault();
          }
        }
      }
    }
  });