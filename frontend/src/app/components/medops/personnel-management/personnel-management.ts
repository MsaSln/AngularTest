import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonnelService, PaginatedResponse } from '../../../services/medops/personnel.service';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { Personnel, CreatePersonnelDto, UpdatePersonnelDto } from '../../../models/medops';

interface PersonnelFormData {
  registrationNumber?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  position?: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-personnel-management',
  standalone: true,
  imports: [CommonModule, FormsModule, HasPermissionDirective],
  templateUrl: './personnel-management.html',
  styleUrl: './personnel-management.css',
})
export class PersonnelManagement implements OnInit {
  personnel = signal<Personnel[]>([]);
  showPersonnelForm = signal<boolean>(false);
  editingPersonnel = signal<Personnel | null>(null);
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
  personnelForm = signal<PersonnelFormData>({
    registrationNumber: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    position: ''
  });

  constructor(private personnelService: PersonnelService) {}

  ngOnInit(): void {
    this.loadPersonnel();
  }

  loadPersonnel(): void {
    this.loading.set(true);
    this.personnelService.getAll(
      this.searchTerm() || undefined,
      this.activeFilter(),
      'createdAt',
      'DESC',
      this.currentPage(),
      this.pageSize
    ).subscribe({
      next: (response: PaginatedResponse<Personnel>) => {
        this.personnel.set(response.data);
        this.totalPages.set(response.totalPages);
        this.totalItems.set(response.total);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading personnel:', error);
        alert('Personel listesi yüklenirken hata oluştu');
        this.loading.set(false);
      }
    });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadPersonnel();
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.loadPersonnel();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadPersonnel();
    }
  }

  openPersonnelForm(person?: Personnel): void {
    if (person) {
      this.editingPersonnel.set(person);
      this.personnelForm.set({
        registrationNumber: person.registrationNumber,
        firstName: person.firstName,
        lastName: person.lastName,
        phone: person.phone || '',
        email: person.email || '',
        position: person.position || '',
        isActive: person.isActive
      });
    } else {
      this.editingPersonnel.set(null);
      this.resetPersonnelForm();
    }
    this.showPersonnelForm.set(true);
  }

  closePersonnelForm(): void {
    this.showPersonnelForm.set(false);
    this.editingPersonnel.set(null);
    this.resetPersonnelForm();
  }

  resetPersonnelForm(): void {
    this.personnelForm.set({
      registrationNumber: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      position: ''
    });
  }

  savePersonnel(): void {
    const form = this.personnelForm();

    // Validation
    if (!form.registrationNumber?.trim()) {
      alert('Lütfen sicil numarasını giriniz');
      return;
    }

    if (!form.firstName?.trim()) {
      alert('Lütfen adını giriniz');
      return;
    }

    if (!form.lastName?.trim()) {
      alert('Lütfen soyadını giriniz');
      return;
    }

    const editingPersonnel = this.editingPersonnel();

    if (editingPersonnel) {
      // Update existing personnel
      const updateDto: UpdatePersonnelDto = {
        registrationNumber: form.registrationNumber,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || undefined,
        email: form.email || undefined,
        position: form.position || undefined,
        isActive: form.isActive
      };

      this.personnelService.update(editingPersonnel.id, updateDto).subscribe({
        next: () => {
          this.loadPersonnel();
          this.closePersonnelForm();
        },
        error: (error) => {
          console.error('Error updating personnel:', error);
          alert(error.error?.message || 'Personel güncellenirken hata oluştu');
        }
      });
    } else {
      // Create new personnel
      const createDto: CreatePersonnelDto = {
        registrationNumber: form.registrationNumber!,
        firstName: form.firstName!,
        lastName: form.lastName!,
        phone: form.phone || undefined,
        email: form.email || undefined,
        position: form.position || undefined
      };

      this.personnelService.create(createDto).subscribe({
        next: () => {
          this.loadPersonnel();
          this.closePersonnelForm();
        },
        error: (error) => {
          console.error('Error creating personnel:', error);
          alert(error.error?.message || 'Personel oluşturulurken hata oluştu');
        }
      });
    }
  }

  deletePersonnel(person: Personnel): void {
    if (!confirm(`"${person.firstName} ${person.lastName}" personelini deaktif etmek istediğinizden emin misiniz?`)) {
      return;
    }

    this.personnelService.delete(person.id).subscribe({
      next: () => {
        this.loadPersonnel();
      },
      error: (error) => {
        console.error('Error deleting personnel:', error);
        alert('Personel deaktif edilirken hata oluştu');
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('tr-TR');
  }
}
