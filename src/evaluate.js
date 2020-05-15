const specialForms = Object.create(null);

specialForms.if = (args, scope) => {
    if (args.length !== 3) {
        throw new SyntaxError('Неверное количество аргументов для if');
    } else if (evaluate(args[0], scope) !== false) {
        return evaluate(args[1], scope)
    } else {
        return evaluate(args[2], scope);
    }
};

specialForms.while = (args, scope) => {
    if (args.length !== 2) {
        throw new SyntaxError('Неверное количество аргументов для while');
    }

    while (evaluate((args[0]), scope) !== false) {
        evaluate(args[1], scope);
    }

    return false;
};

specialForms.do = (args, scope) => {
    let  value = false;

    for (let arg of args) {
        value = evaluate(arg, scope);
    }

    return value;
};

specialForms.define = (args, scope) => {
    if (args.length !== 2 || args[0].type !== 'word') {
        throw new SyntaxError('Неверное использование определения');
    }

    let value = evaluate(args[1], scope);

    scope[args[0].name] = value;
    return value;
};

specialForms.fun = (args, scope) => {
    if (!args.length) {
        throw new SyntaxError('У фукции должно быть тело');
    }

    let body = args[args.length - 1];
    let params = args.slice(0, args.length - 1).map(expr => {
        if (expr.type !== 'word') {
            throw new SyntaxError('Именами параметров должны быть слова');
        }

        return expr.name;
    });

    return function () {
        if (arguments.length !== params.length) {
            throw new SyntaxError('Некоретное чмсло аргументов');
        }

        const localScope = Object.create(scope);

        for (let i = 0; i < arguments.length; i++) {
            localScope[params[i]] = arguments[i];
        }

        return evaluate(body, localScope);
    }
};

specialForms.array = (args, scope) => {
    return args.map(arg => evaluate(arg, scope));
};

specialForms.set = (args, scope, value = null) => {
    if (!scope) {
        throw new ReferenceError('Привязка не определена');
    }

    if (args.length !== 2 || args[0].type !== 'word') {
        throw new SyntaxError('Неверное использование определения');
    }

    if (!value) {
        value = evaluate(args[1], scope);
    }

    if (Object.prototype.hasOwnProperty.call(scope, args[0].name)) {
        scope[args[0].name] = value;

        return value;
    } else {
        return specialForms.set(args, Object.getPrototypeOf(scope), value);
    }
};

export function evaluate(expr, scope) {
    if (expr.type === 'value') {
        return expr.value;
    } else if (expr.type === 'word') {
        if (expr.name in scope) {
            return scope[expr.name]
        } else {
            throw new ReferenceError(`Неопределённая привязка: ${expr.name}`);
        }
    } else if (expr.type === 'apply') {
        let {operator, args} = expr;

        if (operator.type === 'word' && operator.name in specialForms) {
            return specialForms[operator.name](expr.args, scope);
        } else {
            let op = evaluate(operator, scope);

            if (typeof op === 'function') {
                return op(...args.map(arg => evaluate(arg, scope)));
            } else {
                throw new TypeError('Приложение не являетсья функцией.');
            }
        }
    }
}
