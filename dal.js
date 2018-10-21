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
            colomnNames = colomnNames.substring(0, colomnNames.lastIndexOf(','));
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
            this.query(sql, 'read', resolve, reject);
        })
        

    }
    create(tableName, createBody) {
        return new Promise((resolve, reject)=>{
            console.log("in create request >>>");
            console.log(tableName, createBody);
            let colomnNames = '(';
            let values = '('
            createBody && Object.keys(createBody).forEach((key) => {
                colomnNames = colomnNames + '"' + key + '"' + ',';
                values = values + "'" + createBody[key] + "'" + ',';
            });
            colomnNames = colomnNames.substring(0, colomnNames.lastIndexOf(',')) + ')';
            values = values.substring(0, values.lastIndexOf(',')) + ')';
            console.log('colomnNames', colomnNames);
            console.log('values', values);

            let sql = 'INSERT INTO ' + tableName + colomnNames + ' VALUES ' + values + ';';
            console.log('sql', sql);
            this.query(sql,'create', resolve, reject)
        });
        
        
    }
    update(tableName, contraints, updates) {
        return new Promise((resolve, reject) => {
            let whereClouse = "";
            let setClouse = "";
            contraints && Object.keys(contraints).forEach((constraint) => {
                whereClouse = whereClouse + constraint + "=" + "'" + contraints[constraint] + "'";
            });
            updates && Object.keys(updates).forEach((update) => {
                setClouse = setClouse + update + "=" + "'" + updates[update] + "'";
            });
            let sql = 'UPDATE ' + tableName + ' SET ' + setClouse + ' WHERE ' + whereClouse + ';';
            console.log('sql', sql);
            this.query(sql, 'update', resolve, reject)
        });
    }
    remove(tableName, contraints) {
        return new Promise((resolve, reject) => {
            let whereClouse = "";
            contraints && Object.keys(contraints).forEach((constraint) => {
                whereClouse = whereClouse + constraint + "=" + "'" + contraints[constraint] + "'";
            });
            let sql = 'DELETE FROM ' + tableName + ' where ' + whereClouse + ';';
            this.query(sql, 'delete', resolve, reject);
        });
        
    }
    query(sql, operation ,resolve, reject) {
        
        this.client.connect(function (err, client, done) {
            if (!err) {
                client.query(sql, function (err, data) {
                    done();
                    var returnObj;
                    console.log(data);
                    
                    if (operation === 'read') {
                        returnObj = data ? data.rows : null;
                    } else  {
                        returnObj = data ? data.rowCount : null;
                    }
                    resolve(returnObj);
                })
            } else {
                console.log("in query error >>>>")
                reject(err);
                console.error(err);
            }

        });
        

    }
    releasePool() {
        this.client.end()
    }
}
module.exports = DAL;