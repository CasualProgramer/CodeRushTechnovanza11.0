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

function Dlogin() {
  document.getElementById("login").style.display = "block";
  document.getElementById("signUp").style.display = "none";
  document.getElementById("main").style.display = "none";
}

function Dsignup(){
  document.getElementById("signUp").style.display = "block";
  document.getElementById("login").style.display = "none";
  document.getElementById("main").style.display = "none";
}
function Dmain(){
  document.getElementById("main").style.display = "block";
  document.getElementById("login").style.display = "none";
  document.getElementById("signUp").style.display = "none";
}

function signup() {
  const username = document.getElementById("SignUpNameInput").value.trim();
  const setPassword = document.getElementById("SignUpPasswordInput").value;
  const confirmPassword = document.getElementById("SignUpConfirmPasswordInput").value;
  var password;
  if (setPassword == confirmPassword){
    password = setPassword
  }
  else{
    alert("Please use the correct password")
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
  const user = stored.find(u => u.username == username && u.password == password);
  console.log("All users currently:", JSON.parse(localStorage.getItem("users")) || users);
  if (user) {
    localStorage.setItem("loggedInUser", username);
    alert("Login successful!");
    Dmain()
    document.querySelector('.user-badge').value = user.username[0]
    console.log(user.username[0])
  } else {
    alert("Invalid username or password.");
  }
}

let dialogues = ["Do you want to use your name from, your account?", "Your name?", "Your skills?", "Your Projects?", "Your email address?", "Your website?"];