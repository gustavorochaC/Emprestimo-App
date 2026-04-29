-- Create tables with EMP_ prefix
CREATE TABLE IF NOT EXISTS emp_clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cpf_cnpj TEXT,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS emp_emprestimos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES emp_clientes(id) ON DELETE CASCADE,
  valor NUMERIC(12,2) NOT NULL,
  taxa_juros NUMERIC(5,2) NOT NULL,
  data_inicio DATE NOT NULL,
  data_vencimento DATE,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'quitado', 'inadimplente')),
  observacoes TEXT,
  criado_em TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS emp_pagamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emprestimo_id UUID NOT NULL REFERENCES emp_emprestimos(id) ON DELETE CASCADE,
  valor NUMERIC(12,2) NOT NULL,
  data_pagamento DATE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('parcial', 'juros', 'quitacao')),
  observacoes TEXT,
  criado_em TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE emp_clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE emp_emprestimos ENABLE ROW LEVEL SECURITY;
ALTER TABLE emp_pagamentos ENABLE ROW LEVEL SECURITY;
