
const checklistItens = [
  "Pneus", "Rodas", "Suspensão", "Freios", 
  "Lataria", "Pintura", "Interior", "Documentação"
];

document.addEventListener("DOMContentLoaded", async () => {
  const marcaSelect = document.getElementById("marca");
  const modeloSelect = document.getElementById("modelo");
  const anoSelect = document.getElementById("ano");
  const checklistDiv = document.getElementById("checklist");

  // Monta o checklist
  checklistItens.forEach(item => {
    checklistDiv.innerHTML += `
      <div class="form-check">
        <label class="form-label">${item}</label>
        <select class="form-select checklist-opcao" data-item="${item}">
          <option value="bom">Bom</option>
          <option value="regular">Regular</option>
          <option value="ruim">Ruim</option>
        </select>
      </div>
    `;
  });

  // Carrega marcas
  const marcas = await fetch("https://parallelum.com.br/fipe/api/v1/carros/marcas").then(r => r.json());
  marcas.forEach(m => {
    marcaSelect.innerHTML += `<option value="${m.codigo}">${m.nome}</option>`;
  });

  marcaSelect.addEventListener("change", async () => {
    modeloSelect.innerHTML = `<option>Carregando...</option>`;
    const modelos = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelect.value}/modelos`)
      .then(r => r.json());
    modeloSelect.innerHTML = "";
    modelos.modelos.forEach(m => {
      modeloSelect.innerHTML += `<option value="${m.codigo}">${m.nome}</option>`;
    });
  });

  modeloSelect.addEventListener("change", async () => {
    anoSelect.innerHTML = `<option>Carregando...</option>`;
    const anos = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelect.value}/modelos/${modeloSelect.value}/anos`)
      .then(r => r.json());
    anoSelect.innerHTML = "";
    anos.forEach(a => {
      anoSelect.innerHTML += `<option value="${a.codigo}">${a.nome}</option>`;
    });
  });

  anoSelect.addEventListener("change", async () => {
    const url = `https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelect.value}/modelos/${modeloSelect.value}/anos/${anoSelect.value}`;
    const data = await fetch(url).then(r => r.json());
    document.getElementById("valorFipe").textContent = data.Valor;
    calcularEstimativa(data.Valor);
  });

  document.getElementById("checklistForm").addEventListener("change", () => {
    const fipe = document.getElementById("valorFipe").textContent.replace("R$","").replace(".","").replace(",",".");
    if (parseFloat(fipe) > 0) calcularEstimativa(`R$ ${fipe}`);
  });
});

function calcularEstimativa(valorFipeStr) {
  let valor = parseFloat(valorFipeStr.replace("R$","").replace(".","").replace(",","."));
  let desconto = 0;
  const opcoes = document.querySelectorAll(".checklist-opcao");

  opcoes.forEach(select => {
    const val = select.value;
    if (val === "regular") desconto += 0.03;
    if (val === "ruim") desconto += 0.07;
  });

  const valorFinal = valor * (1 - desconto);
  document.getElementById("valorEstimado").textContent = formatarValor(valorFinal);
}

function formatarValor(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
