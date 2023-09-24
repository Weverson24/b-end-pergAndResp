require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser")
const connection = require("./database/database")
const Pergunta = require("./database/Pergunta")
const Resposta = require("./database/Resposta")
const app = express();


//consfigurando banco de dados
connection.authenticate().then(() => {
    console.log("Conecxão feita")
}).catch(err => {
    console.log("erro localizado: " + err)
})


//estamos dizendo que app usara a view engine ejs como padrao
app.set("view engine", "ejs");

//Aqui estou dizendo para o express ussar essa pasta publica com arquivos staticos
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());



app.get("/", (req, res) => {
    Pergunta.findAll({raw: true, order:[
        ['id','DESC']
    ]}).then(perguntas => {
       res.render("index",{
        perguntas: perguntas
       })
    })
  
});

app.get("/perguntar",(req,res) => {
    res.render("perguntar")
})

app.post('/salvarpergunta',(req,res) => {
    const titulo = req.body.titulo;
    const descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/")
    })
})

app.get("/pergunta/:id",(req,res) => {
    var id = req.params.id
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [ 
                    ['id','DESC'] 
                ]
            }).then(respostas => {
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas
                })
            }) 
        }else{
            res.redirect("/")
        }
    })
})

app.post("/responder",(req,res) => {
    const corpo = req.body.corpo;
    const perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/"+perguntaId)
    })

})


//render é desenhar na tela assim que quer dizer:

app.listen(process.env.PORT, () => {
  console.log("ola mundo!");
});
