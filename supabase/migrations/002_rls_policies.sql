-- Policies para permitir acesso a usuários autenticados
-- Ajuste conforme sua regra de negócio (ex: apenas dono dos dados)

-- emp_clientes
CREATE POLICY "Permitir select para usuários autenticados"
  ON emp_clientes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir insert para usuários autenticados"
  ON emp_clientes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir update para usuários autenticados"
  ON emp_clientes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir delete para usuários autenticados"
  ON emp_clientes FOR DELETE
  TO authenticated
  USING (true);

-- emp_emprestimos
CREATE POLICY "Permitir select para usuários autenticados"
  ON emp_emprestimos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir insert para usuários autenticados"
  ON emp_emprestimos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir update para usuários autenticados"
  ON emp_emprestimos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir delete para usuários autenticados"
  ON emp_emprestimos FOR DELETE
  TO authenticated
  USING (true);

-- emp_pagamentos
CREATE POLICY "Permitir select para usuários autenticados"
  ON emp_pagamentos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Permitir insert para usuários autenticados"
  ON emp_pagamentos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir update para usuários autenticados"
  ON emp_pagamentos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir delete para usuários autenticados"
  ON emp_pagamentos FOR DELETE
  TO authenticated
  USING (true);
