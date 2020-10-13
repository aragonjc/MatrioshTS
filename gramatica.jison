%{
%}
%lex

%options case-sensitive

%%
"//".*   //Comentario Linea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] //Comentaio Multilinea

"continue"        return 'Continue';
"break"           return 'Break';
"null"            return 'null';
"type"            return 'Type';
"const"           return 'const';
"let"             return 'let';
"const"           return 'const';
"function"        return 'function';
"if"              return 'if';
"else"            return 'else';
"while"           return 'while';
"do"              return 'do';
"switch"          return 'switch';
"case"            return 'case';
"default"         return 'default';
"for"             return 'for';
"in"              return 'in';
"of"              return 'of';
"number"          return 'number';
"boolean"         return 'boolean';
"string"          return 'string';
"void"            return 'void';
"true"            return 'true';
"false"           return 'false';
"undefined"       return 'undefined';
"return"		  return 'return';
"+="              return 'masIgual';
"-="              return 'menosIgual';
"*="              return 'porIgual';
"/="              return 'divisionIgual';
"{"               return 'curlyBraceOpen';
"}"               return 'curlyBraceClose';
"("               return 'bracketOpen';
")"               return 'bracketClose';
","               return 'comma';
";"               return 'semicolon';
":"               return 'dosPuntos';
"."               return 'point';
"++"              return 'increment';
"--"              return 'decrement';
"+"               return 'mas';
"-"               return 'menos';
"**"              return 'potencia';
"*"               return 'por';
"/"               return 'division';
"%"               return 'modulo';

">="              return 'mayorigualque';
"<="              return 'menorigualque';
">"               return 'mayorque';
"<"               return 'menorque';
"=="              return 'igualdad';
"="               return 'igual';
"!="              return 'diferencia';

"&&"              return 'and';
"||"              return 'or';
"!"               return 'not';
"?"               return 'question';
"["               return 'sqBracketOpen';
"]"               return 'sqBracketClose';

/* Espacios en blanco */
\s+                     {}
\t+                     {}
\r+                     {}
\n+                     {}

[0-9]+("."[0-9]+)?\b            return 'NUMBER';
\"[^\"]*\"|\'[^\']*\'|\`[^\`]*\`        return 'STRING';
([a-zA-Z$_])[a-zA-Z0-9_$]*	return 'id';



<<EOF>>                 return 'EOF';

.                       { console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); }
/lex

%right 'question'
%left 'or'
%left 'and'
%left 'mayorque' 'menorque' 'mayorigualque' 'menorigualque' 'igualdad' 'diferencia'
%left 'mas' 'menos'
%left 'por' 'division' 'modulo'
%left  'increment' 'decrement'
%left 'potencia'
%right 'unary'
%right 'not'

%{

%}

%start S

%% /*Gramática*/

S: Bloque EOF
{ return $1; }
;

Bloque: Bloque Instruccion
	| Instruccion          
;

Instruccion: llamadaFuncion
            |variables
            |Type id igual curlyBraceOpen parsObj curlyBraceClose semicolon/*; o no*/
			|funciones
			|IF
			|WHILE
			|DOWHILE
			|SWITCH
			|FOR
;

llamadaFuncion: id PL bracketOpen paramFunc bracketClose semicolon
;

PL:varLast
	|;


paramFunc: paramFuncList
		|
;

paramFuncList: paramFuncList comma E
			  |E
;

funciones: function id bracketOpen funcParam bracketClose funcDec
		  ;

funcDec: dosPuntos types curlyBraceOpen STMT curlyBraceClose
		|curlyBraceOpen STMT curlyBraceClose
;

funcParam: funcParamList
		  |
;

funcParamList: funcParamList comma id dosPuntos types
			  |id dosPuntos types
;

STMT: STMT InstruccionI
	 |InstruccionI
;

InstruccionI: llamadaFuncion
            |variables
			|funciones
            |IF
            |WHILE
            |DOWHILE
            |SWITCH
            |FOR
            |Break semicolon
            |Continue semicolon
            |return OP

;

OP: E semicolon
	|semicolon
	;

IF: if bracketOpen exp bracketClose curlyBraceOpen STMT curlyBraceClose IFLAST
	
;

IFLAST: else IFCOND
	  |
;

IFCOND: if bracketOpen exp bracketClose curlyBraceOpen STMT curlyBraceClose IFLAST
	   |curlyBraceOpen STMT curlyBraceClose
;

WHILE: while bracketOpen exp bracketClose curlyBraceOpen STMT curlyBraceClose
;

DOWHILE: do curlyBraceOpen STMT curlyBraceClose while bracketOpen exp bracketClose semicolon
;

SWITCH: switch bracketOpen exp bracketClose curlyBraceOpen FIRSTCASE LASTCASE curlyBraceClose
;

FIRSTCASE: CASE
		  |
;

CASE: CASE case exp dosPuntos STMT
	 |case exp dosPuntos STMT
;

LASTCASE: DEFCASE ENDCASE
;

DEFCASE: default dosPuntos STMT
;

ENDCASE: CASE
		|
;


FOR: for bracketOpen let id igual exp semicolon exp semicolon exp bracketClose curlyBraceOpen STMT curlyBraceClose
	|for bracketOpen exp igual exp semicolon exp semicolon exp bracketClose curlyBraceOpen STMT curlyBraceClose
	|for bracketOpen exp semicolon exp semicolon exp bracketClose curlyBraceOpen STMT curlyBraceClose
	|for bracketOpen let id forOP exp bracketClose curlyBraceOpen STMT curlyBraceClose
	|for bracketOpen exp forOP exp bracketClose curlyBraceOpen STMT curlyBraceClose
;


forOP: in 
	  |of 
;

forDec: variables
	   |id
;

defVarLast: comma defVarLastP
			|;

defVarLastP: defVarLastP comma id defLast
			|id defLast;

variables: defType id defLast defVarLast semicolon
		  |id asignLast semicolon
		  |id asignLast
;

asignLast: varLast asignLastF
		 | asignLastF
;

varLast: sqBracketOpen exp sqBracketClose  auxP
		| point id  auxP
;
		
auxP:varLast
	|
	;

asignLastF:  igual E
			|masIgual E
			|menosIgual E
			|porIgual E
			|divisionIgual E
			|increment
			|decrement
;

parsObj: objType
		|
;

objType: objType opkv keyvalueT
		|keyvalueT
;


opkv: comma      
	 | semicolon 
;

keyvalueT: id dosPuntos types
;

defType: let   
	    |const 
;

defLast: dosPuntos types igual E
        | igual E
        |
;

types: number  typesList
      |boolean typesList
      |string  typesList
      |void    typesList
      |id      typesList
;

typesList: typesL
		  |
;

typesL: typesL sqBracketOpen sqBracketClose
		|sqBracketOpen sqBracketClose
;

E: exp
	| curlyBraceOpen objetoParam curlyBraceClose
	;

exp: exp mas exp
	| exp menos exp
	| exp por exp
	| exp division exp
	| menos exp %prec unary
	| exp potencia exp
	| exp modulo exp
	| exp mayorque exp
	| exp menorque exp
	| exp mayorigualque exp
	| exp menorigualque exp
	| exp igualdad exp
	| exp diferencia exp
	| exp and exp
	| exp or exp
	| not exp
	| bracketOpen exp bracketClose
	| exp question exp dosPuntos exp
	| exp increment
	| exp decrement
	| NUMBER
	| STRING
	| true
	| false
	| null
	| undefined
	| id varLast
	| id
	| id PL bracketOpen paramFunc bracketClose
	| sqBracketOpen arrParam sqBracketClose sqBCKFIN
;

sqBCKFIN: sqBckList
		|
;

sqBckList: sqBckList sqBracketOpen arrParam sqBracketClose
		|sqBracketOpen arrParam sqBracketClose
		;

arrParam: listArrParam
		 |
;

listArrParam: listArrParam comma E
			|E
;

objetoParam: objetoParamList
			|
;

objetoParamList: objetoParamList opkv keyvalue
		  		|keyvalue
;

keyvalue: id dosPuntos E
;