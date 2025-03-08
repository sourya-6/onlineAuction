// import {v2} from "cloudinary"

import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

//chai aur backend
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET  // Click 'View API Keys' above to copy your API secret
});
const uploadOnCloudinary=async(localFilePath)=>{
    try{
        if(!localFilePath) return null
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"//which automatically detects the given file is an image,video etc..
        })
        console.log("File Uploaded Successfully!!",response.url);
        fs.unlinkSync(localFilePath)//removes the file from local path
        return response
    }catch{
        fs.unlinkSync(localFilePath)
        return null;
    }
}

const deletefromcloudinary=async(cloudinaryFilePath)=>{
    try{
        if(!cloudinaryFilePath) return null;
        const filename=cloudinaryFilePath.split("/").pop().split(".")[0];
        const response=await  cloudinary.uploader.destroy(filename);
        return response;
    }
    catch(error){
        console.log("Error While deleting the file",error);
        return null
    }
}


export{uploadOnCloudinary,deletefromcloudinary}




