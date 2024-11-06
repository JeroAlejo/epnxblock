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

  $(element).find(".flecha").click(function(){
    console.log("Fecha presionada");
    element.toggleClass("rotate");
  });

  //Funciones complementarias 
  function actualizar_campos(){
    console.log('Actualiza campos: PENDIENTE');
  };


  //Solicitud ajax para enviar el codigo del estudiante 
  const handlerUrl = runtime.handlerUrl(element,'envio_respuesta'); //Nombre del controlador en pyhton
    $(element).find("#test_code").click(function(){

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





