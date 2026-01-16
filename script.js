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
