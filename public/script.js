const form = document.getElementById("loginForm");
const responseBox = document.getElementById("responseBox");
const actions = document.getElementById("actions");
const userDisplay = document.getElementById("userDisplay");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  responseBox.innerText = "Logging in...";
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json().catch(() => ({}));
    responseBox.innerText = data.message || `HTTP ${res.status}`;

    if (res.status === 200) {
      actions.style.display = "block";
      userDisplay.textContent = username;
    } else {
      actions.style.display = "none";
    }
  } catch (err) {
    responseBox.innerText = "Network error: " + err.message;
  }
});

document.getElementById("getProfile").addEventListener("click", async () => {
  const res = await fetch("/api/profile");
  const data = await res.json();
  responseBox.innerText = JSON.stringify(data);
});

document.getElementById("updateProfile").addEventListener("click", async () => {
  const res = await fetch("/api/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ city: "Hyderabad" })
  });
  const data = await res.json();
  responseBox.innerText = data.message || `HTTP ${res.status}`;
});

document.getElementById("deleteProfile").addEventListener("click", async () => {
  const res = await fetch("/api/profile", { method: "DELETE" });
  // Some servers return empty for 204, so try to handle that:
  let text = "";
  try {
    text = await res.text();
  } catch {}
  responseBox.innerText = text || `HTTP ${res.status}`;
});

document.getElementById("logout").addEventListener("click", async () => {
  const res = await fetch("/api/logout");
  const data = await res.json();
  responseBox.innerText = data.message || `HTTP ${res.status}`;
  actions.style.display = "none";
});
