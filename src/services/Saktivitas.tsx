import { __duser } from "@/lib/firebase";
import Lfetch from "@/lib/Lfetch";

class Saktivitas {
  private static lfetch = new Lfetch();

  static async __allAktif<T>(): Promise<T | null> {
    try {
      const user = __duser();
      if (!user?.id) throw new Error("User tidak valid");

      const response = await Saktivitas.lfetch.get<{ data: T }>(`aktivitas/all?id=${user.id}`, false);
      if (!response || typeof response !== 'object') {
        throw "Gagal ambil data aktivitas";
      }
      const data = response['data'];
      if (!data) throw new Error("Data aktivitas kosong");

      return data as T;
    } catch (error) {
      console.log("__allAktif Error:", `${error}`);
      return null;
    }
  }

   static async __allRekapan<T>(): Promise<T | null> {
    try {
      const user = __duser();
      if (!user?.id) throw new Error("User tidak valid");

      const response = await Saktivitas.lfetch.get<{ data: T }>(`rekapan?id=${user.id}`, false);
      if (!response || typeof response !== 'object') {
        throw "Gagal ambil data aktivitas";
      }
      
      const data = response['data'];
      if (!data) throw new Error("Data aktivitas kosong");

      return data as T;
    } catch (error) {
      console.log("__allAktif Error:", `${error}`);
      return null;
    }
  }
}

export default Saktivitas;