function revelar() {

    document.querySelector('.card-img-top').src = '_vinicius_junior.png';

    document.querySelector('#Nome .placeholder').textContent = 'Vinícius Júnior';
    document.querySelector('#Nome .placeholder').classList.remove('placeholder');

    document.getElementById('Rank').textContent = '9,5';

    document.getElementById('Data_Nas').textContent = '📅 12/07/2000 (25 anos)';
    document.getElementById('Alutra').textContent = '📏 1,76 m';
    document.getElementById('Posição ').textContent = '🏃 Ponta-esquerda / Atacante';

    ['Data_Nas', 'Alutra', 'Posição '].forEach(id => {
        const el = document.getElementById(id);
        el.classList.remove('placeholder');
        el.classList.add('card-text');
    });

    document.querySelector('.card').removeAttribute('aria-hidden');
}