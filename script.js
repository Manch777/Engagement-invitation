/* ==============================
   Конверт и печать
================================ */

const envelopeScene = document.getElementById("envelopeScene");
const envelope = document.getElementById("envelope");
const waxSeal = document.getElementById("waxSeal");
const letterCard = document.getElementById("letterCard");
const envelopeHint = document.getElementById("envelopeHint");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function revealInvitation() {
    if (!envelopeScene || envelopeScene.classList.contains("leaving")) {
        return;
    }

    envelopeScene.classList.add("leaving");
    document.body.classList.remove("sealed");
    document.body.classList.add("invitation-shown");
    window.scrollTo(0, 0);

    window.setTimeout(() => {
        envelopeScene.remove();
    }, prefersReducedMotion ? 0 : 900);
}

function openEnvelope() {
    if (!envelope || envelope.classList.contains("opening")) {
        return;
    }

    envelope.classList.add("opening", "seal-broken");
    waxSeal.setAttribute("aria-disabled", "true");

    const openDelay = prefersReducedMotion ? 0 : 280;
    const cardDelay = prefersReducedMotion ? 0 : 920;

    window.setTimeout(() => {
        envelope.classList.add("open");
    }, openDelay);

    window.setTimeout(() => {
        envelope.classList.add("card-out");
        letterCard.tabIndex = 0;
        letterCard.focus({ preventScroll: true });
        envelopeHint.textContent = "Սեղմեք բացիկը";
    }, cardDelay);
}

if (waxSeal && letterCard) {
    waxSeal.addEventListener("click", openEnvelope);

    letterCard.addEventListener("click", () => {
        if (envelope.classList.contains("card-out")) {
            revealInvitation();
        }
    });

    letterCard.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (envelope.classList.contains("card-out")) {
                revealInvitation();
            }
        }
    });
}

const elements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }

        });

    },
    {
        threshold: 0.2
    }
);

elements.forEach((element) => {
    observer.observe(element);
});

/* ==============================
   Обратный отсчёт
================================ */

const weddingDate = new Date("2026-09-10T17:00:00+04:00");

function updateCountdown() {

    const now = new Date();
    const difference = weddingDate - now;

    if (difference <= 0) {
        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (difference / 1000) % 60
    );

    document.getElementById("days").textContent =
        String(days).padStart(2, "0");

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");
}

updateCountdown();

setInterval(updateCountdown, 1000);

