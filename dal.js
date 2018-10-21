const pg = require('pg');
class DAL {
    constructor(dbConfig) {
        console.log("constructor of DAL called >>>");
        let Pool = pg.Pool;
        this.client = new Pool({
            host: 'localhost',
            user: 'postgres',
            password : '',
            database : 'postgres',
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000});
    }
    read(tableName, projection ,contraints) {
        console.log("in read request >>>");
        console.log(tableName, projection, contraints)
        return new Promise((resolve, reject )=> {
            let colomnNames = "", whereClouse = "";
            projection && Object.keys(projection).forEach((columnName)=>{
                colomnNames = colomnNames + columnName  +',';
            });
            colomnNames = colomnNames.substring(0, colomnNames.lastIndexOf(','))
            console.log('colomnNames', colomnNames);
            
            if (colomnNames === "") {
                colomnNames = "*";
            }    
            contraints && Object.keys(contraints).forEach((constraint)=> {
                whereClouse = whereClouse + constraint + "=" + "'" + contraints[constraint] + "'";
            })
            console.log('whereClouse', whereClouse);
            
            let sql = 'SELECT ' + colomnNames + ' from ' + tableName + ' where ' + whereClouse + ';'
            console.log(sql);
            
            this.client.connect(function (err, client, done) {
                if (!err) {
                    client.query(sql, function (err, data) {
                        done();
                        console.log('data >>>', data)
                        resolve(data ? data.rows : null);
                    })
                } else {
                    console.log("in query error >>>>")
                    reject(err);
                    console.error(err);
                }

            });
        })
        

    }
    update(tableName, constraint, update) {

    }
    delete(tableName, contraint) {

    }
}
module.exports = DAL;