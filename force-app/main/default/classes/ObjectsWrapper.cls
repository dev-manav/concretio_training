public class ObjectsWrapper {

    @AuraEnabled(cacheable=true)
    public static List<ObjectWrap> getObjectList(){
        List<EntityDefinition> entityList = new List<EntityDefinition>();
        List<EntityWrap> entityWrapList = new List<EntityWrap>();
        entityList = [SELECT Label, QualifiedApiName FROM EntityDefinition WHERE (NOT Label like '%_MISSING LABEL%') ORDER BY Label];
        for(EntityDefinition entity: entityList){
            entityWrapList.add(new EntityWrap(entity));
        }
        return objWentityWrapListrapList;
    }

    public class EntityWrap{
        
        @AuraEnabled public EntityDefinition entityRecord{get;set;}

        public EntityWrap(EntityDefinition entityRecord){
            this.entityRecord = entityRecord;
        }
    }
}