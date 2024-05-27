async function genererProjet() {
  const workfetch = await fetch("http://localhost:5678/api/works");
  const works = await workfetch.json();
  const categoryFetch = await fetch("http://localhost:5678/api/categories");
  const category = await categoryFetch.json();
  createGallery(works);
  createTousButton(works);
  createFilterButton(works, category);
}

genererProjet();

function createGallery(works) {
  for (let i = 0; i < works.length; i++) {
    const selectedWorks = works[i];
    const sectionGallery = document.querySelector(".gallery");
    const worksElements = document.createElement("figure");
    const imageElement = document.createElement("img");
    const figCaptionElement = document.createElement("figcaption");

    imageElement.src = selectedWorks.imageUrl;
    imageElement.alt = selectedWorks.title;
    figCaptionElement.innerText = selectedWorks.title;

    sectionGallery.appendChild(worksElements);
    worksElements.appendChild(imageElement);
    worksElements.appendChild(figCaptionElement);
  }
}

function createFilterButton(works, category) {
  for (let i = 0; i < category.length; i++) {
    const filterSection = document.querySelector(".filter");
    const button = document.createElement("button");

    button.classList.add("filterbutton");
    button.innerText = category[i].name;
    filterSection.appendChild(button);

    button.addEventListener("click", () => {
      document.querySelector(".gallery").innerHTML = "";
      const allFilters = filterSection.querySelectorAll(".filterbutton");
      allFilters.forEach((button) => {
        button.classList.remove("filterselected");
      });
      button.classList.add("filterselected");
      const worksFiltered = works.filter(function (worksFiltering) {
        if (worksFiltering.category.name == category[i].name)
          return worksFiltering;
      });

      createGallery(worksFiltered);
    });
  }
}

function createTousButton(works) {
  const filterSection = document.querySelector(".filter");
  const tousButton = document.createElement("button");

  tousButton.classList.add("filterbutton");
  tousButton.classList.add("filterselected");
  tousButton.innerText = "Tous";
  filterSection.appendChild(tousButton);

  tousButton.addEventListener("click", (event) => {
    document.querySelector(".gallery").innerHTML = "";
    const allFilters = filterSection.querySelectorAll(".filterbutton");
    allFilters.forEach((button) => {
      button.classList.remove("filterselected");
    });
    event.target.classList.add("filterselected");
    createGallery(works);
  });
}
