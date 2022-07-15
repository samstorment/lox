export default {
    "scripts": {
        "dev": "deno run --allow-read ./src/main.ts",
        "gen-ast": "deno run --allow-write --allow-read ./tools/generate-ast.ts"
    }
}