function parseExpression(program) {
    program = skipSpace(program);
    let match, expr;

    if (match = /^"([^"]+)"/i.exec(program)) {
        expr = {type: 'value', value: match[1]};
    } else if (match = /^\d+\b/.exec(program)) {
        expr = {type: 'value', value: Number(match[0])};
    } else if (match = /^[^\s(),#"]+/.exec(program)) {
        expr = {type: 'word', name: match[0]}
    } else {
        throw SyntaxError('Неожиданый синтаксис: ' + program);
    }

    return parseApply(expr, program.slice(match[0].length));
}

function skipSpace(string) {
    let skip = string.match(/^(\s|#.*)*/);

    return string.slice(skip[0].length);
}

function parseApply(expr, program) {
    program = skipSpace(program);
    if (program[0] !== '(') return {expr, rest: program};

    program = skipSpace(program.slice(1));
    expr = {type: 'apply', operator: expr, args: []};

    while (program[0] !== ')') {
        let arg = parseExpression(program);

        expr.args.push(arg.expr);
        program = skipSpace(arg.rest);

        if (program[0] === ',') {
            program = skipSpace(program.slice(1));
        } else if (program[0] !== ')') {
            throw new SyntaxError('Ожидаеться: "," или ")"');
        }
    }

    return parseApply(expr, program.slice(1));
}

export function parse(expression) {
    const {expr, rest} = parseExpression(expression);

    if (skipSpace(rest).length > 0) {
        throw new SyntaxError('Неожиданый тест после выражения');
    }

    return expr;
}
