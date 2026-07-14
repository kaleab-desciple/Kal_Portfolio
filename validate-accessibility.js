/**
 * Accessibility Validation Script for Portfolio UI Redesign
 * Tests keyboard navigation and WCAG compliance
 */

const validationTests = {
  // Test 1: Check for proper ARIA labels
  ariaLabels: function() {
    const results = [];
    
    // Check interactive elements have labels
    const interactiveElements = document.querySelectorAll('button, a, input, select, [role="button"]');
    interactiveElements.forEach((element, index) => {
      const hasLabel = element.hasAttribute('aria-label') || 
                      element.hasAttribute('aria-labelledby') ||
                      element.textContent.trim() !== '';
      
      if (!hasLabel) {
        results.push({
          type: 'error',
          element: element.tagName.toLowerCase(),
          message: `Interactive element at index ${index} missing accessible label`,
          element: element
        });
      }
    });
    
    // Check regions have labels
    const regions = document.querySelectorAll('[role="region"], [role="navigation"], [role="main"]');
    regions.forEach((region, index) => {
      const hasLabel = region.hasAttribute('aria-label') || region.hasAttribute('aria-labelledby');
      
      if (!hasLabel) {
        results.push({
          type: 'warning',
          element: 'region',
          message: `Region at index ${index} should have an accessible label`,
          element: region
        });
      }
    });
    
    return results;
  },

  // Test 2: Check focus indicators
  focusIndicators: function() {
    const results = [];
    const focusableElements = document.querySelectorAll('button, a, input, select, [tabindex="0"]');
    
    focusableElements.forEach((element, index) => {
      // Temporarily focus to check styles
      element.focus();
      const computedStyle = window.getComputedStyle(element);
      
      const hasOutline = computedStyle.outline !== 'none' && computedStyle.outline !== '';
      const hasBoxShadow = computedStyle.boxShadow !== 'none' && computedStyle.boxShadow !== '';
      const hasBorder = computedStyle.borderWidth !== '0px' && computedStyle.borderStyle !== 'none';
      
      if (!hasOutline && !hasBoxShadow && !hasBorder) {
        results.push({
          type: 'error',
          element: element.tagName.toLowerCase(),
          message: `Element at index ${index} has no visible focus indicator`,
          element: element
        });
      }
      
      element.blur(); // Remove focus
    });
    
    return results;
  },

  // Test 3: Check keyboard navigation structure
  keyboardNavigation: function() {
    const results = [];
    
    // Check for skip links
    const skipLink = document.querySelector('.skip-link');
    if (!skipLink) {
      results.push({
        type: 'error',
        element: 'skip-link',
        message: 'Missing skip link for keyboard navigation',
        element: null
      });
    }
    
    // Check tabindex usage
    const negativeTabindex = document.querySelectorAll('[tabindex="-1"]:not([role="tabpanel"]):not([aria-hidden="true"])');
    negativeTabindex.forEach((element, index) => {
      results.push({
        type: 'warning',
        element: element.tagName.toLowerCase(),
        message: `Element with tabindex="-1" may not be keyboard accessible`,
        element: element
      });
    });
    
    // Check for positive tabindex (anti-pattern)
    const positiveTabindex = document.querySelectorAll('[tabindex]:not([tabindex="0"]):not([tabindex="-1"])');
    positiveTabindex.forEach((element, index) => {
      const tabindexValue = element.getAttribute('tabindex');
      if (parseInt(tabindexValue) > 0) {
        results.push({
          type: 'error',
          element: element.tagName.toLowerCase(),
          message: `Positive tabindex (${tabindexValue}) creates unpredictable tab order`,
          element: element
        });
      }
    });
    
    return results;
  },

  // Test 4: Check semantic HTML structure
  semanticStructure: function() {
    const results = [];
    
    // Check heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    
    headings.forEach((heading, index) => {
      const currentLevel = parseInt(heading.tagName.charAt(1));
      
      if (index === 0 && currentLevel !== 1) {
        results.push({
          type: 'warning',
          element: heading.tagName.toLowerCase(),
          message: 'First heading should be h1',
          element: heading
        });
      }
      
      if (currentLevel > previousLevel + 1) {
        results.push({
          type: 'error',
          element: heading.tagName.toLowerCase(),
          message: `Heading level jumps from h${previousLevel} to h${currentLevel}`,
          element: heading
        });
      }
      
      previousLevel = currentLevel;
    });
    
    // Check for proper landmarks
    const landmarks = {
      main: document.querySelectorAll('main, [role="main"]').length,
      navigation: document.querySelectorAll('nav, [role="navigation"]').length,
      banner: document.querySelectorAll('header[role="banner"], [role="banner"]').length,
      contentinfo: document.querySelectorAll('footer[role="contentinfo"], [role="contentinfo"]').length
    };
    
    if (landmarks.main !== 1) {
      results.push({
        type: 'error',
        element: 'main',
        message: `Should have exactly 1 main landmark, found ${landmarks.main}`,
        element: null
      });
    }
    
    if (landmarks.navigation === 0) {
      results.push({
        type: 'error',
        element: 'navigation',
        message: 'Should have at least 1 navigation landmark',
        element: null
      });
    }
    
    return results;
  },

  // Test 5: Check color contrast (basic check)
  colorContrast: function() {
    const results = [];
    
    // This is a simplified check - real contrast testing requires complex calculations
    const textElements = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6');
    
    textElements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element);
      const color = computedStyle.color;
      const backgroundColor = computedStyle.backgroundColor;
      
      // Basic check for same color text and background (obvious fail)
      if (color === backgroundColor && color !== 'rgba(0, 0, 0, 0)') {
        results.push({
          type: 'error',
          element: element.tagName.toLowerCase(),
          message: 'Text color same as background color',
          element: element
        });
      }
      
      // Check for transparent text
      if (color.includes('rgba') && color.includes(', 0)')) {
        results.push({
          type: 'warning',
          element: element.tagName.toLowerCase(),
          message: 'Text may be invisible (transparent)',
          element: element
        });
      }
    });
    
    return results;
  },

  // Test 6: Check form accessibility
  formAccessibility: function() {
    const results = [];
    
    // Check form labels
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach((input, index) => {
      const hasLabel = input.labels && input.labels.length > 0 ||
                      input.hasAttribute('aria-label') ||
                      input.hasAttribute('aria-labelledby');
      
      if (!hasLabel) {
        results.push({
          type: 'error',
          element: input.tagName.toLowerCase(),
          message: `Form input at index ${index} missing label`,
          element: input
        });
      }
      
      // Check required fields have aria-required
      if (input.hasAttribute('required') && !input.hasAttribute('aria-required')) {
        results.push({
          type: 'warning',
          element: input.tagName.toLowerCase(),
          message: 'Required field should have aria-required="true"',
          element: input
        });
      }
    });
    
    return results;
  }
};

// Function to run all tests
function runAccessibilityValidation() {
  console.log('🚀 Running Accessibility Validation Tests...\n');
  
  const allResults = {};
  let totalErrors = 0;
  let totalWarnings = 0;
  
  Object.keys(validationTests).forEach(testName => {
    console.log(`Running ${testName}...`);
    const results = validationTests[testName]();
    allResults[testName] = results;
    
    const errors = results.filter(r => r.type === 'error').length;
    const warnings = results.filter(r => r.type === 'warning').length;
    
    totalErrors += errors;
    totalWarnings += warnings;
    
    if (results.length === 0) {
      console.log(`✅ ${testName}: PASSED`);
    } else {
      console.log(`⚠️  ${testName}: ${errors} errors, ${warnings} warnings`);
      results.forEach(result => {
        const icon = result.type === 'error' ? '❌' : '⚠️';
        console.log(`  ${icon} ${result.message}`);
        if (result.element) {
          console.log(`     Element:`, result.element);
        }
      });
    }
    console.log('');
  });
  
  // Summary
  console.log('📊 VALIDATION SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total Errors: ${totalErrors}`);
  console.log(`Total Warnings: ${totalWarnings}`);
  
  if (totalErrors === 0) {
    console.log('✅ No critical accessibility issues found!');
  } else {
    console.log('❌ Critical accessibility issues need attention.');
  }
  
  if (totalWarnings > 0) {
    console.log(`⚠️  ${totalWarnings} potential improvements identified.`);
  }
  
  return {
    results: allResults,
    summary: {
      errors: totalErrors,
      warnings: totalWarnings,
      passed: totalErrors === 0
    }
  };
}

// Export for use in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validationTests, runAccessibilityValidation };
} else if (typeof window !== 'undefined') {
  window.AccessibilityValidator = { validationTests, runAccessibilityValidation };
}