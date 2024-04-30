let myToken = window.sessionStorage.getItem("token");

if (myToken) {
  const filter = document.querySelector(".filter");
  filter.style.display = "none";

  /* bouton log out*/
  {
    const loggout = document.querySelector(".login");
    loggout.innerText = "logout";
    loggout.addEventListener("click", () => {
      window.sessionStorage.removeItem("token");
      location.reload();
    });
  }
  /*  banderole mode editeur  */
  {
    const body = document.querySelector("body");
    const editModeHeader = document.createElement("div");
    editModeHeader.classList.add("editModeHeader");
    body.insertBefore(editModeHeader, body.firstChild);

    const headerEditIcon = document.createElement("i");
    headerEditIcon.classList.add("fa-regular", "fa-pen-to-square");
    editModeHeader.appendChild(headerEditIcon);

    const headerEditModeText = document.createElement("p");
    headerEditModeText.innerText = "Mode édition";
    headerEditModeText.classList.add("headerEditText");
    editModeHeader.appendChild(headerEditModeText);
  }
  /*  bouton modifier  */
  {
    const worksTitleSection = document.querySelector("#portfolio .title");
    const modalbutton = document.createElement("a");
    modalbutton.classList.add("js-modal");
    modalbutton.href = "#modal1";
    worksTitleSection.appendChild(modalbutton);

    const worksModifyIcon = document.createElement("i");
    worksModifyIcon.classList.add("fa-regular", "fa-pen-to-square");
    modalbutton.appendChild(worksModifyIcon);

    const worksModifyText = document.createElement("p");
    worksModifyText.innerText = "modifier";
    modalbutton.appendChild(worksModifyText);
    document.querySelector(".js-modal").addEventListener("click", modalOverAll);
  }
} else {
  const loggout = document.querySelector(".login");
  loggout.innerText = "login";
  loggout.addEventListener("click", () => {
    open(
      "file:///C:/Users/Ryzen/Downloads/projet%206/Portfolio-architecte-sophie-bluel/FrontEnd/pagedeconnexion.html"
    );
  });
}

function modalOverAll() {
  //empêche la multiplication des boites modales
  if (document.querySelector(".modal-frame") != null)
    return console.log("Boite Modale ouverte !");

  // pour créer le tag html
  const portfolioSection = document.querySelector("#portfolio");
  const modalOverAll = document.createElement("aside");
  modalOverAll.classList.add("modal");
  modalOverAll.setAttribute("id", "modal1");
  modalOverAll.setAttribute("aria-hidden", "true");
  modalOverAll.setAttribute("role", "dialog");
  modalOverAll.setAttribute("style", "display:none;");
  portfolioSection.appendChild(modalOverAll);

  modalFrame();
  editWorksInterface();
  openModal();
}

function modalFrame() {
  const modalOverAll = document.getElementById("modal1");
  const modalFrame = document.createElement("div");
  modalFrame.classList.add("modal-frame", "js-modal-stop");
  modalOverAll.appendChild(modalFrame);
}

/*            Contenu Fenetre modale : Modifier Galerie          */
async function editWorksInterface() {
  const modalFrame = document.querySelector(".modal-frame");
  modalExitButton();
  modalTitle("Galerie Photo");
  //Creation de la galerie
  const galery = document.createElement("div");
  galery.classList.add("modal-galery");
  modalFrame.appendChild(galery);
  //Récuperation des projets sur l'api
  const fetchWork = await fetch("http://localhost:5678/api/works");
  const works = await fetchWork.json();
  //Charge les projets puis les affiches par elements présent dans l'api
  for (let i = 0; i < works.length; i++) {
    const modalWorks = document.querySelector(".modal-galery");
    const workElement = document.createElement("div");
    workElement.style = "position:relative;";
    const workImg = document.createElement("img");
    workImg.src = works[i].imageUrl;
    workImg.alt = works[i].title;
    modalWorks.appendChild(workElement);
    workElement.appendChild(workImg);

    //Créer un bouton delete pour chaque projet chargé
    const deleteWorkButton = document.createElement("div");
    deleteWorkButton.classList.add("btn-delete");
    const deleteWorkIcon = document.createElement("i");
    deleteWorkIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");
    deleteWorkButton.appendChild(deleteWorkIcon);
    workElement.appendChild(deleteWorkButton);

    //EventListener sur les boutons delete qui permet de supprimer les projets de l'api

    deleteWorkButton.addEventListener("click", async (e) => {
      e.preventDefault();
      await fetch(`http://localhost:5678/api/works/${works[i].id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
      });
      failurePopUp("Supprimé", "120");
      refreshEditGallery();
      refreshGallery();
    });
  }

  line();
  // Le bouton "Ajout de photo"
  const addButton = document.createElement("button");
  addButton.classList.add("addButton");
  addButton.innerText = "Ajouter une photo";
  modalFrame.appendChild(addButton);

  //Son eventListener qui va permettre de changer de page
  addButton.addEventListener("click", () => {
    modalFrame.innerHTML = "";
    submitNewWorksInterface();
  });
}

/*            Contenu Fenetre modale : Ajout de Photo          */
async function submitNewWorksInterface() {
  const modalFrame = document.querySelector(".modal-frame");

  modalExitButton();
  returnArrow();
  modalTitle("Ajout Photo");

  // Création contenu HTML/CSS de la modal ajout photo
  const form = document.createElement("form");
  form.classList.add("addpicture-wrap");
  modalFrame.appendChild(form);

  //Parti zone Ajouter photo
  const chooseImgWrap = document.createElement("div");
  chooseImgWrap.classList.add("chooseImg-wrap");
  form.appendChild(chooseImgWrap);
  //Logo
  const chooseImgLogo = document.createElement("i");
  chooseImgLogo.classList.add("fa-regular", "fa-image");
  //Le bouton "Ajouter Photo"
  //Label
  const labelAddPicture = document.createElement("label");
  labelAddPicture.setAttribute("for", "addPicture-btn");
  labelAddPicture.classList.add("addPicture-label");
  labelAddPicture.innerHTML = "+ Ajouter photo";
  //Input
  const addPicture = document.createElement("input");
  addPicture.setAttribute("name", "addPicture");
  addPicture.setAttribute("type", "file");
  addPicture.setAttribute("id", "addPicture-btn");
  addPicture.setAttribute("accept", ".png, .jpeg, .jpg");
  //subtitle-info
  const infoAddPicture = document.createElement("p");
  infoAddPicture.classList.add("infoAddPicture");
  infoAddPicture.innerText = "jpg, png : 4mo max";

  chooseImgWrap.appendChild(chooseImgLogo);
  chooseImgWrap.appendChild(labelAddPicture);
  chooseImgWrap.appendChild(addPicture);
  chooseImgWrap.appendChild(infoAddPicture);

  //EventListener that display a preview of selected picture
  addPicture.addEventListener("change", () => {
    chooseImgLogo.style.display = "none";
    labelAddPicture.style.display = "none";
    addPicture.style.display = "none";
    infoAddPicture.style.display = "none";

    const imgPath = URL.createObjectURL(addPicture.files[0]);
    const displayImg = document.createElement("img");
    displayImg.src = imgPath;
    displayImg.classList.add("displayedImg");
    chooseImgWrap.appendChild(displayImg);
  });

  //Form Title & Category
  const titleLabel = document.createElement("label");
  titleLabel.setAttribute("for", "title");
  titleLabel.classList.add("label-form");
  titleLabel.innerText = "Titre";
  //TitleInput
  const titleInput = document.createElement("input");
  titleInput.setAttribute("type", "text");
  titleInput.setAttribute("name", "title");
  titleInput.setAttribute("id", "title");
  titleInput.innerText = "Titre";
  form.appendChild(titleLabel);
  form.appendChild(titleInput);

  await categoryList();

  const line = document.createElement("div");
  line.classList.add("line");
  form.appendChild(line);

  const buttonSendNewWork = document.createElement("button");
  buttonSendNewWork.classList.add("sendWork-btn");
  buttonSendNewWork.innerText = "Valider";
  form.appendChild(buttonSendNewWork);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const imageInput = e.target.querySelector("[name=addPicture]");

    formData.append("image", imageInput.files[0]);
    formData.append("title", e.target.querySelector("[name=title]").value);
    formData.append(
      "category",
      e.target.querySelector("[name=category]").value
    );

    await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
      },
      body: formData,
    })
      //Affiche une alerte si la reponse != true
      .then((response) => {
        if (!response.ok) {
          if (response.status == 400) {
            failurePopUp("Veuillez vérifier le titre et la categorie.", "400");
          }
          if (response.status == 500) {
            failurePopUp("Veuillez choisir une image.", "300");
          }
        } else {
          document.getElementById("addPicture-btn").value = "";
          document.getElementById("title").value = "";
          document.getElementById("category").value = 1;
          refreshGallery();
          selectedImg = document.querySelector(".displayedImg");
          selectedImg.remove();

          const labelAddPicture = document.querySelector(".addPicture-label");
          const chooseImgLogo = document.querySelector(".fa-image");
          const infoAddPicture = document.querySelector(".infoAddPicture");

          chooseImgLogo.style.display = "block";
          labelAddPicture.style.display = "flex";
          infoAddPicture.style.display = "block";

          successPopUp();
        }
      });
  });
}

async function categoryList() {
  const categorieFetch = await fetch("http://localhost:5678/api/categories");
  const categories = await categorieFetch.json();
  const form = document.querySelector(".addpicture-wrap");

  const categoryLabel = document.createElement("label");
  categoryLabel.setAttribute("for", "category-form");
  categoryLabel.classList.add("label-form");
  categoryLabel.innerText = "Catégorie";

  const categoryInput = document.createElement("select");
  categoryInput.setAttribute("name", "category");
  categoryInput.setAttribute("id", "category");

  //Option par defaut
  const option = document.createElement("option");
  option.setAttribute("value", `none`);
  option.setAttribute("selected", "");
  option.setAttribute("disabled", "");
  option.setAttribute("hidden", "");
  option.innerText = "Choisissez une catégorie";
  categoryInput.appendChild(option);

  for (let i = 0; i < categories.length; i++) {
    const option = document.createElement("option");
    option.setAttribute("value", `${categories[i].id}`);
    option.innerText = categories[i].name;
    categoryInput.appendChild(option);
  }

  form.appendChild(categoryLabel);
  form.appendChild(categoryInput);
}

//Exit button
function modalExitButton() {
  const modalFrame = document.querySelector(".modal-frame");
  const modalExitButton = document.createElement("div");
  modalExitButton.classList.add("js-modal-close");
  modalExitButton.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
  modalFrame.appendChild(modalExitButton);
  modalExitButton.addEventListener("click", closeModal);
}

//Function that create the "returnArrow" button
function returnArrow() {
  const modalReturnArrow = document.createElement("div");
  modalReturnArrow.classList.add("js-modal-return");
  modalReturnArrow.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`;
  document.querySelector(".modal-frame").appendChild(modalReturnArrow);
  modalReturnArrow.addEventListener("click", () => {
    document.querySelector(".modal-frame").innerHTML = "";
    editWorksInterface();
  });
}

const stopPropagation = function (e) {
  e.stopPropagation();
};

async function refreshGallery() {
  const workFetch = await fetch("http://localhost:5678/api/works");
  const works = await workFetch.json();

  document.querySelector(".gallery").innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    const selectedWorks = works[i];
    const sectionGallery = document.querySelector(".gallery");
    // Creating the HTML tag
    const worksElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    const figcaptionElement = document.createElement("figcaption");
    // Setting img src and alt text and the caption text
    imageElement.src = selectedWorks.imageUrl;
    imageElement.alt = selectedWorks.title;
    figcaptionElement.innerText = selectedWorks.title;
    // Appending elements to the DOM
    sectionGallery.appendChild(worksElement);
    worksElement.appendChild(imageElement);
    worksElement.appendChild(figcaptionElement);
  }
}

async function refreshEditGallery() {
  const workFetch = await fetch("http://localhost:5678/api/works");
  const works = await workFetch.json();

  document.querySelector(".modal-galery").innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    const modalWorks = document.querySelector(".modal-galery");
    const workElement = document.createElement("div");
    workElement.style = "position:relative;";
    const workImg = document.createElement("img");
    workImg.src = works[i].imageUrl;
    workImg.alt = works[i].title;
    modalWorks.appendChild(workElement);
    workElement.appendChild(workImg);

    //Créer un bouton delete pour chaque projet chargé
    const deleteWorkButton = document.createElement("div");
    deleteWorkButton.classList.add("btn-delete");
    const deleteWorkIcon = document.createElement("i");
    deleteWorkIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");
    deleteWorkButton.appendChild(deleteWorkIcon);
    workElement.appendChild(deleteWorkButton);

    //EventListener sur les boutons delete qui permet de supprimer les projets de l'api
    deleteWorkButton.addEventListener("click", async (e) => {
      e.preventDefault();
      await fetch(`http://localhost:5678/api/works/${works[i].id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
      });
      refreshEditGallery();
      refreshGallery();
      failurePopUp("Supprimé", "120");
    });
  }
}

const openModal = function () {
  const target = document.getElementById("modal1");
  //Cette ligne va permettre à "display: none" de devenir null, ce qui aura...
  //...pour effet de laisser le CSS prendre le relais sur l'affichage de "modal1"...
  //... qui donc aura comme valeur "flex"...
  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");

  //Cette partie la, permet de définir les actions qui vont fermer la fenetre modale...
  //...la première ligne permet de fermer en cliquant dans la zone extérieur...
  //...de la fenetre, c'est à dire en cliquand sur l'élement "const target"...
  target.addEventListener("click", closeModal);
  //...la deuxième ligne permet de fermer en cliquant sur l'élement qui a comme classe...
  //..."js-modal", c'est à dire le bouton "X" dans la fenetre...
  target.querySelector(".js-modal-close").addEventListener("click", closeModal);
  target
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
};

const closeModal = function () {
  document.getElementById("modal1").remove();
};

function successPopUp() {
  const popUp = document.createElement("div");
  popUp.classList.add("popUp");
  this.document.body.appendChild(popUp);
  popUp.style.fontFamily = "Syne";
  popUp.innerText = "Photo envoyée.";
  popUp.addEventListener("animationend", () => {
    popUp.remove();

    popUp.addEventListener("animationend", () => {
      popUp.remove();
    });
  });
}

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
//Function that create the title of the window (titleSTring = Title InnerText)
function modalTitle(titleString) {
  const modalFrame = document.querySelector(".modal-frame");
  const modalTitle = document.createElement("h3");
  modalTitle.innerText = titleString;
  modalFrame.appendChild(modalTitle);
}

//Function that draw the line in the modal window to separate elements
function line() {
  const modalFrame = document.querySelector(".modal-frame");
  const line = document.createElement("div");
  line.classList.add("line");
  modalFrame.appendChild(line);
}

window.addEventListener("keydown", function (e) {
  console.log();
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
});

window.addEventListener("keydown", function (e) {
  console.log();
  if (e.key === "G" || e.key === "g") {
  }
});
