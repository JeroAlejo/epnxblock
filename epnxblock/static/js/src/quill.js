const toolbarOptions = [
    // font options
    [{ font: [] }],
  
    //   header options
    [{ header: [1, 2, 3] }],
  
    // text utilities
    ["bold", "italic", "underline", "strike"],
  
    // text colors and bg colors
    [{ color: [] }, { background: [] }],
  
    // lists
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  
    // block quotes and code blocks
    ["blockquote", "code-block"],
  
    // alignment
    [{ align: [] }],
  ];
  


  const quill = new Quill("#editor-container", {
    theme: "snow",
    modules: {
      toolbar: toolbarOptions,
    },
  });
  
// Establecer estilos para la barra de herramientas
const toolbar = document.querySelector('.ql-toolbar');
toolbar.style.width = '80%'; // Cambia el ancho según necesites
toolbar.style.marginLeft = '2%'; // Centra la barra de herramientas



// Seleccionar todos los botones de la barra de herramientas
const buttons = toolbar.querySelectorAll('.ql-toolbar button');

// Aplicar margen a cada botón
buttons.forEach(button => {
    button.style.marginRight = '1px'; // Ajusta este valor según la separación que desees
   
});

// Seleccionar los selectores de fuente y encabezados
const fontPicker = toolbar.querySelector('.ql-font');
const headerPicker = toolbar.querySelector('.ql-header');

// Aplicar estilos para separar los selectores
if (fontPicker) {
    fontPicker.style.marginRight = '5px'; // Espacio a la derecha del selector de fuente
}

if (headerPicker) {
    headerPicker.style.marginRight = '5px'; // Espacio a la derecha del selector de encabezados
}
