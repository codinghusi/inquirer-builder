import { password, prompter, text, yesno } from "../package";

const personalInfo = {
    "displayName": text("Set your display name: "),
    "email": text("Whats your email?")
}

const register = {
    "username": text("Username: "),
    "password": password("Password: "),
    "_": yesno("Do you want to setup some personal information?").then(personalInfo)
};

prompter(register).then(console.log);