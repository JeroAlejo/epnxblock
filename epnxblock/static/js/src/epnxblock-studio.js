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

  //Funcion para armar JSON de Test cases 
  function procesarTestCases(rawTestCases) {
    //Asegurarse de que se haya proporcionado algún contenido 
    if (!rawTestCases.trim()) {
        return null; 
    }
    //Division de los test cases usando Case como delimitador 
    const cases = rawTestCases.split(/Case:/).slice(1); 

    //Creacion del Json donde se almacenaran los Cases
    const testCasesJson = {};
    //Procesamiento de cada caso
    cases.forEach((testCase, index) => {
        const lines = testCase.trim().split("\n");
        //Creacion de los campos que conforman un est case
        let gradeReduction = "";
        let input = [];
        let output = "";

        //Procesamiento de cada campo dentro del Test Case
        lines.forEach(line => {
            if (line.startsWith("Grade reduction")) {
                gradeReduction = line.split("=")[1].trim();
            } else if (line.startsWith("input")) {
                input = lines.slice(lines.indexOf(line) + 1, lines.indexOf("output")).join("\n").trim();
            } else if (line.startsWith("output")) {
                output = lines.slice(lines.indexOf(line) + 1).join("\n").trim();
            }
        });

        //Adiciion del Test Case al JSON aumentado un identificador 
        testCasesJson[`Caso${index + 1}`] = {
            "Grade reduction": gradeReduction,
            "input": input,
            "output": output,
        };
    });

    //retorno del JSON con los test cases 
    console.log(testCasesJson);
    return testCasesJson;
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
    const item = retro_Data.retroalimentacion.find(elem => elem.name == idCheck);


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

          //actualizacion de parametros de Pistas
          if(item.name == "Pistas"){
            item.parameters.numero_pistas.value = parseInt(document.getElementById('numero_pistas').value);
            item.parameters.grado.value = parseFloat(document.getElementById('grado').value);

          }

          //actualizacion de parametros Calificado
          if(item.name == "Calificado"){
            item.parameters.reduccion_nota.value = parseFloat(document.getElementById('grado').value);
          }
      });
      //Recoger los test cases ingresados por el profesor 
      const testCases = document.getElementById('test_cases').value
      const jsonTestCases = procesarTestCases(testCases);

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
            retro: retro_Data
                        
          };

          //Validar datos
          if(!validar_Datos(data)){
            Swal.fire({
              title: '¡Advertencia!',
              text: 'Completar todos los campos generales antes de guardar.',
              icon: 'warning',  // Icono de advertencia
              confirmButtonText: 'Aceptar'
          });
            return;
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


  