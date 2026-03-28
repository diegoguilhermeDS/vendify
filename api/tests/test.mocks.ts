// ✅ Dados válidos para produtos
export const validProduct = {
  name: "Notebook Dell XPS 13",
  price: 2500,
};

export const validProduct2 = {
  name: 'Monitor LG 27"',
  price: 1200,
};

export const validProduct3 = {
  name: "Teclado Mecânico",
  price: 350,
};

export const validProduct4 = {
  name: "Mouse sem Fio",
  price: 150,
};

// ❌ Dados inválidos para produtos
export const invalidProducts = {
  emptyName: {
    name: "",
    price: 100,
  },
  negativoPrice: {
    name: "Produto",
    price: -50,
  },
  missingPrice: {
    name: "Produto",
  },
  missingName: {
    price: 100,
  },
};

// ✅ Dados válidos para clientes
export const validClient = {
  name: "João Silva Santos",
  email: "joao.silva@example.com",
};

export const validClient2 = {
  name: "Maria Oliveira",
  email: "maria.oliveira@example.com",
};

export const validClient3 = {
  name: "Pedro Costa",
  email: "pedro.costa@example.com",
};

export const validClient4 = {
  name: "Ana Santos",
  email: "ana.santos@example.com",
};

// ❌ Dados inválidos para clientes
export const invalidClients = {
  emptyName: {
    name: "",
    email: "test@example.com",
  },
  emptyEmail: {
    name: "Cliente",
    email: "",
  },
  invalidEmail: {
    name: "Cliente",
    email: "not-an-email",
  },
  missingEmail: {
    name: "Cliente",
  },
  missingName: {
    email: "test@example.com",
  },
};


// ❌ Dados inválidos para itens de pedido
export const invalidOrderItems = {
  negativeQtde: {
    id_produto: 1,
    qtde: -1,
    preco: 100,
  },
  zeroQtde: {
    id_produto: 1,
    qtde: 0,
    preco: 100,
  },
  missingQtde: {
    id_produto: 1,
    preco: 100,
  },
  missingProduct: {
    qtde: 2,
    preco: 100,
  },
};
