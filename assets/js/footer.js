(() => {
  const footerHtml = `
  <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-column">
                    <h3>DataBros Tech</h3>
                    <p>Transforming businesses through innovative data solutions and advanced analytics.</p>
                    <div class="social-icons">
                        <a href="https://www.linkedin.com/company/data-bros-tech" title="LinkedIn - DataBros Tech" aria-label="LinkedIn - DataBros Tech" target="_blank" rel="noopener noreferrer"><i class="fab fa-linkedin-in" aria-hidden="true"></i></a>
                        <a href="https://x.com/Databrostech" title="X (formerly Twitter) - DataBros Tech" aria-label="X (formerly Twitter) - DataBros Tech" target="_blank" rel="noopener noreferrer"><i class="fab fa-twitter" aria-hidden="true"></i></a>
                        <a href="https://youtube.com/@databrostech?si=qBeMJNnf5Zsql8DR" title="YouTube - DataBros Tech" aria-label="YouTube - DataBros Tech" target="_blank" rel="noopener noreferrer"><i class="fab fa-youtube" aria-hidden="true"></i></a>
                        <a href="https://www.instagram.com/databrostech/" title="Instagram - DataBros Tech" aria-label="Instagram - DataBros Tech" target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram" aria-hidden="true"></i></a>
                    </div>
                </div>
                
                <div class="footer-column">
                    <h3>Solutions</h3>
                    <ul>
                        <li><a href="#">AI & Machine Learning</a></li>
                        <li><a href="#">Business Intelligence</a></li>
                        <li><a href="#">Data Engineering</a></li>
                        <li><a href="#">Data Visualization</a></li>
                        <li><a href="#">Cloud Data Solutions</a></li>
                    </ul>
                </div>
                
                <div class="footer-column">
                    <h3>Company</h3>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="careers.html">Careers</a></li>
                        <li><a href="case-studies.html">Case Studies</a></li>
                        <li><a href="blog.html">Blog</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
                
                <div class="footer-column">
                    <h3>Contact</h3>
                    <ul>
                        <li><i class="fas fa-map-marker-alt"></i> Lagos, Nigeria</li>
                        <li><i class="fas fa-phone"></i> +234 (0703) 852-2275</li>
                        <li><i class="fas fa-envelope"></i> info@databrostechs.com</li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2025 DataBros Tech. All rights reserved.</p>
            </div>
        </div>
    </footer>

  <!-- Contact modal injected once -->
  <div id="contact-modal-backdrop" class="contact-modal-backdrop" aria-hidden="true">
    <div class="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title">
      <div class="contact-modal-header">
        <h2 id="contact-title">Get in touch</h2>
        <button class="contact-close" id="contact-close" aria-label="Close">&times;</button>
      </div>
      <p>Fill the form below and we'll get back to you. This will open your email client to send the message.</p>
      <form id="contact-form" novalidate>
        <div class="contact-grid">
          <div class="form-field">
            <input id="contact-name" class="contact-input" placeholder=" " required />
            <label for="contact-name">Your name</label>
          </div>
          <div class="form-field">
            <input id="contact-company" class="contact-input" placeholder=" " />
            <label for="contact-company">Company (optional)</label>
          </div>
          <div class="form-field">
            <input id="contact-email" class="contact-input" placeholder=" " type="email" required />
            <label for="contact-email">Email</label>
          </div>
          <div class="form-field">
            <input id="contact-phone" class="contact-input" placeholder=" " />
            <label for="contact-phone">Phone (optional)</label>
          </div>
        </div>
        <div class="contact-message-wrap">
          <div class="form-field">
            <textarea id="contact-message" class="contact-textarea" placeholder=" " rows="6" required></textarea>
            <label for="contact-message">How can we help? Provide as much detail as you can...</label>
          </div>
        </div>
        <div class="contact-actions">
          <button type="button" class="btn" id="contact-cancel">Cancel</button>
          <button type="submit" class="btn">Send</button>
        </div>
      </form>
    </div>
  </div>
  `;

  function injectFooter(){
    const placeholder = document.getElementById('site-footer-placeholder');
    if(placeholder){
      placeholder.outerHTML = footerHtml;
    } else {
      document.body.insertAdjacentHTML('beforeend', footerHtml);
    }

    // wire CTA buttons (header and any .cta-button) to open modal
    const openModal = () => {
      const bd = document.getElementById('contact-modal-backdrop');
      if(!bd) return;
      bd.style.display = 'flex';
      bd.setAttribute('aria-hidden','false');
    };

    const closeModal = () => {
      const bd = document.getElementById('contact-modal-backdrop');
      if(!bd) return;
      bd.style.display = 'none';
      bd.setAttribute('aria-hidden','true');
    };

    // Attach to all CTA buttons
    document.querySelectorAll('.cta-button').forEach(btn => {
      btn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    });

    // header's Get Started matches .cta-button

    // modal close handlers
    const closeBtn = document.getElementById('contact-close');
    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    const cancelBtn = document.getElementById('contact-cancel');
    if(cancelBtn) cancelBtn.addEventListener('click', closeModal);
    const backdrop = document.getElementById('contact-modal-backdrop');
    if(backdrop) backdrop.addEventListener('click', (e)=>{ if(e.target===backdrop) closeModal(); });

    // form submit: open mail client via mailto with prefilled subject/body
    const form = document.getElementById('contact-form');
    if(form){
      // autosize textarea helper (also applies to any blog-form textarea if present)
      const autoSize = (el) => {
        el.style.height = 'auto';
        el.style.height = (el.scrollHeight) + 'px';
      };
      const textareas = document.querySelectorAll('.contact-textarea, .blog-form textarea');
      textareas.forEach(t => {
        // set an initial height
        autoSize(t);
        t.addEventListener('input', () => autoSize(t));
      });

      form.addEventListener('submit', function(e){
        e.preventDefault();
        const name = document.getElementById('contact-name').value.trim();
        const company = document.getElementById('contact-company').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const phone = document.getElementById('contact-phone').value.trim();
        const message = document.getElementById('contact-message').value.trim();
        const subject = encodeURIComponent('Website inquiry from ' + name + (company?(' - '+company):''));
        const body = encodeURIComponent(`Name: ${name}\nCompany: ${company}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`);
        // mailto fallback
        const mailto = `mailto:info@databrostechs.com?subject=${subject}&body=${body}`;
        window.location.href = mailto;
        // close modal
        setTimeout(()=>{ if(document.getElementById('contact-modal-backdrop')) document.getElementById('contact-modal-backdrop').style.display='none'; },300);
      });
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', injectFooter); else injectFooter();
})();
