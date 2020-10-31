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
	const Logical  = require('./CodigoIntermedio/Logical.js');
	const Operation = require('./CodigoIntermedio/Operation.js');
	const Relational = require('./CodigoIntermedio/Relational.js');
	const tsObject =  require('./CodigoIntermedio/tsObject.js')
	const Print =     require('./CodigoIntermedio/Print.js')
	const Variables = require('./CodigoIntermedio/Variable.js')
	const defLast = require('./CodigoIntermedio/defLast.js')
	const Id = require('./CodigoIntermedio/Id.js')
	const If = require('./CodigoIntermedio/If.js')
%}

%start S

%% /*Gramática*/

S: Bloque EOF
{ return $1; }
;

Bloque: Bloque Instruccion { $1.push($2); $$=$1;}
	| Instruccion { $$ = [$1]; } 
;

Instruccion: llamadaFuncion { $$ = $1; }
            |variables { $$=$1; }
            |Type id igual curlyBraceOpen parsObj curlyBraceClose semicolon/*; o no*/
			|funciones
			|IF { $$ =$1; }
			|WHILE
			|DOWHILE
			|SWITCH
			|FOR
;

llamadaFuncion: id PL bracketOpen paramFunc bracketClose semicolon
				{
					$$ = new Print($4,0);
				}
;

PL:varLast
	|;


paramFunc: paramFuncList { $$ = $1; }
		|
;

paramFuncList: paramFuncList comma E
			  |E { $$ = $1; }
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

STMT: STMT InstruccionI  { $1.push($2); $$=$1;}
	 |InstruccionI {$$=$1;}
;

InstruccionI: llamadaFuncion {$$=$1;}
            |variables {$$=$1;}
			|funciones
            |IF{$$=$1;}
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
	{
		$$ = new If($3,$6,$8);
	}
;

IFLAST: else IFCOND { $$ = $2; }
	  |{$$ = null;}
;

IFCOND: if bracketOpen exp bracketClose curlyBraceOpen STMT curlyBraceClose IFLAST
	   {
		   $$ = new If($3,$6,$8);
	   }
	   |curlyBraceOpen STMT curlyBraceClose
	   {
		   $$ = new If(null,$2,null);
	   }
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
			{
				$$ = new Variables($1,$2,$3,$4);
			}
		  |id asignLast semicolon
		  |id asignLast
;

defLast: dosPuntos types igual E
		{
			$$ = new defLast($2,$4);
		}
        |dosPuntos types
		{
			$$ = new defLast($2,null);
		}
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

defType: let  {$$=$1;}
	    |const {$$=$1;}
;



types: number  typesList
		{
			$$ = {type:$1,list:$2}
		}
      |boolean typesList
	  {
			$$ = {type:$1,list:$2}
		}
      |string  typesList
	  {
			$$ = {type:$1,list:$2}
		}
      |void    typesList
	  {
			$$ = {type:$1,list:$2}
		}
      |id      typesList
	  {
			$$ = {type:$1,list:$2}
		}
;

typesList: typesL
		  |{$$ = 0;}
;

typesL: typesL sqBracketOpen sqBracketClose
		{
			$$ = $1 + 1;
		}
		|sqBracketOpen sqBracketClose
		{
			$$ = 1;
		}
;

E: exp { $$ = $1; }
	| curlyBraceOpen objetoParam curlyBraceClose
	;

exp: exp mas exp
	{
		$$ = new Operation($1,$3,'+',0,0);
	}
	| exp menos exp
	{
		$$ = new Operation($1,$3,'-',0,0);
	}
	| exp por exp
	{
		$$ = new Operation($1,$3,'*',0,0);
	}
	| exp division exp
	{
		$$ = new Operation($1,$3,'/',0,0);
	}
	| menos exp %prec unary
	{
		$$ = new Operation($2,null,'--',0,0);
	}
	| exp potencia exp
	{
		$$ = new Operation($1,$3,'**',0,0);
	}
	| exp modulo exp
	{
		$$ = new Operation($1,$3,'%',0,0);
	}
	| exp mayorque exp
	{
		$$ = new Relational($1,$3,'>',0,0);
	}
	| exp menorque exp
	{
		$$ = new Relational($1,$3,'<',0,0);
	}
	| exp mayorigualque exp
	{
		$$ = new Relational($1,$3,'>=',0,0);
	}
	| exp menorigualque exp
	{
		$$ = new Relational($1,$3,'<=',0,0);
	}
	| exp igualdad exp
	{
		$$ = new Relational($1,$3,'==',0,0);
	}
	| exp diferencia exp
	{
		$$ = new Relational($1,$3,'!=',0,0);
	}
	| exp and exp
	{
		$$ = new Logical($1,$3,'&&',0,0);
	}
	| exp or exp
	{
		$$ = new Logical($1,$3,'||',0,0);
	}
	| not exp
	{
		$$ = new Logical($2,null,'!',0,0);
	}
	| bracketOpen exp bracketClose
	{
		$$ =$1;
	}
	| exp question exp dosPuntos exp
	| exp increment
	| exp decrement
	| NUMBER
	{
		$$ = new tsObject(0,0,$1,'number');
	}
	| STRING
	{
		$$ = new tsObject(0,0,$1,'string');
	}
	| true
	{
		$$ = new tsObject(0,0,1,'boolean');
	}
	| false
	{
		$$ = new tsObject(0,0,0,'boolean');
	}
	| null
	//| undefined
	| id varLast
	| id
	{
		$$ = new Id(0,0,$1);
	}
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