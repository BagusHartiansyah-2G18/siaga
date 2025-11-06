// utils/GeolocationService.ts

export type LocationData = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

export type PermissionState = 'granted' | 'prompt' | 'denied' | 'unsupported' | 'error';

export class GeolocationService {
  private static permissionState: PermissionState = 'prompt';

  // Cek status izin lokasi
  static async checkPermission(): Promise<PermissionState> {
    if (typeof window === 'undefined' || !navigator.permissions) {
      this.permissionState = 'unsupported';
      return this.permissionState;
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      this.permissionState = result.state;

      // Optional: listen perubahan izin
      result.onchange = () => {
        this.permissionState = result.state;
      };

      return this.permissionState;
    } catch {
      this.permissionState = 'error';
      return this.permissionState;
    }
  }

  // Ambil lokasi pengguna
  static async getCurrentLocation(): Promise<LocationData> {
    const permission = await this.checkPermission();

    if (permission === 'denied') {
      throw new Error('❌ Akses lokasi ditolak oleh pengguna.');
    }

    if (permission === 'unsupported') {
      throw new Error('🚫 Browser tidak mendukung Permissions API.');
    }

    return new Promise<LocationData>((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
            });
          },
          (err) => {
            switch (err.code) {
              case err.PERMISSION_DENIED:
                reject(new Error('Pengguna menolak permintaan lokasi.'));
                break;
              case err.POSITION_UNAVAILABLE:
                reject(new Error('Informasi lokasi tidak tersedia.'));
                break;
              case err.TIMEOUT:
                reject(new Error('Permintaan lokasi melebihi batas waktu.'));
                break;
              default:
                reject(new Error('Terjadi kesalahan saat mengambil lokasi.'));
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        
        // reject(new Error('Geolocation tidak didukung di browser ini.'));
      }
    });
  }

  // Ambil status izin terakhir
  static getPermissionState(): PermissionState {
    return this.permissionState;
  }
}