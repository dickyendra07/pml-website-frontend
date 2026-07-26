"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import {
  MediaAssetItem,
  getAdminMediaAssets,
  getAdminToken,
  uploadAdminMediaAsset,
} from "@/lib/admin-api";

type MediaPickerProps = {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
};

function normalizeImageUrl(url: string) {
  if (!url) return "";

  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  return url;
}

export default function MediaPicker({
  value,
  onChange,
  folder = "general",
}: MediaPickerProps) {

  const [open,setOpen] = useState(false);
  const [items,setItems] = useState<MediaAssetItem[]>([]);
  const [selected,setSelected] = useState<MediaAssetItem|null>(null);
  const [search,setSearch] = useState("");
  const [loading,setLoading] = useState(false);
  const [uploading,setUploading] = useState(false);


  const filteredItems = useMemo(()=>{

    return items.filter((item)=>
      item.originalName
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  },[items,search]);



  async function loadMedia(){

    const token = getAdminToken();

    if(!token) return;

    setLoading(true);

    try{

      const data =
        await getAdminMediaAssets(token);

      setItems(
        data.filter(
          item=>item.type==="IMAGE"
        )
      );

    }finally{

      setLoading(false);

    }

  }



  useEffect(()=>{

    if(open){
      void loadMedia();
    }

  },[open]);



  async function handleUpload(
    event:React.ChangeEvent<HTMLInputElement>
  ){

    const file =
      event.target.files?.[0];

    if(!file) return;


    const token =
      getAdminToken();

    if(!token) return;


    setUploading(true);

    try{

      const uploaded =
        await uploadAdminMediaAsset(
          token,
          file,
          folder
        );


      onChange(uploaded.url);

    }finally{

      setUploading(false);

    }

  }



  const imageUrl =
    normalizeImageUrl(value);



  return (

    <div className="
      rounded-[32px]
      border
      border-black/5
      bg-white
      p-6
      shadow-sm
    ">

      <div>

        <p className="
          text-xs
          font-black
          uppercase
          tracking-[0.16em]
          text-[#039147]
        ">
          Facility Image
        </p>


        <p className="
          mt-2
          text-sm
          text-black/40
        ">
          Upload or choose image for this facility.
        </p>

      </div>



      <div className="
        mt-5
        overflow-hidden
        rounded-[28px]
        border
        bg-[#f6faf7]
      ">

        {
          imageUrl ? (

            <Image

              src={imageUrl}

              alt="Facility image"

              width={1200}

              height={700}

              className="
                h-72
                w-full
                object-cover
              "

            />

          ):(

            <div className="
              flex
              h-72
              items-center
              justify-center
              text-sm
              font-bold
              text-black/30
            ">

              No image selected

            </div>

          )
        }


      </div>



      <div className="
        mt-5
        flex
        flex-wrap
        gap-3
      ">


        <label className="
          cursor-pointer
          rounded-full
          bg-[#039147]
          px-6
          py-3
          text-sm
          font-black
          text-white
        ">

          {
            uploading
            ? "Uploading..."
            : "+ Upload Image"
          }


          <input

            type="file"

            accept="image/*"

            className="hidden"

            onChange={handleUpload}

          />

        </label>



        <button

          type="button"

          onClick={()=>setOpen(true)}

          className="
            rounded-full
            border
            px-6
            py-3
            text-sm
            font-black
          "

        >

          Browse Library

        </button>



        {
          value && (

            <button

              type="button"

              onClick={()=>onChange("")}

              className="
                rounded-full
                bg-red-50
                px-6
                py-3
                text-sm
                font-black
                text-red-600
              "

            >

              Remove

            </button>

          )
        }


      </div>



      <div className="
        mt-5
        rounded-2xl
        bg-[#f6faf7]
        p-4
        text-xs
        text-black/50
      ">

        Recommended:
        <b> 1920×1080px</b>
        <br/>
        JPG, PNG, WEBP • Maximum 5MB

      </div>



      {
        open && (

          <div className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            p-5
          ">


            <div className="
              w-full
              max-w-5xl
              rounded-[32px]
              bg-white
              p-6
            ">


              <div className="
                flex
                justify-between
              ">

                <h2 className="
                  text-2xl
                  font-black
                ">
                  Media Library
                </h2>


                <button

                  onClick={()=>setOpen(false)}

                  className="
                    font-black
                  "

                >
                  ✕
                </button>

              </div>



              <input

                value={search}

                onChange={
                  e=>setSearch(e.target.value)
                }

                placeholder="Search image..."

                className="
                  mt-5
                  w-full
                  rounded-xl
                  border
                  p-3
                "

              />



              <div className="
                mt-5
                grid
                grid-cols-4
                gap-4
                max-h-[50vh]
                overflow-y-auto
              ">


              {
                loading ? (

                  <p>
                    Loading...
                  </p>

                ):(
                  filteredItems.map(item=>(

                    <button

                      key={item.id}

                      onClick={()=>{

                        onChange(item.url);
                        setOpen(false);

                      }}

                      className="
                        overflow-hidden
                        rounded-xl
                        border
                      "

                    >

                      <Image

                        src={item.url}

                        alt={item.originalName || "image"}

                        width={300}

                        height={200}

                        className="
                          h-32
                          w-full
                          object-cover
                        "

                      />

                    </button>

                  ))
                )

              }


              </div>


            </div>


          </div>

        )
      }


    </div>

  );

}
