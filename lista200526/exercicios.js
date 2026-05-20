function validarCPF() {
  let cpf = document.getElementById('cpf').value.replace(/\D/g, '');
  let resultado = document.getElementById('resultado-cpf');

  if (cpf.length !== 11) {
    resultado.innerHTML = '<span class="invalido">CPF inválido! Digite 11 números.</span>';
    return;
  }

  if (/^(\d)\1{10}$/.test(cpf)) {
    resultado.innerHTML = '<span class="invalido">CPF inválido!</span>';
    return;
  }

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += Number(cpf[i]) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;

  if (resto !== Number(cpf[9])) {
    resultado.innerHTML = '<span class="invalido">CPF inválido!</span>';
    return;
  }

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += Number(cpf[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;

  if (resto !== Number(cpf[10])) {
    resultado.innerHTML = '<span class="invalido">CPF inválido!</span>';
  } else {
    resultado.innerHTML = '<span class="valido">CPF válido! ✔</span>';
  }
}


function converterParaF() {
  let c = document.getElementById('celsius').value;
  if (c === '') {
    document.getElementById('fahrenheit').value = '';
    return;
  }
  let f = (Number(c) * 9 / 5) + 32;
  document.getElementById('fahrenheit').value = f.toFixed(2);
}

function converterParaC() {
  let f = document.getElementById('fahrenheit').value;
  if (f === '') {
    document.getElementById('celsius').value = '';
    return;
  }
  let c = (Number(f) - 32) * 5 / 9;
  document.getElementById('celsius').value = c.toFixed(2);
}


function calcularMedia() {
  let nome = document.getElementById('nomeAluno').value;
  let n1 = Number(document.getElementById('nota1').value);
  let n2 = Number(document.getElementById('nota2').value);
  let n3 = Number(document.getElementById('nota3').value);
  let media = (n1 + n2 + n3) / 3;
  let resultado = document.getElementById('resultado-media');

  let texto = 'Aluno: ' + nome + '<br>Média: ' + media.toFixed(2) + '<br>';

  if (media >= 7) {
    resultado.innerHTML = texto + '<span class="aprovado">Situação: Aprovado ✔</span>';
  } else if (media >= 4) {
    let falta = (10 - media).toFixed(2);
    resultado.innerHTML = texto + '<span class="exame">Situação: Exame – Faltam ' + falta + ' pontos para 10</span>';
  } else {
    resultado.innerHTML = texto + '<span class="reprovado">Situação: Reprovado ✘</span>';
  }
}


function calcularTaxa() {
  let bandeira = document.getElementById('bandeira').value;
  let valor = Number(document.getElementById('valorVenda').value);
  let parcelas = Number(document.getElementById('parcelas').value);

  let taxaBandeira = 0;
  switch (bandeira) {
    case 'visa':   taxaBandeira = 0.02;   break;
    case 'master': taxaBandeira = 0.0185; break;
    case 'elo':    taxaBandeira = 0.03;   break;
  }

  let valorTaxa = valor * taxaBandeira;
  let juros = valor * (0.015 * parcelas);
  let taxaMensal = 12.50 * parcelas;
  let total = valor + valorTaxa + juros + taxaMensal;
  let valorParcela = total / parcelas;

  document.getElementById('resultado-banco').innerHTML =
    'Taxa da bandeira: R$ ' + valorTaxa.toFixed(2) + '<br>' +
    'Juros totais: R$ ' + juros.toFixed(2) + '<br>' +
    'Taxa mensal: R$ ' + taxaMensal.toFixed(2) + '<br>' +
    'Valor total: R$ ' + total.toFixed(2) + '<br>' +
    'Valor por parcela: R$ ' + valorParcela.toFixed(2);
}


function adicionarConvidado() {
  let nome = document.getElementById('nomeConvidado').value.trim();
  if (nome === '') return;

  let lista = document.getElementById('listaConvidados');
  let li = document.createElement('li');

  let span = document.createElement('span');
  span.textContent = nome;

  let btnConcluir = document.createElement('button');
  btnConcluir.textContent = 'Concluir';
  btnConcluir.className = 'btn-concluir';
  btnConcluir.onclick = function() {
    li.classList.toggle('concluido');
  };

  let btnEditar = document.createElement('button');
  btnEditar.textContent = 'Editar';
  btnEditar.className = 'btn-editar';
  btnEditar.onclick = function() {
    let novoNome = prompt('Novo nome:', span.textContent);
    if (novoNome !== null && novoNome.trim() !== '') {
      span.textContent = novoNome.trim();
    }
  };

  let btnExcluir = document.createElement('button');
  btnExcluir.textContent = 'Excluir';
  btnExcluir.className = 'btn-excluir';
  btnExcluir.onclick = function() {
    lista.removeChild(li);
  };

  li.appendChild(span);
  li.appendChild(btnConcluir);
  li.appendChild(btnEditar);
  li.appendChild(btnExcluir);
  lista.appendChild(li);

  document.getElementById('nomeConvidado').value = '';
}


function calcularOrcamento() {
  let valorPessoa = Number(document.getElementById('pacote').value);
  let pessoas = Number(document.getElementById('quantPessoas').value);

  let custoBase = valorPessoa * pessoas;
  let taxaServico = custoBase * 0.10;
  let subtotal = custoBase + taxaServico;

  let desconto = 0;
  if (pessoas > 100) {
    desconto = subtotal * 0.05;
  }

  let total = subtotal - desconto;

  let texto = 'Custo bruto: R$ ' + custoBase.toFixed(2) + '<br>' +
              'Taxa de serviço (10%): R$ ' + taxaServico.toFixed(2) + '<br>';

  if (desconto > 0) {
    texto += 'Desconto fidelidade (5%): -R$ ' + desconto.toFixed(2) + '<br>';
  }

  texto += '<strong>Total final: R$ ' + total.toFixed(2) + '</strong>';
  document.getElementById('resultado-orcamento').innerHTML = texto;
}


function analisarCartao() {
  let num = document.getElementById('numCartao').value.replace(/[\s.]/g, '');
  let resultado = document.getElementById('resultado-cartao');

  if (num.length < 13 || num.length > 16 || isNaN(num)) {
    resultado.innerHTML = '<span class="invalido">Número inválido! Use entre 13 e 16 dígitos.</span>';
    return;
  }

  let invertido = num.split('').reverse();
  let soma = 0;
  for (let i = 0; i < invertido.length; i++) {
    let d = Number(invertido[i]);
    if (i % 2 === 1) {
      d = d * 2;
      if (d > 9) d -= 9;
    }
    soma += d;
  }

  let valido = soma % 10 === 0;

  let bandeira = 'Desconhecida';
  if (num[0] === '4') bandeira = 'Visa';
  else if (num[0] === '5') bandeira = 'Mastercard';
  else if (num.startsWith('34') || num.startsWith('37')) bandeira = 'American Express';
  else if (num[0] === '6') bandeira = 'Elo / Discover';

  let setor = 'Desconhecido';
  switch (num[0]) {
    case '1': setor = 'Companhias Aéreas'; break;
    case '2': setor = 'Companhias Aéreas'; break;
    case '3': setor = 'Viagens e Entretenimento'; break;
    case '4': setor = 'Bancos e Financeiras'; break;
    case '5': setor = 'Bancos e Financeiras'; break;
    case '6': setor = 'Comércio e Bancos'; break;
    case '7': setor = 'Petróleo'; break;
    case '8': setor = 'Telecomunicações'; break;
    case '9': setor = 'Governo'; break;
  }

  let banco = 'Não identificado';
  let bin = num.substring(0, 6);
  if (bin >= '400000' && bin <= '499999') banco = 'Banco emissor Visa';
  if (bin >= '510000' && bin <= '559999') banco = 'Banco emissor Mastercard';
  if (bin.startsWith('34') || bin.startsWith('37')) banco = 'American Express';

  resultado.innerHTML =
    'Status: <span class="' + (valido ? 'valido' : 'invalido') + '">' + (valido ? 'Válido ✔' : 'Inválido ✘') + '</span><br>' +
    'Bandeira: ' + bandeira + '<br>' +
    'Setor: ' + setor + '<br>' +
    'Banco Emissor: ' + banco;
}
