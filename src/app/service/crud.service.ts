import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Utilisateur } from '../Entites/Utilisateur.Entites';
import { Contact } from '../Entites/Contact.Entites';
import  {Observable} from 'rxjs';
import { Annonce } from '../Entites/Annonce.Entites';
import { NgIf } from '@angular/common';
import { Planning } from '../Entites/Planning.Entites';
import { ReservationRq } from '../Entites/ReservationRq.Entites';
import { Evaluation } from '../Entites/Evaluation.Entites';




import { JwtHelperService } from '@auth0/angular-jwt'
import { ReservationFM } from '../Entites/ReservationFM.Entites';
import { ReservationFDM } from '../Entites/ReservationFDM.Entites';
import { ReservationRQFDM } from '../Entites/ReservationRQFDM.Entites';


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
 reserverFromApii(reservation: ReservationFM) {
  return this.http.post<any>(this.apiUrl+"/ReservationFM", reservation);
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
    listReservationByUtilisateur(id:number):Observable<ReservationRq[]>
    {
      return this.http.get<ReservationRq[]>(this.apiUrl + "/Reservation/get-all-by-id-utilisateur/"+id);
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
  listEvaluationByAnnonce(id:number):Observable<Evaluation[]>{const url =`${this.apiUrl+"/Evaluation/get-all-by-id-annonce"}/${id}`
  return this.http.get<Evaluation[]>(url);}
  SupprimerEvaluation(id : number){
    const url =`${this.apiUrl+"/Evaluation"}/${id}`
    return this.http.delete(url)
  }
  getClientByEvaluation(id:number): Observable<Utilisateur>{
    const url =`${this.apiUrl+"/Evaluation/get-client"}/${id}`
    return this.http.get<Utilisateur>(url);
  }
  addEvaluation(evaluation:Evaluation)
   {
    return this.http.post<any>(this.apiUrl+"/Evaluation",evaluation);
   }
   AnnonceByReservation(id_reservation:number):
   Observable<Annonce>{
    const url =`${this.apiUrl+"/Reservation/get-annonce"}/${id_reservation}`
    return this.http.get<Annonce>(url);
  }
  ClientByReservation(id_reservation:number):
  Observable<Utilisateur>{
   const url =`${this.apiUrl+"/Reservation/get-client"}/${id_reservation}`
   return this.http.get<Utilisateur>(url);
 }

 updateReservation(id:number,reservation: ReservationRq) {
  const url = `${this.apiUrl+"/Reservation"}/${id}`
  return this.http.put<any>(url, reservation);
}
listReservationByAnnonceur(id_annonceur:number):
Observable<ReservationRq[]>{
 const url =`${this.apiUrl+"/Reservation/get-all-by-id-annonceur"}/${id_annonceur}`
 return this.http.get<ReservationRq[]>(url);
}
onDeleteReservation(id : number){
  const url =`${this.apiUrl+"/Reservation"}/${id}` 
  return this.http.delete(url)
}
listReservationFDMByUtilisateur(id:number):Observable<ReservationRQFDM[]>
    {
      return this.http.get<ReservationRQFDM[]>(this.apiUrl + "/ReservationFM/get-all-by-id-utilisateur/"+id);
    }
    planificationByReservation(id_reservation:number):
    Observable<Planning>{
     const url =`${this.apiUrl+"/ReservationFM/get-planification"}/${id_reservation}`
     return this.http.get<Planning>(url);
   }
   ClientByReservationFM(id_reservation:number):
  Observable<Utilisateur>{
   const url =`${this.apiUrl+"/ReservationFM/get-client"}/${id_reservation}`
   return this.http.get<Utilisateur>(url);
 }
 updateReservationFM(id:number,reservation: ReservationRQFDM) {
  const url = `${this.apiUrl+"/ReservationFM"}/${id}`
  return this.http.put<any>(url, reservation);
}
onDeleteReservationFDM(id : number){
  const url =`${this.apiUrl+"/ReservationFM"}/${id}` 
  return this.http.delete(url)
}
listeReservationFMByPlanning(id_planning:number):Observable<ReservationFDM[]>
{
  return this.http.get<ReservationFDM[]>(this.apiUrl + "/ReservationFM/get-all-by-id-Planning/"+id_planning);
}

}
