// ---------------------- USER MANAGEMENT ----------------------

let users = [];
let dataLoaded = false;
let chatIndex = 0;

let userData = {
  name: "",
  skills: "",
  projects: "",
  email: "",
  website: ""
};

// Load users.json (if exists)
fetch('users.json')
  .then(res => res.json())
  .then(data => {
    users = data;
    dataLoaded = true;
    console.log("Users loaded:", users);
  })
  .catch(() => console.warn("No users.json found — starting fresh."));

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

function Dlogin() {
  document.getElementById("login").style.display = "block";
  document.getElementById("signUp").style.display = "none";
  document.getElementById("main").style.display = "none";
}

function Dsignup() {
  document.getElementById("signUp").style.display = "block";
  document.getElementById("login").style.display = "none";
  document.getElementById("main").style.display = "none";
}

function Dmain() {
  document.getElementById("main").style.display = "block";
  document.getElementById("login").style.display = "none";
  document.getElementById("signUp").style.display = "none";
}

function signup() {
  const username = document.getElementById("SignUpNameInput").value.trim();
  const setPassword = document.getElementById("SignUpPasswordInput").value;
  const confirmPassword = document.getElementById("SignUpConfirmPasswordInput").value;

  if (setPassword !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }
  if (!username || !setPassword) {
    alert("Please fill all fields.");
    return;
  }
  if (users.find(u => u.username === username)) {
    alert("Username already exists!");
    return;
  }

  const newUser = { username, password: setPassword };
  users.push(newUser);
  saveUsers();

  alert("Signup successful! You can now sign in.");
  Dlogin();
}

function login() {
  if (!dataLoaded && !localStorage.getItem("users")) {
    alert("Please wait, loading user data...");
    return;
  }

  const username = document.getElementById("LogInNameInput").value.trim();
  const password = document.getElementById("LogInPasswordInput").value.trim();

  const stored = JSON.parse(localStorage.getItem("users")) || users;
  const user = stored.find(u => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem("loggedInUser", username);
    alert("Login successful!");
    Dmain();
    document.querySelector('.user-badge').value = user.username[0].toUpperCase();
    startChat();
  } else {
    alert("Invalid username or password.");
  }
}

// ---------------------- CHATBOT ----------------------

const dialogues = [
  "Hello! Let's build your portfolio together. What's your full name?",
  "Great! What are your main skills? (e.g. HTML, CSS, JS)",
  "Awesome. What projects have you worked on?",
  "What's your email address?",
  "Finally, do you have a personal website or GitHub link?"
];

function startChat() {
  const chatArea = document.querySelector('.chat-area');
  const input = document.querySelector('.input-bar');
  chatArea.innerHTML = "";

  addBotMessage(dialogues[0]);
  chatIndex = 0;

  input.value = "";
  input.focus();

  input.onkeydown = function (e) {
    if (e.key === "Enter" && input.value.trim() !== "") {
      const answer = input.value.trim();
      input.value = "";
      addUserMessage(answer);

      // Save answer
      if (chatIndex === 0) userData.name = answer;
      if (chatIndex === 1) userData.skills = answer;
      if (chatIndex === 2) userData.projects = answer;
      if (chatIndex === 3) userData.email = answer;
      if (chatIndex === 4) userData.website = answer;

      chatIndex++;
      if (chatIndex < dialogues.length) {
        setTimeout(() => addBotMessage(dialogues[chatIndex]), 600);
      } else {
        setTimeout(generatePortfolioPreview, 1000);
      }
    }
  };
}

function addBotMessage(text) {
  const chatArea = document.querySelector('.chat-area');
  const msg = document.createElement("div");
  msg.className = "dialogueBox";
  msg.textContent = text;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function addUserMessage(text) {
  const chatArea = document.querySelector('.chat-area');
  const msg = document.createElement("div");
  msg.className = "dialogueBox";
  msg.style.backgroundColor = "#3a3a45";
  msg.style.alignSelf = "flex-end";
  msg.textContent = text;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function generatePortfolioPreview() {
  const chatArea = document.querySelector('.chat-area');
  addBotMessage("Awesome! Here’s your portfolio summary:");

  const box = document.createElement("div");
  box.innerHTML = `
    <div id="portfolioPreview" style="background:#2c2c37;padding:20px;border-radius:15px;margin-top:15px;line-height:1.6">
      <h2 style="color:white;">${userData.name}</h2>
      <p><strong>Skills:</strong> ${userData.skills}</p>
      <p><strong>Projects:</strong> ${userData.projects}</p>
      <p><strong>Email:</strong> ${userData.email}</p>
      <p><strong>Website:</strong> <a href="${userData.website}" target="_blank" style="color:#6b6bff;">${userData.website}</a></p>
    </div>
    <button id="downloadPDF" style="margin-top:15px;padding:10px 20px;background:#6b6bff;border:none;border-radius:10px;color:white;font-weight:bold;cursor:pointer;">⬇ Download as PDF</button>
  `;
  chatArea.appendChild(box);
  chatArea.scrollTop = chatArea.scrollHeight;

  // PDF download
  document.getElementById("downloadPDF").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(userData.name, 10, 20);

    doc.setFontSize(12);
    doc.text(`Skills: ${userData.skills}`, 10, 35);
    doc.text(`Projects: ${userData.projects}`, 10, 45);
    doc.text(`Email: ${userData.email}`, 10, 55);
    doc.text(`Website: ${userData.website}`, 10, 65);

    doc.save(`${userData.name}_Portfolio.pdf`);
  });
}
