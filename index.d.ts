declare module '@chris-talman/certificate-manager-client'
{
	// Client
	export class Client
	{
		public readonly domain: string;
		public readonly accessToken: string;
		constructor({domain, accessToken}: Pick<Client, 'domain' | 'accessToken'>);
		public readonly domains: Domains;
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