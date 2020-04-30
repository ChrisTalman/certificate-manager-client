'use strict';

// External Modules
import * as Path from 'path';

// Internal Modules
import { Domains } from './';

// Types
import { StorageOptions } from 'src/Modules/Client';

/** Generates a storage path based on the global storage options for the given postfix. */
export function generateStoragePath(this: Domains, {id, postfix, storage}: {id: string, postfix: 'certificate' | 'privateKey', storage?: StorageOptions})
{
	storage = storage ?? this._client.storage;
	if (!storage) throw new Error('Storage not provided to method or client instance');
	const path = Path.join(storage.directory, `${id}_${postfix}.pem`);
	return path;
};