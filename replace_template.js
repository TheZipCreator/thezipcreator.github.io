// replaces the .html.prev with .html using template.html
// run with deno --allow-read --allow-write

const template = Deno.readTextFileSync("template.html");
for(const entry of Deno.readDirSync(".")) {
	if(!entry.isFile)
		continue;
	if(!entry.name.endsWith(".html.prev"))
		continue;
	const newName = entry.name.substring(0, entry.name.length-5);
	Deno.writeTextFileSync(newName, template.replace("{content}", Deno.readTextFileSync(entry.name)));
}
