/* 1º
Aqui realizamos a conexão com nossa base de dados
Obs. no knex precimos criar a tabela manual com depois
preecher abaixo com as informações necessária da tabela.
*/
var knex = require('knex')({//importando knex
    client: 'mysql2',//qual banco de dados estamos utilizando
    connection: {
      host : '127.0.0.1',//este cod quer dizer que o local é o nosso pc
      user : 'root',// padrão
      password : '123456',// senha do meu banco
      database : 'apiusers'// nome da tabela onde iremos conectar
    }
  });

module.exports = knex// exportando minha conexão 