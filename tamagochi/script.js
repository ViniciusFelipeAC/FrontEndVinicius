const imagens = {
  normal:  "imagem1.png",
  bravo:   "imagem2.png",
  morto:   "imagem3.png",
  clicado: "imagem4.png",
  feliz:   "imagem5.png"
}

const fundoDia = "background.png"
const fundoNoite = "background_noite.png"

const img = document.getElementById("mainImage")
const avatarImg = document.getElementById("avatarImg")
const statusTexto = document.getElementById("statusTexto")
const barraFome = document.getElementById("barraFome")
const fomePct = document.getElementById("fomePct")

let contador = 0
let fome = 100
let morto = false
let timeoutClique = null
let timeoutBack = null

function controle() {
  setInterval(() => {
    if (morto) return

    contador++
    fome = Math.max(0, fome - 2)

    barraFome.value = fome
    fomePct.textContent = fome + "%"

    if (fome <= 0) {
      morto = true
      img.src = imagens.morto
      avatarImg.src = imagens.morto
      statusTexto.textContent = "💀 Morreu..."
      barraFome.className = "progress progress-error w-full"
    } else if (fome <= 30) {
      img.src = imagens.bravo
      avatarImg.src = imagens.bravo
      statusTexto.textContent = "😡 Com fome!"
      barraFome.className = "progress progress-warning w-full"
    } else {
      img.src = imagens.normal
      avatarImg.src = imagens.normal
      statusTexto.textContent = "😊 Feliz"
      barraFome.className = "progress progress-success w-full"
    }
  }, 1000)
}

function alimentar() {
  if (morto) {
    morto = false
    fome = 60
  }

  img.src = imagens.clicado
  avatarImg.src = imagens.clicado
  statusTexto.textContent = "😋 Comendo..."
  fome = Math.min(100, fome + 40)
  barraFome.value = fome
  fomePct.textContent = fome + "%"

  if (timeoutClique) clearTimeout(timeoutClique)
  if (timeoutBack) clearTimeout(timeoutBack)

  timeoutClique = setTimeout(() => {
    img.src = imagens.feliz
    avatarImg.src = imagens.feliz
    statusTexto.textContent = "🥰 Satisfeito!"

    timeoutBack = setTimeout(() => {
      if (!morto) {
        img.src = imagens.normal
        avatarImg.src = imagens.normal
        statusTexto.textContent = "😊 Feliz"
      }
    }, 2000)
  }, 1000)
}

function alternarFundo() {
  const toggle = document.getElementById("toggleNoite")
  if (toggle.checked) {
    document.body.style.backgroundImage = `url('${fundoNoite}')`
  } else {
    document.body.style.backgroundImage = `url('${fundoDia}')`
  }
}

document.body.style.backgroundImage = `url('${fundoDia}')`
controle()