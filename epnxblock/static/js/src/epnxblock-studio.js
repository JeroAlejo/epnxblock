//Archivo JS para el EPNXBLOCK en STUDIO

function EpnXBlockStudio(runtime, element, data){

    const handlerUrl = runtime.handlerUrl(element,'guardar_configuracion'); //Nombre del controlador en pyhton
    

    $(element).find(".updateButton").click(function(){
        const data ={
            titulo: document.getElementById('titulo').value,
            descripcion: document.getElementById('descripcion').value,
            fecha: document.getElementById('fecha').value
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