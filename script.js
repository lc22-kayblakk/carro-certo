const apiBase = "https://parallelum.com.br/fipe/api/v1/carros/marcas";
let modeloSelecionado = "";
let anoSelecionado = "";
let codigoFipeSelecionado = "";

async function carregarMarcas() {
  const res = await fetch(apiBase);
  const marcas = await res.json();
  const marcaSelect = document.getElementById("marca");
  marcaSelect.innerHTML = "<option value=''>Selecione a marca</option>";
  marcas.forEach(marca => {
    const opt = document.createElement("option");
    opt.value = marca.codigo;
    opt.textContent = marca.nome;
    marcaSelect.appendChild(opt);
  });
}

document.getElementById("marca").addEventListener("change", async function () {
  const marcaId = this.value;
  const res = await fetch(`${apiBase}/${marcaId}/modelos`);
  const data = await res.json();
  const modelos = data.modelos;
  const modeloSelect = document.getElementById("modelo");
  modeloSelect.innerHTML = "<option value=''>Selecione o modelo</option>";
  modelos.forEach(modelo => {
    const opt = document.createElement("option");
    opt.value = modelo.codigo;
    opt.textContent = modelo.nome;
    modeloSelect.appendChild(opt);
  });
});

document.getElementById("modelo").addEventListener("change", async function () {
  const marcaId = document.getElementById("marca").value;
  modeloSelecionado = this.value;
  const res = await fetch(`${apiBase}/${marcaId}/modelos/${modeloSelecionado}/anos`);
  const anos = await res.json();
  const anoSelect = document.getElementById("ano");
  anoSelect.innerHTML = "<option value=''>Selecione o ano</option>";
  anos.forEach(ano => {
    const opt = document.createElement("option");
    opt.value = ano.codigo;
    opt.textContent = ano.nome;
    anoSelect.appendChild(opt);
  });
});

document.getElementById("ano").addEventListener("change", async function () {
  const marcaId = document.getElementById("marca").value;
  const modeloId = document.getElementById("modelo").value;
  const anoId = this.value;
  anoSelecionado = anoId;
  const res = await fetch(`${apiBase}/${marcaId}/modelos/${modeloId}/anos/${anoId}`);
  const data = await res.json();
  codigoFipeSelecionado = data.CodigoFipe;
});

async function calcularValorJusto() {
  if (!codigoFipeSelecionado) return alert("Selecione todos os campos corretamente.");

  try {
    const res = await fetch(`https://brasilapi.com.br/api/fipe/preco/v1/${codigoFipeSelecionado}`);
    const data = await res.json();
    if (!data || data.length === 0) return alert("Valor não encontrado.");

    const valorFipe = parseFloat(data[0].valor.replace("R$", "").replace(".", "").replace(",", "."));
    let desconto = 0;
    document.querySelectorAll("#checklist input:checked").forEach(chk => {
      desconto += parseFloat(chk.value);
    });
    const valorFinal = valorFipe * (1 - desconto / 100);
    document.getElementById("resultado").textContent = `Valor FIPE: R$ ${valorFipe.toFixed(2)} → Valor sugerido: R$ ${valorFinal.toFixed(2)}`;
  } catch (e) {
    alert("Erro ao buscar valor FIPE.");
  }
}

carregarMarcas();
