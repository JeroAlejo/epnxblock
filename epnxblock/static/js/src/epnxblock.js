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
  //Si funciona
  if (typeof window.RequireJS === 'undefined') {
    console.error('RequireJS no está definido en este entorno.');
  } else {
    console.log('RequireJS está disponible.');
  }


  //Obtener JSON para los tipos de retroalimentacion y sus parametros
  const $evaluationDataElement = $("#evaluation-data");
  const evaluation_data = JSON.parse($evaluationDataElement.text());
  
  console.log("Contenido de evaluacion:", evaluation_data)

  //Funciones complementarias 
  function actualizar_campos(response){
    $('.ai_response',element).text(response.ia_response);
    $('#num_pistas',element).text(response.pistas_restantes);

    if(response.pistas_restantes == 0){
      $('#test_code',element).prop('disabled', true);
    }else{
      
    }
    console.log('Actualizacion realizada');
  };

  //Funcion para validar datos antes de enviar al servidor
  function validar_datos(data){
    console.log(data);
    //Validamos los campos compilador 
    if(data['compilador'] == true && (data['contexto_adicional'] == ''  || data['contexto_adicional']==null)){
      return false;
    }else{
      return true;
    }
  }

  //Control de botones  
  // Verificar estado de "Pista"
  if (evaluation_data.eva[0].Pista.state === 1) {
    $('#test_code').prop('disabled', false); // Habilitar botón
  } else {
    $('#test_code').prop('disabled', true); // Deshabilitar botón
  }

  // Verificar estado de "Calificado"
  if (evaluation_data.eva[1].Calificado.state === 1) {
    $('#evaluate_code').prop('disabled', false); // Habilitar botón
  } else {
    $('#evaluate_code').prop('disabled', true); // Deshabilitar botón
  }

  // Funcionalidad de flecha para mostrar/ocultar 
  $('#toggle-arrow').on('click', function () {
    const arrow = $(this);
    const content = $('.additional-content'); 
    arrow.toggleClass('expanded');
    // Mostrar u ocultar 
   content.toggle();
  });


  //Solicitud ajax para enviar el codigo del estudiante
  //Tipo Pista
  const handlerUrl = runtime.handlerUrl(element,'envio_respuesta'); //Nombre del controlador en pyhton
    $(element).find("#test_code").click(function(){
    console.log(init_args)
      
      const data ={
        codigo_estudiante: document.getElementById('zona_codigo').value,
        contexto_adicional : document.getElementById('aditional_context').value,
        compilador : document.getElementById('compilador_check').checked,
        aux : evaluation_data.eva[0].Pista.label
      }

      if(!validar_datos(data)){
        alert('Es necesario añadir el contexto adicional si marcas la opción salida de compilador');
        return;
      }
      
      $.ajax({
        type: "POST",                                 //Solcitud POST
        url: handlerUrl,                              //Uso de la URL generada 
        data: JSON.stringify(data),                   //Envio de un Objeto JSON con los datos
        success: actualizar_campos                    //si la solcitud es exitosa, ejecuta la funcion 
    });
    });
    
    //Tipo Calificado
    $(element).find("#evaluate_code").click(function(){
      console.log(init_args)
        
        const data ={
          codigo_estudiante: document.getElementById('zona_codigo').value,
          aux : evaluation_data.eva[1].Calificado.label
        }
        console.log(data)
        $.ajax({
          type: "POST",                                 //Solcitud POST
          url: handlerUrl,                              //Uso de la URL generada 
          data: JSON.stringify(data),                   //Envio de un Objeto JSON con los datos
          success: actualizar_campos                    //si la solcitud es exitosa, ejecuta la funcion 
      });
      });
  
  return{};
};





