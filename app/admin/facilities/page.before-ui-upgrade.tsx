"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import AdminShell from "@/components/admin/AdminShell";
import AdminState from "@/components/admin/AdminState";
import MediaPicker from "@/components/admin/MediaPicker";

import {
  AdminFacilityItem,
  PageSeoStatus,
  archiveAdminFacility,
  createAdminFacility,
  getAdminFacilities,
  getAdminToken,
  updateAdminFacility,
} from "@/lib/admin-api";


type FacilityForm = {
  id: string;
  key: string;

  titleEn: string;
  titleId: string;

  eyebrowEn: string;
  eyebrowId: string;

  summaryEn: string;
  summaryId: string;

  contentEn: string;
  contentId: string;

  image: string;

  pointsEn: string;
  pointsId: string;

  category: string;
  status: PageSeoStatus;
  sortOrder: string;
};


const emptyForm: FacilityForm = {
  id: "",
  key: "",

  titleEn: "",
  titleId: "",

  eyebrowEn: "",
  eyebrowId: "",

  summaryEn: "",
  summaryId: "",

  contentEn: "",
  contentId: "",

  image: "",

  pointsEn: "",
  pointsId: "",

  category: "clinical",
  status: "DRAFT",
  sortOrder: "0",
};


function mapFacilityToForm(
  item: AdminFacilityItem,
): FacilityForm {
  return {
    id: item.id,
    key: item.key,

    titleEn: item.titleEn || "",
    titleId: item.titleId || "",

    eyebrowEn: item.eyebrowEn || "",
    eyebrowId: item.eyebrowId || "",

    summaryEn: item.summaryEn || "",
    summaryId: item.summaryId || "",

    contentEn: item.contentEn || "",
    contentId: item.contentId || "",

    image: item.image || "",

    pointsEn: item.pointsEn?.join("\n") || "",
    pointsId: item.pointsId?.join("\n") || "",

    category: item.category,
    status: item.status,
    sortOrder: String(item.sortOrder ?? 0),
  };
}


function splitLines(value:string){
  return value
    .split("\n")
    .map((item)=>item.trim())
    .filter(Boolean);
}


export default function AdminFacilitiesPage(){

  const [items,setItems] =
    useState<AdminFacilityItem[]>([]);

  const [form,setForm] =
    useState<FacilityForm>(emptyForm);

  const [status,setStatus] =
    useState<"loading"|"success"|"error">("loading");

  const [message,setMessage] =
    useState("");

  const [saving,setSaving] =
    useState(false);


  const loadFacilities = useCallback(async()=>{

    const token = getAdminToken();

    if(!token) return;


    try{

      const data =
        await getAdminFacilities(token);

      setItems(data);
      setStatus("success");


      if(!form.id && data.length){
        setForm(
          mapFacilityToForm(data[0])
        );
      }

    }catch{

      setStatus("error");

    }

  },[form.id]);


  useEffect(()=>{

    const timer =
      window.setTimeout(()=>{
        void loadFacilities();
      },0);


    return ()=>{
      window.clearTimeout(timer);
    };

  },[loadFacilities]);



  const updateField = (
    key:keyof FacilityForm,
    value:string,
  )=>{

    setForm(current=>({
      ...current,
      [key]:value,
    }));

  };



  const selectFacility = (
    item:AdminFacilityItem,
  )=>{

    setForm(
      mapFacilityToForm(item)
    );

    setMessage("");

  };



  const resetForm = ()=>{

    setForm(emptyForm);
    setMessage("");

  };



  const handleSubmit = async(
    event:FormEvent<HTMLFormElement>,
  )=>{

    event.preventDefault();


    const token =
      getAdminToken();

    if(!token) return;


    const payload = {

      key:form.key,

      titleEn:form.titleEn,
      titleId:form.titleId || undefined,

      eyebrowEn:form.eyebrowEn || undefined,
      eyebrowId:form.eyebrowId || undefined,

      summaryEn:form.summaryEn || undefined,
      summaryId:form.summaryId || undefined,

      contentEn:form.contentEn || undefined,
      contentId:form.contentId || undefined,

      image:form.image || undefined,

      pointsEn:splitLines(form.pointsEn),
      pointsId:splitLines(form.pointsId),

      category:form.category,

      status:form.status,

      sortOrder:Number(form.sortOrder)||0,

    };


    setSaving(true);


    try{

      if(form.id){

        const updated =
          await updateAdminFacility(
            token,
            form.id,
            payload,
          );

        setForm(
          mapFacilityToForm(updated)
        );

        setMessage(
          "Facility updated successfully."
        );


      }else{

        const created =
          await createAdminFacility(
            token,
            payload,
          );

        setForm(
          mapFacilityToForm(created)
        );

        setMessage(
          "Facility created successfully."
        );

      }


      await loadFacilities();


    }finally{

      setSaving(false);

    }

  };



  const handleArchive = async()=>{

    if(!form.id) return;


    const token =
      getAdminToken();

    if(!token) return;


    await archiveAdminFacility(
      token,
      form.id,
    );


    setMessage(
      "Facility archived."
    );


    await loadFacilities();

  };



  return (

    <AdminShell>

      <div className="mb-8 flex justify-between gap-5">

        <div>

          <p className="text-xs font-black uppercase tracking-widest text-[#039147]">
            Facilities CMS
          </p>


          <h1 className="mt-3 text-5xl font-black">
            Manage Facilities
          </h1>


          <p className="mt-3 text-black/50">
            Manage facility information, images, and publishing.
          </p>

        </div>


        <button
          type="button"
          onClick={resetForm}
          className="rounded-full bg-[#039147] px-6 py-3 font-black text-white"
        >
          Create Facility
        </button>

      </div>



      {status==="error" && (
        <AdminState
          title="Unable to load facilities"
          tone="error"
        />
      )}



      {message && (
        <div className="mb-6 rounded-2xl bg-[#eaf8f0] p-4 font-bold text-[#039147]">
          {message}
        </div>
      )}



      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">


        <div className="rounded-3xl bg-white p-5 shadow">

          {items.map(item=>(

            <button
              key={item.id}
              type="button"
              onClick={()=>selectFacility(item)}
              className="mb-3 w-full rounded-2xl border p-4 text-left"
            >

              <p className="font-black">
                {item.titleEn}
              </p>


              <p className="text-xs text-black/40">
                {item.status}
              </p>

            </button>

          ))}

        </div>



        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl bg-white p-8 shadow"
        >


          <input
            value={form.key}
            onChange={(e)=>updateField("key",e.target.value)}
            placeholder="Facility Key"
            className="w-full rounded-xl border p-3"
          />



          <input
            value={form.titleEn}
            onChange={(e)=>updateField("titleEn",e.target.value)}
            placeholder="Title English"
            className="w-full rounded-xl border p-3"
          />



          <input
            value={form.titleId}
            onChange={(e)=>updateField("titleId",e.target.value)}
            placeholder="Title Indonesia"
            className="w-full rounded-xl border p-3"
          />



          <MediaPicker
            value={form.image}
            onChange={(url)=>updateField("image",url)}
            folder="facilities"
          />



          <textarea
            value={form.summaryEn}
            onChange={(e)=>updateField("summaryEn",e.target.value)}
            placeholder="Summary English"
            className="min-h-32 w-full rounded-xl border p-3"
          />



          <textarea
            value={form.contentEn}
            onChange={(e)=>updateField("contentEn",e.target.value)}
            placeholder="Content English"
            className="min-h-52 w-full rounded-xl border p-3"
          />



          <textarea
            value={form.pointsEn}
            onChange={(e)=>updateField("pointsEn",e.target.value)}
            placeholder="Points (one line each)"
            className="min-h-40 w-full rounded-xl border p-3"
          />



          <button
            disabled={saving}
            className="rounded-full bg-[#039147] px-8 py-3 font-black text-white"
          >

            {saving
              ? "Saving..."
              :"Save Facility"}

          </button>



          {form.id && (

            <button
              type="button"
              onClick={handleArchive}
              className="ml-3 rounded-full bg-red-600 px-8 py-3 font-black text-white"
            >
              Archive
            </button>

          )}


        </form>


      </div>


    </AdminShell>

  );

}
