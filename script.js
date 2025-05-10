const baseUrl = "https://parallelum.com.br/fipe/api/v1/carros";
const marcaSelect = document.getElementById("marca");
const modeloSelect = document.getElementById("modelo");
const anoSelect = document.getElementById("ano");
const resultadoDiv = document.getElementById("resultado");
const valorFipeDiv = document.getElementById("valor-fipe");

let valorFipeAtual = 0;

// Carregar marcas
async function carregarMarcas() {
  const res = await fetch(`${baseUrl}/marcas`);
  const marcas = await res.json();
  marcaSelect.innerHTML = '<option selected disabled>Selecione</option>';
  marcas.forEach(marca => {
    const opt = document.createElement("option");
    opt.value = marca.codigo;
    opt.textContent = marca.nome;
    marcaSelect.appendChild(opt);
  });
}

// Carregar modelos
marcaSelect.addEventListener("change", async () => {
  const res = await fetch(`${baseUrl}/marcas/${marcaSelect.value}/modelos`);
  const modelos = await res.json();
  modeloSelect.innerHTML = '<option selected disabled>Selecione</option>';
  modelos.modelos.forEach(modelo => {
    const opt = document.createElement("option");
    opt.value = modelo.codigo;
    opt.textContent = modelo.nome;
    modeloSelect.appendChild(opt);
  });
});

// Carregar anos
modeloSelect.addEventListener("change", async () => {
  const res = await fetch(`${baseUrl}/marcas/${marcaSelect.value}/modelos/${modeloSelect.value}/anos`);
  const anos = await res.json();
  anoSelect.innerHTML = '<option selected disabled>Selecione</option>';
  anos.forEach(ano => {
    const opt = document.createElement("option");
    opt.value = ano.codigo;
    opt.textContent = ano.nome;
    anoSelect.appendChild(opt);
  });
});

// Buscar valor FIPE
anoSelect.addEventListener("change", async () => {
  const res = await fetch(`${baseUrl}/marcas/${marcaSelect.value}/modelos/${modeloSelect.value}/anos/${anoSelect.value}`);
  const dados = await res.json();
  valorFipeAtual = parseFloat(dados.Valor.replace("R$", "").replace(".", "").replace(",", "."));
  valorFipeDiv.textContent = `Valor original da Tabela FIPE: ${dados.Valor}`;
});

// Cálculo final do checklist
document.getElementById("checklist-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const itens = document.querySelectorAll(".checklist-item");
  let fatorTotal = 0;
  let notaTotal = 0;

  itens.forEach(item => {
    const valor = item.value;
    if (valor === "regular") {
      fatorTotal += parseFloat(item.dataset.regular || 0);
      notaTotal += 1;
    } else if (valor === "ruim") {
      fatorTotal += parseFloat(item.dataset.ruim || 0);
      notaTotal += 2;
    } else {
      notaTotal += 0;
    }
  });

  const media = notaTotal / itens.length;
  let condicao = "";
  if (media <= 0.5) condicao = "Bom ✅";
  else if (media <= 1.2) condicao = "Aceitável ⚠️";
  else condicao = "Ruim ❌";

  const valorDescontado = valorFipeAtual * fatorTotal;
  const valorFinal = valorFipeAtual - valorDescontado;

  resultadoDiv.innerHTML = isNaN(valorFinal)
    ? "Selecione marca, modelo e ano primeiro."
    : `
      <p><strong>Valor estimado de compra:</strong> R$ ${valorFinal.toFixed(2).replace(".", ",")}</p>
      <p><strong>Desconto aplicado:</strong> R$ ${valorDescontado.toFixed(2).replace(".", ",")}</p>
      <p><strong>Condição geral do carro:</strong> ${condicao}</p>
    `;
});

// Iniciar carregamento
carregarMarcas();
