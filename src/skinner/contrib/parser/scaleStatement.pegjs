
start
  = expr

expr
  = low:bound _ "to" _ high:bound  { return { low: low, high: high }; } /
    low:bound { return low; } /
    value:string { return value; }

bound
  = val:integer _ subtitle:subtitle? { return { value: val, subtitle: subtitle }; }

subtitle
  = "(" subtitle:string? ")" { return subtitle; }

string
  = chars:[^()]+ { return chars.join("").trim(); }

integer
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

_ "whitespace"
  = [ \t\n\r]*
