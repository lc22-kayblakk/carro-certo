
let marcas, modelos, anos, valorFipe = 0;
const checklistData = [
  { item: "Pneus e Rodas", pesos: { bom: 0, regular: -2, ruim: -5 } },
  { item: "Suspensão", pesos: { bom: 0, regular: -3, ruim: -6 } },
  { item: "Freios", pesos: { bom: 0, regular: -3, ruim: -7 } },
  { item: "Lataria e Pintura", pesos: { bom: 0, regular: -4, ruim: -10 } },
  { item: "Interior", pesos: { bom: 0, regular: -2, ruim: -5 } },
  { item: "Documentação", pesos: { bom: 0, regular: -5, ruim: -10 } }
];

async function carregarMarcas() {
  const res = await fetch("https://parallelum.com.br/fipe/api/v1/carros/marcas");
  const data = await res.json();
  const marcaSelect = document.getElementById("marca");
  marcaSelect.innerHTML = "<option value=''>Selecione a marca</option>";
  data.forEach(marca => {
    const opt = document.createElement("option");
    opt.value = marca.codigo;
    opt.textContent = marca.nome;
    marcaSelect.appendChild(opt);
  });
  marcaSelect.onchange = carregarModelos;
}

async function carregarModelos() {
  const marca = document.getElementById("marca").value;
  if (!marca) return;
  const res = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marca}/modelos`);
  const data = await res.json();
  const modeloSelect = document.getElementById("modelo");
  modeloSelect.innerHTML = "<option value=''>Selecione o modelo</option>";
  data.modelos.forEach(mod => {
    const opt = document.createElement("option");
    opt.value = mod.codigo;
    opt.textContent = mod.nome;
    modeloSelect.appendChild(opt);
  });
  modeloSelect.onchange = carregarAnos;
}

async function carregarAnos() {
  const marca = document.getElementById("marca").value;
  const modelo = document.getElementById("modelo").value;
  if (!modelo) return;
  const res = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marca}/modelos/${modelo}/anos`);
  const data = await res.json();
  const anoSelect = document.getElementById("ano");
  anoSelect.innerHTML = "<option value=''>Selecione o ano</option>";
  data.forEach(ano => {
    const opt = document.createElement("option");
    opt.value = ano.codigo;
    opt.textContent = ano.nome;
    anoSelect.appendChild(opt);
  });
  anoSelect.onchange = carregarValorFipe;
}

async function carregarValorFipe() {
  const marca = document.getElementById("marca").value;
  const modelo = document.getElementById("modelo").value;
  const ano = document.getElementById("ano").value;
  if (!ano) return;
  const res = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marca}/modelos/${modelo}/anos/${ano}`);
  const data = await res.json();
  valorFipe = parseFloat(data.Valor.replace("R$", "").replace(".", "").replace(",", "."));
}

function gerarChecklist() {
  const container = document.getElementById("checklist-container");
  checklistData.forEach((item, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <label>${item.item}</label>
      <select id="item-${i}">
        <option value="bom">Bom</option>
        <option value="regular">Regular</option>
        <option value="ruim">Ruim</option>
      </select>
    `;
    container.appendChild(div);
  });
}

function calcularValor() {
  let desconto = 0;
  checklistData.forEach((item, i) => {
    const condicao = document.getElementById(`item-${i}`).value;
    desconto += item.pesos[condicao] || 0;
  });
  const valorFinal = valorFipe * (1 - desconto / 100);
  document.getElementById("resultado").innerHTML =
    `Valor estimado com base no estado do veículo: R$ ${valorFinal.toFixed(2).replace('.', ',')}`;
}

window.onload = () => {
  carregarMarcas();
  gerarChecklist();
};
