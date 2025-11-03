(function(){
  const headerHtml = `
  <header id="main-header" class="site-header">
    <div class="header-container container">
      <div class="logo">
        <svg class="logo-svg" viewBox="0 0 221 228" aria-hidden="true" focusable="false">
          <path fill="#38b6ff" d="M 110.550781 114.558594 L 69.4375 73.46875 L 81.292969 61.617188 C 81.292969 61.617188 81.296875 61.613281 81.296875 61.613281 L 110.550781 32.375 L 139.800781 61.613281 C 139.808594 61.617188 139.808594 61.617188 139.8125 61.621094 L 151.664062 73.46875 Z"/>
          <path fill="#55beff" d="M 110.550781 32.375 L 135.816406 7.125 C 142.367188 0.578125 152.988281 0.578125 159.535156 7.125 L 188.789062 36.359375 L 151.660156 73.46875 L 139.808594 61.621094 C 139.800781 61.621094 139.800781 61.617188 139.796875 61.613281 Z"/>
          <path fill="#6dc6ff" d="M 151.660156 73.46875 L 188.789062 36.359375 L 214.054688 61.613281 C 220.601562 68.15625 220.601562 78.773438 214.054688 85.316406 L 188.789062 110.570312 Z"/>
          <path fill="#81cdff" d="M 151.660156 73.46875 L 188.78125 110.574219 L 159.53125 139.8125 C 152.980469 146.355469 142.359375 146.355469 135.8125 139.8125 L 110.546875 114.558594 Z"/>
          <path fill="#002c3c" d="M 69.4375 73.46875 L 32.308594 36.359375 L 61.558594 7.125 C 68.109375 0.578125 78.730469 0.578125 85.277344 7.125 L 109.390625 31.222656 L 110.546875 32.375 L 81.292969 61.613281 C 81.292969 61.613281 81.292969 61.617188 81.289062 61.617188 Z"/>
          <path fill="#005778" d="M 69.4375 73.46875 L 32.308594 110.574219 L 7.042969 85.324219 C 0.492188 78.777344 0.488281 68.160156 7.042969 61.617188 L 32.308594 36.363281 Z"/>
          <path fill="#0083b3" d="M 61.558594 139.804688 L 32.308594 110.570312 L 69.4375 73.46875 L 110.550781 114.558594 L 85.285156 139.804688 C 78.730469 146.355469 68.113281 146.355469 61.558594 139.804688 Z"/>
        </svg>
        <div class="logo-text">DataBros Tech</div>
      </div>

      <div class="mobile-menu" aria-hidden="true">
        <i class="fas fa-bars"></i>
      </div>

      <ul class="nav-menu">
  <li><a href="databros.html">Home</a></li>
        <li class="dropdown">
          <a href="#">Industry</a>
          <ul class="dropdown-menu">
            <li><a href="fintech.html">Fintech</a></li>
            <li><a href="ecommerce.html">E-commerce</a></li>
            <li><a href="sport-wellness.html">Sport & Wellness</a></li>
            <li><a href="logistics.html">Logistics</a></li>
            <li><a href="automotive.html">Automotive</a></li>
            <li><a href="retail.html">Retail</a></li>
          </ul>
        </li>
        <li class="dropdown">
          <a href="#">Solutions</a>
          <ul class="dropdown-menu">
            <li><a href="recommendation-system.html">Recommendation System</a></li>
            <li><a href="text-analysis.html">Text Analysis</a></li>
            <li><a href="predictive-analytics.html">Predictive Analytics</a></li>
            <li><a href="consumer-sentiment.html">Consumer Sentiment Analysis</a></li>
            <li><a href="custom-llm.html">Custom Large Language</a></li>
            <li><a href="image-recognition.html">Image Recognition</a></li>
            <li><a href="data-capture-ocr.html">Data Capture & OCR</a></li>
          </ul>
        </li>
        <li class="dropdown">
          <a href="#">Services</a>
          <ul class="dropdown-menu">
            <li><a href="ai-ml.html">Artificial Intelligence & ML</a></li>
            <li><a href="generative-ai.html">Generative AI & GPT</a></li>
            <li><a href="big-data-cloud.html">Big Data & Cloud</a></li>
            <li><a href="software-development.html">Software Development</a></li>
          </ul>
        </li>
        <li><a href="case-studies.html">Case Studies</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="blog.html">Blog</a></li>
        <li><a href="contact.html">Contact</a></li>
        <li><button class="cta-button">Get Started</button></li>
      </ul>
    </div>
  </header>
  `;

  function injectHeader(){
    // Ensure Google Fonts are present (Aleo + Inter)
    const gfHref = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Aleo:wght@300;400;700&display=swap';
    if(!document.querySelector(`link[href*="fonts.googleapis.com"]`)){
      const gf = document.createElement('link');
      gf.rel = 'stylesheet';
      gf.href = gfHref;
      document.head.appendChild(gf);
    }

    // Replace or insert header
    const placeholder = document.getElementById('site-header-placeholder');
    if(placeholder){
      placeholder.outerHTML = headerHtml;
    } else {
      document.body.insertAdjacentHTML('afterbegin', headerHtml);
    }

    // mobile menu toggle
    const mobileBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('.nav-menu');
    if(mobileBtn && nav){
      mobileBtn.addEventListener('click', function(){ nav.classList.toggle('active'); });
    }

    // dropdown behavior: hover on desktop, click on mobile
    const dropdownItems = document.querySelectorAll('.nav-menu .dropdown');
    dropdownItems.forEach(item => {
      // hover (desktop)
      item.addEventListener('mouseenter', () => item.classList.add('open'));
      item.addEventListener('mouseleave', () => item.classList.remove('open'));
      // click toggle (mobile)
      const trigger = item.querySelector('a');
      trigger.addEventListener('click', (e) => {
        if(window.innerWidth <= 768){
          e.preventDefault();
          item.classList.toggle('active');
        }
      });
    });

    // show dropdown on .open
    const style = document.createElement('style');
    style.textContent = '.nav-menu .dropdown.open > .dropdown-menu { opacity: 1; visibility: visible; transform: translateY(0); }';
    document.head.appendChild(style);

    // header scroll effect
    window.addEventListener('scroll', function(){
      const header = document.querySelector('.site-header');
      if(window.scrollY > 50) header.classList.add('scrolled'); else header.classList.remove('scrolled');
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectHeader); else injectHeader();
})();
