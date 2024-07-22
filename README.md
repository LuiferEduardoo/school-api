# Api school

Esta API está diseñada para gestionar las funcionalidades de una escuela, incluyendo horarios, calendarios, niveles académicos, notificaciones, proyectos institucionales, solicitudes de admisión, banners, gestión de archivos y roles con permisos específicos.

## Base de Datos

La API utiliza PostgreSQL como sistema de gestión de bases de datos. Para entornos de desarrollo local, puedes usar Docker. Ejecuta el siguiente comando para iniciar la base de datos en Docker:

```sh
    docker-compose up -d postgres
```


En el archivo docker-compose.yml está toda la configuración de Docker. Puedes hacer cambios a la configuración en dicho archivo.

Para ejecutar migraciones, utiliza el siguiente comando:

```sh
    npm run migrations:run
```
# Redis
La API utiliza redis como base de datos en memoria. Ejecuta el siguiente comando para iniciar la base de datos en Docker: 

```sh
    docker-compose up -d redis
```

# Configuración de Entorno
Crea un archivo .env en la raíz del proyecto para gestionar las variables de entorno. Un ejemplo de archivo .env podría ser:

```makefile
    NODE_ENV=development
    PATH_TO_UPLOADS=uploads
    PORT=3000
    DB_USER=your_user_db
    DB_PASSWORD=your_password_db
    DB_HOST=your_host_db
    DB_NAME=your_name_db
    DB_PORT=your_port_db
    DB_TEST_PORT=your_port_db
    DB_TEST_USER=test_luifer
    DB_TEST_PASSWORD=your_password_db
    DB_TEST_NAME=your_name_db
    REDIS_HOST=your_host_redis
    REDIS_PORT=your_port_redis
    REDIS_USER=your_redis_user
    REDIS_PASSWORD=your_password_of_redis
    JWT_SECRET_RECOVERY_PASSWORD=your_secret
    JWT_SECRET_REFRESH_TOKEN=your_secret
    JWT_SECRET_ACCESS_TOKEN=your_secret
    EMAIL_HOST=your_email_host
    EMAIL_PORT=your_email_port
    EMAIL_USER=your_email_user
    EMAIL_PASSWORD=your_email_password
    DEFAULT_USER_NAME=your_defaultUser_name
    DEFAULT_USER_LASTNAME=your_defaultUser_lastname
    DEFAULT_USER_EMAIL=your_defaultUser_email
    DEFAULT_USER_USERNAME=your_defaultUser_username
    DEFAULT_USER_PASSWORD=your_defaultUser_password
    FRONTEND_URL=yout_frontend_url
```

# Ejecución en Local

Para iniciar la base de datos, utiliza el siguiente comando:
```sh
    docker-compose up -d postgres && docker-compose up -d postgres_test
```

Para iniciar Redis, utiliza el siguiente comando:
```sh
    docker-compose up -d redis
```

Para iniciar la API localmente, utiliza el siguiente comando:
```sh
    npm run dev
```


# Ejecución en Producción
Para ejecutar la API en producción, necesitas configurar la base de datos, las credenciales en el archivo .env, configurar Redis, instalar las dependencias y ejecutar el siguiente comando:

```sh 
    npm run deploy
```
# Tests
 - **Unit Tests:** Para ejecutar los tests unitarios, utiliza el siguiente comando:
```sh
    npm run test:unit
```
- **Integration Tests:** Para ejecutar los tests de integración, utiliza el siguiente comando:
```sh
    npm run test:integration
```
# Documentación
La documentación de la API está disponible en el siguiente enlace: [Documentación API](https://documenter.getpostman.com/view/17313863/2sA3e5f8gF)

# Licencia
Esta API está disponible bajo la licencia All Rights Reserved. Ver el archivo LICENSE para más información.