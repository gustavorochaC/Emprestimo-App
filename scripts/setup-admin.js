const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://177.11.146.114:54321';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
});

async function main() {
  const email = 'gustavorocarvalho@hotmail.com';
  const password = '*!@Gu221204';

  console.log('🔍 Verificando se o usuário existe...');
  
  // Listar todos os usuários
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('❌ Erro ao listar usuários:', listError.message);
    return;
  }
  
  console.log(`📋 Total de usuários: ${users.users.length}`);
  
  const existingUser = users.users.find(u => u.email === email);
  
  if (existingUser) {
    console.log('✅ Usuário encontrado:', existingUser.email);
    console.log('📝 ID:', existingUser.id);
    
    // Atualizar senha para garantir que está correta
    console.log('🔄 Atualizando senha...');
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      { password }
    );
    
    if (updateError) {
      console.error('❌ Erro ao atualizar senha:', updateError.message);
    } else {
      console.log('✅ Senha atualizada com sucesso!');
    }
  } else {
    console.log('⚠️ Usuário NÃO encontrado. Criando...');
    
    // Criar usuário
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirmar email automaticamente
    });
    
    if (createError) {
      console.error('❌ Erro ao criar usuário:', createError.message);
    } else {
      console.log('✅ Usuário criado com sucesso!');
      console.log('📝 ID:', createData.user.id);
    }
  }
  
  // Testar login
  console.log('\n🧪 Testando login...');
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (loginError) {
    console.error('❌ Login falhou:', loginError.message);
  } else {
    console.log('✅ Login bem-sucedido!');
    console.log('📝 User ID:', loginData.user.id);
  }
}

main().catch(console.error);
