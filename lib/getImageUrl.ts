import { storage } from "@/appwrite"

const getImageUrl=async(image:Image)=>{
    const imageUrl = storage.getFilePreview(image.bucketId,image.fileId);
    return imageUrl;
}
export default getImageUrl;