// Global state management (in production, replace with localStorage)
let appState = {
  todos: [],
  settings: {
    primaryColor: "#6366f1",
    accentColor: "#f59e0b",
    backgroundImage: null,
  },
  exchangeRates: {},
};

// Navigation
function showPage(pageId) {
  document
    .querySelectorAll(".page")
    .forEach((page) => page.classList.remove("active"));
  document
    .querySelectorAll(".nav-link")
    .forEach((link) => link.classList.remove("active"));

  document.getElementById(pageId).classList.add("active");
  document
    .querySelector(`[onclick="showPage('${pageId}')"]`)
    .classList.add("active");

  if (pageId === "unit-converter") {
    updateUnitOptions();
  }
  if (pageId === "todo-list") {
    renderTodos();
  }
}

// Age Calculator
function calculateAge() {
  const birthDate = new Date(document.getElementById("birthDate").value);
  const today = new Date();

  if (!birthDate || birthDate > today) {
    alert("Please enter a valid birth date");
    return;
  }

  const ageInMs = today - birthDate;
  const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
  const years = Math.floor(ageInDays / 365.25);
  const months = Math.floor((ageInDays % 365.25) / 30.44);
  const days = Math.floor((ageInDays % 365.25) % 30.44);
  const hours = Math.floor(
    (ageInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((ageInMs % (1000 * 60 * 60)) / (1000 * 60));

  document.getElementById("ageDisplay").innerHTML = `
                <div style="font-size: 1.5rem; margin-bottom: 1rem;">
                    <strong>${years}</strong> years, <strong>${months}</strong> months, <strong>${days}</strong> days
                </div>
                <div style="color: var(--text-secondary);">
                    Total: ${ageInDays.toLocaleString()} days<br>
                    Or: ${Math.floor(
                      ageInMs / (1000 * 60 * 60)
                    ).toLocaleString()} hours<br>
                    Or: ${Math.floor(
                      ageInMs / (1000 * 60)
                    ).toLocaleString()} minutes
                </div>
            `;

  document.getElementById("ageResult").style.display = "block";
}

// BMI Calculator
function calculateBMI() {
  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);

  if (!height || !weight || height <= 0 || weight <= 0) {
    alert("Please enter valid height and weight values");
    return;
  }

  const bmi = weight / (height / 100) ** 2;
  let category = "";
  let color = "";

  if (bmi < 18.5) {
    category = "Underweight";
    color = "#3b82f6";
  } else if (bmi < 25) {
    category = "Normal weight";
    color = "var(--success-color)";
  } else if (bmi < 30) {
    category = "Overweight";
    color = "var(--accent-color)";
  } else {
    category = "Obese";
    color = "var(--error-color)";
  }

  document.getElementById("bmiDisplay").innerHTML = `
                <div style="font-size: 2rem; margin-bottom: 1rem; color: ${color};">
                    <strong>${bmi.toFixed(1)}</strong>
                </div>
                <div style="font-size: 1.2rem; margin-bottom: 1rem; color: ${color};">
                    ${category}
                </div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">
                    BMI Categories:<br>
                    • Underweight: Below 18.5<br>
                    • Normal: 18.5 - 24.9<br>
                    • Overweight: 25.0 - 29.9<br>
                    • Obese: 30.0 and above
                </div>
            `;

  document.getElementById("bmiResult").style.display = "block";
}

// Currency Converter
async function convertCurrency() {
  const amount = parseFloat(document.getElementById("amount").value);
  const fromCurrency = document.getElementById("fromCurrency").value;
  const toCurrency = document.getElementById("toCurrency").value;

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
    );
    const data = await response.json();

    const rate = data.rates[toCurrency];
    const convertedAmount = (amount * rate).toFixed(2);

    document.getElementById("currencyDisplay").innerHTML = `
                    <div style="font-size: 2rem; margin-bottom: 1rem;">
                        <strong>${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}</strong>
                    </div>
                    <div style="color: var(--text-secondary);">
                        Exchange Rate: 1 ${fromCurrency} = ${rate.toFixed(
      4
    )} ${toCurrency}
                    </div>
                `;

    document.getElementById("lastUpdated").textContent =
      new Date().toLocaleString();
    document.getElementById("currencyResult").style.display = "block";

    appState.exchangeRates = data.rates;
  } catch (error) {
    alert("Failed to fetch exchange rates. Please try again.");
  }
}

// Password Generator
function updateLengthDisplay() {
  const length = document.getElementById("passwordLength").value;
  document.getElementById("lengthDisplay").textContent = `${length} characters`;
}

function generatePassword() {
  const length = parseInt(document.getElementById("passwordLength").value);
  const includeUppercase = document.getElementById("includeUppercase").checked;
  const includeLowercase = document.getElementById("includeLowercase").checked;
  const includeNumbers = document.getElementById("includeNumbers").checked;
  const includeSymbols = document.getElementById("includeSymbols").checked;

  let charset = "";
  if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
  if (includeNumbers) charset += "0123456789";
  if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

  if (charset === "") {
    alert("Please select at least one character type");
    return;
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  document.getElementById("generatedPassword").textContent = password;
  document.getElementById("passwordResult").style.display = "block";
}

function copyPassword() {
  const password = document.getElementById("generatedPassword").textContent;
  navigator.clipboard.writeText(password).then(() => {
    const btn = document.querySelector(".copy-btn");
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = "Copy Password"), 2000);
  });
}

// Sleep Calculator
function calculateSleepTime() {
  const wakeUpTime = document.getElementById("wakeUpTime").value;
  if (!wakeUpTime) {
    alert("Please select a wake-up time");
    return;
  }

  const [hours, minutes] = wakeUpTime.split(":").map(Number);
  const wakeUp = new Date();
  wakeUp.setHours(hours, minutes, 0, 0);

  // If wake up time is before current time, assume next day
  if (wakeUp < new Date()) {
    wakeUp.setDate(wakeUp.getDate() + 1);
  }

  const sleepCycles = [6, 5, 4]; // 6, 7.5, 9 hours of sleep
  const fallAsleepTime = 15; // minutes to fall asleep

  let recommendations = "";
  sleepCycles.forEach((cycles, index) => {
    const totalSleepMinutes = cycles * 90; // 90 minutes per cycle
    const bedtime = new Date(
      wakeUp.getTime() - (totalSleepMinutes + fallAsleepTime) * 60000
    );
    const sleepHours = totalSleepMinutes / 60;

    recommendations += `
                    <div style="margin-bottom: 1rem; padding: 1rem; background: var(--bg-color); border-radius: 0.5rem;">
                        <strong>${bedtime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}</strong> 
                        (${sleepHours} hours of sleep - ${cycles} cycles)
                    </div>
                `;
  });

  document.getElementById("sleepDisplay").innerHTML = recommendations;
  document.getElementById("sleepResult").style.display = "block";
}

// Todo List
function addTodo() {
  const input = document.getElementById("todoInput");
  const text = input.value.trim();

  if (text) {
    appState.todos.push({
      id: Date.now(),
      text: text,
      completed: false,
    });
    input.value = "";
    renderTodos();
  }
}

function handleTodoKeyPress(event) {
  if (event.key === "Enter") {
    addTodo();
  }
}

function toggleTodo(id) {
  const todo = appState.todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    renderTodos();
  }
}

function deleteTodo(id) {
  appState.todos = appState.todos.filter((t) => t.id !== id);
  renderTodos();
}

function renderTodos() {
  const todoList = document.getElementById("todoList");

  if (appState.todos.length === 0) {
    todoList.innerHTML =
      '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No tasks yet. Add one above!</p>';
    return;
  }

  todoList.innerHTML = appState.todos
    .map(
      (todo) => `
                <div class="todo-item ${todo.completed ? "completed" : ""}">
                    <input type="checkbox" class="todo-checkbox" ${
                      todo.completed ? "checked" : ""
                    } 
                           onchange="toggleTodo(${todo.id})">
                    <span class="todo-text">${todo.text}</span>
                    <button class="todo-delete" onclick="deleteTodo(${
                      todo.id
                    })">Delete</button>
                </div>
            `
    )
    .join("");
}

// Unit Converter
const unitData = {
  length: {
    meter: 1,
    kilometer: 0.001,
    centimeter: 100,
    millimeter: 1000,
    inch: 39.3701,
    foot: 3.28084,
    yard: 1.09361,
    mile: 0.000621371,
  },
  weight: {
    kilogram: 1,
    gram: 1000,
    pound: 2.20462,
    ounce: 35.274,
    stone: 0.157473,
    ton: 0.001,
  },
  temperature: {
    celsius: (c) => ({
      celsius: c,
      fahrenheit: (c * 9) / 5 + 32,
      kelvin: c + 273.15,
    }),
    fahrenheit: (f) => ({
      celsius: ((f - 32) * 5) / 9,
      fahrenheit: f,
      kelvin: ((f - 32) * 5) / 9 + 273.15,
    }),
    kelvin: (k) => ({
      celsius: k - 273.15,
      fahrenheit: ((k - 273.15) * 9) / 5 + 32,
      kelvin: k,
    }),
  },
  volume: {
    liter: 1,
    milliliter: 1000,
    gallon: 0.264172,
    quart: 1.05669,
    pint: 2.11338,
    cup: 4.22675,
    fluid_ounce: 33.814,
  },
};

function updateUnitOptions() {
  const type = document.getElementById("conversionType").value;
  const fromUnit = document.getElementById("fromUnit");
  const toUnit = document.getElementById("toUnit");

  fromUnit.innerHTML = "";
  toUnit.innerHTML = "";

  Object.keys(unitData[type]).forEach((unit) => {
    if (type !== "temperature" || typeof unitData[type][unit] === "function") {
      const option1 = new Option(
        unit.charAt(0).toUpperCase() + unit.slice(1).replace("_", " "),
        unit
      );
      const option2 = new Option(
        unit.charAt(0).toUpperCase() + unit.slice(1).replace("_", " "),
        unit
      );
      fromUnit.add(option1);
      toUnit.add(option2);
    }
  });

  if (toUnit.options.length > 1) {
    toUnit.selectedIndex = 1;
  }
}

function convertUnits() {
  const value = parseFloat(document.getElementById("unitValue").value);
  const type = document.getElementById("conversionType").value;
  const fromUnit = document.getElementById("fromUnit").value;
  const toUnit = document.getElementById("toUnit").value;

  if (!value || isNaN(value)) {
    document.getElementById("unitResult").style.display = "none";
    return;
  }

  let result;

  if (type === "temperature") {
    const converted = unitData.temperature[fromUnit](value);
    result = converted[toUnit].toFixed(2);
  } else {
    const baseValue = value / unitData[type][fromUnit];
    result = (baseValue * unitData[type][toUnit]).toFixed(6);
    result = parseFloat(result); // Remove unnecessary zeros
  }

  document.getElementById("unitDisplay").innerHTML = `
                <div style="font-size: 1.5rem;">
                    <strong>${value} ${fromUnit.replace(
    "_",
    " "
  )} = ${result} ${toUnit.replace("_", " ")}</strong>
                </div>
            `;

  document.getElementById("unitResult").style.display = "block";
}

// Settings
function updateColors() {
  const primaryColor = document.getElementById("primaryColor").value;
  const accentColor = document.getElementById("accentColor").value;

  document.documentElement.style.setProperty("--primary-color", primaryColor);
  document.documentElement.style.setProperty("--accent-color", accentColor);

  appState.settings.primaryColor = primaryColor;
  appState.settings.accentColor = accentColor;
}

function updateBackground() {
  const file = document.getElementById("backgroundUpload").files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.body.style.backgroundImage = `url(${e.target.result})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
      appState.settings.backgroundImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function resetBackground() {
  document.body.style.backgroundImage =
    'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23334155" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>\')';
  document.body.style.backgroundSize = "";
  document.body.style.backgroundPosition = "";
  document.body.style.backgroundAttachment = "";
  appState.settings.backgroundImage = null;
}

function saveSettings() {
  // In production, replace with: 
  localStorage.setItem('toolhub-settings', JSON.stringify(appState.settings));
  alert("Settings saved!");
}

function resetSettings() {
  document.documentElement.style.setProperty("--primary-color", "#6366f1");
  document.documentElement.style.setProperty("--accent-color", "#f59e0b");
  document.getElementById("primaryColor").value = "#6366f1";
  document.getElementById("accentColor").value = "#f59e0b";
  resetBackground();

  appState.settings = {
    primaryColor: "#6366f1",
    accentColor: "#f59e0b",
    backgroundImage: null,
  };

  alert("Settings reset to default");
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  // Set max date for age calculator to today
  document.getElementById("birthDate").max = new Date()
    .toISOString()
    .split("T")[0];

  // Initialize unit converter
  updateUnitOptions();

  // Load saved settings (in production, load from localStorage)
   const savedSettings = localStorage.getItem('toolhub-settings');
   if (savedSettings) {
       appState.settings = JSON.parse(savedSettings);
       applySettings();
   }
});

function applySettings() {
  document.documentElement.style.setProperty(
    "--primary-color",
    appState.settings.primaryColor
  );
  document.documentElement.style.setProperty(
    "--accent-color",
    appState.settings.accentColor
  );
  document.getElementById("primaryColor").value =
    appState.settings.primaryColor;
  document.getElementById("accentColor").value = appState.settings.accentColor;

  if (appState.settings.backgroundImage) {
    document.body.style.backgroundImage = `url(${appState.settings.backgroundImage})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  }
}

// Add smooth scrolling and animations
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});


