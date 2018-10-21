
module.exports = function (appInstance, accountServicesInstance) {
    appInstance.post('/accountServices/login', accountServicesInstance.accountLogin);
    appInstance.get('/accountServices/getTransactions/:accountId', accountServicesInstance.getTransactions);
    appInstance.post('/accountServices/addBeneficary', accountServicesInstance.addBeneficary);
    appInstance.post('/accountServices/transferFunds', accountServicesInstance.transferFunds);
    appInstance.get('/accountServices/getBeneficaries/:accountId', accountServicesInstance.getBeneficaries);
    appInstance.delete('/accountServices/removeBeneficary', accountServicesInstance.removeBeneficary);
    appInstance.post('/accountServices/getFutureBalance', accountServicesInstance.getFutureBalance);

}