import { LightningElement, wire, track } from 'lwc';
import getUsers from '@salesforce/apex/userData.getUsers';
import getUsersbyName from '@salesforce/apex/userData.getUsersbyName';
import passwordChange from '@salesforce/apex/userData.passwordChange';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ChangeUserPassword extends LightningElement {
    @track records;
    @track searchName = '';
    @track selectedName;
    @track iconVisible = true;
    @track recordVisible = false;
    @track isValueSelected = false;
    @track userId;
    @track password;

    @wire(getUsers) userData({ data, error }) {
        if (data) {
            this.records = data;
        } else if (error) {
            this.showMessage('Error', 'Error in fetching users', 'error');
        }
    }

    searchUser(event) {
        this.searchName = event.target.value;
        this.iconVisible = !(this.searchName.length > 0);
        getUsersbyName({name: this.searchName}).then(data=>{
            this.records = data;
        })
        .catch(error=>{
            this.showMessage('Error', error , 'error');
        })
    }

    getRecords(){
        this.recordVisible = true;
    }

    onPwdChange(event){
        this.password = event.target.value;
    }

    onSelect(event){
        this.userId = event.currentTarget.dataset.id;
        this.selectedName = event.currentTarget.dataset.name;
        this.isValueSelected = true;
        this.recordVisible = false;
    }

    handleClear(event){
        this.recordVisible = false;
    }

    handleClick(){
        if(this.userId.length>0 && this.password.length>0){
            passwordChange({userId:this.userId, newPassword: this.password})
            .then(data => {
                const statusCode = Object.keys(data)[0];
                if(statusCode === '204')
                {
                    this.showMessage('Success','Password Changed Successfully','Success');
                }
                else{
                    const errorData = JSON.parse(data[statusCode]); // Parsing the JSON string
                    const errorMessage = errorData[0].message;
                    this.showMessage(statusCode, errorMessage, 'error');
                }
            })
            .catch(error =>{
                console.log(JSON.stringify(error));
                this.showMessage('Error','Error in Calling the class', 'Error');
            })
        }
    }

    handleRemovePill(){
        this.isValueSelected = false;
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
