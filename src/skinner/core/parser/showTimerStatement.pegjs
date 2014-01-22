
start
  = expr

expr
  = "with" _ num:integer _ unit:value _ "left" { return num + " " + unit; /* TODO return { num: num, unit: unit }; */  }

value
  = chars:[^ \t\n\r]+ { return chars.join(""); }

integer
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

_ "whitespace"
  = [ \t\n\r]*
