var knex = require("../database/connection");// importando minha conexão com banco
var User = require("./User");// importando minha pasta User

class passwordToken{//23º criando token, lebrar de exportar no final da pagina
    async create(email){//recebendo email do body, cod pagina UserController.js
        var user = await User.findByEmail(email)//enviado email para o findByEmail e retornando resultado em user 
            if(user != undefined){// se user for diferente de undefined, significa que existe usuário com email enviado no body
                try{// para verdadeiro
                    var token = Date.now()//variável token recebe hora
                    await knex.insert({// inserir no banco 
                        user_id: user.id,// user_id recebe o id do usuário
                        used: 0,// used recebe 0
                        token: token// token recebe o token
                    }).table("passwordusers")// da tabela "passwordusers" >> Obs. precisa criar uma relação, com chave extrangeira
                    return {status: true,token: token}// retorna o status true, token: token
                }catch(err){// para falso
                    console.log(err);
                    return {status: false, err: err}// retorne false, erro: err
                }
            }else{// se usuário for undefined, significa que usuário não existe com o email do body
                return {status: false, err: "O email passado não existe no banco de dados!"}// retorne status: false, err: "o email passado não existe no banco de dados!"
            }
    }

    async validate(token){//26º validando token recebido no parametro
        try{// para verdadeiro
            var result = await knex.select().where({token: token}).table("passwordusers")// verificando no banco de dados "knex" selecione , onde o token do banco seja igual ao token passado no body, o retorno adicione em result

            if(result.length > 0){// se o comprimento do resultado for maior que 0, significa que resultado foi encontrado

                var tk = result[0];// variável tk recebe o primeiro resultado encontrado

                if(tk.used){//se o resultado.used for true 1
                    return {status: false};// retorne status false
                }else{// caso o resultado.used for false 0
                    return {status: true,token: tk};// retorne status true, token: resultado
                }
            }else{// caso resultado não foi encontrado
                return {status: false};// retorne status false
            }
        }catch(err){// para false
            console.log(err);
            return {status: false};// retorne status false
        }
    }

    async setUsed(token){//29º setUsed recebendo o token
        await knex.update({used: 1}).where({token: token}).table("passwordusers")// no banco "knex" atualize o used para 1, onde token seja igual a token do body da tabela "passwordusers"
    }
}

module.exports = new passwordToken()