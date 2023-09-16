

export abstract class ValidarRutUtil{

    /**
     * Función que implementa algoritmo de validación para validar un rut chileno.
     * @param {string }rut Rut seleccionado desde formulario.
     * @returns {boolean} Dato booleano que verifica si rut es válido o no.
     */
    public static validarRut(rut : string) : boolean{

        const digitoVerificador : string = rut.split("-")[1];

        // Algoritmo de validación de rut chileno
        //1) Se toman todos los números del RUT (sin el digito verificador)

        rut = rut.split("-")[0];

        //2) Se da vuelta esa cifra, es decir, reordenamos los números comenzando de derecha a izquierda.

        let rutSplit : string[] = rut.split("");

        rutSplit = rutSplit.filter(char=>char!='.'); //limpiar puntos

        rutSplit = rutSplit.reverse();

        rut = rutSplit.join("");

        //3) Ahora multiplicaremos cada uno de estos números por la siguiente serie: 2, 3, 4, 5, 6, 7 y si se acaba la serie, volvemos a empezar 2, 3, 4...
        // y sumamos todos los resultados

        const serie : number[] = [2,3,4,5,6,7,2,3,4,5,6,7];

        let resultadoPasoTres : number = 0;
        let indiceSerie : number = 0;

        for(let char of rut){

        resultadoPasoTres += (+char * serie[indiceSerie])
        indiceSerie++;

        }

        //4) El resultado obtenido lo dividimos por 11, para luego obter el Resto de esa división.
        //Tomamos el resultado sin decimales y sin aproximación, y lo multiplicamos por 11

        const resultadoDivisionSinDecimal : number = Math.trunc(resultadoPasoTres/11);

        const resultadoPasoCuatro : number = resultadoDivisionSinDecimal * 11;

        //5) Posteriormente, al resultado del paso 3 le restamos el resultado obtenido anteriormente.

        const resultadoPasoCinco : number = resultadoPasoTres - resultadoPasoCuatro;

        //6) Y para finalizar, a 11 le restamos el resultado anterior:

        const digitoVerificadorValidado : number = 11 - resultadoPasoCinco;

        //7) Si como resultado final del digito verficador nos da el número 11, el dígito verificador será 0 y si es 10 el dígito será la letra K.

        let digitoVerificadorString;

        if(digitoVerificadorValidado == 11){

            digitoVerificadorString = "0";
        }

        else if(digitoVerificadorValidado == 10){

            digitoVerificadorString = "K";

        }else{

            digitoVerificadorString = digitoVerificadorValidado.toString();

        }

        if(digitoVerificador == 'k'){

            return digitoVerificador.toUpperCase() == digitoVerificadorString;
        }

        return digitoVerificador == digitoVerificadorString;
    }

    }



