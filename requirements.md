# Requisitos del Sistema de Foros en Línea

## 1. Visión General

El objetivo es desarrollar la interfaz de usuario (Frontend) para un sistema de foros en línea utilizando el proyecto Angular existente como base. La aplicación permitirá a los usuarios registrarse, iniciar sesión, participar en discusiones dentro de categorías temáticas y modificar su perfil. También incluirá funcionalidades de administración para la gestión del contenido.

## 2. Características Generales

*   **Plataforma Base:** El proyecto se desarrollará sobre la base del código Angular existente (`tabletop-treasures`), adaptando y ampliando su estructura.
*   **Roles de Usuario:** La aplicación debe soportar al menos dos roles con diferentes privilegios:
    *   **Usuario Registrado:** Puede ver categorías y temas, crear nuevos temas, publicar comentarios, buscar contenido y modificar su propio perfil.
    *   **Administrador/Moderador:** Posee todos los permisos del Usuario Registrado, y adicionalmente puede gestionar publicaciones y comentarios (ej. banear/eliminar contenido que incumpla las normas).
    *   Pueden existir múltiples usuarios con el mismo rol.
*   **Diseño y UX:**
    *   El diseño (colores, logo, nombre, imágenes) será definido por el equipo de desarrollo.
    *   Se permite inspiración en sitios existentes, pero se fomentará la originalidad.
    *   Se utilizarán las tecnologías de frontend ya presentes (Angular, TypeScript, Bootstrap, FontAwesome).

## 3. Páginas y Vistas Requeridas

### 3.1. Páginas Estándar de Autenticación y Usuario

*   **Inicio de Sesión (`/login`):** Formulario para que los usuarios existentes accedan a sus cuentas.
*   **Registro de Usuarios (`/register`):** Formulario para que nuevos usuarios creen una cuenta.
*   **Recuperar Contraseña (`/forgot-password`):** Formulario y proceso para que los usuarios restablezcan su contraseña olvidada (simulado o funcional según alcance posterior).
*   **Modificación de Perfil (`/profile/edit`):** Página donde los usuarios pueden actualizar su información personal (ej. nombre de usuario, avatar, contraseña).

### 3.2. Páginas del Foro

*   **Página Principal / Índice de Categorías (`/` o `/forums`):** Muestra la lista de las categorías principales del foro.
*   **Vista de Categoría (`/category/:categoryId`):** Muestra la lista de temas/hilos dentro de una categoría específica.
*   **Vista de Tema/Hilo (`/thread/:threadId`):** Muestra el contenido de un tema específico, incluyendo el post original y los comentarios/respuestas.
*   **Formulario de Creación de Tema (`/category/:categoryId/new-thread`):** Formulario para que los usuarios creen un nuevo tema dentro de una categoría.
*   **Página de Resultados de Búsqueda (`/search?q=...`):** Muestra los resultados de búsqueda de temas/comentarios.

### 3.3. Páginas de Administración (Acceso Restringido)

*   **Panel de Administración (Opcional, `/admin`):** Un lugar centralizado para las herramientas de moderación (alternativamente, las acciones de moderación pueden estar integradas directamente en las vistas del foro).

## 4. Funcionalidades Específicas

*   **Categorías:** Debe haber al menos 5 categorías de temas diferentes (los nombres y temas específicos quedan a elección del equipo).
*   **Publicación:** Los usuarios registrados pueden crear nuevos temas y añadir comentarios a temas existentes.
*   **Visualización:** Todos los usuarios (registrados o no, según se defina) pueden ver categorías y temas. La visualización de comentarios puede requerir inicio de sesión.
*   **Búsqueda:** Funcionalidad para buscar temas o comentarios por palabras clave.
*   **Gestión de Contenido (Admin):** Los administradores/moderadores pueden banear (ocultar/marcar) o eliminar temas/comentarios que violen las normas del foro.

## 5. Seguridad y Validaciones

*   **Validaciones de Contraseña (Registro y Modificación de Perfil):**
    *   Longitud mínima (ej. 8 caracteres).
    *   Uso de caracteres especiales (ej. al menos uno: `!@#$%^&*()`).
    *   Uso de números (ej. al menos un dígito).
    *   Uso de letras mayúsculas y minúsculas.
    *   *Opcional:* Longitud máxima.
*   **Validaciones de Formularios:** Todos los campos en los formularios (Registro, Login, Creación de Tema, Comentario, Perfil, etc.) deben tener validaciones apropiadas (ej. campos requeridos, formato de email, longitud de texto).

## 6. Exclusiones

*   **Sistemas de Pago:** No se implementarán sistemas de pago reales. Si alguna funcionalidad lo requiere hipotéticamente, se simulará con páginas estáticas indicando éxito/fallo.

## 7. Arquitectura Frontend (Consideraciones)

*   Aunque los microservicios backend no se implementan en esta fase, la estructura del frontend debe considerar la separación lógica de funcionalidades:
    *   **Flujo de Usuario:** Búsqueda, visualización, publicación, comentarios.
    *   **Flujo de Administración:** Gestión de publicaciones y comentarios.
*   Se utilizará Angular con SSR, TypeScript, Bootstrap y FontAwesome.

## 8. Próximos Pasos (Fase Frontend)

1.  Crear/Adaptar la estructura de componentes y módulos en Angular.
2.  Implementar el sistema de enrutamiento para las páginas requeridas.
3.  Desarrollar los componentes de UI para cada página y formulario.
4.  Implementar las validaciones de formularios y contraseña.
5.  Simular la gestión de estado de autenticación y roles en el frontend (ej. mediante servicios y/o LocalStorage).
6.  Utilizar datos simulados (mock data) para poblar las vistas del foro hasta que el backend esté disponible.
7.  Aplicar estilos consistentes según el diseño definido. 