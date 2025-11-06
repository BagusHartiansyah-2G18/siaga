export interface Iaktivitas {
    aktif?: string;
    datetime?: string;
    deskripsi?: string;
    feedback?: string;
    id: string;
    idFinish?: string; 
    idPetugas?: string;
    judul?: string; 
    lokasiF?:string;

    kategori?: string;
    lokasi?: string; 
    lokasix?: string;
    status?: string; 
    nama?:string;
    
    lokasiy?: string;
    datetimeP?: string; 
    datetimeF?: string; 

    lat?: string;
    lng?: string;
    nmPetugas?:string;
    [key: string]: unknown;

}
export interface Iuser{
    alamat:string;
    createdAt:string;
    desa:string;
    email:string;
    id:string;

    img:string;
    kecamatan:string;
    nama:string;
    nik:string;
    no_hp:string;  

    no_wa:string;
    password:string;
    role:string;  
    aktivitas: Iaktivitas[];
}
export type Ixuser ={ xuser: Iuser | number,err:string };

export type Ixadmin ={ xAdmin: { id: string; role: string; [key: string]: any }|number,err:string };


export interface NotifPayload {
  nmPetugas: string;
  nmUser: string;
  kategori: string;
  judul: string;
  id: string;
  [key: string]: string
}

import type { Duration } from "dayjs/plugin/duration";

export interface AktivitasStat {
  darurat: number;
  laporan: number;
  total: number;
  selesai: number;
}

export interface FeedbackStat {
  satu: number;
  dua: number;
  tiga: number;
  persentase: number;
}

export interface RataRespon {
  proses: Duration[];
  selesai: Duration[];
  Rproses: Duration;
  Rselesai: Duration;
  RprosesString: string;
  RselesaiString: string;
}

export interface DashboardResp {
  user: number;
  aktivitas: AktivitasStat;
  feedback: FeedbackStat;
  rataRespon: RataRespon;
}
