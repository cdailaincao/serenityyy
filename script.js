/*********************************
 * USER & STORAGE HELPERS
 *********************************/
function currentUser() {
    return localStorage.getItem("user");
}

function userKey(key) {
    const user = currentUser();
    return user ? `${user}_${key}` : key;
}

/*********************************
 * AUTHENTICATION
 *********************************/
function signup() {
    if (!username.value || !password.value) return;
    localStorage.setItem(username.value, password.value);
    authMsg.innerText = "Signup successful!";
}

function login() {
    if (localStorage.getItem(username.value) === password.value) {
        localStorage.setItem("user", username.value);
        location.href = "dashboard.html";
    } else {
        authMsg.innerText = "Invalid credentials!";
    }
}

function logout() {
    // Clear all visible UI elements
    if (window.moodChartRef) {
        window.moodChartRef.destroy();
        window.moodChartRef = null;
    }

    if (journalList) journalList.innerHTML = "";
    if (foodList) foodList.innerHTML = "";
    if (waterDisplay) waterDisplay.innerText = "";
    if (sleepDisplay) sleepDisplay.innerText = "";
    if (timer) timer.innerText = "";

    localStorage.removeItem("user");
    location.href = "index.html";
}


/*********************************
 * MOOD TRACKER
 *********************************/
function saveMood() {
    const moods = JSON.parse(localStorage.getItem(userKey("moods"))) || [];

    moods.push({
        date: new Date().toLocaleDateString(),
        mood: mood.value
    });

    localStorage.setItem(userKey("moods"), JSON.stringify(moods));
    drawChart();
}

function drawChart() {
    if (!document.getElementById("moodChart")) return;

    const moods = JSON.parse(localStorage.getItem(userKey("moods"))) || [];
    const ctx = document.getElementById("moodChart").getContext("2d");

    if (window.moodChartRef) window.moodChartRef.destroy();

    window.moodChartRef = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: moods.map(m => m.date),
            datasets: [{
                label: 'Mood History',
                data: moods.map((_, i) => i + 1)
            }]
        }
    });
}

/*********************************
 * FOOD INTAKE
 *********************************/
function saveFood() {
    const val = food.value;
    if (!val) return;

    const foods = JSON.parse(localStorage.getItem(userKey("foods"))) || [];
    foods.push(val);

    localStorage.setItem(userKey("foods"), JSON.stringify(foods));
    food.value = "";
    loadFood();
}

function loadFood() {
    if (!foodList) return;
    foodList.innerHTML = "";

    const foods = JSON.parse(localStorage.getItem(userKey("foods"))) || [];
    foods.forEach(f => {
        const li = document.createElement("li");
        li.innerText = f;
        foodList.appendChild(li);
    });
}

/*********************************
 * WATER TRACKER
 *********************************/
function saveWater() {
    localStorage.setItem(userKey("water"), water.value);
    loadWater();
}

function loadWater() {
    const val = localStorage.getItem(userKey("water"));
    if (val) waterDisplay.innerText = val + " glasses";
}

/*********************************
 * SLEEP TRACKER
 *********************************/
function saveSleep() {
    localStorage.setItem(userKey("sleep"), sleep.value);
    loadSleep();
}

function loadSleep() {
    const val = localStorage.getItem(userKey("sleep"));
    if (val) sleepDisplay.innerText = val + " hours";
}

/*********************************
 * JOURNALING MODULE
 *********************************/
function saveJournal() {
    const text = journalText.value.trim();
    if (!text) return;

    const journals = JSON.parse(localStorage.getItem(userKey("journals"))) || [];
    journals.unshift({
        date: new Date().toLocaleString(),
        text
    });

    localStorage.setItem(userKey("journals"), JSON.stringify(journals));
    journalText.value = "";
    loadJournals();
}

function loadJournals() {
    if (!journalList) return;

    // HARD RESET UI FIRST
    journalList.innerHTML = "";

    const journals = JSON.parse(localStorage.getItem(userKey("journals"))) || [];

    journals.forEach(j => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${j.date}</strong><br>${j.text}`;
        journalList.appendChild(li);
    });
}


/*********************************
 * EXERCISE TIMER
 *********************************/
function startExercise() {
    localStorage.setItem(userKey("exercise"), exercise.value);

    let time = 300;
    timer.innerText = "";

    const interval = setInterval(() => {
        timer.innerText = `Time left: ${time--}s`;
        if (time < 0) {
            clearInterval(interval);
            timer.innerText = "Exercise Complete ✅";
        }
    }, 1000);
}

/*********************************
 * PDF EXPORT
 *********************************/
function exportPDF() {
    if (!window.jspdf) {
        alert("jsPDF not loaded");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 15;

    doc.setFontSize(18);
    doc.text("Serenity – Wellness Report", 10, y);
    y += 10;

    doc.setFontSize(12);
    doc.text("User: " + currentUser(), 10, y);
    y += 8;
    doc.text("Generated: " + new Date().toLocaleString(), 10, y);
    y += 10;

    // Mood
    doc.setFontSize(14);
    doc.text("Mood History:", 10, y);
    y += 7;

    const moods = JSON.parse(localStorage.getItem(userKey("moods"))) || [];
    moods.forEach(m => {
        doc.text(`• ${m.date} - ${m.mood}`, 10, y);
        y += 7;
    });

    // Food
    y += 5;
    doc.text("Food Intake:", 10, y);
    y += 7;

    const foods = JSON.parse(localStorage.getItem(userKey("foods"))) || [];
    foods.forEach(f => {
        doc.text(`• ${f}`, 10, y);
        y += 7;
    });

    // Water & Sleep
    y += 5;
    doc.text("Water: " + (localStorage.getItem(userKey("water")) || "N/A"), 10, y);
    y += 7;
    doc.text("Sleep: " + (localStorage.getItem(userKey("sleep")) || "N/A"), 10, y);

    // Journals
    y += 10;
    doc.text("Journal Entries:", 10, y);
    y += 7;

    const journals = JSON.parse(localStorage.getItem(userKey("journals"))) || [];
    journals.slice(0, 3).forEach(j => {
        doc.text(j.date, 10, y);
        y += 6;
        doc.setFontSize(11);
        doc.text(j.text.substring(0, 150), 12, y);
        y += 8;
        doc.setFontSize(14);
    });

    doc.save("Serenity_Report.pdf");
}

/*********************************
 * LOAD USER DATA ON DASHBOARD
 *********************************/
document.addEventListener("DOMContentLoaded", () => {
    if (!currentUser()) return;

    loadFood();
    loadWater();
    loadSleep();
    loadJournals();
    drawChart();
});
