'use strict';

// External Modules
import { Domain, Result as RequestResult } from '@chris-talman/request';

// Internal Modules
import { Domains } from './Methods/Domains';

// Types
import { Definition as RequestDefinition } from '@chris-talman/request';
/** Global options for the automatic storage of fetched data in the file system. */
export interface StorageOptions
{
	/** Path to directory. */
	directory: string;
};

// Constants
const URL_EXPRESSION = /^https:\/\//;

export class Client
{
	public readonly domain: Domain;
	public readonly accessToken: string;
	/** @see StorageOptions */
	public readonly storage?: StorageOptions;
	constructor({url, accessToken, storage}: {url: string} & Pick<Client, 'accessToken' | 'storage'>)
	{
		if (!URL_EXPRESSION.test(url))
		{
			throw new Error('URL must start with https://');
		};
		this.domain = new Domain
		(
			{
				path: url,
				auth: () => 'Bearer ' + accessToken,
				queryBody: 'body'
			}
		);
		this.accessToken = accessToken;
		this.storage = storage;
	};
	public domains = new Domains({client: this});
	public async executeApiRequest <GenericResultJson, GenericResult extends RequestResult<GenericResultJson>> ({request}: {request: RequestDefinition})
	{
		const result: GenericResult = await this.domain.request(request);
		return result;
	};
};