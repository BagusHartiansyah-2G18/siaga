"use client";
import { useEffect, useState, useMemo } from "react";
import DataTable from "@/components/table/CTdata";
import Lfetch from "@/lib/Lfetch";
import toast from 'react-hot-toast';
import { Iuser } from "@/types";


export default function AkunPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, _showModal] = useState(false);
  const lfetch = new Lfetch();
  const [xind, _xind] = useState(-0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const resp = await lfetch.get("user") as { users?: any[] };
        setUsers((resp.users ?? []));
      } catch (error) {
        console.error("Gagal ambil data user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); 

  const updRole = async ({ind,role}:{ind:number,role:string})=>{
    if(await lfetch.post("user/role",{id:users[ind].uid,role}) !=null){
      toast.success(` ${users[ind].email} telah menjadi ${(role == ""? "PUBLIK":role)}`);
    }
  }


  const getInformasi = async (ind: number) => {
    _xind(ind);
    _showModal(true);

    const targetUser = users[ind];
    if (!targetUser.dinfo) {
      const dinfo = await lfetch.get(`user/${targetUser.uid}`);

      if (dinfo && typeof dinfo === "object" && "user" in dinfo) {
        const userDetail = dinfo.user;

        if (typeof userDetail !== "object" || userDetail === null) {
          throw new Error("no User");
        }

        setUsers(
          users.map((v, i) =>
            i === ind ? { ...v, dinfo: userDetail as Iuser } : v
          )
        );
      }
    }

    _showModal(true);
  };

  const ActionDropdown = ({ row }: { row: any }) => {
    const [open, setOpen] = useState(false);

    return (
      <div className="relative inline-block text-left">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
        >
          ⋮
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <button
              onClick={() => {
                getInformasi(row.index);
                setOpen(false);
              }}
              className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
            >
              📄 Detail
            </button>
            <button
              onClick={() =>{
                updRole({ind:row.index,role:""})
                setOpen(false);
              }}
              className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
            >
              is PUBLIK
            </button>
            <button
              onClick={() =>{
                updRole({ind:row.index,role:"titram"})
                setOpen(false);
              }}
              className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
            >
              is TITRAM
            </button>
            <button
              onClick={() =>{
                updRole({ind:row.index,role:"linmas"})
                setOpen(false);
              }}
              className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
            >
              is LINMAS
            </button>
            <button
              onClick={() =>{
                updRole({ind:row.index,role:"admin"})
                setOpen(false);
              }}
              className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
            >
              is ADMIN
            </button>
          </div>
        )}
      </div>
    );
  };

  const columns = [
    { accessorKey: "email", header: "Email" },
    { accessorKey: "uid", header: "UID" },
    { accessorKey: "lastSignInTime", header: "Terakhir Login" },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }: any) => <ActionDropdown row={row}/>
    },
  ];

  if (loading) {
    return <div className="p-6 text-gray-500 text-center">Memuat data pengguna...</div>;
  }

  const Minformasi=({ ind }:{ind:number})=>{
    if(users[ind].dinfo == undefined){
      return "";
    }
    const { nama,email, role,
      alamat,desa,kecamatan,
      no_hp,no_wa,nik,img
    } = users[ind].dinfo;
    
    
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
      <DataTable data={users} columns={columns} title="Daftar Pengguna" />;
      {showModal && xind>=0 && <Minformasi ind={xind}/>}
    </>
  )

}