export enum DeviceType {
	AVR,
	RBPY,
	OTHER,
}

export interface DeviceObject {
	macAdress: string;
	name: string;
	type?: DeviceType;
}
