# Inquirier Builder

This package builds on top of Inquirer.js and provides you more flexibility and functionality.
On top of that it's more intuitive to use.

## Installation
```sh
npm install @gweiermann/inquirer-builder
```
Types are already in that package (for Typescript)

## Examples
Check out the src/examples/ for examples

Example "Login or Register":
```javascript
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
```