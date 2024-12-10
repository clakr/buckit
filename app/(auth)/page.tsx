import { fetchBucketsByUserId } from "@/database/actions/bucket";
import Screen from "@/modules/homepage/screen";

export default async function Page() {
  const buckets = await fetchBucketsByUserId();

  return <Screen data={buckets} />;
}
