(() => {
  'use strict';

  // script.js

// Get the toggle button and current theme from localStorage
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'light'; // Default to 'light' if no preference

// Apply the theme on page load
if (currentTheme === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = '☀️';  // Change icon to sun for dark mode
} else {
  document.body.classList.remove('dark');
  themeToggle.textContent = '🌙';  // Change icon to moon for light mode
}

// Toggle theme when the button is clicked
themeToggle.addEventListener('click', () => {
  const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';

  // Toggle the dark class on the body element
  document.body.classList.toggle('dark');
  
  // Store the preference in localStorage
  localStorage.setItem('theme', newTheme);

  // Update the button icon based on the theme
  themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
});

  

  // Variables & elements
  const thumbnails = document.querySelectorAll('.thumbnail');
  const mainImage = document.getElementById('mainImage');
  const mainImageContainer = document.getElementById('mainImageContainer');

  // Color elements
  const colorSwatches = document.querySelectorAll('.color-swatch');
  let selectedColor = localStorage.getItem('selectedColor') || 'red';

  // Size select
  const sizeSelect = document.getElementById('sizeSelect');
  if (localStorage.getItem('selectedSize')) {
    sizeSelect.value = localStorage.getItem('selectedSize');
  }

  // Size Chart modal vars
  const sizeChartBtn = document.getElementById('sizeChartBtn');
  const sizeChartModal = document.getElementById('sizeChartModal');
  const sizeChartCloseBtn = document.getElementById('sizeChartCloseBtn');

  // Compare colors modal vars
  const compareColorsBtn = document.getElementById('compareColorsBtn');
  const colorCompareModal = document.getElementById('colorCompareModal');
  const colorCompareCloseBtn = document.getElementById('colorCompareCloseBtn');
  const colorCompareContainer = document.getElementById('colorCompareContainer');
  const colorCompareConfirmBtn = document.getElementById('colorCompareConfirmBtn');
  const colorCompareResult = document.getElementById('colorCompareResult');

  // Tabs elements
  const tabs = document.querySelectorAll('.tab');
  const tabPanes = document.querySelectorAll('.tab-pane');

  // Bundle button element
  const addBundleBtn = document.getElementById('addBundleBtn');

  // Helpers
  // Change main image and active thumbnail
  function changeImage(newSrc) {
    mainImage.style.transform = 'scale(0.95)';
    setTimeout(() => {
      mainImage.src = newSrc;
      mainImage.style.transform = 'scale(1)';
    }, 150);

    thumbnails.forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-img') === newSrc);
    });
  }

  // Thumbnail click and keyboard navigation
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      changeImage(thumb.getAttribute('data-img'));
    });
    thumb.addEventListener('keydown', e => {
      // Support Enter or Space keys for selection
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        changeImage(thumb.getAttribute('data-img'));
        thumb.focus();
      }
    });
  });

  // Select color swatch helper function & visual update
  function selectColor(color) {
    selectedColor = color;
    localStorage.setItem('selectedColor', color);
    colorSwatches.forEach(swatch => {
      const isSelected = swatch.dataset.color === color;
      swatch.classList.toggle('selected', isSelected);
      swatch.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });

    // Update product details or label if needed (e.g., update price or main image)
    // For demo, we update main image if color matches.
    // This demo uses imaginary URLs to simulate color changes:
    const colorImages = {
      red: "https://via.placeholder.com/480x480/d32f2f?text=Red+Color",
      blue: "https://via.placeholder.com/480x480/1976d2?text=Blue+Color",
      green: "https://via.placeholder.com/480x480/388e3c?text=Green+Color",
      black: "https://via.placeholder.com/480x480/000000/fff?text=Black+Color"
    };
    if (colorImages[color]) {
      changeImage(colorImages[color]);
    }
  }

  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      selectColor(swatch.dataset.color);
    });
    swatch.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectColor(swatch.dataset.color);
        swatch.focus();
      }
    });
  });

  // Initialize with last selected color on load
  selectColor(selectedColor);

  // Save size on change + persist localStorage
  sizeSelect.addEventListener('change', () => {
    localStorage.setItem('selectedSize', sizeSelect.value);
  });

  // Modal utility functions
  function openModal(modal) {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    modal.focus();
    // Trap focus inside modal
    trapFocus(modal);
  }
  function closeModal(modal) {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    releaseFocusTrap();
  }

  // Trap focus inside modal for accessibility
  let focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), \
    textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
  let focusTrapElement = null;
  let firstTabStop = null;
  let lastTabStop = null;

  function trapFocus(element) {
    focusTrapElement = element;
    let focusableElements = element.querySelectorAll(focusableElementsString);
    focusableElements = Array.prototype.slice.call(focusableElements);
    if (focusableElements.length === 0) return;
    firstTabStop = focusableElements[0];
    lastTabStop = focusableElements[focusableElements.length - 1];
    element.addEventListener('keydown', trapTabKey);
    firstTabStop.focus();
  }

  function releaseFocusTrap() {
    if (!focusTrapElement) return;
    focusTrapElement.removeEventListener('keydown', trapTabKey);
    focusTrapElement = null;
    firstTabStop = null;
    lastTabStop = null;
  }

  function trapTabKey(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstTabStop) {
          e.preventDefault();
          lastTabStop.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastTabStop) {
          e.preventDefault();
          firstTabStop.focus();
        }
      }
    }
    if (e.key === 'Escape') {
      // Escape closes modal
      closeModal(focusTrapElement);
    }
  }

  // Size chart modal open/close handlers
  sizeChartBtn.addEventListener('click', () => openModal(sizeChartModal));
  sizeChartCloseBtn.addEventListener('click', () => closeModal(sizeChartModal));
  sizeChartModal.addEventListener('click', (e) => {
    if (e.target === sizeChartModal) closeModal(sizeChartModal);
  });

  // Color compare modal logic

  // Colors for compare modal - same as main swatches
  const compareColors = ['red', 'blue', 'green', 'black'];
  
  // Render color swatches in compare modal
  function renderColorCompareSwatches() {
    colorCompareContainer.innerHTML = '';
    compareColors.forEach(color => {
      const btn = document.createElement('button');
      btn.className = 'color-compare-swatch ' + color;
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', 'Select ' + color + ' color to compare');
      btn.dataset.color = color;
      btn.type = 'button';
      btn.addEventListener('click', () => {
        const selected = btn.getAttribute('aria-pressed') === 'true';
        btn.setAttribute('aria-pressed', selected ? 'false' : 'true');
        btn.classList.toggle('selected', !selected);
      });
      colorCompareContainer.appendChild(btn);
    });
  }
  renderColorCompareSwatches();

  // Open close handlers for color compare modal
  compareColorsBtn.addEventListener('click', () => {
    openModal(colorCompareModal);
    colorCompareResult.innerHTML = '';
    // reset selections
    colorCompareContainer.querySelectorAll('button').forEach(btn => {
      btn.setAttribute('aria-pressed', 'false');
      btn.classList.remove('selected');
    });
  });
  colorCompareCloseBtn.addEventListener('click', () => closeModal(colorCompareModal));
  colorCompareModal.addEventListener('click', (e) => {
    if (e.target === colorCompareModal) closeModal(colorCompareModal);
  });

  // Confirm compare colors and display side by side swatches
  colorCompareConfirmBtn.addEventListener('click', () => {
    const selectedButtons = colorCompareContainer.querySelectorAll('button[aria-pressed="true"]');
    if (selectedButtons.length < 2) {
      colorCompareResult.innerHTML = '<p style="color:#e23428; font-weight: 600;">Please select at least two colors to compare.</p>';
      return;
    }
    const selectedColors = Array.from(selectedButtons).map(btn => btn.dataset.color);
    let html = '<div style="display:flex; gap:10px; flex-wrap: wrap;">';
    selectedColors.forEach(color => {
      html += `<div style="text-align:center;">
        <div style="width:60px; height:60px; border-radius:50%; background-color:${color === 'black' ? '#000' : color}; 
        border: 2px solid #666;"></div>
        <div style="margin-top:0.5rem; font-weight:600;">${color.charAt(0).toUpperCase() + color.slice(1)}</div>
        </div>`;
    });
    html += '</div>';
    colorCompareResult.innerHTML = html;
  });

  // Tabs logic (fixed)
  tabs.forEach(tab => {
    tab.addEventListener('click', e => {
      e.preventDefault();
      activateTab(tab);
    });
  });

  function activateTab(selectedTab) {
    tabs.forEach(tab => {
      const isActive = tab === selectedTab;
      tab.classList.toggle('active', isActive);
    });
    tabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === selectedTab.getAttribute('data-tab'));
    });
  }
  // Initialize first tab active on page load
  activateTab(tabs[0]);

  // Main image zoom toggle
  mainImageContainer.addEventListener('click', () => {
    if (mainImageContainer.classList.contains('zoomed')) {
      mainImageContainer.classList.remove('zoomed');
    } else {
      mainImageContainer.classList.add('zoomed');
    }
  });
  // Escape best practice to close zoom
  mainImageContainer.setAttribute('tabindex', '0');
  mainImageContainer.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mainImageContainer.classList.contains('zoomed')) {
      mainImageContainer.classList.remove('zoomed');
    }
  });

  // Add to cart button demo interaction
  document.getElementById('addToCartBtn').addEventListener('click', () => {
    alert(`Added to cart: Color: ${selectedColor}, Size: ${sizeSelect.value}.`);
  });

  // Add bundle to cart button demo interaction
  addBundleBtn.addEventListener('click', () => {
    alert('Added bundle products to cart (Awesome Product + Product A).');
  });

  // Add to cart buttons inside pair well with demo
  document.querySelectorAll('.pair-well-with .product-card button').forEach(button => {
    button.addEventListener('click', () => alert('Added complementary product to cart.'));
  });

  // Keyboard support for modal closing by ESC globally
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      [sizeChartModal, colorCompareModal].forEach(modal => {
        if (modal.classList.contains('show')) {
          closeModal(modal);
        }
      });
    }
  });

})();


