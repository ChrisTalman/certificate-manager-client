'use strict';

// External Modules
import { promises as FileSystemPromises } from 'fs';
const { writeFile, mkdir: createDirectory } = FileSystemPromises;
import { guaranteeResultJson, Result } from '@chris-talman/request';

// Internal Modules
import { Domains } from './';

// Types
import { StorageOptions } from 'src/Modules/Client';
import { Domain } from './';
interface Parameters
{
	id: string;
	/** Overrides global storage options. */
	storage?: StorageOptions | false;
};

export async function get(this: Domains, {id, storage}: Parameters)
{
	const result = await this._client.executeApiRequest <Domain, Result<Domain>>
	(
		{
			request:
			{
				method: 'GET',
				path: `/domains/${id}`,
				body:
				{
					pluck:
					[
						'id',
						'organisationId',
						'name',
						'type',
						'certificate',
						'privateKey',
						'issued',
						'expiry',
						{
							route53:
							[
								'accessKeyId',
								'secretAccessKey',
								'hostedZoneId'
							],
							events:
							[
								'id',
								'type',
								'message'
							]
						}
					]
				},
				jsonResponseSuccess: true,
				jsonResponseError: true
			}
		}
	);
	const domain = guaranteeResultJson(result);
	await storeKeys({domain, storage, resource: this});
	return domain;
};

async function storeKeys({domain, storage, resource}: {domain: Domain, storage?: Parameters['storage'], resource: Domains})
{
	storage = storage ?? resource._client.storage;
	if (!storage) return;
	await createDirectory(storage.directory, {recursive: true});
	await Promise.all
	(
		[
			optionalWriteFile({postfix: 'certificate', content: domain.certificate, domain, storage, resource}),
			optionalWriteFile({postfix: 'privateKey', content: domain.privateKey, domain, storage, resource})
		]
	);
};

async function optionalWriteFile({postfix, content, domain, storage, resource}: {postfix: 'certificate' | 'privateKey', content?: string, domain: Domain, storage: StorageOptions, resource: Domains})
{
	if (!content) return;
	const path = resource.generateStoragePath({id: domain.id, postfix, storage});
	await writeFile(path, content);
};