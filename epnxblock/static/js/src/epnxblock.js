/* Javascript for EpnXBlock. */

function EpnXBlockAside(runtime, element, block_element, init_args) {
  //Constructor que crea una instancia de ThumbsBlock 
  /*
  runtime: Permite cimnicacion entre Frontend y Backend
  element: elemento HTML que representa el bloque en la pagina web
  init_args: Datos de configuracion inicial del bloque
  */ 
  return new EpnXBlock(runtime, element, init_args)
  //return new ThumbsBlock();
}

/*
function EpnXBlock(runtime, element, init_args) {
  //Funcion interna: Actualiza el contador de votos en la interfaz 

  function updateVotes(votes) {
    //votes es un objeto que tienen las propiedades up y down

    //Encontrar el elemento HTML dentro del bloque (element)
      $('.upvote .count', element).text(votes.up);
      $('.downvote .count', element).text(votes.down);
  }
  //Generacion de URL para hacer una solicitud POST
  var handlerUrl = runtime.handlerUrl(element, 'vote');

  //Evento de clic para upvote (span)
  

  $('.downvote', element).click(function(eventObject) {
      $.ajax({
          type: "POST",
          url: handlerUrl,
          data: JSON.stringify({voteType: 'down'}),
          success: updateVotes
      });
  });

  return {};
};
*/

function EpnXBlock(runtime, element, init_args) {


  //Obtener JSON para los tipos de retroalimentacion y sus parametros
  const $evaluationDataElement = $("#evaluation-data");
  const evaluation_data = JSON.parse($evaluationDataElement.text());
  
  console.log("Contenido de evaluacion:", evaluation_data)

  $(element).find(".flecha").click(function(){
    console.log("Fecha presionada");
    element.toggleClass("rotate");
  });

  //Funciones complementarias 
  function actualizar_campos(response){
    $('.ai_response',element).text(response.ia_response);

    if(response.pistas_restantes == 0){
      $('.pista_r',element).text("Limite de pistas alcanzado");
      $('#test_code',element).prop('disabled', true);
    }else{
      $('.pista_r',element).text(response.pistas_restantes);
    }
    
    console.log('Actualizacion realizada');
  };

  //Funcion para visualizacion dinamica de informacion de evaluacion
  //Seleccionar contenedor donde se almacenaran 
  const checkContainer = $(element).find(".evalua_info");

//Creacion dinamica de los checkbox segun el JSON
// Recorrer cada objeto dentro de `evaluation_data.eva`
let anySelected = 0;

// Itera sobre los datos
evaluation_data.eva.forEach(function(item) {
  // Buscar el contenedor para cada tipo de configuración (Pista o Calificado)
  
  // Si es un objeto `Pista`
  if (item.Pista) {
    const pistaElement = checkContainer.find(`#pista-${item.Pista.label}`);
    if (item.Pista.state === 1) {
      // Mostrar el elemento y actualizar su contenido
      if (pistaElement.length === 0) {
        // Si no existe, creamos el HTML y lo agregamos
        checkContainer.append(`
          <div id="pista-${item.Pista.label}">
            <p><h4>${item.Pista.label}: </h4><span >Número de pistas permitidas: </span>
            <span class="pista_r"> ${item.Pista.numero_pistas}</span>
            </p>
          </div>
        `);
      } else {
        // Si existe, solo mostramos el elemento
        pistaElement.show();
      }
      anySelected += 1;
    } else {
      // Si el estado no es 1, ocultar el elemento si ya está presente
      pistaElement.hide();
    }
  }
  
  // Si es un objeto `Calificado`
  else if (item.Calificado) {
    const calificadoElement = checkContainer.find(`#calificado-${item.Calificado.label}`);
    if (item.Calificado.stade === 1) {
      // Mostrar el elemento y actualizar su contenido
      if (calificadoElement.length === 0) {
        // Si no existe, creamos el HTML y lo agregamos
        checkContainer.append(`
          <div id="calificado-${item.Calificado.label}">
            <p><h4>${item.Calificado.label}: </h4><span>Nota 0/10</span></p>
          </div>
        `);
      } else {
        // Si existe, solo mostramos el elemento
        calificadoElement.show();
      }
      anySelected += 1;
    } else {
      // Si el estado no es 1, ocultar el elemento si ya está presente
      calificadoElement.hide();
    }
  }
});

// Si no se seleccionó ninguna configuración, agregar el mensaje
if (anySelected === 0) {
  const noConfigMessage = $('#no-config-message');
  if (noConfigMessage.length === 0) {
    checkContainer.append('<p id="no-config-message">No se ha seleccionado ninguna configuración aún.</p>');
  }
  // Mantener el botón deshabilitado
  $('#test_code', element).prop('disabled', true);
} else {
  // Si se seleccionaron configuraciones, habilitar el botón
  $('#test_code', element).prop('disabled', false);
}

  //Solicitud ajax para enviar el codigo del estudiante 
  const handlerUrl = runtime.handlerUrl(element,'envio_respuesta'); //Nombre del controlador en pyhton
    $(element).find("#test_code").click(function(){
    console.log(init_args)
      
      const data ={
        codigo_estudiante: document.getElementById('zona_codigo').value
      }
      $.ajax({
        type: "POST",                                 //Solcitud POST
        url: handlerUrl,                              //Uso de la URL generada 
        data: JSON.stringify(data),                   //Envio de un Objeto JSON con los datos
        success: actualizar_campos                    //si la solcitud es exitosa, ejecuta la funcion 
    });
    

    });
  
  return{};
};





