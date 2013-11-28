
start
  = expr

expr
  = "across" _ val:value { return { path: val }; }
  / val:integer _ "times" { return { times: val }; }

value
  = chars:[^ \t\n\r]+ { return chars.join(""); }

integer
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

_ "whitespace"
  = [ \t\n\r]*
