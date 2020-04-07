'use strict';

// External Modules
import { Domain, Result as RequestResult } from '@chris-talman/request';

// Internal Modules
import { Domains } from './Methods/Domains';

// Types
import { Definition as RequestDefinition } from '@chris-talman/request';

export class Client
{
	public readonly domain: Domain;
	public readonly accessToken: string;
	constructor({domain, accessToken}: Pick<Client, 'domain' | 'accessToken'>)
	{
		this.accessToken = accessToken;
		const url = `https://${domain}`;
		this.domain = new Domain
		(
			{
				path: url,
				auth: () => 'Bearer ' + accessToken
			}
		);
	};
	public domains = new Domains({client: this});
	public async executeApiRequest <GenericResultJson, GenericResult extends RequestResult<GenericResultJson>> ({request}: {request: RequestDefinition})
	{
		const result: GenericResult = await this.domain.request(request);
		return result;
	};
};