// AUTH
function signup() {
    localStorage.setItem(username.value, password.value);
    authMsg.innerText = "Signup successful!";
}

function login() {
    if (localStorage.getItem(username.value) === password.value) {
        localStorage.setItem("user", username.value);
        location.href = "dashboard.html";
    } else {
        authMsg.innerText = "Invalid login!";
    }
}

function logout() {
    localStorage.removeItem("user");
    location.href = "index.html";
}

// MOOD + HISTORY
function saveMood() {
    let data = JSON.parse(localStorage.getItem("moods")) || [];
    data.push({ date: new Date().toLocaleDateString(), mood: mood.value });
    localStorage.setItem("moods", JSON.stringify(data));
    drawChart();
}

// FOOD
function saveFood() {
    let li = document.createElement("li");
    li.innerText = food.value;
    foodList.appendChild(li);
}

// WATER
function saveWater() {
    waterDisplay.innerText = water.value + " glasses";
}

// SLEEP
function saveSleep() {
    sleepDisplay.innerText = sleep.value + " hours";
}

// EXERCISE TIMER
function startExercise() {
    let time = 300;
    let interval = setInterval(() => {
        timer.innerText = `Time left: ${time--}s`;
        if (time < 0) {
            clearInterval(interval);
            timer.innerText = "Exercise Complete ✅";
        }
    }, 1000);
}

// CHART
function drawChart() {
    let moods = JSON.parse(localStorage.getItem("moods")) || [];
    new Chart(moodChart, {
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

if (typeof moodChart !== "undefined") drawChart();
function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 10;
    const user = localStorage.getItem("user") || "Guest";
    const date = new Date().toLocaleString();

    doc.setFontSize(18);
    doc.text("Serenity – Mental Health Wellness Report", 10, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`User: ${user}`, 10, y);
    y += 7;
    doc.text(`Generated on: ${date}`, 10, y);
    y += 10;

    // Mood History
    doc.setFontSize(14);
    doc.text("Mood History:", 10, y);
    y += 7;

    let moods = JSON.parse(localStorage.getItem("moods")) || [];
    if (moods.length === 0) {
        doc.text("No mood data available.", 10, y);
        y += 7;
    } else {
        moods.forEach(m => {
            doc.text(`• ${m.date}: ${m.mood}`, 10, y);
            y += 7;
        });
    }

    // Food
    y += 5;
    doc.setFontSize(14);
    doc.text("Food Intake:", 10, y);
    y += 7;

    let foodList = document.querySelectorAll("#foodList li");
    if (foodList.length === 0) {
        doc.text("No food data available.", 10, y);
        y += 7;
    } else {
        foodList.forEach(item => {
            doc.text(`• ${item.innerText}`, 10, y);
            y += 7;
        });
    }

    // Water
    y += 5;
    doc.setFontSize(14);
    doc.text("Water Intake:", 10, y);
    y += 7;

    let waterText = document.getElementById("waterDisplay").innerText || "Not recorded";
    doc.text(waterText, 10, y);
    y += 10;

    // Sleep
    doc.setFontSize(14);
    doc.text("Sleep:", 10, y);
    y += 7;

    let sleepText = document.getElementById("sleepDisplay").innerText || "Not recorded";
    doc.text(sleepText, 10, y);
    y += 10;

    // Exercises
    doc.setFontSize(14);
    doc.text("Wellness Exercises:", 10, y);
    y += 7;

    let exercise = document.getElementById("exercise").value;
    doc.text(`Selected exercise: ${exercise}`, 10, y);

    // Save PDF
    doc.save("Serenity_Wellness_Report.pdf");
}
