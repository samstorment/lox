import Token from '../token.ts'

abstract class Expr {}

class Binary extends Expr {
    constructor (left: Expr, operator: Token, right: Expr) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    left: Expr;
    operator: Token;
    right: Expr;
}

class Grouping extends Expr {
    constructor (expression: Expr) {
        super();
        this.expression = expression;
    }

    expression: Expr;
}

class Literal extends Expr {
    constructor (value: any) {
        super();
        this.value = value;
    }

    value: any;
}

class Unary extends Expr {
    constructor (operator: Token, right: Expr) {
        super();
        this.operator = operator;
        this.right = right;
    }

    operator: Token;
    right: Expr;
}

