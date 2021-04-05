import { Atomic } from '@atomic/lib/extensions/Atomic';
import { Inhibitor as AkairoInhibitor, InhibitorOptions } from 'discord-akairo';
export class Inhibitor extends AkairoInhibitor {
	public constructor(id: string, options?: InhibitorOptions) {
		super(id, options);
	}

	public client: Atomic;
}
