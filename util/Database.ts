import { Connection, ConnectionManager } from 'typeorm';
export class Database {
	public connection: Connection;
	private _uri: string;

	public constructor(mongoURI: string) {
		this._uri = mongoURI;
		this._init();
	}

	private async _init(): Promise<void> {
		this.connection = await new ConnectionManager()
			.create({
				type: 'mongodb',
				name: 'atomic',
				url: this._uri,
				useUnifiedTopology: true,
				useNewUrlParser: true
			})
			.connect();
		console.log(this.connection);
	}
}
