import Content from "./Content";
import db from "./db.json";
export default function page() {
  return <Content db={db} />;
}
