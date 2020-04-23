'use strict';

// External Modules
import { guaranteeResultJson, Result } from '@chris-talman/request';

// Internal Modules
import { Resource } from 'src/Modules/Resource';

// Types
interface Parameters
{
	id: string;
};

export async function get(this: Resource, {id}: Parameters)
{
	const result = await this._client.executeApiRequest <object, Result<object>>
	(
		{
			request:
			{
				method: 'GET',
				path: `/domains/${id}`,
				jsonResponseSuccess: true,
				jsonResponseError: true
			}
		}
	);
	const domain = guaranteeResultJson(result);
	return domain;
};