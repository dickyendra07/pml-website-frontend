"use client";

import Image from "next/image";
import {
  ChangeEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

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
  title?: string;
  description?: string;
};


export default function MediaPicker({
  value,
  onChange,
  folder = "general",
  title = "Image Upload",
  description = "Choose or upload an image",
}: MediaPickerProps) {

  const [open,setOpen] = useState(false);
  const [items,setItems] = useState<MediaAssetItem[]>([]);
  const [selected,setSelected] = useState<MediaAssetItem | null>(null);

  const [search,setSearch] = useState("");

  const [uploading,setUploading] = useState(false);
  const [loading,setLoading] = useState(false);

  const [uploadedName,setUploadedName] = useState("");


  const filteredItems = useMemo(()=>{

    return items.filter((item)=>
      item.originalName
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  },[items,search]);



  const loadMedia = async()=>{

    const token = getAdminToken();

    if(!token) return;


    setLoading(true);


    try{

      const data =
        await getAdminMediaAssets(token);


      setItems(
        data.filter(
          (item)=>item.type==="IMAGE"
        )
      );


    }finally{

      setLoading(false);

    }

  };



  useEffect(()=>{

    if(!open) return;


    const timer =
      window.setTimeout(()=>{
        void loadMedia();
      },0);


    return ()=>{
      window.clearTimeout(timer);
    };


  },[open]);



  const handleUpload = async(
    event:ChangeEvent<HTMLInputElement>,
  )=>{


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
          folder,
        );


      onChange(uploaded.url);

      setUploadedName(
        uploaded.originalName || file.name
      );


      await loadMedia();


    }finally{

      setUploading(false);

    }


  };



  return (

    <>

      <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-sm">


        <div>

          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
            {title}
          </p>


          <p className="mt-2 text-sm text-black/45">
            {description}
          </p>

        </div>



        <div className="mt-6 overflow-hidden rounded-[28px] border border-black/5 bg-[#f6faf7]">


          {value ? (

            <Image

              src={value}

              alt="Selected image"

              width={1200}

              height={700}

              className="h-72 w-full object-cover"

            />


          ) : (

            <div className="flex h-72 flex-col items-center justify-center">


              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf8f0] text-2xl">

                🖼️

              </div>


              <p className="font-black text-black/70">
                No image selected
              </p>


              <p className="mt-1 text-xs text-black/40">
                Upload or choose from media library
              </p>


            </div>

          )}


        </div>



        {uploadedName && (

          <div className="mt-4 rounded-2xl bg-[#eaf8f0] px-4 py-3 text-sm font-bold text-[#039147]">

            ✓ {uploadedName}

          </div>

        )}



        <div className="mt-5 flex flex-wrap gap-3">


          <label className="cursor-pointer rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5">


            {uploading
              ? "Uploading..."
              : "+ Upload New Image"
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

            className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-black text-black/70 transition hover:border-[#039147] hover:text-[#039147]"

          >

            Browse Media Library

          </button>


        </div>



        <div className="mt-5 rounded-2xl bg-[#f6faf7] p-4 text-xs text-black/45">

          Recommended:
          <br />

          <strong className="text-black/60">
            1920 × 1080px
          </strong>
          {" "} • JPG, PNG, WEBP
          {" "} • Maximum 5MB


        </div>


      </div>




      {open && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">


          <div className="max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-[36px] bg-white shadow-2xl">


            <div className="border-b border-black/5 p-6">


              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">

                Media Library

              </p>


              <h2 className="mt-2 text-2xl font-black">

                Select Image

              </h2>


              <input

                value={search}

                onChange={(e)=>setSearch(e.target.value)}

                placeholder="Search uploaded images..."

                className="mt-5 h-12 w-full rounded-2xl border border-black/10 px-4 font-bold outline-none focus:border-[#039147]"

              />


            </div>




            <div className="grid max-h-[55vh] grid-cols-2 gap-4 overflow-y-auto p-6 md:grid-cols-4">


              {loading ? (

                <p className="col-span-full text-center font-bold text-black/40">

                  Loading media...

                </p>


              ) : filteredItems.length === 0 ? (

                <p className="col-span-full text-center font-bold text-black/40">

                  No images found

                </p>


              ) : (

                filteredItems.map((item)=>(


                  <button

                    key={item.id}

                    type="button"

                    onClick={()=>setSelected(item)}

                    className={`overflow-hidden rounded-2xl border-4 transition ${
                      selected?.id === item.id
                      ? "border-[#039147]"
                      : "border-transparent"
                    }`}

                  >


                    <Image

                      src={item.url}

                      alt={item.originalName || "media"}

                      width={300}

                      height={200}

                      className="h-32 w-full object-cover"

                    />


                  </button>


                ))

              )}


            </div>




            <div className="flex justify-end gap-3 border-t border-black/5 p-6">


              <button

                type="button"

                onClick={()=>setOpen(false)}

                className="rounded-full border border-black/10 px-6 py-3 font-black"

              >

                Cancel

              </button>



              <button

                type="button"

                disabled={!selected}

                onClick={()=>{

                  if(selected){

                    onChange(selected.url);

                    setUploadedName(
                      selected.originalName || ""
                    );

                    setOpen(false);

                  }

                }}

                className="rounded-full bg-[#039147] px-6 py-3 font-black text-white disabled:opacity-40"

              >

                Select Image

              </button>


            </div>



          </div>


        </div>

      )}


    </>

  );

}
