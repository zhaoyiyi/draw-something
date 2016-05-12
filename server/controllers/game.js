import { UsersInstance, GameInstance } from '../models';

export default class GameController {
  constructor(io, socket) {
    this.users = UsersInstance();
    this.game = GameInstance();
    this.io = io;
    this.socket = socket;
  }

  countDown() {
    let time = this.game._TIME / 1000 - 1;
    this.game.interval = setInterval(() => {
      io.emit('game:timeLeft', time);
      time = time - 1;
    }, 1000);
  }

  onNewUser() {
    this.users.addUser(this.socket.id);
    this.user = this.users.find(this.socket.id);
  }
  
  onReady() {
    
  }

  onSetUsername() {
    this.socket.on('game:setUsername', (name) => {
      this.user.name = name;
      this.socket.emit('game:user', this.user);
      this.io.emit('game:userList', this.users.getUserList());
    });
  }

  onUserList() {
    this.socket.on('game:userList', () => {
      this.socket.emit('game:userList', this.users.getUserList());
    });
  }

  gameStart() {
    this.game.start(() => {
      this.countDown();
      this.gameEnd();
    });
  }

  gameEnd() {
    this.users.unReadyAll();
    // canvas.clear();
    this.game.end();
    this.io.emit('game:end', { user: user, message: `Answer is ${game.answer}` });
  }
}
