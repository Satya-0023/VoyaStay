// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// Mobile Filters Modal Toggle
function setupMobileFiltersDropdown() {
  const btn = document.getElementById('mobileFiltersBtn');
  const dropdown = document.getElementById('mobileFiltersDropdown');
  const overlay = document.getElementById('mobileFiltersOverlay');
  const closeBtn = document.getElementById('closeMobileFilters');
  if (!btn || !dropdown || !overlay || !closeBtn) return;

  function openModal() {
    dropdown.style.display = 'block';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }
  function closeModal() {
    dropdown.style.display = 'none';
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (dropdown.style.display === 'block') {
      closeModal();
    } else {
      openModal();
    }
  });
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // Hide modal on resize
  window.addEventListener('resize', function () {
    if (window.innerWidth > 600) {
      closeModal();
    }
  });
}

document.addEventListener('DOMContentLoaded', setupMobileFiltersDropdown);

// --- After-tax toggle sync for desktop and mobile ---
function setupTaxToggleSync() {
  const desktopToggle = document.getElementById('includeTax');
  const mobileToggle = document.getElementById('includeTaxMobile');
  function syncToggles(source, target) {
    if (target && source) {
      target.checked = source.checked;
      toggleTax();
    }
  }
  if (desktopToggle && mobileToggle) {
    desktopToggle.addEventListener('change', () => syncToggles(desktopToggle, mobileToggle));
    mobileToggle.addEventListener('change', () => syncToggles(mobileToggle, desktopToggle));
  }
}
document.addEventListener('DOMContentLoaded', setupTaxToggleSync);