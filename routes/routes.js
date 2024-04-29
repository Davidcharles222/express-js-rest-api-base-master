/*Aqui estão todas rotas da aplicação*/
var express = require("express")// importando biblioteca express
var app = express();// adicionado express a app
var router = express.Router();//lembrar de exportar as rotas
var HomeController = require("../controllers/HomeController");
var UserController = require("../controllers/UserController");
var AdminAuth = require('../middleware/AdminAuth')// importando pagina do cod AdminAuth para definir as rotas que precisará dessa definição

router.get('/', HomeController.index);/*3º adicionando pagina inicial na rota, pagina HomeController na class index */
router.post('/user',UserController.create);/*5º metodo post para pegar informações do body, utilizando a rota user do cod que está na pagina UserController.create  */
router.get('/user',UserController.index,AdminAuth);/*8º metodo get para pegar todos usuários da pagina UserController.index e mostrar na tela */
router.get('/user/:id',UserController.findUser);/*11º metodo get para pegar o usuário do id específico da pagina UserController.edit e mostrar na tela */
router.put('/user',UserController.edit);/*19º metodo put para atualizar usuário da pagina UserController.edit*/
router.delete('/user/:id',UserController.remove)/*22º metodo delete para deletar usuário do id mencionado na pagina UserController.remove */
router.post('/recoverpassword',UserController.recoverPassword);//25º metodo post para pegar informações do body, cod na página UserController.recoverPassword
router.post('/changepassword', UserController.changePassword);//28º metodo post para pegar informações do body, cod na página UserController.changePassword
router.post('/login',UserController.login);//30º metodo post para pegar informações do body, cod na pagina UserController.login

module.exports = router;