# bankapp
This node.js application provides webservices for basic banking operations.
Please find below the list of API's exposed, the http method to be used and their expected params. 
The server is started on port 8080

1. /accountServices/login 
HTTP method : POST
Headers Required : Content-Type : "application/json"
JSON request Body : {username : "rahulprasad3112", password : "cooldude1988"}
Expected output : if the credentials are correct it will respond with the account information for eg:
{
    "id": "8777103e-d449-11e8-b3b0-fbfb3fcceaef",
    "fullname": "Kumar Rahul",
    "accountbalance": "9700",
    "username": "rahulprasad3112"
}
else will return 401(unathorized).

2. /accountServices/getTransactions/:accountId
HTTP method : GET, need to pass the accountId, which we got from the 1st response i.e. 
/accountServices/getTransactions/8777103e-d449-11e8-b3b0-fbfb3fcceaef
Expected output : if correct accountid is passed, it will repond with the trasactions for the passed accountid for eg:
{"accountbalance":"9700","transactions":[{"id":"5854372c-d503-11e8-81d8-632a44fe88fb","account_id":"8777103e-d449-11e8-b3b0-fbfb3fcceaef","type":"credit","amount":"500","transaction_date":"2018-10-21T07:30:12.000Z"},{"id":"85a27c02-d503-11e8-81d8-af98fd67e1d3","account_id":"8777103e-d449-11e8-b3b0-fbfb3fcceaef","type":"debit","amount":"200","transaction_date":"2018-10-20T09:30:12.000Z"},{"id":"ba5bf274-d51d-11e8-be00-eb6239f0fc6e","account_id":"8777103e-d449-11e8-b3b0-fbfb3fcceaef","type":"debit","amount":"100","transaction_date":"2018-10-21T05:10:29.212Z"}]}
else will return 400 (bad request)

3. /accountServices/getBeneficaries/:accountId
HTTP method : GET, need to pass the accountId, which we got from the 1st response i.e. 
/accountServices/getBeneficaries/8777103e-d449-11e8-b3b0-fbfb3fcceaef
Expected output :if correct accountid is passed, it will repond with the list of registered beneficiaries for the passed accountid for eg:
{"beneficaries":[{"id":"32907294-d51c-11e8-980c-6f9139f3d723","account_number":"9837498731","bank":"ICICI","ifsc_code":"ICICI00080","is_verified":true,"added_on":"2018-10-21T04:59:31.875Z","account_id":"8777103e-d449-11e8-b3b0-fbfb3fcceaef"}]}
else will return {"beneficaries":[]};

4. /accountServices/addBeneficary
HTTP method : POST
Headers Required : Content-Type : "application/json"
JSON request Body : { "account_number": "9837498731",
    "bank": "ICICI",
    "ifsc_code": "ICICI00080",
	   "account_id" : "8777103e-d449-11e8-b3b0-fbfb3fcceaef"
}
here account_id is the value which we got from the 1st response.
Expected output : It will respond with "benefeciary added successfully." , if the benefeciary correctly, it will respond with "Beneficary already added."
if the benefeciary is already added.

5. /accountServices/removeBeneficary
HTTP method : DELETE
Headers Required : Content-Type : "application/json"
JSON request Body : {
  id : "32907294-d51c-11e8-980c-6f9139f3d723"
}
here id is the benefeciary id, which needs to be deleted, we will get it from 3rd response
Expected output :will respond with 200 if the record is deleted else will return 500.

6. /accountServices/transferFunds
HTTP method : POST
Headers Required : Content-Type : "application/json"
JSON request Body : {
    account_id: "8777103e-d449-11e8-b3b0-fbfb3fcceaef",
    beneficiary_id : "32907294-d51c-11e8-980c-6f9139f3d723",
    amount: "100",
}
here account_id is the value which we got from the 1st response and  beneficiary_id is the targeted beneficary,we  get it from 3rd response.
Expected output :will respond with "fund transfer complete" if the transfer is done , else will repond with "fund transfer failed"

7. /accountServices/getFutureBalance
HTTP method : POST
Headers Required : Content-Type : "application/json"
JSON request Body : {
    account_id: "8777103e-d449-11e8-b3b0-fbfb3fcceaef",
    future_date : "2018-10-21T15:27:53.085Z"
}
Expected output : the calculated future balance for eg. {
    "accountbalance": "9700"
}

Session is not implemented in the application , it can be implemented using 'expression-session', ideally all the API's should be authenticated
post login.
