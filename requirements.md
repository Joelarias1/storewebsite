# Requisitos del Proyecto: Sistema de Foros en Línea

## Parte I: Documentación y Entrega

*   **Entrega:** Se debe entregar en un archivo comprimido (.rar o .zip) que contenga:
    *   Código fuente de la aplicación FrontEnd (Angular).
    *   Código fuente de los Microservicios desarrollados (Spring Boot).
    *   Script de la BD Oracle (`schema.sql`, `data.sql`).
    *   Código fuente del arquetipo (si aplica).

## Requisitos Generales del Sistema

*   **Temática:** Sistema de foros en línea.
*   **Categorías:** Debe tener al menos 5 categorías diferentes de temas (a elección del desarrollador).
*   **Roles:** La aplicación debe contar con al menos 2 roles/tipos de usuarios con privilegios diferentes (ej. Usuario, Administrador/Moderador). Puede haber más roles.
*   **Diseño:**
    *   Libre elección de colores, logos, nombre e imágenes.
    *   Se puede guiar de páginas existentes manteniendo originalidad.
    *   Se pueden usar herramientas de diseño (Photoshop, Gimp, Illustrator, web).
*   **Pagos:** No implementar sistemas de pago reales. Si es necesario, simular con páginas de éxito.

## Requisitos Específicos del FrontEnd (Angular)

*   **Tecnologías:**
    *   Framework: Angular (versión actual).
    *   HTML, CSS (versiones actuales).
    *   **Nota:** Se menciona Bootstrap y JS/JQuery, pero el proyecto actual usa **TailwindCSS**. Se debe clarificar o asumir TailwindCSS como principal.
*   **Adaptabilidad (Responsive Design):**
    *   La interfaz debe adaptarse a mínimo 3 tamaños de pantalla diferentes.
    *   Basado en un GRID de 12 columnas.
*   **GIT:** Manejo y organización del trabajo grupal usando GIT.
*   **Pantallas Obligatorias:**
    *   Inicio de sesión.
    *   Registro de usuarios.
    *   Recuperar contraseña.
    *   Modificación de perfil.
*   **Pantallas Adicionales:** Generar páginas internas para las funcionalidades del sistema (ver foro, ver categoría, ver post, crear post, etc.).
*   **Formularios y Validaciones:**
    *   Todos los formularios deben tener validaciones correspondientes para cada campo.
    *   **Validaciones de Contraseña:** Al menos 4 validaciones (ej. longitud mínima/máxima, caracteres especiales, números y letras).
*   **Manipulación de Información:**
    *   Usar variables de Angular (listas, arreglos, colecciones).
    *   Comunicarse con los microservicios mediante APIs para obtener y guardar información.
*   **Patrón de Diseño:** Utilizar un patrón de diseño acorde a los requerimientos.
*   **Pruebas Unitarias:**
    *   Integrar pruebas unitarias con Karma.
    *   Configurar Karma y SonarQube.
    *   Alcanzar al menos el 80% de cobertura de código.
    *   Ejecución y comprobación de pruebas/cobertura con SonarQube de forma local (no en Docker).

## Requisitos Específicos del BackEnd (Spring Boot)

*   **Framework:** Spring Boot.
*   **Base de Datos:**
    *   Comunicarse mediante CRUD con una base de datos Oracle Cloud.
*   **GIT:** Manejo y organización del trabajo utilizando GIT.
*   **API:**
    *   Devolver información mediante APIs en formato JSON.
    *   Cumplir con todos los requisitos de usuario.
*   **Arquetipo:** Construidos mediante el arquetipo diseñado (si aplica).
*   **Microservicios:** Desarrollar los siguientes:
    *   **Microservicio de Usuarios:**
        *   Control de usuarios (Crear, Modificar, Eliminar).
        *   Inicio de sesión.
    *   **Microservicio del Foro:**
        *   Búsqueda, visualización, publicación y comentar temas por parte de los usuarios.
    *   **Microservicio de Gestión/Moderación:**
        *   Gestión de publicaciones y comentarios por parte de un administrador (ej. banear temas/comentarios que incumplan normas).
*   **Comunicación:** El frontend Angular debe comunicarse con *todos* los microservicios desarrollados.

## Parte II: Presentación

*   **Herramienta:** Kaltura.
*   **Video:** Máximo 10 minutos.
*   **Contenido del Video:**
    *   Mostrar funcionamiento y comunicación FrontEnd/BackEnd de manera local.
    *   Mostrar características, diseño, funcionalidades.
    *   Explicar patrones y arquetipos desarrollados.
    *   Comprobar el porcentaje de cobertura solicitado (SonarQube).
    *   Mostrar la ejecución de las pruebas unitarias en Angular.
    *   Mostrar en tiempo real *todas* las funcionalidades requeridas cumpliendo los requisitos.
*   **Entrega:** Adjuntar el video a la actividad. 