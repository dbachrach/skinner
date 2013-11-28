
start
  = expr

expr
  = "across" _ val:value { return { path: val }; }

value
  = chars:[^ \t\n\r]+ { return chars.join(""); }

_ "whitespace"
  = [ \t\n\r]*
