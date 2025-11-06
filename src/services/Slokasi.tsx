import { __duser } from "@/lib/firebase";
import Lfetch from "@/lib/Lfetch";

class Slokasi {
  private static lfetch = new Lfetch();

  static async __<T>(params:string): Promise<T | null> {
    try {
      const response = await Slokasi.lfetch.get<{ data: T }>(`aktivitas/location${params}`, false);
      if (!response || typeof response !== 'object') {
        throw "Gagal ambil data lokasi";
      }
      const data = response['data'];
      if (!data) throw new Error("Data aktivitas kosong");

      return data as T;
    } catch (error) { 
      console.log("Slokasi __ Error:", `${error}`);
      return null;
    }
  }
}

export default Slokasi;