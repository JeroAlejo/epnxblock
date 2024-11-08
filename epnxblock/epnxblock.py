"""TO-DO: Write a description of what this XBlock is."""

from asyncio import log
import importlib
import importlib.resources
from typing import Dict
from xblock.fields import Boolean
import logging
import json
import pkg_resources
#Librerias propias de XBLOCK

from web_fragments.fragment import Fragment
from xblock.core import XBlock, XBlockAside
from xblock.fields import Integer, Scope, String, Dict, Float

log = logging.getLogger(__name__)

class EpnXBlock(XBlock):
    """
    TO-DO: document what your XBlock does.
    """

    # Los campos (Fields) Se definen en la Clase.  Se puede Acceder a ellos de la manera
    # self.<fieldname>(Campo).


    #Campo para almacenar informacion GENERAL -----------------------------------------# 
    #Caracter Obligatorio
    titulo = String(
        help="Titulo de la arctividad",
        default= "",
        scope = Scope.content
    )

    descripcion = String(
        help="Descripcion de la arctividad",
        default="",
        scope = Scope.content
    )

    fecha_entrega = String(
        help="fecha de entrega de la actividad",
        default="",
        scope= Scope.content
    )

    #Campos para retroalimentacion ------------------------------------------------------#

    #Campo bandera tipo diccionario para cada retroalimentacion para mostar al estudiante
    field_Pista = Dict(
        default={"label":"Pista", "numero_pistas": 0,"grado": 0, "state": 0},
        scope = Scope.settings
    )

    field_Calificado = Dict(
        default={"label":"Calificado", "reduccion_nota": 0, "state": 0},
        scope = Scope.settings
    )
    
    #Campos para Codigo -----------------------------------------------------------------#

    codigo_inicial = String(
        help="Se almacena el codigo incial brindado por el profesor - OPCIONAL",
        default= "Sin asignar",
        scope= Scope.content
    )

    test_cases = String(
        help="Se almacena el codigo incial brindado por el profesor - OPCIONAL",
        default= "Sin asignar",
        scope= Scope.content
    )


    #Campo del profesor: 
    codigo_estudiante = String(
        help="Se almacena el codigo del estudiante para hacer la peticion a la IA",
        default= "",
        scope= Scope.content
    )

    #Prueba de obtener informacion del curso
    estudiante_id = String(
        scope=Scope.user_state, help="ID del estudiante"
        )
    curso_id = String(scope=Scope.settings, help="ID del curso")
    actividad_id = String(scope=Scope.settings, help="ID de la actividad")

    def resource_string(path):
        """Ayudante práctico para obtener recursos de nuestro kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")
    
    #DECLARACION DE VISTAS: 
    #VISTA DE ESTUDIANTE 
    def student_view(self, context=None):

        """
        La vista principal de EpnXBlock, que se muestra a los estudiantes
        """
        
        #Carga de Fragmento HTML
        html = importlib.resources.files(__package__).joinpath("static/html/epnxblock.html").read_text(encoding="utf-8")
        frag = Fragment(str(html).format(block=self))

        # Carga de archivos CSS y JavaScript fragments from within the package
        css_str = importlib.resources.files(__package__).joinpath("static/css/epnxblock_student.css").read_text(encoding="utf-8")
        frag.add_css(str(css_str))

        js_str = importlib.resources.files(__package__).joinpath("static/js/src/epnxblock.js").read_text(encoding="utf-8")
        frag.add_javascript(str(js_str))
        frag.initialize_js('EpnXBlock')

        return frag

    #Vista de profesor: En el boton EDIT
    def studio_view(self, context = None):
        """
        La vista principal de EpnXBlock, que se muestra a los estudiantes
        cuando visualizan cursos.
        """
        #Carga de Fragmento HTML
        html_str = importlib.resources.files(__package__).joinpath("static/html/epnxblock-studio.html").read_text(encoding="utf-8")
        frag = Fragment(str(html_str).format(block=self))

        #CARGA DE ARCHIVO DE CONFIGURACION
        resource_path = importlib.resources.files(__package__).joinpath('static/data/config_retro.json')
        with open(resource_path, 'r', encoding='utf-8') as file:
            config_retro = json.load(file)

        #Pasar los datos al fragmento HTML
        frag.add_content(
            '<script type= "application/json" id= "checkbox-data">{}</script>'.format(json.dumps(config_retro))
        )


        # Carga de archivos CSS y JavaScript fragments from within the package
        css_str = importlib.resources.files(__package__).joinpath("static/css/epnxblock.css").read_text(encoding="utf-8")
        frag.add_css(str(css_str))


        #Carga de archivos JS
        js_str = importlib.resources.files(__package__).joinpath("static/js/src/epnxblock-studio.js").read_text(encoding="utf-8")
        frag.add_javascript(str(js_str))


        # Carga de Quill CSS y JS
        js_quill = importlib.resources.files(__package__).joinpath("static/js/src/quill.js").read_text(encoding="utf-8")
        frag.add_javascript(str(js_quill))
        frag.initialize_js('EpnXBlockStudio')

        return frag

    #CONTROLADORES 

    @XBlock.json_handler
    def guardar_configuracion(self, data, suffix=''):

        # Imprimir los datos entrantes para verificar si son correctos
        print(f"Datos recibidos: {data}")
        "Manejador que guarda las configuraciones del profesor en los campos GENERAL"
        self.titulo = data.get('titulo')
        self.descripcion = data.get('descripcion')
        self.fecha_entrega = data.get('fecha_entrega')
        #Codigo
        self.codigo_inicial = data.get('codigo_inicial')
        self.test_cases = data.get('test_cases')
        
       
        #Ejemplo de prueba de conseguir atributos del curso 
        """
          self.estudiante_id = str(self.scope_ids.user_id) 
        self.curso_id = str(self.runtime.course_id)  
        self.actividad_id = str(self.scope_ids.usage_id)
        """

        #Guardar JSON en archivo de configuracion y guardar variables clave en Campos 

        new_config_retro = data.get('retro',{})

        for item in new_config_retro.get('retroalimentacion',[]):
            if item.get('name') == 'Pistas':
                self.field_Pista['numero_pistas'] = item['parameters']['numero_pistas']['value']
                self.field_Pista['grado'] = item['parameters']['grado']['value']
                self.field_Pista['state'] = item['state']

        #Ruta de archivo de configuracion
        resource_path = importlib.resources.files(__package__).joinpath('static/data/config_retro.json')

        #Guardado de archivo de configuracion 
        try:
            with open(resource_path, "w", encoding='utf-8') as file:
                json.dump(new_config_retro,file,indent=4)
            return{"result":"success"}
        
        except Exception as e: 
            return {"result": "error","message": str(e)}

      
    
    #Controlador para envio del codigo del estudiante 
    @XBlock.json_handler
    def envio_respuesta(self, data, suffix=''):
        
        #Guardar el codigo del estudiante
        self.codigo_estudiante = data.get('codigo_estudiante')
        #Reduccion de numero de pistas 
        """
            self.numero_pistas = self.numero_pistas -1
            print(self.numero_pistas)
        """
       
        return {
        'result': 'success',
        'message': 'Codigo del estudiante guardado correctamente'
        }
    

    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("EpnXBlock",
             """<epnxblock/>
             """),
            
        ]
    
    
