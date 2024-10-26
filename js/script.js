//MENU//
document.querySelector('.menu-toggle').addEventListener('click', function() {
    const navList = document.querySelector('nav ul');
    navList.classList.toggle('active');
});
//FIM MENU//

//////// CARROSSEL DE IMAGENS ////////
$(document).ready(function () {
    // Inicializa o carrossel com a opção pauseOnHover false
    $('.carousel').slick({
        autoplay: true,
        autoplaySpeed: 3000,
        dots: true,
        arrows: true,
        pauseOnHover: false, // O carrossel continua mesmo ao passar o mouse
        fade: true, // Ativa a transição de fade
        speed: 500, // Duração da transição em milissegundos
    });

    // Reinicia o autoplay ao clicar em uma imagem do carrossel
    $('.carousel').on('click', function () {
        $(this).slick('slickPlay'); // Reinicia o autoplay
    });

    // Função para mostrar a seção correta ao clicar em um link de navegação
    $('.nav-link').click(function (event) {
        event.preventDefault(); // Previne o comportamento padrão do link

        // Obtém o ID da seção de destino
        const target = $(this).data('target');

        // Esconde todas as seções
        $('main > section').addClass('hidden');

        // Mostra a seção correspondente
        $('#' + target).removeClass('hidden');

        // Scroll para a seção mostrada
        $('html, body').animate({
            scrollTop: $('#' + target).offset().top
        }, 500);
    });

    // Exibe a seção inicial (home) por padrão
    $('#home').removeClass('hidden');
});
//FIM CARROSSEL //

///////////  CLIMA  //////////////

$(document).ready(function () {
    const apiKey = 'e735e4a1d00db64ba1206fe2ffa3a998';
    const city = 'Guaraqueçaba,BR'; // Nome da cidade e país
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt`;
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pt`;

    // Função para converter graus em pontos cardeais
    function obterDirecaoVento(graus) {
        const pontosCardeais = [
            { nome: 'Norte', limite: 11.25 },
            { nome: 'Norte-Nordeste', limite: 33.75 },
            { nome: 'Nordeste', limite: 56.25 },
            { nome: 'Leste-Nordeste', limite: 78.75 },
            { nome: 'Leste', limite: 101.25 },
            { nome: 'Leste-Sudeste', limite: 123.75 },
            { nome: 'Sudeste', limite: 146.25 },
            { nome: 'Sul-Sudeste', limite: 168.75 },
            { nome: 'Sul', limite: 191.25 },
            { nome: 'Sul-Oeste', limite: 213.75 },
            { nome: 'Oeste', limite: 236.25 },
            { nome: 'Oeste-Nordeste', limite: 258.75 },
            { nome: 'Noroeste', limite: 281.25 },
            { nome: 'Norte-Noroeste', limite: 303.75 },
            { nome: 'Noroeste', limite: 326.25 },
            { nome: 'Norte', limite: 348.75 },
        ];

        for (const ponto of pontosCardeais) {
            if (graus < ponto.limite) {
                return ponto.nome;
            }
        }
        return 'Norte'; // Se não corresponder, retorna 'Norte'
    }

    // Função para obter e exibir o clima atual
    function obterClimaAtual() {
        $.getJSON(weatherApiUrl, function (data) {
            const temperatura = data.main.temp;
            const temperaturaMinima = data.main.temp_min;
            const descricao = data.weather[0].description;
            const umidade = data.main.humidity;
            const sensacaoTermica = data.main.feels_like;
            const vento = (data.wind.speed * 3.6).toFixed(2);
            const direcaoVentoGraus = data.wind.deg;
            const direcaoVento = obterDirecaoVento(direcaoVentoGraus);
            const nascerDoSolAtual = new Date(data.sys.sunrise * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            const porDoSolAtual = new Date(data.sys.sunset * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            const dataAtual = new Date().toLocaleDateString('pt-BR', { weekday: 'long' });

            // Aqui, o acesso à probabilidade de chuva é modificado
            const probabilidadeChuvaAtual = data.rain ? (data.rain['1h'] || 0) : 0; // Atual
            $('#info-clima').html(`
                <p><strong>Data:</strong> ${dataAtual.charAt(0).toUpperCase() + dataAtual.slice(1)}</p>
                <p><strong>Temperatura:</strong> ${temperatura.toFixed(2)}°C</p>
                <p><strong>Temperatura Mínima:</strong> ${temperaturaMinima.toFixed(2)}°C</p>
                <p><strong>Sensação Térmica:</strong> ${sensacaoTermica.toFixed(2)}°C</p>
                <p><strong>Umidade:</strong> ${umidade}%</p>
                <p><strong>Vento:</strong> ${vento} km/h na direção ${direcaoVento}</p>
                <p><strong>Nascer do Sol:</strong> ${nascerDoSolAtual}</p>
                <p><strong>Pôr do Sol:</strong> ${porDoSolAtual}</p>
                <p><strong>Descrição:</strong> ${descricao}</p>
                <p><strong>Probabilidade de Chuva:</strong> ${probabilidadeChuvaAtual}%</p>
            `);
        });
    }

    // Função para obter e exibir as previsões futuras
    function obterPrevisaoFutura() {
        $.getJSON(forecastApiUrl, function (data) {
            const previsaoHTML = [];
            const diasFuturos = {};
            const dataAtual = new Date().toLocaleDateString('pt-BR');

            data.list.forEach(item => {
                const dataPrevisao = new Date(item.dt * 1000);
                const dataFormatada = dataPrevisao.toLocaleDateString('pt-BR'); // Data formatada para 'dd/mm/aaaa'

                if (dataFormatada > dataAtual) { // Verifica se é um dia futuro
                    if (!diasFuturos[dataFormatada]) {
                        diasFuturos[dataFormatada] = {
                            dia: dataPrevisao.toLocaleDateString('pt-BR', { weekday: 'long' }), // Nome do dia
                            temperatura: item.main.temp,
                            temperaturaMinima: item.main.temp_min,
                            descricao: item.weather[0].description,
                            umidade: item.main.humidity,
                            sensacaoTermica: item.main.feels_like,
                            vento: (item.wind.speed * 3.6).toFixed(2),
                            direcaoVento: obterDirecaoVento(item.wind.deg),
                            // Aqui, o acesso à probabilidade de chuva é modificado
                            probabilidadeChuva: item.rain ? (item.rain['1h'] || 0) : 0,
                        };
                    }
                }
            });

            const diasFuturosArray = Object.values(diasFuturos).slice(0, 4); // Pega os próximos 4 dias

            diasFuturosArray.forEach(previsao => {
                previsaoHTML.push(`
                    <div class="previsao-dia">
                        <h4>${previsao.dia}</h4>
                        <p><strong>Temperatura:</strong> ${previsao.temperatura.toFixed(2)}°C</p>
                        <p><strong>Temperatura Mínima:</strong> ${previsao.temperaturaMinima.toFixed(2)}°C</p>
                        <p><strong>Sensação Térmica:</strong> ${previsao.sensacaoTermica.toFixed(2)}°C</p>
                        <p><strong>Umidade:</strong> ${previsao.umidade}%</p>
                        <p><strong>Vento:</strong> ${previsao.vento} km/h na direção ${previsao.direcaoVento}</p>
                        <p><strong>Descrição:</strong> ${previsao.descricao}</p>
                        <p><strong>Probabilidade de Chuva:</strong> ${previsao.probabilidadeChuva}%</p>
                    </div>
                `);
            });

            $('#previsao-futura').html(previsaoHTML.join(''));
        });
    }

    // Chama as funções para obter as informações do clima e previsão
    obterClimaAtual();
    obterPrevisaoFutura();
});
////////// FIM CLIMA //////////



//historico de prefeitos//
let currentSlide = 0; // Índice do slide atual
const slides = document.querySelectorAll('.historico_de_prefeitos-item');
const totalSlides = slides.length;

// Mostrar o primeiro slide inicialmente
showSlide(currentSlide);

// Função para mostrar o slide correspondente
function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active'); // Remover a classe 'active' de todos os slides
        if (i === index) {
            slide.classList.add('active'); // Adicionar a classe 'active' ao slide atual
        }
    });
}

// Função para ir para o próximo slide
function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides; // Incrementa o índice, volta ao início se exceder
    showSlide(currentSlide);
}

// Função para ir para o slide anterior
function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; // Decrementa o índice, volta ao fim se for negativo
    showSlide(currentSlide);
}

// Autoplay do carrossel
setInterval(nextSlide, 3000); // Troca de slide a cada 3 segundos
//fim do carousel historico de prefeitos//