const apiBase = "https://parallelum.com.br/fipe/api/v1/carros/marcas";

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
  const res = await fetch(\`\${apiBase}/\${marcaId}/modelos\`);
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
  const modeloId = this.value;
  const res = await fetch(\`\${apiBase}/\${marcaId}/modelos/\${modeloId}/anos\`);
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

async function calcularValorJusto() {
  const marcaId = document.getElementById("marca").value;
  const modeloId = document.getElementById("modelo").value;
  const anoId = document.getElementById("ano").value;
  if (!marcaId || !modeloId || !anoId) return alert("Selecione todos os campos.");

  const res = await fetch(\`\${apiBase}/\${marcaId}/modelos/\${modeloId}/anos/\${anoId}\`);
  const data = await res.json();
  const valorFipe = parseFloat(data.Valor.replace("R$", "").replace(".", "").replace(",", "."));
  let desconto = 0;
  document.querySelectorAll("#checklist input:checked").forEach(chk => {
    desconto += parseFloat(chk.value);
  });
  const valorFinal = valorFipe * (1 - desconto / 100);
  document.getElementById("resultado").textContent = \`Valor FIPE: \${data.Valor} → Valor sugerido: R$ \${valorFinal.toFixed(2)}\`;
}

carregarMarcas();
