import { makeObservable, observable, action } from "mobx";

class UiStore {

    constructor(RootStore){
        this.RootStore = RootStore;
        this.devices = false;
        this.messages = false;
        this.keyboard = false;
        this.numberKeyboard = false;
        this.keyboardValue = "";
        this.inputs = {};
        this.currentInput = "";

        makeObservable(this, {
            devices: observable,
            messages: observable,
            keyboard: observable,
            keyboardValue: observable,
            currentInput: observable,
            inputs: observable,
            numberKeyboard: observable,
            setCurrentInput: action,
            setDevices: action, 
            setMessages: action,
            setKeyboard: action,
            handleKeyboard: action,
            setKeyboardValue: action,
            handleInputChange: action,
            onKeyPress: action,
            handleNumberKeyboard: action,
            setCurrentNumberInput: action,
            setNumberKeyboard: action,
        });
    }

   
    setDevices = bool => this.devices = bool;
    setMessages = bool => this.messages = bool;
    setKeyboard = bool => this.keyboard = bool;
    setNumberKeyboard = bool => this.numberKeyboard = bool;

    setKeyboardValue = value => {
        this.keyboardValue = value;
    } 

    handleKeyboard = bool => {
        if(bool){
            this.setKeyboard(bool);
        } else {
            if(this.keyboard){
                this.setKeyboard(false);
            } else {
                this.setKeyboardValue("");
                this.setKeyboard(true);
            }
        }
        
    }

    handleNumberKeyboard = bool => {
        if(bool){
            this.setNumberKeyboard(bool);
        } else {
            if(this.numberKeyboard){
                this.setNumberKeyboard(false);
            } else {
                this.setNumberKeyboard(true);
                this.setKeyboardValue("");
            }
        }        
    }

    setCurrentNumberInput = input => {
        this.currentInput = input;
        this.handleNumberKeyboard()
    }

    setCurrentInput = input => {
        this.currentInput = input;
        this.handleKeyboard();
    }

    handleInputChange = (value) => {
        if(this.currentInput){
            this.inputs[this.currentInput] = value;
        }
    }

    getValue = () => {
        if(this.currentInput){
            return this.inputs[this.currentInput]
        }
    }

    onKeyPress = key => {
        if(key === "{enter}"){
            this.keyboard = false;
            this.numberKeyboard = false;
        }
    }

    
}

export default UiStore;