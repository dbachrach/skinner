
start
  = expr

expr
  = "if" _ comp:comparison { return comp; }
  / "unless" _ comp:comparison { return !comp; }

comparison
  = left:value _ op:operator _ right:value { return op(left, right); }

operator
  = "is not" { return function (a, b) { return a !== b; } }
  / "is" { return function (a, b) { return a === b; } }

value
  = '"' chars:[^\n\r\f\\"]* '"' { return chars.join(""); }
  / chars:[^ \t\n\r]+ { return chars.join(""); }

_ "whitespace"
  = [ \t\n\r]*
