import {parse} from "./parse";
import {evaluate} from "./evaluate";
import {topScope} from "./scope";

function run(program) {
    console.log(parse(program));
    return evaluate(parse(program), Object.create(topScope));
}

run(`
do( 
    define(c, 20),
    define(f, fun(a, b, 
        do(
            define(result, +(a, b)),
            set(c, +(result, c)),
            print(c),
            print(result),
        )
    )),
    f(2, 2),
    print(c)
)
`);

