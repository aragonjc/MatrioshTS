%{
	var contador = 0;
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
	
	const ast = require('./AST/ast.js');
	
%}

%start S

%%

S: Bloque EOF
{ 
	contador++;
	return ast.Node(contador,"S",$1,null);	
	 
}
;

Bloque: Bloque Instruccion 
		{ 
			contador++;
			$$ = ast.Node(contador,"Bloque",$1,$2);
		}
	| Instruccion
	{ 
		contador++;
		$$ = ast.Node(contador,"Instruccion",$1,null);
	}
;

Instruccion: llamadaFuncion
			{ $$=$1; }
            |variables
			{ $$=$1;}
            |Type id igual curlyBraceOpen parsObj curlyBraceClose semicolon
			{
				contador++;
				var id = ast.Leaf(contador,$2);
				contador++;
				var igual = ast.Leaf(contador,"=");
				contador++;
				var curlyO = ast.Leaf(contador,"\"{\"")
				contador++;
				var curlyC = ast.Leaf(contador,"\"}\"")
				var arr = [];
				arr.push(id)
				arr.push(igual)
				arr.push(curlyO)
				if($5) {
					arr.push($5)
				}
				arr.push(curlyC)

				contador++;
				$$ = ast.Node(contador,"TYPE",arr,null);
			}
			|funciones
			{ $$=$1; }
			|IF
			{ $$=$1; }
			|WHILE
			{ $$=$1;}
			|DOWHILE
			{ $$=$1; }
			|SWITCH
			{ $$=$1; }
			|FOR
			{ $$=$1; }
;

llamadaFuncion: id PL bracketOpen paramFunc bracketClose semicolon
                {
					contador++;
					var id = ast.Leaf(contador,$1);
					contador++;
					var bkOp = ast.Leaf(contador,"ParentesisAbre")
					contador++;
					var bkC = ast.Leaf(contador,"ParentesisCierra")
					var arr = [];
					arr.push(id)
					if($2!=null) {
						arr.push($2)
					}
					arr.push(bkOp)
					if($4) {
						arr.push($4)
					}
					arr.push(bkC)
					contador++;
					$$ = ast.Node(contador,"LlamadaFuncion",arr,null);
				}
;
 PL:varLast {$$= $1;}
	|{$$ = null;}
;

paramFunc: paramFuncList { $$=$1;} 
		|                { $$=null;}                
;

paramFuncList: paramFuncList comma E
                  {
					  contador++;
					  $$ = ast.Node(contador,"listaParametros",$1,$3);
					}
			  |E  {$$ = $1;}
;

funciones: function id bracketOpen funcParam bracketClose funcDec
{
		contador++;
		var id = ast.Leaf(contador,$2);
		contador++;
		var bo = ast.Leaf(contador,"ParentesisAbre")
		contador++;
		var bc = ast.Leaf(contador,"ParentesisCierre")
		var arr = []
		arr.push(id)
		arr.push(bo)
		if($4) {
			arr.push($4)
		}
		arr.push(bc)
		if($6.hasOwnProperty("type")) {
			arr.push($6.type)
			arr.push($6.value)
		} else {
			arr.push($6.value)
		}
		contador++;
		$$ = ast.Node(contador,"Funcion",arr,null)

}
;

funcDec: dosPuntos types curlyBraceOpen STMT curlyBraceClose
		{
			contador++;
			var type = ast.Leaf(contador,$2)
			$$ = {value:$4,type:type}
		}		
		|curlyBraceOpen STMT curlyBraceClose
		{
			$$ = {value:$2};	
		}
;

funcParam: funcParamList { $$ =$1;}	
		  |{ $$ = null; }
;

funcParamList: funcParamList comma id dosPuntos types
			   {
					contador++;
				  	var id = ast.Leaf(contador,$3);
				  	contador++;
				  	var types = ast.Leaf(contador,$5);
				  	contador++;
				  	var param = ast.Node(contador,"Parametro",id,types)
					contador++;
					$$ = ast.Node(contador,"ListaParametro",$1,param)
			   }
			  |id dosPuntos types
			  {
				  contador++;
				  var id = ast.Leaf(contador,$1);
				  contador++;
				  var types = ast.Leaf(contador,$3);
				  contador++;
				  $$ = ast.Node(contador,"Parametro",id,types)
			  }
;

STMT: STMT InstruccionI
		{ 
			contador++;
			$$ = ast.Node(contador,"Bloque",$1,$2);
		}
	 |InstruccionI        
	 { 
		contador++;
		$$ = ast.Node(contador,"Instruccion",$1,null);
	 }
;

InstruccionI: llamadaFuncion
			{ $$=$1; }
            |variables
			{ $$=$1; }
            |IF
			{ $$=$1; }
            |WHILE
			{ $$=$1; }
            |DOWHILE
			{ $$=$1; }
            |SWITCH
			{ $$=$1; }
            |FOR
			{ $$=$1; }
            |Break semicolon
			{ 
				contador++;
				$$ = ast.Leaf(contador,"Break"); 
			}
            |Continue semicolon
			{
				contador++;
				$$ = ast.Leaf(contador,"Continue"); 
			}
            |return OP
			{ 
				contador++;
				$$ = ast.Node(contador,"RETURN",$2,null);
			}
;

OP: E semicolon { $$ = $1;}
	|semicolon  { $$ = null; }
	;

IF: if bracketOpen exp bracketClose curlyBraceOpen STMT curlyBraceClose IFLAST
	{ 
		contador++;
		var Condicion = ast.Node(contador,"Condicion",$3,null)
		contador++;
		var IF_STMT = ast.Node(contador,"IF",[Condicion,$6],$8)
		$$ = IF_STMT;
	}
;

IFLAST: else IFCOND
		{ 
			contador++;
		   	$$ = ast.Node(contador,"ELSE",$2,null);
		}
	  |{ $$ = null; }
;

IFCOND: if bracketOpen exp bracketClose curlyBraceOpen STMT curlyBraceClose IFLAST
	   {
		   contador++;
		   var conditon = ast.Node(contador,"Condicion",$3,null);
		   contador++;
		   $$ = ast.Node(contador,"IF",[conditon,$6],$8)
	   }
	   |curlyBraceOpen STMT curlyBraceClose
	   {
		   $$ = $2;
	   }
;

WHILE: while bracketOpen exp bracketClose curlyBraceOpen STMT curlyBraceClose
		{
			contador++;
			var condition = ast.Node(contador,"Condicion",$3,null)
			contador++;
			$$=  ast.Node(contador,"WHILE",condition,$6)
		}
;

DOWHILE: do curlyBraceOpen STMT curlyBraceClose while bracketOpen exp bracketClose semicolon
		{
			contador++;
			var condition = ast.Node(contador,"Condicion",$7,null)
			contador++;
			$$ =  ast.Node(contador,"DOWHILE",$3,condition)
		}
;

SWITCH: switch bracketOpen exp bracketClose curlyBraceOpen FIRSTCASE LASTCASE curlyBraceClose
		{
			contador++;
			var param = [];
			param.push($3);
			if($6 != null) {
				param.push($6)
			}
			if($7 != null) {
				param.push($7)
			}
			$$ = ast.Node(contador,"SWITCH",param,null)
		}
;

FIRSTCASE: CASE {$$ =$1; }
		  | { $$ = null; }
;

CASE: CASE case exp dosPuntos STMT
	 {
		contador++;
		var caseT = ast.Node(contador,"CASE",$3,$5);
		contador++;
		$$ = ast.Node(contador,"CaseList",$1,caseT);
	 }
	 |case exp dosPuntos STMT
	 {
		contador++;
		$$ = ast.Node(contador,"CASE",$2,$4);
	 }
;

LASTCASE: DEFCASE ENDCASE
	{
		$$ = $1;
	}
;

DEFCASE: default dosPuntos STMT
{
	contador++;
	$$ = ast.Node(contador,"DEFAULT",$3,null)
}
;

ENDCASE: CASE { $$ = $1; }
		|{ $$ = null; }
;


FOR: for bracketOpen let id igual exp semicolon exp semicolon id asignLast bracketClose curlyBraceOpen STMT curlyBraceClose
	{
		contador++;
		var dect = ast.Leaf(contador,"let");
		contador++;
		var id = ast.Leaf(contador,$4);
		contador++;
		var igual = ast.Leaf(contador,"=");
		var asign = [dect,id,igual,$6]
		
		contador++;
		var asignacion = ast.Node(contador,"ASIGNACION",asign,null);
		
		contador++;
		var condicion = ast.Node(contador,"CONDICION",$8,null);
		
		var arr = [];
		arr.push(asignacion)
		arr.push(condicion)
		
		if($11.hasOwnProperty("varlast")) {
			contador++;
			var id = ast.Leaf(contador,$10);
			if($11.value.length == 2) {
				contador++;
				var inc = ast.Node(contador,$11.value[0],id,$11.value[1])
				arr.push(inc)
			} else {
				contador++;
				var inc = ast.Node(contador,$11.value[0],id,null);
				arr.push(inc)
			}
			
		} else {
			contador++;
			var id = ast.Leaf(contador,$10);
			if($11.value.length == 2) {
				contador++;
				var inc = ast.Node(contador,$11.value[0],id,$11.value[1])
				arr.push(inc)
			} else {
				contador++;
				var inc = ast.Node(contador,$11.value[0],id,null);
				arr.push(inc)
			}
		}
		arr.push($14)
		contador++;
		$$ = ast.Node(contador,"FOR",arr,null)
		
	}
	|for bracketOpen exp igual exp semicolon exp semicolon id asignLast bracketClose curlyBraceOpen STMT curlyBraceClose
	{
		
		
		contador++;
		var igual = ast.Leaf(contador,"=");

		var asign = [$3,igual,$5]
		
		contador++;
		var asignacion = ast.Node(contador,"ASIGNACION",asign,null);
		
		contador++;
		var condicion = ast.Node(contador,"CONDICION",$7,null);
		
		var arr = [];
		arr.push(asignacion)
		arr.push(condicion)
		
		if($10.hasOwnProperty("varlast")) {
			contador++;
			var id = ast.Leaf(contador,$9);
			arr.push(id)
			arr.push($10.varlast)
		} else {
			contador++;
			var id = ast.Leaf(contador,$9);
			if($10.value.length == 2) {
				contador++;
				var inc = ast.Node(contador,$10.value[0],id,$10.value[1])
				arr.push(inc)
			} else {
				contador++;
				var inc = ast.Node(contador,$10.value[0],id,null);
				arr.push(inc)
			}
		}
		arr.push($13)
		contador++;
		$$ = ast.Node(contador,"FOR",arr,null)
	}
	|for bracketOpen exp semicolon exp semicolon id asignLast bracketClose curlyBraceOpen STMT curlyBraceClose
	{
		
		
		contador++;
		var asignacion = ast.Node(contador,"ASIGNACION",$3,null);
		
		contador++;
		var condicion = ast.Node(contador,"CONDICION",$5,null);
		
		var arr = [];
		arr.push(asignacion)
		arr.push(condicion)
		
		if($8.hasOwnProperty("varlast")) {
			contador++;
			var id = ast.Leaf(contador,$7);
			arr.push(id)
			arr.push($8.varlast)
		} else {
			contador++;
			var id = ast.Leaf(contador,$7);
			
			if($8.value.length == 2) {
				contador++;
				var inc = ast.Node(contador,$8.value[0],id,$8.value[1])
				arr.push(inc)
			} else {
				contador++;
				var inc = ast.Node(contador,$8.value[0],id,null);
				arr.push(inc)
			}
		}
		arr.push($11)
		contador++;
		$$ = ast.Node(contador,"FOR",arr,null)
	}
	|for bracketOpen let id forOP exp bracketClose curlyBraceOpen STMT curlyBraceClose
	{
		contador++;
		var dec = ast.Leaf(contador,"let")
		contador++;
		var id = ast.Leaf(contador,$4)
		contador++;
		var forOP = ast.Leaf(contador,$5)
		var arr = []
		arr.push(dec)
		arr.push(id)
		arr.push(forOP)
		arr.push($6)
		arr.push($9)
		contador++;
		$$ = ast.Node(contador,"FOR",arr,null)


	}
	|for bracketOpen exp forOP exp bracketClose curlyBraceOpen STMT curlyBraceClose
	{
		
		
		contador++;
		var forOP = ast.Leaf(contador,$4)
		var arr = []
		arr.push($3)
		arr.push(forOP)
		arr.push($5)
		arr.push($8)
		contador++;
		$$ = ast.Node(contador,"FOR",arr,null)
	}
;

forOP: in { $$ = $1; }
	  |of { $$ = $1; }
;

defVarLast: comma defVarLastP
			{
				contador++;
				var comma = ast.Leaf(contador,",");
				contador++;
				$$ = ast.Node(contador,"defVar",comma,$2);
			}
			|{$$=null;}
;

defVarLastP: defVarLastP comma id defLast
			{
				var result;
				contador++;
				var comma = ast.Leaf(contador,",");
				contador++;
				var id = ast.Leaf(contador,$3);
				if($4 == null){
					result = ast.Node(contador,"defVarList",[$1,comma,id],null)
				} else {
					if($4.hasOwnProperty("type")) {
						contador++;
						var par3 = ast.Leaf(contador,$4.type);
						contador++;
						result = ast.Node(contador,"defVarList",[$1,comma,id,par3,$4.value],null);
					} else {
						contador++;
						result = ast.Node(contador,"defVarList",[$1,comma,id,$4.value],null);
					}
				}
				$$ = result;
			}
			|id defLast
			{
				var result;
				contador++;
				var id = ast.Leaf(contador,$1);
				if($2 == null) {
					result = ast.Node(contador,"defVarList",id,null)
				} else {
					if($2.hasOwnProperty("type")) {
						contador++;
						var par3 = ast.Leaf(contador,$2.type);
						contador++;
						result = ast.Node(contador,"defVarList",[id,par3,$2.value],null);
					} else {
						contador++;
						result = ast.Node(contador,"defVarList",[id,$2.value],null);
					}
				}
				$$ = result;
			}
;

variables: defType id defLast defVarLast semicolon
            {
				contador++;
				var decType = ast.Leaf(contador,$1);
				contador++;
				var id = ast.Leaf(contador,$2);

				var result;
				if($3 == null) {
					contador++;
					result = ast.Node(contador,"Asignacion",[decType,id],$4);
				} else {
					var par3;
					if($3.hasOwnProperty("type")) {
						contador++;
						par3 = ast.Leaf(contador,$3.type);
						contador++;
						result = ast.Node(contador,"Asignacion",[decType,id,par3,$3.value],$4);
					} else {
						contador++;
						result = ast.Node(contador,"Asignacion",[decType,id,$3.value],$4);
					}
					$$ = result;
				}
			}
		  |id asignLast semicolon
		  {	
			  var r;
			  if($2.value.length == 2) {
				  	contador++;
					var id;
					if($2.hasOwnProperty("varlast")) {
						id = ast.Leaf(contador,$1);
						id = [id,$2.varlast];
						console.log(id)
					} else {
			  			id = ast.Leaf(contador,$1);
					}
					contador++;
					r = $$ = ast.Node(contador,$2.value[0],id,$2.value[1]);
			  } else {
				  contador++;
					var id;
					if($2.hasOwnProperty("varlast")) {
						id = ast.Leaf(contador,$1);
						id = [id,$2.varlast];
						console.log(id)
					} else {
			  			id = ast.Leaf(contador,$1);
					}
					contador++;
					r = $$ = ast.Node(contador,$2.value[0],id,null);
			  
			  }
			 $$ = r;
		  }
		  |id asignLast
		  {
			var r;
			  if($2.value.length == 2) {
				  	contador++;
					var id;
					if($2.hasOwnProperty("varlast")) {
						id = ast.Leaf(contador,$1);
						id = [id,$2.varlast];
						console.log(id)
					} else {
			  			id = ast.Leaf(contador,$1);
					}
					contador++;
					r = ast.Node(contador,$2.value[0],id,$2.value[1]);
			  } else {
				  contador++;
					var id;
					if($2.hasOwnProperty("varlast")) {
						id = ast.Leaf(contador,$1);
						id = [id,$2.varlast];
						console.log(id)
					} else {
			  			id = ast.Leaf(contador,$1);
					}
					contador++;
					r = $$ = ast.Node(contador,$2.value[0],id,null);
			  
			  }
			 $$ = r;
		  }
;


asignLast: varLast asignLastF
			{
				$2.varlast = $1;
				$$ = $2;
			}
		 | asignLastF
		 {
			$$ =$1;
		 }
;

varLast: sqBracketOpen exp sqBracketClose  auxP
        { 
			contador++;
			var p1 = ast.Leaf(contador,"corchete Abre");
			contador++;
			var p2 = ast.Leaf(contador,"corchete cierra");
			contador++;
			$$ = ast.Node(contador,"varLast",[p1,$2,p2],$4)
			
		}
		| point id  auxP
        { 
			contador++;
			var pi = ast.Leaf(contador,$1+$2);
			contador++;
			$$ = ast.Node(contador,"varLast",pi,$3)
		}
;
		
auxP:varLast { $$ = $1;}
	| { $$ = null;}
	;

asignLastF:  igual E
			{	
				$$ = {value:[$1,$2]}
			}
			|masIgual E
			{	
				$$ = {value:[$1,$2]}
			}
			|menosIgual E
			{	
				$$ = {value:[$1,$2]}
			}
			|porIgual E
			{	
				$$ = {value:[$1,$2]}
			}
			|divisionIgual E
			{	
				$$ = {value:[$1,$2]}
			}
			|increment
			{
				$$={value:[$1]}
			}	
			|decrement
			{
				$$={value:["'--'"]}
			}
;

parsObj: objType {$$ = $1;}
		|{$$ = null;}
;

objType: objType opkv keyvalueT
		{
			contador++;
			$$ = ast.Node(contador,"ListType",$1,$3);
		}
		|keyvalueT {$$ =$1;}
;


opkv: comma      {$$ = $1;}
	 | semicolon {$$ = $1;}
;

keyvalueT: id dosPuntos types
		{
			contador++;
			var id = ast.Leaf(contador,$1);
			contador++;
			var types = ast.Leaf(contador,$3);
			contador++;
			$$ = ast.Node(contador,"KeyValue",id,types);
		}
;

defType: let   { $$ = $1; }
	    |const { $$ = $1; }
;

defLast: dosPuntos types igual E 
		{
			$$ = {value:$4,type:$2}
		}
        | igual E { 
			$$ = {value:$2}
		}
        | { $$ = null; }
;

types: number  typesList
	   {
		   $$ = $2 + $1;
	   }
      |boolean typesList
	  {
		   $$ = $2 + $1;
	  }
      |string  typesList
	  {
		   $$ = $2 + $1;
	   }
      |void  typesList
	  {
		  $$ = $2 + $1;
	   }
      |id  typesList
	  {
		   $$ = $2 + $1;
	   }
;

typesList: typesL  { $$ = "arreglo de dimension " + $1+ " " ; }
		  |{ $$ = ""; }
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

E: exp {
			contador++;
			$$ =  ast.Node(contador,"E",$1,null);
		}
	| curlyBraceOpen objetoParam curlyBraceClose
	{
		contador++;
		var curlyO = ast.Leaf(contador,"\"{\"");
		contador++;
		var curlyC = ast.Leaf(contador,"\"}\"");
		var arr = []
		arr.push(curlyO)
		if($2 != null) {
			arr.push($2)
		}
		arr.push(curlyC)
		contador++;
		var obj = ast.Node(contador,"OBJETO",arr,null);
		contador++;
		$$ = ast.Node(contador,"E",obj,null)
	}
	;

exp:  exp mas exp
	{ 
		contador++;
		var e =  ast.Node(contador,"+",$1,$3);
		contador++;
		$$ = ast.Node(contador,"exp",e,null)
	}
	| exp menos exp
	{ 
		contador++;
		var e =  ast.Node(contador,"'-'",$1,$3);
		contador++;
		$$ = ast.Node(contador,"exp",e,null)
	}
	| exp por exp
	{ 
		contador++;
		var e =  ast.Node(contador,"*",$1,$3);
		contador++;
		$$ = ast.Node(contador,"exp",e,null)
	}
	| exp division exp
	{ 
		contador++;
		var e =  ast.Node(contador,"/",$1,$3);
		contador++;
		$$ = ast.Node(contador,"exp",e,null)
	}
	| menos exp %prec unary
	{
		contador++;
		var e =  ast.Node(contador,"'-'",$2,null);
		contador++;
		$$ = ast.Node(contador,"exp",e,null)
	}
	| exp potencia exp
	{ 
		contador++;
		var e =  ast.Node(contador,"**",$1,$3);
		contador++;
		$$ = ast.Node(contador,"exp",e,null)
	}
	| exp modulo exp
	{ 
		contador++;
		var e =  ast.Node(contador,"%",$1,$3);
		contador++;
		$$ = ast.Node(contador,"exp",e,null)
	}
	| exp mayorque exp
	{ 
		contador++;
		var e =  ast.Node(contador,">",$1,$3);
		contador++;
		$$ = ast.Node(contador,"exp",e,null)
	}
	| exp menorque exp
	{ 
		contador++;
		var e =  ast.Node(contador,"<",$1,$3);
		contador++;
		$$ = ast.Node(contador,"exp",e,null)
	}
	| exp mayorigualque exp
	{ 
		contador++;
		var e =  ast.Node(contador,">=",$1,$3);
		contador++;
		$$ = ast.Node(contador,"exp",e,null)
	}
	| exp menorigualque exp
	{ 
		contador++;
		var e =  ast.Node(contador,"<=",$1,$3);
		contador++;
		$$ = ast.Node(contador,"exp",e,null)
	}
	| exp igualdad exp
	{ 
		contador++;
		var e =  ast.Node(contador,"==",$1,$3);
		contador++;
		$$ = ast.Node(contador,"exp",e,null)
	}
	| exp diferencia exp
	{ 
		contador++;
		var e =  ast.Node(contador,"!=",$1,$3);
		contador++;
		$$ = ast.Node(contador,"exp",e,null)
	}
	| exp and exp
	{ 
		contador++;
		var e =  ast.Node(contador,"&&",$1,$3);
		contador++;
		$$ = ast.Node(contador,"exp",e,null)
	}
	| exp or exp
	{ 
		contador++;
		var e =  ast.Node(contador,"||",$1,$3);
		contador++;
		$$ = ast.Node(contador,"exp",e,null)
	}
	| not exp
    { 
		contador++;
		var e =  ast.Node(contador,"!",$2,null);
		contador++;
		$$ = ast.Node(contador,"exp",e,null)
	}
	| bracketOpen exp bracketClose
	{
		contador++;
		parA = ast.Leaf(contador,"Parentesis Abre")
		contador++;
		parC = ast.Leaf(contador,"Parentesis Cierra")
		contador++;
		$$ = ast.Node(contador,"exp",[parA,$2,parC],null)
	}
	| exp question exp dosPuntos exp
	{	
		contador++;
		var e1 = ast.Node(contador,"?",$3,null);
		contador++;
		var e2 = ast.Node(contador,":",$5,null);
		contador++;
		$$ = ast.Node(contador,"OperadorTernario",[$1,e1,e2],null)
	}
	| exp increment
	{
		contador++;
		var inc = ast.Node(contador,"++",$1,null)
		contador++;
		$$ = ast.Node(contador,"exp",inc,null)
	}
	| exp decrement
	{
		contador++;
		var dec = ast.Node(contador,"'--'",$1,null)
		contador++;
		$$ = ast.Node(contador,"exp",dec,null)
	}
	| NUMBER
    { 
		contador++;
		$$ = ast.Leaf(contador,$1);
	}
	| STRING
    { 
		contador++;
		$$ = ast.Leaf(contador,$1);
	}
	| true
    { 
		contador++;
		$$ = ast.Leaf(contador,"true");
	}
	| false
    { 
		contador++;
		$$ = ast.Leaf(contador,"false");
	}
	| null
    { 
		contador++;
		$$ = ast.Leaf(contador,"null");
	}
    | new id bracketOpen exp bracketClose
	{   
        
        contador++;
		var exp = ast.Node(contador,"exp",$4,null)
		contador++;
		var id = ast.Leaf(contador,$2)
        contador++;
		$$ = ast.Node(contador,"newArray",id,exp)

	}
	| id varLast
	{
		contador++;
		var id = ast.Leaf(contador,$1);
		contador++;
		$$ = ast.Node(contador,"exp",id,$2)
	}
	| id
	{ 
		contador++;
		$$ = ast.Leaf(contador,$1);
	}
	| id PL bracketOpen paramFunc bracketClose
	{
		contador++;
		var id = ast.Leaf(contador,$1);
		contador++;
		var bkOp = ast.Leaf(contador,"ParentesisAbre")
		contador++;
		var bkC = ast.Leaf(contador,"ParentesisCierra")
		var arr = [];
		arr.push(id)
		if($2!=null) {
			arr.push($2)
		}
		arr.push(bkOp)
		if($4) {
			arr.push($4)
		}
		arr.push(bkC)
		contador++;
		$$ = ast.Node(contador,"LlamadaFuncion",arr,null);
		

	}
	| sqBracketOpen arrParam sqBracketClose
	{
		contador++;
		var sqBO = ast.Leaf(contador,"corcheteA")
		contador++;
		var sqBC = ast.Leaf(contador,"corcheteC")
		contador++;
		var arr = [];
		arr.push(sqBO)
		if($2 != null) {
			arr.push($2)
		}
		arr.push(sqBC)
		$$ = ast.Node(contador,"exp",arr,null)
	}
;

arrParam: listArrParam { $$ = $1; }
		 |{$$ = null;}
;

listArrParam: listArrParam comma E
			   {
				   contador++;
				   var comma = ast.Leaf(contador,",");
				   
				   contador++;
				   $$ = ast.Node(contador,"ListaArreglos",[$1,comma,$3],null)
			   }
			|E {$$=$1; }
;

objetoParam: objetoParamList { $$ = $1; }
			|                {$$= null;}
;

objetoParamList: objetoParamList opkv keyvalue
				{
					contador++;
					$$ = ast.Node(contador,"ListaObjeto",$1,$3);
				}
		  		|keyvalue
				{ $$ =$1; }
;

keyvalue: id dosPuntos E
	{
		contador++;
		var id = ast.Leaf(contador,$1)
		contador++;
		$$ = ast.Node(contador,"KeyValue",id,$3)
	}
;