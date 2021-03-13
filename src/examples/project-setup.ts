import { entry, select, yesno, nested, prompter } from "../builder/prompter";

const typescript = nested("typescript", {
	"target": select("Target", ["ES4", "ES5", "ES6"])
});

const angular = nested("angular", {
	"version": select("What version do you want to use?", [ "7", "6", "5" ]),
	"_with-typescript": yesno("With Typescript?").then(typescript)
});

prompter({
	'_tools': select("Select some tools", [
		entry("Angular").then(angular),
		entry("React"),
		entry("Docker"),
	])
}).then(console.log);