export default () => ({
  database: {
    mysql: {
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306', 10),
      username: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'Alfred4321',
      database: process.env.MYSQL_DATABASE || 'bd_usuarios',
    },
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/',
    },
  },
  app: {
    port: parseInt(process.env.PORT || '3000', 10),
    environment: process.env.NODE_ENV || 'development',
  },
});