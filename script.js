'use strict';

const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');

navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
});

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

const updateHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
    backToTop.classList.toggle('show', window.scrollY > 600);
};
window.addEventListener('scroll', updateHeader);
updateHeader();

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const counters = document.querySelectorAll('.counter');
let countersStarted = false;
const animateCounters = () => {
    counters.forEach((counter) => {
        const target = Number(counter.dataset.target);
        const duration = 1600;
        const start = performance.now();
        const tick = (time) => {
            const progress = Math.min((time - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(target * eased).toLocaleString();
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    });
};
const statsObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting) && !countersStarted) {
        countersStarted = true;
        animateCounters();
    }
}, { threshold: 0.35 });
statsObserver.observe(document.getElementById('stats'));

const testimonials = document.querySelectorAll('.testimonial');
const sliderButtons = document.querySelectorAll('.slider-btn');
let activeTestimonial = 0;
const showTestimonial = (index) => {
    testimonials[activeTestimonial].classList.remove('active');
    activeTestimonial = (index + testimonials.length) % testimonials.length;
    testimonials[activeTestimonial].classList.add('active');
};
sliderButtons.forEach((button) => {
    button.addEventListener('click', () => {
        showTestimonial(activeTestimonial + (button.dataset.slide === 'next' ? 1 : -1));
    });
});
setInterval(() => showTestimonial(activeTestimonial + 1), 6500);

const sections = document.querySelectorAll('main section[id]');
const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
        }
    });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
sections.forEach((section) => activeObserver.observe(section));

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const validators = {
    name: (value) => value.trim().length >= 2 || 'Please enter your full name.',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Please enter a valid email address.',
    phone: (value) => value.replace(/\D/g, '').length >= 10 || 'Please enter a valid phone number.',
    area: (value) => Boolean(value) || 'Please select a practice area.',
    message: (value) => value.trim().length >= 15 || 'Please share a brief message of at least 15 characters.'
};

const setFieldState = (field, message) => {
    const row = field.closest('.form-row');
    row.classList.toggle('error', Boolean(message));
    row.querySelector('small').textContent = message || '';
};

contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formSuccess.style.display = 'none';
    let valid = true;
    Object.keys(validators).forEach((name) => {
        const field = contactForm.elements[name];
        const result = validators[name](field.value);
        const message = result === true ? '' : result;
        if (message) valid = false;
        setFieldState(field, message);
    });
    if (!valid) return;
    contactForm.reset();
    formSuccess.textContent = 'Thank you. Your consultation request has been received, and a Lexora Law representative will contact you shortly.';
    formSuccess.style.display = 'block';
});

contactForm.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('input', () => setFieldState(field, ''));
});
