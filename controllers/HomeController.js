/* 2º
Aqui esta minha pagina inicial, criamos como home controller e invocamos na rota "/"
Esta aplicação somente envia para tela o "APP EXPRESS! - Guia do programador"
*/
class HomeController{// utilizando class para deixar o cod mais alinhado

    async index(req, res){// prómise async - no index
        res.send("APP EXPRESS! - Guia do programador");
    }

}

module.exports = new HomeController();// exportando para rota