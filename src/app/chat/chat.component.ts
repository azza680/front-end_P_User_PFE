import { ChangeDetectorRef, Component } from '@angular/core';

import { CrudService } from '../service/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { Utilisateur } from '../Entites/Utilisateur.Entites';
import { Message } from '../Entites/Message.Entites';
import { Chat } from '../Entites/Chat.Entites';
import { ChatService } from '../service/chat.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  chatForm: FormGroup;
  chatObj: Chat = new Chat();
  messageObj: Message = new Message();
  // chatId: number = 22;
  public messageList: Message[] = [];
  public chatList: Chat[] = [];
  replymessage: String = "checking";
  public chatData: any;
  msg = "Good work";
  chatId: any ;
  color = "";
  secondUserName = "";
  public alluser: Utilisateur[] = [];
  
  timesRun = 0;
  timesRun2 = 0;
  //userDetails: Utilisateur;
  chat: Chat;
  listeUser: Utilisateur[];
  userDetails: Utilisateur = this.userService.getUserInfo();
  check = this.userDetails.nom;
  firstUserName = this.userDetails.nom;
  senderEmail = this.userDetails.nom;
  senderCheck = this.userDetails.email;
  senderCheckk = this.userDetails.nom;
  profilSeconder: Utilisateur= this.userDetails;
  searchQuery: string = '';
  searchQueryChats: string = '';
  constructor(
    private chatService: ChatService, 
    private router: Router, 
    private userService: CrudService,
    private cdref: ChangeDetectorRef) {

    this.chatForm = new FormGroup({
      replymessage: new FormControl()
    });
    //this.userDetails = this.userService.getUserInfo();


  }
  searchProprietaireParNom(): void {
    if (this.searchQuery.trim() !== '') {
      // Filtre la liste des utilisateurs en fonction du nom saisi
      this.alluser = this.alluser.filter(utilisateur =>
        (utilisateur.nom + ' ' + utilisateur.prenom).toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      // Si la recherche est vide, recharge tous les utilisateurs
      this.reloadAllUsers();
    }
  }
  
  // Assurez-vous d'avoir une méthode pour recharger tous les utilisateurs
  reloadAllUsers(): void {
    // Code pour recharger tous les utilisateurs, par exemple en faisant un appel au service
    this.userService.getUtilisateursParRole("Propriétaire").subscribe((data) => {
      // console.log(data);

      this.alluser = data;
    })
  }
  searchChatParNom(): void {
    if (this.searchQuery.trim() !== '') {
      // Filtre la liste des utilisateurs en fonction du nom saisi
      this.chatList = this.chatList.filter(utilisateur =>
        (utilisateur.firstUserName + ' ' ).toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      // Si la recherche est vide, recharge tous les utilisateurs
      this.reloadAllChats();
    }
  }
  
  // Assurez-vous d'avoir une méthode pour recharger tous les utilisateurs
  reloadAllChats(): void {
    // Code pour recharger tous les utilisateurs, par exemple en faisant un appel au service
    this.chatService.getChatByFirstUserNameOrSecondUserName(this.userDetails.email).subscribe(data => {
      // console.log(data);
      this.chatData = data;
      this.chatList = this.chatData;
      

    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  /* getEmailByUsername( messageList : Message[]) {
    for (let i = 0; i < messageList.length; i++) {
        if (messageList[i].senderEmail !== this.userDetails.email) {
            return messageList[i].senderEmail;
        }
    }
    return null; // Retourne null si aucun message correspondant n'est trouvé
}*/


  ngOnInit(): void {
    
    console.log("hatha check", this.check);
    console.log("hatha firstUserName", this.firstUserName);
    console.log("hatha senderEmail", this.senderEmail);
    console.log("hatha senderCheck", this.senderCheck);
    console.log(" this.profilSeconder ",this.profilSeconder);

    this.listeUser=[this.userDetails];
    this.chatService.getChatByFirstUserNameAndSecondUserName(this.userDetails.email, this.userDetails.email).subscribe(data => {
      this.chatId=data.chatId;
      console.log("this.chatId ", this.chatId );
    });
    setInterval(() => {
      this.chatService.getChatById(this.chatId).subscribe(data => {
        this.chatData = data;
        this.secondUserName = this.chatData.secondUserName;
        this.firstUserName = this.chatData.firstUserName;
        
        
        /*this.userService.getUtilisateursByEmail(this.emailSecondeUser).subscribe(data => {
          //console.log(data);
          this.secondUser = data;
        });*/
        this.chatService.getAllMessagesByChatId(this.chatId).subscribe(data => {
        // console.log(data);
        this.chatData = data;
        this.messageList = this.chatData;

      });
      
      });

    }, 1000);


    this.cdref.detectChanges();


    let getByname = setInterval(() => {
      // For getting all the chat list whose ever is logged in.
      this.chatService.getChatByFirstUserNameOrSecondUserName(this.userDetails.email).subscribe(data => {
        // console.log(data);
        this.chatData = data;
        this.chatList = this.chatData;
        console.log("hathy this.chatList", this.chatList);
        const observables = [];

        for (const i of this.chatList) {
          if (i.emailSecondeUser && i.emailSecondeUser !== this.userDetails.email) {
            observables.push(this.userService.getUtilisateursByEmail(i.emailSecondeUser));
          }else
          {
            observables.push(this.userService.getUtilisateursByEmail(i.emailfirstUserName));

          }
        }

      forkJoin(observables).subscribe(results => {
        this.listeUser = results;
      });
      
      console.log("hathy this.listeUser", this.listeUser);

      });

      this.timesRun2 += 1;
      if (this.timesRun2 === 2) {
        clearInterval(getByname);
      }
    }, 1000);

    let all = setInterval(() => {

      this.userService.getUtilisateursParRole("Propriétaire").subscribe((data) => {
        // console.log(data);

        this.alluser = data;
      })

      this.timesRun += 1;
      if (this.timesRun === 2) {
        clearInterval(all);
      }
    }, 1000);


  }
  invokeStripe() {
    throw new Error('Method not implemented.');
  }

  loadChatByEmail(event: string, event1: string) {
    console.log(event, event1);
    // For removing the previous chatId

    // For checking the chat room by both the emails , if there is present then it will give the chat Id in sessionStorage
    this.chatService.getChatByFirstUserNameAndSecondUserName(event, event1).subscribe(data => {
      console.log(data);
      this.chatData = data;
      this.chatId = this.chatData.chatId;
      console.log(this.chatId);
      


      setInterval(() => {
        this.chatService.getChatById(this.chatId).subscribe(data => {
          this.chatData = data;
          this.secondUserName = this.chatData.secondUserName;
          this.firstUserName = this.chatData.firstUserName;
          if (data.emailSecondeUser!= this.userDetails.email ){
            this.userService.getUtilisateursByEmail(data.emailSecondeUser).subscribe(data => {
              this.profilSeconder = data;
              console.log(" this.profilSeconder f loadChatByEmail",this.profilSeconder);
  
            });
          }else 
          {
            this.userService.getUtilisateursByEmail(data.emailfirstUserName).subscribe(data => {
              this.profilSeconder = data;
              console.log(" this.profilSeconder f loadChatByEmail",this.profilSeconder);
  
            });
          }
          
          this.chatService.getAllMessagesByChatId(this.chatId).subscribe(data => {
            this.chatData = data;
            this.messageList = this.chatData;
          });

        });
      }, 1000)

    });

  }

  sendMessage() {
    console.log(this.chatForm.value);

    // This will call the update chat method when ever user send the message
    this.messageObj.replymessage = this.chatForm.value.replymessage;
    this.messageObj.senderEmail = this.userDetails.email;
    this.chatObj.chatId = this.chatId;
    this.messageObj.chat = this.chatObj;
    this.chatService.addMessageToChatRoom(this.messageObj).subscribe(data => {
      console.log(data);
      this.chatForm.reset();

      // for displaying the messageList by the chatId
      this.chatService.getAllMessagesByChatId(this.chatId).subscribe(data => {
        console.log(data);
        this.chatData = data;
        // console.log(this.chatData.messageList);console.log(JSON.stringify(this.chatData.messageList));
        this.messageList = this.chatData.messageList;
        this.secondUserName = this.chatData.secondUserName;
        this.firstUserName = this.chatData.firstUserName;
        

      })
    });


  }

  routeX() {
    // this.router.navigateByUrl('/navbar/recommendation-service');
    sessionStorage.clear();
    // window.location.reload();
    this.router.navigateByUrl('');
  }

  routeHome() {
    this.router.navigateByUrl('');
  }


  goToChat(email: string, username : string  ) {
    this.chatService.getChatByFirstUserNameAndSecondUserName(email  , this.userDetails.email).subscribe(
      (data) => {
        this.chatId = data.chatId;
        this.userService.getUtilisateursByEmail(data.emailSecondeUser).subscribe(data => {
          this.profilSeconder = data;
        });
      },
      (error) => {
        if (error.status == 404) {
          this.chatObj.firstUserName = this.userDetails.nom;
          this.chatObj.secondUserName = username;
          this.chatObj.emailfirstUserName = this.userDetails.email;
          this.chatObj.emailSecondeUser= email

          this.chatService.createChatRoom(this.chatObj).subscribe(
            (data) => {
              this.chatData = data;
              this.chatId = this.chatData.chatId;
              if (this.chatData.emailSecondeUser!= this.userDetails.email ){
                this.userService.getUtilisateursByEmail(this.chatData.emailSecondeUser).subscribe(data => {
                  this.profilSeconder = data;
                  console.log(" this.profilSeconder f loadChatByEmail",this.profilSeconder);
      
                });
              }else 
              {
                this.userService.getUtilisateursByEmail(this.chatData.emailfirstUserName).subscribe(data => {
                  this.profilSeconder = data;
                  console.log(" this.profilSeconder f loadChatByEmail",this.profilSeconder);
      
                });
              }
              this.userService.getUtilisateursByEmail(this.chatData.emailSecondeUser).subscribe(data => {
                this.profilSeconder = data;
                console.log(" this.profilSeconder f goToChat",this.profilSeconder);
              });
            })
        } else {

        }
      });

  }
}
