//Archivo JS para el EPNXBLOCK en STUDIO

function EpnXBlockStudio(runtime, element, data){

  
  // Función para manejar el cambio de secciones
  function mostrarSeccion(seccion) {
    // Ocultar todas las secciones
    $(element).find('.contenido-seccion').hide();
    
    // Mostrar la sección seleccionada
    $(element).find('#' + seccion).show();
  }


  // Asignar eventos de clic a los enlaces de navegación
  //Mostar seccion general
  $(element).find('#nav-general').on('click', function(e) {
    e.preventDefault(); // Evitar comportamiento predeterminado del enlace
    mostrarSeccion('general');
  });
  //Mostar la seccion retroalimentacion 
  $(element).find('#nav-retroalimentacion').on('click', function(e) {
    e.preventDefault(); 
    mostrarSeccion('retroalimentacion'); 
  });
  // Mostrar la sección "codigo"
  $(element).find('#nav-codigo').on('click', function(e) {
    e.preventDefault();
    mostrarSeccion('codigo'); 
  });

  //Obtener JSON para los tipos de retroalimentacion y sus parametros
  const retro_Data = JSON.parse($(element).find("#checkbox-data").text());

  //Seleccionar contenedor donde se almacenaran 
  const checkContainer = $(element).find("#checkbox-container");

  //Creacion dinamica de los checkbox segun el JSON
  retro_Data.checkboxes.forEach(function(checkbox){
    const checkboxElement = `
            <div class="checkbox_unit">
                <label>
                    <input type="checkbox" class="tipo_retro" id="${checkbox.name}" data-seccion="cont_${checkbox.name}" value="${checkbox.name}">
                    ${checkbox.name}
                </label>
            </div>
        `;
        checkContainer.append(checkboxElement);

  });

  //Seleccionar el contenedor donde se almacenan los parametros
  const paramContainer = $(element).find("#confing-selected");

  //Creacion dinamica de los parametros
  retro_Data.checkboxes.forEach(function(checkbox){
    let paramElement = `
       <div class="config_unit" id="cont_${checkbox.name}">
          <h2 class="t2">Configuración ${checkbox.name}</h2>
           
    `;

    //Iteracion sobre los parametros de los tipos de retroalimentacion

    Object.keys(checkbox.parameters).forEach(function(paramKey){
      const param = checkbox.parameters[paramKey];
      paramElement += `
          <h3 class="t3" style="display: inline;">${param.label}:</h3>
          <input class="${param.type}" type="${param.type}" id="${param.id}" value="${param.default}">
      `;
    });

    //Cerramos el contenedor 
    paramElement += `</div>`;
    //Anadir el elemento al contenedor
    paramContainer.append(paramElement);

  });



  //Funcion que controla la seleccion de los checkboxes 
  $(element).find(".tipo_retro").on("change", function(){
    const checkbox = $(this); //Check box actual
    const divId = checkbox.data("seccion"); //Obtener el ID 
    console.log("Hola");
    if(checkbox.is(":checked")){
      //Mostrar seccion si esta seleccionado
      $("#"+divId).show();
    }else{
      //Ocultar
      $("#"+divId).hide();
    }
  });
  
  //FUNCIONES PARA GUARDAR DATOS
  const handlerUrl = runtime.handlerUrl(element,'guardar_configuracion'); //Nombre del controlador en pyhton
    $(element).find(".updateButton").click(function(){

      //MODELO de peticion cuando hago 
        const data ={
            //General
            titulo: document.getElementById('titulo').value,
            descripcion: document.getElementById('descripcion').value,
            //salida_esperada: document.getElementById('salida_esperada').value,
            fecha_entrega : document.getElementById('fecha_entrega').value,
            //Retroalimentacion 
            numero_pistas: document.getElementById('numero_pistas').value,
            grado: document.getElementById('grado').value,

            reduccion_nota: document.getElementById('reduccion_nota').value,
            //Codigo
            codigo_inicial: document.getElementById('codigo_inicial').value,
            test_cases : document.getElementById('test_cases').value
                        
          };

          console.log(data); 

        $.ajax({
            type: 'POST', 
            url: handlerUrl,
            data: JSON.stringify(data),
            success: function(){
                alert('Datos guardados Exitosamente');
                
            }
        });

    });
}


  