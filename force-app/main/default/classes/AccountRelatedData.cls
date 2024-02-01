public class AccountRelatedData {
    @AuraEnabled
    public static List<SObject> getAllContacts(ID accID){
        try {
            List<SObject> objList = new List<SObject>();
            objList = [SELECT Name,Email, LeadSource FROM Contact WHERE AccountId=:accID];
            if(objList.size()>0){
                return objList;
            }
            else{
                return null;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<SObject> getAllOpportunity(ID accID){
        try {
            List<SObject> objList = new List<SObject>();
            objList = [SELECT Name,StageName,Type FROM Opportunity WHERE AccountId=:accID];
            if(objList.size()>0){
                return objList;
            }
            else{
                return null;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}