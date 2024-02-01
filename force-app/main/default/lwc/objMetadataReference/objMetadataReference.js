import { LightningElement, wire, api, track } from 'lwc';
import getAllRelatedFields from '@salesforce/apex/ObjectFetch.getAllRelatedFields';
import getAllRelatedData from '@salesforce/apex/ObjectFetch.getAllRelatedData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ObjMetadataReference extends LightningElement {
    @api objReference //getting data from the Parent
    @track fieldOptionList = [] //Storing values that fetch from wired method
    selectedFieldList = []; //for displaying column name in datatable
    listFieldName =[]; //for returning parameter as list to apex method for field Name
    relatedDataList = [] //to store the value that got from Imperative call

    @wire(getAllRelatedFields,{objName:'$objReference'})objFields({error,data}){
        if(data && data.length>0){
            let fieldList = [];
            data.forEach(field => { fieldList.push( {label:field.QualifiedApiName, value:field.QualifiedApiName} ) });
            this.fieldOptionList = fieldList;
        }
        else if(error){this.showMessage('Error',error,'Error')}
    }

    get getFields(){
        return this.fieldOptionList; //return to template dual-listbox component
    }

    //show button 
    handleShow(){
        getAllRelatedData({objName: this.objReference, fieldList: this.listFieldName}).then(result =>{
            let fetchedDataList = [];
            result.forEach(data => { fetchedDataList.push( data ) });
            this.relatedDataList = fetchedDataList;
        }).catch(error => { this.showMessage('Error',error,'Error') })

    }

    //Reset button
    handleReset(){
        this.relatedDataList = [];
    }

    //on field select in dual-list box
    onFieldSelect(evt){
        var selectedField = evt.detail.value;
        if(selectedField.length>0){
            this.selectedFieldList = selectedField;
            var fieldList = [];
            var listFieldName= [];
            this.selectedFieldList.forEach(field=> {fieldList.push({label: field, fieldName: field}); listFieldName.push(field)} )
            this.selectedFieldList = fieldList;
            this.listFieldName = listFieldName;
        }
        else{
            this.selectedFieldList = null;
        }
    }

    showMessage( t, m,type ){
        const toastEvt = new ShowToastEvent({
            title: t,
            message:m,
            variant: type
        });
        this.dispatchEvent(toastEvt);
    };
}