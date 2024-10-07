//Archivo JS para el EPNXBLOCK en STUDIO

function EpnXBlockStudio(runtime, element, data){

    const handlerUrl = runtime.handlerUrl(element,'guardar_configuracion'); //Nombre del controlador en pyhton
    
     // Manejar el cambio de selección del combo box
     $(element).find("#tipo_ejercicio").on('change', function() {
      var valor = $(this).val();
      var calificacion = $(element).find("#calificacion");
      var retroalimentacion = $(element).find("#retroalimentacion");

      //Ocultar ambos elementos al comiezo 
      calificacion.hide();
      retroalimentacion.hide();

      if (valor === "calificacion") {
          calificacion.show();
      } else if (valor === "retroalimentacion") {
          retroalimentacion.show();
      } 
  });


    $(element).find(".updateButton").click(function(){

      //MODELO de peticion cuando hago 
        const data ={
            titulo: document.getElementById('titulo').value,
            descripcion: document.getElementById('descripcion').value,
            salida_esperada: document.getElementById('salida_esperada').value,
            codigo_inicial: document.getElementById('codigo_inicial').value,
            tipo: document.getElementById('tipo_ejercicio').value,
            pistas: document.getElementById('pistas').value,
          };
        $.ajax({
            type: 'POST', 
            url: handlerUrl,
            data: JSON.stringify(data),
            success: function(){
                alert('Datos guardados Exitosamente');
                //Prueba
                console.log(data); 
            }
        });

    });
}
/*
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
  }*/

  