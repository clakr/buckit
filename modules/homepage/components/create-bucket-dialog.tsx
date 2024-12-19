import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function CreateBucketDialog() {
  return (
    <>
      <DialogHeader>
        <DialogHeader>
          <DialogTitle>Create Bucket</DialogTitle>
          <DialogDescription>
            Input details below to create a new bucket.
          </DialogDescription>
        </DialogHeader>
      </DialogHeader>
    </>
  );
}
