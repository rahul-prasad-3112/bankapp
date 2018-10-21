const passwordHash = require('password-hash');
const DAL = require('./dal');
class AccountServices {
    constructor(dbConfig) {
        global.dalInstance = new DAL(dbConfig);
        console.log("AccountServices constructor ", this.dalInstance);
        console.log(this);
        //sha1$b02fd451$1$f097f2cdb45b550f502458b73a6039d5256dfeca
        console.log(passwordHash.verify("cooldude1988", passwordHash.generate("cooldude1988")));
        
    }
    accountLogin(req, res) {
        let requestBody = req.body;
        console.log(requestBody);
        let username = requestBody.username;
        let password = requestBody.password;
        console.log("req.session", req.session);
        
        let promise = global.dalInstance.read('accounts', {}, { username: username});
        promise.then((rows)=> {
            if (rows && rows[0] && passwordHash.verify(password, rows[0].password)) {
                res.send(rows[0]);
            } else {
                res.sendStatus(401);
                
            }
        }, (err)=> {
            console.log(err);
            res.sendStatus(500);
            
        }).catch((err)=> {  
            console.log(err);
            res.sendStatus(500);
            
        })
    }
    getTransactions(req, res) {
        var accountId = req.params.accountId;
        let promise = global.dalInstance.read('accounts', { "accountbalance": true }, { id: accountId });
        promise.then((rows)=> {
            var responseObj = {};
            if (rows && rows[0]) {
                responseObj.accountbalance = rows[0].accountbalance;
                let promise = global.dalInstance.read('transactions', {}, { account_id: accountId });
                promise.then((rows)=> {
                    responseObj.transactions = rows || [];
                    res.send(responseObj);
                }, (err)=> {
                    res.sendStatus(500)
                });         

            } else {
                res.sendStatus(400);
            }
             
        },(err)=> {
            console.log(err);
            res.sendStatus(500);
        }).catch((err)=>{
            console.log(err);
            res.sendStatus(500);
        })
    }
}

module.exports = AccountServices;