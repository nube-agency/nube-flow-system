(function() {
  'use strict';

  // Get the script tag and its attributes
  const currentScript = document.currentScript;
  const sourcePath = currentScript?.getAttribute('nf-source');
  const includeTrigger = currentScript?.getAttribute('nf-trigger') === 'true'; // Default: false
  const isOptOut = currentScript?.getAttribute('nf-optout') === 'true'; // Default: false (opt-in)
  const consentExpiry = parseInt(currentScript?.getAttribute('nf-consent-expiry') || '30', 10); // Days
  const consentVersion = currentScript?.getAttribute('nf-consent-version') || '1.0';

  if (!sourcePath) {
    console.error('Cookie script: nf-source attribute is required');
    return;
  }

  // Helper functions to show/hide elements
  function hideElement(element) {
    if (!element) return;
    element.style.display = 'none';
  }

  function showElement(element) {
    if (!element) return;
    element.style.display = '';
  }

  // Delete all cookies
  function deleteAllCookies() {
    const cookies = document.cookie.split(';');
    const hostname = window.location.hostname;
    const domains = [
      '',  // No domain specified
      hostname,
      `.${hostname}`
    ];

    // Also try parent domain if subdomain
    const parts = hostname.split('.');
    if (parts.length > 2) {
      domains.push(`.${parts.slice(-2).join('.')}`);
    }
    if (parts.length > 3) {
      domains.push(`.${parts.slice(-3).join('.')}`);
    }

    // Common paths to try
    const paths = [
      '/',
      window.location.pathname,
      window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'))
    ];

    cookies.forEach(cookie => {
      const name = cookie.split('=')[0].trim();

      if (!name) return;

      // Try all combinations of domain and path
      domains.forEach(domain => {
        paths.forEach(path => {
          // With domain
          if (domain) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; SameSite=Lax`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; SameSite=None; Secure`;
          }
          // Without domain
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=Lax`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=None; Secure`;
        });
      });

      console.log(`Attempted to delete cookie: ${name}`);
    });

    console.log('All cookies cleared - attempted multiple domain/path/SameSite combinations');
  }

  // Save consent preferences to localStorage
  function saveConsent(categories, clearCookiesOnLoad = false) {
    localStorage.setItem('nf-cookie-consent', JSON.stringify({
      categories: categories,
      timestamp: new Date().toISOString(),
      clearCookiesOnLoad: clearCookiesOnLoad,
      version: consentVersion,
      expiryDays: consentExpiry
    }));
  }

  // Check if consent has expired or version has changed
  function isConsentValid(consent) {
    if (!consent || !consent.timestamp) return false;

    // Check version mismatch
    if (consent.version !== consentVersion) {
      console.log(`Consent version changed: ${consent.version} -> ${consentVersion}`);
      return false;
    }

    // Check expiry
    const consentDate = new Date(consent.timestamp);
    const expiryDate = new Date(consentDate);
    const daysToUse = consent.expiryDays || consentExpiry;
    expiryDate.setDate(expiryDate.getDate() + daysToUse);

    if (new Date() > expiryDate) {
      console.log(`Consent expired (${daysToUse} days since ${consent.timestamp})`);
      return false;
    }

    return true;
  }

  // Load consent preferences from localStorage
  function loadConsent() {
    const stored = localStorage.getItem('nf-cookie-consent');
    if (stored) {
      try {
        const consent = JSON.parse(stored);

        // Validate consent
        if (!isConsentValid(consent)) {
          console.log('Consent is invalid or expired - prompting user again');
          localStorage.removeItem('nf-cookie-consent');
          return null;
        }

        return consent;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  // Signal consent to third-party tools that require explicit consent APIs
  function signalConsent(categories) {
    console.log('Signaling consent to third-party tools:', categories);

    const hasAnalytics = categories.includes('analytics');
    const hasMarketing = categories.includes('marketing');

    // Microsoft Clarity Consent API v2
    const signalClarity = () => {
      if (typeof window.clarity === 'function') {
        try {
          window.clarity('consentv2', {
            ad_Storage: hasMarketing ? "granted" : "denied",
            analytics_Storage: hasAnalytics ? "granted" : "denied"
          });
          console.log('✓ Clarity consent signaled:', {
            ad_Storage: hasMarketing ? "granted" : "denied",
            analytics_Storage: hasAnalytics ? "granted" : "denied"
          });
        } catch (error) {
          console.error('Clarity consent error:', error);
        }
      } else {
        console.warn('Clarity not yet initialized, will retry...');
        return false;
      }
      return true;
    };

    // Try to signal Clarity immediately, retry if not ready
    if (!signalClarity()) {
      let attempts = 0;
      const clarityInterval = setInterval(() => {
        attempts++;
        if (signalClarity() || attempts >= 20) {
          clearInterval(clarityInterval);
          if (attempts >= 20) {
            console.warn('Clarity did not initialize after 2 seconds');
          }
        }
      }, 100);
    }

    // Google Consent Mode (gtag)
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'ad_storage': hasMarketing ? 'granted' : 'denied',
        'ad_user_data': hasMarketing ? 'granted' : 'denied',
        'ad_personalization': hasMarketing ? 'granted' : 'denied',
        'analytics_storage': hasAnalytics ? 'granted' : 'denied',
        'personalization_storage': categories.includes('personalization') ? 'granted' : 'denied'
      });
      console.log('✓ Google consent signaled');
    }

    // Fire custom consent event for other integrations
    window.dispatchEvent(new CustomEvent('nf-consent-updated', {
      detail: { categories: categories }
    }));
  }

  // Load scripts based on consent
  function loadScripts(categories) {
    console.log('Loading scripts for categories:', categories);

    categories.forEach(category => {
      const scriptContainers = document.querySelectorAll(`[nf-script="${category}"]`);
      console.log(`Found ${scriptContainers.length} containers for category: ${category}`);

      scriptContainers.forEach(container => {
        // Find all blocked script tags within the container
        const scripts = container.querySelectorAll('script[type="text/plain"]');
        console.log(`Found ${scripts.length} scripts to load in ${category}`);

        scripts.forEach(oldScript => {
          // Create a new script element
          const newScript = document.createElement('script');

          // Copy all attributes except type
          Array.from(oldScript.attributes).forEach(attr => {
            if (attr.name !== 'type') {
              newScript.setAttribute(attr.name, attr.value);
            }
          });

          // Copy inline script content
          if (oldScript.textContent) {
            newScript.textContent = oldScript.textContent;
          }

          // Replace old script with new one to execute it
          oldScript.parentNode.replaceChild(newScript, oldScript);
          console.log('Script loaded:', newScript.src || 'inline script');
        });
      });
    });

    // Signal consent to third-party tools after scripts are loaded
    signalConsent(categories);
  }

  // Get current consent preferences
  function getActiveCategories(cookiesCard) {
    const categories = ['essentials']; // Essentials always active
    const options = ['personalization', 'analytics', 'marketing'];

    options.forEach(option => {
      const optionElement = cookiesCard.querySelector(`[nf-cc="${option}"].cookies_card_option`);
      console.log(`Checking ${option}:`, optionElement, 'has option-active?', optionElement?.classList.contains('option-active'));
      if (optionElement && optionElement.classList.contains('option-active')) {
        categories.push(option);
      }
    });

    console.log('Active categories:', categories);
    return categories;
  }

  // Add keyboard accessibility
  function enhanceAccessibility(cookiesCard) {
    const toggles = cookiesCard.querySelectorAll('.cookies_card_option_toggle');
    const optionsWrapper = cookiesCard.querySelector('[nf-cc="options"]');
    const actionsWrapper = cookiesCard.querySelector('[nf-cc="actions"]');

    // Manage focusable elements based on options-open state
    const updateFocusableElements = () => {
      const isOptionsOpen = cookiesCard.classList.contains('options-open');

      // Get all interactive elements in options panel (excluding essentials toggle)
      const essentialsOption = cookiesCard.querySelector('[nf-cc="essentials"]');
      const essentialsToggle = essentialsOption?.querySelector('.cookies_card_option_toggle');
      const optionsToggles = Array.from(optionsWrapper?.querySelectorAll('.cookies_card_option_toggle') || [])
        .filter(toggle => toggle !== essentialsToggle); // Exclude essentials toggle
      const optionsButtons = optionsWrapper?.querySelectorAll('button') || [];

      // Get all interactive elements in actions panel
      const actionsButtons = actionsWrapper?.querySelectorAll('button') || [];

      // Essentials toggle always stays non-focusable
      if (essentialsToggle) {
        essentialsToggle.setAttribute('tabindex', '-1');
      }

      if (isOptionsOpen) {
        // Options panel is open: make options focusable, actions non-focusable
        optionsToggles.forEach(el => el.setAttribute('tabindex', '0'));
        optionsButtons.forEach(el => el.setAttribute('tabindex', '0'));
        actionsButtons.forEach(el => el.setAttribute('tabindex', '-1'));
      } else {
        // Options panel is closed: make actions focusable, options non-focusable
        optionsToggles.forEach(el => el.setAttribute('tabindex', '-1'));
        optionsButtons.forEach(el => el.setAttribute('tabindex', '-1'));
        actionsButtons.forEach(el => el.setAttribute('tabindex', '0'));
      }
    };

    // Set initial state
    updateFocusableElements();

    // Watch for options-open class changes
    const classObserver = new MutationObserver(updateFocusableElements);
    classObserver.observe(cookiesCard, { attributes: true, attributeFilter: ['class'] });

    toggles.forEach(toggle => {
      // Keyboard support: Space/Enter to toggle
      toggle.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          toggle.click();
        }
      });

      // Update aria-checked dynamically
      const updateAriaChecked = () => {
        const option = toggle.closest('.cookies_card_option');
        const isActive = option?.classList.contains('option-active');
        toggle.setAttribute('aria-checked', isActive ? 'true' : 'false');
      };

      // Set initial state
      updateAriaChecked();

      // Watch for class changes
      const observer = new MutationObserver(updateAriaChecked);
      const option = toggle.closest('.cookies_card_option');
      if (option) {
        observer.observe(option, { attributes: true, attributeFilter: ['class'] });
      }
    });

    // ESC key support
    cookiesCard.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        cookiesCard.classList.add('options-open');
      }
    });

    // Focus first interactive element when modal shows
    const visibilityObserver = new MutationObserver(() => {
      if (cookiesCard.style.display !== 'none') {
        const firstButton = cookiesCard.querySelector('button:not([disabled]):not([tabindex="-1"])');
        if (firstButton) {
          setTimeout(() => firstButton.focus(), 100);
        }
      }
    });
    visibilityObserver.observe(cookiesCard, { attributes: true, attributeFilter: ['style'] });
  }

  // Setup UI interactions
  function setupUIInteractions(cookiesCard, cookiesTrigger, isOptOut, isFirstVisit) {
    const optionsTrigger = cookiesCard.querySelector('[nf-cc="options-trigger"]');
    const optionsSave = cookiesCard.querySelector('[nf-cc="options-save"]');
    const optionToggles = cookiesCard.querySelectorAll('.cookies_card_option_toggle');
    const acceptBtn = cookiesCard.querySelector('[nf-cc="accept"]');
    const rejectBtn = cookiesCard.querySelector('[nf-cc="reject"]');
    const essentialsOption = cookiesCard.querySelector('[nf-cc="essentials"]');

    // Make essentials always active and non-interactive
    if (essentialsOption) {
      essentialsOption.classList.add('option-active');
      const essentialsToggle = essentialsOption.querySelector('.cookies_card_option_toggle');
      if (essentialsToggle) {
        essentialsToggle.style.pointerEvents = 'none';
        essentialsToggle.style.opacity = '0.5';
      }
    }

    // If opt-out mode AND first visit, enable all categories by default
    if (isOptOut && isFirstVisit) {
      const allOptions = ['personalization', 'analytics', 'marketing'];
      allOptions.forEach(category => {
        const optionElement = cookiesCard.querySelector(`[nf-cc="${category}"]`);
        if (optionElement && !optionElement.classList.contains('option-active')) {
          optionElement.classList.add('option-active');
        }
      });
    }

    // Enhance keyboard accessibility
    enhanceAccessibility(cookiesCard);

    // Options trigger - open customization panel (within the card)
    if (optionsTrigger) {
      optionsTrigger.addEventListener('click', () => {
        cookiesCard.classList.add('options-open');
      });
    }

    // Support for options-trigger on any element (floating button, footer links, etc.)
    const allOptionsTriggers = document.querySelectorAll('[nf-cc="options-trigger"]');
    allOptionsTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        // Show card and open options panel
        showElement(cookiesCard);
        cookiesCard.classList.add('options-open');
        // Hide floating trigger if it exists
        if (cookiesTrigger) {
          hideElement(cookiesTrigger);
        }
      });
    });

    // Options save - save current state, clear cookies, and reload
    if (optionsSave) {
      optionsSave.addEventListener('click', () => {
        const activeCategories = getActiveCategories(cookiesCard);
        console.log('Saving preferences:', activeCategories);

        // Set flag to clear cookies on next page load
        saveConsent(activeCategories, true);

        // Reload to apply new consent (cookies will be cleared after reload)
        window.location.reload();
      });
    }

    // Accept button - enable all categories and load all scripts
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        const allCategories = ['essentials', 'personalization', 'analytics', 'marketing'];
        saveConsent(allCategories);
        loadScripts(allCategories);

        hideElement(cookiesCard);
        if (cookiesTrigger) {
          showElement(cookiesTrigger);
        }
      });
    }

    // Reject button - only load essentials
    if (rejectBtn) {
      rejectBtn.addEventListener('click', () => {
        const essentialsOnly = ['essentials'];

        // Set flag to clear cookies on next page load and reload
        saveConsent(essentialsOnly, true);

        // Reload to apply new consent (cookies will be cleared after reload)
        window.location.reload();
      });
    }


    // Option toggles - toggle active state only (scripts load on save)
    optionToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const option = toggle.closest('.cookies_card_option');
        if (option) {
          // Don't allow toggling essentials
          const category = option.getAttribute('nf-cc');
          if (category === 'essentials') {
            return;
          }

          // Toggle the active state (visual only)
          option.classList.toggle('option-active');
          const isActive = option.classList.contains('option-active');

          console.log(`Toggled ${category} to: ${isActive ? 'active' : 'inactive'} (will apply on save)`);
        }
      });
    });
  }

  // Fetch the component from the source page
  fetch(sourcePath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch cookie component: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      // Parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Find the cookies card
      const cookiesCard = doc.querySelector('[nf-cc="card"]');

      if (!cookiesCard) {
        throw new Error('Cookie card ([nf-cc="card"]) not found in source page');
      }

      // Remove options-open class if present (card should start without it)
      cookiesCard.classList.remove('options-open');

      // Append the card to the bottom of the page
      document.body.appendChild(cookiesCard);

      let cookiesTrigger = null;

      // Optionally append the trigger
      if (includeTrigger) {
        cookiesTrigger = doc.querySelector('.cookies_trigger');

        if (cookiesTrigger) {
          document.body.appendChild(cookiesTrigger);
          // Hide trigger initially (will show when card is hidden)
          hideElement(cookiesTrigger);
        } else {
          console.warn('Cookie trigger not found in source page');
        }
      }

      // Check for existing consent
      const savedConsent = loadConsent();
      const isFirstVisit = !savedConsent || !savedConsent.categories;

      if (savedConsent && savedConsent.categories) {
        console.log('Found saved consent:', savedConsent);

        // If clearCookiesOnLoad flag is set, clear all cookies first
        if (savedConsent.clearCookiesOnLoad) {
          console.log('Clearing all cookies after preferences update...');
          deleteAllCookies();

          // Remove the flag and save again
          saveConsent(savedConsent.categories, false);
        }

        // Restore active state for saved categories (including essentials)
        const allCategories = ['essentials', 'personalization', 'analytics', 'marketing'];
        allCategories.forEach(category => {
          const optionElement = cookiesCard.querySelector(`[nf-cc="${category}"]`);
          if (optionElement) {
            // Add or remove option-active based on saved consent
            if (savedConsent.categories.includes(category)) {
              optionElement.classList.add('option-active');
              console.log(`Enabled ${category}`);
            } else {
              optionElement.classList.remove('option-active');
              console.log(`Disabled ${category}`);
            }
          } else {
            console.warn(`Could not find element for category: ${category}`);
          }
        });

        // Hide card and show trigger
        hideElement(cookiesCard);
        if (cookiesTrigger) {
          showElement(cookiesTrigger);
        }
        // Load scripts based on saved consent
        loadScripts(savedConsent.categories);
      } else if (isOptOut) {
        // First visit with opt-out mode: accept all by default and show card
        console.log('First visit in opt-out mode - enabling all categories by default');
        const allCategories = ['essentials', 'personalization', 'analytics', 'marketing'];

        // Load all scripts immediately (implicit consent in opt-out mode)
        loadScripts(allCategories);

        // Note: We don't save consent yet - only save when user interacts
        // This way the card will show again on next visit if user didn't interact
      }

      // Setup UI interactions
      setupUIInteractions(cookiesCard, cookiesTrigger, isOptOut, isFirstVisit);
    })
    .catch(error => {
      console.error('Cookie script error:', error);
    });
})();
