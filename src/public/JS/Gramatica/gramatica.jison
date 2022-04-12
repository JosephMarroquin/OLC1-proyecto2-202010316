//Definiendo analisis lexico
%lex

%options case-insensitive

%%

\s+             // se ignoran los espacios en blanco
"//".*          // comentarios de simple linea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]   //comentarios multilineas

//Definir las palabras reservadas

"true"          return 'Tok_true'
"false"             return 'Tok_false'
"if"                return 'Tok_if'
"print"             return 'Tok_print' 
"println"           return 'Tok_println' 
"else"              return 'Tok_else'  
"while"             return 'Tok_while' 
"do"                return 'Tok_do'
"tolower"           return 'Tok_toLower'
"toupper"           return 'Tok_toupper'

//Definir tipos de datos

"int"       return 'Tok_TD_int'
"double"    return 'Tok_TD_double'
"boolean"   return 'Tok_TD_boolean'
"char"      return 'Tok_TD_char'
"string"    return 'Tok_TD_string'

//Simbolos

">="                return 'Tok_mayori'
"<="                return 'Tok_menori'
"=="                return 'Tok_igual'
";"                 return 'Tok_pyc'
","                 return 'Tok_coma'
"="                 return 'Tok_asigna1'
"["                 return 'Tok_cor1'
"]"                 return 'Tok_cor2'
"("                 return 'Tok_par1'
")"                 return 'Tok_par2'
"{"                 return 'Tok_llav1'
"}"                 return 'Tok_llav2'
"-"                 return 'Tok_menos'
"!="                return 'Tok_diferente'
"!"                 return 'Tok_not'
"^"                return 'Tok_pot'
"*"                 return 'Tok_por'
"/"                 return 'Tok_div'
"%"                 return 'Tok_mod'
"+"                 return 'Tok_mas'
">"                 return 'Tok_mayor'
"<"                 return 'Tok_menor'
"&&"                 return 'Tok_and'
"||"                 return 'Tok_or'

//Expresiones regulares

[\"]("\\n"|"\\r"|"\\t"|"\\'"|"\\\""|"\\\\"|[^\"])*[\"]  { yytext = yytext.substr(1,yyleng-2); return 'Tok_string'; }

[\']("\\n"|"\\r"|"\\t"|"\\'"|"\\\""|"\\\\"|[^\'])[\'] { yytext = yytext.substr(1,yyleng-2); return 'Tok_char'; }

([0-9])+(["."])([0-9])+   return 'Tok_numero';

([a-zA-Z_])[a-zA-Z0-9_]* return 'Tok_ID';

[0-9]+                return 'ENTERO';

<<EOF>>				return 'EOF';
.					{ console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
                                          L_Error.getInstance().insertar(new N_Error("Lexico","Caracter: \" "+yytext+"\" no es valido" ,yylloc.first_line,yylloc.first_column));
                                          return null; }

/lex

//Definir el codigo
// Todo codigo javascript, que necesitemos incluir
%{
    function AST_Node(tag,value,fila,columna){
        this.tag=tag;
        this.value=value;
        this.fila=fila;
        this.columna=columna;
        //Vamos a definir que tenga hijos
        this.childs=[]
        this.addChilds=addChilds;
        this.getSon=getSon;
        function addChilds(){
            for(var i =0; i< arguments.length;i++){
                this.childs.push(arguments[i]);
                if(arguments[i]!==null){
                    arguments[i].padre=this;
                }
            }
        }
        function getSon(pos){
            if(pos >this.hijos.length - 1)return null;
            return this.hijos[pos];
        }
    }
%}

// Precedencia de operadores

%right 'Tok_asigna1'
%left  'Tok_or'
%left  'Tok_and'
%left  'Tok_igual' 'Tok_igualr' 'Tok_diferente'
%nonassoc  'Tok_mayor' 'Tok_menor' 'Tok_menori' 'Tok_mayori'
%left  'Tok_mas' 'Tok_menos'
%left  'Tok_por' 'Tok_div' 'Tok_mod'
%nonassoc 'Tok_pot'
%right 'Tok_not' 
%left UMENOS

//Iniciando la gramatica

//Indicamos la produccion inicial

%start S

%%

//$$    $1
S: SENTENCIAS EOF {$$=new AST_Node("RAIZ","RAIZ",this.$first_line,@1.last_column);$$.addChilds($1);return $$} ;


SENTENCIAS: SENTENCIAS SENTENCIA {$1.addChilds($2);$$=$1;}

            | SENTENCIA{$$= new AST_Node("SENTENCIAS","SENTENCIAS",this._$.first_line,@1.last_column);
                      $$.addChilds($1);} ;

SENTENCIA: DECLARACION Tok_pyc{$$=$1}
           |ASIGNACION Tok_pyc{$$=$1}
           |DECLARACIONyASIGNACION Tok_pyc{$$=$1}
           |BLOQUE{$$=$1}
           |IF{$$=$1}
           |WHILE{$$=$1}
           |DO_WHILE Tok_pyc{$$=$1}
           |PRINT{$$=$1}
           |PRINTLN{$$=$1}
           ;


DECLARACIONyASIGNACION: Tok_TD_int ID_LIST Tok_asigna1 EXP {$$=new AST_Node("DECLARACIONyASIGNACION","DECLARACIONyASIGNACION",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($2,$4,$1);}
                        |Tok_TD_double ID_LIST Tok_asigna1 EXP {$$=new AST_Node("DECLARACIONyASIGNACION","DECLARACIONyASIGNACION",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($2,$4,$1);}
                        |Tok_TD_boolean ID_LIST Tok_asigna1 EXP {$$=new AST_Node("DECLARACIONyASIGNACION","DECLARACIONyASIGNACION",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($2,$4,$1);}
                        |Tok_TD_string ID_LIST Tok_asigna1 EXP {$$=new AST_Node("DECLARACIONyASIGNACION","DECLARACIONyASIGNACION",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($2,$4,$1);}
                        |Tok_TD_char ID_LIST Tok_asigna1 EXP {$$=new AST_Node("DECLARACIONyASIGNACION","DECLARACIONyASIGNACION",this._$.first_line,@1.last_column);
                                                                   $$.addChilds($2,$4,$1);}
;

DECLARACION: Tok_TD_int ID_LIST  {$$= new AST_Node("DECLARACION","DECLARACION",this._$.first_line,@1.first_column); $$.addChilds($2,$1)}
            |Tok_TD_double ID_LIST  {$$= new AST_Node("DECLARACION","DECLARACION",this._$.first_line,@1.first_column); $$.addChilds($2,$1)}
            |Tok_TD_boolean ID_LIST  {$$= new AST_Node("DECLARACION","DECLARACION",this._$.first_line,@1.first_column); $$.addChilds($2,$1)}
            |Tok_TD_string ID_LIST  {$$= new AST_Node("DECLARACION","DECLARACION",this._$.first_line,@1.first_column); $$.addChilds($2,$1)}
            |Tok_TD_char ID_LIST  {$$= new AST_Node("DECLARACION","DECLARACION",this._$.first_line,@1.first_column); $$.addChilds($2,$1)}
;

ID_LIST: ID_LIST Tok_coma Tok_ID {$1.addChilds(new AST_Node("ID",$3,this._$.first_line,@3.first_column)); $$=$1;}
        | Tok_ID {$$= new AST_Node("ID_LIST","ID_LIST"); $$.addChilds(new AST_Node("ID",$1,this._$.first_line,@1.first_column))}
        ;
   
ASIGNACION: ID_LIST Tok_asigna1 EXP {$$=new AST_Node("ASIGNACION","ASIGNACION",this._$.first_line,@1.last_column); 
                                            $$.addChilds($1,$3);}
            ;

BLOQUE: Tok_llav1 SENTENCIAS Tok_llav2{$$= new AST_Node("BLOQUE","BLOQUE",this._$.first_line,@1.last_column); $$.addChilds($2)}
        |Tok_llav1 Tok_llav2{$$= new AST_Node("BLOQUE","BLOQUE",this._$.first_line,@1.last_column);};


IF: Tok_if Tok_par1 EXP Tok_par2 BLOQUE    {$$= new AST_Node("IF","IF",this._$.first_line,@1.last_column);$$.addChilds($3,$5)}
    |Tok_if Tok_par1 EXP Tok_par2 BLOQUE Tok_else BLOQUE {$$= new AST_Node("IF","IF",this._$.first_line,@1.last_column); var aux = new AST_Node("ELSE","ELSE",this._$.first_line,@6.last_column); aux.addChilds($7);$$.addChilds($3,$5,aux)};

WHILE: Tok_while Tok_par1 EXP Tok_par2 BLOQUE{$$=new AST_Node("WHILE","WHILE",this._$.first_line,@1.last_column); $$.addChilds($3,$5)};


DO_WHILE: Tok_do BLOQUE Tok_while Tok_par1 EXP Tok_par2 {$$=new AST_Node("DO_WHILE","DO_WHILE",this._$.first_line,@1.last_column);$$.addChilds($2,$5)};


PRINT: Tok_print Tok_par1 EXP Tok_par2 Tok_pyc {$$= new AST_Node("PRINT","PRINT",this._$.first_line,@1.last_column); $$.addChilds($3);};

PRINTLN: Tok_println Tok_par1 EXP Tok_par2 Tok_pyc {$$= new AST_Node("PRINTLN","PRINTLN",this._$.first_line,@1.last_column); $$.addChilds($3);};


EXP: EXP Tok_mas EXP                    {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_menos EXP                  {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_por EXP                    {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_div EXP                    {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_pot EXP                    {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_mod EXP                    {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_diferente EXP              {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_igual EXP                  {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_igualr EXP                 {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_mayor EXP                  {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_menor EXP                  {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_mayori EXP                 {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_menori EXP                 {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_and EXP                    {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |EXP Tok_or EXP                     {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds($1,new AST_Node("op",$2,this._$.first_line,@2.last_column),$3);}
    |Tok_not EXP                        {$$= new AST_Node("EXP","EXP",this._$.first_line,@2.last_column);$$.addChilds(new AST_Node("op",$1,this._$.first_line,@1.last_column),$2);}
    |Tok_par1 EXP Tok_par2              {$$=$2}
    |Tok_menos ENTERO %prec UMENOS      {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("entero",$2*-1,this._$.first_line,@1.last_column));}
    |Tok_menos Tok_numero %prec UMENOS  {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("decimal",$2*-1,this._$.first_line,@1.last_column));}
    |Tok_menos Tok_true %prec UMENOS    {L_Error.getInstance().insertar(new N_Error("Semantico","No esta permitida la negacion unario en esta expresion" ,this._$.first_line,@1.last_column));}
    |Tok_menos Tok_false %prec UMENOS   {L_Error.getInstance().insertar(new N_Error("Semantico","No esta permitida la negacion unario en esta expresion" ,this._$.first_line,@1.last_column));}
    |Tok_menos Tok_string %prec UMENOS  {L_Error.getInstance().insertar(new N_Error("Semantico","No esta permitida la negacion unario en esta expresion" ,this._$.first_line,@1.last_column));}
    |Tok_menos Tok_char %prec UMENOS    {L_Error.getInstance().insertar(new N_Error("Semantico","No esta permitida la negacion unario en esta expresion" ,this._$.first_line,@1.last_column));}
    |Tok_string                         {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);
                                         var text = $1.substr(0,$1.length);
                                         text=text.replace(/\\n/g,"\n");
                                         text=text.replace(/\\t/g,"\t");
                                         text=text.replace(/\\r/g,"\r");
                                         text=text.replace(/\\\\/g,"\\");
                                         text=text.replace(/\\\"/g,"\"");
                                         text=text.replace(/\\\'/g,"\'");
                                        $$.addChilds(new AST_Node("string",text,this._$.first_line,@1.last_column));}
    |Tok_char                           {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);
                                         var text2 = $1.substr(0,$1.length);
                                         text2=text2.replace(/\\n/g,"\n");
                                         text2=text2.replace(/\\t/g,"\t");
                                         text2=text2.replace(/\\r/g,"\r");
                                         text2=text2.replace(/\\\\/g,"\\");
                                         text2=text2.replace(/\\\"/g,"\"");
                                         text2=text2.replace(/\\\'/g,"\'");
                                        $$.addChilds(new AST_Node("char",text2,this._$.first_line,@1.last_column));}
    |ENTERO                             {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("entero",$1,this._$.first_line,@1.last_column));}                                    
    |Tok_numero                         {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("decimal",$1,this._$.first_line,@1.last_column));}
    |Tok_true                           {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("true",$1,this._$.first_line,@1.last_column));}
    |Tok_false                          {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("false",$1,this._$.first_line,@1.last_column));}
    |Tok_ID                             {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);$$.addChilds(new AST_Node("id",$1,this._$.first_line,@1.last_column));}
    |Tok_toLower Tok_par1 Tok_string Tok_par2 {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);
                                               var text3 = $3.substr(0,$3.length);
                                               text3=text3.replace(/\\n/g,"\n");
                                               text3=text3.replace(/\\t/g,"\t");
                                               text3=text3.replace(/\\r/g,"\r");
                                               text3=text3.replace(/\\\\/g,"\\");
                                               text3=text3.replace(/\\\"/g,"\"");
                                               text3=text3.replace(/\\\'/g,"\'");
                                               $$.addChilds(new AST_Node("tolower",text3,this._$.first_line,@1.last_column));}
    |Tok_toupper Tok_par1 Tok_string Tok_par2 {$$= new AST_Node("EXP","EXP",this._$.first_line,@1.last_column);
                                               var text4 = $3.substr(0,$3.length);
                                               text4=text4.replace(/\\n/g,"\n");
                                               text4=text4.replace(/\\t/g,"\t");
                                               text4=text4.replace(/\\r/g,"\r");
                                               text4=text4.replace(/\\\\/g,"\\");
                                               text4=text4.replace(/\\\"/g,"\"");
                                               text4=text4.replace(/\\\'/g,"\'");
                                               $$.addChilds(new AST_Node("toupper",text4,this._$.first_line,@1.last_column));}
    ;





