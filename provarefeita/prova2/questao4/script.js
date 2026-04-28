function add(){
    // Seleciona o container de cards
    var cardsContainer = document.getElementById("Cards");

    // Cria o elemento principal do card
    var novoCard = document.createElement("div");
    novoCard.classList.add("card");
    novoCard.style.width = "22rem";

    // Cria a imagem do jogador
    var img = document.createElement("img");
    img.src = "Lucas_Paqueta.webp";
    img.classList.add("card-img-top");
    img.alt = "Lucas Paquetá";

    // Cria o corpo do card
    var cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    // Cria o título com nome e rank
    var titulo = document.createElement("h5");
    titulo.classList.add("card-title");

    var spanNome = document.createElement("span");
    spanNome.classList.add("card-title");
    spanNome.textContent = "Lucas Paquetá";

    var spanRank = document.createElement("span");
    spanRank.classList.add("badge", "text-bg-secondary");
    spanRank.textContent = "8,8";

    titulo.appendChild(spanNome);
    titulo.appendChild(spanRank);

    // Cria o parágrafo com os detalhes
    var detalhes = document.createElement("p");
    detalhes.classList.add("card-text");

    var spanNascimento = document.createElement("span");
    spanNascimento.innerHTML = "<strong>Nascimento:</strong> 27/08/1997";

    var br1 = document.createElement("br");

    var spanAltura = document.createElement("span");
    spanAltura.innerHTML = "<strong>Altura:</strong> 1,80";

    var br2 = document.createElement("br");

    var spanPosicao = document.createElement("span");
    spanPosicao.innerHTML = "<strong>Posição:</strong> Meio-campista";

    detalhes.appendChild(spanNascimento);
    detalhes.appendChild(br1);
    detalhes.appendChild(spanAltura);
    detalhes.appendChild(br2);
    detalhes.appendChild(spanPosicao);

    // Monta o card
    cardBody.appendChild(titulo);
    cardBody.appendChild(detalhes);
    novoCard.appendChild(img);
    novoCard.appendChild(cardBody);

    // Adiciona o novo card ao container, ao lado do existente
    cardsContainer.appendChild(novoCard);
}