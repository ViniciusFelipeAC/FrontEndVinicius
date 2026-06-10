/* ═══════════════════════════════════════════════════
   App.js — Jogo Termo (estilo Wordle em português)
   Estrutura:
     1. Banco de palavras
     2. Estado do jogo
     3. Construção da interface (board + teclado)
     4. Lógica de input (teclado físico e virtual)
     5. Lógica de verificação da tentativa
     6. Funções auxiliares (mensagens, animações)
═══════════════════════════════════════════════════ */


/* ─────────────────────────────────────────────────
   1. BANCO DE PALAVRAS
   Todas as palavras têm exatamente 5 letras,
   apenas A-Z, sem acento e sem caracteres especiais.
───────────────────────────────────────────────── */
const BANCO = [
  "ABRIR","AMIGO","AMPLA","ANDAR","APOIO","AREIA","ARENA","ARGON","ASILO","ASTRO",
  "BALAO","BALSA","BAMBU","BANCO","BANJO","BEIJO","BOLHA","BOLSO","BOATO","BORDO",
  "BRAVO","BRISA","BRUMA","BUFAO","BURRO","BUSTO","CAJUZ","CALMA","CAMPO","CANTO",
  "CAPIM","CARGO","CARMA","CARPA","CASCO","CAULE","CEDER","CENSO","CEROL","CHAGA",
  "CHAPA","CHAVE","CINZA","CITAR","CLARO","CLIPE","CLUBE","COCAR","COLOR","COMBO",
  "COBRA","COMUM","CONTO","CORPO","CORVO","COSMO","CRAVO","CRIOU","CRIVO","CURTO",
  "CURVA","CHUVA","CICLO","DEDAL","DIQUE","DRAMA","DUETO","DUPLO","ELITE","ENTRE",
  "ENVIO","ETAPA","EXTRA","FACTO","FAROL","FERRO","FILME","FORTE","FUNIL","FORCA",
  "FUNDO","GANHO","GENIO","GOLPE","GORDO","GRATO","GRIPE","GRUPO","HASTE","HEROI",
  "HOTEL","IDEIA","IMUNE","ISOLA","JANTE","JOGAR","JUSTO","JUNTA","LAGOA","LANCE",
  "LARGO","LETRA","LINDA","LINDO","LIVRO","MACIO","MAIOR","MARCO","MASSA","MOLHO",
  "MONTE","MUNDO","MUSGO","NARIZ","NEGRO","NINHO","NOBRE","NORTE","NUVEM","OLHAR",
  "OMEGA","OPACO","ORDEM","OVULO","PALCO","PALHA","PAMPA","PASMO","PAVIO","PEDRA",
  "PLANO","PORTA","PRAIA","QUEPE","QUEDA","QUASE","RAPAZ","RASGO","RISCO","ROSTO",
  "RUIVO","SABRE","SABOR","SAFRA","SALTO","SENHA","SUECO","SURTO","TALCO","TALHA",
  "TEMPO","TERRA","TIMAO","TROCO","TURMA","ULTRA","USINA","VALOR","VELOZ","VENTO",
  "VERDE","VIELA","VIRGO","XISTO","ZEBRA","ZENON","ZUAVO","COBRA","COBRE","COIFA",
  "CITAR","CREDO","CARGO","CINZA","BARAO","BANCO","BAIXO","BEATO","BIZUS","BOLOR",
];

/* Garante que não há duplicatas e todas têm 5 letras */
const PALAVRAS_VALIDAS = [...new Set(BANCO.filter(p => p.length === 5 && /^[A-Z]+$/.test(p)))];


/* ─────────────────────────────────────────────────
   2. ESTADO DO JOGO
───────────────────────────────────────────────── */
let palavraSecreta = "";
let tentativaAtual = "";
let jogoAtivo      = true;
let linhaAtual     = 0;

const MAX_TENTATIVAS = 6;
const TAMANHO        = 5;


/* ─────────────────────────────────────────────────
   3. CONSTRUÇÃO DA INTERFACE
───────────────────────────────────────────────── */
const boardEl   = document.getElementById("board");
const messageEl = document.getElementById("message");
const keyboardEl= document.getElementById("keyboard");

function buildBoard() {
  boardEl.innerHTML = "";
  for (let r = 0; r < MAX_TENTATIVAS; r++) {
    const row = document.createElement("div");
    row.classList.add("row");
    row.id = `row-${r}`;
    for (let c = 0; c < TAMANHO; c++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      tile.id = `tile-${r}-${c}`;
      row.appendChild(tile);
    }
    boardEl.appendChild(row);
  }
}

const LINHAS_TECLADO = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","APAGAR"],
];

function buildKeyboard() {
  keyboardEl.innerHTML = "";
  LINHAS_TECLADO.forEach(linha => {
    const row = document.createElement("div");
    row.classList.add("keyboard-row");
    linha.forEach(letra => {
      const btn = document.createElement("button");
      btn.classList.add("key");
      btn.textContent = letra;
      btn.dataset.key = letra;
      if (letra === "ENTER" || letra === "APAGAR") btn.classList.add("wide");
      btn.addEventListener("click", () => handleKey(letra));
      row.appendChild(btn);
    });
    keyboardEl.appendChild(row);
  });

  /* Botão Novo Jogo */
  let btnNovo = document.getElementById("btn-novo-jogo");
  if (!btnNovo) {
    btnNovo = document.createElement("button");
    btnNovo.id = "btn-novo-jogo";
    btnNovo.textContent = "Novo Jogo";
    btnNovo.addEventListener("click", iniciarJogo);
    document.querySelector("main").appendChild(btnNovo);
  }
  btnNovo.style.display = "none";
}


/* ─────────────────────────────────────────────────
   4. LÓGICA DE INPUT
───────────────────────────────────────────────── */

/*
 * normalizar(str) — remove acentos e converte para maiúsculas.
 * Assim o jogador pode digitar com ou sem acento.
 */
function normalizar(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

function handleKey(key) {
  if (!jogoAtivo) return;

  const k = normalizar(key);

  if (k === "ENTER") {
    submeterTentativa();
  } else if (k === "APAGAR" || key === "Backspace") {
    removerLetra();
  } else if (/^[A-Z]$/.test(k) && tentativaAtual.length < TAMANHO) {
    adicionarLetra(k);
  }
}

function adicionarLetra(letra) {
  tentativaAtual += letra;
  const col  = tentativaAtual.length - 1;
  const tile = document.getElementById(`tile-${linhaAtual}-${col}`);
  tile.textContent = letra;
  tile.classList.add("filled");
}

function removerLetra() {
  if (tentativaAtual.length === 0) return;
  const col  = tentativaAtual.length - 1;
  const tile = document.getElementById(`tile-${linhaAtual}-${col}`);
  tile.textContent = "";
  tile.classList.remove("filled");
  tentativaAtual = tentativaAtual.slice(0, -1);
}

document.addEventListener("keydown", e => {
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  handleKey(e.key === "Backspace" ? "Backspace" : e.key);
});


/* ─────────────────────────────────────────────────
   5. LÓGICA DE VERIFICAÇÃO DA TENTATIVA
───────────────────────────────────────────────── */

function submeterTentativa() {
  if (tentativaAtual.length < TAMANHO) {
    shakeRow(linhaAtual);
    showMessage("Palavra incompleta!");
    return;
  }

  /* Verifica se a palavra existe no banco */
  if (!PALAVRAS_VALIDAS.includes(tentativaAtual)) {
    shakeRow(linhaAtual);
    showMessage("Palavra não encontrada!");
    return;
  }

  const resultado = calcularResultado(tentativaAtual, palavraSecreta);
  revelarLinha(linhaAtual, resultado);
  atualizarTeclado(tentativaAtual, resultado);

  const acertou = tentativaAtual === palavraSecreta;
  const linhaFinal = linhaAtual;

  linhaAtual++;
  tentativaAtual = "";

  if (acertou) {
    setTimeout(() => {
      bounceRow(linhaFinal);
      showMessage("🎉 Você acertou!", true);
      encerrarJogo();
    }, TAMANHO * 300 + 100);
    return;
  }

  if (linhaAtual >= MAX_TENTATIVAS) {
    setTimeout(() => {
      showMessage(`A palavra era: ${palavraSecreta}`, true);
      encerrarJogo();
    }, TAMANHO * 300 + 100);
  }
}

/*
 * calcularResultado — duas passagens para lidar com letras duplicadas.
 * 1ª passagem: marca "correct" (verde)
 * 2ª passagem: marca "present" (amarelo) usando contagem do que sobrou
 */
function calcularResultado(tentativa, secreta) {
  const resultado = Array(TAMANHO).fill("absent");
  const contagem  = {};

  for (let i = 0; i < TAMANHO; i++) {
    if (tentativa[i] === secreta[i]) {
      resultado[i] = "correct";
    } else {
      contagem[secreta[i]] = (contagem[secreta[i]] || 0) + 1;
    }
  }

  for (let i = 0; i < TAMANHO; i++) {
    if (resultado[i] !== "correct" && contagem[tentativa[i]] > 0) {
      resultado[i] = "present";
      contagem[tentativa[i]]--;
    }
  }

  return resultado;
}

function revelarLinha(row, resultado) {
  for (let c = 0; c < TAMANHO; c++) {
    const tile = document.getElementById(`tile-${row}-${c}`);
    setTimeout(() => {
      tile.classList.add("flip");
      setTimeout(() => {
        tile.classList.remove("filled");
        tile.classList.add(resultado[c]);
      }, 250);
    }, c * 300);
  }
}

const PRIORIDADE = { correct: 3, present: 2, absent: 1 };

function atualizarTeclado(tentativa, resultado) {
  for (let i = 0; i < TAMANHO; i++) {
    const letra = tentativa[i];
    const novoEstado = resultado[i];
    const btn = document.querySelector(`.key[data-key="${letra}"]`);
    if (!btn) continue;

    const estadoAtual = ["correct","present","absent"].find(c => btn.classList.contains(c));
    if (!estadoAtual || PRIORIDADE[novoEstado] > PRIORIDADE[estadoAtual]) {
      btn.classList.remove("correct","present","absent");
      btn.classList.add(novoEstado);
    }
  }
}


/* ─────────────────────────────────────────────────
   6. FUNÇÕES AUXILIARES
───────────────────────────────────────────────── */

function showMessage(texto, permanente = false) {
  messageEl.textContent = texto;
  messageEl.classList.add("visible");
  if (!permanente) {
    setTimeout(() => messageEl.classList.remove("visible"), 2000);
  }
}

function shakeRow(row) {
  const rowEl = document.getElementById(`row-${row}`);
  rowEl.classList.add("shake");
  rowEl.addEventListener("animationend", () => rowEl.classList.remove("shake"), { once: true });
}

function bounceRow(row) {
  for (let c = 0; c < TAMANHO; c++) {
    setTimeout(() => {
      document.getElementById(`tile-${row}-${c}`).classList.add("bounce");
    }, c * 100);
  }
}

function encerrarJogo() {
  jogoAtivo = false;
  const btnNovo = document.getElementById("btn-novo-jogo");
  if (btnNovo) btnNovo.style.display = "block";
}

function iniciarJogo() {
  palavraSecreta = PALAVRAS_VALIDAS[Math.floor(Math.random() * PALAVRAS_VALIDAS.length)];
  tentativaAtual = "";
  jogoAtivo      = true;
  linhaAtual     = 0;

  buildBoard();
  buildKeyboard();
  messageEl.classList.remove("visible");
  messageEl.textContent = "";
}


/* ─────────────────────────────────────────────────
   INICIALIZAÇÃO
───────────────────────────────────────────────── */
iniciarJogo();