import { LightningElement, wire, track } from 'lwc';
import getAllObjects from '@salesforce/apex/ObjectFetch.getAllObjects';

export default class ObjReference extends LightningElement {
    @track objOptionsList = [];
    objValue;

    @wire(getAllObjects) getListObjects({data, error}){
        if(data && data.length>0){
            let objList = [];
            data.forEach(object => { objList.push( {label:object.Label, value:object.QualifiedApiName} ) });
            this.objOptionsList = objList;
        }
        else if(error){this.showMessage('Error',error,'Error')}
    }

    get objOptions(){
        return this.objOptionsList;
    }

    onObjSelect(event){
        var selectedOption = event.detail.value;
        if(!this.objMetadata && selectedOption!=''){ this.objValue = selectedOption; }
    }
}