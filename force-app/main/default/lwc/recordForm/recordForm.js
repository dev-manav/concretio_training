import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ACC_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import REVENUE_FIELD from '@salesforce/schema/Account.AnnualRevenue';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';

export default class RecordForm extends LightningElement {
    objName = ACC_OBJECT;
    objFields = [NAME_FIELD, REVENUE_FIELD, INDUSTRY_FIELD];
    handleSuccess(event){
        const toastEvent = new ShowToastEvent({
            title : "Account created",
            message : "Record Id" + event.detail.id,
            variant : "Success"
        })

        this.dispatchEvent(event);
    }
}