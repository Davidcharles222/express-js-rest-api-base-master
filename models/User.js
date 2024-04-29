var knex = require("../database/connection");// importando nossa conexão com banco
var bcrypt = require("bcrypt");// importando biblioteca para criptografar as senhas
const PasswordToken = require("./PasswordToken");// importando minha pasta onde está o token

class User{// Lembrar de exportar class User lá no final

    async findAll(){//6º promise criada para encontrar totos usuários
        try{//para verdadeiro
            var result = await knex.select(["id","email","role","name"]).table("users");//no banco de dados "knex" selecione os campos [id, email, role, name] da tabela criada "users" e adicione as informações em result
            return result// retorne essas informações para quem for utilizar do findAll()
        }catch(err){//para falso
            console.log(err);
            return [];// se der erro retorne array vazia
        }
    }
    
    async findById(id){/*9º promise criada para encontrar somente id específico */
        try{// para verdadeiro
            var result = await knex.select(["id","email","role","name"]).where({id: id}).table("users");//no banco de dados "knex" selecione os campos [id, email, role, name] onde o "id" da tablea seja igual o "id" recebido como parametros, se encontrado retorne o usuário para result
            
            if(result.length > 0){// se o comprimento do resultado for maior que 0 significa que foi encontrado
                return result[0]//retorne primeiro usuário encontrado
            }else{// caso náo tiver encontrado nenhum id
                return undefined// retorne undefinid
            } 

        }catch(err){// para falso
            console.log(err);
            return undefined;// retorne undefinid
        }
        // Obs. essas informações estão sendo enviadas especificamente para o UserController
    }

    async findByEmail(email){//24º promise criada para encontrar usuário pelo email
        try{// para verdadeiro
            var result = await knex.select(["id","email","password","role","name"]).where({email: email}).table("users");//no banco de dados "knex" selecione os campos [id, email, password, role, name] onde email do body é igual do email do banco
            
            if(result.length > 0){// se comprimento de result for maior que 0, significa que usuário encontrado
                return result[0]// retornando primeiro usuário
            }else{// se comprimento for igual a 0, significa que usuário não encontrado
                return undefined// retornando undefined
            }

        }catch(err){// para falso
            console.log(err);
            return undefined;// retorne undefined
        }
    }

    async new(email, password, name){//16º recebendo na promise new as respostas de email, password, name
        try{// para verdadeiro
            var hash = await bcrypt.hash ( password,10)// para (password) em 10 caracteres, criptografa a senha e retorne valor criptografado em hash
            await knex.insert({email, password: hash, name, role: 0}).table("users");// insere no banco "knex", o {email, passworde onde recebe o hash criptografado, name , role recebendo 0}
        }catch(err){// para falso
            console.log(err);// console.log no erro
        }
    }

    async findEmail(email){//12º promise criada para verificar e email já possui cadastro, nesse campo estarei filtrando
        try{// para verdadeiro
            var result = await knex.select("*").from("users").where({email: email});// no banco de dados "knex" selecione tudo de onde o email da tabela seja igual a do body recebida, se encontrado retorne o resultado para result

            if(result.length > 0){// se o comprimento do resultado for maior que 0 significa que email encontrado
                return true; // retorne true
            }else{// caso contrário 
                return false; // retorne false
            }

        }catch(err){// para falso
            console.log(err);
            return false; // retorne false
        }
    }

    async update(id, email, name, role){//17º promise criada para editar o usuario, recebomos do body o (id, email, name, role) atualizados

        var user = await this.findById(id);// na variável user recebo meu usuário encontrado pelo id recebido no parâmetro, obs. já definido lá em cima, apenas reutilizando a promise findById()

        if(user != undefined){// se user for diferente de undefined, significa que o usuário existe

            var editUser = {};// variável editUser recebe objeto vazio

            if(email != undefined){// se email for diferente de undefined, significa que existe email no body
                if(email != user.email){// se email do body for diferente do email do user encontrado significa que é outro usuário
                    var result = await this.findEmail(email);// verificando se email do body existe no banco de dados e retorne para result
                    if(result == false){// se resultado for falso
                        editUser.email = email//variável editUser.email recebe email
                    }else{// caso contrário
                        return {status: false, err: "O e-mail já está cadastrado"}// retorne {status: false, err: O e-mail já está cadastrado}
                    }
                }
            }

            if(name != undefined){// se name do body for undefined
                editUser.name = name;// variável editUser.name recebe name editado
            }

            if(role != undefined){// se role do body for undefined
                editUser.role = role;// variável editUser.role recebe role editado
            }

            try{// para verdadeiro
                await knex.update(editUser).where({id: id}).table("users");// no banco de dados "knex" atualize com parametro (usuário editado) onde o id do body seja igual do banco de dados da tablea "users"
                return {status: true}// retorne status true 
            }catch(err){// para falso
                return {status: false, err: err}// retorne status false
            }

        }else{// caso usuário for undefined
            return {status: false, err: "O usuário não existe!"}// retorne status false, err: "O usuário não existe!"
        }
    }

    async delete(id){// 20º primise criada para deletar o usuário, id recebido pelo parâmetro
        var user = await this.findById(id);// verificando se temos o id no banco de dados, e se encontrado retorne o usuário
        if(user != undefined){// se usuer for diferente de undefined, significa que usuário foi encontrado

            try{// para verdadeiro
                await knex.delete().where({id: id}).table("users");// no banco de dados "knex" delete o usuário onde o id do parâmetro seja igual do banco de dados da tabela "users"
                return {status: true}// retorne o status true
            }catch(err){// para falso
                return {status: false, err: err}// retorne status false, err: err
            }
        }else{// se user for undefined, significa que usuário não existe no banco
            return {status: false, err: "O usuário não existe, portanto não pode ser deletado."}// retorne false, erro: "O usuário não exite"
        }
    }

    async changePassword(newPassword, id, token){//28º mudar senha, recebendo valores do body no parametro
        var hash = await bcrypt.hash(newPassword, 10)// variável hash recebendo nova senha já criptografando
        await knex.update({password: hash}).where({id: id}).table('users')// atualizando no banco (password: hash) onde o id do banco é igual ao id do body, da tabela 'users'
        await PasswordToken.setUsed(token);//enviando token para pagina PasswordToken.setUsed
    }
}

module.exports = new User();