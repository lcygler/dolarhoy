document.addEventListener("DOMContentLoaded", async () => {
  const reloadBtn = document.getElementById("reloadBtn");
  reloadBtn.addEventListener("click", async () => {
    await loadData();
  });

  await loadData();
});

const loadData = async () => {
  const dolarData = await getDolarData();
  const tableBody = document.querySelector("#table tbody");
  tableBody.innerHTML = "";

  dolarData.forEach((dolar) => {
    const row = createRow(dolar);
    tableBody.appendChild(row);
  });

  updateLastUpdatedTime();
};

const createRow = (dolar) => {
  const row = document.createElement("tr");

  const nameCell = document.createElement("td");
  nameCell.textContent = dolar.nombre;
  nameCell.classList.add("ps-3");
  row.appendChild(nameCell);

  const buyCell = document.createElement("td");
  buyCell.textContent = `$${dolar.compra.toFixed(2)}`;
  row.appendChild(buyCell);

  const sellCell = document.createElement("td");
  sellCell.textContent = `$${dolar.venta.toFixed(2)}`;
  sellCell.classList.add("pe-3");
  row.appendChild(sellCell);

  return row;
};

const getDolarData = async () => {
  try {
    const res = await fetch("https://dolarapi.com/v1/dolares");

    if (!res.ok) {
      throw new Error("Error al obtener los datos.");
    }

    const json = await res.json();
    return mapDolarData(json);
  } catch (error) {
    console.error(error.message);
    return [];
  }
};

const mapDolarData = (json) => {
  return json
    .map((dolar) => {
      let nombre = "";

      switch (dolar.casa) {
        case "oficial":
          nombre = "Oficial";
          break;
        case "blue":
          nombre = "Blue";
          break;
        case "bolsa":
          nombre = "Bolsa";
          break;
        case "contadoconliqui":
          nombre = "CCL";
          break;
        case "cripto":
          nombre = "Cripto";
          break;
        case "tarjeta":
          nombre = "Tarjeta";
          break;
        case "mayorista":
          nombre = "Mayorista";
          break;
        default:
          nombre = dolar.nombre;
      }

      return { nombre, compra: dolar.compra, venta: dolar.venta, order: dolarOrder[dolar.casa] };
    })
    .sort((a, b) => a.order - b.order);
};

const dolarOrder = {
  oficial: 1,
  blue: 2,
  bolsa: 3,
  contadoconliqui: 4,
  cripto: 5,
  tarjeta: 6,
  mayorista: 7,
};

const updateLastUpdatedTime = () => {
  const lastUpdated = document.getElementById("lastUpdated");
  const currentTime = new Date();
  const formattedTime = `${currentTime.getHours()}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
  lastUpdated.textContent = `Últ. actualización: ${formattedTime} hs.`;
};
