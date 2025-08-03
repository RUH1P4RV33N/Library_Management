'use client';
import React from "react";
// import {  ImageKitProvider } from '@imagekit/next';
// import { IKImage } from "imagekitio-react";
import config from '@/lib/config'
import ImageKit from 'imagekit';
import { IKUpload, IKImage, IKContext } from "imagekitio-react";
import { useRef,useState } from "react";
import Image from "next/image";
import {toast} from "sonner";

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
const ImageUpload = ({onFileChange}:{onFileChange:(filePath:string)=>void}) => {
  const onError = (error: any) => {
    console.log(error);
    toast("Image Upload Failed", {
      description: `your image could not be uploaded. Please try again later`,

    })
  }
  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);
    toast("Image Uploaded Successfully", {
      description: `${res.filePath} uploaded successfully!`,

    })
  }
  const ikUpload = useRef(null);
  const [file, setFile] = useState<{ filePath: string } | null>(null);
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
      fileName="test-upload.png" />

    <button className="upload-btn" onClick={(e) => {
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
      <p className="text-base text-light-100">Upload a File</p>
      {file && <p className="upload-filename">
        {file.filePath}
      </p>}
    </button>
    {file && (
      <IKImage
        alt={file.filePath}
        path={file.filePath}
        width={500}
        height={500} />
    )}
  </IKContext>
);
};


export default ImageUpload;
