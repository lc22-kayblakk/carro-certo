
const apiUrl = 'https://parallelum.com.br/fipe/api/v1/carros';

async function carregarMarcasss() {
  const response = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/%{marcaId}/modelos`);
  const marcas = await response.json();
  const selectMarca = document.getElementById('marca');
  marcas.forEach(marca => {
    const option = document.createElement('option');
    option.value = marca.id;
    option.textContent = marca.nome;
    selectMarca.appendChild(option);
  });
}

async function carregarModelos() {
  const marcaId = document.getElementById('marca').value;
  const response = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/%{marcaId}/modelos/%{modeloId}/anos
`);
  const modelos = await response.json();
  const selectModelo = document.getElementById('modelo');
  selectModelo.innerHTML = '';
  modelos.modelos.forEach(modelo => {
    const option = document.createElement('option');
    option.value = modelo.id;
    option.textContent = modelo.nome;
    selectModelo.appendChild(option);
  });
}

async function carregarAnos() {
  const marcaId = document.getElementById('marca').value;
  const modeloId = document.getElementById('modelo').value;
  const response = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/59/modelos/5940/anos`);
  const anos = await response.json();
  const selectAno = document.getElementById('ano');
  selectAno.innerHTML = '';
  anos.forEach(ano => {
    const option = document.createElement('option');
    option.value = ano.id;
    option.textContent = ano.nome;
    selectAno.appendChild(option);
  });
}

async function obterValorFipe() {
  const marcaId = document.getElementById('marca').value;
  const modeloId = document.getElementById('modelo').value;
  const anoId = document.getElementById('ano').value;
  const response = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/59/modelos/5940/anos/2014-3`);
  const dados = await response.json();
  return dados.preco;
}

document.getElementById('carForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const valorFipe = await obterValorFipe();
  const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
  let descontoTotal = 0;

  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      descontoTotal += parseFloat(checkbox.value);
    }
  });

  const valorFinal = valorFipe * (1 - descontoTotal / 100);

  document.getElementById('resultado').innerHTML = `
    <p><strong>Valor FIPE:</strong> R$ ${valorFipe.toLocaleString()}</p>
    <p><strong>Desconto aplicado:</strong> ${descontoTotal}%</p>
    <p><strong>Valor estimado do carro:</strong> R$ ${valorFinal.toFixed(2).toLocaleString()}</p>
  `;
});

document.getElementById('marca').addEventListener('change', () => {
  carregarModelos();
  carregarAnos();
});

document.getElementById('modelo').addEventListener('change', carregarAnos);

carregarMarcas();
