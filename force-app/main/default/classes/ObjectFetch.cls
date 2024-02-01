public class ObjectFetch {

    //getting All Object and returning it
    @AuraEnabled(cacheable = true)
    public static List<SObject> getAllObjects(){
        List<SObject> objectList = new List<SObject>();
        objectList = [SELECT Label, QualifiedApiName FROM EntityDefinition WHERE (NOT Label like '%_MISSING LABEL%') ORDER BY LABEL];
        return objectList;
    }

    //getting All the related fields for selective object
    @AuraEnabled(cacheable = true)
    public static List<SObject> getAllRelatedFields(String objName){
        List<SObject> fieldList = new List<SObject>();
        String query = 'SELECT QualifiedApiName FROM FieldDefinition WHERE EntityDefinition.QualifiedApiName =:objName';
        fieldList = Database.query(query);
        return fieldList;
    }

    //getting all the related data for particular objects and it's field
    @AuraEnabled(cacheable = true)
    public static List<SObject> getAllRelatedData(String objName, List<String> fieldList){
        List<SObject> dataList = new List<SObject>();
        String fieldNames='';
        if(fieldList.size()>0){
            for(String fldName:fieldList){
                fieldNames = String.isEmpty(fieldNames) ? fldName : fieldNames+','+fldName; //Assigning values for the fields to query 
                }
            }
        String query = 'SELECT '+fieldNames+' FROM '+objName;
        dataList = Database.query(query);
        return dataList;
    }
}