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
  //Solicitud ajax al backend 
  $('.upvote', element).click(function(eventObject) {
      $.ajax({
          type: "POST",                                 //Solcitud POST
          url: handlerUrl,                              //Uso de la URL generada 
          data: JSON.stringify({voteType: 'up'}),       //Envio de un Objeto JSON con el tipo de voto en caso up
          success: updateVotes                          //si la solcitud es exitosa, ejecuta la funcion updateVotes
      });
  });

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


//Funcion que toma los valores del form y los envia al controlador de python "guardar_configuracion"
function Profesor_View(runtime, element){
  const form = document.getElementById('profesor_form');

  form.addEventListener('submit', function(event){
    event.preventDefault();

    const data ={
      titulo: document.getElementById('titulo').value,
      descripcion: document.getElementById('descripcion').value,
      fecha: document.getElementById('fecha').value
    };

    const handlerUrl = runtime.handlerUrl(element,'guardar_configuracion'); //Nombre del controlador en pyhton

    $.ajax({
      type: 'POST', 
      url: handlerUrl,
      data: JSON.stringify(data),
      success: function(response){
        alert('Datos guardados Exitosamente');
        //Prueba
        console.log(data);
      }
    })
  })
}

