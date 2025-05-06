
document.addEventListener("DOMContentLoaded", () => {
  const marcaSelect = document.getElementById("marca");
  const modeloSelect = document.getElementById("modelo");
  const anoSelect = document.getElementById("ano");
  const resultadoFipe = document.getElementById("resultadoFipe");
  const checklistForm = document.getElementById("checklistForm");
  const valorFinalSpan = document.getElementById("valorFinal");

  fetch("https://parallelum.com.br/fipe/api/v1/carros/marcas")
    .then(res => res.json())
    .then(data => {
      data.forEach(marca => {
        const option = document.createElement("option");
        option.value = marca.codigo;
        option.text = marca.nome;
        marcaSelect.add(option);
      });
    });

  marcaSelect.addEventListener("change", () => {
    modeloSelect.innerHTML = "<option value=''>Selecione o modelo</option>";
    anoSelect.innerHTML = "<option value=''>Selecione o ano</option>";
    if (marcaSelect.value) {
      fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelect.value}/modelos`)
        .then(res => res.json())
        .then(data => {
          data.modelos.forEach(modelo => {
            const option = document.createElement("option");
            option.value = modelo.codigo;
            option.text = modelo.nome;
            modeloSelect.add(option);
          });
        });
    }
  });

  modeloSelect.addEventListener("change", () => {
    anoSelect.innerHTML = "<option value=''>Selecione o ano</option>";
    if (modeloSelect.value) {
      fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelect.value}/modelos/${modeloSelect.value}/anos`)
        .then(res => res.json())
        .then(data => {
          data.forEach(ano => {
            const option = document.createElement("option");
            option.value = ano.codigo;
            option.text = ano.nome;
            anoSelect.add(option);
          });
        });
    }
  });

  anoSelect.addEventListener("change", () => {
    if (anoSelect.value) {
      fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelect.value}/modelos/${modeloSelect.value}/anos/${anoSelect.value}`)
        .then(res => res.json())
        .then(data => {
          resultadoFipe.innerText = `Valor FIPE: R$ ${data.Valor}`;
          resultadoFipe.dataset.valor = parseFloat(data.Valor.replace("R$", "").replace(".", "").replace(",", "."));
        });
    }
  });

  checklistForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const valorFipe = parseFloat(resultadoFipe.dataset.valor || 0);
    let desconto = 0;

    const opcoes = checklistForm.querySelectorAll("input[type=radio]:checked");
    opcoes.forEach(opcao => {
      if (opcao.value === "Regular") desconto += 0.05;
      if (opcao.value === "Ruim") desconto += 0.10;
    });

    const valorFinal = valorFipe * (1 - desconto);
    valorFinalSpan.innerText = valorFinal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  });
});
