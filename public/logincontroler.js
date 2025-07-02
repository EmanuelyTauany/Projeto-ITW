const API_Contas = 'https://sheetdb.io/api/v1/omv7bzv17znba';

async function ControlerLogin(email, senha){
    try{
        const response = await fetch(`${API_Contas}/search?email=${usuario.email},senha=${usuario.senha}`);
        {headers : {
            Authorization: `Bearer `
        }}

        const usuario = await response.json();

        if(usuario.length === 0){
         throw new Error("Usuário inexistente!");
        }
        
    }catch(error){
    
    }
}