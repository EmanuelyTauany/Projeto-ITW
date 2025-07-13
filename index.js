const path = require('path');
const cors = require('cors');
const express = require('express');
const { createCipheriv } = require('crypto');
const app = express();
const port = process.env.PORT || 8080;
require('dotenv').config({path: '/etc/secrets/.env'});

app.use(cors());
app.use(express.json());

 app.post('/api', async (req, res) => {
   try{
      
       if(!req.body || Object.keys(req.body).length === 0){
         return res.status(400).json({erro:"Dados não enviados"}); 
       }
     

     const userData = req.body.data ? req.body.data[0] : req.body 

     const response = await fetch('https://sheetdb.io/api/v1/omv7bzv17znba', {
        method: 'POST',
        headers: {
          'Authorization' : `Bearer ${process.env.API_KEY}`,
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(userData)
      }
     );

      if(!response.ok){
        const error = await response.text();
        throw new Error(`SheetDB API Error: ${error}`); 
      }

     const dados = await response.json();
     res.json(dados);

   } catch(err){
    console.log(err);
    res.status(500).json({erro: "Erro ao chamar a API"});
   }
 })


 app.use(express.static(path.join(__dirname, 'public')));
   app.get('/', (req, res) => {
     res.sendFile(path.join(__dirname, 'public', '/index.html'));

  });

  app.listen(port, () => {
        console.log(`Server rodando na porta ${port}`);
  });
  
  app.get('/api/search', async (req, res) => {
    try{
      const cpf = req.query.cpf;
      if(!cpf){
        return res.status(400).json({erro:"CPF não fornecido!"})
      }

  
      const response = await fetch(`https://sheetdb.io/api/v1/omv7bzv17znba/search?cpf=${cpf}`, {
        method:'GET',
        headers: {
          'Authorization' : `Bearer ${process.env.API_KEY}`,
          'Content-text' : 'application/json'
        }
      });

      if(!response.ok){
        const error = await response.text();
        throw new Error(`Erro na API do SheetDB durante a busca: ${error}`);

      }

      const data = await response.json();
      res.json(data);

    } catch(err){
      console.log(err);
      res.status(500).json({erro: "Erro ao buscar usuário via CPF"});
    }
  })

app.post('/api/login', async (req, res) =>{
  try{
    const {nome, senha} = req.body;

    if(!nome || !senha){
      return res.status(400).json({ erro:"Nome de usuário e senha são obrigatórios para login"});

    }

    const response = await fetch(`https://sheetdb.io/api/v1/omv7bzv17znba/search?nome=${encodeURIComponent(nome)}`, {
      method: 'GET',
      headers: {
        'Authorization' : `Bearer ${process.env.API_KEY}`,
        'Content-Type' : 'application/json'
      }
    });

    if(!response.ok){
      const error = await response.text();
      throw new Error(`Erro na API durante a busca do login: ${error}`);
    }

    const users = await response.json();

    const foundUser = users.find(user => user.nome?.toString().trim().toLowerCase() === nome.toLowerCase() &&
    user.senha?.toString().trim() === senha);

    if (foundUser) {
       const userPublicData = {
            nome: foundUser.nome,
            email: foundUser.email,
            cpf: foundUser.cpf
       };

       res.json([userPublicData]);
    } else {
      return res.status(401).json({erro: "Usuário ou senha inválidos."})
    }


  } catch (err){
    console.error(err);
    res.status(500).json({erro:"Erro ao tentar o login no servidor!"})
  }
}
);

app.post('/api/evento', async (req, res) => {
  try{
    const evento = req.body;
    const resposta = await fetch(process.env.API_URL_KEY2, {
      method: 'POST',
      headers:{
        'Authorization': `Bearer ${process.env.API_KEY2}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: [{...evento, data_criacao: new Date().toISOString()}]
      })
    });

    const json = await resposta.json();
    res.json(json);

  
  }catch (err){
    console.error(err);
    res.status(500).json({erro:'Erro ao registrar evento'});
  }
}) 

app.get('/api/evento', async (req, res) =>{
  try{
    const resposta = await fetch(process.env.API_URL_KEY2, {
      headers:{
        'Authorization': `Bearer ${process.env.API_KEY2}`,
        'Content-Type': 'application/json'
      }
    });

  if(!resposta.ok){
   const error = await resposta.text();
   throw new Error(`Erro na API do SheetDB: ${error}`);
  }

  const dados = await resposta.json();
  res.json(dados);
  } catch(err){
    console.error(err);
    res.status(500).json({erro:'Erro ao buscar eventos'});
  }
});