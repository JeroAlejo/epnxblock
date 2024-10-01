"""TO-DO: Write a description of what this XBlock is."""

from asyncio import log
import importlib
from xblock.fields import Boolean
import logging

#Librerias propias de XBLOCK
import pkg_resources
from web_fragments.fragment import Fragment
from xblock.core import XBlock, XBlockAside
from xblock.fields import Integer, Scope, String

log = logging.getLogger(__name__)

class EpnXBlock(XBlock):
    """
    TO-DO: document what your XBlock does.
    """

    # Los campos (Fields) Se definen en la Clase.  Se puede Acceder a ellos de la manera
    # self.<fieldname>(Campo).

    #Definicion de los campos para Votacion 
   

    #Campo para almacenar informacion: PRUEBA ------------------------
    titulo = String(
        help="Titulo de la arctividad",
        default=None,
        scope = Scope.user_state
    )

    descripcion = String(
        help="Descripcion de la arctividad",
        default=None,
        scope = Scope.user_state
    )

    fecha_entrega = String(
        help="Fecha de la arctividad",
        default=None,
        scope = Scope.user_state
    )

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
        css_str = importlib.resources.files(__package__).joinpath("static/css/epnxblock.css").read_text(encoding="utf-8")
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
         # Carga de archivos CSS y JavaScript fragments from within the package
        css_str = importlib.resources.files(__package__).joinpath("static/css/epnxblock.css").read_text(encoding="utf-8")
        frag.add_css(str(css_str))
        js_str = importlib.resources.files(__package__).joinpath("static/js/src/epnxblock-studio.js").read_text(encoding="utf-8")
        frag.add_javascript(str(js_str))
        frag.initialize_js('EpnXBlockStudio')

        return frag

    #CONTROLADORES 
    """
    #Manejar solicitudes tipo JSON
    @XBlock.json_handler
    def vote(self,data,suffix=''):
        
        #Controlador que actualiza la votacion 
        #self: instancia del XBlock actual 
        #data: datos enviados desde el fontend como diccionario [voteType] : up o down
        #suffix: Opcional
        
        if data['voteType'] not in ('up','down'):
            log.error('error!')
            return None
        
        if data['voteType'] == 'up':
            self.upvotes +=1
        else:
            self.downvotes +=1
        
        self.voted = True

        #Retorna un diccionario
        return {'up': self.upvotes, 'down': self.downvotes}
    """

    @XBlock.json_handler
    def guardar_configuracion(self, data, suffix=''):
        "Manejador que guarda las configuraciones del profesor en los campos"
        self.titulo = data.get('titulo')
        self.descripcion = data.get('descripcion')
        self.fecha_entrega = data.get('fecha')
        
        return {
            'result':'success',
            'message':'Datos guardados correctament'
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
    
    
