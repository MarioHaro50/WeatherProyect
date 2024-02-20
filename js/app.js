const container = document.querySelector(".container");
const result = document.querySelector("#resultado");
const form = document.querySelector("#formulario");

window.addEventListener("load", () => {
    form.addEventListener("submit", searchWeather);
});

function searchWeather(e) {
    e.preventDefault();

    // VALIDAR
    const city = document.querySelector("#ciudad").value;
    const country = document.querySelector("#pais").value;

    if (city === "" || country === "") {
        // HUBO UN ERROR
        showAlert("Hubo un error", "Ambos campos son obligatorios", "error");

        return;
    }

    // CONSULTAR API
    consultAPI(city, country);
}

function consultAPI(city, country) {
    const appID = "0029729490be95345de73cc6091eafbf";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${appID}`;

    showSpinner(); // MUESTRA EL SPINNER

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            // LIMPIAR HTML
            cleanHTML();

            if (data.cod === "404") {
                // HUBO UN ERROR
                showAlert(
                    "Ciudad no encontrada",
                    "No se encontro la ciudad buscada, verifique que se haya escrito bien",
                    "error"
                );

                return;
            }

            // IMPRIMIR RESPUESTA EN EL HTML
            showWeather(data);
        })
        .catch((err) => console.error(err));
}

function showWeather(data) {
    const {
        name,
        main: { temp, temp_min, temp_max },
        weather: [{ description }],
        sys: { country, sunrise, sunset },
    } = data;

    // CONVERTIR A GRADOS CENTIGRADOS
    const temp_c = kelvinToCelsius(temp);
    const temp_min_c = kelvinToCelsius(temp_min);
    const temp_max_c = kelvinToCelsius(temp_max);

    const nameCity = document.createElement("p");
    nameCity.innerHTML = `${name}, ${country}`;
    nameCity.classList.add("text-3xl", "font-bold");

    const actualTemp = document.createElement("p");
    actualTemp.innerHTML = ` ${temp_c} &#8451`;
    actualTemp.classList.add("text-6xl", "font-bold");

    const tempMax = document.createElement("p");
    tempMax.innerHTML = ` Maxima: ${temp_max_c} &#8451`;
    tempMax.classList.add("text-xl", "font-bold");

    const tempMin = document.createElement("p");
    tempMin.innerHTML = ` Minima: ${temp_min_c} &#8451`;
    tempMin.classList.add("text-xl", "font-bold");

    const descriptionTemp = document.createElement("p");
    const iconClass = getIcon(description)
    descriptionTemp.innerHTML = `<i class="${iconClass}"></i>`;
    descriptionTemp.classList.add("text-xl", "font-bold");

    const resultadoDiv = document.createElement("div");
    resultadoDiv.classList.add("text-center", "text-white");

    resultadoDiv.appendChild(nameCity);
    resultadoDiv.appendChild(actualTemp);
    resultadoDiv.appendChild(tempMax);
    resultadoDiv.appendChild(tempMin);
    resultadoDiv.appendChild(descriptionTemp);

    result.appendChild(resultadoDiv);
}

const kelvinToCelsius = (kelvinGrades) =>
    Math.round((kelvinGrades - 273.15) * 10) / 10;

function getIcon(description) {
    switch (description) {
        case "clear sky":
            return "fa-solid fa-sun";
        case "few clouds":
            return "fa-solid fa-cloud-sun";
        case "scattered clouds":
            return "fa-solid fa-cloud-sun";
        case "broken clouds":
            return "fa-solid fa-cloud-sun";
        case "shower rain":
            return "fa-solid fa-cloud-showers-heavy";
        case "rain":
            return "fa-solid fa-cloud-rain";
        case "thunderstorm":
            return "fa-solid fa-cloud-rain";
        case "snow":
            return "fa-solid fa-cloud-snow";
        case "mist":
            return "fa-solid fa-cloud-fog";
        case "haze":
            return "fa-solid fa-cloud-fog";
        case "fog":
            return "fa-solid fa-cloud-fog";
        default:
            return "fa-solid fa-sun";
    }
}

function showAlert(tit = "title", msg = "message", type = "info") {
    Swal.fire({
        title: tit,
        text: msg,
        icon: type,
    });
}

function cleanHTML() {
    while (result.firstChild) {
        result.removeChild(result.firstChild);
    }
}

function showSpinner() {
    cleanHTML();

    const divSpinner = document.createElement("div");

    divSpinner.classList.add('spinner');

    result.appendChild(divSpinner);
}