public class SearchBuilder {

    @AuraEnabled(cacheable=true)
    public static ObjectWrap getObjectList(){

        List<EntityDefinition> objectList = new List<EntityDefinition>();
        objectList = [SELECT Label, QualifiedApiName FROM EntityDefinition WHERE (NOT Label like '%_MISSING LABEL%') ORDER BY LABEL];
        ObjectWrap objWrap = new ObjectWrap();
        objWrap.entityDefinition = objectList;

        return objWrap;
    }

    @AuraEnabled(cacheable = true)
    public static ObjectWrap getObjectFields(String objectName){
        List<FieldDefinition> fieldList = new List<FieldDefinition>();
        String query = 'SELECT QualifiedApiName, DataType FROM FieldDefinition WHERE EntityDefinition.QualifiedApiName =:objectName';
        ObjectWrap objWrap = new ObjectWrap();
        fieldList = Database.query(query);
        objWrap.fieldDefinition = fieldList;

        return objWrap;
    }

    @AuraEnabled
    public static ObjectWrap getRecords(String dataFields, String dataObject, String filterFields){

        List<SObject> recordList = new List<SObject>();
        String query = 'SELECT '+dataFields+' FROM '+dataObject+' WHERE '+filterFields;
        recordList = Database.query(query);
        ObjectWrap objWrap = new ObjectWrap();
        objWrap.recordList = recordList;
        return objWrap;
        
    }

    @AuraEnabled(cacheable = true)
    public static ObjectWrap getFieldValue(String dataField, String dataObject){
        List<String> getValues = new List<String>();
    
        Schema.SObjectType objectType = Schema.getGlobalDescribe().get(dataObject);
        if (objectType != null) {
            Schema.DescribeFieldResult fieldDescribe = objectType.getDescribe().fields.getMap().get(dataField).getDescribe();
            
            if (fieldDescribe.isAccessible()) {
                List<Schema.PicklistEntry> pickVals = fieldDescribe.getPicklistValues();
                for (Schema.PicklistEntry pv : pickVals) {
                    getValues.add(pv.getValue());
                }
            }
        }

        ObjectWrap objWrap = new ObjectWrap();
        objWrap.getDefauktValues = getValues;
        return objWrap;

    }


    public class ObjectWrap{
        @AuraEnabled 
        public List<EntityDefinition> entityDefinition{get;set;}

        @AuraEnabled 
        public List<FieldDefinition> fieldDefinition{get;set;}

        @AuraEnabled 
        public List<SObject> recordList{get;set;}

        @AuraEnabled 
        public List<String> getDefauktValues{get;set;}
    }
}