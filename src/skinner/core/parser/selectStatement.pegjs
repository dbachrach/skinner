
start
  = selects

selects
  = select:select _ "," _ selects:selects { return [select].concat(selects); }
  / select:select { return [select]; }

select
  = times:times _ randomly:randomly _ "from" _ topiclist:topiclist { return { "times": times, "randomly": (randomly === "randomly"), "topics": topiclist }; }

times
  = integer
  / "all"

randomly
  = "randomly"?

topiclist
  = "[" _ topics:topics _ "]" { return topics; }
  / "each topic" { return "each topic"; }

topics
  = value:value _ "," _ topics:topics { return  [value].concat(topics); }
  / value: value { return [value]; }

value
  = '"' chars:[^\n\r\f\\"]* '"' { return chars.join(""); }
  / chars:[^ ,\t\n\r\]\[]+ { return chars.join(""); }

integer
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

_ "whitespace"
  = [ \t\n\r]*
