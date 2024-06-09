import { Component } from '@angular/core';
import { Utilisateur } from '../Entites/Utilisateur.Entites';
import { Router } from '@angular/router';
import { CrudService } from '../service/crud.service';
import { ChatService } from '../service/chat.service';
import { Chat } from '../Entites/Chat.Entites';

@Component({
  selector: 'app-header3',
  templateUrl: './header3.component.html',
  styleUrls: ['./header3.component.css']
})
export class Header3Component {
  profil: Utilisateur[];
  p:number=1;
  collection:any[]
  utilisateur: any;
  isProprietaire:boolean
  IsUtilisateurIn:boolean
  userDetails1: Utilisateur;
  isFDM: boolean;
  public alluser: any = [];
  check = sessionStorage.getItem('username');
  chatId: any = 0;
  chatObj: Chat = new Chat();
  public chatData: any = [];

 
  constructor(private service:CrudService,private router:Router, private chatService: ChatService) { }

  ngOnInit(): void {
    this.IsUtilisateurIn=this.service.isUtilisateurInIn();
    this.isProprietaire=this.service.isProprietaire();
    this.userDetails1 = this.service.getUserDetails();
    this.isFDM=this.service.isFDM();


    console.log(this.userDetails1);
    this.service.getUtilisateur().subscribe(utilisateurs => {
      this.profil = utilisateurs.filter(user => user.id === this.userDetails1.id);
    });
    
  
  }
  Deleteutilisateur(utilisateur: Utilisateur){
    if(confirm("Voulez vous supprimer cet utilisateur avec l'ID " + utilisateur.id + " ?")) {
     
      this.service.onDeleteUtilisateur(utilisateur.id).subscribe(() => {
        this.router.navigate(['/profil']).then(() => {
          window.location.reload()
        })
      })
   
    }
  }

  goToChat(emailSecondeUser: any) {
    this.chatService.getChatByFirstUserNameAndSecondUserName(this.userDetails1.email, emailSecondeUser).subscribe(
      (data) => {
        this.chatId = data.chatId;
        localStorage.setItem("chatId", this.chatId);

        localStorage.setItem("gotochat", "false");
        this.router.navigateByUrl('/chat');
      },
      (error) => {
        if (error.status == 404) {
          this.chatObj.firstUserName = this.userDetails1.nom;
          this.chatObj.secondUserName = this.userDetails1.nom;
          this.chatObj.emailfirstUserName= this.userDetails1.email;
          this.chatObj.emailSecondeUser=emailSecondeUser;
          this.chatService.createChatRoom(this.chatObj).subscribe(
            (data) => {
              this.chatData = data;
              this.chatId = this.chatData.chatId;
              localStorage.setItem("chatId", this.chatData.chatId);

              localStorage.setItem("gotochat", "false");
              this.router.navigateByUrl('/chat');
            })
        } else {

        }
      });

  }
 
  logout(): void {
    console.log("logout");
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  modifierProfil(id: number): void {
    this.router.navigate(['/modifierprofil', id]);
  }

}
