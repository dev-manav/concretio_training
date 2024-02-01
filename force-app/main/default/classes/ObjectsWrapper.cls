public class ObjectsWrapper {

    @AuraEnabled(cacheable=true)
    public static List<ObjectWrap> methodName(){
        List<SObject> objList = new List<SObject>();
        List<ObjectWrap> objWrapList = new List<ObjectWrap>();
        objList = [SELECT Label, QualifiedApiName FROM EntityDefinition WHERE (NOT Label like '%_MISSING LABEL%') ORDER BY Label];
        if(objList.size()>0){
            for(SObject obj: objList){
                objWrapList.add(new ObjectWrap(obj));
            }
            return objWrapList;
        }
        else{
            return null;
        }
    }

    public class ObjectWrap{
        
        @AuraEnabled public EntityDefinition entityRecord{get;set;}

        public ObjectWrap(EntityDefinition entityRecord){
            this.entityRecord = entityRecord;
        }
    }
}