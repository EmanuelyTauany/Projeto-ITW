const API_Contas = 'https://projeto-itw.onrender.com/api';

document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById("login-button");

    btnLogin.addEventListener("click", async (e) =>{
        e.preventDefault();
        
        const nome = document.getElementById("nome")?.value.trim();
        const senha = document.getElementById("senha")?.value.trim();
        
        
        
        if(!nome || !senha){
            alert("Preencha todos os campos!");
            return;
        }


    try{

        btnLogin.disabled = true;
        btnLogin.innerHTML = '<span class="spinner-border spinner-border-sm role="status" aria-hidden="true"></span> Verificando...';

        const response = await fetch(`${API_Contas}/login`, {
           method: 'POST',
           headers: {
            'Content-Type':'application/json'
            //"Authorization":"Bearer ${process.env.API_KEY}"
           },

           body: JSON.stringfify({
            nome : nome,
            senha : senha
           })
        });

        if(!response.ok){
          throw new Error("Falha na conexão com o servidor!");
        }
         
        const usuarios = await response.json();

        const usuarioValido = usuarios.find(
          (user) => user.nome?.toString().trim().toLowerCase() === nome.toLowerCase() && user.senha?.toString().trim() === senha
        );
        
        if(!usuarioValido){
         throw new Error("Usuário ou senha inválidos!");
        
        }

        localStorage.setItem("usuarioLogado", JSON.stringify({
          nome: usuarioValido.nome,
          email: usuarioValido.email,
          cpf: usuarioValido.cpf
        }
        ));
      
        alert("Login realizado com sucesso!");
        window.location.href = "homepage.html";
       
        
    }catch(error){
       alert("Erro ao tentar o login: " + error.message);
       console.error(error);
       
    } finally {
        btn = document.getElementById("login-button");
        if(btn){
          btnLogin.disabled = false;
          btnLogin.textContent = "Acessar Sistema";
        }
        
    }

  });
});