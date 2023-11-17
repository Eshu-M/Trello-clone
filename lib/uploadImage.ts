import { ID, storage } from "@/appwrite";

const uploadImage=async (file:File)=>{
    if(!file) return;

    const fileUploaded = await storage.createFile(
        '655227edaf61d2238948',
        ID.unique(),
        file,
    );
    return fileUploaded;
}

export default uploadImage;