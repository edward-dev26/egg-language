export const topScope = Object.create(null);

for (let op of ['+', '-', '*', '/', '==', '<', '>']) {
    topScope[op] = Function("a, b", `return a ${op} b;`);
}

topScope.true = true;
topScope.false = false;
topScope.print = value => {
    console.log(value);
    return value;
};
