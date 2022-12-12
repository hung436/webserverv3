// import { Logger } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";
// import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
// import { Socket } from "socket.io";
// import { UsersService } from "src/users/users.service";

// @WebSocketGateway(3006, { cors: true })
// export class AppGateway
//   implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
// {
//   @WebSocketServer() server: Server;
//   private logger: Logger = new Logger('MessageGateway');
//   constructor(
//     private userService: UsersService,
//     private jwtService: JwtService,
//   ) {}

//   //function get user from token
//   async getDataUserFromToken(client: Socket): Promise<UserEntity> {
//     const authToken: any = client.handshake?.query?.token;
//     try {
//       const decoded = this.jwtService.verify(authToken);

//       return await this.userService.getUserByEmail(decoded.email); // response to function
//     } catch (ex) {
//       throw new HttpException('Not found', HttpStatus.NOT_FOUND);
//     }
//   }
// }
