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
});

// Lightbox for project images (delegated)
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

