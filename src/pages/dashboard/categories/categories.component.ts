import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {
  // Datos simulados de categorías
  categories = [
    {
      id: 1,
      name: 'Desarrollo Frontend',
      description: 'Discusiones sobre HTML, CSS, JavaScript y frameworks como Angular, React y Vue.',
      icon: 'code',
      color: 'blue',
      topics: 156,
      posts: 2345
    },
    {
      id: 2,
      name: 'Desarrollo Backend',
      description: 'Temas sobre Node.js, Python, Java, PHP y bases de datos.',
      icon: 'server',
      color: 'green',
      topics: 143,
      posts: 1892
    },
    {
      id: 3,
      name: 'DevOps y Cloud',
      description: 'Docker, Kubernetes, AWS, Azure, CI/CD y automatización.',
      icon: 'cloud',
      color: 'purple',
      topics: 87,
      posts: 1104
    },
    {
      id: 4,
      name: 'Inteligencia Artificial',
      description: 'Machine Learning, Deep Learning, NLP y herramientas de IA.',
      icon: 'brain',
      color: 'red',
      topics: 64,
      posts: 823
    },
    {
      id: 5,
      name: 'Comunidad y Networking',
      description: 'Eventos, oportunidades laborales, networking y colaboración.',
      icon: 'users',
      color: 'amber',
      topics: 42,
      posts: 615
    }
  ];
  
  newCategory = {
    name: '',
    description: '',
    icon: 'folder',
    color: 'blue'
  };
  
  isEditMode = false;
  editingCategory: any = null;
  showAddForm = false;
  
  // Opciones de iconos y colores
  availableIcons = ['code', 'server', 'cloud', 'brain', 'users', 'folder', 'message', 'cog', 'book', 'lock'];
  availableColors = ['blue', 'green', 'purple', 'red', 'amber', 'indigo', 'teal', 'gray'];
  
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }
  
  addCategory(): void {
    // En una implementación real, aquí iría la llamada a la API
    const newCategoryWithId = {
      ...this.newCategory,
      id: this.categories.length + 1,
      topics: 0,
      posts: 0
    };
    
    this.categories.push(newCategoryWithId);
    this.showAddForm = false;
    this.resetForm();
  }
  
  startEdit(category: any): void {
    this.isEditMode = true;
    this.editingCategory = {...category};
  }
  
  cancelEdit(): void {
    this.isEditMode = false;
    this.editingCategory = null;
  }
  
  saveEdit(): void {
    // En una implementación real, aquí iría la llamada a la API
    const index = this.categories.findIndex(c => c.id === this.editingCategory.id);
    if (index !== -1) {
      this.categories[index] = {...this.editingCategory};
    }
    this.isEditMode = false;
    this.editingCategory = null;
  }
  
  deleteCategory(id: number): void {
    // En una implementación real, aquí iría la llamada a la API
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.categories = this.categories.filter(c => c.id !== id);
    }
  }
  
  private resetForm(): void {
    this.newCategory = {
      name: '',
      description: '',
      icon: 'folder',
      color: 'blue'
    };
  }
  
  getColorClass(color: string): string {
    const colorMap: {[key: string]: string} = {
      'blue': 'bg-blue-100 text-blue-800 border-blue-200',
      'green': 'bg-green-100 text-green-800 border-green-200',
      'purple': 'bg-purple-100 text-purple-800 border-purple-200',
      'red': 'bg-red-100 text-red-800 border-red-200',
      'amber': 'bg-amber-100 text-amber-800 border-amber-200',
      'indigo': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'teal': 'bg-teal-100 text-teal-800 border-teal-200',
      'gray': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return colorMap[color] || colorMap['blue'];
  }
  
  getIconSvg(icon: string): string {
    // Simplificado para este ejemplo, en una implementación real 
    // podría usar una librería de iconos como FontAwesome o HeroIcons
    return icon;
  }
} 