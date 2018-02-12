// Variable para obtener el formulario
var doc = document,
form = doc.getElementById( 'form' );

form.addEventListener( 'submit', function( event ) {
	// La funcion preventDefault() evita que el formulario se envie, en este caso
	// la utilizamos porque no estamos enviado informacion a ninguna DB
	event.preventDefault();

	var nombres = doc.getElementById( 'nombres' ).value,
	apellidos = doc.getElementById( 'apellidos' ).value,
	dia = doc.getElementById( 'dia' ),
	mes = doc.getElementById( 'mes' ),
	anio = doc.getElementById( 'anio' ).value,
	nacimiento = anio + '-' + mes.options[mes.selectedIndex].value + '-' + dia.options[dia.selectedIndex].value,
	edad = obtenerEdad( nacimiento );

	var datosUsuario = new Array();

	console.log( edad );
})

// Funcion para obtener edad segun la fecha de nacimiento, recibe los siguientes
// parametros: El parametro 'fecha' debe ser un string con la fecha en
// el siguiente formato: 'anio-mes-dia' Ej: '1993-1-22'
function obtenerEdad( fecha ) {
	var fechaNacimiento = new Date( fecha );
	// La funcion Math.floor() redondea el numero hacia abajo, para que cuando
	// la edad sea 25 años y 9 meses por ejemplo, muestre 25
	// Date.now() equivale a la fecha actual
	// El numero '31557600000' equivale a 1000.020534 anio en segundos

	// Se resta la fecha actual y la fecha de nacimiento, luego se divide entre
	// 1000 anios
	return Math.floor( ( Date.now() - fechaNacimiento ) / ( 31557600000 ) );
}


// Funcion para hacer un bucle y repetir el evento 'change' en cada uno de los
// inputs para mostrar u ocultar campos extras, recibe los siguientes
// parametros: El parametro 'obj' debe ser una lista de nodos o un arreglo y
// el parametro 'id' debe ser el id del div que se desea mostrar u ocultar
function mostrarCamposExtras( obj, id ) {
	// Hago un bucle a la lista de nodos 'obj' para poder agregar el evento
	// 'change' a los dos inputs y verificar cual esta seleccionado
	obj.forEach( function( el, index ) {
		// Agrego el evento 'change' a cada input
		el.addEventListener( 'change', function() {
			// Verifico cual input esta seleccionado y cambio la propiedad
			// 'display' del div que contiene los campos estras
			if ( parseInt( el.value ) ) {
				document.getElementById( id ).style.display = 'block';
			} else {
				document.getElementById( id ).style.display = 'none';
			}
		});
	});
}

// -------------------------------------------------------------------------
// Oculta o Muestra los campos extras con la funcion mostrarCamposExtras( obj, id );
// -------------------------------------------------------------------------
// Las siguientes variables retornan una lista de nodos con varios elementos,
// en este caso son los dos input[type="radio"] de las opciones 'Si' ó 'No'
// de los campos de cónyuge e hijos
var tieneConyuge = document.querySelectorAll( 'input[name="conyuge"]' ),
tieneHijos = document.querySelectorAll( 'input[name="hijos"]' );

mostrarCamposExtras( tieneConyuge, 'fecha-conyuge-input' );
mostrarCamposExtras( tieneHijos, 'cantidad-hijos-input' );