export class Message {
  private message: string;
  private timestamp: number;
  private _id: string;

  constructor (message? : string, timestamp? : number) {
    if ( message ) this.message = message;
    if ( timestamp ) this.timestamp = timestamp;
  }
}
