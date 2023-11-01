sleep 5 && mongosh "mongodb://root:595Hh95GU95aHaEnsaLS@mongodb-server:27017/" --authenticationDatabase admin
use animals
db.createUser({user: 'my-api-user', pwd: '478Hh95GU95aHaEnsaKQ', roles: [ { role: 'readWrite', db: "animals" }, ] } )
