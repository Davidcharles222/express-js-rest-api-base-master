/*
Aqui ficará todo cod que irá interagir com a tela
Abaixo importamos todas açoes necessárias para o app
*/
var User = require("../models/User")
var passwordToken = require("../models/PasswordToken");
var jwt = require("jsonwebtoken");//biblioteca para definir acesso aos adm somente
var bcrypt = require("bcrypt");// biblioteca para criptografar as senhas do usuário

var secret = "kdfjakfakdfakdljfakdfj"// padrão do swt

class UserController{// lembrar de exportar UserController no final da página

    async index(req, res){//7º app criada para mostrar todos usuários na tela
        var users = await User.findAll()// na pagina User.findAll receba todos usuários que contém no banco de dados
        res.json(users);// mostre todos usuários na pagina
        // adicionando em rotas
    }

    async findUser(req, res){// 10º app criado para filtrar um usuário especifico pelo id
        var id = req.params.id;// recebendo o id pelo parâmetro de busca
        var user = await User.findById(id);// recebendo na variante user o resultado da busca encontrada pela promise findById onde enviamos também o id do parametro

        if(user == undefined){// se user for igual a undefined significa que não foi encontrado usuário especifico
            res.status(404);// resposta de status 404 >> "Não encontrado"
            res.json({});// responde em json um objeto vazio
        }else{// caso contrário, esteja encontrado o id
            res.status(200);// resposta de status 200 >> "Ok"
            res.json(user);// responde em json usuário encontrado
        }
    }

    async create(req, res){/*4º nessa promise criamos nossos users */
        
        var {name, email, password} = req.body;// pelo body pegamos e adicionamos nas variantes {name, email, password}

        if(email == undefined){// validando, se email == undefined 
            res.status(400)// resposta no status 400 >> "requisição inválida"
            res.json({err: "O e-mail é inválido!"})// responde em json "err: O e-mail é inválido!"
            return;
        }

        var emailExists = await User.findEmail(email)/*13º passando o email do body no parametro de findEmail para filtragem e retornando o valor na variável emailExists */

        if(emailExists){// se emailExists for true
            res.status(406);// resposta de status 406 >> "Não aceitável"
            res.json({err: "O e-mail já está cadastrado!"});// responde em json o "err: O e-mail já está cadastrado!"
            return// return aqui para parar o cod 
        }
       
        await User.new(email, password, name)//15º dando tudo certo para criação de usuário, envios para User.new o email criado, o password criado e o name criado, estamos criptografando a senha

        res.status(200); //resposta no status 200 >> "Ok"
        res.send("Tudo OK!")// responde em json "Tudo ok!"
    }

    async edit(req, res){//18º nessa promise editados usuário
        var {id, name, role, email} = req.body;// recebendo informações do body

        var result = await User.update(id, email, name, role);// enviando informações do body para User.update, e recebendo o retorno em result
        if(result != undefined){//se resultado for diferente de undefined, significa que foi editado
            if(result.status){// se resultado for true
                res.status(200);// resposta de status 200 >> "Ok"
                res.send("Tudo ok!");// responde na tela "Tudo ok!"
            }else{// caso resultado.status for false
                res.status(406); // resposta de status 406 >> "Não aceitavel"
                res.send(result.err);// responde na tela o result.err
            }
        }else{// caso contrário, resultado for undefined
            res.status(406);// resposta de status 406 >> "Não aceitável"
            res.send("Ocorreu um erro no servidor!");// responde na tela "Ocorreu um erro no servidor!"
        }
    }

    async remove(req, res){//21º nessa promise removemos usuário
        var id = req.params.id;// recebendo na variavel id o id passado no parametro da busca

        var result = await User.delete(id)// resutado se true ou falso do UserDelete, onde enviamos o id do params para verificação

        if(result.status){// se result.status for true
            res.status(200);// resposta de status 200 >> "Ok"
            res.send("Tudo ok!")// responde na tela "Tudo ok!"
        }else{// caso result.status for false
            res.status(406);// resposta de status 406 >> "Não aceitavel"
            res.send(result.err);// responde na tela o erro do result
        }
    }

    async recoverPassword(req, res){//24º recuperar senha
        var email = req.body.email// variável email recebe email do body
        var result = await passwordToken.create(email)// variável result recebe retorno do passwordToken.create, onde enviamos o email para verificação.
        if(result.status){// se o status do resultado for true
            res.status(200)// resposta de status 200 >> "Ok"
            res.send(""+result.token);// responde da tela o número do token
        }else{// caso o status do resultado for false
            res.status(406)// resposta de status 406 >> "Metodo não permitido"
            res.send(result.err);// responde na tela o erro do result
            console.log("erro")
        }
    }

    async changePassword(req, res){//27º mudar senha
        var token = req.body.token;// variável token recebe token do body
        var password = req.body.password;// variável password recebe password do body
        var isTokenValid = await PasswordToken.validate(token);// recebendo na variável isTokenValid o retorno da PasswordToke.validade(enviado o token do body para validação)

        if(isTokenValid.status){// se retorno.status for true
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token);//envie para User.changePassword a senha do body, isTokenValid.token.user_id se é 0 false ou 1 true, isTokenValid.token.token
            res.status(200);// resposta de status 200 >> "Ok"
            res.send("Senha alterada");// responde na tela "Senha alterada"
        }else{// se o status do retorno for false
            res.status(406);// resposta de status 406 >> Não aceitável
            res.send("Token inválido!")// responde na tela "Token inválido"
        }
    }

    async login(req, res){//29º campo de logar
        var { email, password } = req.body;// recebendo variavel {email, password} do body

        var user = await User.findByEmail(email);// filtrando user do banco de dados pelo email do body

        if(User != undefined){// se usuário for diferente de undefined, significa que usuário encontrado

            var resultado = await bcrypt.compare(password, user.password)// na variável resultado receba o resultado de true ou false, estamos comparando a senha do body com a senha do banco de dados, a comparação está no formato de bcrypt

            if(resultado){// se true

                var token = jwt.sign({email: user.email, role: user.role}, secret);
                
                res.status(200);// resposta de status 200 >> "Ok"
                res.json({token: token});// responde em Json o Token
            }else{// se false
                res.status(406);// resposta de status 406 >> "Não aceitável"
                res.send("Senha incorreta");// responde da tela "Senha incorreta"
            }
        }else{
            // caso usuário não for encontrado, faça nada
        }
    }
}

module.exports = new UserController();