// ---------------------- USER MANAGEMENT ----------------------

let users = [];
let dataLoaded = false;
let chatIndex = 0;

let resumeData = {
  name: "",
  contact: "",
  skills: "",
  education: "",
  experience: "",
  awards: ""
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
  "Let's create your resume! What’s your full name?",
  "Great! Please enter your contact details (Address, Phone, Email).",
  "Write a short skills summary about yourself.",
  "Now, tell me your education details (Degree, School, Year).",
  "List your work experience (Company, Role, Duration, Achievements).",
  "Any awards or recognitions you’d like to mention?"
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
      if (chatIndex === 0) resumeData.name = answer;
      if (chatIndex === 1) resumeData.contact = answer;
      if (chatIndex === 2) resumeData.skills = answer;
      if (chatIndex === 3) resumeData.education = answer;
      if (chatIndex === 4) resumeData.experience = answer;
      if (chatIndex === 5) resumeData.awards = answer;

      chatIndex++;
      if (chatIndex < dialogues.length) {
        setTimeout(() => addBotMessage(dialogues[chatIndex]), 600);
      } else {
        setTimeout(generateResumePreview, 1000);
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

function generateResumePreview() {
  const chatArea = document.querySelector('.chat-area');
  addBotMessage("Here’s your resume preview:");

  const box = document.createElement("div");
  box.innerHTML = `
    <div id="resumePreview" style="background:white;color:black;padding:30px;border-radius:10px;margin-top:15px;font-family:Arial;max-width:600px;line-height:1.6">
      <h2 style="background-color: #ffffff;border-bottom:2px solid black;padding-bottom:5px;">${resumeData.name}</h2>
      <p style="background-color: #ffffff;"><strong>${resumeData.contact}</strong></p>
      <br>
      <h3 style="background-color: #ffffff;">Skills Summary</h3>
      <p style="background-color: #ffffff;">${resumeData.skills}</p>
      <br>
      <h3 style="background-color: #ffffff;">Education</h3>
      <p style="background-color: #ffffff;">${resumeData.education}</p>
      <br>
      <h3 style="background-color: #ffffff;">Experience</h3>
      <p style="background-color: #ffffff;">${resumeData.experience}</p>
      <br>
      <h3 style="background-color: #ffffff;">Awards and Acknowledgements</h3>
      <p style="background-color: #ffffff;">${resumeData.awards}</p>
    </div>
    <button id="downloadPDF" style="margin-top:15px;padding:10px 20px;background:#6b6bff;border:none;border-radius:10px;color:white;font-weight:bold;cursor:pointer;">⬇ Download Resume (PDF)</button>
  `;
  chatArea.appendChild(box);
  chatArea.scrollTop = chatArea.scrollHeight;

  document.getElementById("downloadPDF").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(resumeData.name, 10, 20);
    doc.setFontSize(12);
    doc.text(resumeData.contact, 10, 30);
    doc.text("----------------------------------------------------------------------------------------------------------------------------", 10, 35);
    doc.text("Skills Summary:", 10, 45);
    doc.text(resumeData.skills, 10, 52, { maxWidth: 180 });
    doc.text("----------------------------------------------------------------------------------------------------------------------------", 10, 60);
    doc.text("Education:", 10, 70);
    doc.text(resumeData.education, 10, 77, { maxWidth: 180 });
    doc.text("----------------------------------------------------------------------------------------------------------------------------", 10, 90);
    doc.text("Experience:", 10, 95);
    doc.text(resumeData.experience, 10, 102, { maxWidth: 180 });
    doc.text("----------------------------------------------------------------------------------------------------------------------------", 10, 110);
    doc.text("Awards and Acknowledgements:", 10, 120);
    doc.text(resumeData.awards, 10, 127, { maxWidth: 180 });
    doc.save(`${resumeData.name}_Resume.pdf`);
  });
}
