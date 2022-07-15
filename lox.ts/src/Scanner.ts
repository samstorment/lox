import Token from './Token.ts';
import Tokens, { Keywords, KeywordType } from './Tokens.ts';
import type { TokenType } from './Tokens.ts';
import { error } from './main.ts';

export default class Scanner {
    source: string;
    tokens: Array<Token> = [];

    start = 0;
    current = 0;
    line = 1;

    keywords = new Set([...Object.values(Keywords)]);

    constructor(source: string) {
        this.source = source;
    }

    scanTokens(): Array<Token> {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }

        this.tokens.push(new Token(Tokens.EOF, "", null, this.line));

        return this.tokens;
    }

    scanToken() {
        const c = this.advance();

        switch(c) {
            case Tokens.LEFT_PAREN:
            case Tokens.RIGHT_PAREN:
            case Tokens.LEFT_BRACE:
            case Tokens.RIGHT_BRACE:
            case Tokens.COMMA:
            case Tokens.DOT:
            case Tokens.MINUS:
            case Tokens.PLUS:
            case Tokens.SEMICOLON:
            case Tokens.COLON:
            case Tokens.STAR:
                this.addToken(c);
                break;
            case Tokens.BANG:
            case Tokens.EQUAL:
            case Tokens.LESS:
            case Tokens.GREATER:
                this.addToken(this.match(Tokens.EQUAL) ? `${c}${Tokens.EQUAL}` : c)
                break;
            case Tokens.SLASH:
                if (this.match(Tokens.SLASH)) this.inlineComment();
                else if (this.match(Tokens.STAR)) this.blockComment();
                else this.addToken(c);
                break;
            case '"':
            case `'`:
                this.string(c);
                break;
            // ignored characters
            case ' ':
            case '\r':
            case '\t':
                break;
            case '\n':
                this.line++;
                break;
            default:
                if (this.isDigit(c)) this.number();
                else if (this.isAlpha(c)) this.identifier();
                else error(this.line, "Unexpected character");
                break;
        }
    }

    match(expected: string) {
        if (this.isAtEnd()) return false;
        if (this.source.charAt(this.current) !== expected) return false;

        this.current++;
        return true;
    }

    peek(offset: 0 | 1 = 0) {
        const peekIndex = this.current + offset;
        if (peekIndex >= this.source.length) {
            return Tokens.EOF;
        } 
        return this.source.charAt(peekIndex);
    }

    advance() {
        return this.source.charAt(this.current++);
    }

    addToken(type: TokenType, literal: any = null) {
        const text = this.source.substring(this.start, this.current);
        this.tokens.push(new Token(type, text, literal, this.line));
    }

    
    isAtEnd() { 
        return this.current >= this.source.length; 
    }

    isDigit(char: string) {
        const zero = '0'.charCodeAt(0);
        const nine = '9'.charCodeAt(0);
        const num = char.charCodeAt(0);

        return num >= zero && num <= nine;
    }

    isAlpha(char: string) {
        const a = 'a'.charCodeAt(0);
        const z = 'z'.charCodeAt(0);
        const A = 'A'.charCodeAt(0);
        const Z = 'Z'.charCodeAt(0);
        const c = char.charCodeAt(0);
        
        const isLower = c >= a && c <= z;
        const isUpper = c >= A && c <= Z;

        return isLower || isUpper || char === '_';
    }

    isAlphaNumeric(char: string) {
        return this.isDigit(char) || this.isAlpha(char);
    }

    string(quote: string) {
        // move through the source string looking for a quote to close the string
        while (this.peek() != quote && !this.isAtEnd()) {
            if (this.peek() === '\n') this.line++;
            this.advance();
        }

        if (this.isAtEnd()) {
            error(this.line, "Unterminated string");
            return;
        }

        // go to the closing quote
        this.advance();

        // get the string value excluding quotes
        const value = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(Tokens.STRING, value);
    }

    number() {
        while (this.isDigit(this.peek())) {
            this.advance();
        }

        if (this.peek() === '.' && this.isDigit(this.peek(1))) {
            this.advance();

            while (this.isDigit(this.peek())) {
                this.advance();
            }
        }

        const numberString = this.source.substring(this.start, this.current);
        const numberLiteral = parseFloat(numberString);

        this.addToken(Tokens.NUMBER, numberLiteral);
    }

    identifier() {
        while (this.isAlphaNumeric(this.peek())) {
            this.advance();
        }

        const text = this.source.substring(this.start, this.current);

        let type: TokenType = Tokens.IDENTIFIER;

        if (this.keywords.has(text as KeywordType)) {
            type = text as TokenType;
        }

        this.addToken(type);
    }

    inlineComment() {
        while (this.peek() !== '\n' && !this.isAtEnd()) {
            this.advance();
        }
    }

    blockComment() {
        const isClosing = () => {
            return this.peek() === Tokens.STAR && this.peek(1) === Tokens.SLASH;
        }

        while (!isClosing() && !this.isAtEnd()) {
            const val = this.advance();
            if (val === '\n') this.line++;
        }

        // consume the */ closing characters
        this.advance();
        this.advance();
    }
}