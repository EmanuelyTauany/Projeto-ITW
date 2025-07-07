const path = require('path');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const port = 8080;
require('dotenv').config({path: '/etc/secrets/.env'});

app.use(cors());
app.use(express.json());

 app.post('/api', async (req, res) => {
   try{
     const response = await fetch('https://projeto-itw.onrender.com', {
        method: 'POST',
        headers: {
          'Authorization' : `Bearer ${process.env.API_KEY}`,
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(req.body)
      }
     );

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



