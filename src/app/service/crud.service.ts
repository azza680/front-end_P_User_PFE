import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Utilisateur } from '../Entites/Utilisateur.Entites';
import { Contact } from '../Entites/Contact.Entites';
import  {Observable} from 'rxjs';
import { Annonce } from '../Entites/Annonce.Entites';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgIf } from '@angular/common';
import { Planning } from '../Entites/Planning.Entites';
import { ReservationRq } from '../Entites/ReservationRq.Entites';



@Injectable({
  providedIn: 'root'
})
export class CrudService {
  loginUserUrl="http://localhost:8081/api/Utilisateur/Login"
  apiUrl="http://localhost:8081/api"
  private readonly baseUrl = 'http://localhost:8081/api'; // Définissez l'URL de base ici

  constructor(private http:HttpClient) { }
  helper=new JwtHelperService()
  //UtilisateurCrud
  addUtilisateur(utilisateur:Utilisateur)
   {
    return this.http.post<any>(this.apiUrl+"/Utilisateur/register",utilisateur);
   }
  loginUtilisateur(utilisateur:Utilisateur){
    return this.http.post<any>(this.loginUserUrl, utilisateur);
  }
  checkEmail(utilisateur:Utilisateur)
  {
    return this.http.post<any>(this.apiUrl+"/Utilisateur/checkEmail", utilisateur);
  }
  resetPassword(email:string,code:string,password:string)
  {
    return this.http.post<any>(this.apiUrl+"/Utilisateur/resetPassword", {email,code,password});
  }
  getUtilisateurByAnnonce(id:number):Observable<Utilisateur>{const url =`${this.apiUrl+"/Annonce/get-utilisateur"}/${id}`
  return this.http.get<any>(url);}
  listeAnnonceByAnnonceur(id:number):Observable<Utilisateur[]>{const url =`${this.apiUrl+"/Annonce/get-all-by-id-annonceur"}/${id}`
    return this.http.get<Utilisateur[]>(url);}

  //ContactCrud
  addContact(contact:Contact)
   {
    return this.http.post<any>(this.apiUrl+"/Contact",contact);
   }
  onDeleteContact(id : number){
    const url =`${this.apiUrl+"/Contact"}/${id}` 
    return this.http.delete(url)
  }
  getContact(): Observable<Contact[]>{
    return this.http.get<Contact[]>(this.apiUrl + "/Contact");
  }
  isLoggedIn(){

    let token = localStorage.getItem("myToken");

    if (token) {
      return true ;
    } else {
      return false;
    }
  }
  addAnnonce(annonce:Annonce)
   {
    return this.http.post<any>(this.apiUrl+"/Annonce",annonce);
   }
   getAnnonce(): Observable<Annonce[]>{
    return this.http.get<Annonce[]>(this.apiUrl + "/Annonce");
  }
  getAnnonceById(id:number): Observable<Annonce>{
    return this.http.get<Annonce>(this.apiUrl + "/Annonce/"+id);
  }
  onDeleteAnnonce(id : number){
    const url =`${this.apiUrl+"/Annonce"}/${id}` 
    return this.http.delete(url)
  }
  getUtilisateur(): Observable<Utilisateur[]>{
    return this.http.get<Utilisateur[]>(this.apiUrl + "/Utilisateur");
  }
  updateUtilisateur(id:number,utilisateur: Utilisateur) {
    const url = `${this.apiUrl+"/Utilisateur"}/${id}`
    return this.http.put<any>(url, utilisateur);
  }
  findUtilisateurById(id : number): Observable<Utilisateur> {
    const url =`${this.apiUrl+"/Utilisateur"}/${id}`
    return this.http.get<Utilisateur>(url)
  }

  getUserInfo() {
    var token = localStorage.getItem("myToken");
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    const expirationDate = helper.getTokenExpirationDate(token);
    const isExpired = helper.isTokenExpired(token);
    var decoded: any
    return decodedToken?.data
  }
  isUtilisateurInIn(){

    let token = localStorage.getItem("role");
    
    if (token=="Réservateur") {
      return true ;
    } else {
      return false;
    }
  }

  isProprietaire(){

    let token = localStorage.getItem("role");
    
    if (token=="Propriétaire") {
      return true ;
    } else {
      return false;
    }
  }
  isFDM(){

    let token = localStorage.getItem("role");
    
    if (token=="Femme de menage") {
      return true ;
    } else {
      return false;
    }
  }
  
  userDetails(){
    let token:any=localStorage.getItem('role');
    let decodeToken= this.helper.decodeToken(token);
     return decodeToken.data;
   }
   getUserDetails(){
    let token:any=localStorage.getItem('myToken');
    let decodeToken= this.helper.decodeToken(token);
     return decodeToken.data;
   }
   
   onDeleteUtilisateur(id : number){
    const url =`${this.apiUrl+"/Utilisateur"}/${id}`
    return this.http.delete(url)
  }
  reserverFromApi(rq:ReservationRq){
    return this.http.post<any>( "http://localhost:8081/api/Reservation" ,rq );
 }
 addPlanning(planning:Planning)
   {
    return this.http.post<any>(this.apiUrl+"/Planification",planning);
   }
   getPlanning(): Observable<Planning[]>{
    return this.http.get<Planning[]>(this.apiUrl + "/Planification");
  }
  onDeletePlanning(id : number){
    const url =`${this.apiUrl+"/Planification"}/${id}` 
    return this.http.delete(url)
  }
  findPlanningById(id : number): Observable<Planning> {
    const url =`${this.apiUrl+"/Planification"}/${id}`
    return this.http.get<Planning>(url)
  }
  updatePlanning(id:number, planning: Planning) {
    const url = `${this.apiUrl}/Planification/${id}`;
    return this.http.put<any>(url, planning);
  }
  listePlanificationByFdm(id:number):Observable<Planning[]>{
    return this.http.get<Planning[]>(this.apiUrl + "/Planification/get-all-by-id-FDM/"+id);}

    getUtilisateursParRole(role: string): Observable<Utilisateur[]> {
      return this.http.get<Utilisateur[]>(`${this.baseUrl}/Utilisateur/role`, { params: { role } });
    }
  
  getPlanningById(id:number): Observable<Planning>{
    return this.http.get<Annonce>(this.apiUrl + "/Planification/"+id);
  }
  getUtilisateurByPlanning(id:number):Observable<Utilisateur>{const url =`${this.apiUrl+"/Planification/get-utilisateur"}/${id}`
  return this.http.get<any>(url);}

  findAnnonceById(id : number): Observable<Annonce> {
    const url =`${this.apiUrl+"/Annonce"}/${id}`
    return this.http.get<Annonce>(url)
  }
  updateAnnonce(id:number,annonce: Annonce) {
    const url = `${this.apiUrl+"/Annonce"}/${id}`
    return this.http.put<any>(url, annonce);
  }
}
