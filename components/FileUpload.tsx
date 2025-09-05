'use client';
import React from "react";
// import {  ImageKitProvider } from '@imagekit/next';
// import { IKImage } from "imagekitio-react";
import config from '@/lib/config'
import ImageKit from 'imagekit';
import { IKUpload, IKImage, IKContext ,IKVideo} from "imagekitio-react";
import { useRef,useState } from "react";
import Image from "next/image";
import {toast} from "sonner";
import {cn} from "@/lib/utils";

const { env: { imagekit: { publicKey, urlEndpoint } } } = config;
const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status} ${errorText}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error('Authentication error:', error);
    throw new Error(`Authentication failed: ${error.message}`);
  }
};
interface Props{
  type :'image'|'video';
  accept:string;
  placeholder:string;
  folder:string;
  variant:'dark'|'light';
  onFileChange:(filePath:string)=>void;
  value?:string;
}
const FileUpload = ({type,accept,placeholder,folder,variant,onFileChange,value}:Props) => {
  const ikUploadREf=useRef(null);
  const [file,setFile]=useState<{filePath:string | null}>({filePath: value ?? null});
  const [progress,setProgress]=useState(0);
  const styles={
    button: variant==='dark'?'bg-dark-300':'bg-light-600 border-gray-100 border',
    placeholder:variant==='dark'?'text-light-100':'text-slate-500',
    text: variant==='dark'?'text-light-100':'text-dark-400'
  }

  const onError = (error: any) => {
    console.log(error);
    toast(`${type} Upload Failed`, {
      description: `your ${type} could not be uploaded. Please try again later`,

    })
  }
  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);
    toast(`${type} Uploaded Successfully`, {
      description: `${res.filePath} uploaded successfully!`,

    })
  }

  const onValidate=(file:File)=>{
    if(type==='image'){
      if(file.size>24*1024*1024){
        toast.error('Image size should be less than 24MB')
        return false
      }
    }
      else if(type==='video'){
        if(file.size>50*1024*1024){
          toast.error('Video size should be less than 100MB')
          return false
        }
      }
      return true;
  }

  const ikUpload = useRef(null);
  // const [file, setFile] = useState<{ filePath: string } | null>(null);
  return (
  <IKContext
    publicKey={publicKey}
    urlEndpoint={urlEndpoint}
    authenticator={authenticator}
  >
    <IKUpload

      className="upload-button hidden"
      ref={ikUpload}
      onError={onError}
      onSuccess={onSuccess}
      useUniqueFileName={true}
      validateFile={onValidate}
      onUploadStart={()=>setProgress(0)}
      onUploadProgress={({ loaded, total }) => {
        const percent = Math.round((loaded / total) * 100);
        setProgress(percent);
      }}
      folder={folder}
      accept={accept}
       />

    <button className={cn("upload-btn",styles.button)} onClick={(e) => {
      e.preventDefault();
      if (ikUpload.current) {
        // @ts-ignore
        ikUpload.current?.click();
      }

    }}>
      <Image
        src="/icons/upload.svg"
        alt="upload"
        width={24}
        height={24}
        className="object-contain"
      />
      <p className={cn("text-base text-light-100",styles.placeholder)}>{placeholder}</p>

    </button>

    {progress>0 && progress!=100 && (
      <div className="w-full rounded-full bg-green-200">
        <div className="progress" style={{width:`${progress}%`}}>
          {progress}%
        </div>
      </div>)}
    {file && (
        (type==='image')?(
      <IKImage
        alt={file.filePath}
        path={file.filePath}
        width={500}
        height={500} />
        ):type==='video' && (
        <IKVideo
        alt={file.filePath}
        path={file.filePath}
        className="h-96 w-full rounded-xl"/>
        ))}
  </IKContext>
);
};


export default FileUpload;
