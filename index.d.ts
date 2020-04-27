declare module '@chris-talman/certificate-manager-client'
{
	// Types
	import * as Request from '@chris-talman/request';

	// Client
	export class Client
	{
		public readonly domain: Request.Domain;
		public readonly accessToken: string;
		/** @see StorageOptions */
		public readonly storage?: StorageOptions;
		constructor({url, accessToken, storage}: {url: string} & Pick<Client, 'accessToken' | 'storage'>);
		public readonly domains: Domains;
	}
	/** Global options for the automatic storage of fetched data in the file system. */
	export interface StorageOptions
	{
		/** Path to directory. */
		directory: string;
	}

	// Resource
	class Resource
	{
		public readonly _client: Client;
		constructor({client}: {client: Client});
	}

	// Domains
	export class Domains extends Resource
	{
		public get(parameters: DomainsParameters): Promise<Domain>;
	}
	// Domains: Get
	export interface DomainsParameters
	{
		id: string;
		/** Overrides global storage options. */
		storage?: StorageOptions | false;
	}
	export interface Domain
	{
		id: string;
		organisationId: string;
		name: string;
		type: DomainType;
		certificate?: string;
		csr?: string;
		privateKey?: string;
		/** Moment at which certificate was issued in Unix milliseconds. */
		issued?: number;
		/** Moment at which certificate expires in Unix milliseconds. */
		expiry?: number;
	}
	export type DomainType = 'route53';
}