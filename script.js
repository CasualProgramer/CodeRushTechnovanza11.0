let users = [];
let dataLoaded = false;

// Load existing users from users.json
fetch('users.json')
  .then(res => res.json())
  .then(data => {
    users = data;
    dataLoaded = true;
    console.log("Users loaded:", users);
  })
  .catch(err => console.error("Failed to load JSON:", err));

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

function signup() {
  const username = document.getElementById("SignUpNameInput").value.trim();
  const setPassword = document.getElementById("SignUpPasswordInput").value;
  const confirmPassword = document.getElementById("SignUpConfirmPasswordInput").value;
  var password;
  if (setPassword == confirmPassword){
    password = setPassword
  }
  if (!username || !password) {
    alert("Please fill all fields.");
    return;
  }

  if (users.find(u => u.username == username)) {
    alert("Username already exists!");
    return;
  }

  const newUser = { username, password };
  users.push(newUser);
  saveUsers();

  alert("Signup successful! You can now sign in.");
  window.location.href = "LogIn.html";
}

function login() {
    if (!dataLoaded && !localStorage.getItem("users")) {
    alert("Please wait, loading user data...");
    return;
  }
  const username = document.getElementById("LogInNameInput").value.trim();
  const password = document.getElementById("LogInPasswordInput").value.trim();

  const stored = JSON.parse(localStorage.getItem("users")) || users;
  const user = stored.find(u => u.username == username && u.password == password);
  console.log("All users currently:", JSON.parse(localStorage.getItem("users")) || users);
  if (user) {
    localStorage.setItem("loggedInUser", username);
    alert("Login successful!");
    window.location.href = "index.html";
  } else {
    alert("Invalid username or password.");
  }
}