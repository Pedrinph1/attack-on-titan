// =========================================================
// ATTACK ON TITAN - FAN SITE
// Cada bloco abaixo cuida de uma funcionalidade do site.
// =========================================================


// ---------- 1. MENU DO CELULAR ----------
// Ao clicar no botão de três linhas, o menu abre ou fecha.
const botaoMenu = document.querySelector('.botao-menu');
const menu = document.querySelector('#menu');

botaoMenu.addEventListener('click', function () {
    const estaAberto = menu.classList.toggle('aberto');
    botaoMenu.setAttribute('aria-expanded', estaAberto);
    botaoMenu.setAttribute('aria-label', estaAberto ? 'Fechar menu' : 'Abrir menu');
});

// Quando a pessoa escolhe um link, o menu fecha sozinho.
menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
        menu.classList.remove('aberto');
        botaoMenu.setAttribute('aria-expanded', false);
    });
});


// ---------- 2. MENU QUE ACOMPANHA A ROLAGEM ----------
// O IntersectionObserver avisa quando uma seção aparece na tela.
// Então marcamos no menu o link daquela seção.
const linksMenu = menu.querySelectorAll('a');
const secoes = document.querySelectorAll('main section[id]');

const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
            const id = entrada.target.id;
            linksMenu.forEach(function (link) {
                link.classList.toggle('ativo', link.getAttribute('href') === '#' + id);
            });
        }
    });
}, { rootMargin: '-45% 0px -50% 0px' }); // conta como "visível" quando a seção passa pelo meio da tela

secoes.forEach(function (secao) {
    observador.observe(secao);
});


// ---------- 3. "VER MAIS" DO CARD HISTÓRIA ----------
// Mostra ou esconde o texto extra do card.
document.querySelectorAll('button.ver-mais').forEach(function (botao) {
    botao.addEventListener('click', function () {
        const detalhe = document.getElementById(botao.dataset.alvo);
        detalhe.hidden = !detalhe.hidden;
        botao.firstChild.textContent = detalhe.hidden ? 'VER MAIS ' : 'VER MENOS ';
    });
});


// ---------- 4. JANELA COM DETALHES DO PERSONAGEM ----------
// Cada card guarda nome, papel e descrição nos atributos data-*.
// Ao clicar, copiamos esses dados para a janela e abrimos.
const janela = document.querySelector('#janela-personagem');
const cardsPersonagem = document.querySelectorAll('.card-personagem');

cardsPersonagem.forEach(function (card) {
    card.addEventListener('click', function () {
        janela.querySelector('.janela-nome').textContent = card.dataset.nome;
        janela.querySelector('.janela-papel').textContent = card.dataset.papel;
        janela.querySelector('.janela-descricao').textContent = card.dataset.descricao;
        // Reaproveita a mesma imagem do card (o navegador já entrega o endereço completo)
        janela.querySelector('.janela-imagem').style.backgroundImage =
            getComputedStyle(card).backgroundImage;
        janela.showModal();
    });
});

// Fecha pelo botão "×"
janela.querySelector('.fechar').addEventListener('click', function () {
    janela.close();
});

// Fecha clicando fora da janela (no fundo escuro)
janela.addEventListener('click', function (evento) {
    if (evento.target === janela) {
        janela.close();
    }
});
// Obs.: a tecla Esc já fecha o <dialog> automaticamente.


// ---------- 5. BUSCA DE PERSONAGENS ----------
// A lupa abre o campo. Ao digitar, só ficam os personagens com aquele nome.
const caixaBusca = document.querySelector('.busca');
const campoBusca = document.querySelector('#campo-busca');
const botaoBusca = document.querySelector('.botao-busca');
const semResultado = document.querySelector('.sem-resultado');

botaoBusca.addEventListener('click', function () {
    caixaBusca.classList.toggle('aberta');
    if (caixaBusca.classList.contains('aberta')) {
        campoBusca.focus();
    }
});

// Tira acentos e deixa minúsculo, para "LÉVI" achar "Levi"
function normalizar(texto) {
    return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

campoBusca.addEventListener('input', function () {
    const termo = normalizar(campoBusca.value.trim());
    let encontrados = 0;

    cardsPersonagem.forEach(function (card) {
        const combina = normalizar(card.dataset.nome + ' ' + card.dataset.papel).includes(termo);
        card.classList.toggle('escondido', !combina);
        if (combina) encontrados++;
    });

    semResultado.hidden = encontrados > 0;
});

// Ao apertar Enter, rola a página até os personagens
campoBusca.addEventListener('keydown', function (evento) {
    if (evento.key === 'Enter') {
        document.querySelector('#personagens').scrollIntoView();
    }
});


// ---------- 6. IMAGENS DA GALERIA QUE NÃO CARREGARAM ----------
// Se alguma imagem faltar na pasta, escondemos ela em vez de mostrar um ícone quebrado.
document.querySelectorAll('.grade-galeria img').forEach(function (imagem) {
    // Caso a imagem já tenha falhado antes deste código rodar
    if (imagem.complete && imagem.naturalWidth === 0) {
        imagem.style.display = 'none';
    }
    imagem.addEventListener('error', function () {
        imagem.style.display = 'none';
    });
});
