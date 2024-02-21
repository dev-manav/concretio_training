public class userData {

    @AuraEnabled(cacheable = true)
    public static List<User> getUsers(){

        List<User> userList = new List<User>();
        userList = [SELECT Id,Name FROM USER LIMIT 5];

        return userList;
    }

    @AuraEnabled()
    public static List<User> getUsersbyName(String name){

        List<User> userList = new List<User>();
        String query = 'SELECT Id,Name FROM USER WHERE Name LIKE \'%'+name+'%\' LIMIT 5';
        userList = Database.query(query);
        return userList;
    }

    @AuraEnabled
    public static Map<Integer, String> passwordChange(String userId, String newPassword){
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('callout:SalesforceAuth/services/data/v60.0/sobjects/User/'+userId+'/password');
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/json;charset=UTF-8');
        request.setBody('{"NewPassword" : "'+newPassword+'"}');

        HttpResponse response = http.send(request);

        Map<Integer, String> resString = new Map<Integer,String>();
        if((response.getStatusCode()!=null || response.getStatusCode()!=-1) && !String.isBlank(response.getBody())){
            System.debug(response.getBody());
            resString.put(response.getStatusCode(), response.getBody());
        }
        else{
            resString.put(response.getStatusCode(), 'Bad Request');
        }

        return resString;
    }
}

// userData.passwordChange('ABC','ABC');