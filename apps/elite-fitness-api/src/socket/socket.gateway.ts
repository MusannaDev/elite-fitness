import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, } from 'ws';
import * as WebSocket from "ws";
import { AuthService } from '../components/auth/auth.service';
import { Member } from '../libs/dto/member/member';
import * as url from "url";

interface MessagePayload {
  event: string;
  text: string;
  memberData: Member;
}
interface InfoPayload {
  event: string;
  totalClients: number;
  memberData: Member;
  action: string;
}

@WebSocketGateway({ transports: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
  private logger: Logger = new Logger('SocketEventGateway');
  private summaryClient: number = 0;
  private clientAuthMap = new Map<WebSocket, Member>();
  private messageList: MessagePayload[] = [];
  private readonly MAX_MESSAGE_LENGTH = 500;
  private readonly MAX_STORED_MESSAGES = 5;

  constructor(private authService: AuthService) {};  

  @WebSocketServer()
  server: Server;

  public afterInit(server: Server) {
    this.logger.verbose(`WebSocket Server Initialized & total: [${this.summaryClient}]`);
  }

  private async retrieveAuth(req: any): Promise<Member> {
    try {
      const parseUrl = url.parse(req.url, true);
      const { token } = parseUrl.query;
      
      return await this.authService.verifyToken(token as string);
    } catch(err) {
      return null
    }
  }

  public async handleConnection(client: WebSocket, req: any) {
    const authMember = await this.retrieveAuth(req);
    this.summaryClient++;
    this.clientAuthMap.set(client, authMember);

    const clientNick: string = authMember?.memberNick ?? "Guest"
    this.logger.verbose(`Connection [${clientNick}] & total: [${this.summaryClient}]`);

    const infoMsg: InfoPayload = {
      event: 'info',
      totalClients: this.summaryClient,
      memberData: authMember,
      action: 'joined',
    };
    this.emitMessage(infoMsg);
    //Client Messages
    client.send(JSON.stringify({ event: "getMessages", list: this.messageList }));
  }

  public handleDisconnect(client: WebSocket) {
    const authMember = this.clientAuthMap.get(client);
    this.summaryClient--;
    this.clientAuthMap.delete(client);

    const clientNick: string = authMember?.memberNick ?? "Guest";
    this.logger.verbose(`Disconnected [${clientNick}] & total: [${this.summaryClient}] `);

    const infoMsg: InfoPayload = {
      event: 'info',
      totalClients: this.summaryClient,
      memberData: authMember,
      action: 'left'
    };
    this.emitMessage(infoMsg);
  }


  @SubscribeMessage('message')
  public async handleMessage(client: any, payload: unknown): Promise<void> {
    const authMember = this.clientAuthMap.get(client);
    const normalizedText = this.normalizePayload(payload);
    if (!normalizedText) return;

    const newMessage: MessagePayload = { event: "message", text: normalizedText, memberData: authMember };

    const clientNick: string = authMember?.memberNick ?? "Guest";
    this.logger.verbose(`NEW MESSAGE [${clientNick}]: ${normalizedText}`);

    this.messageList.push(newMessage);
    if (this.messageList.length > this.MAX_STORED_MESSAGES) {
      this.messageList.splice(0, this.messageList.length - this.MAX_STORED_MESSAGES);
    }

    this.emitMessage(newMessage);
  }

  private emitMessage(message: InfoPayload | MessagePayload) {
    this.server.clients.forEach((client) => {
      if(client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    })
  }

  private normalizePayload(payload: unknown): string | null {
    if (typeof payload !== 'string') return null;

    const text = payload.trim();
    if (!text) return null;

    if (text.length <= this.MAX_MESSAGE_LENGTH) return text;
    return text.slice(0, this.MAX_MESSAGE_LENGTH);
  }

}
