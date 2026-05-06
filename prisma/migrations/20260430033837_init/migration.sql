-- CreateTable
CREATE TABLE "emp_clientes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" TEXT NOT NULL,
    "cpf_cnpj" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "endereco" TEXT,
    "observacoes" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emp_clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emp_emprestimos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cliente_id" UUID NOT NULL,
    "valor" DECIMAL(12,2) NOT NULL,
    "taxa_juros" DECIMAL(5,2) NOT NULL,
    "data_inicio" DATE NOT NULL,
    "data_vencimento" DATE,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "observacoes" TEXT,
    "criado_em" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emp_emprestimos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emp_pagamentos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "emprestimo_id" UUID NOT NULL,
    "valor" DECIMAL(12,2) NOT NULL,
    "data_pagamento" DATE NOT NULL,
    "tipo" TEXT NOT NULL,
    "observacoes" TEXT,
    "criado_em" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emp_pagamentos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "emp_emprestimos" ADD CONSTRAINT "emp_emprestimos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "emp_clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emp_pagamentos" ADD CONSTRAINT "emp_pagamentos_emprestimo_id_fkey" FOREIGN KEY ("emprestimo_id") REFERENCES "emp_emprestimos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
