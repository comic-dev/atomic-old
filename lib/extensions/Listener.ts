import { Atomic } from '@atomic/lib/extensions/Atomic';
import { Listener as AkairoListener, ListenerOptions } from 'discord-akairo';
export class Listener extends AkairoListener {
	public constructor(id: string, options?: ListenerOptions) {
		super(id, options);
	}

	public client: Atomic;
}
