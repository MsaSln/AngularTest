import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TeamService, PaginatedResponse } from '../../../services/medops/team.service';
import { VehicleService } from '../../../services/medops/vehicle.service';
import { LocationService } from '../../../services/medops/location.service';
import { PersonnelService } from '../../../services/medops/personnel.service';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import {
  Team,
  TeamType,
  TeamDetailType,
  CreateTeamDto,
  UpdateTeamDto,
  CreateTeamDetailDto,
  UpdateTeamDetailDto,
  Vehicle,
  Location,
  Personnel
} from '../../../models/medops';

interface TeamFormData {
  name?: string;
  teamNumber?: string;
  teamTypeId?: number;
  detailTypeId?: number;
  isActive?: boolean;
  teamDetails?: TeamDetailFormData[];
}

interface TeamDetailFormData {
  id?: number;
  locationId?: number;
  vehicleId?: number;
  personnelId?: number;
  displayOrder?: number;
  isActive?: boolean;
}

@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [CommonModule, FormsModule, HasPermissionDirective],
  templateUrl: './team-management.html',
  styleUrl: './team-management.css',
})
export class TeamManagement implements OnInit {
  teams = signal<Team[]>([]);
  teamTypes = signal<TeamType[]>([]);
  teamDetailTypes = signal<TeamDetailType[]>([]);
  locations = signal<Location[]>([]);
  vehicles = signal<Vehicle[]>([]);
  personnel = signal<Personnel[]>([]);

  showTeamForm = signal<boolean>(false);
  editingTeam = signal<Team | null>(null);
  loading = signal<boolean>(false);

  // Pagination
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalItems = signal<number>(0);
  pageSize = 10;

  // Filters
  searchTerm = signal<string>('');
  activeFilter = signal<boolean | undefined>(undefined);

  // Form data
  teamForm = signal<TeamFormData>({
    name: '',
    teamNumber: '',
    teamTypeId: undefined,
    detailTypeId: undefined,
    teamDetails: []
  });

  // Computed property to determine detail type
  selectedDetailType = computed(() => {
    const detailTypeId = this.teamForm().detailTypeId;
    return this.teamDetailTypes().find(dt => dt.id === detailTypeId);
  });

  constructor(
    private teamService: TeamService,
    private vehicleService: VehicleService,
    private locationService: LocationService,
    private personnelService: PersonnelService
  ) {}

  ngOnInit(): void {
    this.loadTeams();
    this.loadReferenceData();
  }

  loadReferenceData(): void {
    // Load team types, detail types, and all entities for team details
    forkJoin({
      teamTypes: this.teamService.getTeamTypes(),
      teamDetailTypes: this.teamService.getTeamDetailTypes(),
      vehicles: this.vehicleService.getAll(undefined, true, 'plate', 'ASC', 1, 1000),
      locations: this.locationService.getAll(undefined, true, 'name', 'ASC', 1, 1000),
      personnel: this.personnelService.getAll(undefined, true, 'firstName', 'ASC', 1, 1000)
    }).subscribe({
      next: (data) => {
        this.teamTypes.set(data.teamTypes);
        this.teamDetailTypes.set(data.teamDetailTypes);
        this.vehicles.set(data.vehicles.data);
        this.locations.set(data.locations.data);
        this.personnel.set(data.personnel.data);
      },
      error: (error) => {
        console.error('Error loading reference data:', error);
        alert('Referans verileri yüklenirken hata oluştu. Lütfen sayfayı yenileyin.');
      }
    });
  }

  loadTeams(): void {
    this.loading.set(true);
    this.teamService.getAll(
      this.searchTerm() || undefined,
      this.activeFilter(),
      undefined,
      undefined,
      'createdAt',
      'DESC',
      this.currentPage(),
      this.pageSize
    ).subscribe({
      next: (response: PaginatedResponse<Team>) => {
        this.teams.set(response.data);
        this.totalPages.set(response.totalPages);
        this.totalItems.set(response.total);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading teams:', error);
        alert('Ekipler yüklenirken hata oluştu');
        this.loading.set(false);
      }
    });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadTeams();
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.loadTeams();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadTeams();
    }
  }

  openTeamForm(team?: Team): void {
    if (team) {
      this.editingTeam.set(team);

      // Load full team details
      this.teamService.getById(team.id).subscribe({
        next: (fullTeam) => {
          const teamDetails: TeamDetailFormData[] = fullTeam.teamDetails?.map(td => ({
            id: td.id,
            locationId: td.locationId,
            vehicleId: td.vehicleId,
            personnelId: td.personnelId,
            displayOrder: td.displayOrder,
            isActive: td.isActive
          })) || [];

          this.teamForm.set({
            name: fullTeam.name,
            teamNumber: fullTeam.teamNumber,
            teamTypeId: fullTeam.teamTypeId,
            detailTypeId: fullTeam.detailTypeId,
            isActive: fullTeam.isActive,
            teamDetails
          });
        },
        error: (error) => {
          console.error('Error loading team details:', error);
          alert('Ekip detayları yüklenirken hata oluştu');
        }
      });
    } else {
      this.editingTeam.set(null);
      this.resetTeamForm();
    }
    this.showTeamForm.set(true);
  }

  closeTeamForm(): void {
    this.showTeamForm.set(false);
    this.editingTeam.set(null);
    this.resetTeamForm();
  }

  resetTeamForm(): void {
    this.teamForm.set({
      name: '',
      teamNumber: '',
      teamTypeId: undefined,
      detailTypeId: undefined,
      teamDetails: []
    });
  }

  addTeamDetail(): void {
    const currentForm = this.teamForm();
    const newDetails = [...(currentForm.teamDetails || [])];
    newDetails.push({
      displayOrder: newDetails.length,
      isActive: true
    });
    this.teamForm.set({ ...currentForm, teamDetails: newDetails });
  }

  removeTeamDetail(index: number): void {
    const currentForm = this.teamForm();
    const newDetails = [...(currentForm.teamDetails || [])];
    newDetails.splice(index, 1);
    this.teamForm.set({ ...currentForm, teamDetails: newDetails });
  }

  saveTeam(): void {
    const form = this.teamForm();

    // Validation
    if (!form.name?.trim()) {
      alert('Lütfen ekip adını giriniz');
      return;
    }

    if (!form.teamNumber?.trim()) {
      alert('Lütfen ekip numarasını giriniz');
      return;
    }

    if (!form.teamTypeId) {
      alert('Lütfen ekip tipini seçiniz');
      return;
    }

    if (!form.detailTypeId) {
      alert('Lütfen detay tipini seçiniz');
      return;
    }

    const editingTeam = this.editingTeam();

    if (editingTeam) {
      // Update existing team
      const updateDto: UpdateTeamDto = {
        name: form.name,
        teamNumber: form.teamNumber,
        teamTypeId: form.teamTypeId,
        detailTypeId: form.detailTypeId,
        isActive: form.isActive,
        teamDetails: form.teamDetails?.map(td => ({
          id: td.id,
          locationId: td.locationId,
          vehicleId: td.vehicleId,
          personnelId: td.personnelId,
          displayOrder: td.displayOrder,
          isActive: td.isActive
        }))
      };

      this.teamService.update(editingTeam.id, updateDto).subscribe({
        next: () => {
          this.loadTeams();
          this.closeTeamForm();
        },
        error: (error) => {
          console.error('Error updating team:', error);
          alert(error.error?.message || 'Ekip güncellenirken hata oluştu');
        }
      });
    } else {
      // Create new team
      const createDto: CreateTeamDto = {
        name: form.name!,
        teamNumber: form.teamNumber!,
        teamTypeId: form.teamTypeId!,
        detailTypeId: form.detailTypeId!,
        teamDetails: form.teamDetails?.map(td => ({
          locationId: td.locationId,
          vehicleId: td.vehicleId,
          personnelId: td.personnelId,
          displayOrder: td.displayOrder
        }))
      };

      this.teamService.create(createDto).subscribe({
        next: () => {
          this.loadTeams();
          this.closeTeamForm();
        },
        error: (error) => {
          console.error('Error creating team:', error);
          alert(error.error?.message || 'Ekip oluşturulurken hata oluştu');
        }
      });
    }
  }

  deleteTeam(team: Team): void {
    if (!confirm(`"${team.name}" ekibini deaktif etmek istediğinizden emin misiniz?`)) {
      return;
    }

    this.teamService.delete(team.id).subscribe({
      next: () => {
        this.loadTeams();
      },
      error: (error) => {
        console.error('Error deleting team:', error);
        alert('Ekip deaktif edilirken hata oluştu');
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('tr-TR');
  }

  getDetailTypeDisplay(detailTypeCode: string): string {
    switch (detailTypeCode) {
      case 'LOC_VEH':
        return 'Lokasyon + Araç';
      case 'VEH':
        return 'Araç';
      case 'PER':
        return 'Personel';
      default:
        return detailTypeCode;
    }
  }
}
