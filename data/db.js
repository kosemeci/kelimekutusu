const mysql=require("mysql2");
const config = require("../config");


let connection = mysql.createConnection(config.db);

connection.connect(function(err){
    if(err){
        console.log("Bağlantı da sorun var "+err);
    }
    else {
        console.log("Sql bağlantısı başarılı");
    }
    // const query = "INSERT INTO categories(category,english,turkish) value ('place',?,?)";
    // words.forEach((word)=>{
    //     connection.query(query,[word.english,word.turkish],(err,res)=>{
    //         if (err) {
    //             return console.error('Veri ekleme hatası: ' + err.message);
    //           }
    //           console.log(word.english);
    //     });
    // });
    
})

module.exports = connection.promise();