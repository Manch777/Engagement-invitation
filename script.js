/* ==============================
   ENVELOPE INTERACTION
================================ */

const envelopeScene = document.getElementById("envelopeScene");
const envelope = document.getElementById("envelope");
const waxSeal = document.getElementById("waxSeal");
const letterCard = document.getElementById("letterCard");
const envelopeHint = document.getElementById("envelopeHint");

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


/* ==============================
   INVITATION REVEAL
================================ */

function revealInvitation() {
    if (!envelopeScene || envelopeScene.classList.contains("leaving")) {
        return;
    }

    envelopeScene.classList.add("leaving");

    document.body.classList.remove("sealed");
    document.body.classList.add("invitation-shown");

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto"
    });

    window.setTimeout(() => {
        envelopeScene.remove();
    }, prefersReducedMotion ? 0 : 900);
}


/* ==============================
   ENVELOPE OPENING
================================ */

function openEnvelope() {
    if (
        !envelope ||
        !waxSeal ||
        !letterCard ||
        envelope.classList.contains("opening")
    ) {
        return;
    }

    envelope.classList.add("opening", "seal-broken");

    waxSeal.disabled = true;

    const openDelay = prefersReducedMotion ? 0 : 280;
    const cardDelay = prefersReducedMotion ? 0 : 920;

    window.setTimeout(() => {
        envelope.classList.add("open");
    }, openDelay);

    window.setTimeout(() => {
        envelope.classList.add("card-out");

        letterCard.tabIndex = 0;
        letterCard.focus({ preventScroll: true });

        if (envelopeHint) {
            envelopeHint.textContent = "Tap the invitation";
        }
    }, cardDelay);
}

if (waxSeal && letterCard && envelope) {
    waxSeal.addEventListener("click", openEnvelope);

    letterCard.addEventListener("click", () => {
        if (envelope.classList.contains("card-out")) {
            revealInvitation();
        }
    });
}


/* ==============================
   SCROLL REVEAL ANIMATIONS
================================ */

const revealElements = document.querySelectorAll(".reveal");

if (prefersReducedMotion) {
    revealElements.forEach((element) => {
        element.classList.add("active");
    });
} else {
    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    currentObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.2
        }
    );

    revealElements.forEach((element) => {
        observer.observe(element);
    });
}


/* ==============================
   COUNTDOWN
================================ */

const weddingDate = new Date("2027-09-10T17:00:00+04:00");

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

let countdownInterval = null;

function setCountdown(days, hours, minutes, seconds) {
    if (
        !daysElement ||
        !hoursElement ||
        !minutesElement ||
        !secondsElement
    ) {
        return;
    }

    daysElement.textContent = String(days).padStart(2, "0");
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");
}

function updateCountdown() {
    const now = new Date();
    const difference = weddingDate.getTime() - now.getTime();

    if (difference <= 0) {
        setCountdown(0, 0, 0, 0);

        if (countdownInterval !== null) {
            window.clearInterval(countdownInterval);
            countdownInterval = null;
        }

        return;
    }

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(difference / day);
    const hours = Math.floor((difference % day) / hour);
    const minutes = Math.floor((difference % hour) / minute);
    const seconds = Math.floor((difference % minute) / second);

    setCountdown(days, hours, minutes, seconds);
}


/* ==============================
   COUNTDOWN INITIALIZATION
================================ */

updateCountdown();

if (weddingDate.getTime() > Date.now()) {
    countdownInterval = window.setInterval(
        updateCountdown,
        1000
    );
}
