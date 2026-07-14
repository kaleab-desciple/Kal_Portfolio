/*==================== ENHANCED KEYBOARD NAVIGATION - WCAG 2.1 AA COMPLIANT ====================*/

// Initialize comprehensive keyboard navigation enhancements
function initializeKeyboardNavigation() {
  let keyboardUser = false;
  let lastFocusedElement = null;
  
  // Enhanced keyboard usage detection
  document.addEventListener('keydown', function(e) {
    // Detect Tab, Enter, Space, or Arrow keys as keyboard navigation
    if (['Tab', 'Enter', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      keyboardUser = true;
      document.body.classList.add('keyboard-user');
      
      // Announce keyboard navigation mode to screen readers
      announceToScreenReader('Keyboard navigation mode active');
    }
  });
  
  // Detect mouse usage
  document.addEventListener('mousedown', function() {
    keyboardUser = false;
    document.body.classList.remove('keyboard-user');
  });
  
  // Track last focused element for focus restoration
  document.addEventListener('focusin', function(e) {
    lastFocusedElement = e.target;
  });

  // Enhanced mobile menu focus management
  const navMenu = document.getElementById("nav-menu");
  const navToggle = document.getElementById("nav-toggle");
  const navClose = document.getElementById("nav-close");
  const navLinks = document.querySelectorAll(".nav__link");

  if (navToggle && navMenu && navClose) {
    // Enhanced ARIA attributes for navigation
    navToggle.setAttribute('aria-label', 'Open main navigation menu');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-controls', 'nav-menu');
    navToggle.setAttribute('aria-haspopup', 'true');
    
    navClose.setAttribute('aria-label', 'Close main navigation menu');
    navMenu.setAttribute('aria-hidden', 'true');
    navMenu.setAttribute('aria-labelledby', 'nav-menu-heading');
    
    // Add invisible heading for menu
    const menuHeading = document.createElement('h2');
    menuHeading.id = 'nav-menu-heading';
    menuHeading.className = 'sr-only';
    menuHeading.textContent = 'Main Navigation Menu';
    navMenu.insertBefore(menuHeading, navMenu.firstChild);

    // Enhanced menu opening with proper focus management
    navToggle.addEventListener("click", () => {
      openMobileMenu();
    });

    // Enhanced menu opening with Enter/Space key support
    navToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMobileMenu();
      }
    });

    function openMobileMenu() {
      const isOpen = navMenu.classList.contains("show-menu");
      
      if (!isOpen) {
        navMenu.classList.add("show-menu");
        navToggle.setAttribute('aria-expanded', 'true');
        navMenu.setAttribute('aria-hidden', 'false');
        navMenu.setAttribute('data-focus-trap', 'active');
        
        // Announce menu opening to screen readers
        announceToScreenReader('Navigation menu opened');
        
        // Focus management with delay for animation
        setTimeout(() => {
          navClose.focus();
        }, 300);
        
        // Trap focus within menu
        trapFocusInMenu();
        
        // Prevent body scrolling when menu is open
        document.body.style.overflow = 'hidden';
      }
    }

    // Enhanced menu closing
    navClose.addEventListener("click", () => {
      closeMobileMenu();
    });

    navClose.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        closeMobileMenu();
      }
    });

    // Global keyboard event handlers for menu
    document.addEventListener('keydown', function(e) {
      const isMenuOpen = navMenu.classList.contains("show-menu");
      
      if (e.key === 'Escape' && isMenuOpen) {
        e.preventDefault();
        closeMobileMenu();
        navToggle.focus(); // Return focus to toggle button
      }
      
      // Global navigation shortcuts (when menu is closed)
      if (!isMenuOpen && e.altKey) {
        switch(e.key) {
          case 'h':
            e.preventDefault();
            navigateToSection('#home');
            break;
          case 'a':
            e.preventDefault();
            navigateToSection('#about');
            break;
          case 's':
            e.preventDefault();
            navigateToSection('#skills');
            break;
          case 'p':
            e.preventDefault();
            navigateToSection('#portfolio');
            break;
          case 'c':
            e.preventDefault();
            navigateToSection('#contact');
            break;
        }
      }
    });

    function closeMobileMenu() {
      navMenu.classList.remove("show-menu");
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.setAttribute('aria-hidden', 'true');
      navMenu.removeAttribute('data-focus-trap');
      
      // Restore body scrolling
      document.body.style.overflow = '';
      
      // Announce menu closing to screen readers
      announceToScreenReader('Navigation menu closed');
    }

    function trapFocusInMenu() {
      const focusableElements = navMenu.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      function handleMenuKeydown(e) {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      }

      navMenu.addEventListener('keydown', handleMenuKeydown);
      
      // Store the handler so we can remove it later if needed
      navMenu._keydownHandler = handleMenuKeydown;
    }
  }

  // Enhanced navigation link keyboard support with ARIA
  navLinks.forEach((link, index) => {
    const sectionName = link.textContent.trim();
    const targetSection = link.getAttribute('href');
    
    // Enhanced ARIA labels
    link.setAttribute('aria-label', `Navigate to ${sectionName} section`);
    link.setAttribute('role', 'menuitem');
    
    // Enhanced keyboard interaction
    link.addEventListener('keydown', function(e) {
      handleNavigationKeydown(e, index, link, targetSection);
    });
    
    // Enhanced click handler with screen reader feedback
    link.addEventListener('click', function(e) {
      // Close mobile menu if open
      if (navMenu.classList.contains("show-menu")) {
        closeMobileMenu();
      }
      
      // Announce navigation to screen readers
      announceToScreenReader(`Navigating to ${sectionName} section`);
    });
  });
  
  function handleNavigationKeydown(e, index, link, targetSection) {
    switch(e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        link.click();
        break;
        
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        const nextIndex = (index + 1) % navLinks.length;
        navLinks[nextIndex].focus();
        announceToScreenReader(`${navLinks[nextIndex].textContent.trim()} navigation item`);
        break;
        
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        const prevIndex = (index - 1 + navLinks.length) % navLinks.length;
        navLinks[prevIndex].focus();
        announceToScreenReader(`${navLinks[prevIndex].textContent.trim()} navigation item`);
        break;
        
      case 'Home':
        e.preventDefault();
        navLinks[0].focus();
        break;
        
      case 'End':
        e.preventDefault();
        navLinks[navLinks.length - 1].focus();
        break;
    }
  }

  // Navigate to section helper function
  function navigateToSection(targetSection) {
    const element = document.querySelector(targetSection);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      
      // Make the section focusable and focus it
      element.setAttribute('tabindex', '-1');
      element.focus();
      
      // Remove tabindex after focusing to maintain normal tab flow
      setTimeout(() => {
        element.removeAttribute('tabindex');
      }, 1000);
      
      announceToScreenReader(`Navigated to ${targetSection.substring(1)} section`);
    }
  }

  // Enhanced keyboard support for theme toggle with detailed ARIA
  const themeButton = document.getElementById("theme-button");
  if (themeButton) {
    themeButton.setAttribute('aria-label', 'Toggle between dark and light theme');
    themeButton.setAttribute('role', 'switch');
    themeButton.setAttribute('aria-describedby', 'theme-description');
    
    // Add description element for screen readers
    const themeDescription = document.createElement('span');
    themeDescription.id = 'theme-description';
    themeDescription.className = 'sr-only';
    themeDescription.textContent = 'Changes the website color scheme between light and dark modes';
    themeButton.parentNode.insertBefore(themeDescription, themeButton.nextSibling);
    
    // Update aria-checked based on current theme
    function updateThemeAriaState() {
      const isDark = document.body.classList.contains('dark-theme');
      themeButton.setAttribute('aria-checked', isDark.toString());
      themeButton.setAttribute('aria-label', 
        isDark ? 'Switch to light theme' : 'Switch to dark theme'
      );
      
      // Update description for screen readers
      themeDescription.textContent = isDark ? 
        'Currently using dark theme. Activate to switch to light theme.' :
        'Currently using light theme. Activate to switch to dark theme.';
      
      // Announce theme change
      announceToScreenReader(`Theme switched to ${isDark ? 'dark' : 'light'} mode`);
    }
    
    updateThemeAriaState();
    
    // Enhanced theme toggle with keyboard support
    themeButton.addEventListener("click", () => {
      setTimeout(updateThemeAriaState, 100);
    });

    themeButton.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        themeButton.click();
      }
    });
  }

  // Enhanced keyboard support for modal system with comprehensive accessibility
  const modalBtns = document.querySelectorAll(".services__button");
  const modalCloses = document.querySelectorAll(".services__modal-close");
  const modalViews = document.querySelectorAll(".services__modal");

  modalBtns.forEach((btn, index) => {
    const modal = modalViews[index];
    const modalTitle = modal?.querySelector('.services__modal-title')?.textContent || 'qualification details';
    
    btn.setAttribute('aria-label', `View more ${modalTitle.toLowerCase()}`);
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-describedby', `modal-description-${index}`);
    
    // Add description for screen readers
    const modalDesc = document.createElement('span');
    modalDesc.id = `modal-description-${index}`;
    modalDesc.className = 'sr-only';
    modalDesc.textContent = `Opens a dialog with detailed information about ${modalTitle.toLowerCase()}`;
    btn.parentNode.insertBefore(modalDesc, btn.nextSibling);
    
    btn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
        
        // Store the element that opened the modal for focus restoration
        modal.setAttribute('data-return-focus', btn.id || `modal-btn-${index}`);
        btn.id = btn.id || `modal-btn-${index}`;
      }
    });
  });

  modalCloses.forEach((closeBtn, index) => {
    const modal = modalViews[index];
    
    closeBtn.setAttribute('aria-label', 'Close modal dialog');
    closeBtn.setAttribute('title', 'Close modal (Escape key)');
    
    closeBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        closeBtn.click();
        restoreFocusFromModal(modal);
      }
    });
  });

  // Enhanced modal keyboard handling
  modalViews.forEach((modal, index) => {
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', `modal-title-${index}`);
    modal.setAttribute('aria-describedby', `modal-content-${index}`);
    
    // Add IDs to modal title and content
    const modalTitle = modal.querySelector('.services__modal-title');
    const modalContent = modal.querySelector('.services__modal-services');
    
    if (modalTitle) {
      modalTitle.id = `modal-title-${index}`;
    }
    
    if (modalContent) {
      modalContent.id = `modal-content-${index}`;
    }

    // Comprehensive modal keyboard handling
    modal.addEventListener('keydown', function(e) {
      switch(e.key) {
        case 'Escape':
          e.preventDefault();
          const closeBtn = modal.querySelector('.services__modal-close');
          if (closeBtn) {
            closeBtn.click();
            restoreFocusFromModal(modal);
          }
          break;
          
        case 'Tab':
          trapFocusInModal(modal, e);
          break;
      }
    });

    // Focus trap for modals
    function trapFocusInModal(modal, e) {
      const focusableElements = modal.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"]), input, select, textarea'
      );
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
    
    // Enhanced modal opening behavior
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const isActive = modal.classList.contains('active-modal');
          
          if (isActive) {
            // Modal opened
            modal.setAttribute('aria-hidden', 'false');
            
            // Focus the close button after a delay
            setTimeout(() => {
              const closeBtn = modal.querySelector('.services__modal-close');
              if (closeBtn) {
                closeBtn.focus();
                announceToScreenReader('Modal dialog opened. Press Escape to close.');
              }
            }, 300);
            
            // Prevent body scrolling
            document.body.style.overflow = 'hidden';
            
          } else {
            // Modal closed
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            announceToScreenReader('Modal dialog closed');
          }
        }
      });
    });
    
    observer.observe(modal, { attributes: true });
  });

  function restoreFocusFromModal(modal) {
    const returnFocusId = modal.getAttribute('data-return-focus');
    const returnElement = returnFocusId ? document.getElementById(returnFocusId) : null;
    
    if (returnElement) {
      returnElement.focus();
    } else if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  // Enhanced keyboard support for scroll-up button
  const scrollUpBtn = document.getElementById("scroll-up");
  if (scrollUpBtn) {
    scrollUpBtn.setAttribute('aria-label', 'Scroll to top of page');
    scrollUpBtn.setAttribute('title', 'Scroll to top (Alt+T)');
    
    scrollUpBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scrollUpBtn.click();
        announceToScreenReader('Scrolling to top of page');
      }
    });
    
    // Global keyboard shortcut for scroll to top
    document.addEventListener('keydown', function(e) {
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        scrollUpBtn.click();
        scrollUpBtn.focus();
      }
    });
  }

  // Enhanced keyboard support for contact form
  const contactForm = document.querySelector('.contact__form');
  if (contactForm) {
    const formInputs = contactForm.querySelectorAll('.contact__input');
    const formLabels = contactForm.querySelectorAll('.content__label');
    
    // Enhanced form accessibility
    contactForm.setAttribute('role', 'form');
    contactForm.setAttribute('aria-label', 'Contact Kaleab Legesse');
    contactForm.setAttribute('novalidate', 'true'); // Handle validation with JavaScript
    
    // Associate labels with inputs and add comprehensive ARIA attributes
    formInputs.forEach((input, index) => {
      const label = formLabels[index];
      const contentDiv = input.closest('.contact__content');
      if (label && contentDiv) {
        const inputId = input.id || `contact-input-${index}`;
        const inputType = input.type || (input.tagName.toLowerCase() === 'textarea' ? 'textarea' : 'text');
        
        input.id = inputId;
        label.setAttribute('for', inputId);
        
        // Add required attribute and aria-required
        input.setAttribute('required', 'true');
        input.setAttribute('aria-required', 'true');
        
        // Add aria-describedby for validation messages
        const errorId = `${inputId}-error`;
        input.setAttribute('aria-describedby', errorId);
        
        // Add placeholder for floating label CSS
        input.setAttribute('placeholder', ' ');
        
        // Add error message container
        let errorMsg = contentDiv.querySelector(`#${errorId}`);
        if (!errorMsg) {
          errorMsg = document.createElement('div');
          errorMsg.id = errorId;
          errorMsg.className = 'contact__error';
          errorMsg.setAttribute('role', 'alert');
          errorMsg.setAttribute('aria-live', 'polite');
          contentDiv.appendChild(errorMsg);
        }
        
        // Enhanced input event handling
        input.addEventListener('input', function() {
          if (contentDiv.classList.contains('error')) {
            validateInput(input, contentDiv);
          }
        });
        
        input.addEventListener('blur', function() {
          validateInput(input, contentDiv);
        });
        
        input.addEventListener('keydown', function(e) {
          // Enhanced keyboard navigation for form
          if (e.key === 'Enter' && inputType !== 'textarea') {
            e.preventDefault();
            const nextIndex = index + 1;
            if (nextIndex < formInputs.length) {
              formInputs[nextIndex].focus();
            } else {
              // Focus submit button
              const submitBtn = contactForm.querySelector('.button');
              if (submitBtn) {
                submitBtn.focus();
              }
            }
          }
        });
      }
    });
    
    // Enhanced form submission
    const submitButton = contactForm.querySelector('.button');
    if (submitButton) {
      submitButton.setAttribute('type', 'button');
      submitButton.setAttribute('aria-describedby', 'submit-help');
      
      // Add submit help text
      const submitHelp = document.createElement('span');
      submitHelp.id = 'submit-help';
      submitHelp.className = 'sr-only';
      submitHelp.textContent = 'Clicking this button will open your email client to send a message to Kaleab';
      submitButton.parentNode.appendChild(submitHelp);
      
      submitButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          validateAndSubmitForm();
        }
      });
      
      submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        validateAndSubmitForm();
      });
    }
  }
  
  function validateInput(input, contentDiv) {
    const value = input.value.trim();
    const inputType = input.type || 'text';
    const errorId = input.getAttribute('aria-describedby');
    const errorElement = document.getElementById(errorId);
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous states
    contentDiv.classList.remove('error', 'success');
    
    if (!value && input.hasAttribute('required')) {
      isValid = false;
      errorMessage = 'This field is required';
    } else if (inputType === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }
    
    if (!isValid && errorElement) {
      errorElement.textContent = errorMessage;
      contentDiv.classList.add('error');
      input.setAttribute('aria-invalid', 'true');
    } else if (isValid && value) {
      contentDiv.classList.add('success');
      input.setAttribute('aria-invalid', 'false');
    }
    
    return isValid;
  }
  
  function validateAndSubmitForm() {
    const formInputs = document.querySelectorAll('.contact__input');
    const submitBtn = document.querySelector('.contact__form .button');
    let isFormValid = true;
    
    // Validate all inputs
    formInputs.forEach(input => {
      const contentDiv = input.closest('.contact__content');
      if (!validateInput(input, contentDiv)) {
        isFormValid = false;
      }
    });
    
    if (isFormValid) {
      // Show success animation
      if (submitBtn) {
        submitBtn.classList.add('success');
        submitBtn.disabled = true;
        
        announceToScreenReader('Form validation successful. Opening email client.');
        
        // Trigger the existing mailto functionality
        const mailtoLink = 'mailto:kaleablegesse2@gmail.com?subject=Testing%20out%20mailto!&body=This%20is%20only%20a%20test!';
        setTimeout(() => {
          window.location.href = mailtoLink;
          
          // Reset button after delay
          setTimeout(() => {
            submitBtn.classList.remove('success');
            submitBtn.disabled = false;
          }, 3000);
        }, 1500);
      }
    } else {
      // Show error animation
      if (submitBtn) {
        submitBtn.classList.add('error');
        setTimeout(() => {
          submitBtn.classList.remove('error');
        }, 2000);
      }
      
      const firstError = document.querySelector('.contact__input[aria-invalid="true"]');
      if (firstError) {
        firstError.focus();
        announceToScreenReader('Please correct the errors in the form before submitting');
      }
    }
  }

  // Enhanced keyboard support for portfolio/swiper with comprehensive accessibility
  const swiperContainer = document.querySelector('.portfolio__container');
  if (swiperContainer) {
    const swiperNext = swiperContainer.querySelector('.swiper-button-next');
    const swiperPrev = swiperContainer.querySelector('.swiper-button-prev');
    const swiperPagination = swiperContainer.querySelector('.swiper-pagination');
    
    // Enhanced navigation button accessibility
    if (swiperNext) {
      swiperNext.setAttribute('aria-label', 'Go to next project');
      swiperNext.setAttribute('title', 'Next project (Right arrow key)');
      swiperNext.setAttribute('tabindex', '0');
      
      swiperNext.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          swiperNext.click();
          announceToScreenReader('Navigated to next project');
        }
      });
    }
    
    if (swiperPrev) {
      swiperPrev.setAttribute('aria-label', 'Go to previous project');
      swiperPrev.setAttribute('title', 'Previous project (Left arrow key)');
      swiperPrev.setAttribute('tabindex', '0');
      
      swiperPrev.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          swiperPrev.click();
          announceToScreenReader('Navigated to previous project');
        }
      });
    }
    
    // Enhanced pagination accessibility
    if (swiperPagination) {
      swiperPagination.setAttribute('role', 'tablist');
      swiperPagination.setAttribute('aria-label', 'Portfolio project navigation dots');
      
      // Observe pagination changes to add accessibility
      const paginationObserver = new MutationObserver(function(mutations) {
        const bullets = swiperPagination.querySelectorAll('.swiper-pagination-bullet');
        bullets.forEach((bullet, index) => {
          bullet.setAttribute('role', 'tab');
          bullet.setAttribute('aria-label', `Go to project ${index + 1}`);
          bullet.setAttribute('tabindex', '0');
          bullet.setAttribute('aria-selected', bullet.classList.contains('swiper-pagination-bullet-active') ? 'true' : 'false');
          
          bullet.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              bullet.click();
              announceToScreenReader(`Navigated to project ${index + 1}`);
            }
          });
        });
      });
      
      paginationObserver.observe(swiperPagination, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });
    }

    // Enhanced slide accessibility
    const swiperSlides = swiperContainer.querySelectorAll('.swiper-slide');
    swiperSlides.forEach((slide, index) => {
      slide.setAttribute('tabindex', '0');
      slide.setAttribute('role', 'tabpanel');
      slide.setAttribute('aria-roledescription', 'slide');
      
      const projectTitle = slide.querySelector('.portfolio__title')?.textContent;
      if (projectTitle) {
        slide.setAttribute('aria-label', `Project: ${projectTitle}. ${index + 1} of ${swiperSlides.length}`);
        slide.setAttribute('aria-labelledby', `project-title-${index}`);
        
        // Add ID to project title
        const titleElement = slide.querySelector('.portfolio__title');
        if (titleElement) {
          titleElement.id = `project-title-${index}`;
        }
      } else {
        slide.setAttribute('aria-label', `Project ${index + 1} of ${swiperSlides.length}`);
      }
      
      // Enhanced keyboard navigation for slides
      slide.addEventListener('keydown', function(e) {
        switch(e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            if (swiperPrev) {
              swiperPrev.click();
            }
            break;
            
          case 'ArrowRight':
            e.preventDefault();
            if (swiperNext) {
              swiperNext.click();
            }
            break;
            
          case 'Home':
            e.preventDefault();
            // Go to first slide
            if (swiperContainer.swiper) {
              swiperContainer.swiper.slideTo(0);
              announceToScreenReader('Navigated to first project');
            }
            break;
            
          case 'End':
            e.preventDefault();
            // Go to last slide
            if (swiperContainer.swiper) {
              const lastIndex = swiperSlides.length - 1;
              swiperContainer.swiper.slideTo(lastIndex);
              announceToScreenReader('Navigated to last project');
            }
            break;
        }
      });
      
      // Enhance project links within slides
      const projectLink = slide.querySelector('.portfolio__button');
      if (projectLink) {
        projectLink.setAttribute('aria-describedby', `project-desc-${index}`);
        
        // Add description for screen readers
        const projectDesc = slide.querySelector('.portfolio__description');
        if (projectDesc) {
          projectDesc.id = `project-desc-${index}`;
        }
      }
    });
    
    // Global keyboard shortcuts for portfolio navigation
    document.addEventListener('keydown', function(e) {
      const isPortfolioSection = document.querySelector('#portfolio').getBoundingClientRect().top < window.innerHeight &&
                               document.querySelector('#portfolio').getBoundingClientRect().bottom > 0;
      
      if (isPortfolioSection && e.altKey) {
        switch(e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            if (swiperPrev) {
              swiperPrev.click();
              swiperPrev.focus();
            }
            break;
            
          case 'ArrowRight':
            e.preventDefault();
            if (swiperNext) {
              swiperNext.click();
              swiperNext.focus();
            }
            break;
        }
      }
    });
  }
  
  // Screen reader announcements helper function
  function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-live-region';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove announcement after it's been read
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
  
  // Keyboard navigation help system
  function initKeyboardHelp() {
    // Add keyboard shortcut help button
    const keyboardHelpBtn = document.createElement('button');
    keyboardHelpBtn.className = 'keyboard-help-button sr-only';
    keyboardHelpBtn.textContent = 'Keyboard navigation help';
    keyboardHelpBtn.setAttribute('aria-label', 'Show keyboard navigation shortcuts');
    
    keyboardHelpBtn.addEventListener('focus', function() {
      keyboardHelpBtn.classList.remove('sr-only');
    });
    
    keyboardHelpBtn.addEventListener('blur', function() {
      keyboardHelpBtn.classList.add('sr-only');
    });
    
    keyboardHelpBtn.addEventListener('click', function() {
      showKeyboardHelp();
    });
    
    document.body.appendChild(keyboardHelpBtn);
    
    // Add global keyboard shortcut to show help
    document.addEventListener('keydown', function(e) {
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        showKeyboardHelp();
      }
    });
  }
  
  function showKeyboardHelp() {
    const helpText = `
Keyboard Navigation Shortcuts:
• Tab: Navigate to next element
• Shift+Tab: Navigate to previous element  
• Enter/Space: Activate buttons and links
• Escape: Close menus and dialogs
• Arrow keys: Navigate within menus and carousels
• Alt+H: Jump to Home section
• Alt+A: Jump to About section  
• Alt+S: Jump to Skills section
• Alt+P: Jump to Portfolio section
• Alt+C: Jump to Contact section
• Alt+T: Scroll to top
• Alt+Left/Right: Navigate portfolio projects
• Shift+?: Show this help
    `.trim();
    
    announceToScreenReader('Keyboard navigation help: ' + helpText.replace(/\n/g, '. '));
  }
  
  // Initialize keyboard help system
  initKeyboardHelp();
}

// Call keyboard navigation initialization
document.addEventListener("DOMContentLoaded", initializeKeyboardNavigation);

/*======================= SKILLS DROPDOWN COMPONENT ======================*/

const skillsContent = document.getElementsByClassName("skills__content"),
  skillsHeader = document.querySelectorAll(".skills__header");

function toggleSkills() {
  const content = this.parentNode;
  const isOpen = content.classList.contains("skills__open");
  const skillTitle = content.querySelector('.skills__title').textContent;
  
  // Close all sections
  for (i = 0; i < skillsContent.length; i++) {
    const section = skillsContent[i];
    const header = section.querySelector('.skills__header');
    
    section.classList.remove("skills__open");
    section.classList.add("skills__close");
    
    // Update ARIA attributes
    if (header) {
      header.setAttribute('aria-expanded', 'false');
    }
    
    // Reset progress bars for closed sections
    const progressBars = section.querySelectorAll(".skills__percentage");
    progressBars.forEach(bar => {
      bar.style.width = '0%';
    });
  }
  
  // Open clicked section if it was closed
  if (!isOpen) {
    content.classList.remove("skills__close");
    content.classList.add("skills__open");
    
    // Update ARIA attributes
    const header = content.querySelector('.skills__header');
    if (header) {
      header.setAttribute('aria-expanded', 'true');
    }
    
    // Trigger progress bar animations with staggered timing
    const progressBars = content.querySelectorAll(".skills__percentage");
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    progressBars.forEach((bar, index) => {
      const width = bar.getAttribute('data-progress') || bar.style.width;
      
      if (prefersReducedMotion) {
        // Instant animation for reduced motion
        bar.style.width = width;
        bar.style.transition = 'none';
      } else {
        // Staggered animation for normal motion
        bar.style.width = '0%';
        bar.style.transition = 'none';
        
        setTimeout(() => {
          bar.style.transition = 'width 1.5s var(--easing-smooth)';
          bar.style.width = width;
        }, 100 + (index * 100));
      }
    });
    
    // Announce state change to screen readers
    setTimeout(() => {
      announceToScreenReader(`${skillTitle} section expanded`);
    }, 100);
  } else {
    // Announce collapse to screen readers
    setTimeout(() => {
      announceToScreenReader(`${skillTitle} section collapsed`);
    }, 100);
  }
}

skillsHeader.forEach((el) => {
  el.addEventListener("click", toggleSkills);
  
  // Enhanced keyboard support
  el.addEventListener("keydown", function(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleSkills.call(this);
    }
    
    // Arrow key navigation between dropdown items
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const headers = Array.from(skillsHeader);
      const currentIndex = headers.indexOf(this);
      let nextIndex;
      
      if (e.key === "ArrowDown") {
        nextIndex = (currentIndex + 1) % headers.length;
      } else {
        nextIndex = (currentIndex - 1 + headers.length) % headers.length;
      }
      
      headers[nextIndex].focus();
      announceToScreenReader(`${headers[nextIndex].querySelector('.skills__title').textContent} skill category`);
    }
  });
});

// Initialize skills dropdown on DOM load
document.addEventListener("DOMContentLoaded", function() {
  // Ensure first section is open by default
  const firstContent = skillsContent[0];
  if (firstContent) {
    firstContent.classList.remove("skills__close");
    firstContent.classList.add("skills__open");
    const firstHeader = firstContent.querySelector('.skills__header');
    if (firstHeader) {
      firstHeader.setAttribute('aria-expanded', 'true');
    }
  }
  
  // Initialize progress bars for open section
  const openSection = document.querySelector('.skills__open');
  if (openSection) {
    const progressBars = openSection.querySelectorAll(".skills__percentage");
    progressBars.forEach(bar => {
      const width = bar.getAttribute('data-progress') || bar.style.width;
      bar.style.width = width;
    });
  }
});

/*============== Qualification Skills ===============*/

/*const tabs = document.querySelectorAll('[data-target]'),
      tabContents = document.querySelectorAll('[data-content]')
tabs.forEach(tab =>{
    tab.addEventListener('click', () =>{
        const target = document.querySelector(tab.dataset.target)
        tabContents.forEach(tabContent =>{
            tabContent.classList.remove('qualification__active')
        })
        target.classList.add('qualification__active')
        tab.forEach(tab =>{
            tab.classList.remove('qualification__active')
        })
        tab.classList.add('qualification__active')
    })
})      
*/

/*======================= Services Modal ===================*/
const modalViews = document.querySelectorAll(".services__modal"),
  modalBtns = document.querySelectorAll(".services__button"),
  modalCloses = document.querySelectorAll(".services__modal-close");

let modal = function (modalClick) {
  modalViews[modalClick].classList.add("active-modal");
};

modalBtns.forEach((modalBtn, i) => {
  modalBtn.addEventListener("click", () => {
    modal(i);
  });
});

modalCloses.forEach((modalClose) => {
  modalClose.addEventListener("click", () => {
    modalViews.forEach((modalView) => {
      modalView.classList.remove("active-modal");
    });
  });
});

/*======================= Portfolio Swiper ===================*/
var swiper = new Swiper(".portfolio__container", {
  cssMode: true,
  loop: true,
  speed: 600,
  effect: "slide",
  grabCursor: true,
  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + "</span>";
    },
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 40,
    },
  },
  on: {
    init: function () {
      updateSwiperAccessibility(this);
    },
    slideChange: function () {
      updateSwiperAccessibility(this);
    },
  },
});

function updateSwiperAccessibility(swiperInstance) {
  const slides = swiperInstance.slides;
  const activeIndex = swiperInstance.activeIndex;
  
  slides.forEach((slide, index) => {
    const isActive = index === activeIndex;
    slide.setAttribute("aria-hidden", !isActive);
    
    const title = slide.querySelector(".portfolio__title")?.textContent || `Project ${index + 1}`;
    slide.setAttribute("aria-label", `Project: ${title}. ${index + 1} of ${slides.length}. ${isActive ? 'Currently viewing' : 'Swipe to view'}`);
  });
}

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 50;
    sectionId = current.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.add("active-link");
    } else {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.remove("active-link");
    }
  });
}

/*==================== SCROLL PROGRESS INDICATOR ====================*/
function updateScrollProgress() {
  const scrollProgress = document.getElementById("scroll-progress");
  if (!scrollProgress) return;
  
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  
  // Ensure we don't divide by zero
  if (documentHeight <= 0) {
    scrollProgress.style.width = "0%";
    return;
  }
  
  const scrollPercentage = Math.min(Math.max((scrollTop / documentHeight) * 100, 0), 100);
  scrollProgress.style.width = `${scrollPercentage}%`;
}

// Combine scroll event listeners for better performance
function handleScroll() {
  updateScrollProgress();
  scrollActive();
  scrollHeader();
  scrollUp();
}

// Use throttling for better performance
let ticking = false;
function optimizedScroll() {
  if (!ticking) {
    requestAnimationFrame(handleScroll);
    ticking = true;
    setTimeout(() => {
      ticking = false;
    }, 16); // ~60fps
  }
}

window.addEventListener("scroll", optimizedScroll);

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  updateScrollProgress();
});

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader() {
  const nav = document.getElementById("header");
  // When the scroll is greater than 80 viewport height, add the scroll-header class to the header tag
  if (this.scrollY >= 80) nav.classList.add("scroll-header");
  else nav.classList.remove("scroll-header");
}

/*==================== SHOW SCROLL up ====================*/
function scrollUp() {
  const scrollUp = document.getElementById("scroll-up");
  // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
  if (this.scrollY >= 560) scrollUp.classList.add("show-scroll");
  else scrollUp.classList.remove("show-scroll");
}

/*==================== DARK LIGHT THEME ====================*/
const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme = "uil-sun";

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme) ? "dark" : "light";
const getCurrentIcon = () =>
  themeButton.classList.contains(iconTheme) ? "uil-moon" : "uil-sun";

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
    darkTheme,
  );
  themeButton.classList[selectedIcon === "uil-moon" ? "add" : "remove"](
    iconTheme,
  );
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener("click", () => {
  // Add or remove the dark / icon theme
  document.body.classList.toggle(darkTheme);
  themeButton.classList.toggle(iconTheme);
  // We save the theme and the current icon that the user chose
  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
});

/*==================== PARALLAX SCROLL FOR FLOATING SHAPES ====================*/
function initParallaxShapes() {
  const parallaxWrappers = document.querySelectorAll('.shape-parallax[data-parallax]');
  if (!parallaxWrappers.length) return;

  const parallaxSpeeds = {
    'slow': 0.3,
    'medium': 0.5,
    'fast': 0.7
  };

  function updateParallax() {
    const scrollY = window.pageYOffset;
    
    parallaxWrappers.forEach(wrapper => {
      const speed = parallaxSpeeds[wrapper.dataset.parallax] || 0.5;
      const yOffset = scrollY * speed;
      wrapper.style.transform = `translateY(${yOffset}px)`;
    });
  }

  // Use throttling for better performance
  let parallaxTicking = false;
  function optimizedParallax() {
    if (!parallaxTicking) {
      requestAnimationFrame(() => {
        updateParallax();
        parallaxTicking = false;
      });
      parallaxTicking = true;
    }
  }

  window.addEventListener('scroll', optimizedParallax, { passive: true });
  
  // Initial update
  updateParallax();
}

// Initialize parallax shapes on DOM load
document.addEventListener('DOMContentLoaded', initParallaxShapes);

/*==================== ANIMATED COUNTERS ====================*/
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('.about__info-item[data-counter]');
  if (!counterElements.length) return;

  const countersAnimated = new Set();

  function animateCounter(element) {
    if (countersAnimated.has(element)) return;
    countersAnimated.add(element);

    const target = parseFloat(element.dataset.counter) || 0;
    const suffix = element.dataset.suffix || '';
    const titleElement = element.querySelector('.about__info-title');
    if (!titleElement) return;

    const isDecimal = target % 1 !== 0;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const startValue = 0;

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (target - startValue) * easeOut;
      
      if (isDecimal) {
        titleElement.textContent = currentValue.toFixed(2) + suffix;
      } else {
        titleElement.textContent = Math.floor(currentValue) + suffix;
      }
      
      // Add pulse animation at the end
      if (progress === 1) {
        titleElement.classList.add('counting');
        setTimeout(() => titleElement.classList.remove('counting'), 500);
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  // Intersection Observer for scroll-triggered animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counterElements.forEach(counter => {
    counterObserver.observe(counter);
  });
}

// Initialize animated counters on DOM load
document.addEventListener('DOMContentLoaded', initAnimatedCounters);

/*==================== STAGGERED TEXT ANIMATIONS ====================*/
function initTextAnimations() {
  const heroElements = [
    { selector: '.home__social', delay: 100 },
    { selector: '.home__img', delay: 300 },
    { selector: '.home__title', delay: 400 },
    { selector: '.home__subtitle', delay: 600 },
    { selector: '.home__description', delay: 800 },
    { selector: '.home__data .button', delay: 1000 }
  ];

  heroElements.forEach(item => {
    const element = document.querySelector(item.selector);
    if (element) {
      element.style.opacity = '0';
      element.style.animation = `textReveal 0.8s var(--easing-smooth) ${item.delay}ms forwards`;
    }
  });
}

// Initialize text animations on DOM load
document.addEventListener('DOMContentLoaded', initTextAnimations);

/*==================== SCROLL REVEAL ANIMATIONS ====================*/
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!revealElements.length) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

// Initialize scroll reveal on DOM load
document.addEventListener('DOMContentLoaded', initScrollReveal);

/*==================== MOTION PREFERENCE DETECTION ====================*/
function initMotionPreferenceDetection() {
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  function handleMotionPreference(e) {
    if (e.matches) {
      document.body.classList.add('reduced-motion');
      announceToScreenReader('Reduced motion preference detected. Animations have been minimized.');
    } else {
      document.body.classList.remove('reduced-motion');
      announceToScreenReader('Motion preference updated. Animations are now enabled.');
    }
  }

  // Initial check
  handleMotionPreference(motionQuery);
  
  // Listen for changes
  motionQuery.addEventListener('change', handleMotionPreference);
}

// Initialize motion preference detection on DOM load
document.addEventListener('DOMContentLoaded', initMotionPreferenceDetection);
