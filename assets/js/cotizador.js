// Variables Globales
var doc = document,
form = doc.getElementById( 'form' );

// Evento que detecta cuando se da click en el boton 'type="submit"'
form.addEventListener( 'submit', function( event ) {
	// La funcion preventDefault() evita que el formulario se envie, en este caso
	// la utilizamos porque no queremos enviado informacion a ninguna DB ya
	// que nuestro programa corre del lado del cliente
	event.preventDefault();

	// Mostrando los datos en consola
	console.log( datos().nombres );
	console.log( datos().apellidos );
	console.log( datos().nacimiento );
	console.log( datos().edad );
	console.log( datos().conyuge );
	console.log( datos().nacimientoConyuge );
	console.log( datos().edadConyuge );
})

// Funcion que retorna todos los datos del usuario
function datos() {
	// Variables con los datos del usuario
	var _nombres = doc.getElementById( 'nombres' ).value,
	_apellidos = doc.getElementById( 'apellidos' ).value,
	_dia = doc.getElementById( 'dia' ),
	_mes = doc.getElementById( 'mes' ),
	_anio = doc.getElementById( 'anio' ).value,
	_nacimiento = _anio + '-' + _mes.options[_mes.selectedIndex].value + '-' + _dia.options[_dia.selectedIndex].value,
	_edad = obtenerEdad( _nacimiento ),
	_conyuge = doc.querySelector( 'input[name="conyuge"]:checked' ),
	_diaCon = doc.getElementById( 'dia-conyuge' ),
	_mesCon = doc.getElementById( 'mes-conyuge' ),
	_anioCon = doc.getElementById( 'anio-conyuge' ).value,
	_nacimientoCon = _anioCon + '-' + _mesCon.options[_mesCon.selectedIndex].value + '-' + _diaCon.options[_diaCon.selectedIndex].value,
	_edadCon = obtenerEdad( _nacimientoCon );

	// Validando input[type="radio"]
	_conyuge = _conyuge != null ? _conyuge.value : 0;
	_conyuge = _conyuge == '1' ? true : false;

	// Retornando todos los datos ordenados
	return {
		nombres: _nombres,
		apellidos: _apellidos,
		nacimiento: _nacimiento,
		edad: _edad,
		conyuge: _conyuge,
		nacimientoConyuge: _nacimientoCon,
		edadConyuge: _edadCon
	};
}

// Funcion para obtener edad segun la fecha de nacimiento, recibe los siguientes
// parametros: El parametro 'fecha' debe ser un string con la fecha en
// el siguiente formato: 'anio-mes-dia' Ej: '1993-1-22'
function obtenerEdad( fecha ) {
	var fechaNacimiento = new Date( fecha );
	// La funcion Math.floor() redondea el numero hacia abajo, para que cuando
	// la edad sea 25 años y 9 meses por ejemplo, muestre 25
	// Date.now() equivale a la fecha actual
	// El numero '31557600000' es el resultado de la siguiente operación:
	// milisegundos * segundos * minutos * horas * dias
	// 1000*60*60*24*365.25

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
		// Variable con una lista de nodos de todos los campos ocultos
		var camposOcultos = doc.getElementById( id ).querySelectorAll( 'select, input' );
		// Agrego el evento 'change' a cada input
		el.addEventListener( 'change', function() {
			// Verifico cual input esta seleccionado y cambio la propiedad
			// 'display' del div que contiene los campos estras
			if ( parseInt( el.value ) ) {
				doc.getElementById( id ).style.display = 'block';

				// Agregando el atributo 'required' a los campos cuando estan
				// visibles
				camposOcultos.forEach( function( elem, index ) {
					elem.setAttribute( 'required', true );
				});
			} else {
				doc.getElementById( id ).style.display = 'none';

				// Eliminando el atributo 'required' a los campos que
				// se ocultan
				camposOcultos.forEach( function( elem, index ) {
					elem.removeAttribute( 'required' );
				});
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