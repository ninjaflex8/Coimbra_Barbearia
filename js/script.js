/* JavaScript do site. */

/* ===== FUNÇÕES AUXILIARES ===== */
function formatarPreco(valor) {
  // Mostra o preço em reais.
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

function transformarDataEmTexto(data) {
  // Separa ano, mês e dia.
  var partes = data.split("-");
  // No JavaScript, janeiro é o mês 0.
  var dataEscolhida = new Date(partes[0], partes[1] - 1, partes[2]);
  return dataEscolhida.toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
}

function transformarDataParaInput(data) {
  // Formato usado pelo campo de data.
  var ano = data.getFullYear();
  var mes = String(data.getMonth() + 1).padStart(2, "0");
  var dia = String(data.getDate()).padStart(2, "0");
  return ano + "-" + mes + "-" + dia;
}

function criarLinkWhatsApp(mensagem) {
  // Deixa só os números do telefone.
  var numero = BARBEARIA.whatsapp.replace(/\D/g, "");
  var texto = mensagem ? "?text=" + encodeURIComponent(mensagem) : "";
  return "https://wa.me/" + numero + texto;
}

function buscarServico(id) {
  // Procura um serviço pelo id.
  for (var i = 0; i < SERVICOS.length; i++) {
    if (SERVICOS[i].id === id) return SERVICOS[i];
  }
  return null;
}

/* ===== MENU E RODAPÉ ===== */
function iniciarMenu() {
  // Pega o botão e o menu do HTML.
  var botao = document.querySelector(".menu-toggle");
  var menu = document.querySelector("#menu-principal");
  // Para se o menu não existir.
  if (!botao || !menu) return;

  botao.addEventListener("click", function () {
    // Roda quando o botão é clicado.
    var menuEstaAberto = menu.classList.contains("aberto");
    // Abre ou fecha o menu.
    menu.classList.toggle("aberto");
    botao.setAttribute("aria-expanded", String(!menuEstaAberto));
    botao.querySelector("[aria-hidden]").textContent = menuEstaAberto ? "☰" : "×";
    botao.querySelector(".sr-only").textContent = menuEstaAberto ? "Abrir menu" : "Fechar menu";
  });

  var links = menu.querySelectorAll("a");
  for (var i = 0; i < links.length; i++) {
    // Fecha o menu após clicar em um link.
    links[i].addEventListener("click", function () {
      menu.classList.remove("aberto");
      botao.setAttribute("aria-expanded", "false");
    });
  }
}

function iniciarAno() {
  // Mostra o ano atual no rodapé.
  var anos = document.querySelectorAll("#ano");
  for (var i = 0; i < anos.length; i++) anos[i].textContent = new Date().getFullYear();
}

/* ===== SERVIÇOS E CONTATO ===== */
function iniciarListaServicos() {
  // Pega o local onde os cartões serão mostrados.
  var listas = document.querySelectorAll("[data-lista-servicos]");
  var paginaAgendamento = location.pathname.indexOf("pages") !== -1 ? "agendar.html" : "pages/agendar.html";
  var html = "";

  // Cria um cartão para cada serviço.
  for (var i = 0; i < SERVICOS.length; i++) {
    var servico = SERVICOS[i];
    html += "<article class=\"cartao-servico\"><div class=\"cartao-topo\">" +
      "<h3>" + servico.nome + "</h3><span class=\"preco\">" + formatarPreco(servico.preco) + "</span>" +
      "</div><p>" + servico.descricao + "</p><div class=\"cartao-base\">" +
      "<a href=\"" + paginaAgendamento + "?servico=" + servico.id + "\">Agendar</a></div></article>";
  }
  // Coloca os cartões na página.
  for (var j = 0; j < listas.length; j++) listas[j].innerHTML = html;
}

function iniciarContato() {
  // Preenche os dados de contato.
  var campos = document.querySelectorAll("[data-campo]");
  var linksWhatsApp = document.querySelectorAll("[data-link-whatsapp]");
  for (var i = 0; i < campos.length; i++) campos[i].textContent = BARBEARIA[campos[i].dataset.campo];
  for (var j = 0; j < linksWhatsApp.length; j++) linksWhatsApp[j].href = criarLinkWhatsApp("");
}

/* ===== CARROSSEL DA HOME ===== */
function iniciarCarrossel() {
  // Pega o carrossel da Home.
  var carrossel = document.querySelector("[data-carrossel]");
  if (!carrossel) return;

  var slides = carrossel.querySelectorAll(".slide");
  var pontos = carrossel.querySelectorAll(".ponto");
  var slideAtual = 0;

  function mostrarSlide(indice) {
    // Volta ao início ou ao fim, se necessário.
    if (indice < 0) indice = slides.length - 1;
    if (indice >= slides.length) indice = 0;
    slideAtual = indice;

    for (var i = 0; i < slides.length; i++) {
      // Mostra somente o slide atual.
      var estaAtivo = i === slideAtual;
      slides[i].classList.toggle("ativo", estaAtivo);
      pontos[i].classList.toggle("ativo", estaAtivo);
      pontos[i].setAttribute("aria-current", estaAtivo ? "true" : "false");
    }
  }

  carrossel.querySelector(".seta-anterior").addEventListener("click", function () {
    mostrarSlide(slideAtual - 1);
  });
  carrossel.querySelector(".seta-proxima").addEventListener("click", function () {
    mostrarSlide(slideAtual + 1);
  });
  for (var i = 0; i < pontos.length; i++) {
    pontos[i].addEventListener("click", function () {
      // Mostra a imagem do ponto clicado.
      mostrarSlide(Array.prototype.indexOf.call(pontos, this));
    });
  }
  mostrarSlide(0);
}

/* ===== AGENDAMENTO ===== */
function iniciarAgendamento() {
  // Para se não estiver na página de agendamento.
  var formulario = document.querySelector("#form-agendamento");
  if (!formulario) return;

  var listaServicos = document.querySelector("#opcoes-servico");
  var campoData = document.querySelector("#data");
  var campoNome = document.querySelector("#nome");
  var avisoData = document.querySelector("#aviso-data");
  var previa = document.querySelector("#previa");
  var botaoEnviar = document.querySelector("#btn-enviar");
  var botaoCopiar = document.querySelector("#btn-copiar");
  var avisoCopia = document.querySelector("#aviso-copia");
  // Guardam as escolhas do cliente.
  var servicoEscolhido = null;
  var dataEscolhida = "";
  var html = "";

  // Cria as opções de serviço.
  for (var i = 0; i < SERVICOS.length; i++) {
    var servico = SERVICOS[i];
    html += "<label class=\"opcao\"><input type=\"radio\" name=\"servico\" value=\"" + servico.id + "\" required>" +
      "<span class=\"opcao-corpo\"><strong>" + servico.nome + "</strong><span class=\"preco\">" +
      formatarPreco(servico.preco) + "</span></span></label>";
  }
  listaServicos.innerHTML = html;

  // Libera datas de hoje até 60 dias depois.
  var hoje = new Date();
  var limite = new Date();
  limite.setDate(hoje.getDate() + 60);
  campoData.min = transformarDataParaInput(hoje);
  campoData.max = transformarDataParaInput(limite);

  function atualizarPrevia() {
    // Pega o nome sem espaços extras.
    var nome = campoNome.value.trim();
    var servico = buscarServico(servicoEscolhido);
    var formularioCompleto = nome && dataEscolhida && servico;

    // Só cria a mensagem quando tudo estiver preenchido.
    if (formularioCompleto) {
      previa.textContent = "Olá! Gostaria de agendar:\n\n*Nome:* " + nome + "\n*Serviço:* " + servico.nome +
        "\n*Data desejada:* " + transformarDataEmTexto(dataEscolhida) + "\n*Valor:* " +
        formatarPreco(servico.preco) + "\n\nPor favor, confirme a disponibilidade para essa data.";
    } else {
      previa.textContent = "Preencha o serviço, a data e o seu nome para ver a mensagem.";
    }
    // Desativa os botões se faltar algum dado.
    botaoEnviar.disabled = !formularioCompleto;
    botaoCopiar.disabled = !formularioCompleto;
  }

  listaServicos.addEventListener("change", function (evento) {
    // Guarda o serviço marcado.
    servicoEscolhido = evento.target.value;
    atualizarPrevia();
  });
  campoData.addEventListener("change", function () {
    // Confere se a barbearia abre neste dia.
    var partes = campoData.value.split("-");
    var data = new Date(partes[0], partes[1] - 1, partes[2]);
    avisoData.textContent = "";
    dataEscolhida = campoData.value;
    if (DIAS_FECHADOS.indexOf(data.getDay()) !== -1) {
      dataEscolhida = "";
      avisoData.textContent = "Não atendemos neste dia da semana. Escolha outra data.";
    }
    atualizarPrevia();
  });
  campoNome.addEventListener("input", atualizarPrevia);

  formulario.addEventListener("submit", function (evento) {
    // Impede o envio normal do formulário.
    evento.preventDefault();
    if (!botaoEnviar.disabled) window.open(criarLinkWhatsApp(previa.textContent), "_blank");
  });
  botaoCopiar.addEventListener("click", function () {
    // Copia a mensagem para a área de transferência.
    navigator.clipboard.writeText(previa.textContent).then(function () {
      avisoCopia.textContent = "Mensagem copiada.";
    }).catch(function () {
      avisoCopia.textContent = "Não foi possível copiar. Selecione o texto e copie manualmente.";
    });
  });

  // Lê o serviço enviado pela página de serviços.
  var idServicoDaUrl = new URLSearchParams(location.search).get("servico");
  var opcaoInicial = listaServicos.querySelector("input[value='" + idServicoDaUrl + "']");
  if (opcaoInicial) {
    opcaoInicial.checked = true;
    servicoEscolhido = idServicoDaUrl;
  }
  atualizarPrevia();
}

/* ===== INICIALIZAÇÃO ===== */
iniciarMenu();
iniciarAno();
iniciarListaServicos();
iniciarContato();
iniciarCarrossel();
iniciarAgendamento();
