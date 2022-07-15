export const Keywords = {
    // keywords
    AND: 'and',
    OR: 'or',
    IF: 'if',
    ELSE: 'else',
    TRUE: 'true',
    FALSE: 'false',
    FOR: 'for',
    WHILE: 'while',
    FUN: 'fun',
    RETURN: 'return',
    CLASS: 'class',
    THIS: 'this',
    SUPER: 'super',
    NULL: 'null',
    PRINT: 'print',
    VAR: 'var'
} as const;

const Tokens = {

    // single char tokens
    LEFT_PAREN: '(',
    RIGHT_PAREN: ')',
    LEFT_BRACE: '[',
    RIGHT_BRACE: ']',
    COMMA: ',',
    DOT: '.',
    MINUS: '-',
    PLUS: '+',
    SEMICOLON: ';',
    COLON: ':',
    SLASH: '/',
    STAR: '*',
    
    // One or two char tokens
    BANG: '!',
    BANG_EQUAL: '!=',
    EQUAL: '=',
    DOUBLE_EQUAL: '==',
    GREATER: '>',
    GREATER_EQUAL: '>=',
    LESS: '<',
    LESS_EQUAL: '<=',

    ...Keywords,

    // literals
    IDENTIFIER: 'identifier', 
    STRING: 'string', 
    NUMBER: 'number',

    // end of file
    EOF: '\0'
} as const;

export default Tokens;

export type TokenType = typeof Tokens[keyof typeof Tokens];
export type KeywordType = typeof Keywords[keyof typeof Keywords];