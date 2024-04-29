var jwt = require("jsonwebtoken");//importando biblioteca jsonwebtoken
var secret = "kdfjakfakdfakdljfakdfj";// secrete padrão para bibliotela jsonwebtoken

module.exports = function(req, res, next){//31º middleware criado para os campos que somente os adim podem acessar

    const authToken = req.headers['authorization']// no header precisa ter o token para prosseguir com a req

    if(authToken != undefined){// se outhToken for diferente de undefined, significa que o token foi passado
        const bearer = authToken.split(' ');// separando o authToken em array, duas partes
        var token = bearer[1];// pegando a segunda parte do bearer, onde está somente o cod do token

        var decoded = jwt.verify(token, secret);// padrão para verificar algo

        if(decoded.role == 1){// se o role for == 1 
            next();//pule para o proximo ou seja, prossiga esta tudo certo
        }else{// se o role for == 0
            res.status(403);// resposta de status 403 >> "Proibido"
            res.send("Você não tem permissão para isso!");// responde na tela "Você não tem permissão para isso!"
            return;// pare aplicação
        }

        console.log(decoded)
        next();
    }else{// caso o token não foi passado
        res.status(403);// resposta de status 403 >> "Proibido"
        res.send("Você não está autenticado");// responde na tela "Você não está autenticado"
        return;// pare aplicação
    }
}