import { LightningElement , wire, track } from 'lwc';
import getObjectList from '@salesforce/apex/SearchBuilder.getObjectList';
import getObjectFields from '@salesforce/apex/SearchBuilder.getObjectFields';
import getRecords from '@salesforce/apex/SearchBuilder.getRecords';
import getFieldValue from '@salesforce/apex/SearchBuilder.getFieldValue';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

const operators = new Map([
    ['Equals', '='],
    ['Not Equals', '!='],
    ['Start With', 'Like %'],
    ['Less Than', '<'],
    ['Greater Than', '>' ],
    ['Less Than or Equal', '<='],
    ['Greater Than or Equal', '>=' ],
    ['LIKE', 'LIKE'],
    ['NOT LIKE', '!='],
    ['IN', 'IN'],
    ['NOT IN', 'NOT IN'],
    ['INCLUDES', 'INCLUDES'],
    ['EXCLUDES', 'EXCLUDES' ]
]);

export default class SearchBuilder extends LightningElement {

    objectList;
    @track fieldList;
    @track operators;
    @track fieldIncrement = 0;
    @track comboboxFieldList = [];
    @track columns = [];
    @track objectData;
    @track showAdvanceSearch;
    @track inputContainsBooleanOrPickList = false;
    @track inputOptions = [];

    @wire(getObjectList)getObject({data, error}){
        if(data){
            let objList = [];
            for(let key in data.entityDefinition){
                objList.push( {label:data.entityDefinition[key].Label, value:data.entityDefinition[key].QualifiedApiName} );
            }
            this.objectList = objList;
        }
        else if(error){
            this.showMessage('Error',error, 'Error');
        }
    }

    get objectOption(){
        return this.objectList;
    }

    handleObject(event){
        let objectName = event.target.value;
        this.columns = null;
        this.objectData = null;
        this.fieldList = null;
        this.operators = null;
        this.inputOptions = null;
        this.comboboxFieldList= [];
        this.fieldIncrement = 0;
        getObjectFields({objectName:objectName})
        .then(result => {
            let fieldList = [];
            for(let key in result.fieldDefinition){
                fieldList.push( {label:result.fieldDefinition[key].QualifiedApiName, value:result.fieldDefinition[key].QualifiedApiName, dataType:result.fieldDefinition[key].DataType} )
            }
            this.fieldList = fieldList;
        })
        .catch(error =>{
            this.showMessage('Error in Fecthing Objects', error, 'Error');
        })

    }

    get fieldOption(){
        return this.fieldList;
    }

    getOperator(dataType){
        var operatorArray = [];
        if( dataType.includes('Currency') || dataType.includes('Date') || dataType.includes('Number')){
            operatorArray.push({label:'Equals', value:operators.get('Equals')},
            {label:'Not Equals', value:operators.get('Not Equals')},
            {label:'Less Than', value:operators.get('Less Than')}, 
            {label:'Greater Than', value:operators.get('Greater Than')}, 
            {label:'Less Than or Equal', value:operators.get('Less Than or Equal')}, 
            {label:'Greater Than or Equal', value:operators.get('Less Than or Equal')});
            return operatorArray;
        }
        else{
            operatorArray.push({label:'Equals', value:operators.get('Equals')},
            {label:'Not Equals', value:operators.get('Not Equals')},
            {label:'Start With', value:operators.get('Start With')}
            );
            return operatorArray;
        }
    }

    handlefield(event){
        
        let key = this.comboboxFieldList.find(option => option.fieldValue === event.target.dataset.id);
        this.template.querySelector('[data-id="'+key.operatorValue+'"]').value = '';
        this.template.querySelector('[data-id="'+key.inputText+'"]').value = '';

        let dType = this.fieldList.find(option => option.value === event.target.value);
        let objType = this.template.querySelector('[data-id="object"]').value;
        if(dType.dataType.includes('Boolean') || dType.dataType.includes('Picklist')){
            key.haveInput = true;
            let getOperators = this.getOperator(dType.dataType);
            key.operatorOption = getOperators;
            getFieldValue({dataField:dType.value, dataObject:objType})
            .then(result =>{
                let inputList = [];
                for(let key in result.getDefauktValues){
                    inputList.push({label: result.getDefauktValues[key], value: result.getDefauktValues[key]});
                }
                key.haveInputOption = inputList;
            })
            .catch(error => {
                this.showMessage('Error',error.body.message,'Error');
            })
        }
        else{
            key.haveInput = false;
            let getOperators = this.getOperator(dType.dataType);
            key.operatorOption = getOperators;
        }
        
    }

    get inputOptions(){
        return this.inputOptions;
    }

    get operatorOption(){
        return this.operators;
    }

    handleAddFilter(){
        this.fieldIncrement = this.fieldIncrement+1;
        let fieldList = [{fieldValue:'field'+this.fieldIncrement.toString(), operatorValue:'operator'+this.fieldIncrement.toString(), inputText:'inputVal'+this.fieldIncrement.toString(), sNo:this.fieldIncrement}];
        console.log(this.comboboxFieldList + ' '+ fieldList);
        this.comboboxFieldList = [...this.comboboxFieldList, ...fieldList];
        console.log(this.comboboxFieldList);
    }

    handleAdvanceFilter(){
        this.fieldIncrement>1 ? this.showAdvanceSearch=true : this.showAdvanceSearch=false;
    }

    handleRemoveFilter(event){
        let key = this.comboboxFieldList.find(option => option.sNo === event.target.value);
        if(key.sNo<=1)
        {
            return true;
        }
        else{
            let removeElement = this.comboboxFieldList.filter(option => option.sNo !== event.target.value);
            this.comboboxFieldList = removeElement;
            this.fieldIncrement = this.fieldIncrement-1;
        }
    }

    handleSearch(){
        let filterString = "";
        let queryFields = "";
        let columns = [];
        let objectName = this.template.querySelector('[data-id="object"]').value;
        if(this.showAdvanceSearch)
        {
            let advanceCriteria = this.template.querySelector('[data-id="advanceSearch"]').value;

            if(advanceCriteria !== undefined && advanceCriteria.trim() !== ''){

                const pattern = /(\d+)|(AND)|(OR)|[\(\)]/g;
                const matches = advanceCriteria.trim().match(pattern);
                for (let match of matches){
                    console.log('Paterr '+match);
                    if(/^\d+$/.test(match)){
                        let key = this.comboboxFieldList.find(option => option.sNo === parseInt(match));
                        let fieldValue = this.fieldList.find(option => option.value === this.template.querySelector('[data-id="'+key.fieldValue+'"]').value);
                        let operatorValue = this.template.querySelector('[data-id="'+key.operatorValue+'"]').value;
                        let textValue = this.template.querySelector('[data-id="'+key.inputText+'"]').value;
                        if(operatorValue ===undefined || operatorValue ==='')
                        {
                            this.showMessage('Invalid Value','Please Select Operator Value','error');
                            return true;
                        }
                        textValue ===undefined? "'"+textValue+"'":textValue; 
                        textValue = fieldValue.value.includes('Number','Checkbox')?textValue:"'"+textValue+"'";
                        filterString += filterString === "" ? fieldValue.label+" "+operatorValue+textValue +" ": " "+fieldValue.label+" "+operatorValue+textValue;
                        queryFields += queryFields ==="" ? fieldValue.label: ', '+fieldValue.label;
                        columns.push({label:fieldValue.label, fieldName:fieldValue.label, type:fieldValue.value});
                    }
                    else{
                        filterString += match;
                    }
                }
            }
        }
        

        else{
            for(let key of this.comboboxFieldList){

                let fieldValue = this.fieldList.find(option => option.value === this.template.querySelector('[data-id="'+key.fieldValue+'"]').value);
                let operatorValue = this.template.querySelector('[data-id="'+key.operatorValue+'"]').value;
                let textValue = this.template.querySelector('[data-id="'+key.inputText+'"]').value;
                if(operatorValue ===undefined || operatorValue ==='')
                    {
                        this.showMessage('Invalid Value','Please Select Operator Value','error');
                        return true;
                    }
                textValue ===undefined? "'"+textValue+"'":textValue;    
                textValue = fieldValue.value.includes('Number','Checkbox')|| operatorValue == 'Like %'?textValue.replace("'",''):"'"+textValue+"'";
                filterString += filterString === "" ? fieldValue.label+' '+operatorValue+textValue: 'AND '+fieldValue.label+operatorValue+textValue;
    
                queryFields += queryFields ==="" ? fieldValue.label: ', '+fieldValue.label;
    
                columns.push({label:fieldValue.label, fieldName:fieldValue.label, type:fieldValue.value});  
            }
        }
        this.columns = columns;

        console.log('SELECT '+queryFields+' FROM '+objectName+' WHERE '+filterString);
        
        getRecords({dataFields: queryFields ,dataObject: objectName ,filterFields: filterString})
        .then(result =>{
            this.objectData = result.recordList;
        })
        .catch(error => {
            this.showMessage('Apex Error', error.body.message, 'Error');
        })
    }

    showMessage(title, message, type) {
        const toastEvt = new ShowToastEvent({
            title: title,
            message: message,
            variant: type
        });
        this.dispatchEvent(toastEvt);
    };

}