import { LightningElement, wire, track } from 'lwc';
import getAllObjects from '@salesforce/apex/ObjectFetch.getAllObjects';

export default class ObjReference extends LightningElement {
    @track objOptionsList = []; //store the value that are coming from wired method
    objValue; //for passing the value to child

    @wire(getAllObjects) getListObjects({data, error}){
        if(data && data.length>0){
            let objList = [];
            data.forEach(object => { objList.push( {label:object.Label, value:object.QualifiedApiName} ) });
            this.objOptionsList = objList;
        }
        else if(error){this.showMessage('Error',error,'Error')}
    }

    get objOptions(){
        return this.objOptionsList; //return the value to template(combobox)
    }

    // On Object select from combobox
    onObjSelect(event){
        var selectedOption = event.detail.value;
        if(!this.objMetadata && selectedOption!=''){ this.objValue = selectedOption; }
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