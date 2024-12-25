import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchMutation } from "convex/nextjs";

export async function uploadImage(image: File) {
  try {
    const imageUrl = await fetchMutation(api.storage.generateUploadUrl);

    const result = await fetch(imageUrl, {
      method: "POST",
      headers: {
        "Content-Type": image.type,
      },
      body: image,
    });

    if (!result.ok) {
      throw new Error("Image upload failed:" + result.statusText);
    }

    const { storageId } = await result.json();

    const url = await fetchMutation(api.storage.getUploadUrl, {
      storageId,
    });

    return {
      url,
      storageId,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
}

export async function deleteImage(storageId: Id<"_storage">) {
  try {
    await fetchMutation(api.storage.deleteImage, {
      storageId,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
}
