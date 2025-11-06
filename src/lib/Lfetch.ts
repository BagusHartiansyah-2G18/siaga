import { __duser } from "@/lib/firebase";
import toast from 'react-hot-toast';

export default class Lfetch {
  private baseUrl: string;
  private xUser: string ="";

  constructor() {
    // this.baseUrl = window.location.origin+"/api/";
     this.baseUrl = (typeof window !== 'undefined' ? window.location.origin + "/api/" 
      : "http://localhost:3000/api/");
    this.start();
  }

  async start(): Promise<void> {
    const user: any = await __duser();
    console.log("User:", user);
    try {
      this.xUser = user.id;
    } catch (error) {
      this.xUser = "";
    }
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'x-user': this.xUser,
      // 'x-user': "this.xUser",
    };
  }

  async get<T>(endpoint: string, xtoast:boolean = true): Promise<T|null> {    
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      const resp = await response.json();
      if(resp['error']!=undefined){
        throw resp['error'];
      }
      return resp;
    } catch (error) {
      if(xtoast){
        toast.error(`${error}`);
      }
      return null; 
    }
  }

  async post<T>(endpoint: string, data: any): Promise<T|null> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      const resp = await response.json();
      if(resp['error']!=undefined){
        throw resp['error'];
      }
      return resp;
    } catch (error) {
      toast.error(`${error}`);
      return null; 
    }
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return await response.json();
  }
}