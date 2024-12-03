const { Module } = require("@nestjs/common");
const { SequelizeModule } = require("@nestjs/sequelize");
const { User } = require("./user.model");
const { UsersService } = require("./users.service");
const { UsersController } = require("./users.controller");

module.exports = {
  AppModule: Module({
    imports: [
      SequelizeModule.forRoot({
        dialect: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "111992",
        database: "user-service",
        models: [User],
        autoLoadModels: true,
        synchronize: true,
      }),
      SequelizeModule.forFeature([User]),
    ],
    providers: [UsersService],
    controllers: [UsersController],
  }),
};
