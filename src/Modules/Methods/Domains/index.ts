'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';
import { get } from './Get';

// Types
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
};
export type DomainType = 'route53';

export class Domains extends Resource
{
	public get = get;
};