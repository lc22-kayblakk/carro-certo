const baseUrl = "https://parallelum.com.br/fipe/api/v1/carros";
const marcaSelect = document.getElementById("marca");
const modeloSelect = document.getElementById("modelo");
const anoSelect = document.getElementById("ano");
const resultadoDiv = document.getElementById("resultado");

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

  valorFipeDiv.textContent = `Valor original da Tabela FIPE: ${dados.Valor}`;
});

  // Cálculo do checklist
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
      } else if (valor === "grande") {
        fatorTotal += parseFloat(item.dataset.grande || 0);
        notaTotal += 3;
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
        <p><strong>Valor estimado de compra:</strong> ${valorFinal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
        <p><strong>Desconto aplicado:</strong> ${valorDescontado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
        <p><strong>Condição geral do carro:</strong> ${condicao}</p>
      `;
  });
  carregarMarcas(); // inicia
});
