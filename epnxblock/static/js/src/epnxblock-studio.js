//Archivo JS para el EPNXBLOCK en STUDIO

function EpnXBlockStudio(runtime, element, data){


 // Asegúrate de que SweetAlert2 está cargado desde el CDN
 if (typeof Swal === 'undefined') {
  console.error('SweetAlert2 no está disponible');
  } else {
  console.log('SweetAlert2 cargado correctamente');
  }


  //Obtener JSON para los tipos de retroalimentacion y sus parametros
  const retro_Data = JSON.parse($(element).find("#checkbox-data").text());

  //Obtener JSON de los test cases 
  const test_cases = JSON.parse($(element).find('#test_casesJSON').text())
  
  // Funciones Complementarias
  //Funcion para el menu 
  function mostrarSeccion(seccion) {
    // Ocultar todas las secciones
    $(element).find('.contenido-seccion').hide();
    // Mostrar la sección seleccionada
    $(element).find('#' + seccion).show();

  };

  //Funcion que incializa los checkboxes
  function initializeCheckboxes(element){
    retro_Data.retroalimentacion.forEach((item)=>{
      const checkbox = $(element).find(`input[id="${item.name}"]`);
      const divId = checkbox.data("seccion");

      if (item.state === 1) {
        // Marcar el checkbox y mostrar el contenido si `state` es 1
        checkbox.prop("checked", true);
        $("#" + divId).show();
      } else {
        // Desmarcar el checkbox y ocultar el contenido si `state` es 0
        checkbox.prop("checked", false);
        $("#" + divId).hide();
      }
    });
  }

  //Funcion para validar datos generales  
  function validar_Datos(data){

    if((data['titulo']=="" || data['titulo']==null) || 
       (data['descripcion']=="" || data['descripcion']==null) ||
       (data['fecha_entrega']=="" || data['fecha_entrega']==null) ||
       (data['salida_esperada'] == "" || data['salida_esperada'] == null)
      ){
        return false;

    }else{
      return true;
    }

  };
  //Funcion para validadr los valores de retroalimentacion 
  function validar_retroalimentacion(data){

    if(data.retroalimentacion[0].state == 0 && data.retroalimentacion[1].state == 0){
      return false;
    }else{
      console.log('Se ha seleccionado alguna');
      return true;
    }
  }

  function armarTestCases(inputText) {
    // Expresión regular para capturar cada bloque completo de "Case"
    const caseRegex = /Case:\s*Grade_reduction\s*=\s*(.+?)\s*input\s*=\s*([\s\S]+?)\s*output\s*=\s*([\s\S]+?)(?=\nCase:|$)/g;
    const testCases = {};
    let match;
    let index = 1;

    // Validar si el campo de test cases está vacío
    if (inputText.trim() === "") {
      console.log("test case vacio");
      return null;
    }

    // Validar si el texto contiene al menos una palabra clave "Case"
    if (!/Case:/.test(inputText)) {
      alert("Ingresa el formato adecuado o deja el campo vacio");
       //throw new Error("No se encontró ningún bloque 'Case:'. Verifica el formato.");
    }

    // Procesar todos los casos coincidentes
    while ((match = caseRegex.exec(inputText)) !== null) {
        const caseName = `Caso${index}`;
        const gradeReduction = match[1]?.trim();
        const input = match[2]?.trim();
        const output = match[3]?.trim();

      
        // Guardar el caso procesado
        testCases[caseName] = {
            "Grade reduction": gradeReduction,
            "input": input,
            "output": output,
        };

        index++;
    }

    // Validar si no se encontraron bloques válidos
    if (Object.keys(testCases).length === 0) {
        throw new Error("No se encontró ningún bloque de 'Case:' válido. Verifica el formato de los datos.");
    }

    return testCases;
  }

  // Función para convertir JSON a formato de texto para el textarea
  function convertirJSONaTexto(jsonTestCases) {
  let formattedText = '';
  Object.entries(jsonTestCases).forEach(([key, value]) => {
      formattedText += `Case:\n`;
      formattedText += `Grade_reduction =\n${value["Grade reduction"]}\n`;
      formattedText += `input =\n${value.input}\n`;
      formattedText += `output =\n${value.output}\n\n`;
  });
  return formattedText.trim(); // Eliminar espacios extra al final
  }

  // Convertir JSON a texto
  const testCasesTexto = convertirJSONaTexto(test_cases);

  // Colocar el texto en el textarea
  $(element).find('#test_cases').val(testCasesTexto);



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


  //Seleccionar contenedor donde se almacenaran 
  const checkContainer = $(element).find("#checkbox-container");

  //Creacion dinamica de los checkbox segun el JSON
  retro_Data.retroalimentacion.forEach(function(retro){
    const checkboxElement = `
            <div class="checkbox_unit">
                <h3 class="t3">
                    <input type="checkbox" class="tipo_retro" id="${retro.name}" data-seccion="cont_${retro.name}" value="${retro.name}">
                    ${retro.name}
                </h3>
            </div>
        `;
        checkContainer.append(checkboxElement);

  });

  //Seleccionar el contenedor donde se almacenan los parametros
  const paramContainer = $(element).find("#confing-selected");

  //Creacion dinamica de los parametros
  retro_Data.retroalimentacion.forEach(function(retro){
    let paramElement = `
       <div class="config_unit" id="cont_${retro.name}">
          <h3 class="t2">Configuración ${retro.name}</h3>
           
    `;

    //Iteracion sobre los parametros de los tipos de retroalimentacion

    Object.keys(retro.parameters).forEach(function(paramKey){
      const param = retro.parameters[paramKey];
      paramElement += `
          <div class="param_container">
          <h3 class="t3" style="display: inline;">${param.label}:</h3>
          <input class="${param.type}" type="${param.type}" id="${param.id}" value="${param.value}">
          <span class="help-icon" data-tooltip ="${param.help}">?</span>
          </div>
      `;
    });

    //Cerramos el contenedor 
    paramElement += `</div>`;
    //Anadir el elemento al contenedor
    paramContainer.append(paramElement);

  });

  initializeCheckboxes(element);

  //Funcion que controla la seleccion de los checkboxes de retroalimentacion en TIEMPO REAL
  $(element).find(".tipo_retro").on("change", function(){
    const checkbox = $(this); //Check box actual
    const divId = checkbox.data("seccion"); //Obtener el ID 
    const idCheck = checkbox.attr("id");
    
    // Buscar el checkbox en el JSON y actualizar su `state` en tiempo real
   // const item = retro_Data.retroalimentacion.find(elem => elem.name == idCheck);

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
      
      //Config_data - Retroalimentacion
      //analizar estado de checkboxes
      retro_Data.retroalimentacion.forEach(item =>{

        //actualizacion de la variable state
        const checkbox = document.querySelector(`input[id="${item.name}"]`);
        if (checkbox) {
            item.state = checkbox.checked ? 1 : 0;
          }

          //Toma de valores de los parametros de cada Retroalimentacion 
          //actualizacion de parametros de Pistas 
          if(item.name == "Pistas"){
            item.parameters.numero_pistas.value = parseInt(document.getElementById('numero_pistas').value);
            item.parameters.grado.value = parseFloat(document.getElementById('grado').value);

          }

          //actualizacion de parametros Calificado - de existir un parametro
        
      });
      //Recoger los test cases ingresados por el profesor 
      const testCases = document.getElementById('test_cases').value
      const jsonTestCases = armarTestCases(testCases);

      //Datos para enviar al archivo de pyhton
        const data ={
            //General
            titulo: document.getElementById('titulo').value,
            descripcion: document.getElementById('descripcion').value,
            salida_esperada: document.getElementById('salida_esperada').value,
            fecha_entrega : document.getElementById('fecha_entrega').value,

            //Codigo
            codigo_inicial: document.getElementById('codigo_inicial').value,
            test_cases : jsonTestCases,

            //carga de reto_config
            retro: retro_Data,

            //Ip del servidor 
            ip_server: document.getElementById('ip_server').value
                        
          };

          //Validar datos
          if(!validar_Datos(data)){
            alert('Completar todos los campos generales antes de guardar.');
            return;
            /* PENDIENTE POR RESOLVER
            Swal.fire({
              title: '¡Advertencia!',
              text: 'Completar todos los campos generales antes de guardar.',
              icon: 'warning',  // Icono de advertencia
              confirmButtonText: 'Aceptar'
          });
            return;*/
          }
          if(!validar_retroalimentacion(retro_Data)){
            alert('No se ha seleccionado ningun tipo de Retroalimentación.');
            return;
          }
          
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


  