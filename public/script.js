const urlParams = new URLSearchParams(window.location.search);
const exibition = urlParams.get("exibition");
if (!exibition) {
  fetch(`/data`)
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("grid-container");
      const records = data["records"];
      container.innerHTML = records
        .map(
          (record) =>
            `
    <div class="col">  
      <div class="card h-100 text-center">
        <picture>
          <img class="card-img-top img-fluid" style="height: 200px; object-fit: cover;" src="${record.primaryimageurl}"/>
        </picture>
        <div class="card-body">
          <h3>${record.exhibitionid}</h3>
          <p>${record.title}</p>
        </div>
      </div>
    </div>  
`,
        )
        .join("");
    })
    .catch((error) => {
      document.getElementById("data-container").innerText =
        "ErrorError fetching data";
      console.error("ErrorError fetching data:", error);
    });
} else {
  fetch(`/data/${exibition}`)
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("data-container");
      let adresse = "";
      if (data.venues) {
        adresse = `<p class="card-text">Adresse : ${data.venues[0].address1}, ${data.venues[0].city}, ${data.venues[0].state} ${data.venues[0].zipcode}, ${data.venues[0].country}</p>`;
      }
      let image = "";
      if (data.primaryimageurl) {
        image = `<picture class="picture-container">
        <img class="card-img-top" src="${data.primaryimageurl}"/>
      </picture>`;
      }

      let description = "";
      if (data.shortdescription) {
        description = `<p class="card-text">${data.shortdescription}</p>`;
      }

      let urlExibition = "";
      if (data.url) {
        urlExibition = `<a class="card-link" href="${data.url}">${data.url}</a>`;
      }

      container.innerHTML = `
    
    <div class="card text-center" style="width: 30rem;">
      <h2>Exibition : ${data.exhibitionid}</h2>
      ${image}
      <div class="card-body">
        <h3>${data.title}</h3>
        ${description}
        ${urlExibition}
        ${adresse}
      </div>
    </div>`;
    })
    .catch((error) => {
      document.getElementById("data-container").innerText =
        "Error fetching data";
      console.error("Error fetching data:", error);
    });
}
