const API_ENDPOINTS = [
  "https://aks.geoportaal.ee/inaks/inaadress/gazetteer",
  "https://inaadress.maaamet.ee/inaadress/gazetteer",
];

const form = document.querySelector("#address-form");
const addressInput = document.querySelector("#address");
const searchButton = document.querySelector("#search-button");
const inputError = document.querySelector("#input-error");
const status = document.querySelector("#status");
const results = document.querySelector("#results");
const emptyState = document.querySelector("#empty-state");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = addressInput.value.trim();
  inputError.textContent = "";

  if (query.length < 2) {
    inputError.textContent = "Sisesta vähemalt kaks tähemärki.";
    addressInput.focus();
    return;
  }

  setLoading(true);
  results.hidden = true;
  emptyState.hidden = true;
  status.textContent = `Otsin aadressi „${query}”…`;

  try {
    const data = await requestWithFallback(query);
    const addresses = Array.isArray(data.addresses) ? data.addresses : [];

    if (addresses.length === 0) {
      status.textContent = "Selle sisestusega aadresse ei leitud. Proovi täpsemat aadressi.";
      emptyState.hidden = false;
      return;
    }

    renderResults(addresses);
    status.textContent = `Leitud ${addresses.length} ${addresses.length === 1 ? "aadress" : "aadressi"}.`;
  } catch (error) {
    console.error(error);
    status.textContent = "Aadressiteenusega ei õnnestunud ühendust saada. Proovi hetke pärast uuesti.";
    emptyState.hidden = false;
  } finally {
    setLoading(false);
  }
});

function setLoading(isLoading) {
  searchButton.disabled = isLoading;
  searchButton.classList.toggle("is-loading", isLoading);
  addressInput.setAttribute("aria-busy", String(isLoading));
}

async function requestWithFallback(query) {
  let lastError;

  for (const endpoint of API_ENDPOINTS) {
    try {
      return await jsonp(endpoint, { address: query }, 12000);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Aadressiteenus ei vastanud.");
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
      reject(new Error("Päring ebaõnnestus."));
    };

    script.src = `${endpoint}?${query.toString()}`;
    document.head.append(script);
  });
}

function renderResults(addresses) {
  results.replaceChildren(...addresses.map(createResultCard));
  results.hidden = false;
}

function createResultCard(address, index) {
  const article = document.createElement("article");
  article.className = "result-card";

  const resultIndex = document.createElement("div");
  resultIndex.className = "result-index";
  resultIndex.textContent = index === 0 ? "Parim vaste" : `Vaste ${index + 1}`;

  const heading = document.createElement("h2");
  heading.className = "result-address";
  heading.textContent = address.taisaadress || address.pikkaadress || "Aadress puudub";

  const coordinates = document.createElement("div");
  coordinates.className = "coordinates";
  coordinates.append(
    createCoordinate("WGS84", formatWgs84(address.viitepunkt_b, address.viitepunkt_l)),
    createCoordinate("L-EST97", formatLest(address.viitepunkt_x, address.viitepunkt_y)),
  );

  const details = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = "Ametlikud tunnused";
  details.append(summary, createMetadata(address));

  article.append(resultIndex, heading, coordinates, details);
  return article;
}

function createCoordinate(label, value) {
  const box = document.createElement("div");
  box.className = "coordinate-box";

  const name = document.createElement("span");
  name.className = "coordinate-label";
  name.textContent = label;

  const coordinate = document.createElement("span");
  coordinate.className = "coordinate-value";
  coordinate.textContent = value;

  box.append(name, coordinate);
  return box;
}

function createMetadata(address) {
  const list = document.createElement("dl");
  list.className = "metadata";

  const fields = [
    ["ADS OID", address.ads_oid],
    ["ADR ID", address.adr_id],
    ["Objekti liik", address.liikVal],
    ["Sihtnumber", address.sihtnumber],
    ["Maakond", address.maakond],
    ["Omavalitsus", address.omavalitsus],
  ];

  for (const [label, value] of fields) {
    const wrapper = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = value || "—";
    wrapper.append(term, description);
    list.append(wrapper);
  }

  return list;
}

function formatWgs84(latitude, longitude) {
  return latitude && longitude ? `${latitude}, ${longitude}` : "Koordinaadid puuduvad";
}

function formatLest(x, y) {
  return x && y ? `X ${x}  ·  Y ${y}` : "Koordinaadid puuduvad";
}
