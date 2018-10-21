
module.exports = function (appInstance, accountServicesInstance) {
    appInstance.post('/accountServices/login', accountServicesInstance.accountLogin);
    appInstance.get('/accountServices/getTransactions/:accountId', accountServicesInstance.getTransactions);
}