import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminUserService } from '../../../../core/services/admin-user.service';
import { ToastService } from '../../../../core/services/toast.service';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule , ReactiveFormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private adminService = inject(AdminUserService);
  private toastService = inject(ToastService);
  selectedUserDetails = signal<any>(null);

  passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  isPasswordVisible = signal(false);
  isEditMode = signal(false);
  selectedUserId = signal<number | null>(null);

  users = signal<any[]>([]);
  totalItems = signal(0);
  totalPages = signal(0);
  
  // Updated params to match your Backend Controller
  params = signal({
    keyword: '',
    page: 0,
    size: 10,
    sortBy: 'id',
    sortDir: 'ASC',
    roleFilter: 'ALL',
    statusFilter: 'ACTIVE_ONLY'
  });

  userForm = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', []], 
    role: ['USER', [Validators.required]]
  });

  togglePasswordVisibility() {
  this.isPasswordVisible.update(v => !v);
  }

  openCreateModal() {
      this.isEditMode.set(false);
      this.isPasswordVisible.set(false);
      this.selectedUserId.set(null);
      
      // Apply required + pattern for creation
      this.userForm.get('password')?.setValidators([
        Validators.required, 
        Validators.pattern(this.passwordPattern)
      ]);
      this.userForm.get('password')?.updateValueAndValidity();
      this.userForm.reset({ role: 'USER' });
  }

  openEditModal(user: any) {
    this.isEditMode.set(true);
    this.selectedUserId.set(user.userId);
    
    this.userForm.get('password')?.setValidators([Validators.pattern(this.passwordPattern)]);
    this.userForm.get('password')?.updateValueAndValidity();
    
    this.userForm.patchValue({
      username: user.username,
      email: user.email,
      role: user.role,
      password: '' 
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getUsers(this.params()).subscribe({
      next: (res) => {
        this.users.set(res.data);
        this.totalItems.set(res.meta.totalItems);
        this.totalPages.set(res.meta.totalPages);
      }
    });
  }

  viewUserDetails(userId: number) {
    this.adminService.getUserById(userId).subscribe({
      next: (res) => {
        this.selectedUserDetails.set(res.data);
      },
      error: (err) => {
        this.toastService.show(err.error?.message || 'Failed to load details', 'error');
      }
    });
  }

  onSearch() {
    this.params.update(p => ({ ...p, page: 0 }));
    this.loadUsers();
  }

  toggleSort() {
    const newDir = this.params().sortDir === 'ASC' ? 'DESC' : 'ASC';
    this.params.update(p => ({ ...p, sortDir: newDir, page: 0 }));
    this.loadUsers();
  }

  changePage(step: number) {
    const next = this.params().page + step;
    if (next >= 0 && next < this.totalPages()) {
      this.params.update(p => ({ ...p, page: next }));
      this.loadUsers();
    }
  }

  saveUser() {
    if (this.userForm.invalid) return;

    const request = this.userForm.value;
    const action$ = this.isEditMode() 
      ? this.adminService.updateUser(this.selectedUserId()!, request)
      : this.adminService.createUser(request);

    action$.subscribe({
      next: (res) => {
        this.toastService.show(res.message, 'success');
        this.loadUsers();
        document.getElementById('closeUserModal')?.click();
      },
      error: (err) => this.toastService.show(err.error?.message || 'Operation failed', 'error')
    });
  }

  onBan(userId: number) {
      const reason = window.prompt('Please enter the reason for banning this user:');
      
      if (reason === null) return; 
      if (!reason.trim()) {
        this.toastService.show('Ban reason is required', 'error');
        return;
      }

      this.adminService.banUser(userId, reason).subscribe({
        next: (res) => {
          this.toastService.show(res.message, 'success');
          this.loadUsers();
        },
        error: (err) => {
          this.toastService.show(err.error?.message || 'Failed to ban user', 'error');
        }
      });
    }

    onReactivate(userId: number) {
      if (confirm('Reactivate this user?')) {

        this.adminService.reactiveUser(userId).subscribe({
          next: (res) => {
            this.toastService.show(res.message , 'success');
            this.loadUsers();
          },
          error: (err) => {
            this.toastService.show(err.error?.message || 'Failed to reactive user' , 'error')
          }
        })

        console.log('Reactivating user:', userId);
      }
    }
}