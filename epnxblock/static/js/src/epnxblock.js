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

  function actualizar_campos(response) {
    console.log(response);
    // Actualiza el valor de pistas usadas
    $('#pistas_usadas', element).text(response.pistas_usadas);

    // Deshabilita el botón si ya no quedan pistas disponibles
    if (!response.bandera) {
      $('.ai_response', element).text(response.ia_response)
    } else {
      // Actualiza la respuesta de la IA en el campo correspondiente
      let ia_response_formateada = typeof response.ia_response === 'object'
        ? JSON.stringify(response.ia_response, null, 4) // Formatea con 4 espacios
        : response.ia_response;
      $('.ai_response', element).text(ia_response_formateada);
    }
  }

  //Funcion para validar datos antes de enviar al servidor
  function validar_compilador(data){
    console.log(data);
    //Validamos los campos compilador 
    if(data['compilador'] == true && (data['contexto_adicional'] == ''  || data['contexto_adicional']==null)){
      return false;
    }else{
      return true;
    }
   }

   function validar_codigoSalida(data){
    //validamos campo codigo estudiante 
    if(data['codigo_estudiante'] == '' || data['codigo_estudiante']==null){
      return false;
    }else{
      return true;
    }
  }
  /*
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
    */
  $(document).ready(function () {
    // Habilitar o deshabilitar el botón "Solicitar Pista"
    if (evaluation_data.eva[0].Pista.state === 1) {
        $('#test_code', element).prop('disabled', false); // Habilitar botón
    } else {
        $('#test_code', element).prop('disabled', true); // Deshabilitar botón
    }

    // Habilitar o deshabilitar el botón "Evaluar Código"
    if (evaluation_data.eva[1].Calificado.state === 1) {
        $('#evaluate_code', element).prop('disabled', false); // Habilitar botón
    } else {
        $('#evaluate_code', element).prop('disabled', true); // Deshabilitar botón
    }

    if(evaluation_data.codigo_estudiante==null || evaluation_data.codigo_estudiante==''){
      $('#zona_codigo').val(evaluation_data.codigo_inicial);
    }else{
      $('#zona_codigo').val(evaluation_data.codigo_estudiante);

    }
  });
  

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
        aux : evaluation_data.eva[0].Pista.label,
      }

      if(!validar_codigoSalida(data)){
        alert('El campo de código no puede ser vacio');
        return;
      }

      if(!validar_compilador(data)){
        alert('Es necesario añadir el contexto adicional si marcas la opción salida de compilador');
        return;
      }
      
      $.ajax({
        type: "POST",                                 //Solcitud POST
        url: handlerUrl,                              //Uso de la URL generada 
        data: JSON.stringify(data),                   //Envio de un Objeto JSON con los datos
        contentType: 'application/json',
        success: actualizar_campos                    //si la solcitud es exitosa, ejecuta la funcion 
    });
    });
    
    //Tipo Calificado
    $(element).find("#evaluate_code").click(function(){
      console.log(init_args)
      const data ={
        codigo_estudiante: document.getElementById('zona_codigo').value,
        contexto_adicional : document.getElementById('aditional_context').value,
        compilador : document.getElementById('compilador_check').checked,
        aux : evaluation_data.eva[1].Calificado.label
      }

      if(!validar_codigoSalida(data)){
        alert('El campo de código no puede ser vacio');
        return;
      }

      if(!validar_compilador(data)){
        alert('Es necesario añadir el contexto adicional si marcas la opción salida de compilador');
        return;
      }
        
        
        console.log(data)
        $.ajax({
          type: "POST",                                 //Solcitud POST
          url: handlerUrl,                              //Uso de la URL generada 
          data: JSON.stringify(data),                   //Envio de un Objeto JSON con los datos
          contentType: 'application/json',
          success: actualizar_campos                    //si la solcitud es exitosa, ejecuta la funcion 
      });
      });
  
  return{};
};





