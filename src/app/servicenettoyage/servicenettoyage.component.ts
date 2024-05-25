import { Component, OnInit } from '@angular/core';
import { Utilisateur } from '../Entites/Utilisateur.Entites';
import { CrudService } from '../service/crud.service';
import { Planning } from '../Entites/Planning.Entites';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-servicenettoyage',
  templateUrl: './servicenettoyage.component.html',
  styleUrls: ['./servicenettoyage.component.css']
})
export class ServicenettoyageComponent implements OnInit {
  listeplanning: Planning[] = [];
  listeutilisateur: Utilisateur[] = [];
  user: Utilisateur[] = [];
  selectedUtilisateur: Utilisateur | null = null; // Pour stocker l'utilisateur sélectionné
  searchQuery: string = '';
  activefemme: string = '';

  constructor(private crudService: CrudService) { }

  ngOnInit(): void {
    this.crudService.getPlanning().subscribe((planning: Planning[]) => {
      this.listeplanning = planning;
      const observables = this.listeplanning.map(i => this.crudService.getUtilisateurByPlanning(i.id));
      forkJoin(observables).subscribe(results => {
        this.listeutilisateur = results;
      });
    });

    this.getUtilisateursParRole('Femme de menage');
  }

  getUtilisateursParRole(role: string): void {
    this.crudService.getUtilisateursParRole(role).subscribe(user => this.user = user);
  }

  selectfemme(utilisateur: Utilisateur): void {
    this.selectedUtilisateur = utilisateur; // Définir l'utilisateur sélectionné
  }
  

  setActiveplanning(adresse: string): void {
    this.activefemme = adresse;
  }

  searchPlanning(): void {
    if (this.searchQuery.trim() !== '') {
      this.listeplanning = this.listeplanning.filter(planning =>
        planning.adresse.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.getPlanning(); // Utilisez la méthode appropriée pour récupérer les données (peut-être this.getAnnonces() ?)
    }
  }

  private getPlanning(): void {
    this.crudService.getPlanning().subscribe(plannings => {
      this.listeplanning = plannings;
    });
  }

  get filteredPlanning(): Planning[] {
    let filtered = this.listeplanning;

    if (this.activefemme) {
      filtered = filtered.filter(planning => planning.adresse === this.activefemme);
    }

    return filtered;
  }
}
