
import Scanner from './scanner.ts';


export let hadError = false;

function main() {

    // command line args
    const args = Deno.args;

    if (args.length > 1) {
        console.error("Usage: jlox [script]");
        return console.error("Exiting");
    }

    if (args.length === 1) {
        runFile(args[0]);
        return;
    }

    runPrompt();
}

main();

function run(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();
    console.table(tokens);
}

async function runFile(filePath: string) {
    try {
        const source =  await Deno.readTextFile(filePath);
        run(source);
        if (hadError) return;
    } catch {
        console.error(`Error reading file:`, filePath);
    }
}

function runPrompt() {
    while (true) {
        const input = prompt('>', '');

        if (input === '') continue;
        if (!input || input === 'exit') break;
        if (input === 'cls') {
            console.clear();
            continue;
        }

        run(input);
    }
}

export function error(line: number, message: string) {
    report(line, "", message);
}

function report(line: number, where: string, message: string) {
    console.error(`[line ${line}] Error${where}: ${message}`);
    hadError = true;
}