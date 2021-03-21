import { ILeft } from "./Either";
export default function <A>(value: A): ILeft<A> {
  return { value, tag: "left" };
}
