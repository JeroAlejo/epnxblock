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

    #Definicion de los campos 
    upvotes = Integer(
        help="Numero de votos Afirmativos",
        default=0,
        scope=Scope.user_state_summary
    )

    downvotes = Integer(
        help="Numero de votos Negativos",
        default=0,
        scope=Scope.user_state_summary
    )

    voted = Boolean(
        help = "Confirma si un estudiante Voto",
        default = False,
        scope = Scope.user_state
    )

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

    def resource_string(self, path):
        """Ayudante práctico para obtener recursos de nuestro kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    #Vista de profesor
    def studio_view(self, context = None):
        """
        La vista principal de EpnXBlock, que se muestra a los estudiantes
        cuando visualizan cursos.
        """
        #Carga de Fragmento HTML
        html_str = importlib.resources.files(__package__).joinpath("static/html/epnxblock.html").read_text(encoding="utf-8")
        frag = Fragment(str(html_str).format(block=self))
         # Carga de archivos CSS y JavaScript fragments from within the package
        css_str = importlib.resources.files(__package__).joinpath("static/css/epnxblock.css").read_text(encoding="utf-8")
        frag.add_css(str(css_str))
        js_str = importlib.resources.files(__package__).joinpath("static/js/src/epnxblock.js").read_text(encoding="utf-8")
        frag.add_javascript(str(js_str))
        frag.initialize_js('Profesor_View')

        return frag

    # Vista del estudiante -- PRUEBA 
    def student_view(self, context=None):
        """
        La vista principal de EpnXBlock, que se muestra a los estudiantes
        cuando visualizan cursos.
        """
        
        #Carga de Fragmento HTML
        html_str = importlib.resources.files(__package__).joinpath("static/html/epnxblock_student.html").read_text(encoding="utf-8")
        frag = Fragment(str(html_str).format(block=self))

        # Carga de archivos CSS y JavaScript fragments from within the package
        css_str = importlib.resources.files(__package__).joinpath("static/css/epnxblock_student.css").read_text(encoding="utf-8")
        frag.add_css(str(css_str))

        js_str = importlib.resources.files(__package__).joinpath("static/js/src/epnxblock.js").read_text(encoding="utf-8")
        frag.add_javascript(str(js_str))
        frag.initialize_js('EpnXBlock')

        return frag
    
    
    


    # Método para manejar los datos que se pasan entre las vistas
    @XBlock.json_handler
    def save_shared_data(self, data, suffix=''):
        """Handler para guardar datos compartidos"""
        self.shared_data = data.get('shared_data')
        return {"result": "success"}

    #CONTROLADORES 
    
    #Manejar solicitudes tipo JSON
    @XBlock.json_handler
    def vote(self,data,suffix=''):
        """
        Controlador que actualiza la votacion 
        self: instancia del XBlock actual 
        data: datos enviados desde el fontend como diccionario [voteType] : up o down
        suffix: Opcional
        """
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


    @XBlock.json_handler
    def guardar_configuracion(self, data, suffix=''):
        "Manejador que guarda las configuraciones del profesor en los campos"
        self.titulo = data.get('titulo')
        self.descripcion = data.get('descripcion')
        self.fecha_entrega = data.get('fecha')
        
        return {
            'result':'succes',
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
    
    
