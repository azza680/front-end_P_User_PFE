import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ContactComponent } from './contact/contact.component';
import { RegisterComponent } from './register/register.component';
import { AnnonceComponent } from './annonce/annonce.component';
import { ProfilComponent } from './profil/profil.component';
import { AboutComponent } from './about/about.component';
import { ChatComponent } from './chat/chat.component';
import { ListeAnnonceComponent } from './liste-annonce/liste-annonce.component';
import { ListeAnnoncesPublicComponent } from './liste-annonces-public/liste-annonces-public.component';
import { VerificationEmailComponent } from './verification-email/verification-email.component';
import { ChangerMotDePasseComponent } from './changer-mot-de-passe/changer-mot-de-passe.component';
import { ModifierprofilComponent } from './modifierprofil/modifierprofil.component';
import { ModifierAnnonceComponent } from './modifier-annonce/modifier-annonce.component';
import { DetailAnnoncePublicComponent } from './detail-annonce-public/detail-annonce-public.component';
import { PaymentComponent } from './payment/payment.component';
import { MesReservationComponent } from './mes-reservation/mes-reservation.component';
import { ReservationMesAnnoncesComponent } from './reservation-mes-annonces/reservation-mes-annonces.component';
import { AuthGuard, AuthGuardR } from './service/auth.service';

const routes: Routes = [  
{path:'',component:HomeComponent},
{path:'login',component:LoginComponent},
{path:'Contact',component:ContactComponent},
{path:'register',component:RegisterComponent},
{path:'annonce',component:AnnonceComponent,canActivate:[AuthGuardR]},
{path:'profil',component:ProfilComponent,canActivate:[AuthGuard]},
{path:'about',component:AboutComponent},
{path:'liste_annonce',component:ListeAnnonceComponent,canActivate:[AuthGuardR]},
{path:"chat",component:ChatComponent,canActivate:[AuthGuard]},
{path:"liste_annonces_public",component:ListeAnnoncesPublicComponent},
{path:"verification_email",component:VerificationEmailComponent},
{path:"reset_mdp",component:ChangerMotDePasseComponent},
{path:"modifierprofil/:id",component:ModifierprofilComponent,canActivate:[AuthGuard]},
{path:"modifierannonce/:id",component:ModifierAnnonceComponent,canActivate:[AuthGuardR]},
{path:"detailannonce/:id",component:DetailAnnoncePublicComponent},
{path:"paiment",component:PaymentComponent,canActivate:[AuthGuard]},
{path:"mes_reservation",component:MesReservationComponent,canActivate:[AuthGuard]},
{path:"reservation_mes_annonces",component:ReservationMesAnnoncesComponent,canActivate:[AuthGuardR]},





];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
