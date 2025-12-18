document.addEventListener("DOMContentLoaded", () => {

    lucide.createIcons();

    /* DOM Elements */
    const display = document.getElementById("display");
    const incrementBtn = document.getElementById("increment");
    const decrementBtn = document.getElementById("decrement");
    const resetBtn = document.getElementById("reset");

    const selectedZikr = document.getElementById("selectedZikr");
    const zikrOptions = document.querySelector(".zikr-options");

    const openSettings = document.getElementById("openSettings");
    const closeSettings = document.getElementById("closeSettings");
    const modal = document.getElementById("settingsModal");

    const themeButtons = document.querySelectorAll("[data-theme]");
    const customColor = document.getElementById("customColor");

    const tasbeehSound = document.getElementById("tasbeehSound");
    const soundToggle = document.getElementById("soundToggle");

    const ring = document.querySelector(".ring-progress");
    const radius = 110;
    const circumference = 2 * Math.PI * radius;

    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = circumference;

    /* State */
    let count = 0;
    let soundEnabled = true;
    let currentZikr = "subhanallah";

    const zikrLimits = { subhanallah: 33, alhamdulillah: 33, allahuakbar: 34, astaghfirullah: 100, lailaha: 100 };
    const zikrMap = { subhanallah: "سبحان الله", alhamdulillah: "الحمد لله", allahuakbar: "الله أكبر", astaghfirullah: "أستغفر الله", lailaha: "لا إله إلا الله" };

    /* Noor Particles */
    const noorContainer = document.getElementById("noor-particles");
    function createNoor() {
        const noor = document.createElement("span");
        noor.classList.add("noor");
        const size = Math.random() * 4 + 3;
        const duration = Math.random() * 15 + 10;
        const left = Math.random() * 100;
        noor.style.width = `${size}px`;
        noor.style.height = `${size}px`;
        noor.style.left = `${left}%`;
        noor.style.animationDuration = `${duration}s`;
        noorContainer.appendChild(noor);
        setTimeout(() => noor.remove(), duration * 1000);
    }
    setInterval(createNoor, 700);

    /* Update Ring */
    function updateRing() {
        const limit = zikrLimits[currentZikr];
        const progress = count / limit;
        ring.style.strokeDashoffset = circumference - progress * circumference;

        // Update opacity of display
        if (count === 0) { display.classList.add("zero"); }
        else { display.classList.remove("zero"); }
    }

    /* Animate Zikr Change */
    function animateZikrChange() {
        selectedZikr.style.transform = "scale(1.2)";
        setTimeout(() => { selectedZikr.style.transform = "scale(1)"; }, 200);
    }

    /* Zikr Selector */
    selectedZikr.addEventListener("click", (e) => {
        e.stopPropagation();
        zikrOptions.classList.toggle("hidden");

        const icon = selectedZikr.querySelector(".dropdown-icon");
        if (!zikrOptions.classList.contains("hidden")) {
            icon.style.transform = "rotate(180deg)";
        } else {
            icon.style.transform = "rotate(0deg)";
        }
    });

    zikrOptions.querySelectorAll("div").forEach(option => {
        option.addEventListener("click", () => {
            currentZikr = option.dataset.value;
            document.getElementById("zikrText").textContent = zikrMap[currentZikr];
            count = 0;
            display.textContent = count;
            zikrOptions.classList.add("hidden");
            selectedZikr.querySelector(".dropdown-icon").style.transform = "rotate(0deg)";
            updateRing();
            animateZikrChange();
        });
    });

    /* Click outside to close selector and modal */
    document.addEventListener("click", (e) => {
        if (!selectedZikr.contains(e.target) && !zikrOptions.contains(e.target)) {
            zikrOptions.classList.add("hidden");
            selectedZikr.querySelector(".dropdown-icon").style.transform = "rotate(0deg)";
        }
        if (!modal.contains(e.target) && !openSettings.contains(e.target)) {
            modal.classList.add("hidden");
        }
    });

    /* Counter Buttons */
    incrementBtn.addEventListener("click", () => {
        count++;
        if (soundEnabled) { tasbeehSound.currentTime = 0; tasbeehSound.play(); }
        if (count >= zikrLimits[currentZikr]) count = 0;
        display.textContent = count;
        updateRing();
    });

    decrementBtn.addEventListener("click", () => {
        if (count > 0) count--;
        display.textContent = count;
        updateRing();
    });

    resetBtn.addEventListener("click", () => {
        count = 0;
        display.textContent = count;
        updateRing();
    });

    /* Settings */
    openSettings.addEventListener("click", (e) => { e.stopPropagation(); modal.classList.remove("hidden"); });
    closeSettings.addEventListener("click", (e) => { e.stopPropagation(); modal.classList.add("hidden"); });

    /* Themes */
    const themes = {
        dark: { bg: "radial-gradient(circle at top,#1b5e50,#061a15)", btn: "#1fa67a" },
        light: { bg: "#f5f5f5", btn: "#4caf50" },
        green: { bg: "#0b3d2e", btn: "#1fa67a" },
        blue: { bg: "#0a2540", btn: "#1e90ff" },
        gold: { bg: "#2c2200", btn: "#c9a227" }
    };
    themeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            document.documentElement.style.setProperty("--bg", themes[btn.dataset.theme].bg);
            document.documentElement.style.setProperty("--btn", themes[btn.dataset.theme].btn);
        });
    });

    /* Custom Color */
    customColor.addEventListener("input", e => {
        document.documentElement.style.setProperty("--bg", e.target.value);
    });

    /* Sound Toggle */
    soundToggle.addEventListener("change", () => soundEnabled = soundToggle.checked);

    updateRing(); // initial
});


/* Settings */
openSettings.addEventListener("click", (e) => {
    e.stopPropagation();
    modal.classList.remove("hidden");
    display.style.visibility = "hidden"; // hide counter
});
closeSettings.addEventListener("click", (e) => {
    e.stopPropagation();
    modal.classList.add("hidden");
    display.style.visibility = "visible"; // show counter
});

/* Click outside modal closes it */
document.addEventListener("click", (e) => {
    if (!modal.contains(e.target) && !openSettings.contains(e.target)) {
        modal.classList.add("hidden");
        display.style.visibility = "visible"; // show counter
    }
});
