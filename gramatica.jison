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
"new"			  return 'new';
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
	const VariableChange = require('./CodigoIntermedio/VariableChange.js');
	const While = require('./CodigoIntermedio/While.js');
	const DoWhile = require('./CodigoIntermedio/DoWhile.js');
	const Switch = require('./CodigoIntermedio/Switch.js');
	const For = require('./CodigoIntermedio/For.js')
	const IncDecOp = require('./CodigoIntermedio/IncDecOp.js');
	const For2 = require('./CodigoIntermedio/For2.js');
	const ForThree = require('./CodigoIntermedio/ForThree.js');
	const Function = require('./CodigoIntermedio/Function.js');
	const callFunction = require('./CodigoIntermedio/callFunction.js');
	const Return = require('./CodigoIntermedio/Return.js');
	const Break = require('./CodigoIntermedio/Break.js');
	const Continue = require('./CodigoIntermedio/Continue.js');
	const Ternary = require('./CodigoIntermedio/Ternary.js');
	const Arrayl = require('./CodigoIntermedio/Arrayl.js');
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
			|funciones { $$=$1; }
			|IF { $$ =$1; }
			|WHILE {$$ =$1;}
			|DOWHILE {$$=$1;}
			|SWITCH {$$=$1;}
			|FOR  {$$=$1;}
;

llamadaFuncion: id PL bracketOpen paramFunc bracketClose semicolon
				{
					$$ = new callFunction($1,$2,$4);
				}
				/*{
					$$ = new Print($4,0);
				}*/
;

PL:varLast {$$=$1;}
	|{$$=null;};


paramFunc: paramFuncList { $$ = $1; }
		|
;

paramFuncList: paramFuncList comma E 
				{
					$1.push($3);
					$$ = $1;
				}
			  |E { $$ = [$1]; }
;

funciones: function id bracketOpen funcParam bracketClose funcDec
		   {
			   $$ = new Function($2,$4,$6);
		   }
		  ;

funcDec: dosPuntos types curlyBraceOpen STMT curlyBraceClose
		{
			$$ = {type:$2,stmt:$4}
		}
		|curlyBraceOpen STMT curlyBraceClose
		{
			$$ = {type:null,stmt:$2}
		}
;

funcParam: funcParamList {$$=$1;}
		  |{$$ = null;}
;

funcParamList: funcParamList comma id dosPuntos types
			  {$1.push({id:$3,types:$5}); $$=$1;}
			  |id dosPuntos types
			  {$$ = [{id:$1,types:$3}];}
;

STMT: STMT InstruccionI  { $1.push($2); $$=$1;}
	 |InstruccionI {$$=[$1];}
;

InstruccionI: llamadaFuncion {$$=$1;}
            |variables {$$=$1;}
			|funciones
            |IF{$$=$1;}
            |WHILE {$$=$1;}
            |DOWHILE {$$=$1;}
            |SWITCH {$$=$1;}
            |FOR {$$=$1;}
            |Break semicolon {$$=new Break();}
            |Continue semicolon {$$=new Continue();}
            |return OP { $$=new Return($2); }

;

OP: E semicolon{$$=$1;}
	|semicolon {$$=null;}
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
{
	$$ = new While(0,0,$3,$6);
}
;

DOWHILE: do curlyBraceOpen STMT curlyBraceClose while bracketOpen exp bracketClose semicolon
{
	$$ = new DoWhile(0,0,$7,$3);
}
;

SWITCH: switch bracketOpen exp bracketClose curlyBraceOpen FIRSTCASE LASTCASE curlyBraceClose
		{
			$$ = new Switch($3,$6,$7);
		}
;

FIRSTCASE: CASE {$$=$1;}
		  | {$$ = null;}
;

CASE: CASE case exp dosPuntos STMT
	  {
			$1.push({exp:$3,stmt:$5});
			$$ = $1;
	  }
	 |case exp dosPuntos STMT
	 {
			$$ = [{exp:$2,stmt:$4}]
	 }
;

LASTCASE: DEFCASE ENDCASE
{
	$$ = $1;
}
;

DEFCASE: default dosPuntos STMT
{
	$$ = $3;
}
;

ENDCASE: CASE {$$=$1;}
		|{$$=null;}
;


FOR: for bracketOpen let id dosPuntos types igual exp semicolon exp semicolon exp bracketClose curlyBraceOpen STMT curlyBraceClose
	{
		$$ = new For($3,$4,$6,$8,$10,$12,$15);
	}
	|for bracketOpen exp igual exp semicolon exp semicolon exp bracketClose curlyBraceOpen STMT curlyBraceClose
	{
		$$ = new For2($3,$5,$7,$9,$12);
	}
	|for bracketOpen exp semicolon exp semicolon exp bracketClose curlyBraceOpen STMT curlyBraceClose
	{
		$$ = new ForThree($3,$5,$7,$10);
	}
	|for bracketOpen let id forOP exp bracketClose curlyBraceOpen STMT curlyBraceClose
	|for bracketOpen exp forOP exp bracketClose curlyBraceOpen STMT curlyBraceClose
;


forOP: in {$$=$1;}
	  |of {$$=$1;}
;

defVarLast: comma defVarLastP
			|{$$=null;};

defVarLastP: defVarLastP comma id defLast
			|id defLast;

variables: defType id defLast defVarLast semicolon
			{
				$$ = new Variables($1,$2,$3,$4);
			}
		  |id asignLast semicolon
		  	{
				$$ = new VariableChange($1,$2);
		  	}
		  |id asignLast
		  	{
				$$ = new VariableChange($1,$2);
		  	}
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
		 | asignLastF {$$ = $1;}
;

varLast: sqBracketOpen exp sqBracketClose  auxP
		| point id  auxP
;
		
auxP:varLast {$$=$1;}
	|{$$=null;}
	;

asignLastF:  igual E
			{
				$$ = {tipo:'=',value:$2}
			}
			|masIgual E
			{
				$$ = {tipo:'+',value:$2}
			}
			|menosIgual E
			{
				$$ = {tipo:'-',value:$2}
			}
			|porIgual E
			{
				$$ = {tipo:'*',value:$2}
			}
			|divisionIgual E
			{
				$$ = {tipo:'/',value:$2}
			}
			|increment
			{
				$$ = {tipo:'++',value:null}
			}
			|decrement
			{
				$$ = {tipo:'--',value:null}
			}
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

typesList: typesL {$$=$1;}
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
		$$ =$2;
	}
	| exp question exp dosPuntos exp
	{
		$$ = new Ternary($1,$3,$5);	
	}
	| exp increment
	{
		$$ = new IncDecOp($1,'+');
	}
	| exp decrement
	{
		$$ = new IncDecOp($1,'-');
	}
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
	| new id bracketOpen exp bracketClose
	{
		$$ = new Arrayl($2,$4);
	}
	| id
	{
		$$ = new Id(0,0,$1);
	}
	| id PL bracketOpen paramFunc bracketClose
	{
		$$ = new callFunction($1,$2,$4);
	}
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