# Inquirier Builder

This package builds on top of Inquirer.js and provides you more flexibility and functionality.
On top of that it's more intuitive to use.

## Examples
Check out the examples/ for examples

Example "Login or Register":
```
import { entry, section, password, prompter, select, text, message } from "../builder/prompter";

// Small helper function
function email(message: string) {
    const emailRegex = /^[\w\-+.]+@[\w.\-]+\.[a-z]{2,}$/i;
    return text(message).validate((email: string) => emailRegex.test(email) || "This address is not valid");
}

// Login Questions
const login = section("user", {
    username: text("Username"),
    password: password("Password"),
});

// Register Questions
const register = section("user", {
    username: text("Username"),
    displayName: text("Displayname"),
    email: email("Email"),
    password: password("Password"),
});

// Menu Prompt, leads to Login or Register
const menu = {
    'auth-type': select("Do you have an account?", {
        login: entry("Login").then(login),
        register: entry("Register").then(register),
    }),
    '_msg': message((data: any) => `Well done ${data.user.username}, you are logged in!`)
};

prompter(menu).then(answers => {
    console.log(answers);
});

```