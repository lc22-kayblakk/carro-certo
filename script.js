
document.addEventListener('DOMContentLoaded', () => {
  const marcaSelect = document.getElementById('marca');
  const modeloSelect = document.getElementById('modelo');
  const anoSelect = document.getElementById('ano');

  // Carregar marcas
  fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas')
    .then(res => res.json())
    .then(marcas => {
      marcas.forEach(marca => {
        const option = document.createElement('option');
        option.value = marca.codigo;
        option.text = marca.nome;
        marcaSelect.appendChild(option);
      });
    });

  // Quando a marca mudar
  marcaSelect.addEventListener('change', () => {
    modeloSelect.innerHTML = '<option value="">Selecione</option>';
    anoSelect.innerHTML = '<option value="">Selecione</option>';
    fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelect.value}/modelos`)
      .then(res => res.json())
      .then(data => {
        data.modelos.forEach(modelo => {
          const option = document.createElement('option');
          option.value = modelo.codigo;
          option.text = modelo.nome;
          modeloSelect.appendChild(option);
        });
      });
  });

  // Quando o modelo mudar
  modeloSelect.addEventListener('change', () => {
    anoSelect.innerHTML = '<option value="">Selecione</option>';
    fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelect.value}/modelos/${modeloSelect.value}/anos`)
      .then(res => res.json())
      .then(anos => {
        anos.forEach(ano => {
          const option = document.createElement('option');
          option.value = ano.codigo;
          option.text = ano.nome;
          anoSelect.appendChild(option);
        });
      });
  });
});
