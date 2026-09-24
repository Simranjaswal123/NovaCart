/**
 * NovaCart - JavaScript Logic
 * Baseline Version (Deterministic, No External APIs, No Continuous Timers)
 * 
 * Features:
 * 1. Cart state & Navbar Counter
 * 2. Products Search & Category Filtering
 * 3. Contact Form Validation & Feedback
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Cart Management
  // =========================================================================
  const CART_STORAGE_KEY = 'novacart_cart_count';

  function getCartCount() {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? parseInt(stored, 10) || 0 : 0;
    } catch (e) {
      return 0;
    }
  }

  function setCartCount(count) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, count.toString());
    } catch (e) {
      // Storage unavailable or disabled
    }
    renderCartCount(count);
  }

  function renderCartCount(count) {
    const counterElements = document.querySelectorAll('[data-testid="cart-count"]');
    counterElements.forEach(function (el) {
      el.textContent = count;
    });
  }

  function initCart() {
    renderCartCount(getCartCount());

    const addToCartButtons = document.querySelectorAll('[data-testid="add-to-cart"]');
    addToCartButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const currentCount = getCartCount();
        const nextCount = currentCount + 1;
        setCartCount(nextCount);

        // Immediate visual button feedback
        const originalText = btn.getAttribute('data-original-text') || btn.textContent;
        if (!btn.getAttribute('data-original-text')) {
          btn.setAttribute('data-original-text', originalText);
        }

        btn.textContent = 'Added ✓';
        btn.classList.add('btn-added');

        setTimeout(function () {
          btn.textContent = originalText;
          btn.classList.remove('btn-added');
        }, 1200);
      });
    });

    // Login button placeholder click
    const loginBtn = document.querySelector('[data-testid="login-btn"]');
    if (loginBtn) {
      loginBtn.addEventListener('click', function () {
        alert('Demo Mode: Login functionality is a static placeholder for visual regression testing.');
      });
    }
  }

  // =========================================================================
  // 2. Products Page: Search and Filter
  // =========================================================================
  function initProductsPage() {
    const searchInput = document.querySelector('[data-testid="search-input"]');
    const filterButtons = document.querySelectorAll('[data-testid="category-filter"]');
    const productCards = document.querySelectorAll('[data-testid="product-card"]');
    const noResultsEl = document.getElementById('no-results');

    if (!productCards.length) return;

    let activeCategory = 'all';
    let searchQuery = '';

    function filterProducts() {
      let visibleCount = 0;

      productCards.forEach(function (card) {
        const cardCategory = (card.getAttribute('data-category') || '').toLowerCase();
        const titleEl = card.querySelector('.product-name');
        const cardTitle = titleEl ? titleEl.textContent.toLowerCase() : '';

        const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
        const matchesSearch = !searchQuery || cardTitle.includes(searchQuery);

        if (matchesCategory && matchesSearch) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (noResultsEl) {
        if (visibleCount === 0) {
          noResultsEl.classList.add('visible');
        } else {
          noResultsEl.classList.remove('visible');
        }
      }
    }

    // Search input event
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        searchQuery = e.target.value.trim().toLowerCase();
        filterProducts();
      });
    }

    // Category filter button click events
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        activeCategory = (btn.getAttribute('data-category') || 'all').toLowerCase();
        filterProducts();
      });
    });
  }

  // =========================================================================
  // 3. Contact Page: Form Validation & Submission
  // =========================================================================
  function initContactPage() {
    const contactForm = document.querySelector('[data-testid="contact-form"]');
    if (!contactForm) return;

    const nameInput = document.querySelector('[data-testid="contact-name"]');
    const emailInput = document.querySelector('[data-testid="contact-email"]');
    const subjectInput = document.querySelector('[data-testid="contact-subject"]');
    const messageInput = document.querySelector('[data-testid="contact-message"]');
    const statusAlert = document.querySelector('[data-testid="form-status"]');

    function isValidEmail(email) {
      // Standard robust deterministic email regex
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    function setFieldError(field, errorEl, message) {
      field.classList.add('error');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('visible');
      }
    }

    function clearFieldError(field, errorEl) {
      field.classList.remove('error');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
      }
    }

    // Real-time error clearing on input
    [nameInput, emailInput, subjectInput, messageInput].forEach(function (input) {
      if (input) {
        input.addEventListener('input', function () {
          const errEl = input.parentElement.querySelector('.field-error-message');
          clearFieldError(input, errEl);
          if (statusAlert) {
            statusAlert.className = 'form-status-alert';
            statusAlert.textContent = '';
          }
        });
      }
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let hasError = false;

      // 1. Name validation
      const nameVal = nameInput ? nameInput.value.trim() : '';
      const nameErr = nameInput ? nameInput.parentElement.querySelector('.field-error-message') : null;
      if (!nameVal) {
        setFieldError(nameInput, nameErr, 'Please enter your full name.');
        hasError = true;
      } else {
        clearFieldError(nameInput, nameErr);
      }

      // 2. Email validation
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const emailErr = emailInput ? emailInput.parentElement.querySelector('.field-error-message') : null;
      if (!emailVal) {
        setFieldError(emailInput, emailErr, 'Please enter your email address.');
        hasError = true;
      } else if (!isValidEmail(emailVal)) {
        setFieldError(emailInput, emailErr, 'Please enter a valid email address.');
        hasError = true;
      } else {
        clearFieldError(emailInput, emailErr);
      }

      // 3. Subject validation
      const subjectVal = subjectInput ? subjectInput.value.trim() : '';
      const subjectErr = subjectInput ? subjectInput.parentElement.querySelector('.field-error-message') : null;
      if (!subjectVal) {
        setFieldError(subjectInput, subjectErr, 'Please enter a subject.');
        hasError = true;
      } else {
        clearFieldError(subjectInput, subjectErr);
      }

      // 4. Message validation
      const messageVal = messageInput ? messageInput.value.trim() : '';
      const messageErr = messageInput ? messageInput.parentElement.querySelector('.field-error-message') : null;
      if (!messageVal) {
        setFieldError(messageInput, messageErr, 'Please enter your message.');
        hasError = true;
      } else {
        clearFieldError(messageInput, messageErr);
      }

      if (hasError) {
        if (statusAlert) {
          statusAlert.className = 'form-status-alert error';
          statusAlert.textContent = 'Please correct the errors marked in the form above.';
        }
        return;
      }

      // Form is valid - display deterministic confirmation message
      if (statusAlert) {
        statusAlert.className = 'form-status-alert success';
        statusAlert.textContent = 'Thank you! Your message has been sent successfully. We will get back to you within 24 hours.';
      }

      contactForm.reset();
    });
  }

  // =========================================================================
  // Initialization
  // =========================================================================
  document.addEventListener('DOMContentLoaded', function () {
    initCart();
    initProductsPage();
    initContactPage();
  });
})();
