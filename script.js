const marcaSelect = document.getElementById("marca");
const modeloSelect = document.getElementById("modelo");
const anoSelect = document.getElementById("ano");
const resultadoDiv = document.getElementById("resultado");

let modelosData = [];

async function carregarMarcas() {
  const response = await fetch("https://parallelum.com.br/fipe/api/v1/carros/marcas");
  const marcas = await response.json();
  marcas.forEach((marca) => {
    const option = document.createElement("option");
    option.value = marca.codigo;
    option.textContent = marca.nome;
    marcaSelect.appendChild(option);
  });
}

marcaSelect.addEventListener("change", async () => {
  modeloSelect.innerHTML = "<option>Carregando...</option>";
  anoSelect.innerHTML = "<option>Selecione o modelo</option>";
  const marca = marcaSelect.value;
  const response = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marca}/modelos`);
  const data = await response.json();
  modelosData = data.modelos;
  modeloSelect.innerHTML = "<option value=''>Selecione o modelo</option>";
  modelosData.forEach((modelo) => {
    const option = document.createElement("option");
    option.value = modelo.codigo;
    option.textContent = modelo.nome;
    modeloSelect.appendChild(option);
  });
});

modeloSelect.addEventListener("change", async () => {
  anoSelect.innerHTML = "<option>Carregando...</option>";
  const marca = marcaSelect.value;
  const modelo = modeloSelect.value;
  const response = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marca}/modelos/${modelo}/anos`);
  const anos = await response.json();
  anoSelect.innerHTML = "<option value=''>Selecione o ano</option>";
  anos.forEach((ano) => {
    const option = document.createElement("option");
    option.value = ano.codigo;
    option.textContent = ano.nome;
    anoSelect.appendChild(option);
  });
});

document.getElementById("checklistForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const marca = marcaSelect.value;
  const modelo = modeloSelect.value;
  const ano = anoSelect.value;

  if (!marca || !modelo || !ano) {
    alert("Selecione marca, modelo e ano.");
    return;
  }

  const res = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marca}/modelos/${modelo}/anos/${ano}`);
  const dados = await res.json();
  const valorFipe = parseFloat(dados.Valor.replace("R$", "").replace(".", "").replace(",", "."));

  const fatores = {
    bom: 1.0,
    regular: 0.95,
    ruim: 0.85,
  };

  let fatorFinal = 1;

  document.querySelectorAll(".checklist-item").forEach((el) => {
    const valor = el.value;
    fatorFinal *= fatores[valor];
  });

  const valorEstimado = (valorFipe * fatorFinal).toFixed(2);

  resultadoDiv.textContent = `Valor estimado: R$ ${valorEstimado}`;
  resultadoDiv.classList.remove("d-none");
});
