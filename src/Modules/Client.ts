'use strict';

// External Modules
import { Domain, Result as RequestResult } from '@chris-talman/request';

// Internal Modules
import { Domains } from './Methods/Domains';

// Types
import { Definition as RequestDefinition } from '@chris-talman/request';

// Constants
const URL_EXPRESSION = /^https:\/\//;

export class Client
{
	public readonly domain: Domain;
	public readonly accessToken: string;
	constructor({url, accessToken}: {url: string} & Pick<Client, 'accessToken'>)
	{
		if (!URL_EXPRESSION.test(url))
		{
			throw new Error('URL must start with https://');
		};
		this.domain = new Domain
		(
			{
				path: url,
				auth: () => 'Bearer ' + accessToken
			}
		);
		this.accessToken = accessToken;
	};
	public domains = new Domains({client: this});
	public async executeApiRequest <GenericResultJson, GenericResult extends RequestResult<GenericResultJson>> ({request}: {request: RequestDefinition})
	{
		const result: GenericResult = await this.domain.request(request);
		return result;
	};
};