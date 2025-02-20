"""TO-DO: Write a description of what this XBlock is."""

import importlib
import importlib.resources
from typing import Dict
from xblock.fields import Boolean
import logging
import json
import pkg_resources
import requests
import os

#Librerias propias de XBLOCK

from web_fragments.fragment import Fragment
from xblock.core import XBlock, XBlockAside 
from xblock.fields import Integer, Scope, String, Dict, Float

#Funcion de Carga de archivo de configuracion de retroalimentacion 
def cargar_config_retro():
    config_retro_path = importlib.resources.files(__package__).joinpath('static/data/config_retro.json')
    with open(config_retro_path, 'r', encoding='utf-8') as file:
            config = json.load(file)
    return config

#Funcion de Carga de configuracion
def cargar_configuracion_server():
    config_path = importlib.resources.files(__package__).joinpath('static/data/config.json')
    with open(config_path, 'r', encoding='utf-8') as file:
            config_server = json.load(file)
    return config_server


log = logging.getLogger(__name__)

class EpnXBlock(XBlock):
  
    #Campo para almacenar la IP del servidor y puerto
    server = Dict(
        default= cargar_configuracion_server(),
        scope = Scope.settings
    )

    #Campo que almacena el JSON de config_retro para ser inicializado
    config_retro = Dict(
        default=cargar_config_retro(),
        scope = Scope.settings
    )

    #Campos compartidos 
    # Campos Definido por el profesor para que los estudiantes solo vean, solo el profesor puede editarlos
    #Campos generales de la actividad
    titulo = String(
        help="Titulo de la arctividad",
        default= "",
        scope = Scope.content
    )

    descripcion = String(
        help="Ingrese las indicaciones que debe cumplir el código de la actividad",
        default="",
        scope = Scope.content
    )

    salida_esperada = String(
        help="Salida que se vera en consola",
        default="",
        scope= Scope.content 
    )

    fecha_entrega = String(
        help="fecha de entrega de la actividad",
        default="",
        scope= Scope.content
    )

    #Campos para Codigo  
    codigo_inicial = String(
        help="Se almacena el codigo incial brindado por el profesor - OPCIONAL",
        default= "",
        scope= Scope.content
    )

    test_cases = Dict(
        help="Se almacena el codigo incial brindado por el profesor - OPCIONAL",
        default= {},
        scope= Scope.settings
    )

    #Campos estudiamte
    codigo_estudiante = String(
        help="Se almacena el codigo del estudiante para hacer la peticion a la IA",
        default= "",
        scope= Scope.user_state
    )

    #Valor individual de pistas que consume cada estudiante
    pistas_usadas = Integer(
        help="Cantidad de pistas restantes",
        default= 0,
        scope= Scope.user_state
    )
    #Campos retroaliemtación para estudiante

    #Campo bandera diccionario para cada retroalimentacion para mostar al estudiante
    #Se cargan de config_retro pero son propios de cada estudiante 
    field_Pista = Dict(
        default={"label":"Pistas", "numero_pistas": 1,"grado": 0, "state": 0},
        scope = Scope.content
    )

    field_Calificado = Dict(
        default={"label":"Calificado", "state": 0},
        scope = Scope.content
    )

    
    def resource_string(path):
        """Ayudante práctico para obtener recursos de nuestro kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")
    
    #Metodos views 
    #View del estudiante 
    def student_view(self, context=None):
        #Datos JSON que se pasan al fragmento HTML de retroalimentación
        data = {"eva":[{ "Pista": {"label": self.field_Pista["label"], "state": self.field_Pista["state"], "numero_pistas": self.field_Pista["numero_pistas"]}},
        {"Calificado": {"label":self.field_Calificado["label"] ,"state": self.field_Calificado["state"] }}], "pistas_usadas": self.pistas_usadas, "codigo_inicial":self.codigo_inicial, 
        "codigo_estudiante":self.codigo_estudiante}

        #Carga de Fragmento HTML
        html = importlib.resources.files(__package__).joinpath("static/html/epnxblock.html").read_text(encoding="utf-8")
        html = html.format(block=self)
        frag = Fragment(html)

        # Carga de archivos CSS y JS
        css_str = importlib.resources.files(__package__).joinpath("static/css/epnxblock_student.css").read_text(encoding="utf-8")
        frag.add_css(str(css_str))

        js_str = importlib.resources.files(__package__).joinpath("static/js/src/epnxblock.js").read_text(encoding="utf-8")
        frag.add_javascript(str(js_str))

        #Pasar los datos JSON al fragmento HTML
        frag.add_content(
        '<script type="application/json" id="evaluation-data">{}</script>'.format(json.dumps(data))
    )
        frag.initialize_js('EpnXBlock')

        return frag

    #View del profesor 
    def studio_view(self, context = None):
      
        #Carga de Fragmento HTML
        html_str = importlib.resources.files(__package__).joinpath("static/html/epnxblock-studio.html").read_text(encoding="utf-8")
        #Carga de los campos en el HTML
        frag = Fragment(str(html_str).format(block=self))
        #Pasar el campo config_retro 
        frag.add_content(
            '<script type= "application/json" id= "checkbox-data">{}</script>'.format(json.dumps(self.config_retro))
        )
        #Pasar el campo de test_cases
        frag.add_content(
            '<script type= "application/json" id= "test_casesJSON">{}</script>'.format(json.dumps(self.test_cases))
        )
        # Carga de archivo CSS 
        css_str = importlib.resources.files(__package__).joinpath("static/css/epnxblock.css").read_text(encoding="utf-8")
        frag.add_css(str(css_str))
        #Carga de archivo JS para Studio
        js_str = importlib.resources.files(__package__).joinpath("static/js/src/epnxblock-studio.js").read_text(encoding="utf-8")
        frag.add_javascript(str(js_str))
        # Inicializar el JavaScript del XBlock
        frag.initialize_js('EpnXBlockStudio')
        return frag

    #CONTROLADORES
    @XBlock.json_handler
    def guardar_configuracion(self, data, suffix=''):
            try:
                # Almacenamiento de campos compartiodos 
                self.titulo = data.get('titulo')
                self.fecha_entrega = data.get('fecha_entrega')
                self.descripcion = data.get('descripcion')
                self.salida_esperada = data.get('salida_esperada')
                self.codigo_inicial = data.get('codigo_inicial')
                self.test_cases = data.get('test_cases', {})

                # Almacenamiento de campo retroalimentación
                self.config_retro = data.get('retro')
                # Procesar retroalimentación en campo de estudiantes
                new_config_retro = data.get('retro', {})
                for item in new_config_retro.get('retroalimentacion', []):
                    if item.get('name') == 'Pistas':
                        # Almacenar variables en campos para estudiantes 
                        self.field_Pista['numero_pistas'] = item['parameters']['numero_pistas']['value']
                        self.field_Pista['grado'] = item['parameters']['grado']['value']
                        self.field_Pista['state'] = item['state']
                    if item.get('name') == 'Calificado': 
                        self.field_Calificado['state'] = item['state']
                # Extra: Guardar la IP del servidor en el campo
                self.server['server_ip'] = data.get('ip_server', "")
                
            except Exception as e:
                print(f"Error al guardar la configuración: {e}")
                return {"error": str(e)}, 500

    @XBlock.json_handler
    def envio_respuesta(self, data, suffix=''):
        
        # Obtener el ID del estudiante y actividad
        estudiante_id = self.runtime.user_id
        actividad_id = str(self.scope_ids.usage_id)

        print(f"El id es: {estudiante_id}")
        print(f"El id de la actividad es: {actividad_id}")

        # Guardar el código del estudiante
        self.codigo_estudiante = data.get('codigo_estudiante')

        # Función para generar payload de petición al servidor 
        def generar_payload(tipo_retroalimentacion):
            return {
                "id_estudiante": estudiante_id,
                "id_tarea": actividad_id,
                "descripcion_tarea": self.descripcion,
                "codigo_estudiante": self.codigo_estudiante,
                "salida_esperada": self.salida_esperada,
                "tipo_retroalimentacion": tipo_retroalimentacion,
                "contexto_adicional": data.get('contexto_adicional'),
                "salida_compilador": data.get('compilador'),
                "test_case": self.test_cases
            }

        # Verificar si se alcanzaron las pistas máximas
        if self.field_Pista["numero_pistas"] == self.pistas_usadas and data.get('aux') == "Pistas":
            
            return {
                "ia_response": "Ya no se permiten más pistas, se ha alcanzado el límite máximo.",
                "pistas_totales":  self.field_Pista["numero_pistas"],
                "pistas_usadas": self.pistas_usadas,
                "bandera": False
            }

        # Determinar el tipo de retroalimentación
        payload = generar_payload(data.get('aux'))

        # Enlace al servidor desde archivo de configuración
        server_url = f"http://{self.server['server_ip']}:{self.server['server_port']}/api/transaccion"

        # Enviar la petición al servidor
        try:
            print(f"Enviando payload: {payload}")
            response = requests.post(server_url, json=payload)
            response.raise_for_status()  # Levanta excepciones para errores HTTP
            response_data = response.json()

            # Acceder a todo el contenido de 'retroalimentacion'
            retroalimentacion = response_data.get('retroalimentacion', 'Sin retroalimentación')

            # Imprimir el contenido de retroalimentacion en formato JSON legible
            print("Retroalimentación del servidor:")
            print(json.dumps(retroalimentacion, indent=4, ensure_ascii=False))

            # Incrementar las pistas usadas solo si el servidor responde correctamente
            if self.field_Pista["state"] == 1:
                self.pistas_usadas += 1

            return {
                "ia_response": retroalimentacion,
                "pistas_totales": self.field_Pista["numero_pistas"],
                "pistas_usadas": self.pistas_usadas,
                "bandera": True
            }

        except requests.exceptions.RequestException as e:
            print("Error al enviar transacción: ", str(e))
        return {"ia_response": "Error de conexión al servidor de Retroalimentación"}


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
    
#Pista-retorno
# message:
# retroalimentacion: 
# Calificado 
# Pendiente de como retorna     
