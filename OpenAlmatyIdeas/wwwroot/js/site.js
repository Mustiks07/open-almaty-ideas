// Open Almaty Ideas — основные скрипты

(function () {
    'use strict';

    // ===== Loading states on form submission =====
    document.addEventListener('submit', function (e) {
        var form = e.target;
        if (!form || form.tagName !== 'FORM') return;

        // Skip forms that should not show loading (e.g. language switcher, filter)
        if (form.classList.contains('no-loading')) return;

        var submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        if (!submitBtn) return;

        // Prevent double submission
        if (submitBtn.classList.contains('btn-loading')) {
            e.preventDefault();
            return;
        }

        // Add loading state
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;

        // Wrap text content for visibility toggle
        if (!submitBtn.querySelector('.btn-text')) {
            var text = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="btn-text">' + text + '</span>';
        }
    });

    // ===== Smooth scroll for anchor links =====
    document.addEventListener('click', function (e) {
        var link = e.target.closest('a[href^="#"]');
        if (!link) return;

        var target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // ===== Confirm dialogs localization safety =====
    // Already handled in Razor with onclick="return confirm()"

})();
