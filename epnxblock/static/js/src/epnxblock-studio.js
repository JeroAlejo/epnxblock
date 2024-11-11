//Archivo JS para el EPNXBLOCK en STUDIO


function EpnXBlockStudio(runtime, element, data){
  
 
  /*
  $(document).ready(function() {
    quill = new Quill('#editor', {
        theme: 'snow'
    });
  });
  */

   //Obtener JSON para los tipos de retroalimentacion y sus parametros
   const retro_Data = JSON.parse($(element).find("#checkbox-data").text());
  
  // Función para manejar el cambio de secciones
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

  //Funcion para validar datos 
  function validar_Datos(data){

    if((data['titulo']=="" || data['titulo']==null) || 
       (data['descripcion']=="" || data['descripcion']==null) ||
       (data['fecha_entrega']=="" || data['fecha_entrega']==null)
      ){
        return false;

    }else{
      return true;
    }

  };

  function validar_retroalimentacion(data){

  
    if(data.retroalimentacion[0].state == 0 && data.retroalimentacion[1].state == 0){
      return false;
    }else{
      console.log('Se ha seleccionado alguna');
      return true;
    }
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
          <div "param_container">
          <h3 class="t3" style="display: inline;">${param.label}:</h3>
          <input class="${param.type}" type="${param.type}" id="${param.id}" value="${param.value}">
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

      //Preparacion previa de datos
      //GENERAL
      const des = quill.root.innerHTML;
      
      //Config_data - Retroalimentacion
      //analizar estado de checkboxes
      retro_Data.retroalimentacion.forEach(item =>{

        //actualizacion de la varaible state
        const checkbox = document.querySelector(`input[id="${item.name}"]`);
        if (checkbox) {
            item.state = checkbox.checked ? 1 : 0;
          }

          //actualizacion de parametros de Pistas
          if(item.name == "Pistas"){
            item.parameters.numero_pistas.value = parseInt(document.getElementById('numero_pistas').value);
            item.parameters.grado.value = parseFloat(document.getElementById('grado').value);

          }

          //actualizacion de parametros 
          if(item.name == "Calificado"){
            item.parameters.reduccion_nota.value = parseFloat(document.getElementById('grado').value);
          }
      });

      
      //Archivo de configuracion actualizado
      console.log(retro_Data);

      //MODELO de peticion cuando hago 
        const data ={
            //General
            titulo: document.getElementById('titulo').value,
            descripcion: des,
            fecha_entrega : document.getElementById('fecha_entrega').value,

            //Codigo
            codigo_inicial: document.getElementById('codigo_inicial').value,
            test_cases : document.getElementById('test_cases').value,

            //carga de reto_config
            retro: retro_Data
                        
          };

          //Validar datos
          if(!validar_Datos(data)){
            alert('Completar todos los campos generales antes de guardar.');
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


  