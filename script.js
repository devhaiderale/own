const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            lenis.scrollTo(targetElement);
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const cursorDot = document.createElement("div");
    cursorDot.className = "cursor-dot";
    const cursorOutline = document.createElement("div");
    cursorOutline.className = "cursor-outline";
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    window.addEventListener("mousemove", (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    const interactables = document.querySelectorAll("a, button, .faq-btn, .project-card");
    interactables.forEach(el => {
        el.addEventListener("mouseenter", () => {
            document.body.classList.add("hovering");
        });
        el.addEventListener("mouseleave", () => {
            document.body.classList.remove("hovering");
        });
    });
});

window.addEventListener('load', () => {
    const loader = document.getElementById('preloader');
    const content = document.getElementById('wrapper');

    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 2000);
});

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    document.querySelectorAll('.project-card, .service-card, .testi-card, .glass-card').forEach((el, index) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
});

function setupTabs(btnSelector, panelSelector) {
    const tabBtns = document.querySelectorAll(btnSelector);
    const panels = document.querySelectorAll(panelSelector);

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            panels.forEach(panel => panel.classList.remove('active'));

            const targetId = btn.getAttribute('data-tab');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
                setTimeout(() => lenis.resize(), 100);
            }
        });
    });
}

setupTabs('.tab-btn', '.work-panel');
setupTabs('.pricing-tab-btn', '.pricing-panel');

document.addEventListener("DOMContentLoaded", () => {
    const faqBtns = document.querySelectorAll('.faq-btn');
    const terminalBody = document.getElementById('terminalOutput');
    let isTyping = false;

    if (faqBtns.length > 0 && terminalBody) {
        faqBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (isTyping) return;
                const questionText = btn.querySelector('.faq-text').innerText;
                const answerText = btn.getAttribute('data-answer');
                addLog(questionText, 'user');
                isTyping = true;
                setTimeout(() => { typeWriterLog(answerText); }, 500);
            });
        });
    }

    function addLog(text, type) {
        const div = document.createElement('div');
        div.className = `log-line ${type}`;
        div.innerText = type === 'user' ? text : `> ${text}`;
        terminalBody.appendChild(div);
        scrollToBottom();
    }

    function typeWriterLog(text) {
        const div = document.createElement('div');
        div.className = 'log-line bot';
        div.textContent = '> ';
        terminalBody.appendChild(div);
        scrollToBottom();

        let i = 0;
        const speed = 15;
        function type() {
            if (i < text.length) {
                div.textContent += text.charAt(i);
                i++;
                scrollToBottom();
                setTimeout(type, speed);
            } else { isTyping = false; }
        }
        type();
    }

    function scrollToBottom() {
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
});