# Coimbra Barbearia — site (versão 2)

Tema preto com detalhes em azul, cores sólidas, sem efeitos. As fontes usam opções locais do sistema e todas as imagens ficam na pasta `imagens/`.

## Como abrir
Extraia o ZIP e abra `index.html` no navegador. As imagens e fontes estão locais ou são fontes padrão do sistema.

## Páginas
- `index.html`: página inicial, com apresentação da barbearia, carrossel e acesso ao agendamento.
- `pages/servicos.html`: serviços e preços.
- `pages/sobre.html`: história, diferenciais e galeria.
- `pages/contato.html`: endereço, telefone e funcionamento.
- `pages/agendar.html`: escolha de serviço, data e horário; envia a mensagem pelo WhatsApp.

## Estrutura
- `pages/`: páginas internas do site.
- `css/style.css`: cores, layout e adaptação para telas menores.
- `js/dados.js`: **serviços, preços, horários, dias fechados, contato e WhatsApp**.
- `js/script.js`: menu, lista de serviços, contato, carrossel e agendamento.
- `imagens/`: imagens locais do site, incluindo o banner exibido no topo das páginas internas.

## Antes de publicar
1. Em `js/dados.js`, conferir o WhatsApp (configurado como `554891022321`).
2. Conferir preços e horários.
3. Se desejar, substituir as fotos de exemplo em `imagens/` por fotos reais da barbearia.

## Observação
O site não tem servidor nem banco de dados: o pedido vai por WhatsApp e a barbearia confirma o horário.
