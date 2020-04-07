'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';
import { get } from './Get';

export class Domains extends Resource
{
	public get = get;
};