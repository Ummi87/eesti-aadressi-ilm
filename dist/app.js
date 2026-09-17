const ADDRESS_API_ENDPOINTS = [
  "https://aks.geoportaal.ee/inaks/inaadress/gazetteer",
  "https://inaadress.maaamet.ee/inaadress/gazetteer",
];
const WEATHER_API_ENDPOINT = "https://api.open-meteo.com/v1/forecast";
const LAST_ADDRESS_KEY = "eesti-aadressi-ilm:last-address";

const form = document.querySelector("#address-form");
const addressInput = document.querySelector("#address");
const searchButton = document.querySelector("#search-button");
const inputError = document.querySelector("#input-error");
const status = document.querySelector("#status");
const result = document.querySelector("#result");
const resultAddress = document.querySelector("#result-address");
const temperature = document.querySelector("#temperature");
const wind = document.querySelector("#wind");

let map;
let marker;

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await searchAddress(addressInput.value);
});

restoreLastAddress();

async function searchAddress(rawQuery) {
  const query = rawQuery.trim();
  inputError.textContent = "";
  addressInput.setAttribute("aria-invalid", "false");

  if (query.length < 2) {
    inputError.textContent = "Sisesta vähemalt kaks tähemärki.";
    addressInput.setAttribute("aria-invalid", "true");
    addressInput.focus();
    return;
  }

  setLoading(true);
  result.hidden = true;
  status.textContent = `Otsin aadressi „${query}”…`;

  try {
    const address = await findAddress(query);
    const latitude = Number(address.viitepunkt_b);
    const longitude = Number(address.viitepunkt_l);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new Error("Aadressil puuduvad koordinaadid.");
    }

    status.textContent = "Küsin praegust ilma…";
    const weather = await fetchCurrentWeather(latitude, longitude);
    const officialAddress = address.taisaadress || address.pikkaadress || query;

    showResult({ officialAddress, latitude, longitude, weather });
    saveLastAddress(officialAddress);
    addressInput.value = officialAddress;
    status.textContent = "";
  } catch (error) {
    console.error(error);
    status.textContent = error.message || "Andmeid ei õnnestunud laadida. Proovi uuesti.";
  } finally {
    setLoading(false);
  }
}

async function findAddress(query) {
  let lastError;

  for (const endpoint of ADDRESS_API_ENDPOINTS) {
    try {
      const data = await jsonp(endpoint, { address: query }, 12000);
      const addresses = Array.isArray(data.addresses) ? data.addresses : [];

      if (addresses.length === 0) {
        throw new Error("Selle sisestusega aadressi ei leitud.");
      }

      return addresses[0];
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Aadressiteenusega ei õnnestunud ühendust saada.");
}

async function fetchCurrentWeather(latitude, longitude) {
  const parameters = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,wind_speed_10m",
    wind_speed_unit: "ms",
    timezone: "auto",
  });
  const response = await fetch(`${WEATHER_API_ENDPOINT}?${parameters.toString()}`);

  if (!response.ok) {
    throw new Error("Ilmateenusega ei õnnestunud ühendust saada.");
  }

  const data = await response.json();
  const current = data.current;

  if (!current || current.temperature_2m == null || current.wind_speed_10m == null) {
    throw new Error("Ilmateenus ei tagastanud praeguseid andmeid.");
  }

  return {
    temperature: current.temperature_2m,
    temperatureUnit: data.current_units?.temperature_2m || "°C",
    windSpeed: current.wind_speed_10m,
    windUnit: data.current_units?.wind_speed_10m || "m/s",
  };
}

function showResult({ officialAddress, latitude, longitude, weather }) {
  resultAddress.textContent = officialAddress;
  temperature.textContent = `${formatNumber(weather.temperature)} ${weather.temperatureUnit}`;
  wind.textContent = `${formatNumber(weather.windSpeed)} ${weather.windUnit}`;
  result.hidden = false;
  window.requestAnimationFrame(() => updateMap(latitude, longitude, officialAddress));
}

function updateMap(latitude, longitude, officialAddress) {
  if (!map) {
    map = L.map("map", { zoomControl: false }).setView([latitude, longitude], 16);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    marker = L.marker([latitude, longitude]).addTo(map);
  } else {
    map.setView([latitude, longitude], 16);
    marker.setLatLng([latitude, longitude]);
  }

  map.invalidateSize();
}

function setLoading(isLoading) {
  searchButton.disabled = isLoading;
  searchButton.classList.toggle("is-loading", isLoading);
  addressInput.setAttribute("aria-busy", String(isLoading));
}

function restoreLastAddress() {
  try {
    const savedAddress = localStorage.getItem(LAST_ADDRESS_KEY);
    if (!savedAddress) return;

    addressInput.value = savedAddress;
    searchAddress(savedAddress);
  } catch (error) {
    console.warn("Viimase aadressi lugemine ebaõnnestus.", error);
  }
}

function saveLastAddress(address) {
  try {
    localStorage.setItem(LAST_ADDRESS_KEY, address);
  } catch (error) {
    console.warn("Viimase aadressi salvestamine ebaõnnestus.", error);
  }
}

function formatNumber(value) {
  return new Intl.NumberFormat("et-EE", { maximumFractionDigits: 1 }).format(value);
}

function jsonp(endpoint, parameters, timeoutMs) {
  return new Promise((resolve, reject) => {
    const callbackName = `__inAks_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const query = new URLSearchParams({ ...parameters, callback: callbackName });
    let settled = false;

    const cleanUp = () => {
      script.remove();
      window[callbackName] = () => {};
      window.setTimeout(() => delete window[callbackName], 60000);
    };

    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanUp();
      reject(new Error("Päring aegus."));
    }, timeoutMs);

    window[callbackName] = (data) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      cleanUp();
      resolve(data);
    };

    script.onerror = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      cleanUp();
      reject(new Error("Aadressiteenusega ei õnnestunud ühendust saada."));
    };

    script.src = `${endpoint}?${query.toString()}`;
    document.head.append(script);
  });
}
