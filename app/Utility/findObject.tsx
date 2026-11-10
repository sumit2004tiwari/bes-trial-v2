export default function findObject(key: any, db: any, value: any) {
  const dbChildren = db.filter((item) => item.id == value);
  return dbChildren?.[0];
}
