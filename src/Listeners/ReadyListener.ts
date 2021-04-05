import { Listener } from '@atomic/lib/extensions/Listener';
export default class ReadyListener extends Listener {
	public constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
			category: 'client'
		});
	}

	public exec(): void {
		console.log(`[${this.client.user.username}] Connected to Discord Gateway`);
		this.client.user.setActivity({
			type: 'WATCHING',
			name: `@Atomic help | ${this.client.users.cache.size.toLocaleString()} users`
		});
	}
}
