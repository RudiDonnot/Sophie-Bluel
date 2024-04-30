const loginForm = document.querySelector(".loginForm");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const identifiant = {
    email: event.target.querySelector("[name=email]").value,
    password: event.target.querySelector("[name=password]").value,
  };
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(identifiant),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.userId && response.token) {
        window.sessionStorage.setItem("token", response.token);
        alert("connecté");
        window.location = "./index.html";
      } else {
        alert("identifiants incorrects");
      }
    });
});
