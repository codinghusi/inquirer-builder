import { entry, select, yesno, section, prompter } from "../builder/prompter";

const typescript = section("typescript", {
	"target": select("Target", ["ES4", "ES5", "ES6"])
	// ...
});

const angular = section("angular", {
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