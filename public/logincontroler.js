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
            
           },

           body: JSON.stringify({
            nome : nome,
            senha : senha
           })
        });

        if(!response.ok){
          
          const errorData = await response.json();
          if(response.status === 401) {
            throw new Error(errorData.error || "Usuário ou senha inválidos!");
          } else {
            throw new Error(errorData.error || "Falha na conexão com o servidor!")
          }
        }
         
        const usuarioLogadoData = await response.json();
        
        if(!usuarioLogadoData || usuarioLogadoData.length === 0 || !usuarioLogadoData[0].nome){
         throw new Error("Erro ao receber os dados do usuário no servidor!");
        
        }

        localStorage.setItem("usuarioLogado", JSON.stringify(
          usuarioLogadoData[0]
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