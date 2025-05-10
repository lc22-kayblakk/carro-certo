const baseUrl = "https://parallelum.com.br/fipe/api/v1/carros";
const marcaSelect = document.getElementById("marca");
const modeloSelect = document.getElementById("modelo");
const anoSelect = document.getElementById("ano");
const resultadoDiv = document.getElementById("resultado");
const valorFipeDiv = document.getElementById("valor-fipe");

let valorFipeAtual = 0;

async function carregarMarcas() {
  const res = await fetch(`${baseUrl}/marcas`);
  const marcas = await res.json();
  marcaSelect.innerHTML = '<option selected>Selecione</option>';
  marcas.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.codigo;
    opt.textContent = m.nome;
    marcaSelect.appendChild(opt);
  });
}

marcaSelect.addEventListener("change", async () => {
  const marcaId = marcaSelect.value;
  const res = await fetch(`${baseUrl}/marcas/${marcaId}/modelos`);
  const modelos = await res.json();
  modeloSelect.innerHTML = '<option selected>Selecione</option>';
  modelos.modelos.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.codigo;
    opt.textContent = m.nome;
    modeloSelect.appendChild(opt);
  });
});

modeloSelect.addEventListener("change", async () => {
  const marcaId = marcaSelect.value;
  const modeloId = modeloSelect.value;
  const res = await fetch(`${baseUrl}/marcas/${marcaId}/modelos/${modeloId}/anos`);
  const anos = await res.json();
  anoSelect.innerHTML = '<option selected>Selecione</option>';
  anos.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a.codigo;
    opt.textContent = a.nome;
    anoSelect.appendChild(opt);
  });
});

anoSelect.addEventListener("change", async () => {
  const marcaId = marcaSelect.value;
  const modeloId = modeloSelect.value;
  const anoId = anoSelect.value;
  const res = await fetch(`${baseUrl}/marcas/${marcaId}/modelos/${modeloId}/anos/${anoId}`);
  const dados = await res.json();

  valorFipeAtual = parseFloat(dados.Valor.replace("R$", "").replace(".", "").replace(",", "."));

  // EXIBE o valor original da FIPE na página
  valorFipeDiv.textContent = `Valor original da Tabela FIPE: ${dados.Valor}`;
});

document.getElementById("checklist-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const itens = document.querySelectorAll(".checklist-item");
  let fatorTotal = 0;

  itens.forEach(item => {
    const valor = item.value;
    if (valor === "regular") {
      fatorTotal += parseFloat(item.dataset.regular || 0);
    } else if (valor === "ruim") {
      fatorTotal += parseFloat(item.dataset.ruim || 0);
    }
  });

  const valorFinal = valorFipeAtual * (1 - fatorTotal);
  resultadoDiv.textContent = isNaN(valorFinal)
    ? "Selecione marca, modelo e ano primeiro."
    : `Valor estimado de compra: R$ ${valorFinal.toFixed(2).replace(".", ",")}`;
});


  const valorFinal = valorFipeAtual * (1 - fatorTotal);
  resultadoDiv.textContent = isNaN(valorFinal)
    ? "Selecione marca, modelo e ano primeiro."
    : `Valor estimado de compra: R$ ${valorFinal.toFixed(2).replace(".", ",")}`;
});

carregarMarcas();
