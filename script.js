// Load saved data on page load
window.onload = function () {
    document.getElementById("moodDisplay").innerText =
        localStorage.getItem("mood") || "";

    document.getElementById("waterDisplay").innerText =
        localStorage.getItem("water") || "";

    document.getElementById("sleepDisplay").innerText =
        localStorage.getItem("sleep") || "";

    let foodData = JSON.parse(localStorage.getItem("food")) || [];
    foodData.forEach(item => addFoodToList(item));
};

// Mood
function saveMood() {
    let mood = document.getElementById("mood").value;
    if (mood) {
        localStorage.setItem("mood", "Today's mood: " + mood);
        document.getElementById("moodDisplay").innerText =
            "Today's mood: " + mood;
    }
}

// Food
function saveFood() {
    let food = document.getElementById("food").value;
    if (!food) return;

    let foodData = JSON.parse(localStorage.getItem("food")) || [];
    foodData.push(food);
    localStorage.setItem("food", JSON.stringify(foodData));

    addFoodToList(food);
    document.getElementById("food").value = "";
}

function addFoodToList(food) {
    let li = document.createElement("li");
    li.innerText = food;
    document.getElementById("foodList").appendChild(li);
}

// Water
function saveWater() {
    let water = document.getElementById("water").value;
    localStorage.setItem("water", "Water intake: " + water + " glasses");
    document.getElementById("waterDisplay").innerText =
        "Water intake: " + water + " glasses";
}

// Sleep
function saveSleep() {
    let sleep = document.getElementById("sleep").value;
    localStorage.setItem("sleep", "Sleep: " + sleep + " hours");
    document.getElementById("sleepDisplay").innerText =
        "Sleep: " + sleep + " hours";
}
