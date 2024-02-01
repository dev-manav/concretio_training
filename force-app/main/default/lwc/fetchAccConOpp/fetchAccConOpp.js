import { LightningElement } from 'lwc';
import getAllContacts from '@salesforce/apex/AccountRelatedData.getAllContacts';
import getAllOpportunity from '@salesforce/apex/AccountRelatedData.getAllOpportunity';

const conCol = [{label: 'Name', fieldName: 'Name'},
{label: 'Email', fieldName: 'Email'},
{label: 'Type', fieldName: 'Type'}
];
const oppCol = [{label: 'Name', fieldName: 'Name'},
{label: 'StageName', fieldName: 'StageName'},
{label: 'Type', fieldName: 'Type'}
];
export default class FetchAccConOpp extends LightningElement {
    getConData =[];
    getOpportunityDetails = [];
    getConColumns = conCol;
    getOppColumns = oppCol;
    searchVal

    onChangeInput(evt){
        this.searchVal = evt.detail.value;
    }

    async handleSearch(){
       console.log('Inside async handler');
       await this.getContact()
       console.log('getting Contact'+this.getConData);
       await this.getOpportunity();
       console.log('getting Opportunity'+this.getOpportunityDetails);

    }

    getContact(){
        return  getAllContacts({accID:this.searchVal}).then(result => { this.getConData = result}).catch(err => {return err})
    }
    
    getOpportunity(){
        getAllOpportunity({accID:this.searchVal}).then(result =>{
            if(JSON.stringify(result)){return}
            else{this.getOpportunityDetails =result}}).catch(err => {console.log('rrrr') 
        return err})
    }
}