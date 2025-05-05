
const marcaSelect = document.getElementById('marca');
const modeloSelect = document.getElementById('modelo');
const anoSelect = document.getElementById('ano');
const resultadoDiv = document.getElementById('resultado');

let valorFipe = 0;

// Pesos do checklist
const pesos = {
  bom: 1,
  regular: 0.9,
  ruim: 0.75
};

async function carregarMarcas() {
  const res = await fetch("https://parallelum.com.br/fipe/api/v1/carros/marcas");
  const marcas = await res.json();
  marcas.forEach(marca => {
    const option = document.createElement("option");
    option.value = marca.codigo;
    option.text = marca.nome;
    marcaSelect.appendChild(option);
  });
}

marcaSelect.addEventListener("change", async () => {
  modeloSelect.disabled = true;
  anoSelect.disabled = true;
  modeloSelect.innerHTML = "<option value=''>Carregando modelos...</option>";

  const res = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelect.value}/modelos`);
  const modelos = await res.json();

  modeloSelect.innerHTML = "<option value=''>Selecione o modelo</option>";
  modelos.modelos.forEach(modelo => {
    const option = document.createElement("option");
    option.value = modelo.codigo;
    option.text = modelo.nome;
    modeloSelect.appendChild(option);
  });

  modeloSelect.disabled = false;
});

modeloSelect.addEventListener("change", async () => {
  anoSelect.disabled = true;
  anoSelect.innerHTML = "<option value=''>Carregando anos...</option>";

  const res = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelect.value}/modelos/${modeloSelect.value}/anos`);
  const anos = await res.json();

  anoSelect.innerHTML = "<option value=''>Selecione o ano</option>";
  anos.forEach(ano => {
    const option = document.createElement("option");
    option.value = ano.codigo;
    option.text = ano.nome;
    anoSelect.appendChild(option);
  });

  anoSelect.disabled = false;
});

anoSelect.addEventListener("change", async () => {
  const res = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelect.value}/modelos/${modeloSelect.value}/anos/${anoSelect.value}`);
  const dados = await res.json();
  valorFipe = parseFloat(dados.Valor.replace("R$", "").replace(".", "").replace(",", "."));
});

document.getElementById('formChecklist').addEventListener('submit', function (e) {
  e.preventDefault();

  if (valorFipe === 0) {
    resultadoDiv.classList.remove('d-none', 'alert-success');
    resultadoDiv.classList.add('alert-warning');
    resultadoDiv.innerText = "Selecione marca, modelo e ano para calcular o valor.";
    return;
  }

  let somaPesos = 0;
  const selects = this.querySelectorAll("select");
  selects.forEach(select => {
    const valor = select.value;
    somaPesos += pesos[valor];
  });

  const mediaPeso = somaPesos / selects.length;
  const valorFinal = valorFipe * mediaPeso;

  resultadoDiv.classList.remove('d-none', 'alert-warning');
  resultadoDiv.classList.add('alert-success');
  resultadoDiv.innerText = `Valor estimado de compra: R$ ${valorFinal.toFixed(2).replace('.', ',')}`;
});

carregarMarcas();
