const API_Contas = 'https://projeto-itw.onrender.com/api';

async function cadastrarConta(usuario){
    try{
        const response = await fetch(`${API_Contas}/search?cpf=${usuario.cpf}`,
            {headers : {
                 'Content-Type' : 'application/json'
            }}
        );
        const verificacao = await response.json();

        if(verificacao.length > 0){
            throw new Error('CPF já cadastrado!');
        }

        const resposta = await fetch(API_Contas, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({data: [{
                ...usuario,
                id: Date.now()
            }]})
            
        });

        if(!resposta.ok) throw new Error("Erro ao cadastrar usuário.");

        return await resposta.json();
    }catch(erro){
        throw erro;
    }
}

 document.getElementById('register-button')?.addEventListener('click', async (e) => {
    e.preventDefault();
    try{
         
        const inputs = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        cpf: document.getElementById('cpf').value,
        telefone:  document.getElementById('telefone').value,
        senha: document.getElementById('senha').value
    
    }    
    
    
      if(!inputs.nome || !inputs.email || !inputs.cpf || !inputs.senha){
        alert("Preencha todos os campus de cadastro!");
        return;
      }
      
      const senha = document.getElementById('senha').value;
      const c_senha = document.getElementById('c_senha').value;

      if(senha !== c_senha){
        alert("As senhas digitadas não coincidem!");
        
        return;
      }
      
      const usuario = {
        nome:inputs.nome,
        email:inputs.email,
        cpf:inputs.cpf,
        telefone:inputs.telefone,
        senha:inputs.senha
    }
      const button_context  = e.target;
      button_context.disabled = true;
      button_context.textContent = 'Cadastrando...';

       await cadastrarConta(usuario);
         alert("Usuário cadastrado com sucesso!")
        window.location.href = 'index.html';

    }catch(erro){
        alert('Erro: '+erro.message);
        console.error({erro: erro, stack:erro.stack});
    }finally{
      const button_context = e.target;
      button_context.disabled = false;
      button_context.textContent = "Registrar";
    }
    
});









//const SheetDB = window.sheetdb;

//SheetDB.read('https://sheetdb.io/api/v1/jd82yvgnpnv6v', {}).then(function(result){
   //console.log(result);
//}, function(error){
   // console.log(error);//});
