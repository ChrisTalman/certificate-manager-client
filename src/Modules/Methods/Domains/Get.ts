'use strict';

// External Modules
import { promises as FileSystemPromises } from 'fs';
const { writeFile, mkdir: createDirectory } = FileSystemPromises;
import * as Path from 'path';
import { guaranteeResultJson, Result } from '@chris-talman/request';

// Internal Modules
import { Resource } from 'src/Modules/Resource';

// Types
import { StorageOptions } from 'src/Modules/Client';
import { Domain } from './';
interface Parameters
{
	id: string;
	/** Overrides global storage options. */
	storage?: StorageOptions | false;
};

export async function get(this: Resource, {id, storage}: Parameters)
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

async function storeKeys({domain, storage, resource}: {domain: Domain, storage?: Parameters['storage'], resource: Resource})
{
	storage = storage ?? resource._client.storage;
	if (!storage) return;
	await createDirectory(storage.directory, {recursive: true});
	await Promise.all
	(
		[
			optionalWriteFile({postfix: 'certificate.pem', content: domain.certificate, domain, storage}),
			optionalWriteFile({postfix: 'privateKey.pem', content: domain.privateKey, domain, storage})
		]
	);
};

async function optionalWriteFile({postfix, content, domain, storage}: {postfix: string, content?: string, domain: Domain, storage: StorageOptions})
{
	if (!content) return;
	const path = Path.join(storage.directory, `${domain.id}_${postfix}`);
	await writeFile(path, content);
};