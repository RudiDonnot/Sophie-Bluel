let myToken = window.sessionStorage.getItem("token");

if (myToken) {
  const filter = document.querySelector(".filter");
  filter.style.display = "none";

  {
    const loggout = document.querySelector(".login");
    loggout.innerText = "logout";
    loggout.addEventListener("click", () => {
      window.sessionStorage.removeItem("token");
      location.reload();
    });
  }
  {
    document.querySelector("header").style.marginTop = "100px";
    const editModeHeader = document.querySelector("#modeedition");
    editModeHeader.classList.add("editModeHeader");

    const headerEditIcon = document.createElement("i");
    headerEditIcon.classList.add("fa-regular", "fa-pen-to-square");
    editModeHeader.appendChild(headerEditIcon);

    const headerEditModeText = document.createElement("p");
    headerEditModeText.innerText = "Mode édition";
    headerEditModeText.classList.add("headerEditText");
    editModeHeader.appendChild(headerEditModeText);
  }
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
    window.location.replace("./pagedeconnexion.html");
  });
}

function modalOverAll() {
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

async function editWorksInterface() {
  const modalFrame = document.querySelector(".modal-frame");
  modalExitButton();
  modalTitle("Galerie Photo");

  const galery = document.createElement("div");
  galery.classList.add("modal-galery");
  modalFrame.appendChild(galery);

  const fetchWork = await fetch("http://localhost:5678/api/works");
  const works = await fetchWork.json();

  for (let i = 0; i < works.length; i++) {
    const modalWorks = document.querySelector(".modal-galery");
    const workElement = document.createElement("div");
    workElement.style = "position:relative;";
    const workImg = document.createElement("img");
    workImg.src = works[i].imageUrl;
    workImg.alt = works[i].title;
    modalWorks.appendChild(workElement);
    workElement.appendChild(workImg);

    const deleteWorkButton = document.createElement("div");
    deleteWorkButton.classList.add("btn-delete");
    const deleteWorkIcon = document.createElement("i");
    deleteWorkIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");
    deleteWorkButton.appendChild(deleteWorkIcon);
    workElement.appendChild(deleteWorkButton);

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

  const addButton = document.createElement("button");
  addButton.classList.add("addButton");
  addButton.innerText = "Ajouter une photo";
  modalFrame.appendChild(addButton);

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

  const form = document.createElement("form");
  form.classList.add("addpicture-wrap");
  modalFrame.appendChild(form);

  const chooseImgWrap = document.createElement("div");
  chooseImgWrap.classList.add("chooseImg-wrap");
  form.appendChild(chooseImgWrap);

  const chooseImgLogo = document.createElement("i");
  chooseImgLogo.classList.add("fa-regular", "fa-image");

  const labelAddPicture = document.createElement("label");
  labelAddPicture.setAttribute("for", "addPicture-btn");
  labelAddPicture.classList.add("addPicture-label");
  labelAddPicture.innerHTML = "+ Ajouter photo";

  const addPicture = document.createElement("input");
  addPicture.setAttribute("name", "addPicture");
  addPicture.setAttribute("type", "file");
  addPicture.setAttribute("id", "addPicture-btn");
  addPicture.setAttribute("accept", ".png, .jpeg, .jpg");

  const infoAddPicture = document.createElement("p");
  infoAddPicture.classList.add("infoAddPicture");
  infoAddPicture.innerText = "jpg, png : 4mo max";

  chooseImgWrap.appendChild(chooseImgLogo);
  chooseImgWrap.appendChild(labelAddPicture);
  chooseImgWrap.appendChild(addPicture);
  chooseImgWrap.appendChild(infoAddPicture);

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

  const titleLabel = document.createElement("label");
  titleLabel.setAttribute("for", "title");
  titleLabel.classList.add("label-form");
  titleLabel.innerText = "Titre";

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

  const elemArray = [];
  elemArray[0] = document.querySelector("#addPicture-btn");
  elemArray[1] = document.querySelector("#title");
  elemArray[2] = document.querySelector("#category");

  const Testclick = document.querySelector("#title");
  Testclick.addEventListener("change", (event) =>
    console.log(elemArray[0].value, elemArray[1].value, elemArray[2].value)
  );

  const areFieldsFilled = (elemArray) => {
    let valueExist = true;
    for (const elem of elemArray) {
      if (!elem.value) {
        return false;
      }
    }
    return valueExist;
  };

  if (areFieldsFilled(elemArray)) console.log("hello");

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
    }).then((response) => {
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

function modalExitButton() {
  const modalFrame = document.querySelector(".modal-frame");
  const modalExitButton = document.createElement("div");
  modalExitButton.classList.add("js-modal-close");
  modalExitButton.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
  modalFrame.appendChild(modalExitButton);
  modalExitButton.addEventListener("click", closeModal);
}

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

    const worksElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    const figcaptionElement = document.createElement("figcaption");

    imageElement.src = selectedWorks.imageUrl;
    imageElement.alt = selectedWorks.title;
    figcaptionElement.innerText = selectedWorks.title;

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

    const deleteWorkButton = document.createElement("div");
    deleteWorkButton.classList.add("btn-delete");
    const deleteWorkIcon = document.createElement("i");
    deleteWorkIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");
    deleteWorkButton.appendChild(deleteWorkIcon);
    workElement.appendChild(deleteWorkButton);

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

  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");

  target.addEventListener("click", closeModal);

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

function modalTitle(titleString) {
  const modalFrame = document.querySelector(".modal-frame");
  const modalTitle = document.createElement("h3");
  modalTitle.innerText = titleString;
  modalFrame.appendChild(modalTitle);
}

function line() {
  const modalFrame = document.querySelector(".modal-frame");
  const line = document.createElement("div");
  line.classList.add("line");
  modalFrame.appendChild(line);
}

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
});
