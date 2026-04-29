import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://177.11.146.114:54321'
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'
const email = process.env.TEST_EMAIL || ''
const password = process.env.TEST_PASSWORD || ''

async function test() {
  const supabase = createClient(url, anonKey, { auth: { persistSession: false } })

  console.log('=== Teste Final ===\n')

  // 1. Login
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password })
  if (loginError) {
    console.error('❌ Login falhou:', loginError.message)
    return
  }
  console.log('✅ Login OK:', loginData.user.email, '\n')

  // 2. Testar cada tabela
  const tables = ['EMP_clientes', 'EMP_emprestimos', 'EMP_pagamentos']
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1)
    if (error) {
      console.error(`❌ ${table}:`, error.message)
    } else {
      console.log(`✅ ${table}: OK (${data.length} registros)`)
    }
  }

  // 3. Tentar inserir um cliente de teste
  console.log('\n--- Teste de INSERT ---')
  const { data: insertData, error: insertError } = await supabase
    .from('EMP_clientes')
    .insert({ nome: 'Cliente Teste', email: 'teste@teste.com', telefone: '11999999999' })
    .select()

  if (insertError) {
    console.error('❌ Insert falhou:', insertError.message)
  } else {
    console.log('✅ Insert OK! Cliente criado:', insertData[0].id)
  }

  // 4. Listar todos os clientes
  console.log('\n--- Listando clientes ---')
  const { data: clientes, error: listError } = await supabase.from('EMP_clientes').select('*')
  if (listError) {
    console.error('❌ Listar clientes falhou:', listError.message)
  } else {
    console.log(`✅ Total de clientes: ${clientes.length}`)
    clientes.forEach(c => console.log(`   - ${c.nome} (${c.email || 'sem email'})`))
  }

  console.log('\n=== Fim ===')
}

test().catch(console.error)
