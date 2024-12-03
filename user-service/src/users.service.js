const { Injectable } = require("@nestjs/common");
const { InjectModel } = require("@nestjs/sequelize");
const { User } = require("./user.model");

class UsersService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async resetProblemsFlag() {
    const count = await this.userModel.count({
      where: { problems: true },
    });

    await this.userModel.update(
      { problems: false },
      {
        where: { problems: true },
      }
    );

    return { count };
  }
}

module.exports = { UsersService };
