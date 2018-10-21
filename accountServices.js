const passwordHash = require('password-hash');
const DAL = require('./dal');
const jsv = require('json-validator');
const beneficarySchema = {
    account_number: { required: true},
    bank: { required: true },
    account_id: { required: true},
    ifsc_code: { required: true }
}
const transferBodySchema = {
    account_id: { required: true },
    beneficiary_id : { required: true },
    amount: { required: true },
}
const futureBalSchema = {
    account_id: { required: true },
    future_date: { required: true }
}
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
                delete rows[0].password;
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
    addBeneficary(req, res) {
        console.log("addBeneficary request recieved >>>");
        
        var requestBody = req.body;
        jsv.validate(requestBody, beneficarySchema, function (err, messages) {
            if (err) {
                res.sendStatus(500);
            } else {
                console.log('messages', messages);
                
                if (Object.keys(messages).length > 0) {
                    res.sendStatus(400);
                } else {
                    requestBody.is_verified = true;
                    requestBody.added_on = new Date().toISOString();
                    console.log("goin to call create");
                    
                    global.dalInstance.create("beneficiaries", requestBody).then((createdRecord)=>{
                        if (createdRecord) {
                            res.send("benefeciary added successfully.");
                        } else {
                            res.send("Beneficary already added.");
                        }
                        
                    },(err)=>{
                        console.log(err);
                        res.sendStatus(500);
                    }).catch((err)=>{
                        console.log(err);
                        res.sendStatus(500);
                    })
                }
            }
        });

    }
    removeBeneficary(req, res) {
        let requestBody = req.body;
        let promise = global.dalInstance.remove('beneficiaries', { id: requestBody.id });
        promise.then((rows) => {
            if (rows) {
                res.sendStatus(200);
            } else {
                res.sendStatus(500)
            }
            
        }, (err) => {
            console.err(err);
            res.sendStatus(500)
        });

    }
    transferFunds(req, res) {
        let requestBody = req.body;
        jsv.validate(requestBody, transferBodySchema, function (err, messages) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                if (Object.keys(messages).length > 0) {
                    res.sendStatus(400);
                } else {
                    let accountId = requestBody.account_id;
                    let promise = global.dalInstance.read('accounts', { "accountbalance": true }, { id: accountId });
                    promise.then((rows)=> {
                        if (rows && rows[0]) {
                            let accountBalance = rows[0].accountbalance;
                            let promise = global.dalInstance.read('beneficiaries', { "id": true }, { id: requestBody.beneficiary_id });
                            promise.then((rows) => {
                                if (rows && rows[0]) {
                                    accountBalance = parseInt(accountBalance) - parseInt(requestBody.amount);
                                    let promise = global.dalInstance.update('accounts', { id: accountId }, { "accountbalance": accountBalance });
                                    promise.then((rows)=> {
                                        if (rows) {
                                            res.send("fund transfer complete");
                                            let transaction = {
                                                account_id: accountId,
                                                type: "debit",
                                                amount: requestBody.amount,
                                                transaction_date : new Date().toISOString()
                                            }
                                            global.dalInstance.create('transactions', transaction);
                                        } else {
                                            res.send("fund transfer failed");
                                        }
                                        
                                    }, (err)=>{
                                        console.log(err);
                                        res.sendStatus(500);
                                    })
                                } else {
                                    res.send("no record found");
                                }
                            },(err)=> {
                                console.log(err);
                                res.sendStatus(500);
                            });
                        } else {
                            res.send("no record found");
                        }
                    }, (err)=> {
                        console.log(err);
                        res.sendStatus(500);
                    })
                }
            }
        });

    }
    getBeneficaries(req, res) {
        let accountId = req.params.accountId;
        let promise = global.dalInstance.read('beneficiaries', { }, { account_id : accountId });
        promise.then((rows) => {
            let responseObj = {};
            responseObj.beneficaries = rows || [];
            res.send(responseObj);
        }, (err) => {
            console.err(err);
            res.sendStatus(500)
        });         

    }
    getFutureBalance(req, res) {
        let requestBody = req.body;
        jsv.validate(requestBody, futureBalSchema, function (err, messages) {
            if (err) {
                console.err(err);
                res.sendStatus(500)
            } else {
                if (Object.keys(messages).length > 0) {
                    res.sendStatus(400);
                } else {
                    let promise = global.dalInstance.read('accounts', { "accountbalance": true }, { id: requestBody.account_id });
                    promise.then((rows)=>{
                        if (rows && rows[0]) {
                            let accountbalance = rows[0].accountbalance;
                            let timePeriodForIntrest = new Date(requestBody.future_date).getTime() - Date.now();
                            if (timePeriodForIntrest < 0) {
                                res.send({ accountbalance: accountbalance});
                            } else {
                                timePeriodForIntrest = timePeriodForIntrest/(1000 * 60 * 60 * 24 * 365);
                                console.log('timePeriodForIntrest', timePeriodForIntrest);
                                
                                accountbalance = parseInt(accountbalance) + (accountbalance * .04 * timePeriodForIntrest);
                                res.send({ accountbalance: accountbalance });
                            }
                        } else {
                            res.send("no record found")
                        }
                    },(err)=>{
                        console.err(err);
                        res.sendStatus(500)
                    })
                }
            }
        });
    }
}

module.exports = AccountServices;