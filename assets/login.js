const loginForm = document.querySelector(".loginForm");

function failurePopUp(errorInnerText, width) {
  const popUp = document.createElement("div");
  popUp.classList.add("failurePopUp");
  this.document.body.appendChild(popUp);
  popUp.style.fontFamily = "Syne";
  popUp.style.width = width + "px";
  popUp.style.minWidth = width + "px";
  popUp.style.marginLeft = -width / 2 + "px";
  popUp.innerText = errorInnerText;

  popUp.addEventListener("animationend", () => {
    popUp.remove();

    popUp.addEventListener("animationend", () => {
      popUp.remove();
    });
  });
}

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
        window.location.replace("./index.html");
      } else {
        failurePopUp("Erreur dans l’identifiant ou le mot de passe", "400");
      }
    });
});
