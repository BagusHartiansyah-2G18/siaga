"use client";
import { useEffect, useState, useMemo } from "react";
// import DataTable from "@/components/table/CTdata";
import Lfetch from "@/lib/Lfetch";
import toast from 'react-hot-toast';
import { __duser } from "@/lib/firebase";
// import DataTable,{ createTheme } from "react-data-table-component";
import SiagaTable from "@/components/table/CTsiaga";
import { Iuser } from "@/types";




export default function AkunPage() {
  const [usr, _usr] = useState<Iuser>();
  const [dt, setdt] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [showModal, _showModal] = useState(false);
  const lfetch = new Lfetch();
  const [xind, _xind] = useState(-0);

  useEffect(() => {
    const fetchdt = async (id:string) => {
      try {
        const resp = await lfetch.get("aktivitas/all/nouser/berlalu?id="+id) as {data?:[]};
        setdt((resp.data ?? []));
      } catch (error) {
        console.error("Gagal ambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    const fuser=async ()=>{
        const user: any = await __duser();
        _usr(user);
        fetchdt(user.id);
    }
    fuser();
  }, []);  

  const getInformasi = async (ind:number)=>{
    _xind(ind);
    _showModal(true);
    if(dt[ind].dinfo == undefined){
      const dinfo = await lfetch.get("user/"+dt[ind].id) as {user?:any};
      if( dinfo!=null){
        setdt([...dt.map((v,i)=>{
          if(i==ind){
            return {...v, dinfo:dinfo.user}
          }
          return v;
        })])
      }
    }
    _showModal(true);
  }

  const ActionDropdown = ({ row }: { row: any }) => {
    const [open, setOpen] = useState(false); 
    if(usr==undefined ) return "";
    return (
      <div className="flex flex-row gap-2">
        <button
          onClick={() => {
            getInformasi(row.index);
            setOpen(false);
          }}
          className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
        >
        📄 Detail
      </button>
      {/* <a
        href={`${origin}/rute/${row.keys}/${usr.id}`}
        target="_blank"
        className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
        onClick={()=>setOpen(false)}
      >
        📄 Maps
      </a> */}
      </div>
    );
  }; 

  const columns = [
    {
      name: "no",
      selector:(row:any,i:number)  => i+1,
      sortable: true,
      width: "10%",
    },
    {
      name: "Nama",
      selector: (row:any,i:number)  => row.nama,
      sortable: true,
      width: "10%",
    },
    {
      name: "Kategori & Judul",
      selector: (row:any,i:number)  => row.katjud,
      cell: (row:any,i:number)  => (
        <div style={{ whiteSpace: "pre-line" }}>
          {row.katjud}
        </div>
      ),
      width: "20%",
    },{
      name: "Deskripsi",
      selector: (row:any,i:number)  => row.deskripsi,
      sortable: true,
      width: "15%",
    },
    {
      name: "Waktu",
      selector: (row:any,i:number)  => row.waktua,
      cell: (row:any,i:number)  => (
        <div style={{ whiteSpace: "pre-line" }}>
          {row.waktua}
        </div>
      ),width: "15%",
      
    },{
      name: "Petugas",
      selector: (row:any,i:number)  => row.nmPetugas,
      width: "10%",
    },{
      name: "aksi",
      width: "15%",
      cell: (row:any,i:number)  => (
        ActionDropdown({row})
      )
    },
  ];


  if (loading) {
    return <div className="p-6 text-gray-500 text-center">Memuat data pengguna...</div>;
  }

  const Minformasi=({ ind }:{ind:number})=>{
    if(dt[ind].dinfo == undefined){
      return "";
    }
    const { nama,email, role,
      alamat,desa,kecamatan,
      no_hp,no_wa,nik,img
    } = dt[ind].dinfo;
    
    
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex items-center gap-4">
            <img src={img} alt="Foto Hanif" className="w-20 h-20 rounded-full border-4 border-white shadow-md" />
            <div>
              <h1 className="text-2xl font-bold">{nama}</h1>
              <p className="text-sm opacity-80">NIK: {nik}</p>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-sm">
            <div>
              <span className="font-semibold block mb-1">Email</span>
              <p>{email}</p>
            </div>
            <div>
              <span className="font-semibold block mb-1">No HP</span>
              <p>{no_hp}</p>
            </div>
            <div>
              <span className="font-semibold block mb-1">No WA</span>
              <p>{no_wa}</p>
            </div>
            <div>
              <span className="font-semibold block mb-1">Alamat</span>
              <p>{alamat}</p>
            </div>
            <div>
              <span className="font-semibold block mb-1">Desa</span>
              <p>{desa}</p>
            </div>
            <div>
              <span className="font-semibold block mb-1">Kecamatan</span>
              <p>{kecamatan}</p>
            </div>
            <div>
              <span className="font-semibold block mb-1">Role</span>
              <p><em>{role == "" ? "Publik":role}</em></p>
            </div>
          </div>
          <div className="bg-gray-100 px-6 py-4 text-right">
            <button className="bg-gray-600 text-white px-4 py-2 rounded transition"
              onClick={()=>_showModal(false)} 
            >Close</button>
          </div>
        </div> 
      </div>
  </div>)
  }
  return (
    <>
      {/* <DataTable data={dt.map(v=>({...v}))} 
        columns={columns} title="Daftar Aktivitas aktif" />; */}
        <SiagaTable title="Daftar Aktivitas [FINISH]" columns={columns} 
        data={dt.map((v,i)=>({
          keys:v.key,
          ...v,
          katjud: `${v.kategori}\n${v.judul}`, 
          waktua: `${v.datetime}\n${v.datetimeP?v.datetimeP:""}`, 
          index:i,
          key:i}))} 
        />;
      {showModal && xind>=0 && <Minformasi ind={xind}/>}
    </>
  )

}