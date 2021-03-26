import { IRight } from "./Either";

export default function <B>(value: B): IRight<B> {
	return { value, tag: "right" };
}
