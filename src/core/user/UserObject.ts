import { BucketObject } from '../bucket/';
import { PasswordObject } from './HashPassword';
export interface UserObject {
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	password: PasswordObject;
	status: boolean;
	bucket?: Array<BucketObject>;
}
