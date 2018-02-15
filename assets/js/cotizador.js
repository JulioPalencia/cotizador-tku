// Variables Globales
var doc = document,
form = doc.getElementById( 'form' ),
buttonPrint = doc.getElementById( 'imprimir' ),
popup = doc.getElementById( 'popup' ),
desglose = doc.getElementById( 'desglose' ),
comision = 0,
totalPagar = 0,
_recargoEdad = 0,
_recargoConyuge = 0,
_recargoHijos = 0,
_recargoTotal = 0;

const precioBase = 250;

// Calculando la comision
comision = precioBase * 0.30;

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

// Funcion para obtener y retorna todos los datos que el usuario coloco
// en el formulario
function datos() {
	// Variables para obtener los datos del formulario
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
	_edadCon = obtenerEdad( _nacimientoCon ),
	_hijos = doc.querySelector( 'input[name="hijos"]:checked' ),
	_cantHijos = doc.getElementById( 'cantidad-hijos' ).value;

	// Validando input[type="radio"]
	_conyuge = _conyuge != null ? _conyuge.value : 0;
	_conyuge = _conyuge == '1' ? true : false;
	_hijos = _hijos != null ? _hijos.value : 0;
	_hijos = _hijos == '1' ? true : false;

	// Validando los campos ocultos y mostrando 'N/A' si no aplica
	_nacimientoCon = !_conyuge ? 'N/A' : _nacimientoCon;
	_edadCon = !_conyuge ? 'N/A' : _edadCon;
	_cantHijos = !_hijos ? 'N/A' : parseInt( _cantHijos );

	// Retornando todos los datos ordenados
	return {
		nombres: _nombres,
		apellidos: _apellidos,
		nacimiento: _nacimiento,
		edad: _edad,
		conyuge: _conyuge,
		nacimientoConyuge: _nacimientoCon,
		edadConyuge: _edadCon,
		hijos: _hijos,
		cantidadHijos: _cantHijos
	};
}

// Función para obtener el porcentaje del recargo por edad, recibe los siguientes
// parametros: El parametro 'datos' debe ser un arreglo con los datos del
// formulario
function recargoEdad( datos ) {
	if ( datos.edad < 18 ) {
		return false;
	} else if( datos.edad >= 18 && datos.edad < 21 ) {
		return precioBase * 0;
	} else if( datos.edad >= 21 && datos.edad < 25 ) {
		return precioBase * 0.01;
	} else if( datos.edad >= 25 && datos.edad < 30  ) {
		return precioBase * 0.02;
	} else if( datos.edad >= 30 && datos.edad < 40 ) {
		return precioBase * 0.05;
	} else if( datos.edad >= 40 && datos.edad < 50 ) {
		return precioBase * 0.08;
	} else if( datos.edad >= 50 && datos.edad < 65 ) {
		return precioBase * 0.12;
	} else {
		return false;
	}
}

// Función para obtener el porcentaje del recargo por edad del conyuge, recibe
// los siguientes parametros: El parametro 'datos' debe ser un arreglo con los
// datos del formulario
function recargoEdadConyuge( datos ) {
	if ( datos.conyuge ) {
		if ( datos.edadConyuge < 30 ) {
			return precioBase * 0.01;
		} else if( datos.edadConyuge >= 30 && datos.edadConyuge < 40 ) {
			return precioBase * 0.02;
		} else if( datos.edadConyuge >= 40 && datos.edadConyuge < 50 ) {
			return precioBase * 0.03;
		} else if( datos.edadConyuge >= 50 && datos.edadConyuge < 70 ) {
			return precioBase * 0.05;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

// Función para obtener el porcentaje del recargo cor cantidad de hijos, recibe
// los siguientes parametros: El parametro 'datos' debe ser un arreglo con los
// datos del formulario
function recargoHijos( datos ) {
	if ( datos.hijos ) {
		return precioBase * ( datos.cantidadHijos / 100 );
	} else {
		return false;
	}
}

// Función para calcular el recargo total que se cobrara
function recargoTotal( edad, conyuge, hijos ) {
	var recargoTotal = 0;
	if ( edad != false ) {
		recargoTotal = recargoTotal + edad;
	}
	if ( conyuge != false ) {
		recargoTotal = recargoTotal + conyuge;
	}
	if ( hijos != false ) {
		recargoTotal = recargoTotal + hijos;
	}
	return recargoTotal;
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

// Función para mostrar y ocultar el desglose, recibe los siguientes parametros:
// El parametro 'show' es un booleano que si es true muestra el desglose y oculta
// el formulario y si es false muestra el formulario y oculta el desglose
function mostrarDesglose( show ) {
	var datos = doc.getElementById( 'datos' );

	if ( show ) {
		datos.style.display = 'none';
		desglose.style.display = 'block';
	} else {
		datos.style.display = 'block';
		desglose.style.display = 'none';
	}
}

// Funcion que imprimir los datos y el desglose de los recargos en HTML, recibe
// los siguientes parametros: El parametros 'datos' es un arreglo con los datos
// del formulario
function imprimirDesglose( datos ) {
	// Variables de los elementos HTML para imprimir el desglose
	var infoNombre = doc.getElementById( 'info-nombre' ),
	infoEdad = doc.getElementById( 'info-edad' ),
	infoConyuge = doc.getElementById( 'info-conyuge' ),
	infoEdadConyuge = doc.getElementById( 'info-edad-conyuge' ),
	infoHijos = doc.getElementById( 'info-hijos' ),
	infoCantidadHijos = doc.getElementById( 'info-cantidad-hijos' ),
	infoRecargoEdad = doc.getElementById( 'recargo-edad' ),
	infoRecargoConyuge = doc.getElementById( 'recargo-conyuge' ),
	infoRecargoHijos = doc.getElementById( 'recargo-hijos' ),
	infoRecargoComision = doc.getElementById( 'comision' ),
	infoPrecioBase = doc.getElementById( 'precio-base' ),
	infoCargos = doc.getElementById( 'cargos' ),
	infoTotalPagar = doc.getElementById( 'total-pagar' ),

	rowConyuge = doc.getElementById( 'row-edad-conyuge' ),
	rowRecargoConyuge = doc.getElementById( 'row-recargo-conyuge' ),
	rowHijos = doc.getElementById( 'row-cantidad-hijos' ),
	rowRecargoHijos = doc.getElementById( 'row-recargo-hijos' );

	// Ocultamos las opciones que no aplican en el desglose
	if ( !datos.conyuge ) {
		rowConyuge.style.display = 'none';
		rowRecargoConyuge.style.display = 'none';
	} else {
		rowConyuge.style.display = 'table-row';
		rowRecargoConyuge.style.display = 'table-row';
	}

	if ( !datos.hijos ) {
		rowHijos.style.display = 'none';
		rowRecargoHijos.style.display = 'none';
	} else {
		rowHijos.style.display = 'table-row';
		rowRecargoHijos.style.display = 'table-row';
	}

	infoNombre.innerHTML = '<p>' + datos.nombres + ' ' + datos.apellidos + '</p>';
	infoEdad.innerHTML = '<p>' + datos.edad + ' años</p>';
	infoConyuge.innerHTML = '<p>' + ( datos.conyuge ? 'Si' : 'No' ) + '</p>';
	infoEdadConyuge.innerHTML = '<p>' + datos.edadConyuge + ' años</p>';
	infoHijos.innerHTML = '<p>' + ( datos.hijos ? 'Si' : 'No' ) + '</p>';
	infoCantidadHijos.innerHTML = '<p>' + datos.cantidadHijos + '</p>';


	infoRecargoEdad.innerHTML = '<p>Q. ' + _recargoEdad.toFixed( 2 ) + '</p>';
	infoRecargoConyuge.innerHTML = '<p>' + ( _recargoConyuge ? 'Q. ' + _recargoConyuge.toFixed( 2 ) : 'N/A' ) + '</p>';
	infoRecargoHijos.innerHTML = '<p>' + ( _recargoHijos ? 'Q. ' + _recargoHijos.toFixed( 2 ) : 'N/A' ) + '</p>';
	infoRecargoComision.innerHTML = '<p>Q. ' + comision.toFixed( 2 ) + '</p>';

	infoPrecioBase.innerHTML = '<p>Q. ' + precioBase.toFixed( 2 ) + '</p>';
	infoCargos.innerHTML = '<p>Q. ' + ( _recargoTotal + comision ).toFixed( 2 ) + '</p>';
	infoTotalPagar.innerHTML = '<p>Q. ' + totalPagar.toFixed( 2 ) + '</p>';
}

// Funcion para mostrar la ventana emergente, recibe los siguientes parametros:
// El parametro 'tiempo' es un numero en milisegundos, que es el tiempo el cual
// se tardara en ocultar el popup
function mostrarPopup( tiempo ) {
	popup.style.display = 'block';

	setTimeout( function() {
		popup.style.display = 'none';
	}, tiempo);
}

// Las siguientes variables retornan una lista de nodos con varios elementos,
// en este caso son los dos input[type="radio"] de las opciones 'Si' ó 'No'
// de los campos de cónyuge e hijos
var tieneConyuge = doc.querySelectorAll( 'input[name="conyuge"]' ),
tieneHijos = doc.querySelectorAll( 'input[name="hijos"]' );

// Oculta o muestra los campos extras con la funcion mostrarCamposExtras( obj, id );
mostrarCamposExtras( tieneConyuge, 'fecha-conyuge-input' );
mostrarCamposExtras( tieneHijos, 'cantidad-hijos-input' );

// Evento que detecta cuando se da click en el boton 'type="submit"'
form.addEventListener( 'submit', function( event ) {
	// La funcion preventDefault() evita que el formulario se envie, en este caso
	// la utilizamos porque no queremos enviado informacion a ninguna DB ya
	// que nuestro programa corre del lado del cliente
	event.preventDefault();

	// Variable para guardar la funcion datos() y no hacer el llamado varias veces
	var datosUsuario = datos();

	// Modificando las variables globales
	_recargoEdad = recargoEdad( datosUsuario );
	_recargoConyuge = recargoEdadConyuge( datosUsuario );
	_recargoHijos = recargoHijos( datosUsuario );
	_recargoTotal = recargoTotal( _recargoEdad, _recargoConyuge, _recargoHijos );
	totalPagar = precioBase + _recargoTotal + comision;

	// Validamos si el usuario es mayor de 18 años y menor de 66
	if ( datosUsuario.edad >= 18 && datosUsuario.edad <= 65 ) {
		// Oculta o muestra el desglose
		mostrarDesglose( true );
		// Imprimiendo los datos en el desglose
		imprimirDesglose( datosUsuario );
	} else if( datosUsuario.edad < 18 ) {
		// Si es menor de 18 años, imprimimos en el popup 'menor de 18 años' y
		// mostramos el popup
		doc.getElementById( 'popup-edad' ).innerHTML = 'menor de 18 años';
		mostrarPopup( 5000 );
		// Hacemos un reset del formulario para dejar en blanco los campos
		form.reset();
	} else {
		// Si es mayor de 65 años, imprimimos en el popup 'mayor de 65 años' y
		// mostramos el popup
		doc.getElementById( 'popup-edad' ).innerHTML = 'mayor de 65 años';
		mostrarPopup( 5000 );
		// Hacemos un reset del formulario para dejar en blanco los campos
		form.reset();
	}
});

// Evento para detectar el click en el boton de imprimir
buttonPrint.addEventListener( 'click', function( event ) {
	event.preventDefault();

	// Mostramos la opcion de imprimir
	window.print();
});