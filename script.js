
document.addEventListener("DOMContentLoaded", () => {
  const marcaSelect = document.getElementById("marca");
  const modeloSelect = document.getElementById("modelo");
  const anoSelect = document.getElementById("ano");
  const resultadoFipe = document.getElementById("valorFipe");
  const resultadoEstimado = document.getElementById("valorEstimado");
  const checklistForm = document.getElementById("checklistForm");

  // Carregar marcas
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

  // Carregar modelos
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

  // Carregar anos
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

  // Calcular valor estimado
  anoSelect.addEventListener("change", () => {
    if (anoSelect.value) {
      fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelect.value}/modelos/${modeloSelect.value}/anos/${anoSelect.value}`)
        .then(res => res.json())
        .then(data => {
          resultadoFipe.innerText = data.Valor;
          resultadoFipe.dataset.valor = parseFloat(data.Valor.replace("R$", "").replace(".", "").replace(",", "."));
          calcularEstimativa();
        });
    }
  });

  // Atualizar valor estimado ao alterar checklist
  checklistForm.addEventListener("change", () => {
    calcularEstimativa();
  });

  function calcularEstimativa() {
    const valorFipe = parseFloat(resultadoFipe.dataset.valor || 0);
    if (valorFipe === 0) {
      resultadoEstimado.innerText = "R$ 0,00";
      return;
    }

    let desconto = 0;
    const opcoes = checklistForm.querySelectorAll("input[type=checkbox]:checked");
    opcoes.forEach(opcao => {
      desconto += parseFloat(opcao.dataset.desconto || 0);
    });

    const valorFinal = valorFipe * (1 - desconto);
    resultadoEstimado.innerText = valorFinal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
});
