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

  function procesarTestCases(rawTestCases) {
    // Asegurarse de que se haya proporcionado algún contenido
    if (!rawTestCases.trim()) {
        return null; // Retorna null si está vacío
    }

    // División de los test cases usando 'Case:' como delimitador
    const cases = rawTestCases.split(/Case:/).slice(1);

    // Validar que haya al menos un caso definido
    if (cases.length === 0) {
        alert("El formato de los test cases no es válido. Asegúrate de que comiencen con 'Case:'.");
        return null;
    }

    // Creación del JSON donde se almacenarán los Cases
    const testCasesJson = {};

    // Procesamiento de cada caso
    for (let index = 0; index < cases.length; index++) {
        const testCase = cases[index].trim();
        const lines = testCase.split("\n").map(line => line.trim());

        // Variables para almacenar los campos de cada test case
        let gradeReduction = "";
        let input = "";
        let output = "";

        // Variables para rastrear las secciones
        let inputStartIndex = -1, outputStartIndex = -1;

        // Procesar las líneas de cada caso
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Detectar "Grade reduction" y capturar su valor en la siguiente línea
            if (line === "Grade reduction =") {
                if (i + 1 < lines.length) {
                    gradeReduction = lines[i + 1].trim();
                    i++; // Saltar a la siguiente línea después de capturar el valor
                } else {
                    alert(`El valor de "Grade reduction" está ausente en el caso ${index + 1}.`);
                    return null;
                }
            } else if (line.startsWith("input =")) {
                inputStartIndex = i;
            } else if (line.startsWith("output =")) {
                outputStartIndex = i;
            }
        }

        // Validar la presencia de la sección 'Grade reduction'
        if (gradeReduction === "") {
            alert(`El test case ${index + 1} debe contener la sección 'Grade reduction'.`);
            return null;
        }

        // Validar la presencia de las secciones 'input' y 'output'
        if (inputStartIndex === -1 || outputStartIndex === -1) {
            alert(`El test case ${index + 1} debe contener las secciones 'input' y 'output'.`);
            return null;
        }

        // Extraer contenido de 'input' y 'output'
        input = lines.slice(inputStartIndex + 1, outputStartIndex).join("\n").trim();
        output = lines.slice(outputStartIndex + 1).join("\n").trim();

        if (!input || !output) {
            alert(`El test case ${index + 1} no tiene contenido válido en 'input' o 'output'.`);
            return null;
        }

        // Añadir el test case al JSON con un identificador
        testCasesJson[`Caso${index + 1}`] = {
            "Grade reduction": gradeReduction,
            "input": input,
            "output": output,
        };
    }

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

          //actualizacion de parametros de Pistas 
          if(item.name == "Pistas"){
            item.parameters.numero_pistas.value = parseInt(document.getElementById('numero_pistas').value);
            item.parameters.grado.value = parseFloat(document.getElementById('grado').value);

          }

          //actualizacion de parametros Calificado
          if(item.name == "Calificado"){
            item.parameters.reduccion_nota.value = parseFloat(document.getElementById('reduccion_nota').value);
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


  