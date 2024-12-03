const { Controller, Post } = require("@nestjs/common");
const { UsersService } = require("./users.service");

class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  @Post("reset-problems")
  async resetProblems() {
    return this.usersService.resetProblemsFlag();
  }
}

module.exports = { UsersController };
