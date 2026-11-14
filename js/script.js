/* Formatação, datas e mensagens do WhatsApp */
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    .replace(/\u00a0/g, " ");
}

// Cria a data no fuso local para evitar mudanças de dia por causa do UTC.
function lerData(textoData) {
  const [ano, mes, dia] = textoData.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
}

function formatarData(textoData) {
  return lerData(textoData).toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
}

function dataParaTexto(data) {
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
}

// Monta a mensagem pronta que será enviada ou copiada pelo cliente.
function montarMensagem(nome, servico, textoData) {
  return [
    "Olá! Gostaria de agendar:",
    "",
    `*Nome:* ${nome}`,
    `*Serviço:* ${servico.nome}`,
    `*Data desejada:* ${formatarData(textoData)}`,
    `*Valor:* ${formatarPreco(servico.preco)}`,
    "",
    "Por favor, confirme a disponibilidade para essa data."
  ].join("\n");
}

function criarLinkWhatsApp(texto = "") {
  const numero = BARBEARIA.whatsapp.replace(/\D/g, "");
  const mensagem = texto ? `?text=${encodeURIComponent(texto)}` : "";
  return `https://wa.me/${numero}${mensagem}`;
}

/* Menu: alterna entre aberto e fechado, inclusive após navegar */
function iniciarMenu() {
  const botao = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#menu-principal");
  if (!botao || !menu) return;

  function definirMenu(aberto) {
    menu.classList.toggle("aberto", aberto);
    botao.setAttribute("aria-expanded", String(aberto));
    botao.querySelector("[aria-hidden]").textContent = aberto ? "×" : "☰";
    botao.querySelector(".sr-only").textContent = aberto ? "Fechar menu" : "Abrir menu";
  }

  botao.addEventListener("click", () => {
    definirMenu(botao.getAttribute("aria-expanded") !== "true");
  });
  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => definirMenu(false));
  });
}

/* Rodapé: mantém o ano atualizado automaticamente */
function iniciarAno() {
  document.querySelectorAll("#ano").forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/* Catálogo: cria os cartões a partir dos dados de serviços */
function iniciarListaServicos() {
  const paginaAgendamento = location.pathname.split("/").includes("pages")
    ? "agendar.html"
    : "pages/agendar.html";

  document.querySelectorAll("[data-lista-servicos]").forEach(lista => {
    lista.innerHTML = SERVICOS.map(s => `
      <article class="cartao-servico">
        <div class="cartao-topo">
          <h3>${s.nome}</h3>
          <span class="preco">${formatarPreco(s.preco)}</span>
        </div>
        <p>${s.descricao}</p>
        <div class="cartao-base">
          <a href="${paginaAgendamento}?servico=${s.id}">Agendar</a>
        </div>
      </article>
    `).join("");
  });
}

/* Contato: preenche os dados e o link de conversa */
function iniciarContato() {
  document.querySelectorAll("[data-campo]").forEach(el => {
    const valor = BARBEARIA[el.dataset.campo];
    el.textContent = valor || "A confirmar com a barbearia";
  });
  document.querySelectorAll("[data-link-whatsapp]").forEach(link => {
    link.href = criarLinkWhatsApp();
  });
}

/* Carrossel: troca a foto pelas setas e pelos indicadores */
function iniciarCarrossel() {
  const carrossel = document.querySelector("[data-carrossel]");
  if (!carrossel) return;

  const slides = carrossel.querySelectorAll(".slide");
  const pontos = carrossel.querySelectorAll(".ponto");
  let atual = 0;

  function mostrar(indice) {
    atual = (indice + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("ativo", i === atual));
    pontos.forEach((ponto, i) => {
      ponto.classList.toggle("ativo", i === atual);
      ponto.setAttribute("aria-current", i === atual ? "true" : "false");
    });
  }

  carrossel.querySelector(".seta-anterior").addEventListener("click", () => mostrar(atual - 1));
  carrossel.querySelector(".seta-proxima").addEventListener("click", () => mostrar(atual + 1));
  pontos.forEach((ponto, i) => {
    ponto.addEventListener("click", () => mostrar(i));
  });

  mostrar(0);
}

/* Agendamento: controla escolhas, prévia, cópia e envio pelo WhatsApp */
function iniciarAgendamento() {
  const formulario = document.querySelector("#form-agendamento");
  if (!formulario) return;

  const listaServicos = document.querySelector("#opcoes-servico");
  const campoData = document.querySelector("#data");
  const avisoData = document.querySelector("#aviso-data");
  const campoNome = document.querySelector("#nome");
  const previa = document.querySelector("#previa");
  const botaoEnviar = document.querySelector("#btn-enviar");
  const botaoCopiar = document.querySelector("#btn-copiar");
  const avisoCopia = document.querySelector("#aviso-copia");

  const escolha = { servicoId: null, data: "" };

  // Cria as opções do formulário usando o catálogo central de serviços.
  listaServicos.innerHTML = SERVICOS.map(s => `
    <label class="opcao">
      <input type="radio" name="servico" value="${s.id}" required>
      <span class="opcao-corpo">
        <strong>${s.nome}</strong>
        ${s.duracao ? `<small>${s.duracao}</small>` : ""}
        <span class="preco">${formatarPreco(s.preco)}</span>
      </span>
    </label>
  `).join("");

  const servicoDaUrl = new URLSearchParams(location.search).get("servico");
  const radioInicial = listaServicos.querySelector(`input[value="${servicoDaUrl}"]`);
  if (radioInicial) {
    radioInicial.checked = true;
    escolha.servicoId = servicoDaUrl;
  }

  listaServicos.addEventListener("change", evento => {
    escolha.servicoId = evento.target.value;
    atualizarPrevia();
  });

  // Limita o calendário aos próximos 60 dias.
  const hoje = new Date();
  const limite = new Date();
  limite.setDate(hoje.getDate() + 60);
  campoData.min = dataParaTexto(hoje);
  campoData.max = dataParaTexto(limite);

  campoData.addEventListener("change", () => {
    avisoData.textContent = "";

    if (!campoData.value) {
      escolha.data = "";
    } else if (DIAS_FECHADOS.includes(lerData(campoData.value).getDay())) {
      escolha.data = "";
      avisoData.textContent = "Não atendemos neste dia da semana. Escolha outra data.";
    } else {
      escolha.data = campoData.value;
    }
    atualizarPrevia();
  });

  campoNome.addEventListener("input", atualizarPrevia);

  function atualizarPrevia() {
    const servico = SERVICOS.find(s => s.id === escolha.servicoId);
    const nome = campoNome.value.trim();
    const completo = servico && escolha.data && nome;

    if (completo) {
      previa.textContent = montarMensagem(nome, servico, escolha.data);
    } else {
      previa.textContent = "Preencha o serviço, a data e o seu nome para ver a mensagem.";
    }
    botaoEnviar.disabled = !completo;
    botaoCopiar.disabled = !completo;
  }

  formulario.addEventListener("submit", evento => {
    evento.preventDefault();
    if (botaoEnviar.disabled) return;
    window.open(criarLinkWhatsApp(previa.textContent), "_blank", "noopener,noreferrer");
  });

  botaoCopiar.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(previa.textContent);
      avisoCopia.textContent = "Mensagem copiada.";
    } catch (erro) {
      avisoCopia.textContent = "Não foi possível copiar. Selecione o texto e copie manualmente.";
    }
  });

  atualizarPrevia();
}

/* Ativa somente os recursos presentes na página atual */
iniciarMenu();
iniciarAno();
iniciarListaServicos();
iniciarContato();
iniciarCarrossel();
iniciarAgendamento();
