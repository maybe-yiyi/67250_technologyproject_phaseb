var now = new Date();
var hour = now.getHours();

function greeting(x) {
    var str;
    if (x < 5) {
        str = "Good Night";
    } else if (x < 12) {
        str = "Good Morning";
    } else if (x < 18) {
        str = "Good Afternoon";
    } else if (x < 20) {
        str = "Good Evening";
    } else {
        str = "Good Night";
    }
    document.getElementById("greeting").innerHTML = str + document.getElementById("greeting").innerHTML;
}
if (document.getElementById("greeting")) greeting(hour);

function addYear() {
    document.getElementById("copyYear").innerHTML = "&copy; " + now.getFullYear() + document.getElementById("copyYear").innerHTML;
}

function activeNavigation() {
    const navLinks = document.querySelectorAll('header a');
    navLinks.forEach(link => {
        if (window.location.href === link.href) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });
}

activeNavigation();

(function initSlideshow() {
    var track = document.querySelector('.slideshow-track');
    if (!track) return;
    var slides = track.querySelectorAll('.slide');
    var dots = document.querySelectorAll('.dot');
    var current = 0;
    var timer;

    function goTo(n) {
        slides[current].classList.remove('active');
        dots[current] && dots[current].classList.remove('active');
        current = (n + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current] && dots[current].classList.add('active');
    }

    function start() { timer = setInterval(function() { goTo(current + 1); }, 4000); }
    function stop() { clearInterval(timer); }

    var prevBtn = document.querySelector('.slide-prev');
    var nextBtn = document.querySelector('.slide-next');
    if (prevBtn) prevBtn.addEventListener('click', function() { stop(); goTo(current - 1); start(); });
    if (nextBtn) nextBtn.addEventListener('click', function() { stop(); goTo(current + 1); start(); });

    dots.forEach(function(dot, i) {
        dot.addEventListener('click', function() { stop(); goTo(i); start(); });
    });

    goTo(0);
    start();
})();

/* ── Checkout form (checkout.html) ────────────────────────────────────── */
var TICKET_PRICES = { general: 18, student: 10, member: 14 };

function getQty(type) {
    var el = document.getElementById('qty-' + type);
    if (!el) return 0;
    var v = parseInt(el.value, 10);
    return (isNaN(v) || v < 0) ? 0 : v;
}

function updateTableTotals() {
    var grand = 0;
    ['general', 'student', 'member'].forEach(function(type) {
        var qty = getQty(type);
        var sub = qty * TICKET_PRICES[type];
        grand += sub;
        var subEl = document.getElementById('sub-' + type);
        if (subEl) subEl.textContent = '$' + sub;
    });
    var grandEl = document.getElementById('grand-total');
    if (grandEl) grandEl.textContent = '$' + grand;
}

function openCheckoutForm() {
    var general = getQty('general');
    var student = getQty('student');
    var member = getQty('member');
    var total = general + student + member;

    var noteEl = document.getElementById('qty-note');
    if (total === 0) {
        if (noteEl) noteEl.textContent = 'Please select at least one ticket before proceeding.';
        return;
    }
    if (noteEl) noteEl.textContent = '';

    var section = document.getElementById('checkout-form-section');
    if (!section) return;
    section.classList.remove('hidden');
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(function() {
        var heading = section.querySelector('.form-heading');
        if (heading) {
            heading.setAttribute('tabindex', '-1');
            heading.focus();
        }
    }, 300);
}

function showError(id, msg) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.classList.add('visible');
}

function clearError(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = '';
    el.classList.remove('visible');
}

function validateCheckoutForm(event) {
    event.preventDefault();
    var valid = true;

    // Visit date
    var dateInput = document.getElementById('visit-date');
    var dateVal = dateInput ? dateInput.value : '';
    clearError('date-error');
    if (!dateVal) {
        showError('date-error', 'Please select a visit date.');
        valid = false;
    } else {
        var selectedDate = new Date(dateVal + 'T00:00:00');
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            showError('date-error', 'Please select a date in the future.');
            valid = false;
        }
    }

    // Email
    var emailInput = document.getElementById('email');
    var emailVal = emailInput ? emailInput.value.trim() : '';
    clearError('email-error');
    if (!emailVal) {
        showError('email-error', 'Please enter your email address.');
        valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        showError('email-error', 'Please enter a valid email address (e.g. you@example.com).');
        valid = false;
    }

    // Zip code (optional — if filled, must be exactly 5 digits)
    var zipInput = document.getElementById('zip');
    var zipVal = zipInput ? zipInput.value.trim() : '';
    clearError('zip-error');
    if (zipVal && !/^\d{5}$/.test(zipVal)) {
        showError('zip-error', 'Zip code must be exactly 5 digits.');
        valid = false;
    }

    if (!valid) {
        var firstError = document.querySelector('.error-msg.visible');
        if (firstError) {
            var parent = firstError.closest('.form-group');
            if (parent) {
                var field = parent.querySelector('input, select');
                if (field) field.focus();
            }
        }
        return;
    }

    // Build order params from table quantities
    var qtyGeneral = getQty('general');
    var qtyStudent = getQty('student');
    var qtyMember = getQty('member');
    var grandTotal = (qtyGeneral * TICKET_PRICES.general)
        + (qtyStudent * TICKET_PRICES.student)
        + (qtyMember * TICKET_PRICES.member);
    var mailingChecked = document.getElementById('mailing-list') && document.getElementById('mailing-list').checked;

    var params = new URLSearchParams({
        date: dateVal,
        qtyGeneral: qtyGeneral,
        qtyStudent: qtyStudent,
        qtyMember: qtyMember,
        email: emailVal,
        total: grandTotal.toFixed(2),
        mailing: mailingChecked ? '1' : '0'
    });

    window.location.href = 'confirmation.html?' + params.toString();
}

(function initCheckout() {
    var form = document.getElementById('checkout-form');
    if (!form) return;

    // Set min date on the date picker to today
    var dateInput = document.getElementById('visit-date');
    if (dateInput) {
        var today = new Date();
        var yyyy = today.getFullYear();
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var dd = String(today.getDate()).padStart(2, '0');
        dateInput.min = yyyy + '-' + mm + '-' + dd;
    }

    // Live subtotal updates from table quantity inputs
    ['general', 'student', 'member'].forEach(function(type) {
        var el = document.getElementById('qty-' + type);
        if (el) el.addEventListener('input', updateTableTotals);
    });

    form.addEventListener('submit', validateCheckoutForm);
})();

function loadConfirmation() {
    var params = new URLSearchParams(window.location.search);
    if (!params.has('date')) return;

    var dateVal = params.get('date') || '';
    var qtyGeneral = parseInt(params.get('qtyGeneral') || '0', 10);
    var qtyStudent = parseInt(params.get('qtyStudent') || '0', 10);
    var qtyMember = parseInt(params.get('qtyMember') || '0', 10);
    var email = params.get('email') || '';
    var total = params.get('total') || '';
    var mailing = params.get('mailing') === '1';

    // Format date for display
    var displayDate = dateVal;
    if (dateVal) {
        var parts = dateVal.split('-');
        if (parts.length === 3) {
            var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            displayDate = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }
    }

    function setText(id, val) {
        var el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    setText('conf-date', displayDate);
    setText('conf-email', email);
    setText('conf-total', '$' + parseFloat(total).toFixed(2));

    // Build ticket breakdown lines
    var PRICES = { general: 18, student: 10, member: 14 };
    var lines = [];
    if (qtyGeneral > 0) lines.push(qtyGeneral + ' × General @ $' + PRICES.general + ' = $' + (qtyGeneral * PRICES.general));
    if (qtyStudent > 0) lines.push(qtyStudent + ' × Student @ $' + PRICES.student + ' = $' + (qtyStudent * PRICES.student));
    if (qtyMember > 0) lines.push(qtyMember + ' × Member @ $' + PRICES.member + ' = $' + (qtyMember * PRICES.member));

    var breakdownEl = document.getElementById('conf-breakdown');
    if (breakdownEl) {
        breakdownEl.innerHTML = lines.map(function(l) { return '<li>' + l + '</li>'; }).join('');
    }

    var mailingRow = document.getElementById('mailing-row');
    if (mailingRow && mailing) mailingRow.style.display = '';
}
