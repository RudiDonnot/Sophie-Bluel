async function genererProjet() {
  const workfetch = await fetch("http://localhost:5678/api/works");
  const works = await workfetch.json();
  const categoryFetch = await fetch("http://localhost:5678/api/categories");
  const category = await categoryFetch.json();
  createGallery(works);
  noFilterButton(works);
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
    const sectionFilter = document.querySelector(".filter");
    const button = document.createElement("button");

    button.classList.add("btn-filter");
    button.innerText = category[i].name;
    sectionFilter.appendChild(button);

    button.addEventListener("click", () => {
      document.querySelector(".gallery").innerHTML = "";
      const allFilters = sectionFilter.querySelectorAll(".btn-filter");
      allFilters.forEach((button) => {
        button.classList.remove("--selected");
      });
      button.classList.add("--selected");
      const worksFiltered = works.filter(function (worksFiltering) {
        if (worksFiltering.category.name == category[i].name)
          return worksFiltering;
      });

      createGallery(worksFiltered);
    });
  }
}

function noFilterButton(works) {
  const sectionFilter = document.querySelector(".filter");
  const noFilterButton = document.createElement("button");

  noFilterButton.classList.add("btn-filter");
  noFilterButton.classList.add("--selected");
  noFilterButton.innerText = "Tous";
  sectionFilter.appendChild(noFilterButton);

  noFilterButton.addEventListener("click", (event) => {
    document.querySelector(".gallery").innerHTML = "";
    const allFilters = sectionFilter.querySelectorAll(".btn-filter");
    allFilters.forEach((button) => {
      button.classList.remove("--selected");
    });
    event.target.classList.add("--selected");
    createGallery(works);
  });
}
