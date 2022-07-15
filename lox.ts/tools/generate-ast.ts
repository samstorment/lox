import { ensureFile } from "https://deno.land/std@0.148.0/fs/mod.ts";

interface ExprType {
    className: string,
    args: Array<string>
}


const args = Deno.args;

console.log(args);

if (args.length !== 1) {
    console.error('Usage: vr gen-ast <output directory>');
    Deno.exit();
}

defineAst(args[0], 'Expr', [
    { className: 'Binary', args: [ 'left: Expr', 'operator: Token', 'right: Expr' ]},
    { className: 'Grouping', args: [ 'expression: Expr' ] },
    { className: 'Literal', args: [ 'value: any' ] },
    { className: 'Unary', args: [ 'operator: Token', 'right: Expr' ] }
]);


async function defineAst(outputDir: string, baseClass: string, types: Array<ExprType>) {
    const writeTo = `src/${outputDir}/${baseClass}.ts`;


    let output = `import Token from '../token.ts'\n\n`;
    
    output += `abstract class ${baseClass} {}\n\n`;

    types.forEach(t => output += defineType(baseClass, t));
    
    await ensureFile(writeTo);

    await Deno.writeTextFile(writeTo, output);
}

function defineType(baseClass: string, t: ExprType): string {
    let output = `class ${t.className} extends ${baseClass} {\n`;

    output += `    constructor (${t.args.join(', ')}) {\n`;

    output += `        super();\n`;

    t.args.forEach(arg => {
        const [ name ] = arg.split(': ');

        output += `        this.${name} = ${name};\n`
    });

    output += '    }\n\n';

    t.args.forEach(arg => output += `    ${arg};\n`)


    output += '}\n\n';

    return output;
}