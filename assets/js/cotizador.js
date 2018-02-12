// Variables para obtener la edad del Usuario
var diaUsuario = 22,
mesUsuario = 1,
anioUsuario = 1993;

var fechaUsuario = anioUsuario + '-' + mesUsuario + '-' + diaUsuario

// Funcion para obtener edad segun la fecha de nacimiento, con el siguiente
// formato: 'anio-mes-dia' Ej: '1993-1-22'
function obtenerEdad( fechaNacimiento ) {
	var fecha = new Date( fechaNacimiento );
	// La funcion 'parseInt()' hace que se entregue como numero y no como string
	// Date.now() equivale a la fecha actual
	// El numero '31557600000' equivale a 1 anio en segundos
	// La funcion 'toFixed()' le indica al numero la cantidad de decimales va a
	// mostrar, en este caso sin decimales
	return parseInt( ( ( Date.now() - fecha ) / ( 31557600000 ) ).toFixed(0) );
}


// Funcion para no repetir codigo, el parametro 'obj' debe ser una
// lista de nodos o un arreglo y el parametro 'id' debe ser el
// id del div que se desea mostrar u ocultar
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
// Oculta o Muestra los campos estras con la funcion mostrarCamposExtras( obj, id );
// -------------------------------------------------------------------------
// La siguiente variable retorna una lista de nodos con varios elementos,
// en este caso son los dos input[type="radio"] de la opcion ¿Tiene Hijos?
var tieneConyuge = document.querySelectorAll( 'input[name="conyuge"]' ),
tieneHijos = document.querySelectorAll( 'input[name="hijos"]' );

mostrarCamposExtras( tieneConyuge, 'fecha-conyuge-input' );
mostrarCamposExtras( tieneHijos, 'cantidad-hijos-input' );