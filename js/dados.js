const BARBEARIA = {
  // Dados da barbearia.
  whatsapp: "554891022321",
  endereco: "Centro, Morro da Fumaça - SC, 88830-000",
  telefone: "(48) 99102-2321",
  funcionamento: "Segunda a sábado, das 9h às 20h"
};

// Lista de serviços.
const SERVICOS = [
  {
    id: "corte-adulto",
    nome: "Corte adulto",
    descricao: "Corte de cabelo para adultos.",
    preco: 40
  },
  {
    id: "corte-infantil",
    nome: "Corte infantil",
    descricao: "Corte de cabelo infantil.",
    preco: 35
  },
  {
    id: "recorte",
    nome: "Recorte",
    descricao: "Serviço de recorte.",
    preco: 15
  },
  {
    id: "barba",
    nome: "Barba",
    descricao: "Cuidado e acabamento da barba.",
    preco: 30
  },
  {
    id: "barba-toalha-quente",
    nome: "Barba com toalha quente",
    descricao: "Serviço de barba com toalha quente.",
    preco: 35
  },
  {
    id: "sobrancelha",
    nome: "Sobrancelha",
    descricao: "Cuidados e acabamento da sobrancelha.",
    preco: 10
  },
  {
    id: "limpeza-nariz",
    nome: "Limpeza de nariz",
    descricao: "Limpeza de nariz.",
    preco: 10
  },
  {
    id: "limpeza-orelha",
    nome: "Limpeza de orelha",
    descricao: "Limpeza de orelha.",
    preco: 10
  }
];

// Horários disponíveis.
const HORARIOS = [
  "09:00", "09:45", "10:30", "11:15",
  "14:00", "14:45", "15:30", "16:15", "17:00", "17:45",
  "18:30", "19:15"
];

// Dias fechados: 0 é domingo e 6 é sábado.
const DIAS_FECHADOS = [0];
